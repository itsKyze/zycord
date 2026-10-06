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

import { Router, Response, Request } from "express";
import { HTTPError } from "lambert-server/HTTPError";
import { fileTypeFromBuffer } from "file-type";
import { storage, setCacheControl, setCacheControlNotFound, multer, validateServerAuth, fetchUpstreamAsset, sendAsset } from "../../../util";
import { Config, Collectibles, CollectibleItemType } from "@spacebar/util";
import crypto from "node:crypto";

const ANIMATED_MIME_TYPES = ["image/apng", "image/gif", "image/gifv"];
const STATIC_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml", "image/svg"];

const PALETTE_COLORS: Record<string, [string, string, string]> = {
    crimson: ["#fb7185", "#e11d48", "#4c0519"],
    berry: ["#f0abfc", "#c026d3", "#581c87"],
    sky: ["#7dd3fc", "#0284c7", "#0c4a6e"],
    teal: ["#5eead4", "#0d9488", "#134e4a"],
    forest: ["#86efac", "#16a34a", "#14532d"],
    bubble_gum: ["#f472b6", "#ec4899", "#831843"],
    violet: ["#c084fc", "#8b5cf6", "#4c1d95"],
    cobalt: ["#93c5fd", "#3b82f6", "#1e3a8a"],
    clover: ["#86efac", "#22c55e", "#14532d"],
    lemon: ["#fde047", "#eab308", "#713f12"],
    white: ["#ffffff", "#cbd5e1", "#475569"],
    black: ["#94a3b8", "#334155", "#090d16"],
};

function getThemeColors(label: string): [string, string, string] {
    const l = (label || "").toLowerCase();
    if (l.includes("sakura") || l.includes("blossom") || l.includes("pink") || l.includes("bunny") || l.includes("cloud")) return PALETTE_COLORS.bubble_gum;
    if (l.includes("katana") || l.includes("ninja") || l.includes("crimson") || l.includes("blood") || l.includes("fire") || l.includes("inferno")) return PALETTE_COLORS.crimson;
    if (l.includes("cyber") || l.includes("matrix") || l.includes("tech") || l.includes("holo")) return PALETTE_COLORS.teal;
    if (l.includes("gold") || l.includes("royal") || l.includes("sun") || l.includes("lemon")) return PALETTE_COLORS.lemon;
    if (l.includes("arcane") || l.includes("runestone") || l.includes("magic") || l.includes("mystic") || l.includes("violet")) return PALETTE_COLORS.violet;
    if (l.includes("frost") || l.includes("ice") || l.includes("glacial") || l.includes("sky")) return PALETTE_COLORS.sky;
    if (l.includes("goth") || l.includes("skull") || l.includes("dark") || l.includes("cursed") || l.includes("void")) return PALETTE_COLORS.black;
    if (l.includes("pixel") || l.includes("arcade") || l.includes("synth") || l.includes("clover")) return PALETTE_COLORS.clover;
    if (l.includes("star") || l.includes("galaxy") || l.includes("celestial") || l.includes("cosmic") || l.includes("cobalt")) return PALETTE_COLORS.cobalt;
    return PALETTE_COLORS.violet;
}

export function generateNameplateSvg(label: string, paletteName: string = "violet"): Buffer {
    const safeLabel = (label || "Nameplate").replace(/[<>&"]/g, "");
    const [cLight, cMain, cDark] = PALETTE_COLORS[paletteName] ?? getThemeColors(safeLabel);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72">
  <defs>
    <linearGradient id="npPlateBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cDark}" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="${cMain}" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="${cDark}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="npBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${cLight}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${cLight}" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="npShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="npClip">
      <rect x="2" y="2" width="296" height="68" rx="14"/>
    </clipPath>
  </defs>

  <!-- Background Plaque -->
  <rect x="2" y="2" width="296" height="68" rx="14" fill="url(#npPlateBg)" stroke="url(#npBorderGrad)" stroke-width="1.8"/>

  <!-- Left Thematic Crest Insignia -->
  <g transform="translate(14, 18)">
    <circle cx="18" cy="18" r="15" fill="${cDark}" stroke="${cLight}" stroke-width="1.5" opacity="0.85"/>
    <path d="M18 7 L21 14 L29 18 L21 22 L18 29 L15 22 L7 18 L15 14 Z" fill="${cLight}" opacity="0.95">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
    </path>
    <circle cx="18" cy="18" r="3" fill="#ffffff"/>
  </g>

  <!-- Right Decorative Speed Lines -->
  <line x1="260" y1="20" x2="280" y2="20" stroke="${cLight}" stroke-width="1.5" opacity="0.4"/>
  <line x1="250" y1="28" x2="280" y2="28" stroke="${cLight}" stroke-width="1.5" opacity="0.6"/>
  <line x1="264" y1="36" x2="280" y2="36" stroke="${cLight}" stroke-width="1.5" opacity="0.4"/>

  <!-- Typography -->
  <text x="58" y="42" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" letter-spacing="0.4">${safeLabel}</text>

  <!-- Animated Shimmer Sweep -->
  <g clip-path="url(#npClip)">
    <rect x="-120" y="0" width="90" height="72" fill="url(#npShimmer)">
      <animateTransform attributeName="transform" type="translate" from="-140 0" to="440 0" dur="2.6s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>`;
    return Buffer.from(svg, "utf8");
}

export function generateFrameLayerSvg(label: string): Buffer {
    const safeLabel = (label || "Profile Frame").replace(/[<>&"]/g, "");
    const [cLight, cMain, cDark] = getThemeColors(safeLabel);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1312" height="1200" viewBox="0 0 1312 1200">
  <defs>
    <linearGradient id="fCrownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${cDark}"/>
      <stop offset="30%" stop-color="${cMain}"/>
      <stop offset="50%" stop-color="${cLight}">
        <animate attributeName="stop-color" values="${cLight};#ffffff;${cLight}" dur="2.5s" repeatCount="indefinite"/>
      </stop>
      <stop offset="70%" stop-color="${cMain}"/>
      <stop offset="100%" stop-color="${cDark}"/>
    </linearGradient>
    <linearGradient id="fRailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${cLight}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="${cMain}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${cLight}" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="fGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Side Rails (Left & Right hugging inner card x=56 to 1256) -->
  <line x1="56" y1="70" x2="56" y2="1130" stroke="url(#fRailGrad)" stroke-width="4" filter="url(#fGlow)"/>
  <line x1="1256" y1="70" x2="1256" y2="1130" stroke="url(#fRailGrad)" stroke-width="4" filter="url(#fGlow)"/>

  <!-- Top Border Bar -->
  <line x1="100" y1="40" x2="1212" y2="40" stroke="${cMain}" stroke-width="3" opacity="0.8"/>

  <!-- Bottom Border Bar -->
  <line x1="100" y1="1160" x2="1212" y2="1160" stroke="${cMain}" stroke-width="3" opacity="0.8"/>

  <!-- Top Center Ornamental Crown / Crest -->
  <g transform="translate(656, 40)" filter="url(#fGlow)">
    <path d="M-180 0 C-110 -25 -50 -38 0 -48 C50 -38 110 -25 180 0 L150 18 C100 -2 50 -14 0 -22 C-50 -14 -100 -2 -150 18 Z" fill="url(#fCrownGrad)"/>
    <circle cx="0" cy="-48" r="14" fill="${cLight}" stroke="#ffffff" stroke-width="3">
      <animate attributeName="r" values="13;16;13" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M-12 0 L0 -14 L12 0 L0 14 Z" fill="#ffffff" transform="translate(0, -48)"/>
    <circle cx="-120" cy="-14" r="7" fill="${cLight}"/>
    <circle cx="120" cy="-14" r="7" fill="${cLight}"/>
  </g>

  <!-- Top-Left Corner Bracket -->
  <g transform="translate(56, 40)" filter="url(#fGlow)">
    <path d="M0 60 L0 0 L60 0 L40 18 L18 18 L18 40 Z" fill="${cLight}"/>
    <circle cx="28" cy="28" r="5" fill="#ffffff"/>
  </g>

  <!-- Top-Right Corner Bracket -->
  <g transform="translate(1256, 40)" filter="url(#fGlow)">
    <path d="M0 60 L0 0 L-60 0 L-40 18 L-18 18 L-18 40 Z" fill="${cLight}"/>
    <circle cx="-28" cy="28" r="5" fill="#ffffff"/>
  </g>

  <!-- Bottom-Left Corner Bracket -->
  <g transform="translate(56, 1160)" filter="url(#fGlow)">
    <path d="M0 -60 L0 0 L60 0 L40 -18 L18 -18 L18 -40 Z" fill="${cLight}"/>
    <circle cx="28" cy="-28" r="5" fill="#ffffff"/>
  </g>

  <!-- Bottom-Right Corner Bracket -->
  <g transform="translate(1256, 1160)" filter="url(#fGlow)">
    <path d="M0 -60 L0 0 L-60 0 L-40 -18 L-18 -18 L-18 -40 Z" fill="${cLight}"/>
    <circle cx="-28" cy="-28" r="5" fill="#ffffff"/>
  </g>

  <!-- Bottom Center Plinth / Ribbon -->
  <g transform="translate(656, 1160)" filter="url(#fGlow)">
    <path d="M-130 0 C-70 18 -30 25 0 28 C30 25 70 18 130 0 L110 -12 C60 4 25 10 0 12 C-25 10 -60 4 -110 -12 Z" fill="url(#fCrownGrad)"/>
    <circle cx="0" cy="22" r="8" fill="${cLight}"/>
  </g>
</svg>`;
    return Buffer.from(svg, "utf8");
}

export function generateFrameThumbnailSvg(label: string): Buffer {
    const safeLabel = (label || "Profile Frame").replace(/[<>&"]/g, "");
    const [cLight, cMain, cDark] = getThemeColors(safeLabel);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="thBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18191c"/>
      <stop offset="50%" stop-color="#232428"/>
      <stop offset="100%" stop-color="#111214"/>
    </linearGradient>
    <linearGradient id="thBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cLight}"/>
      <stop offset="50%" stop-color="${cMain}"/>
      <stop offset="100%" stop-color="${cLight}">
        <animate attributeName="stop-color" values="${cLight};#ffffff;${cMain};${cLight}" dur="3.5s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <radialGradient id="thAvatarGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cMain}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${cDark}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="thShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="thClip">
      <rect x="28" y="20" width="264" height="280" rx="20"/>
    </clipPath>
  </defs>

  <!-- Outer Card Frame Mockup -->
  <rect x="28" y="20" width="264" height="280" rx="20" fill="url(#thBgGrad)" stroke="url(#thBorder)" stroke-width="2.5"/>

  <!-- Top Crown Accent -->
  <path d="M110 20 C135 12 150 7 160 5 C170 7 185 12 210 20 Z" fill="${cLight}"/>
  <circle cx="160" cy="10" r="4.5" fill="#ffffff"/>

  <!-- Four Framed Corners -->
  <path d="M28 45 L28 20 L53 20" stroke="${cLight}" stroke-width="3.5" fill="none"/>
  <path d="M292 45 L292 20 L267 20" stroke="${cLight}" stroke-width="3.5" fill="none"/>
  <path d="M28 275 L28 300 L53 300" stroke="${cLight}" stroke-width="3.5" fill="none"/>
  <path d="M292 275 L292 300 L267 300" stroke="${cLight}" stroke-width="3.5" fill="none"/>

  <!-- Center Avatar Circle Preview -->
  <circle cx="160" cy="120" r="48" fill="url(#thAvatarGlow)"/>
  <circle cx="160" cy="120" r="38" fill="#1e1f24" stroke="${cLight}" stroke-width="2.5"/>
  <circle cx="160" cy="106" r="14" fill="${cMain}" opacity="0.85"/>
  <path d="M136 138 C136 126 147 122 160 122 C173 122 184 126 184 138 Z" fill="${cMain}" opacity="0.85"/>

  <!-- Label Badge -->
  <rect x="48" y="228" width="224" height="34" rx="10" fill="#121316" stroke="${cMain}" stroke-width="1.2" opacity="0.95"/>
  <text x="160" y="250" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" letter-spacing="0.4">${safeLabel}</text>

  <!-- Animated Shimmer -->
  <g clip-path="url(#thClip)">
    <rect x="-100" y="0" width="80" height="320" fill="url(#thShimmer)">
      <animateTransform attributeName="transform" type="translate" from="-120 0" to="440 0" dur="3s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>`;
    return Buffer.from(svg, "utf8");
}

function generateEffectSvg(label: string): Buffer {
    const safeLabel = (label || "Profile Effect").replace(/[<>&"]/g, "");
    const [cLight, cMain, cDark] = getThemeColors(safeLabel);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <radialGradient id="eglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cLight}" stop-opacity="0.9">
        <animate attributeName="stop-color" values="${cLight};${cMain};#ffffff;${cLight}" dur="3.5s" repeatCount="indefinite"/>
      </stop>
      <stop offset="60%" stop-color="${cMain}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="240" height="240" fill="#0f172a" fill-opacity="0.65" rx="20"/>
  <circle cx="120" cy="120" r="80" fill="url(#eglow)">
    <animate attributeName="r" values="75;88;75" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="120" r="42" fill="none" stroke="${cLight}" stroke-width="2" stroke-dasharray="8 6">
    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="6s" repeatCount="indefinite"/>
  </circle>
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="-360 120 120" dur="10s" repeatCount="indefinite"/>
    <polygon points="120,70 125,115 170,120 125,125 120,170 115,125 70,120 115,115" fill="#ffffff" opacity="0.95"/>
  </g>
  <text x="120" y="200" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="middle">${safeLabel}</text>
</svg>`;
    return Buffer.from(svg, "utf8");
}

async function resolveAvatarDecorationBuffer(assetHash: string, slot: "static" | "animated"): Promise<Buffer | null> {
    const passthrough = slot === "animated" || assetHash.startsWith("a_");
    const cacheKey = `avatar-decoration-presets-upstream/${assetHash}${passthrough ? "" : "-static"}`;
    const cached = await storage.get(cacheKey);
    if (cached) return cached;
    return fetchUpstreamAsset(
        cacheKey,
        `https://cdn.discordapp.com/avatar-decoration-presets/${assetHash}.png?size=240&passthrough=${passthrough}`,
    );
}

const router = Router({ mergeParams: true });

router.get("/:sku_id/static", setCacheControl, async (req: Request, res: Response) => {
    const { sku_id } = req.params as { [key: string]: string };
    const basePath = `collectibles-shop/${sku_id}`;

    let file: Buffer<ArrayBufferLike> | null = null;
    if (await storage.exists(basePath + "/static")) {
        file = await storage.get(basePath + "/static");
    } else if (await storage.exists(basePath + "/animated")) {
        file = await storage.get(basePath + "/animated");
    } else {
        return sendUpstream(req, res, `${sku_id}/static`, "static");
    }

    res.set("Access-Control-Allow-Origin", "*");
    return sendAsset(res, file!, `${sku_id}-static.png`);
});

router.get("/:sku_id/animated", setCacheControl, async (req: Request, res: Response) => {
    const { sku_id } = req.params as { [key: string]: string };
    const basePath = `collectibles-shop/${sku_id}`;

    let file: Buffer<ArrayBufferLike> | null = null;
    if (await storage.exists(basePath + "/animated")) {
        file = await storage.get(basePath + "/animated");
    } else {
        return sendUpstream(req, res, `${sku_id}/animated`, "animated");
    }

    res.set("Access-Control-Allow-Origin", "*");
    return sendAsset(res, file!, `${sku_id}-animated.png`);
});

// Any other art (nameplate videos, frame layers, etc.) is served from storage first
router.get("/*path", setCacheControl, async (req: Request, res: Response) => {
    const asset = ([req.params.path].flat() as string[]).join("/");
    if (!validAssetPath(asset)) return setCacheControlNotFound(req, res);
    const file = await storage.get(`collectibles-shop/${asset}`);
    if (!file) return sendUpstream(req, res, asset, "static");
    res.set("Access-Control-Allow-Origin", "*");
    return sendAsset(res, file, asset);
});

export const validAssetPath = (asset: string) => {
    const segments = asset.split("/");
    return segments.length <= 5 && segments.every((x) => /^[a-z0-9_\-\.]{1,64}$/i.test(x));
};

async function sendUpstream(req: Request, res: Response, asset: string, slot: "static" | "animated" = "static") {
    if (!validAssetPath(asset)) return setCacheControlNotFound(req, res);
    const path = `collectibles-shop-upstream/${asset}`;
    let file = (await storage.get(path)) ?? (await fetchUpstreamAsset(path, `https://cdn.discordapp.com/media/v1/collectibles-shop/${asset}`));

    if (!file && asset.endsWith("/animated")) {
        const staticAsset = asset.replace(/\/animated$/, "/static");
        const staticPath = `collectibles-shop-upstream/${staticAsset}`;
        file = (await storage.get(staticPath)) ?? (await fetchUpstreamAsset(staticPath, `https://cdn.discordapp.com/media/v1/collectibles-shop/${staticAsset}`));
    }

    if (!file) {
        // Fallback: look up sku_id in catalog
        const cleanAsset = asset.replace(/\.[a-z0-9]+$/i, "");
        const skuId = cleanAsset.split("/")[0];
        try {
            const product = await Collectibles.product(skuId);
            const item = (await Collectibles.item(skuId)) ?? product?.items?.[0];

            if (item) {
                if (item.type === CollectibleItemType.AVATAR_DECORATION || (item.asset && /^(a_)?[0-9a-f]{32}$/i.test(item.asset))) {
                    const effectiveSlot = (slot === "animated" || item.asset?.startsWith("a_")) ? "animated" : "static";
                    const decoBuffer = await resolveAvatarDecorationBuffer(item.asset!, effectiveSlot);
                    if (decoBuffer) {
                        file = decoBuffer;
                        await storage.set(`collectibles-shop/${asset}`, decoBuffer);
                        if (effectiveSlot === "animated") {
                            await storage.set(`collectibles-shop/${skuId}/animated`, decoBuffer);
                        }
                    }
                } else if (item.type === CollectibleItemType.NAMEPLATE) {
                    const svgBuffer = generateNameplateSvg(item.label || product?.name || "Nameplate", ((item as any).palette as string) || "violet");
                    file = svgBuffer;
                    await storage.set(`collectibles-shop/${asset}`, svgBuffer);
                } else if (item.type === CollectibleItemType.PROFILE_FRAME) {
                    const segments = cleanAsset.split("/");
                    const isLayer = segments.length >= 2 && segments[1] !== "static" && segments[1] !== "animated" && segments[1] !== "thumbnail";
                    const svgBuffer = isLayer
                        ? generateFrameLayerSvg(item.label || product?.name || "Profile Frame")
                        : generateFrameThumbnailSvg(item.label || product?.name || "Profile Frame");
                    file = svgBuffer;
                    await storage.set(`collectibles-shop/${asset}`, svgBuffer);
                } else if (item.type === CollectibleItemType.PROFILE_EFFECT) {
                    const effectTitle = ((item as any).title as string) || product?.name || "Profile Effect";
                    const svgBuffer = generateEffectSvg(effectTitle);
                    file = svgBuffer;
                    await storage.set(`collectibles-shop/${asset}`, svgBuffer);
                } else {
                    const fallbackSvg = generateEffectSvg(product?.name || "Collectible");
                    file = fallbackSvg;
                    await storage.set(`collectibles-shop/${asset}`, fallbackSvg);
                }
            }
        } catch (_) {}
    }

    if (!file) {
        // As a last-ditch fallback for animated, if static exists
        const skuId = asset.split("/")[0];
        if (slot === "animated" && (await storage.exists(`collectibles-shop/${skuId}/static`))) {
            file = await storage.get(`collectibles-shop/${skuId}/static`);
        }
    }

    if (!file) return setCacheControlNotFound(req, res);
    res.set("Access-Control-Allow-Origin", "*");
    return sendAsset(res, file, asset);
}

router.post("/:sku_id/animated", validateServerAuth, multer.single("file"), async (req: Request, res: Response) => {
    if (!req.file) throw new HTTPError("Missing file");
    const { buffer, size } = req.file;
    const { sku_id } = req.params as { [key: string]: string };

    let hash = crypto.createHash("md5").update(buffer).digest("hex");

    const type = await fileTypeFromBuffer(buffer);
    if (!type || !ANIMATED_MIME_TYPES.includes(type.mime)) throw new HTTPError("Invalid file type");
    if (ANIMATED_MIME_TYPES.includes(type.mime)) hash = `a_${hash}`;

    const path = `collectibles-shop/${sku_id}/animated`;
    await storage.set(path, buffer);

    return res.json({
        id: sku_id,
        hash: hash,
        content_type: type.mime,
        size,
        url: `${Config.get().cdn.endpointPublic}media/v1/collectibles-shop/${sku_id}/animated`,
    });
});

router.post("/:sku_id/static", validateServerAuth, multer.single("file"), async (req: Request, res: Response) => {
    if (!req.file) throw new HTTPError("Missing file");
    const { buffer, size } = req.file;
    const { sku_id } = req.params as { [key: string]: string };

    const hash = crypto.createHash("md5").update(buffer).digest("hex");

    const type = await fileTypeFromBuffer(buffer);
    if (!type || !STATIC_MIME_TYPES.includes(type.mime)) throw new HTTPError("Invalid file type");

    const path = `collectibles-shop/${sku_id}/static`;
    await storage.set(path, buffer);

    return res.json({
        id: sku_id,
        hash: hash,
        content_type: type.mime,
        size,
        url: `${Config.get().cdn.endpointPublic}media/v1/collectibles-shop/${sku_id}/static`,
    });
});

const UPLOAD_MIME_TYPES = [...STATIC_MIME_TYPES, ...ANIMATED_MIME_TYPES, "video/webm", "video/mp4"];

router.post("/*path", validateServerAuth, multer.single("file"), async (req: Request, res: Response) => {
    if (!req.file) throw new HTTPError("Missing file");
    const asset = ([req.params.path].flat() as string[]).join("/");
    if (!validAssetPath(asset) || asset.split("/").length < 2) throw new HTTPError("Invalid asset path");
    const { buffer, size } = req.file;
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !UPLOAD_MIME_TYPES.includes(type.mime)) throw new HTTPError("Invalid file type");
    await storage.set(`collectibles-shop/${asset}`, buffer);
    return res.json({ id: asset, hash: crypto.createHash("md5").update(buffer).digest("hex"), content_type: type.mime, size });
});

router.delete("/*path", validateServerAuth, async (req: Request, res: Response) => {
    const asset = ([req.params.path].flat() as string[]).join("/");
    if (!validAssetPath(asset)) throw new HTTPError("Invalid asset path");
    if (await storage.exists(`collectibles-shop/${asset}`)) await storage.delete(`collectibles-shop/${asset}`);
    return res.json({ success: true });
});

export default router;
