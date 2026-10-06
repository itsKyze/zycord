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

import { Request, Response, Router } from "express";
import { storage, setCacheControl, setCacheControlNotFound, fetchUpstreamAsset, sendAsset } from "../../util";
import { Collectibles } from "@spacebar/util";
import { generateNameplateSvg } from "../media/v1/collectibles-shop";

const router = Router({ mergeParams: true });

router.get("/*path", setCacheControl, async (req: Request, res: Response) => {
    const rawPath = ([req.params.path].flat() as string[]).join("/");
    if (!rawPath || !/^[a-zA-Z0-9_\-\.\/]+$/.test(rawPath) || rawPath.includes("..")) {
        return setCacheControlNotFound(req, res);
    }

    const storageKey = `collectibles_assets/${rawPath}`;
    let file = await storage.get(storageKey);
    if (!file) {
        const upstreamUrl = `https://cdn.discordapp.com/assets/collectibles/${rawPath}`;
        file = await fetchUpstreamAsset(storageKey, upstreamUrl);
    }

    if (!file && rawPath.startsWith("nameplates/custom/")) {
        const parts = rawPath.split("/");
        const skuId = parts[2];
        if (skuId) {
            try {
                const product = await Collectibles.product(skuId);
                const item = (await Collectibles.item(skuId)) ?? product?.items?.[0];
                const label = item?.label || product?.name || "Nameplate";
                const palette = ((item as any)?.palette as string) || "violet";
                file = generateNameplateSvg(label, palette);
                await storage.set(storageKey, file);
            } catch (_) {}
        }
    }

    if (!file) {
        return setCacheControlNotFound(req, res);
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    return sendAsset(res, file, rawPath);
});

export default router;
