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
import crypto from "node:crypto";
import { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { legalPageRouter } from "@spacebar/api/util";
import { ASSETS_FOLDER, brandPage, Config, getRevInfoOrFail, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

function generateCdnAccessDeniedXml(): string {
	const reqId = "000001" + crypto.randomBytes(13).toString("hex").toUpperCase();
	const hostId = crypto.randomBytes(48).toString("base64");
	return `<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
  <RequestId>${reqId}</RequestId>
  <HostId>${hostId}</HostId>
</Error>`;
}

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
		title: "__INSTANCE_NAME__ Quests — Advertise Where the World Plays",
		desc: "Break through to some of the most passionate audiences of players with __INSTANCE_NAME__ Ads.",
	},
	"/ads/quests-success-stories": {
		pageKey: "quests-stories",
		title: "__INSTANCE_NAME__ Quests Success Stories",
		desc: "See how brands scored big with advertising campaigns on __INSTANCE_NAME__.",
	},
	"/ads/quests-faq": {
		pageKey: "quests-faq",
		title: "__INSTANCE_NAME__ Quests Frequently Asked Questions",
		desc: "The ins and outs of __INSTANCE_NAME__ Ads and everything in between.",
	},
	"/safety-family-center": {
		pageKey: "safety-hub",
		title: "__INSTANCE_NAME__ Family Center",
		desc: "Learn more about what we’re doing to help your teen stay safer on our platform.",
	},
	"/safety-library": {
		pageKey: "safety-hub",
		title: "Safety Library | __INSTANCE_NAME__",
		desc: "Everything you could ever want to know about safety on __INSTANCE_NAME__.",
	},
	"/safety-news": {
		pageKey: "safety-hub",
		title: "Safety News Hub | __INSTANCE_NAME__",
		desc: "The latest news and updates on __INSTANCE_NAME__’s Safety, Privacy, and Policy initiatives.",
	},
	"/safety-teen-charter": {
		pageKey: "safety-hub",
		title: "Teen Charter | __INSTANCE_NAME__",
		desc: "We collaborated with teens around the world to create a charter that guides how we make __INSTANCE_NAME__ a better place to hang out.",
	},
	"/safety-players-guide": {
		pageKey: "safety-hub",
		title: "__INSTANCE_NAME__ Player's Guide",
		desc: "A practical guide for hanging out, playing, and staying comfortable on __INSTANCE_NAME__.",
	},
	"/safety-parents": {
		pageKey: "safety-hub",
		title: "Parent Hub | __INSTANCE_NAME__",
		desc: "Learn more about how we help teens have positive experiences on our platform.",
	},
	"/safety-policies": {
		pageKey: "safety-hub",
		title: "Policy Hub | __INSTANCE_NAME__",
		desc: "Learn about our Community Guidelines, developed to help keep people safe.",
	},
	"/safety-privacy": {
		pageKey: "safety-hub",
		title: "Privacy Hub | __INSTANCE_NAME__",
		desc: "Privacy is an essential part of feeling safe. Learn how we build privacy into our products.",
	},
	"/safety-transparency": {
		pageKey: "safety-hub",
		title: "Transparency Hub | __INSTANCE_NAME__",
		desc: "Explore data, trends, and analysis into the work done to help keep people on __INSTANCE_NAME__ safe.",
	},
	"/safety-wellbeing": {
		pageKey: "safety-hub",
		title: "Wellbeing Hub | __INSTANCE_NAME__",
		desc: "Discover resources for ways to protect your wellbeing or to support your teen’s mental health online.",
	},
	"/category/community": {
		pageKey: "blog",
		title: "Community — __INSTANCE_NAME__ Blog",
		desc: "Community stories and staff picks from __INSTANCE_NAME__.",
	},
	"/category/company": {
		pageKey: "blog",
		title: "__INSTANCE_NAME__ HQ — Blog",
		desc: "Company news from __INSTANCE_NAME__ HQ.",
	},
	"/category/engineering": {
		pageKey: "blog",
		title: "Engineering & Developers — __INSTANCE_NAME__ Blog",
		desc: "Engineering deep-dives and patch notes from __INSTANCE_NAME__.",
	},
	"/category/how-to-discord": {
		pageKey: "blog",
		title: "How to __INSTANCE_NAME__ — Blog",
		desc: "Guides for getting the most out of __INSTANCE_NAME__.",
	},
	"/category/safety": {
		pageKey: "blog",
		title: "Policy & Safety — __INSTANCE_NAME__ Blog",
		desc: "Safety, privacy, and policy updates from __INSTANCE_NAME__.",
	},
	"/category/product": {
		pageKey: "blog",
		title: "Product & Features — __INSTANCE_NAME__ Blog",
		desc: "Product updates and changelogs from __INSTANCE_NAME__.",
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
	<link rel="stylesheet" href="/site/site.css?v=20261020c" />
</head>
<body>
	<header data-zy-navbar></header>
	<main data-zy-jsx-page="${pageKey}"></main>
	<footer data-zy-footer></footer>
	<script src="/site/site.js?v=20261020c"></script>
</body>
</html>`;
}

router.get(
	"/",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	(req: Request, res: Response) => {
		const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString().toLowerCase();
		if (host.startsWith("cdn.") || host === "cdn.zyron.site") {
			res.status(403);
			res.set("Content-Type", "application/xml; charset=utf-8");
			res.set("Cache-Control", "no-cache, no-store, must-revalidate");
			return res.send(generateCdnAccessDeniedXml());
		}
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

router.get("/_zycord/api/version", route({ spacebarOnly: true, authentication: "never" }), (_req: Request, res: Response) => {
	return res.json({
		implementation: "zycord-server",
		version: getRevInfoOrFail(),
	});
});

router.get("/.well-known/zycord/client", route({ spacebarOnly: true, authentication: "never" }), (_req: Request, res: Response) => {
	return res.json({
		api: {
			baseUrl: Config.get().api.endpointPublic!.split("/api/")[0],
			apiVersions: {
				default: Config.get().api.defaultVersion,
				active: Config.get().api.activeVersions,
			},
		},
		cdn: {
			baseUrl: Config.get().cdn.endpointPublic!,
		},
		gateway: {
			baseUrl: Config.get().gateway.endpointPublic!,
			encoding: ["etf", "json"],
			compression: ["zstd-stream", "zlib-stream", null],
		},
		admin:
			Config.get().admin.endpointPublic === null
				? undefined
				: {
						baseUrl: Config.get().admin.endpointPublic!,
					},
	});
});

export default router;
