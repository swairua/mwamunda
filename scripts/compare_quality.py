#!/usr/bin/env python3
"""Decide whether a WhatsApp candidate is genuinely better than the site copy.

Reports, for each site/candidate pair:
  * native size + file size
  * MSE after normalising both to the same size (same photo?)
  * Laplacian variance (fine-detail / sharpness energy, size-normalised)
  * whether the site copy looks like an upscale of the candidate

A candidate wins when it carries at least as much real detail as the site
copy - i.e. it is the master rather than a re-save of it.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "image-backups"
CAND = ROOT / "whatsapp"

PAIRS = [
    ("team/staffatwork.jpeg", "WhatsApp Image 2026-11-25 at 10.58.55 AM.jpeg"),
    ("team/neema.jpeg", "WhatsApp Image 2026-11-25 at 10.57.37 AM.jpeg"),
    ("success-stories/sofia-atieno.jpg", "WhatsApp Image 2026-11-25 at 10.55.24 AM.jpeg"),
    ("success-stories/mariam-chimako.jpg", "WhatsApp Image 2026-11-25 at 10.55.40 AM.jpeg"),
    ("team/teamimage.jpeg", "WhatsApp Image 2026-11-25 at 10.45.59 AM.jpeg"),
]


def laplacian_var(img: Image.Image, scale_w: int = 800) -> float:
    """Sharpness energy: variance of a Laplacian response, size-normalised."""
    if img.width != scale_w:
        h = round(img.height * scale_w / img.width)
        img = img.resize((scale_w, h), Image.Resampling.LANCZOS)
    g = np.asarray(img.convert("L"), dtype=np.float32)
    lap = (
        4.0 * g[1:-1, 1:-1]
        - g[:-2, 1:-1]
        - g[2:, 1:-1]
        - g[1:-1, :-2]
        - g[1:-1, 2:]
    )
    return float(lap.var())


def normalised_mse(a: Image.Image, b: Image.Image) -> float:
    """MSE after fitting b into a's frame at a's resolution (aspect-aware)."""
    a = a.convert("RGB")
    b = b.convert("RGB")
    # scale b to cover a's frame, centre-crop
    scale = max(a.width / b.width, a.height / b.height)
    b = b.resize((round(b.width * scale), round(b.height * scale)), Image.Resampling.LANCZOS)
    left = (b.width - a.width) // 2
    top = (b.height - a.height) // 2
    b = b.crop((left, top, left + a.width, top + a.height))
    x = np.asarray(a, dtype=np.float32)
    y = np.asarray(b, dtype=np.float32)
    return float(((x - y) ** 2).mean())


def main() -> None:
    hdr = f"{'pair':34} {'site':>13} {'candidate':>13} {'MSE':>7} {'sharp site':>11} {'sharp cand':>11}  verdict"
    print(hdr)
    print("-" * len(hdr))
    for rel, cand in PAIRS:
        sp, cp = SITE / rel, CAND / cand
        with Image.open(sp) as im:
            s = im.convert("RGB")
        with Image.open(cp) as im:
            c = im.convert("RGB")

        mse = normalised_mse(s, c)
        s_sharp = laplacian_var(s)
        c_sharp = laplacian_var(c)
        gain = c.width * c.height - s.width * s.height
        detail = c_sharp / s_sharp

        if mse > 4000:
            verdict = "different photo - no swap"
        elif gain > 0 and detail >= 0.95:
            verdict = "SWAP (more pixels, >= detail)"
        elif gain <= 0 and detail > 1.15:
            verdict = "SWAP (better detail, fewer px)"
        elif gain <= 0:
            verdict = "keep site copy (larger + sharp)"
        else:
            verdict = "marginal - inspect"

        name = rel.split("/")[-1][:32]
        print(
            f"{name:34} {s.width}x{s.height:>5} {c.width}x{c.height:>5} "
            f"{mse:7.1f} {s_sharp:11.1f} {c_sharp:11.1f}  {verdict}"
        )


if __name__ == "__main__":
    main()
