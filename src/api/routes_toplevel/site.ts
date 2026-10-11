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
import { Router, Request, Response } from "express";
import { route } from "@spacebar/api/middlewares";
import { PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });

const siteCss = fs.readFileSync(path.join(PUBLIC_ASSETS_FOLDER, "site", "site.css"), "utf8");
const siteJs = fs.readFileSync(path.join(PUBLIC_ASSETS_FOLDER, "site", "site.js"), "utf8");

router.get(
	"/site.css",
	route({ spacebarOnly: true, authentication: "never" }),
	(_req: Request, res: Response) => {
		res.set("Cache-Control", "public, max-age=3600");
		return res.type("css").send(siteCss);
	},
);

router.get(
	"/site.js",
	route({ spacebarOnly: true, authentication: "never" }),
	(_req: Request, res: Response) => {
		res.set("Cache-Control", "public, max-age=3600");
		return res.type("application/javascript").send(siteJs);
	},
);

export default router;
