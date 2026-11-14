#!/usr/bin/env python3
"""Generate placeholder images in public/images/ with the final file names.

Flat panel fill with the file name in slate text, at the real aspect ratio
(long side capped at 1600px). The "Fetch real assets" GitHub workflow replaces
them with the real files. Run from the repo root:  python3 scripts/make-placeholders.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "public" / "images"
PANEL, SLATE, WHITE, RULE = "#EEF1F1", "#1D2B33", "#FFFFFF", "#C8D0D3"
CAP = 1600
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]

# name: (real width, real height, label, background, apply 1600px cap)
IMAGES = {
    "logo-banner.png": (1706, 422, "COMPEL 2027 logo placeholder", WHITE, True),
    "hero-campus.jpg": (2000, 760, "hero-campus.jpg", PANEL, False),
    "venue-welch.jpg": (2880, 2160, "venue-welch.jpg", PANEL, True),
    "venue-eer.jpg": (1024, 768, "venue-eer.jpg", PANEL, True),
    "venue-pickle.jpg": (1195, 805, "venue-pickle.jpg", PANEL, True),
    "committee-hanson.jpg": (800, 533, "committee-hanson.jpg", PANEL, True),
    "committee-huang.jpg": (800, 533, "committee-huang.jpg", PANEL, True),
    "committee-johnson.jpg": (1600, 1064, "committee-johnson.jpg", PANEL, True),
    "committee-zhu.jpg": (1600, 1064, "committee-zhu.jpg", PANEL, True),
}


def font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (w, h, label, bg, cap) in IMAGES.items():
        if cap and max(w, h) > CAP:
            scale = CAP / max(w, h)
            w, h = round(w * scale), round(h * scale)
        img = Image.new("RGB", (w, h), bg)
        draw = ImageDraw.Draw(img)
        size = max(18, min(h // 5, w // 14))
        f = font(size)
        while draw.textlength(label, font=f) > w * 0.86 and size > 12:
            size -= 2
            f = font(size)
        if bg == WHITE:
            draw.text((size // 2, h // 2), label, font=f, fill=SLATE, anchor="lm")
        else:
            draw.rectangle([0, 0, w - 1, h - 1], outline=RULE, width=2)
            draw.text((w // 2, h // 2), label, font=f, fill=SLATE, anchor="mm")
        if name.endswith(".png"):
            img.save(OUT / name, optimize=True)
        else:
            img.save(OUT / name, quality=85)
        print(f"{name}: {w}x{h}")


if __name__ == "__main__":
    main()
