/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { Response } from "express";
import { Config } from "./Config";
import { ASSETS_FOLDER } from "./Constants";
import { DEFAULT_AVATAR_COLORS } from "./DefaultAvatars";

export const INSTANCE_ICON_PATH =
    "M6.25 4.42L6.8 4.51L6.8 4.6L7.16 4.7L7.25 4.88L7.43 4.88L7.62 5.15L7.8 5.15L9.08 6.61L9.53 6.52L9.53 6.43L9.9 6.43L9.9 6.34L10.27 6.34L10.27 6.25L10.81 6.25L10.81 6.16L13.19 6.16L13.19 6.25L13.73 6.25L13.73 6.34L14.1 6.34L14.1 6.43L14.47 6.43L14.47 6.52L14.92 6.61L16.11 5.24L16.29 5.24L16.57 4.88L16.75 4.88L16.84 4.7L17.02 4.7L17.2 4.51L17.48 4.51L17.48 4.42L18.03 4.51L18.39 4.88L18.39 5.06L18.57 5.15L18.57 5.43L18.76 5.61L18.94 6.52L19.21 6.52L19.21 6.43L19.4 6.43L19.76 6.16L20.03 6.16L20.13 5.97L20.67 5.79L21.04 5.43L21.22 5.43L22.13 4.51L22.5 4.6L22.5 5.43L22.41 5.43L22.41 5.79L22.32 5.79L22.32 6.07L22.23 6.07L22.13 6.43L21.95 6.52L21.77 6.98L21.22 7.53L20.95 7.62L20.95 7.71L21.22 7.71L21.22 7.62L21.5 7.62L21.5 7.53L21.68 7.53L21.68 7.43L22.32 7.16L22.41 7.25L22.32 7.98L22.23 7.98L22.04 8.53L21.13 9.44L20.77 9.53L20.67 9.72L20.4 9.72L20.4 9.9L20.49 9.81L21.22 9.81L21.22 9.72L21.59 9.72L21.68 9.9L21.59 9.9L21.5 10.27L21.31 10.36L21.31 10.54L20.77 11.09L20.58 11.09L20.22 11.45L19.85 11.54L19.94 12.09L20.03 12.09L20.03 12.37L20.13 12.37L20.13 12.73L20.22 12.73L20.22 13.1L20.31 13.1L20.31 13.46L20.4 13.46L20.4 13.92L20.49 13.92L20.49 14.37L20.58 14.37L20.58 15.01L20.67 15.01L20.67 15.65L20.77 15.65L20.77 17.75L20.67 17.75L20.67 18.12L20.58 18.12L20.49 18.57L20.31 18.67L20.31 18.85L19.94 19.21L19.76 19.21L19.4 19.49L18.94 19.49L18.94 19.58L18.57 19.58L18.57 19.49L17.84 19.3L16.57 18.03L16.57 17.84L16.11 17.39L16.11 17.2L15.83 17.02L15.83 16.84L15.56 16.75L15.47 16.57L15.1 16.47L15.1 16.38L8.9 16.38L8.9 16.47L8.71 16.47L8.44 16.75L8.17 16.84L8.17 17.02L7.71 17.48L7.71 17.66L7.43 17.84L7.43 18.03L7.07 18.3L7.07 18.48L6.52 19.03L6.34 19.03L5.97 19.4L5.06 19.58L5.06 19.49L4.7 19.49L4.7 19.4L4.42 19.4L4.15 19.12L3.97 19.12L3.69 18.85L3.69 18.67L3.51 18.57L3.42 18.03L3.33 18.03L3.33 17.75L3.23 17.75L3.23 15.74L3.33 15.74L3.42 14.37L3.51 14.37L3.6 13.46L3.69 13.46L3.69 13.1L3.78 13.1L3.78 12.73L3.87 12.73L3.87 12.37L3.97 12.37L3.97 12.09L4.06 12.09L4.15 11.54L3.97 11.54L3.69 11.27L3.51 11.27L3.42 11.09L3.23 11.09L2.69 10.54L2.69 10.36L2.5 10.27L2.5 10.08L2.32 9.9L2.41 9.72L2.87 9.72L2.87 9.81L3.6 9.81L3.6 9.72L3.33 9.72L3.23 9.53L2.78 9.35L2.05 8.62L2.05 8.44L1.77 8.17L1.68 7.62L1.59 7.62L1.68 7.16L2.32 7.43L2.32 7.53L2.5 7.53L2.5 7.62L3.05 7.71L3.05 7.8L3.14 7.71L2.96 7.53L2.78 7.53L2.23 6.98L2.05 6.52L1.87 6.43L1.77 5.97L1.59 5.79L1.59 5.33L1.5 5.33L1.5 4.6L1.87 4.51L2.32 5.06L2.5 5.06L2.69 5.33L2.87 5.33L3.33 5.79L3.51 5.79L3.51 5.88L3.87 5.97L3.97 6.16L4.24 6.16L4.24 6.25L4.42 6.25L4.79 6.52L5.06 6.52L5.15 5.88L5.24 5.88L5.24 5.61L5.43 5.43L5.43 5.15L5.61 5.06L5.61 4.88L5.97 4.51L6.25 4.51ZM8.17 10.17L8.07 10.17L8.07 10.27L7.89 10.27L7.89 10.36L7.71 10.36L7.71 10.45L7.53 10.45L7.53 10.54L7.43 10.54L7.43 10.63L7.34 10.63L7.25 10.81L7.16 10.81L7.16 11.0L6.98 11.09L6.98 11.27L6.89 11.27L6.89 11.54L6.8 11.54L6.8 12.46L6.89 12.46L6.89 12.73L6.98 12.73L6.98 12.91L7.16 13.0L7.16 13.19L7.25 13.19L7.25 13.28L7.34 13.28L7.43 13.46L7.62 13.46L7.71 13.64L7.89 13.64L7.89 13.73L8.17 13.73L8.17 13.83L9.17 13.83L9.17 13.73L9.44 13.73L9.44 13.64L9.63 13.64L9.63 13.55L9.72 13.55L9.72 13.46L9.9 13.46L9.9 13.37L10.08 13.28L10.08 13.1L10.27 13.0L10.27 12.82L10.36 12.82L10.36 12.64L10.45 12.64L10.45 12.27L10.54 12.27L10.54 11.73L10.45 11.73L10.45 11.36L10.36 11.36L10.36 11.09L10.17 11.0L10.17 10.81L10.08 10.81L10.08 10.72L9.99 10.72L9.9 10.54L9.72 10.54L9.63 10.36L9.44 10.36L9.44 10.27L9.17 10.27L9.17 10.17L8.26 10.17ZM14.92 10.17L14.83 10.17L14.83 10.27L14.56 10.27L14.56 10.36L14.37 10.36L14.28 10.54L14.1 10.54L14.1 10.63L14.01 10.63L14.01 10.72L13.83 10.81L13.83 11.0L13.73 11.0L13.73 11.18L13.64 11.18L13.64 11.36L13.55 11.36L13.55 11.73L13.46 11.73L13.46 12.27L13.55 12.27L13.55 12.64L13.64 12.64L13.73 13.0L13.92 13.1L13.92 13.28L14.01 13.28L14.1 13.46L14.28 13.46L14.37 13.64L14.56 13.64L14.56 13.73L14.83 13.73L14.83 13.83L15.83 13.83L15.83 13.73L16.11 13.73L16.11 13.64L16.29 13.64L16.38 13.46L16.57 13.46L16.57 13.37L16.66 13.37L16.66 13.28L16.84 13.19L16.84 13.0L17.02 12.91L17.02 12.73L17.11 12.73L17.11 12.46L17.2 12.46L17.2 11.54L17.11 11.54L17.11 11.27L17.02 11.27L16.93 10.9L16.84 10.9L16.84 10.81L16.75 10.81L16.75 10.72L16.66 10.72L16.66 10.63L16.47 10.54L16.47 10.45L16.29 10.45L16.29 10.36L16.11 10.36L16.11 10.27L15.93 10.27L15.93 10.17L15.01 10.17Z";
export const INSTANCE_WHISKERS_PATH = "";
export const DEFAULT_FAVICON_FILE = path.join(ASSETS_FOLDER, "public", "branding", "favicon.svg");

export const DEFAULT_ICON_FILE = path.join(ASSETS_FOLDER, "icon.png");

export type BrandImage = { url: string } | { file: string };

export const resolveBrandImage = (value?: string | null): BrandImage | null => {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return { url: trimmed };
    const file = path.resolve(ASSETS_FOLDER, "..", trimmed);
    return fs.statSync(file, { throwIfNoEntry: false })?.isFile() ? { file } : null;
};

export const instanceIcon = () => resolveBrandImage(Config.get().client.icon) ?? resolveBrandImage(Config.get().general.image);

export const instanceLogo = () => resolveBrandImage(Config.get().client.logo);

export const instanceName = () => Config.get().client.instanceName || Config.get().general.instanceName || "Zycord";

export const helpUrl = () => {
    const url = Config.get().client.helpUrl?.trim();
    return url && /^https?:\/\//i.test(url) ? url : null;
};

const version = (image: BrandImage) => createHash("sha1").update(JSON.stringify(image)).digest("hex").slice(0, 8);

export const brandImageUrls = () => {
    const icon = instanceIcon();
    const logo = instanceLogo();
    return {
        icon: icon ? `/static/logo.png?v=${version(icon)}` : null,
        logo: logo ? `/static/wordmark?v=${version(logo)}` : null,
    };
};

export const BRAND_COLOR = "#5865F2";

export const instanceIconTile = () => {
    const { icon } = brandImageUrls();
    if (icon) return `<img class="brand-icon" src="${escapeXml(icon)}" alt="" />`;
    return `<svg class="brand-icon" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="15" fill="${BRAND_COLOR}"/><g transform="translate(6 6) scale(1.5)" fill="#fff"><path fill-rule="evenodd" d="${INSTANCE_ICON_PATH}"/><path d="${INSTANCE_WHISKERS_PATH}"/></g></svg>`;
};

const computeAssetBundleVersion = (): string => {
    try {
        const h = createHash("sha1");
        for (const rel of [
            ["public", "site", "site.js"],
            ["public", "site", "site.css"],
            ["public", "developers", "portal-shell.js"],
            ["public", "admin", "admin-shell.js"],
            ["public", "status", "status.js"],
        ]) {
            const p = path.join(ASSETS_FOLDER, ...rel);
            const buf = fs.existsSync(p) ? fs.readFileSync(p) : null;
            if (buf) h.update(buf);
        }
        return h.digest("hex").slice(0, 10);
    } catch {
        return Date.now().toString(36);
    }
};

export const ASSET_BUNDLE_VERSION = computeAssetBundleVersion();

export const brandPage = (html: string) => {
    const bundleVersion = computeAssetBundleVersion();
    return html
        .replaceAll("__INSTANCE_NAME__", escapeXml(instanceName()))
        .replaceAll("__INSTANCE_ICON__", instanceIconTile())
        .replace(/"\/site\/site\.css(?:\?v=[^"]*)?"/g, `"/site/site.css?v=${bundleVersion}"`)
        .replace(/"\/site\/site\.js(?:\?v=[^"]*)?"/g, `"/site/site.js?v=${bundleVersion}"`)
        .replace(/"\/developers\/portal\.css(?:\?v=[^"]*)?"/g, `"/developers/portal.css?v=${bundleVersion}"`)
        .replace(/"\/developers\/portal\.js(?:\?v=[^"]*)?"/g, `"/developers/portal.js?v=${bundleVersion}"`)
        .replace(/"\/developers\/portal-shell\.js(?:\?v=[^"]*)?"/g, `"/developers/portal-shell.js?v=${bundleVersion}"`)
        .replace(/"\/admin\/admin\.css(?:\?v=[^"]*)?"/g, `"/admin/admin.css?v=${bundleVersion}"`)
        .replace(/"\/admin\/admin\.js(?:\?v=[^"]*)?"/g, `"/admin/admin.js?v=${bundleVersion}"`)
        .replace(/"\/admin\/admin-shell\.js(?:\?v=[^"]*)?"/g, `"/admin/admin-shell.js?v=${bundleVersion}"`)
        .replace(/"\/status\/status\.css(?:\?v=[^"]*)?"/g, `"/status/status.css?v=${bundleVersion}"`)
        .replace(/"\/status\/status\.js(?:\?v=[^"]*)?"/g, `"/status/status.js?v=${bundleVersion}"`);
};

export const sendBrandImage = (res: Response, image: BrandImage, cacheControl = "public, max-age=21600") => {
    res.set("Cache-Control", cacheControl);
    if ("url" in image) return res.redirect(302, image.url);
    return res.sendFile(image.file, { cacheControl: false, dotfiles: "allow" });
};

const remoteIcons = new Map<string, Promise<string | null>>();

const MIME_TYPES: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
};

const fetchDataUri = async (url: string) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) }).catch(() => null);
    const type = res?.headers.get("content-type")?.split(";")[0];
    if (!res?.ok || !type?.startsWith("image/")) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
};

export const instanceIconDataUri = async () => {
    const icon = instanceIcon();
    if (!icon) return null;
    if ("file" in icon) {
        const data = await fs.promises.readFile(icon.file).catch(() => null);
        return data ? `data:${MIME_TYPES[path.extname(icon.file).toLowerCase()] ?? "image/png"};base64,${data.toString("base64")}` : null;
    }
    if (!remoteIcons.has(icon.url)) {
        const pending = fetchDataUri(icon.url);
        remoteIcons.set(icon.url, pending);
        void pending.then((uri) => uri ?? remoteIcons.delete(icon.url));
    }
    return remoteIcons.get(icon.url) ?? null;
};

const escapeXml = (text: string) => text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

const iconMarkup = (x: number, y: number, size: number, iconUri: string | null) =>
    iconUri
        ? `<image href="${escapeXml(iconUri)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`
        : `<g fill="#fff" transform="translate(${x} ${y}) scale(${size / 24})"><path fill-rule="evenodd" d="${INSTANCE_ICON_PATH}"/><path d="${INSTANCE_WHISKERS_PATH}"/></g>`;

export const wordmarkSvg = (box?: [number, number], iconUri: string | null = null) => {
    const name = instanceName();
    const width = Math.ceil(34 + [...name].length * 12.5);
    const [boxWidth, boxHeight] = box ?? [width, 24];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${width} 24" fill="none">${iconMarkup(0, 0, 24, iconUri)}<text x="32" y="19.5" fill="#fff" font-family="'gg sans','Noto Sans','Helvetica Neue',Helvetica,Arial,sans-serif" font-size="20" font-weight="800">${escapeXml(name)}</text></svg>`;
};

export const qrLogoSvg = (iconUri: string | null = null) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#000"/>${iconMarkup(23, 23, 54, iconUri)}</svg>`;

export const placeholderAvatarSvg = (size: number, background: string, foreground: string, iconUri: string | null = null) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256"><circle cx="128" cy="128" r="128" fill="${background}"/>${
        iconUri
            ? `<image href="${escapeXml(iconUri)}" x="62" y="62" width="132" height="132" preserveAspectRatio="xMidYMid meet" opacity="0.6"/>`
            : `<g fill="${foreground}" transform="translate(62 62) scale(5.5)"><path fill-rule="evenodd" d="${INSTANCE_ICON_PATH}"/><path d="${INSTANCE_WHISKERS_PATH}"/></g>`
    }</svg>`;

export const APP_THEME_COLOR = "#121214";

const appIcons = new Map<string, Promise<Buffer | null>>();

const renderAppIcon = async (image: BrandImage, size: number) => {
    const { Jimp } = await import("jimp");
    const source =
        "file" in image ? image.file : await fetch(image.url, { signal: AbortSignal.timeout(5000) }).then(async (res) => (res.ok ? Buffer.from(await res.arrayBuffer()) : null));
    if (!source) return null;
    const icon = await Jimp.read(source);
    if ("file" in image && image.file === DEFAULT_ICON_FILE) return icon.resize({ w: size, h: size }).getBuffer("image/png");
    const inner = Math.round(size * 0.62);
    icon.scaleToFit({ w: inner, h: inner });
    const canvas = new Jimp({ width: size, height: size, color: parseInt(`${APP_THEME_COLOR.slice(1)}ff`, 16) });
    canvas.composite(icon, Math.round((size - icon.bitmap.width) / 2), Math.round((size - icon.bitmap.height) / 2));
    return canvas.getBuffer("image/png");
};

export const appIconPng = (size: number) => {
    const image = instanceIcon() ?? { file: DEFAULT_ICON_FILE };
    const key = `${version(image)}:${size}`;
    let pending = appIcons.get(key);
    if (!pending) {
        if (appIcons.size > 16) appIcons.clear();
        pending = renderAppIcon(image, size).catch(() => null);
        appIcons.set(key, pending);
        void pending.then((png) => png ?? appIcons.delete(key));
    }
    return pending.then((png) => png ?? renderAppIcon({ file: DEFAULT_ICON_FILE }, size).catch(() => null));
};

export const appIconUrl = (size: number) => `/assets/pwa/icon-${size}.png?v=${version(instanceIcon() ?? { file: DEFAULT_ICON_FILE })}`;

export const appManifest = () => {
    const name = instanceName();
    return {
        id: "/app",
        name,
        short_name: name,
        start_url: "/app",
        scope: "/",
        display: "standalone",
        background_color: APP_THEME_COLOR,
        theme_color: APP_THEME_COLOR,
        icons: [192, 512].flatMap((size) => ["any", "maskable"].map((purpose) => ({ src: appIconUrl(size), sizes: `${size}x${size}`, type: "image/png", purpose }))),
    };
};

export const defaultAvatarSvg = (index: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="${DEFAULT_AVATAR_COLORS[index % DEFAULT_AVATAR_COLORS.length]}"/><g fill="#fff" transform="translate(53 54) scale(6.25)"><path fill-rule="evenodd" d="${INSTANCE_ICON_PATH}"/><path d="${INSTANCE_WHISKERS_PATH}"/></g></svg>`;
