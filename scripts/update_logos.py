#!/usr/bin/env python3
"""
Generate all brand icons and logos for Zycord from C:\\Users\\Kyze\\Downloads\\zycord.jpg
"""
import os
import base64
from io import BytesIO
from collections import deque
from PIL import Image, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_JPG = r"C:\Users\Kyze\Downloads\zycord.jpg"

def main():
    print("Loading source image:", SRC_JPG)
    img = Image.open(SRC_JPG).convert("RGB")
    w, h = img.size
    arr = np.array(img, dtype=float)
    bg = np.array([1.0, 2.0, 20.0])
    dist = np.linalg.norm(arr - bg, axis=2)

    # 1. Master Blue (full color neon blue on transparent background)
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if dist[0, x] < 58: q.append((0, x)); visited[0, x] = True
        if dist[h-1, x] < 58: q.append((h-1, x)); visited[h-1, x] = True
    for y in range(h):
        if dist[y, 0] < 58: q.append((y, 0)); visited[y, 0] = True
        if dist[y, w-1] < 58: q.append((y, w-1)); visited[y, w-1] = True

    while q:
        y, x = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and dist[ny, nx] < 58:
                visited[ny, nx] = True
                q.append((ny, nx))

    # Flood fill handle slits
    q_slit = deque([(650, 350), (650, 670)])
    for y, x in list(q_slit): visited[y, x] = True
    while q_slit:
        y, x = q_slit.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and dist[ny, nx] < 58:
                visited[ny, nx] = True
                q_slit.append((ny, nx))

    fg_mask = ~visited
    mask_img = Image.fromarray((fg_mask * 255).astype(np.uint8), mode="L")
    mask_eroded = mask_img.filter(ImageFilter.MinFilter(3))
    mask_smooth = mask_eroded.filter(ImageFilter.GaussianBlur(1.2))
    alpha_arr = np.array(mask_smooth, dtype=float) / 255.0

    fg_clean = np.zeros_like(arr)
    for c in range(3):
        fg_clean[:, :, c] = np.where(
            alpha_arr > 0.02,
            np.clip((arr[:, :, c] - bg[c] * (1.0 - alpha_arr)) / np.maximum(alpha_arr, 0.02), 0.0, 255.0),
            0.0
        )

    master_blue_full = Image.fromarray(np.dstack([fg_clean, alpha_arr * 255.0]).astype(np.uint8), "RGBA")
    bbox = master_blue_full.getbbox()
    cropped_blue = master_blue_full.crop(bbox)
    bw, bh = cropped_blue.size
    print(f"Cropped blue dimensions: {bw}x{bh}")

    # 2. Master White (pure monochrome white on transparent background with cutouts)
    white_visited = np.zeros((h, w), dtype=bool)
    q_white = deque()
    for x in range(w):
        if dist[0, x] < 110: q_white.append((0, x)); white_visited[0, x] = True
        if dist[h-1, x] < 110: q_white.append((h-1, x)); white_visited[h-1, x] = True
    for y in range(h):
        if dist[y, 0] < 110: q_white.append((y, 0)); white_visited[y, 0] = True
        if dist[y, w-1] < 110: q_white.append((y, w-1)); white_visited[y, w-1] = True

    while q_white:
        y, x = q_white.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not white_visited[ny, nx] and dist[ny, nx] < 110:
                white_visited[ny, nx] = True
                q_white.append((ny, nx))

    q_slit_w = deque([(650, 350), (650, 670)])
    for y, x in list(q_slit_w): white_visited[y, x] = True
    while q_slit_w:
        y, x = q_slit_w.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not white_visited[ny, nx] and dist[ny, nx] < 110:
                white_visited[ny, nx] = True
                q_slit_w.append((ny, nx))

    w_fg_mask = ~white_visited
    w_mask_img = Image.fromarray((w_fg_mask * 255).astype(np.uint8), mode="L")
    w_mask_eroded = w_mask_img.filter(ImageFilter.MinFilter(3))
    w_mask_smooth = w_mask_eroded.filter(ImageFilter.GaussianBlur(1.2))

    white_arr = np.zeros((h, w, 4), dtype=np.uint8)
    white_arr[:, :, 0] = 255
    white_arr[:, :, 1] = 255
    white_arr[:, :, 2] = 255
    white_arr[:, :, 3] = np.array(w_mask_smooth)
    cropped_white = Image.fromarray(white_arr, "RGBA").crop(bbox)
    print("Master white created.")

    # 3. Generate assets/icon.png (512x512 RGBA)
    icon_512 = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    # Scale cropped_blue to fit nicely inside 460x460 (padding 26px on sides)
    scale_blue_512 = min(460.0 / bw, 460.0 / bh)
    scaled_w = int(round(bw * scale_blue_512))
    scaled_h = int(round(bh * scale_blue_512))
    resized_blue_512 = cropped_blue.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    pos_x = (512 - scaled_w) // 2
    pos_y = (512 - scaled_h) // 2
    icon_512.paste(resized_blue_512, (pos_x, pos_y), resized_blue_512)
    icon_512_path = os.path.join(ROOT, "assets", "icon.png")
    icon_512.save(icon_512_path, "PNG")
    print("Updated:", icon_512_path)

    # 4. Generate assets/icon_white.png (658x512 RGBA)
    icon_white_canvas = Image.new("RGBA", (658, 512), (0, 0, 0, 0))
    scale_white = min(560.0 / bw, 420.0 / bh)
    sw_w = int(round(bw * scale_white))
    sw_h = int(round(bh * scale_white))
    resized_white = cropped_white.resize((sw_w, sw_h), Image.Resampling.LANCZOS)
    pos_wx = (658 - sw_w) // 2
    pos_wy = (512 - sw_h) // 2
    icon_white_canvas.paste(resized_white, (pos_wx, pos_wy), resized_white)
    icon_white_path = os.path.join(ROOT, "assets", "icon_white.png")
    icon_white_canvas.save(icon_white_path, "PNG")
    print("Updated:", icon_white_path)

    # 5. Generate assets/icon.ico (multi-resolution ICO)
    ico_path = os.path.join(ROOT, "assets", "icon.ico")
    icon_512.save(ico_path, format="ICO", sizes=[(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)])
    print("Updated:", ico_path)

    # 6. Generate horizontal logos (340x68 RGBA)
    # Existing wordmark from assets/logo.png (blue) and zycord_logo_white.png (white)
    old_logo_blue = Image.open(os.path.join(ROOT, "assets", "logo.png"))
    old_logo_white = Image.open(os.path.join(ROOT, "assets", "public", "branding", "zycord_logo_white.png"))
    text_blue = old_logo_blue.crop((70, 0, 340, 68))
    text_white = old_logo_white.crop((70, 0, 340, 68))

    logo_h = 36
    logo_w = int(round(logo_h * (bw / bh)))
    logo_icon_blue = cropped_blue.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    logo_icon_white = cropped_white.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    logo_icon_y = (68 - logo_h) // 2

    # Blue logo
    logo_blue = Image.new("RGBA", (340, 68), (0, 0, 0, 0))
    logo_blue.paste(text_blue, (70, 0))
    logo_blue.paste(logo_icon_blue, (10, logo_icon_y), logo_icon_blue)

    # White logo
    logo_white = Image.new("RGBA", (340, 68), (0, 0, 0, 0))
    logo_white.paste(text_white, (70, 0))
    logo_white.paste(logo_icon_white, (10, logo_icon_y), logo_icon_white)

    # Save to all target paths
    blue_logo_paths = [
        os.path.join(ROOT, "assets", "logo.png"),
        os.path.join(ROOT, "assets", "public", "logo.png"),
        os.path.join(ROOT, "assets", "public", "zycord_logo.png"),
        os.path.join(ROOT, "assets", "public", "branding", "zycord_logo.png"),
    ]
    for p in blue_logo_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        logo_blue.save(p, "PNG")
        print("Updated:", p)

    white_logo_paths = [
        os.path.join(ROOT, "assets", "public", "zycord_logo_white.png"),
        os.path.join(ROOT, "assets", "public", "branding", "zycord_logo_white.png"),
    ]
    for p in white_logo_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        logo_white.save(p, "PNG")
        print("Updated:", p)

    # 7. Generate SVGs
    def to_base64_png(image):
        buf = BytesIO()
        image.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("ascii")

    b64_blue_mark = to_base64_png(cropped_blue)
    b64_white_mark = to_base64_png(cropped_white)

    # zycord_logo.svg
    svg_logo_blue = f'''<svg xmlns="http://www.w3.org/2000/svg" width="340" height="68" viewBox="0 0 340 68" fill="none">
  <!-- Zycord mascot icon, {logo_w}x{logo_h}, vertically centred -->
  <image x="10" y="{logo_icon_y}" width="{logo_w}" height="{logo_h}" href="data:image/png;base64,{b64_blue_mark}" />
  <!-- Wordmark -->
  <text x="72" y="47"
    fill="#5865F2"
    font-family="'gg sans','Noto Sans','Helvetica Neue',Helvetica,Arial,sans-serif"
    font-size="36"
    font-weight="800"
    letter-spacing="-0.5">Zycord</text>
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord_logo.svg"), "w", encoding="utf-8") as f:
        f.write(svg_logo_blue)
    print("Updated: assets/public/branding/zycord_logo.svg")

    # zycord_logo_white.svg
    svg_logo_white = f'''<svg xmlns="http://www.w3.org/2000/svg" width="340" height="68" viewBox="0 0 340 68" fill="none">
  <!-- Zycord mascot icon, {logo_w}x{logo_h}, vertically centred -->
  <image x="10" y="{logo_icon_y}" width="{logo_w}" height="{logo_h}" href="data:image/png;base64,{b64_white_mark}" />
  <!-- Wordmark -->
  <text x="72" y="47"
    fill="#FFFFFF"
    font-family="'gg sans','Noto Sans','Helvetica Neue',Helvetica,Arial,sans-serif"
    font-size="36"
    font-weight="800"
    letter-spacing="-0.5">Zycord</text>
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord_logo_white.svg"), "w", encoding="utf-8") as f:
        f.write(svg_logo_white)
    print("Updated: assets/public/branding/zycord_logo_white.svg")

    # favicon.svg (in assets/public/branding/ and assets/public/)
    fav_w = 30
    fav_h = int(round(fav_w * (bh / bw)))
    fav_x = (32 - fav_w) // 2
    fav_y = (32 - fav_h) // 2
    b64_fav = to_base64_png(cropped_blue.resize((64, int(round(64 * (bh/bw)))), Image.Resampling.LANCZOS))
    svg_favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <image x="{fav_x}" y="{fav_y}" width="{fav_w}" height="{fav_h}" href="data:image/png;base64,{b64_fav}" />
</svg>
'''
    for fav_p in [
        os.path.join(ROOT, "assets", "public", "branding", "favicon.svg"),
        os.path.join(ROOT, "assets", "public", "favicon.svg"),
    ]:
        with open(fav_p, "w", encoding="utf-8") as f:
            f.write(svg_favicon)
        print("Updated:", fav_p)

    # zycord-icon.svg
    svg_zycord_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <image x="{pos_x}" y="{pos_y}" width="{scaled_w}" height="{scaled_h}" href="data:image/png;base64,{b64_blue_mark}" />
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord-icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_zycord_icon)
    print("Updated: assets/public/branding/zycord-icon.svg")

    # zycord.svg
    svg_zycord_mono = f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <image x="{pos_x}" y="{pos_y}" width="{scaled_w}" height="{scaled_h}" href="data:image/png;base64,{b64_white_mark}" />
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord.svg"), "w", encoding="utf-8") as f:
        f.write(svg_zycord_mono)
    print("Updated: assets/public/branding/zycord.svg")

    # 8. Update extra admin API paths if they exist
    extra_copies = [
        (icon_512, os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "img", "icon.png")),
        (icon_white_canvas, os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "img", "icon_white.png")),
        (icon_512.resize((32, 32), Image.Resampling.LANCZOS), os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "favicon.png")),
        (icon_512.resize((192, 192), Image.Resampling.LANCZOS), os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "icon-192.png")),
        (icon_512, os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "icon-512.png")),
        (icon_512.resize((32, 32), Image.Resampling.LANCZOS), os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.AdminApi.TestClient", "wwwroot", "favicon.png")),
        (icon_512.resize((192, 192), Image.Resampling.LANCZOS), os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.AdminApi.TestClient", "wwwroot", "icon-192.png")),
    ]
    for img_obj, p in extra_copies:
        if os.path.exists(os.path.dirname(p)):
            img_obj.save(p, "PNG")
            print("Updated extra:", p)

    print("\nALL LOGOS AND ICONS SUCCESSFULLY GENERATED AND UPDATED!")

if __name__ == "__main__":
    main()
