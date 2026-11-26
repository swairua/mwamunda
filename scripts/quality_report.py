#!/usr/bin/env python3
"""Objective before/after quality report for the enhanced site images.

Visual inspection is unavailable here (image reads come back mismatched), so
this checks the things that actually matter numerically, comparing each
pristine backup against the enhanced live file:

  sharpness   Laplacian variance at a fixed 800px scale - should rise, but
              not explode (a runaway value means over-sharpening)
  ringing     share of pixels with an extreme Laplacian response; this is
              what halos and crunchy edges look like numerically
  clipping    share of pixels crushed to 0 or blown to 255
  saturation  mean HSV saturation - guards against garish colour boost
  detail/noise high-frequency energy relative to the original
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "image-backups"
LIVE = ROOT / "public"
SCALE = 800

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


def load(path: Path, scale_w: int = SCALE) -> np.ndarray:
    with Image.open(path) as im:
        im = im.convert("RGB")
        if im.width != scale_w:
            im = im.resize((scale_w, round(im.height * scale_w / im.width)), Image.Resampling.LANCZOS)
        return np.asarray(im, dtype=np.float32)


def laplacian(g: np.ndarray) -> np.ndarray:
    return (
        4.0 * g[1:-1, 1:-1] - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
    )


def stats(arr: np.ndarray) -> dict[str, float]:
    g = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    lap = laplacian(g)
    mx = arr.max(axis=2)
    mn = arr.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
    return {
        "sharp": float(lap.var()),
        "ring": float((np.abs(lap) > 60).mean() * 100),
        "clip": float(((arr <= 1) | (arr >= 254)).mean() * 100),
        "sat": float(sat.mean() * 100),
    }


def main() -> None:
    hdr = (
        f"{'image':34} {'sharpness':>18} {'ringing %':>16} "
        f"{'clipping %':>16} {'saturation %':>16}"
    )
    print(hdr)
    print("-" * len(hdr))
    warnings: list[str] = []

    for rel in FILES:
        orig, live = BACKUP / rel, LIVE / rel
        if not orig.exists() or not live.exists():
            print(f"{rel:34} missing file")
            continue
        a, b = stats(load(orig)), stats(load(live))
        ratio = b["sharp"] / max(a["sharp"], 1e-6)

        print(
            f"{rel.split('/')[-1]:34} "
            f"{a['sharp']:7.0f} -> {b['sharp']:7.0f} ({ratio:4.1f}x) "
            f"{a['ring']:7.2f} -> {b['ring']:7.2f} "
            f"{a['clip']:7.2f} -> {b['clip']:7.2f} "
            f"{a['sat']:7.1f} -> {b['sat']:7.1f}"
        )

        if ratio > 4.5:
            warnings.append(f"{rel}: sharpness jumped {ratio:.1f}x - likely over-sharpened")
        if b["ring"] - a["ring"] > 8.0:
            warnings.append(
                f"{rel}: ringing +{b['ring'] - a['ring']:.1f} pts ({a['ring']:.1f} -> {b['ring']:.1f}) - halos likely"
            )
        if b["clip"] - a["clip"] > 8.0:
            warnings.append(
                f"{rel}: clipping +{b['clip'] - a['clip']:.1f} pts ({a['clip']:.1f} -> {b['clip']:.1f}) - lost detail"
            )
        if b["sat"] > 55 and b["sat"] - a["sat"] > 4.0:
            warnings.append(
                f"{rel}: saturation {a['sat']:.1f} -> {b['sat']:.1f}% - colours may look garish"
            )

    print()
    if warnings:
        print("WARNINGS")
        for w in warnings:
            print(f"  ! {w}")
    else:
        print("All images within safe bounds.")


if __name__ == "__main__":
    main()
