"""Process sponsor logos: remove black bg, lighten dark ink for dark home."""
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


def process_standard(arr: np.ndarray) -> np.ndarray:
    rgb = arr[..., :3].astype(np.float32)
    alpha_in = arr[..., 3].astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0.0)

    # Gold underline / warm accents
    is_gold = (r > 80) & (g > 50) & (b < g * 0.9) & (r > b * 1.1) & (sat > 0.22) & (lum > 40)
    # Orange CRS wordmark
    is_orange = (r > 120) & (g > 35) & (b < 90) & (r > g * 0.9) & (sat > 0.3) & (lum > 50)
    is_accent = is_gold | is_orange

    is_bg = (lum < 10) & ~is_accent
    is_ink = ~is_bg & ~is_accent & (lum >= 6)

    out = np.zeros_like(rgb)
    alpha = np.zeros_like(lum)

    # Solid white ink; alpha from how opaque the original mark is
    # Interiors of navy logos are solid enough (lum often 40–120) → full alpha
    if is_ink.any():
        ink_lum = lum[is_ink]
        # Map: soft AA edges get partial alpha; solid fills get 1
        a_ink = np.clip((ink_lum - 6.0) / 28.0, 0.0, 1.0)
        out[is_ink] = 255.0
        alpha[is_ink] = a_ink * alpha_in[is_ink]

    if is_accent.any():
        out[is_accent] = rgb[is_accent]
        # Slight lift for dim gold
        dark = is_accent & (lum < 75)
        if dark.any():
            f = np.clip(95 / np.maximum(lum[dark], 1), 1.0, 2.5)
            out[dark] = np.clip(out[dark] * f[..., None], 0, 255)
        alpha[is_accent] = alpha_in[is_accent]

    result = np.zeros_like(arr)
    result[..., :3] = np.round(out).astype(np.uint8)
    result[..., 3] = np.round(np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    return result


def process_mazda(arr: np.ndarray) -> np.ndarray:
    """Near-invisible dark-gray text on black → white transparent PNG."""
    rgb = arr[..., :3].astype(np.float32)
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]

    # Anything above pure black noise floor is content
    floor = float(np.percentile(lum[lum > 0], 10)) if (lum > 0).any() else 0.5
    floor = max(floor, 0.8)
    strength = np.clip((lum - floor) / max(float(np.percentile(lum, 99.5) - floor), 1.0), 0, 1)

    # Build alpha mask, then slightly dilate + blur for readable strokes
    alpha_u8 = (np.clip(strength * 1.35, 0, 1) * 255).astype(np.uint8)
    mask = Image.fromarray(alpha_u8, mode="L")
    mask = mask.filter(ImageFilter.MaxFilter(3))  # thicken thin strokes
    mask = mask.filter(ImageFilter.GaussianBlur(radius=0.6))
    alpha = np.asarray(mask).astype(np.float32) / 255.0
    # Re-threshold soft noise
    alpha = np.where(alpha < 0.08, 0.0, np.clip(alpha * 1.15, 0, 1))

    out = np.zeros((*lum.shape, 4), dtype=np.uint8)
    out[..., 0:3] = 255
    out[..., 3] = np.round(alpha * 255).astype(np.uint8)
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, pattern in FILES.items():
        src = next(ASSETS.glob(pattern))
        img = Image.open(src).convert("RGBA")
        arr = np.asarray(img)
        if name.startswith("mazda"):
            processed = process_mazda(arr)
        else:
            processed = process_standard(arr)
        out_img = Image.fromarray(processed, "RGBA")
        bbox = out_img.getbbox()
        if bbox:
            pad = 6
            l, t, r, b = bbox
            out_img = out_img.crop(
                (
                    max(0, l - pad),
                    max(0, t - pad),
                    min(out_img.width, r + pad),
                    min(out_img.height, b + pad),
                )
            )
        dest = OUT / name
        out_img.save(dest, optimize=True)
        pa = np.asarray(out_img)
        solid = (pa[..., 3] > 200).sum()
        any_a = (pa[..., 3] > 20).sum()
        print(f"{name}: {out_img.size} solid={solid} visible={any_a}")


if __name__ == "__main__":
    main()
