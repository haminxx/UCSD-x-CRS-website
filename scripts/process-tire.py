from PIL import Image
import os

root = r"c:\Users\wildk\OneDrive\Important files\Project Source\Website\UCSD x CRS website\public\images"
src = r"C:\Users\wildk\.cursor\projects\c-Users-wildk-OneDrive-Important-files-Project-Source-Website-UCSD-x-CRS-website\assets\c__Users_wildk_AppData_Roaming_Cursor_User_workspaceStorage_249e958fdfec5afde2d318912d76ff0c_images_tyre-removebg-preview-65a44990-583a-483b-b077-4fe6a639f02b.png"

tire = Image.open(src).convert("RGBA")
tp = tire.load()
tw, th = tire.size
for y in range(th):
    for x in range(tw):
        r, g, b, a = tp[x, y]
        # remove near-black / already-transparent bg
        if a < 20 or (r < 22 and g < 22 and b < 22):
            tp[x, y] = (0, 0, 0, 0)

bbox = tire.getbbox()
if bbox:
    tire = tire.crop(bbox)

side = max(tire.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - tire.size[0]) // 2
oy = (side - tire.size[1]) // 2
sq.paste(tire, (ox, oy), tire)

cursor = sq.resize((44, 44), Image.Resampling.LANCZOS)
cursor.save(os.path.join(root, "tire-cursor.png"))
cursor2 = sq.resize((88, 88), Image.Resampling.LANCZOS)
cursor2.save(os.path.join(root, "tire-cursor-2x.png"))
print("tire cursor updated", cursor.size)
