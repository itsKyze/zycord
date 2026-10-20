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
import { brandPage, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });
const notFound = fs.readFileSync(path.join(PUBLIC_ASSETS_FOLDER, "not-found.html"), "utf8");
const ADS_PAGES = new Set(["", "quests", "quests-success-stories", "quests-faq"]);

function pageKeyFor(req: Request): { pageKey: string; title: string; desc: string } {
	const sub = String((req.params as { splat?: string | string[] }).splat || "")
		.split("/")
		.filter(Boolean)[0] || "";
	if (sub === "quests-success-stories") {
		return {
			pageKey: "quests-stories",
			title: "__INSTANCE_NAME__ Quests Success Stories",
			desc: "See how brands scored big with advertising campaigns on __INSTANCE_NAME__.",
		};
	}
	if (sub === "quests-faq") {
		return {
			pageKey: "quests-faq",
			title: "__INSTANCE_NAME__ Quests Frequently Asked Questions",
			desc: "The ins and outs of __INSTANCE_NAME__ Ads and everything in between.",
		};
	}
	return {
		pageKey: "quests",
		title: "__INSTANCE_NAME__ Quests — Advertise Where the World Plays",
		desc: "Break through to some of the most passionate audiences of players with __INSTANCE_NAME__ Ads.",
	};
}

function sendAds(req: Request, res: Response) {
	const sub = String((req.params as { splat?: string | string[] }).splat || "")
		.split("/")
		.filter(Boolean)[0] || "";
	if (!ADS_PAGES.has(sub)) {
		res.set("Cache-Control", "no-cache");
		return res.status(404).type("html").send(brandPage(notFound));
	}
	const meta = pageKeyFor(req);
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${meta.title}</title>
	<meta name="description" content="${meta.desc}" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="stylesheet" href="/site/site.css?v=20261020b" />
</head>
<body>
	<header data-zy-navbar></header>
	<main data-zy-jsx-page="${meta.pageKey}"></main>
	<footer data-zy-footer></footer>
	<script src="/site/site.js?v=20261020b"></script>
</body>
</html>`;
	res.set("Cache-Control", "no-cache");
	return res.type("html").send(brandPage(html));
}

router.get("/", route({ spacebarOnly: true, authentication: "never" }), sendAds);
router.get("/{*splat}", route({ spacebarOnly: true, authentication: "never" }), sendAds);

export default router;
