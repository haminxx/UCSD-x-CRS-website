from PIL import Image, ImageDraw
from pathlib import Path
import shutil

root = Path(r"c:\Users\wildk\OneDrive\Important files\Project Source\Website\UCSD x CRS website")
assets = Path(
    r"C:\Users\wildk\.cursor\projects\c-Users-wildk-OneDrive-Important-files-Project-Source-Website-UCSD-x-CRS-website\assets"
)

logo_src = assets / (
    "c__Users_wildk_AppData_Roaming_Cursor_User_workspaceStorage_"
    "249e958fdfec5afde2d318912d76ff0c_images_ucsd_x_crs_white-3a3da9e2-7d87-4931-9fa6-66e3a2e236c5.png"
)
trident_src = assets / (
    "c__Users_wildk_AppData_Roaming_Cursor_User_workspaceStorage_"
    "249e958fdfec5afde2d318912d76ff0c_images_triton-6f08a27e-86d6-4d2b-bdc4-ebc5a7a0a235.png"
)


def black_to_transparent(img: Image.Image, threshold: int = 40) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                lum = max(r, g, b)
                pixels[x, y] = (255, 255, 255, lum)
    return img


logo = black_to_transparent(Image.open(logo_src))
logo_out = root / "public" / "images" / "ucsd-x-crs-logo-footer.png"
logo.save(logo_out)
logo.save(root / "public" / "images" / "ucsd-x-crs-logo-light.png")
print("logo saved", logo_out, logo.size)

trident = black_to_transparent(Image.open(trident_src))
trident_trans_path = root / "public" / "images" / "trident-white.png"
trident.save(trident_trans_path)
print("trident transparent", trident.size)

WINE = (0x32, 0x29, 0x2F, 255)


def make_favicon(size: int, radius_ratio: float = 0.22) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(bg)
    r = int(size * radius_ratio)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=WINE)
    pad = int(size * 0.16)
    mark = trident.copy()
    mark.thumbnail((size - 2 * pad, size - 2 * pad), Image.Resampling.LANCZOS)
    ox = (size - mark.width) // 2
    oy = (size - mark.height) // 2
    canvas.alpha_composite(bg)
    canvas.alpha_composite(mark, (ox, oy))
    return canvas


fav32 = make_favicon(32)
fav180 = make_favicon(180)

fav32.save(root / "public" / "favicon.png")
fav32.save(root / "public" / "favicon-32x32.png")
fav180.save(root / "public" / "apple-touch-icon.png")
fav180.save(root / "app" / "apple-icon.png")
fav32.save(root / "app" / "icon.png")

ico_images = [make_favicon(s) for s in (16, 32, 48)]
ico_images[0].save(
    root / "public" / "favicon.ico",
    format="ICO",
    sizes=[(im.width, im.height) for im in ico_images],
    append_images=ico_images[1:],
)
print("favicons written")

src_video = Path(r"c:\Users\wildk\Downloads\Upscale UCSDxCRS.mp4")
dst_video = root / "public" / "videos" / "ucsdxcrs.mp4"
dst_video.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(src_video, dst_video)
print("video copied", dst_video.stat().st_size)
