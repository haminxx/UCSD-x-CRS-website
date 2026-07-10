from PIL import Image
import os

src = r"C:\Users\wildk\.cursor\projects\c-Users-wildk-OneDrive-Important-files-Project-Source-Website-UCSD-x-CRS-website\assets\c__Users_wildk_AppData_Roaming_Cursor_User_workspaceStorage_249e958fdfec5afde2d318912d76ff0c_images_Final_ucsd_x_crs_white-1333362f-dfd6-4f48-b9ae-3dcf376c6b14.png"
root = r"c:\Users\wildk\OneDrive\Important files\Project Source\Website\UCSD x CRS website\public\images"

im = Image.open(src).convert("RGBA")
px = im.load()
w, h = im.size

# Soft threshold: near-black -> transparent; keep bright mark as white with alpha
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        lum = (r + g + b) / 3
        if lum < 48:
            px[x, y] = (255, 255, 255, 0)
        else:
            # map luminance to alpha for clean edges
            alpha = int(min(255, max(0, (lum - 48) * (255 / (255 - 48)))))
            px[x, y] = (255, 255, 255, alpha)

bbox = im.getbbox()
if bbox:
    # small padding
    pad = 8
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(w, r + pad)
    b = min(h, b + pad)
    im = im.crop((l, t, r, b))

# Save white transparent for dark surfaces (home header + footer)
im.save(os.path.join(root, "ucsd-x-crs-logo-footer.png"), optimize=True)
im.save(os.path.join(root, "ucsd-x-crs-logo-light.png"), optimize=True)
im.save(os.path.join(root, "ucsd-x-crs-logo.png"), optimize=True)

# Dark version for light pages
dark = im.copy()
dp = dark.load()
dw, dh = dark.size
for y in range(dh):
    for x in range(dw):
        r, g, b, a = dp[x, y]
        if a > 0:
            dp[x, y] = (10, 18, 24, a)
dark.save(os.path.join(root, "ucsd-x-crs-logo-dark.png"), optimize=True)

print("saved", im.size)
