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

const PALETTE_COLORS: Record<string, [string, string]> = {
    crimson: ["#e11d48", "#881337"],
    berry: ["#c026d3", "#701a75"],
    sky: ["#0284c7", "#0369a1"],
    teal: ["#0d9488", "#115e59"],
    forest: ["#16a34a", "#14532d"],
    bubble_gum: ["#ec4899", "#9d174d"],
    violet: ["#8b5cf6", "#5b21b6"],
    cobalt: ["#3b82f6", "#1d4ed8"],
    clover: ["#22c55e", "#15803d"],
    lemon: ["#eab308", "#a16207"],
    white: ["#f1f5f9", "#94a3b8"],
    black: ["#334155", "#0f172a"],
};

function generateNameplateSvg(label: string, paletteName: string = "violet"): Buffer {
    const [c1, c2] = PALETTE_COLORS[paletteName] ?? PALETTE_COLORS.violet;
    const safeLabel = (label || "Nameplate").replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72">
  <defs>
    <linearGradient id="npgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="npborder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7">
        <animate attributeName="stop-opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="${c1}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.7">
        <animate attributeName="stop-opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="rectclip">
      <rect x="2" y="2" width="296" height="68" rx="14"/>
    </clipPath>
  </defs>
  <rect x="2" y="2" width="296" height="68" rx="14" fill="url(#npgrad)" stroke="url(#npborder)" stroke-width="2"/>
  <g clip-path="url(#rectclip)">
    <rect x="-100" y="0" width="80" height="72" fill="url(#shimmer)">
      <animateTransform attributeName="transform" type="translate" from="-120 0" to="420 0" dur="2.8s" repeatCount="indefinite"/>
    </rect>
  </g>
  <circle cx="36" cy="36" r="16" fill="#ffffff" fill-opacity="0.2"/>
  <path d="M30 36 L34 40 L42 32" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="64" y="42" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="0.5">${safeLabel}</text>
</svg>`;
    return Buffer.from(svg, "utf8");
}

function generateFrameSvg(label: string): Buffer {
    const safeLabel = (label || "Profile Frame").replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="fgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6">
        <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#3b82f6;#8b5cf6" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#ec4899">
        <animate attributeName="stop-color" values="#ec4899;#3b82f6;#8b5cf6;#ec4899" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#3b82f6">
        <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#ec4899;#3b82f6" dur="4s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect x="12" y="12" width="216" height="216" rx="32" fill="none" stroke="url(#fgrad)" stroke-width="8" stroke-dasharray="24 12">
    <animate attributeName="stroke-dashoffset" values="0;72" dur="3s" repeatCount="indefinite"/>
  </rect>
  <rect x="24" y="24" width="192" height="192" rx="24" fill="#0f172a" fill-opacity="0.35" stroke="url(#fgrad)" stroke-width="2"/>
  <circle cx="120" cy="120" r="48" fill="url(#fgrad)" fill-opacity="0.18" stroke="url(#fgrad)" stroke-width="3">
    <animate attributeName="r" values="46;50;46" dur="2s" repeatCount="indefinite"/>
  </circle>
  <path d="M110 120 L117 127 L132 112" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="120" y="195" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${safeLabel}</text>
</svg>`;
    return Buffer.from(svg, "utf8");
}

function generateEffectSvg(label: string): Buffer {
    const safeLabel = (label || "Profile Effect").replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <radialGradient id="eglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.9">
        <animate attributeName="stop-color" values="#60a5fa;#c084fc;#f472b6;#60a5fa" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="240" height="240" fill="#0f172a" fill-opacity="0.55" rx="20"/>
  <circle cx="120" cy="120" r="80" fill="url(#eglow)">
    <animate attributeName="r" values="75;85;75" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="120" r="40" fill="none" stroke="#67e8f9" stroke-width="2" stroke-dasharray="8 6">
    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="6s" repeatCount="indefinite"/>
  </circle>
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="-360 120 120" dur="10s" repeatCount="indefinite"/>
    <polygon points="120,70 125,115 170,120 125,125 120,170 115,125 70,120 115,115" fill="#ffffff" opacity="0.95"/>
  </g>
  <text x="120" y="200" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${safeLabel}</text>
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

const validAssetPath = (asset: string) => {
    const segments = asset.split("/");
    return segments.length <= 4 && segments.every((x) => /^[a-z0-9_-]{1,64}$/i.test(x));
};

async function sendUpstream(req: Request, res: Response, asset: string, slot: "static" | "animated" = "static") {
    if (!validAssetPath(asset)) return setCacheControlNotFound(req, res);
    const path = `collectibles-shop-upstream/${asset}`;
    let file = (await storage.get(path)) ?? (await fetchUpstreamAsset(path, `https://cdn.discordapp.com/media/v1/collectibles-shop/${asset}`));

    if (!file) {
        // Fallback: look up sku_id in catalog
        const skuId = asset.split("/")[0];
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
                    const svgBuffer = generateFrameSvg(item.label || product?.name || "Profile Frame");
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
