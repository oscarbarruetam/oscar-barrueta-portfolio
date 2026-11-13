#!/usr/bin/env python3
"""Embed visible portfolio watermarks into public HALLEL imagery.

This script is idempotent via per-site SHA256 manifests and intentionally skips
brand logos, site logos, favicons and functional interface artwork.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SITE_ROOTS = (Path("assets"), Path("hallel/assets"))
IMAGE_FOLDERS = ("design", "examples", "evidence", "results", "sites")
EXTENSIONS = {".webp", ".png", ".jpg", ".jpeg"}
LABEL = "HALLEL"
FONT_CANDIDATES = (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
)

def hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pick_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in FONT_CANDIDATES:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def stamp_image(original: Image.Image) -> Image.Image:
    base = original.convert("RGBA")
    width, height = base.size
    font_size = max(16, min(56, round(min(width, height) * 0.046)))
    font = pick_font(font_size)
    dummy = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    bounds = dummy.textbbox((0, 0), LABEL, font=font, stroke_width=1)
    text_w, text_h = bounds[2] - bounds[0], bounds[3] - bounds[1]

    tile = Image.new("RGBA", (text_w + 36, text_h + 37), (0, 0, 0, 0))
    td = ImageDraw.Draw(tile)
    td.text((18 - bounds[0], 14 - bounds[1]), LABEL, font=font,
            fill=(248, 247, 242, 42), stroke_width=1,
            stroke_fill=(21, 27, 28, 25))
    tilted = tile.rotate(22, expand=True, resample=Image.Resampling.BICUBIC)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    step_x = max(int(tilted.width * 1.5), 145)
    step_y = max(int(tilted.height * 1.65), 110)
    # Subtle repeated diagonal marks that preserve readable dashboard data.
    for row, y in enumerate(range(0, height, step_y)):
        start_x = -(step_x // 3) if row % 2 else 0
        for x in range(start_x, width, step_x):
            left, top = max(0, x), max(0, y)
            right = min(width, x + tilted.width)
            bottom = min(height, y + tilted.height)
            if right <= left or bottom <= top:
                continue
            section = tilted.crop((left - x, top - y, right - x, bottom - y))
            overlay.alpha_composite(section, (left, top))

    return Image.alpha_composite(base, overlay)


def process_root(site_assets: Path) -> tuple[int, int]:
    if not site_assets.is_dir():
        return 0, 0

    manifest_path = site_assets / ".hallel-watermarked.json"
    try:
        recorded = json.loads(manifest_path.read_text(encoding="utf-8"))
        if not isinstance(recorded, dict):
            recorded = {}
    except (FileNotFoundError, json.JSONDecodeError):
        recorded = {}

    count = 0
    skipped = 0
    for folder in IMAGE_FOLDERS:
        base_dir = site_assets / folder
        if not base_dir.is_dir():
            continue
        for path in sorted(base_dir.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
                continue
            rel = path.relative_to(site_assets).as_posix()
            before_sha = hash_file(path)
            if recorded.get(rel) == before_sha:
                skipped += 1
                continue
            with Image.open(path) as im:
                marked = stamp_image(im)
                if path.suffix.lower() == ".webp":
                    marked.convert("RGB").save(path, format="WEBP", quality=90, method=6)
                elif path.suffix.lower() in {".jpg", ".jpeg"}:
                    marked.convert("RGB").save(path, format="JPEG", quality=90, optimize=True)
                else:
                    has_alpha = "A" in im.getbands()
                    marked.convert("RGBA" if has_alpha else "RGB").save(
                        path, format="PNG", optimize=True)
            recorded[rel] = hash_file(path)
            count += 1

    manifest_path.write_text(
        json.dumps(recorded, ensure_ascii=False, sort_keys=True, indent=2) + "\n",
        encoding="utf-8",
    )
    return count, skipped


def main() -> None:
    for root in SITE_ROOTS:
        modified, skipped = process_root(root)
        if root.exists():
            print(f"{root}: watermarked={modified}, already_protected={skipped}")


if __name__ == "__main__":
    main()
