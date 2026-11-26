#!/usr/bin/env python3
"""Labeled contact sheet for a folder of images.

Each cell burns its filename into the image, so a read is self-verifying:
if the labels are visible the correct file was returned.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CELL_W, CELL_H, LABEL_H, COLS = 560, 460, 34, 2
PAD = 10


def font(size: int):
    for name in ("arialbd.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size=size)


def build(sources: list[Path], out: Path) -> None:
    rows = (len(sources) + COLS - 1) // COLS
    sheet = Image.new(
        "RGB",
        (COLS * CELL_W + (COLS + 1) * PAD, rows * (CELL_H + LABEL_H) + (rows + 1) * PAD),
        (245, 245, 247),
    )
    draw = ImageDraw.Draw(sheet)
    label_font = font(19)
    sub_font = font(16)

    for i, path in enumerate(sources):
        col, row = i % COLS, i // COLS
        x = PAD + col * (CELL_W + PAD)
        y = PAD + row * (CELL_H + LABEL_H + PAD)
        with Image.open(path) as im:
            im = im.convert("RGB")
            dims = f"{im.width}x{im.height}"
            im.thumbnail((CELL_W, CELL_H), Image.Resampling.LANCZOS)
            sheet.paste(im, (x + (CELL_W - im.width) // 2, y + LABEL_H + (CELL_H - im.height) // 2))
        draw.rectangle([x, y, x + CELL_W, y + CELL_H + LABEL_H], outline=(190, 190, 196))
        draw.text((x + 6, y + 6), path.name.replace("WhatsApp Image 2026-11-25 at ", ""),
                  fill=(15, 15, 15), font=label_font)
        draw.text((x + 6, y + LABEL_H + CELL_H - 22), dims, fill=(90, 90, 95), font=sub_font)

    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=90, optimize=True, progressive=True)
    print(f"{out}  ({sheet.width}x{sheet.height})")


if __name__ == "__main__":
    folder = ROOT / (sys.argv[1] if len(sys.argv) > 1 else "whatsapp")
    out = ROOT / (sys.argv[2] if len(sys.argv) > 2 else "image-backups/_remaining.jpg")
    # Skip images already placed on the site (see scripts/swap_images.py).
    used = ("10.55.24", "10.55.40", "10.57.37", "10.58.55")
    sources = [
        p
        for p in sorted(folder.glob("*.jpeg")) + sorted(folder.glob("*.jpg"))
        if not any(u in p.name for u in used)
    ]
    build(sources, out)
