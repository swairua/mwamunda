#!/usr/bin/env python3
"""Match WhatsApp candidate images against the images used on the site.

For a given site image and a candidate, slide a window with the site image's
aspect ratio across the candidate at several scales and report the lowest
MSE.  A low score means "same photo, different crop/scale", which is what we
need in order to safely swap in a higher-resolution look-alike.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "image-backups"  # pristine originals
CAND = ROOT / "whatsapp"
OUT = 48  # comparison resolution


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def best_match(site_path: Path, cand_path: Path) -> tuple[float, tuple[int, int, int, int]]:
    with Image.open(site_path) as im:
        sw, sh = im.size
        ref = np.asarray(
            im.convert("RGB").resize((OUT, OUT), Image.Resampling.LANCZOS),
            dtype=np.float32,
        )
    ar = sw / sh

    with Image.open(cand_path) as im:
        cand = im.convert("RGB")

    best_mse, best_box = float("inf"), (0, 0, 0, 0)
    # Candidate widths to try, from "roughly site size" up to full size.
    for width in sorted({cand.width, int(cand.width * 0.75), int(cand.width * 0.5)}):
        height = int(round(width / ar))
        if height > cand.height or width > cand.width or width < OUT:
            continue
        step_x = max(1, width // 6)
        step_y = max(1, height // 6)
        for x in range(0, cand.width - width + 1, step_x):
            for y in range(0, cand.height - height + 1, step_y):
                crop = cand.crop((x, y, x + width, y + height)).resize(
                    (OUT, OUT), Image.Resampling.LANCZOS
                )
                arr = np.asarray(crop, dtype=np.float32)
                mse = float(((arr - ref) ** 2).mean())
                if mse < best_mse:
                    best_mse, best_box = mse, (x, y, width, height)

    return best_mse, best_box


def main() -> None:
    # Site image -> candidate files worth testing (from visual inspection).
    tests: dict[str, list[str]] = {
        "success-stories/mariam-chimako.jpg": [
            "WhatsApp Image 2026-11-25 at 10.48.23 AM.jpeg",
            "WhatsApp Image 2026-11-25 at 10.48.23 AM (1).jpeg",
            "WhatsApp Image 2026-11-25 at 10.52.17 AM.jpeg",
            "WhatsApp Image 2026-11-25 at 10.55.40 AM.jpeg",
        ],
        "success-stories/sofia-atieno.jpg": [
            "WhatsApp Image 2026-11-25 at 10.55.24 AM.jpeg",
        ],
        "team/staffatwork.jpeg": [
            "WhatsApp Image 2026-11-25 at 10.58.55 AM.jpeg",
            "WhatsApp Image 2026-11-25 at 11.00.48 AM.jpeg",
        ],
        "team/neema.jpeg": [
            "WhatsApp Image 2026-11-25 at 10.57.37 AM.jpeg",
        ],
        "team/teamimage.jpeg": [
            "WhatsApp Image 2026-11-25 at 10.45.59 AM.jpeg",
            "WhatsApp Image 2026-11-25 at 10.47.51 AM.jpeg",
        ],
    }

    print(f"{'site image':38} {'candidate':34} {'MSE':>8}  box")
    print("-" * 110)
    for rel, cands in tests.items():
        site_path = SITE / rel
        if not site_path.exists():
            print(f"{rel:38} MISSING ORIGINAL")
            continue
        for cand in cands:
            cand_path = CAND / cand
            if not cand_path.exists():
                print(f"{rel:38} {cand:34} MISSING")
                continue
            mse, box = best_match(site_path, cand_path)
            same = " <== identical file" if digest(site_path) == digest(cand_path) else ""
            short = cand.replace("WhatsApp Image 2026-11-25 at ", "")
            print(f"{rel:38} {short:34} {mse:8.1f}  {box}{same}")


if __name__ == "__main__":
    main()
