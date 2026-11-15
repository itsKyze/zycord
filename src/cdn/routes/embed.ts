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

import fs from "node:fs/promises";
import { join } from "node:path";
import { Request, Response, Router } from "express";
import { HTTPError } from "lambert-server/HTTPError";
import { DEFAULT_AVATAR_COLORS, DEFAULT_AVATARS_FOLDER, PUBLIC_ASSETS_FOLDER, defaultAvatarSvg } from "@spacebar/util";
import { setCacheControl } from "../util";

const DEFAULT_GROUP_AVATARS_FOLDER = join(PUBLIC_ASSETS_FOLDER, "default-avatars", "group");
const DEFAULT_GROUP_AVATARS_COUNT = 8;

// Legacy Discord hash mapping (ensures old clients or cached hash links continue to resolve to original 0..7)
const legacyGroupAvatarHashes: Record<string, string> = {
    "3b70bb66089c60f8be5e214bf8574c9d": "0",
    "9581acd31832465bdeaa5385b0e919a3": "1",
    "a8a4727cf2dc2939bd3c657fad4463fa": "2",
    "2e46fe14586f8e95471c0917f56726b5": "3",
    "fac7e78de9753d4a37083bba74c1d9ef": "4",
    "4ab900144b0865430dc9be825c838faa": "5",
    "1276374a404452756f3c9cc2601508a5": "6",
    "904bf9f1b61f53ef4a3b7a893afeabe3": "7",
};

const router = Router({ mergeParams: true });

router.get("/avatars/:id", setCacheControl, async (req: Request, res: Response) => {
    const id = String(req.params.id).split(".")[0];
    if (!/^\d+$/.test(id) || Number(id) >= DEFAULT_AVATAR_COLORS.length) throw new HTTPError("not found", 404);
    const file = join(DEFAULT_AVATARS_FOLDER, `${id}.png`);
    if (await fs.stat(file).catch(() => null)) return res.type("png").sendFile(file, { cacheControl: false, dotfiles: "allow" });
    return res.type("image/svg+xml").send(defaultAvatarSvg(Number(id)));
});

router.get("/group-avatars/:id", setCacheControl, async (req: Request, res: Response) => {
    let id = String(req.params.id).split(".")[0];
    id = legacyGroupAvatarHashes[id] || id;

    if (!/^\d+$/.test(id) || Number(id) >= DEFAULT_GROUP_AVATARS_COUNT) {
        throw new HTTPError("not found", 404);
    }

    const file = join(DEFAULT_GROUP_AVATARS_FOLDER, `${id}.png`);
    if (await fs.stat(file).catch(() => null)) {
        return res.type("png").sendFile(file, { cacheControl: false, dotfiles: "allow" });
    }

    throw new HTTPError("not found", 404);
});

export default router;
