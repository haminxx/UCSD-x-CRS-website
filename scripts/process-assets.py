from PIL import Image
import os

root = r"c:\Users\wildk\OneDrive\Important files\Project Source\Website\UCSD x CRS website\public\images"

# --- Logo: black bg -> transparent, keep white ---
logo = Image.open(os.path.join(root, "_src_logo_white.png")).convert("RGBA")
pixels = logo.load()
w, h = logo.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r < 40 and g < 40 and b < 40:
            pixels[x, y] = (255, 255, 255, 0)
        else:
            bright = max(r, g, b)
            pixels[x, y] = (255, 255, 255, bright)
bbox = logo.getbbox()
if bbox:
    logo = logo.crop(bbox)
logo.save(os.path.join(root, "ucsd-x-crs-logo-footer.png"))
dark = logo.copy()
dp = dark.load()
dw, dh = dark.size
for y in range(dh):
    for x in range(dw):
        r, g, b, a = dp[x, y]
        if a > 0:
            dp[x, y] = (10, 18, 24, a)
dark.save(os.path.join(root, "ucsd-x-crs-logo-dark.png"))
logo.save(os.path.join(root, "ucsd-x-crs-logo-light.png"))
logo.save(os.path.join(root, "ucsd-x-crs-logo.png"))
print("logo", logo.size, "saved")

# --- Tire: black bg -> transparent, resize for cursor ---
tire = Image.open(os.path.join(root, "_src_tire.png")).convert("RGBA")
tp = tire.load()
tw, th = tire.size
for y in range(th):
    for x in range(tw):
        r, g, b, a = tp[x, y]
        if r < 18 and g < 18 and b < 18:
            tp[x, y] = (0, 0, 0, 0)
bbox = tire.getbbox()
if bbox:
    tire = tire.crop(bbox)
side = max(tire.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - tire.size[0]) // 2
oy = (side - tire.size[1]) // 2
sq.paste(tire, (ox, oy), tire)
cursor = sq.resize((40, 40), Image.Resampling.LANCZOS)
cursor.save(os.path.join(root, "tire-cursor.png"))
cursor2 = sq.resize((64, 64), Image.Resampling.LANCZOS)
cursor2.save(os.path.join(root, "tire-cursor-2x.png"))
print("tire cursor", cursor.size, "saved")
