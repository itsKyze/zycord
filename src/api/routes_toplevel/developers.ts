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
import path from "node:path";
import express, { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { brandPage, Config, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";
import { compressedStatic } from "../../util/util/CompressedStatic";

const router = Router({ mergeParams: true });
const PAGE_FOLDER = path.join(PUBLIC_ASSETS_FOLDER, "developers");

router.use(compressedStatic(PAGE_FOLDER), express.static(PAGE_FOLDER, { index: false, redirect: false, setHeaders: (res) => res.set("Cache-Control", "no-cache") }));

async function sendDeveloperHub(res: Response) {
	const hub = await fs.readFile(path.join(PAGE_FOLDER, "hub.html"), "utf8");
	res.set("Cache-Control", "no-cache");
	return res.type("html").send(brandPage(hub));
}

router.get(
	"/",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	async (_req: Request, res: Response) => sendDeveloperHub(res),
);

router.get(
	"/docs{/*splat}",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	async (_req: Request, res: Response) => sendDeveloperHub(res),
);

router.get(
	"/{*splat}",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	async (_req: Request, res: Response) => {
		const { client, cdn, general } = Config.get();
		const config = JSON.stringify({
			instanceName: client.instanceName,
			icon: general.image || "/static/logo.png",
			cdn: cdn.endpointPublic?.replace(/\/+$/, "") ?? "",
			activityHost: (client.activityApplicationHost ?? "").replace(/^(https?:)?\/\//, "").replace(/\/.*$/, ""),
		}).replace(/</g, "\\u003c");
		const page = (await fs.readFile(path.join(PAGE_FOLDER, "index.html"), "utf8"))
			.replace("{{CONFIG}}", config)
			.replace("{{TITLE}}", `${client.instanceName.replace(/[<>&"]/g, "")} Developer Portal`);
		res.set("Cache-Control", "no-cache");
		res.type("html").send(page);
	},
);

export default router;
