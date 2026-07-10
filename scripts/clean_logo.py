"""Clean UCSD x CRS logo transparency and generate favicons."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(
    r"C:\Users\wildk\.cursor\projects\c-Users-wildk-OneDrive-Important-files-Project-Source-Website-UCSD-x-CRS-website\assets\c__Users_wildk_AppData_Roaming_Cursor_User_workspaceStorage_249e958fdfec5afde2d318912d76ff0c_images_web_icoon-82085b3c-fbc5-4bde-9508-2b9e7f9f52fe.png"
)
ROOT = Path(__file__).resolve().parents[1]


def clean_logo(im: Image.Image) -> Image.Image:
    """Normalize black mark on true alpha; strip near-transparent noise."""
    arr = np.array(im.convert("RGBA"))
    a = arr[:, :, 3]
    out = arr.copy()

    # Force fully transparent where alpha is negligible
    out[a < 8] = (0, 0, 0, 0)

    # Ensure mark pixels are pure black with preserved alpha (anti-alias fringe)
    opaque = out[:, :, 3] >= 8
    out[opaque, 0] = 0
    out[opaque, 1] = 0
    out[opaque, 2] = 0

    return Image.fromarray(out, "RGBA")


def crop_content(im: Image.Image, pad: int = 24) -> Image.Image:
    arr = np.array(im)
    ys, xs = np.where(arr[:, :, 3] > 10)
    if len(xs) == 0:
        return im
    x0 = max(0, int(xs.min()) - pad)
    x1 = min(arr.shape[1], int(xs.max()) + pad + 1)
    y0 = max(0, int(ys.min()) - pad)
    y1 = min(arr.shape[0], int(ys.max()) + pad + 1)
    return im.crop((x0, y0, x1, y1))


def main() -> None:
    full = clean_logo(Image.open(SRC))
    cropped = crop_content(full)
    print("full", full.size, "cropped", cropped.size)

    logo_path = ROOT / "public" / "images" / "ucsd-x-crs-logo.png"
    logo_path.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(logo_path, "PNG", optimize=True)
    print("saved", logo_path, logo_path.stat().st_size)

    app_dir = ROOT / "app"
    public = ROOT / "public"
    targets = [
        (32, public / "favicon.png"),
        (32, public / "favicon-32x32.png"),
        (180, public / "apple-touch-icon.png"),
        (32, app_dir / "icon.png"),
        (180, app_dir / "apple-icon.png"),
    ]
    for size, dest in targets:
        dest.parent.mkdir(parents=True, exist_ok=True)
        icon = full.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(dest, "PNG", optimize=True)
        print("saved", dest.relative_to(ROOT), dest.stat().st_size)

    ico_path = public / "favicon.ico"
    full.resize((32, 32), Image.Resampling.LANCZOS).save(
        ico_path, format="ICO", sizes=[(32, 32)]
    )
    print("saved", ico_path.relative_to(ROOT), ico_path.stat().st_size)

    verify = np.array(Image.open(logo_path).convert("RGBA"))
    print(
        "verify mode RGBA",
        verify.shape,
        "alpha0%",
        round(100 * float((verify[:, :, 3] == 0).mean()), 2),
        "opaque black%",
        round(
            100
            * float(
                (
                    (verify[:, :, 3] > 10)
                    & (verify[:, :, 0] == 0)
                    & (verify[:, :, 1] == 0)
                    & (verify[:, :, 2] == 0)
                ).mean()
            ),
            2,
        ),
    )


if __name__ == "__main__":
    main()
