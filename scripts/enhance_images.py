#!/usr/bin/env python3
"""Clean and sharpen the images used by the Mwamunda site.

For every image referenced from client/ this script applies a per-image
pipeline:

    1. EXIF orientation is applied and metadata is dropped ("clean")
    2. Edge-preserving denoise removes JPEG blocking / mosquito noise
    3. Tone and colour correction (contrast, saturation, brightness)
    4. Optional LANCZOS upscale for images that are too small for their slot
    5. Two-stage sharpening: "clarity" (large radius, local contrast) and
       "acutance" (small radius, edge detail)

Originals are copied to image-backups/ the first time the script runs, so the
operation is fully reversible and repeated runs never clobber the backups.

Usage:
    python scripts/enhance_images.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BACKUP = ROOT / "image-backups"

# ---------------------------------------------------------------------------
# Tuning
# ---------------------------------------------------------------------------
#
# `target_w`  : output width in px (None keeps the original width)
# `denoise`   : (sigma_s, sigma_r, amount) - spatial/range sigma + blend amount
# `clarity`   : (radius, percent) large-radius unsharp -> midtone local contrast
# `acutance`  : (radius, percent) small-radius unsharp -> crisp edge detail
# `settle`    : (radius, percent) unsharp applied right after an upscale
#
# Every source below is now the high-resolution original (see swap_images.py),
# so nothing is upscaled any more.  Tuning targets, verified by
# scripts/quality_report.py: sharpness up ~1.5-3x, ringing and clipping
# within a few points of the original.  The browser downscales these into
# their slots, which hides residual softness far better than aggressive
# unsharp hides anything but artifacts.

CONFIG: list[dict] = [
    # --- Success stories (496x320 object-cover slot) ---
    {
        "rel": "success-stories/sofia-atieno.jpg",
        "target_w": None,
        "denoise": (2.0, 0.05, 0.40),
        "contrast": 1.02,
        "color": 1.00,
        "brightness": 1.00,
        "clarity": (8.0, 15),
        "acutance": (1.2, 50),
    },
    {
        "rel": "success-stories/mariam-chimako.jpg",
        "target_w": None,
        "denoise": (2.0, 0.05, 0.50),
        "contrast": 1.04,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 20),
        "acutance": (1.3, 85),
    },
    # --- Team / About page ---
    {
        "rel": "team/karisa-poster.jpg",
        "target_w": None,
        "text_heavy": True,
        "quality": 90,
        "denoise": (2.0, 0.04, 0.55),
        "contrast": 1.00,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 18),
        "acutance": (1.2, 85),
    },
    {
        "rel": "team/elias-karisa-baya.jpg",
        "target_w": None,
        "denoise": (2.0, 0.045, 0.55),
        "contrast": 1.05,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 25),
        "acutance": (1.3, 100),
    },
    {
        "rel": "team/neema.jpeg",
        "target_w": None,
        "denoise": (2.0, 0.045, 0.55),
        "contrast": 1.00,
        "color": 1.04,
        "brightness": 1.00,
        "clarity": (8.0, 18),
        "acutance": (1.3, 95),
    },
    {
        "rel": "team/staffatwork.jpeg",
        "target_w": None,
        "denoise": (2.5, 0.05, 0.45),
        "contrast": 1.05,
        "color": 1.04,
        "brightness": 1.01,
        "clarity": (10.0, 10),
        "acutance": (1.1, 40),
    },
    {
        "rel": "team/teamimage.jpeg",
        "target_w": None,
        "denoise": (2.0, 0.04, 0.45),
        "contrast": 1.02,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 25),
        "acutance": (1.3, 95),
    },
    # --- Team gallery (see place_remaining.py) ---
    {
        "rel": "team/gallery-team-bench.jpg",
        "target_w": None,
        "denoise": (2.5, 0.05, 0.45),
        "contrast": 1.05,
        "color": 1.04,
        "brightness": 1.01,
        "clarity": (10.0, 15),
        "acutance": (1.2, 55),
    },
    {
        "rel": "team/gallery-office-desk.jpg",
        "target_w": None,
        "denoise": (2.0, 0.045, 0.50),
        "contrast": 1.04,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 20),
        "acutance": (1.3, 85),
    },
    {
        "rel": "team/gallery-desk-portrait.jpg",
        "target_w": None,
        "denoise": (2.0, 0.045, 0.50),
        "contrast": 1.04,
        "color": 1.03,
        "brightness": 1.00,
        "clarity": (8.0, 20),
        "acutance": (1.3, 85),
    },
    {
        "rel": "team/gallery-brand-banner.jpg",
        "target_w": None,
        "denoise": (2.5, 0.05, 0.45),
        "contrast": 1.00,
        "color": 1.04,
        "brightness": 1.00,
        "clarity": (8.0, 10),
        "acutance": (1.1, 40),
    },
    {
        "rel": "team/gallery-field-visit.jpg",
        "target_w": None,
        "denoise": (2.5, 0.05, 0.55),
        "contrast": 1.03,
        "color": 1.04,
        "brightness": 1.01,
        "clarity": (8.0, 4),
        "acutance": (1.0, 15),
    },
]


def denoise(img: Image.Image, sigma_s: float, sigma_r: float, amount: float) -> Image.Image:
    """Edge-preserving denoise in the luminance domain.

    A 5x5 joint-bilateral filter: neighbouring pixels contribute according to
    how close they are in space *and* how similar they are in luminance, so
    flat areas and JPEG blocks get smoothed while real edges stay put.
    Colour is preserved by rescaling each channel with the luminance ratio.
    """
    if amount <= 0:
        return img

    radius = 2
    arr = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    y = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    h, w = y.shape
    padded = np.pad(y, radius, mode="edge")

    num = np.zeros_like(y)
    den = np.zeros_like(y)
    inv_s = 1.0 / (2.0 * sigma_s * sigma_s)
    inv_r = 1.0 / (2.0 * sigma_r * sigma_r)

    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            window = padded[radius + dy : radius + dy + h, radius + dx : radius + dx + w]
            spatial = np.exp(-(dy * dy + dx * dx) * inv_s)
            range_w = np.exp(-((window - y) ** 2) * inv_r)
            weight = spatial * range_w
            num += weight * window
            den += weight

    y_clean = num / np.maximum(den, 1e-8)
    y_new = y * (1.0 - amount) + y_clean * amount

    ratio = np.clip(np.where(y > 1e-6, y_new / np.maximum(y, 1e-6), 1.0), 0.4, 2.5)
    out = np.clip(arr * ratio[..., None], 0.0, 1.0)
    return Image.fromarray((out * 255.0 + 0.5).astype(np.uint8))


def unsharp(img: Image.Image, radius: float, percent: int, threshold: int = 2) -> Image.Image:
    return img.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))


def enhance(cfg: dict) -> tuple[Path, Path, str]:
    src = PUBLIC / cfg["rel"]
    if not src.exists():
        raise FileNotFoundError(f"missing source image: {src}")

    # 1. Back up the pristine original once - never overwrite a backup.
    backup = BACKUP / cfg["rel"]
    if not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, backup)

    # 2. Orientation applied, metadata dropped.
    with Image.open(backup) as im:
        img = ImageOps.exif_transpose(im).convert("RGB")

    before = img.size

    # 3. Denoise before any resizing so noise is not magnified.
    if cfg.get("denoise"):
        img = denoise(img, *cfg["denoise"])

    # 4. Tone / colour.
    img = ImageEnhance.Contrast(img).enhance(cfg.get("contrast", 1.0))
    img = ImageEnhance.Color(img).enhance(cfg.get("color", 1.0))
    img = ImageEnhance.Brightness(img).enhance(cfg.get("brightness", 1.0))

    # 5. Upscale if the image is undersized for its display slot.
    target_w = cfg.get("target_w")
    if target_w and img.width < target_w:
        target_h = round(img.height * target_w / img.width)
        img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        # Recover a little of the acutance LANCZOS loses on a hard step.
        settle = cfg.get("settle", (1.0, 60))
        img = unsharp(img, *settle, threshold=2)

    # 6. Sharpen: local contrast first, then edge detail.
    if cfg.get("clarity"):
        img = unsharp(img, *cfg["clarity"], threshold=2)
    if cfg.get("acutance"):
        img = unsharp(img, *cfg["acutance"], threshold=2)

    # 7. Write back in place, progressive + optimised, no EXIF baggage.
    suffix = src.suffix.lower()
    if suffix in {".jpg", ".jpeg"}:
        # 4:4:4 only where crisp text matters (posters); on photographs chroma
        # subsampling is imperceptible and roughly halves the file weight.
        subsampling = 0 if cfg.get("text_heavy") else 2
        img.save(
            src,
            format="JPEG",
            quality=cfg.get("quality", 85),
            optimize=True,
            progressive=True,
            subsampling=subsampling,
        )
    else:
        img.save(src, format="PNG", optimize=True)

    after = img.size
    delta = f"{before[0]}x{before[1]} -> {after[0]}x{after[1]}" if before != after else f"{after[0]}x{after[1]}"
    return src, backup, delta


def main() -> None:
    print(f"{'image':42} {'size':20} {'backup'}")
    print("-" * 90)
    for cfg in CONFIG:
        src, backup, delta = enhance(cfg)
        print(f"{cfg['rel']:42} {delta:20} {backup.relative_to(ROOT)}")
    print("\nDone.")


if __name__ == "__main__":
    main()
