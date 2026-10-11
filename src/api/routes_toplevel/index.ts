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
import { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { brandPage, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });
const page = fs.readFileSync(path.join(PUBLIC_ASSETS_FOLDER, "index.html"), "utf8");

router.get(
	"/",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	(req: Request, res: Response) => {
		res.set("Cache-Control", "public, max-age=3600");
		return res.type("html").send(brandPage(page));
	},
);

export default router;
