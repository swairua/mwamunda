#!/usr/bin/env python3
"""Swap in higher-resolution look-alikes from the whatsapp/ folder.

Only images that were objectively matched to a site image are swapped (see
scripts/match_images.py and scripts/compare_quality.py).  Images with no
confident look-alike are left untouched.

For each swap:
  * the current site copy is parked in image-backups/superseded/
  * the pristine candidate becomes the new image-backups/<rel> entry, so the
    enhancement pipeline (which always reads from the backup) works on it
  * the candidate is copied into public/ as the live site image

Re-running is safe: superseded copies are only moved once.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BACKUP = ROOT / "image-backups"
SUPERSEDED = BACKUP / "superseded"
WHATSAPP = ROOT / "whatsapp"

# site path (under public/)  ->  verified whatsapp source
SWAPS: dict[str, str] = {
    "success-stories/sofia-atieno.jpg": "WhatsApp Image 2026-11-25 at 10.55.24 AM.jpeg",
    "success-stories/mariam-chimako.jpg": "WhatsApp Image 2026-11-25 at 10.55.40 AM.jpeg",
    "team/neema.jpeg": "WhatsApp Image 2026-11-25 at 10.57.37 AM.jpeg",
    "team/staffatwork.jpeg": "WhatsApp Image 2026-11-25 at 10.58.55 AM.jpeg",
}

# Deliberately NOT swapped, with the reason:
NOT_SWAPPED = {
    "team/teamimage.jpeg": "whatsapp source is a byte-identical copy",
    "team/karisa-poster.jpg": "no look-alike in whatsapp/",
    "team/elias-karisa-baya.jpg": "no look-alike in whatsapp/",
}


def size(path: Path) -> str:
    with Image.open(path) as im:
        return f"{im.width}x{im.height}"


def main() -> None:
    print(f"{'site image':38} {'before':>12} {'after':>12}  source")
    print("-" * 100)

    for rel, src_name in SWAPS.items():
        site = PUBLIC / rel
        backup = BACKUP / rel
        src = WHATSAPP / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        if not backup.exists():
            raise FileNotFoundError(f"no pristine backup for {rel}")

        before = size(site)

        # Park the outgoing site copy (once).
        old = SUPERSEDED / rel
        if not old.exists():
            old.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(backup, old)

        # The candidate is now the pristine original for this site image.
        shutil.copy2(src, backup)
        shutil.copy2(src, site)

        print(f"{rel:38} {before:>12} {size(site):>12}  {src_name}")

    print("\nNot swapped:")
    for rel, why in NOT_SWAPPED.items():
        print(f"  {rel:38} {why}")


if __name__ == "__main__":
    main()
