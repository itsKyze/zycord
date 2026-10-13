#!/usr/bin/env python3
"""
Generate all brand icons and logos for Zycord in Discord Blurple (#5865F2) and White (#FFFFFF)
matching Discord's official app icon, branding, and desktop client.
"""
import os
import base64
from io import BytesIO
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_MASK_PNG = r"C:\Users\Kyze\.gemini\antigravity\brain\0c453e88-25d0-4f07-ae4b-5adc9658a4b1\test_white_silhouette.png"
SQUIRCLE_SRC = r"C:\Users\Kyze\.gemini\antigravity\brain\0c453e88-25d0-4f07-ae4b-5adc9658a4b1\perfect_squircle.png"
OLD_LOGO_SRC = r"C:\Users\Kyze\.gemini\antigravity\brain\0c453e88-25d0-4f07-ae4b-5adc9658a4b1\old_logo.png"

def main():
    print("Loading source mascot mask:", SRC_MASK_PNG)
    src = Image.open(SRC_MASK_PNG)
    alpha = src.split()[-1]
    bbox = src.getbbox()
    cropped_alpha = alpha.crop(bbox)
    cw, ch = cropped_alpha.size
    print(f"Cropped mascot dimensions: {cw}x{ch}")

    # 1. White mascot (#FFFFFF)
    white_arr = np.zeros((ch, cw, 4), dtype=np.uint8)
    white_arr[:, :, :3] = 255
    white_arr[:, :, 3] = np.array(cropped_alpha)
    cropped_white = Image.fromarray(white_arr, "RGBA")

    # 2. Blurple mascot (#5865F2, RGB: 88, 101, 242)
    blurple_arr = np.zeros((ch, cw, 4), dtype=np.uint8)
    blurple_arr[:, :, 0] = 88
    blurple_arr[:, :, 1] = 101
    blurple_arr[:, :, 2] = 242
    blurple_arr[:, :, 3] = np.array(cropped_alpha)
    cropped_blurple = Image.fromarray(blurple_arr, "RGBA")

    # 3. Discord App Icon (512x512): Discord Blurple Squircle + White Mascot
    squircle = Image.open(SQUIRCLE_SRC).convert("RGBA")
    app_icon_512 = squircle.copy()
    target_w = 360
    target_h = int(round(ch * (target_w / cw)))
    rw = cropped_white.resize((target_w, target_h), Image.Resampling.LANCZOS)
    app_icon_512.paste(rw, ((512 - target_w) // 2, (512 - target_h) // 2), rw)

    # Save app icons
    app_icon_512.save(os.path.join(ROOT, "assets", "icon.png"), "PNG")
    app_icon_512.save(os.path.join(ROOT, "desktop", "assets", "icon.png"), "PNG")
    app_icon_512.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "icon-512.png"), "PNG")
    app_icon_512.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "img", "icon.png"), "PNG")

    # 4. Multi-size Windows ICO
    ico_sizes = [(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)]
    ico_imgs = [app_icon_512.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_imgs[0].save(os.path.join(ROOT, "assets", "icon.ico"), format="ICO", sizes=ico_sizes, append_images=ico_imgs[1:])
    ico_imgs[0].save(os.path.join(ROOT, "desktop", "assets", "icon.ico"), format="ICO", sizes=ico_sizes, append_images=ico_imgs[1:])

    # 5. White Mascot Icons
    # assets/icon_white.png: 658x512
    icon_white_canvas = Image.new("RGBA", (658, 512), (0, 0, 0, 0))
    scale_w = min(560.0 / cw, 420.0 / ch)
    sw_w = int(round(cw * scale_w))
    sw_h = int(round(ch * scale_w))
    r_white = cropped_white.resize((sw_w, sw_h), Image.Resampling.LANCZOS)
    icon_white_canvas.paste(r_white, ((658 - sw_w) // 2, (512 - sw_h) // 2), r_white)
    icon_white_canvas.save(os.path.join(ROOT, "assets", "icon_white.png"), "PNG")
    icon_white_canvas.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "img", "icon_white.png"), "PNG")

    # desktop/assets/logo.png: 512x512 white mascot
    desktop_logo = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    scale_dl = min(460.0 / cw, 460.0 / ch)
    sdl_w = int(round(cw * scale_dl))
    sdl_h = int(round(ch * scale_dl))
    rdl = cropped_white.resize((sdl_w, sdl_h), Image.Resampling.LANCZOS)
    desktop_logo.paste(rdl, ((512 - sdl_w) // 2, (512 - sdl_h) // 2), rdl)
    desktop_logo.save(os.path.join(ROOT, "desktop", "assets", "logo.png"), "PNG")

    # desktop/assets/tray_mascot.png: 16x16 icon for desktop tray menu
    tray_mascot = app_icon_512.resize((16, 16), Image.Resampling.LANCZOS)
    tray_mascot.save(os.path.join(ROOT, "desktop", "assets", "tray_mascot.png"), "PNG")

    # 6. Admin PWA / Favicon icons
    icon_192 = app_icon_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "icon-192.png"), "PNG")
    icon_192.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.AdminApi.TestClient", "wwwroot", "icon-192.png"), "PNG")

    icon_32 = app_icon_512.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.Client", "wwwroot", "favicon.png"), "PNG")
    icon_32.save(os.path.join(ROOT, "extra", "admin-api", "Utilities", "Spacebar.AdminApi.TestClient", "wwwroot", "favicon.png"), "PNG")

    # 7. Horizontal Logos (340x68 RGBA)
    old_logo = Image.open(OLD_LOGO_SRC).convert("RGBA")
    text_part = np.array(old_logo)[:, 70:, :] # Discord blurple text #5865F2

    logo_emblem_h = 40
    logo_emblem_w = int(round(cw * (logo_emblem_h / ch)))
    pos_emblem_x = (70 - logo_emblem_w) // 2
    pos_emblem_y = (68 - logo_emblem_h) // 2

    # A) Discord Blurple Logo
    logo_blurple = Image.new("RGBA", (340, 68), (0, 0, 0, 0))
    logo_blurple.paste(Image.fromarray(text_part, "RGBA"), (70, 0))
    r_logo_blurple = cropped_blurple.resize((logo_emblem_w, logo_emblem_h), Image.Resampling.LANCZOS)
    logo_blurple.paste(r_logo_blurple, (pos_emblem_x, pos_emblem_y), r_logo_blurple)

    for p in [
        os.path.join(ROOT, "assets", "logo.png"),
        os.path.join(ROOT, "assets", "public", "logo.png"),
        os.path.join(ROOT, "assets", "public", "zycord_logo.png"),
        os.path.join(ROOT, "assets", "public", "branding", "zycord_logo.png"),
    ]:
        logo_blurple.save(p, "PNG")

    # B) White Logo
    text_white = text_part.copy()
    mask_text = text_white[:, :, 3] > 10
    text_white[mask_text, 0] = 255
    text_white[mask_text, 1] = 255
    text_white[mask_text, 2] = 255

    logo_white = Image.new("RGBA", (340, 68), (0, 0, 0, 0))
    logo_white.paste(Image.fromarray(text_white, "RGBA"), (70, 0))
    r_logo_white = cropped_white.resize((logo_emblem_w, logo_emblem_h), Image.Resampling.LANCZOS)
    logo_white.paste(r_logo_white, (pos_emblem_x, pos_emblem_y), r_logo_white)

    for p in [
        os.path.join(ROOT, "assets", "public", "zycord_logo_white.png"),
        os.path.join(ROOT, "assets", "public", "branding", "zycord_logo_white.png"),
    ]:
        logo_white.save(p, "PNG")

    # 8. Vector SVGs
    def to_b64(pil_img):
        buf = BytesIO()
        pil_img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("ascii")

    # Favicon SVG (Squircle + White Mascot)
    favicon_b64 = to_b64(app_icon_512)
    svg_favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,{favicon_b64}"/>
</svg>
'''
    for p in [
        os.path.join(ROOT, "assets", "public", "favicon.svg"),
        os.path.join(ROOT, "assets", "public", "branding", "favicon.svg"),
    ]:
        with open(p, "w", encoding="utf-8") as f:
            f.write(svg_favicon)

    # Mascot mark SVGs (#5865F2 Blurple)
    blurple_mark_b64 = to_b64(cropped_blurple)
    svg_mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}" width="{cw}" height="{ch}">
  <image width="{cw}" height="{ch}" href="data:image/png;base64,{blurple_mark_b64}"/>
</svg>
'''
    for p in [
        os.path.join(ROOT, "assets", "public", "branding", "zycord-icon.svg"),
        os.path.join(ROOT, "assets", "public", "branding", "zycord.svg"),
    ]:
        with open(p, "w", encoding="utf-8") as f:
            f.write(svg_mark)

    # Horizontal Logo SVGs
    b64_logo_blurple = to_b64(logo_blurple)
    svg_logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 68" width="340" height="68">
  <image width="340" height="68" href="data:image/png;base64,{b64_logo_blurple}"/>
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord_logo.svg"), "w", encoding="utf-8") as f:
        f.write(svg_logo)

    b64_logo_white = to_b64(logo_white)
    svg_logo_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 68" width="340" height="68">
  <image width="340" height="68" href="data:image/png;base64,{b64_logo_white}"/>
</svg>
'''
    with open(os.path.join(ROOT, "assets", "public", "branding", "zycord_logo_white.svg"), "w", encoding="utf-8") as f:
        f.write(svg_logo_white)

    print("All assets successfully generated!")

if __name__ == "__main__":
    main()
