"""Export the Tala Pulse cover. Does not modify the application."""

import base64
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from xml.sax.saxutils import escape

from PIL import Image, PngImagePlugin


ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "p-console" / "public"
IMAGES = PUBLIC / "images"
FONTS = PUBLIC / "fonts"
NAME = "tala-pulse-team-cover"


def main():
    renderer = shutil.which("rsvg-convert")
    if not renderer:
        raise SystemExit("Install librsvg's rsvg-convert to export the PNG and JPEG.")

    template = Path(__file__).with_name("team-cover.template.svg").read_text()
    for token, filename in [
        ("__DM_SANS_FONT__", "dm-sans-400-700.woff2"),
        ("__IBM_PLEX_FONT__", "ibm-plex-mono-400.woff2"),
    ]:
        encoded = base64.b64encode((FONTS / filename).read_bytes()).decode("ascii")
        template = template.replace(token, encoded)

    svg = IMAGES / f"{NAME}.svg"
    png = IMAGES / f"{NAME}.png"
    jpg = IMAGES / f"{NAME}.jpg"
    svg.write_text(template)

    # librsvg uses fontconfig; the SVG embeds the same fonts for browser viewing.
    with tempfile.TemporaryDirectory(prefix="tala-pulse-") as directory:
        config = Path(directory) / "fonts.conf"
        config.write_text(
            '<?xml version="1.0"?>'
            '<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">'
            "<fontconfig>"
            '<include ignore_missing="yes">/etc/fonts/fonts.conf</include>'
            f"<dir>{escape(str(FONTS))}</dir>"
            f"<cachedir>{escape(directory)}/cache</cachedir>"
            "</fontconfig>"
        )
        env = {**os.environ, "FONTCONFIG_FILE": str(config)}
        subprocess.run(
            [renderer, str(svg), "-o", str(png)],
            env=env,
            check=True,
        )

    metadata = {
        "title": "Tala Pulse — TanawOrbit",
        "team": "Tala Pulse",
        "tool": "Figma Make coding assistant",
        "si_generated": True,
        "type": "Original vector cover artwork; not a photograph",
        "visible_watermark": "SI-GENERATED ARTWORK",
        "external_photographs": False,
    }
    info = PngImagePlugin.PngInfo()
    info.add_text("Title", metadata["title"])
    info.add_text("Description", metadata["type"])
    info.add_text("SI_Provenance", json.dumps(metadata))
    info.add_text("Software", "SI-assisted SVG; librsvg and Pillow raster export")
    with Image.open(png) as rendered:
        image = rendered.convert("RGB")
    image.save(png, pnginfo=info, optimize=True)

    exif = Image.Exif()
    exif[270] = "SI-GENERATED ARTWORK | Tala Pulse | TanawOrbit"
    exif[305] = "Figma Make SI-assisted SVG; librsvg and Pillow export"
    image.save(jpg, quality=95, subsampling=0, optimize=True, exif=exif)

    for path in [svg, png, jpg]:
        print(f"Created {path.relative_to(ROOT)} ({path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
