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
import { legalPageRouter } from "@spacebar/api/util";
import { ASSETS_FOLDER, brandPage, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });
const indexPagePath = path.join(PUBLIC_ASSETS_FOLDER, "index.html");

const JSX_MARKETING_PAGES: Record<string, { pageKey: string; title: string; desc: string }> = {
	"/application-directory": {
		pageKey: "application-directory",
		title: "__INSTANCE_NAME__ App Directory — Bots, Activities & Integrations",
		desc: "Discover verified bots, slash-command utilities, multiplayer voice Activities, and moderation tools built on the __INSTANCE_NAME__ API.",
	},
	"/gift-cards": {
		pageKey: "gift-cards",
		title: "__INSTANCE_NAME__ Nitro Gift Cards — Give the Gift of Nitro",
		desc: "Share HD streaming, animated profile themes, custom emojis, and Server Boosts with __INSTANCE_NAME__ Nitro Gift Cards.",
	},
	"/company": {
		pageKey: "company",
		title: "About __INSTANCE_NAME__ — Our Mission, Story & Infrastructure",
		desc: "Learn how __INSTANCE_NAME__ creates space for everyone to find belonging through real-time voice, video, and text.",
	},
	"/branding": {
		pageKey: "branding",
		title: "__INSTANCE_NAME__ Brand Guidelines — Logos, Colors & Typography",
		desc: "Official __INSTANCE_NAME__ brand guidelines, downloadable SVG marks, Blurple color tokens, and typography resources.",
	},
	"/newsroom": {
		pageKey: "newsroom",
		title: "__INSTANCE_NAME__ Newsroom — Press Releases & Media Kit",
		desc: "Official announcements, company milestones, media kits, and executive briefings from __INSTANCE_NAME__ HQ.",
	},
	"/creators": {
		pageKey: "creators",
		title: "__INSTANCE_NAME__ for Creators — Build & Reward Your Community",
		desc: "Host live Stage events, sync Twitch and YouTube subscriber roles, and grow your creator community on __INSTANCE_NAME__.",
	},
	"/community": {
		pageKey: "community",
		title: "__INSTANCE_NAME__ Communities — Where Passionate Communities Grow",
		desc: "Guided server onboarding, Forum channels, AutoMod safety, and low-latency voice for communities of any size.",
	},
	"/ads/quests": {
		pageKey: "quests",
		title: "__INSTANCE_NAME__ Quests — Play Games, Stream & Earn Collectibles",
		desc: "Discover __INSTANCE_NAME__ Quests and earn exclusive avatar decorations, nameplates, and profile effects.",
	},
	"/merch": {
		pageKey: "merch",
		title: "Official __INSTANCE_NAME__ Merch & Collectibles Store",
		desc: "Shop limited-edition __INSTANCE_NAME__ apparel, Wumpus plushies, hardware desk gear, and digital collectibles.",
	},
	"/feedback": {
		pageKey: "feedback",
		title: "__INSTANCE_NAME__ Product Feedback & Feature Requests",
		desc: "Submit feature requests and product feedback directly to the __INSTANCE_NAME__ engineering and design teams.",
	},
};

function renderMarketingShell(pageKey: string, title: string, desc: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${title}</title>
	<meta name="description" content="${desc}" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="stylesheet" href="/site/site.css?v=20261012k" />
</head>
<body>
	<header data-zy-navbar></header>
	<main data-zy-jsx-page="${pageKey}"></main>
	<footer data-zy-footer></footer>
	<script src="/site/site.js?v=20261012k"></script>
</body>
</html>`;
}

router.get(
	"/",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	(_req: Request, res: Response) => {
		const page = fs.readFileSync(indexPagePath, "utf8");
		res.set("Cache-Control", "no-store, no-cache, must-revalidate");
		return res.type("html").send(brandPage(page));
	},
);

for (const [routePath, meta] of Object.entries(JSX_MARKETING_PAGES)) {
	const htmlTemplate = renderMarketingShell(meta.pageKey, meta.title, meta.desc);
	router.get(
		routePath,
		route({
			spacebarOnly: true,
			authentication: "never",
		}),
		(_req: Request, res: Response) => {
			res.set("Cache-Control", "no-cache");
			return res.type("html").send(brandPage(htmlTemplate));
		},
	);
}

router.use("/acknowledgements", legalPageRouter("acknowledgements"));
router.use("/licenses", legalPageRouter("licenses"));
router.use("/company-information", legalPageRouter("company_information"));

router.get("/_zycord/api/openapi.json", route({ spacebarOnly: true, authentication: "never" }), (_req: Request, res: Response) => {
	res.set("Cache-Control", "public, max-age=21600");
	return res.sendFile(path.join(ASSETS_FOLDER, "openapi.json"), { dotfiles: "allow" });
});

router.get("/_zycord/api/schemas.json", route({ spacebarOnly: true, authentication: "never" }), (_req: Request, res: Response) => {
	res.set("Cache-Control", "public, max-age=21600");
	return res.sendFile(path.join(ASSETS_FOLDER, "schemas.json"), { dotfiles: "allow" });
});

export default router;
