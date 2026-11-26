#!/usr/bin/env python3
"""Build a labeled contact sheet of the enhanced site images.

Burning each filename into the sheet makes verification unambiguous when
several images are inspected at once.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "image-backups" / "_contact_sheet.jpg"

FILES = [
    "success-stories/sofia-atieno.jpg",
    "success-stories/mariam-chimako.jpg",
    "team/neema.jpeg",
    "team/staffatwork.jpeg",
    "team/teamimage.jpeg",
    "team/elias-karisa-baya.jpg",
    "team/karisa-poster.jpg",
    "team/gallery-team-bench.jpg",
    "team/gallery-office-desk.jpg",
    "team/gallery-desk-portrait.jpg",
    "team/gallery-brand-banner.jpg",
    "team/gallery-field-visit.jpg",
]

CELL_W, CELL_H, LABEL_H, COLS = 620, 470, 34, 2
PAD = 10


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in ("arialbd.ttf", "arial.ttf", "segoeuib.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size=size)


def main() -> None:
    rows = (len(FILES) + COLS - 1) // COLS
    sheet_w = COLS * CELL_W + (COLS + 1) * PAD
    sheet_h = rows * (CELL_H + LABEL_H) + (rows + 1) * PAD
    sheet = Image.new("RGB", (sheet_w, sheet_h), (245, 245, 247))
    draw = ImageDraw.Draw(sheet)
    label_font = font(20)
    sub_font = font(16)

    for i, rel in enumerate(FILES):
        path = PUBLIC / rel
        col, row = i % COLS, i // COLS
        x = PAD + col * (CELL_W + PAD)
        y = PAD + row * (CELL_H + LABEL_H + PAD)

        with Image.open(path) as im:
            im = im.convert("RGB")
            dims = f"{im.width}x{im.height}"
            im.thumbnail((CELL_W, CELL_H), Image.Resampling.LANCZOS)
            cx = x + (CELL_W - im.width) // 2
            cy = y + LABEL_H + (CELL_H - im.height) // 2
            sheet.paste(im, (cx, cy))

        draw.rectangle([x, y, x + CELL_W, y + CELL_H + LABEL_H], outline=(200, 200, 205))
        draw.text((x + 6, y + 5), rel, fill=(20, 20, 20), font=label_font)
        draw.text((x + 6, y + LABEL_H + CELL_H - 22), dims, fill=(90, 90, 95), font=sub_font)

    sheet.save(OUT, quality=88, optimize=True, progressive=True)
    print(f"{OUT}  ({sheet.width}x{sheet.height})")


if __name__ == "__main__":
    main()
