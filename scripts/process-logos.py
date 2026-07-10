"""Process partner logos: transparent bg, keep original brand colors."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ASSETS = Path(
    r"C:\Users\wildk\.cursor\projects\c-Users-wildk-OneDrive-Important-files-Project-Source-Website-UCSD-x-CRS-website\assets"
)
OUT = Path(
    r"c:\Users\wildk\OneDrive\Important files\Project Source\Website\UCSD x CRS website\public\images\logos"
)

FILES = {
    "rady-school.png": "*UCSD_Rady*",
    "mazda-motorsports.png": "*Mazda_Motorsports*",
    "uc-san-diego.png": "*UCSanDiegoLogo*",
    "crs.png": "*CRS_Logo-removebg*",
    "jacobs-school.png": "*UCSD_Jacobs*",
}

CREAM = np.array([245.0, 240.0, 230.0], dtype=np.float32)  # #F5F0E6
# Soft lift target for near-black navy so it reads on dark home without going white
NAVY_LIFT = np.array([0.0, 98.0, 155.0], dtype=np.float32)  # toward #00629B


def _luma(rgb: np.ndarray) -> np.ndarray:
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]


def process_colored(arr: np.ndarray) -> np.ndarray:
    """Keep gold/orange/navy; only lift near-black ink; transparent bg."""
    rgb = arr[..., :3].astype(np.float32)
    alpha_in = arr[..., 3].astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = _luma(rgb)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0.0)

    is_gold = (r > 70) & (g > 45) & (b < g * 0.95) & (r > b * 1.05) & (sat > 0.18) & (lum > 35)
    is_orange = (r > 110) & (g > 30) & (b < 100) & (r > g * 0.85) & (sat > 0.28) & (lum > 45)
    is_accent = is_gold | is_orange

    # Pure / near-black canvas
    is_bg = (lum < 8) & ~is_accent

    # Remaining mark pixels (navy text, dark subtext, AA edges)
    is_mark = ~is_bg & ~is_accent & (lum >= 2)

    out = np.zeros_like(rgb)
    alpha = np.zeros_like(lum)

    if is_mark.any():
        mark_rgb = rgb[is_mark]
        mark_lum = lum[is_mark]
        mark_sat = sat[is_mark]

        # Near-black / very dark desaturated ink → cream (Mazda-like / CRS subtext)
        near_black = (mark_lum < 28) & (mark_sat < 0.22)
        # Dark navy with blue cast → lift toward brand blue, keep hue
        navy = ~near_black & (mark_lum < 90) & (mark_rgb[..., 2] >= mark_rgb[..., 0] * 0.85)
        # Mid navy / already-visible blue → keep, slight lift if dim
        keep = ~near_black & ~navy

        result = mark_rgb.copy()
        if near_black.any():
            # Alpha from how much ink exists above floor
            result[near_black] = CREAM
        if navy.any():
            # Blend original toward brand blue based on darkness
            t = np.clip((55.0 - mark_lum[navy]) / 55.0, 0.15, 0.85)
            result[navy] = mark_rgb[navy] * (1 - t[..., None]) + NAVY_LIFT * t[..., None]
            result[navy] = np.clip(result[navy], 0, 255)
        if keep.any():
            # Mild lift only when still quite dark
            dark = keep & (mark_lum < 55)
            if dark.any():
                f = np.clip(70.0 / np.maximum(mark_lum[dark], 1), 1.0, 1.55)
                result[dark] = np.clip(result[dark] * f[..., None], 0, 255)

        a_mark = np.clip((mark_lum - 2.0) / 18.0, 0.15, 1.0)
        # Near-black marks need stronger alpha from residual signal
        a_mark = np.where(near_black, np.clip((mark_lum - 1.0) / 12.0, 0.2, 1.0), a_mark)

        out[is_mark] = result
        alpha[is_mark] = a_mark * alpha_in[is_mark]

    if is_accent.any():
        out[is_accent] = rgb[is_accent]
        dark = is_accent & (lum < 70)
        if dark.any():
            f = np.clip(85.0 / np.maximum(lum[dark], 1), 1.0, 1.8)
            out[dark] = np.clip(out[dark] * f[..., None], 0, 255)
        alpha[is_accent] = np.maximum(alpha_in[is_accent], 0.85)

    result = np.zeros_like(arr)
    result[..., :3] = np.round(out).astype(np.uint8)
    result[..., 3] = np.round(np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    return result


def process_mazda(arr: np.ndarray) -> np.ndarray:
    """Black-on-black serif mark → cream ink on transparent bg (quality-preserving)."""
    rgb = arr[..., :3].astype(np.float32)
    lum = _luma(rgb)

    nonzero = lum[lum > 0.05]
    if nonzero.size == 0:
        return np.zeros((*lum.shape, 4), dtype=np.uint8)

    floor = float(np.percentile(nonzero, 5))
    ceiling = float(np.percentile(nonzero, 99.5))
    strength = np.clip((lum - floor) / max(ceiling - floor, 0.5), 0, 1)

    alpha_u8 = (np.clip(strength * 1.25, 0, 1) * 255).astype(np.uint8)
    mask = Image.fromarray(alpha_u8, mode="L")
    # Light thicken only — avoid the harsh MaxFilter+threshold look
    mask = mask.filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=0.45))
    alpha = np.asarray(mask).astype(np.float32) / 255.0
    alpha = np.where(alpha < 0.06, 0.0, np.clip(alpha * 1.08, 0, 1))

    out = np.zeros((*lum.shape, 4), dtype=np.uint8)
    out[..., 0] = 245
    out[..., 1] = 240
    out[..., 2] = 230
    out[..., 3] = np.round(alpha * 255).astype(np.uint8)
    return out


def crop_pad(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    return img.crop(
        (
            max(0, l - pad),
            max(0, t - pad),
            min(img.width, r + pad),
            min(img.height, b + pad),
        )
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, pattern in FILES.items():
        src = next(ASSETS.glob(pattern))
        img = Image.open(src).convert("RGBA")
        arr = np.asarray(img)
        processed = process_mazda(arr) if name.startswith("mazda") else process_colored(arr)
        out_img = crop_pad(Image.fromarray(processed, "RGBA"))
        dest = OUT / name
        out_img.save(dest, optimize=True)
        pa = np.asarray(out_img)
        opaque = pa[..., 3] > 128
        mean = pa[opaque, :3].mean(axis=0) if opaque.any() else (0, 0, 0)
        print(f"{name}: {out_img.size} opaque={int(opaque.sum())} meanRGB={tuple(round(x,1) for x in mean)}")


if __name__ == "__main__":
    main()
