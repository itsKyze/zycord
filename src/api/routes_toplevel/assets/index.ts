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

import path from "node:path";
import express, { Router } from "express";
import { PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });

/**
 * Serve public assets (e.g. powerup images, branding) under /assets/
 * so that powerup_metadata URLs like /assets/powerups/tag.png resolve correctly.
 * The files live in public/ on disk (PUBLIC_ASSETS_FOLDER).
 */
router.use(
    express.static(PUBLIC_ASSETS_FOLDER, {
        index: false,
        redirect: false,
        setHeaders: (res) => {
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Cache-Control", "public, max-age=86400");
        },
    }),
);

export default router;
