#!/usr/bin/env python3
"""Place the remaining whatsapp/ images onto the site.

Of the 11 images in whatsapp/, 4 were already matched and swapped in by
scripts/swap_images.py.  Of the 7 left, two are exact duplicates and cannot
be placed without showing the same photo twice:

  10.45.59 AM.jpeg    byte-identical to public/team/teamimage.jpeg (on site)
  10.48.23 AM (1)     byte-identical to 10.48.23 AM.jpeg

The 5 genuinely distinct photos are copied into public/team/ under descriptive
names, and seeded into image-backups/ so enhance_images.py (which always
reads from the backup) cleans and sharpens them like every other site image.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WHATSAPP = ROOT / "whatsapp"
PUBLIC = ROOT / "public" / "team"
BACKUP = ROOT / "image-backups" / "team"

# source file -> descriptive name under public/team/
PLACEMENTS: dict[str, str] = {
    "WhatsApp Image 2026-11-25 at 10.47.51 AM.jpeg": "gallery-team-bench.jpg",
    "WhatsApp Image 2026-11-25 at 10.48.23 AM.jpeg": "gallery-office-desk.jpg",
    "WhatsApp Image 2026-11-25 at 10.52.17 AM.jpeg": "gallery-desk-portrait.jpg",
    "WhatsApp Image 2026-11-25 at 11.00.48 AM.jpeg": "gallery-brand-banner.jpg",
    "WhatsApp Image 2026-11-25 at 11.03.11 AM.jpeg": "gallery-field-visit.jpg",
}

SKIPPED = {
    "WhatsApp Image 2026-11-25 at 10.45.59 AM.jpeg": "duplicate of team/teamimage.jpeg already on site",
    "WhatsApp Image 2026-11-25 at 10.48.23 AM (1).jpeg": "byte-identical to 10.48.23 AM.jpeg",
}


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    BACKUP.mkdir(parents=True, exist_ok=True)

    print(f"{'source':40} {'-> public/team/':32} size")
    print("-" * 90)
    for src_name, dest_name in PLACEMENTS.items():
        src = WHATSAPP / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        dest, backup = PUBLIC / dest_name, BACKUP / dest_name
        shutil.copy2(src, dest)
        shutil.copy2(src, backup)  # pristine original for the enhancer
        with Image.open(dest) as im:
            print(f"{src_name[15:]:40} {dest_name:32} {im.width}x{im.height}")

    print("\nSkipped (exact duplicates):")
    for name, why in SKIPPED.items():
        print(f"  {name[15:]:40} {why}")


if __name__ == "__main__":
    main()
