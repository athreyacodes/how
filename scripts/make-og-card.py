"""Generate the 1200x630 social card (light How palette).

Run from the How repo with Pillow available:
    python3 scripts/make-og-card.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FONT = ROOT / "node_modules" / "layers-ui" / "fonts" / "montserrat.ttf"
OUT = PUBLIC / "images" / "og-card.jpg"

WIDTH, HEIGHT = 1200, 630
BG = (238, 238, 238)  # --background #eeeeee
PRIMARY = (21, 96, 100)  # --primary-color #156064

HERE = "Here’s "
HOW = "How!"
LEDE = "Essential ways of building reliable software"
NAME = "Athreya M R"
DOMAIN = "how.athreya.codes"


def load_font(weight: int, size: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT), size)
    font.set_variation_by_axes([weight])
    return font


def portrait_source() -> Path:
    for candidate in (
        ROOT / "assets-src" / "dp-master.jpg",
        ROOT.parent / "portfolio" / "assets-src" / "dp-master.jpg",
        PUBLIC / "images" / "dp-240.jpg",
    ):
        if candidate.is_file():
            return candidate
    raise FileNotFoundError("No portrait found (expected public/images/dp-240.jpg)")


def circular_portrait(size: int) -> Image.Image:
    portrait = Image.open(portrait_source()).convert("RGB")
    side = min(portrait.size)
    left = (portrait.width - side) // 2
    top = (portrait.height - side) // 2
    portrait = portrait.crop((left, top, left + side, top + side))
    portrait = portrait.resize((size, size), Image.LANCZOS)

    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4, size * 4), fill=255)
    portrait.putalpha(mask.resize((size, size), Image.LANCZOS))
    return portrait


def build() -> None:
    if not FONT.is_file():
        raise FileNotFoundError(
            f"Montserrat missing at {FONT.relative_to(ROOT)} — run npm install"
        )

    card = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(card)

    portrait_size = 340
    ring = 6
    portrait_x = 96
    portrait_y = (HEIGHT - portrait_size) // 2

    ring_box = (
        portrait_x - ring,
        portrait_y - ring,
        portrait_x + portrait_size + ring,
        portrait_y + portrait_size + ring,
    )
    draw.ellipse(ring_box, outline=PRIMARY, width=ring)

    portrait = circular_portrait(portrait_size)
    card.paste(portrait, (portrait_x, portrait_y), portrait)

    font_here = load_font(300, 72)
    font_how = load_font(800, 72)
    font_lede = load_font(500, 24)
    font_name = load_font(700, 28)
    font_domain = load_font(500, 22)

    text_x = portrait_x + portrait_size + 72
    here_w = font_here.getlength(HERE)

    wordmark_box = font_how.getbbox(HOW)
    lede_box = font_lede.getbbox(LEDE)
    name_box = font_name.getbbox(NAME)
    domain_box = font_domain.getbbox(DOMAIN)

    wordmark_h = wordmark_box[3] - wordmark_box[1]
    lede_h = lede_box[3] - lede_box[1]
    name_h = name_box[3] - name_box[1]
    domain_h = domain_box[3] - domain_box[1]

    gap_after_wordmark = 22
    gap_after_lede = 28
    gap_after_line = 28
    gap_after_name = 10
    line_h = 3

    block_h = (
        wordmark_h
        + gap_after_wordmark
        + lede_h
        + gap_after_lede
        + line_h
        + gap_after_line
        + name_h
        + gap_after_name
        + domain_h
    )
    y = (HEIGHT - block_h) // 2 - wordmark_box[1]

    draw.text((text_x, y), HERE, font=font_here, fill=PRIMARY)
    draw.text((text_x + here_w, y), HOW, font=font_how, fill=PRIMARY)

    y_lede = y + wordmark_box[3] + gap_after_wordmark - lede_box[1]
    draw.text((text_x, y_lede), LEDE, font=font_lede, fill=PRIMARY)

    y_line = y_lede + lede_box[3] + gap_after_lede
    draw.line((text_x, y_line, text_x + 88, y_line), fill=PRIMARY, width=line_h)

    y_name = y_line + gap_after_line - name_box[1]
    draw.text((text_x, y_name), NAME, font=font_name, fill=PRIMARY)

    y_domain = y_name + name_box[3] + gap_after_name - domain_box[1]
    draw.text((text_x, y_domain), DOMAIN, font=font_domain, fill=PRIMARY)

    draw.rectangle((0, 0, WIDTH - 1, HEIGHT - 1), outline=PRIMARY, width=1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} kB)")


if __name__ == "__main__":
    build()
