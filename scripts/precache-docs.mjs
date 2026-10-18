import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";

const DEST_DIR = "assets/public/developers/docs_cache";

const PAGES = [
	"intro",
	"bots/overview",
	"discord-social-sdk/overview",
	"activities/overview",
	"guides",
	"change-log",
	"reference",
	"quick-start/overview-of-apps",
	"quick-start/getting-started",
	"platform/bots",
	"platform/oauth2-and-permissions",
	"platform/interactions",
	"platform/components",
	"platform/server-and-channel-management",
	"platform/webhooks",
	"platform/account-linking",
	"platform/social-layer",
	"platform/rich-presence",
	"platform/activities",
	"platform/community-servers",
	"platform/discovery",
	"platform/game-profiles",
	"platform/claim-your-game",
	"game-development/how-to-grow-your-game",
	"platform/app-monetization",
	"social-commerce/overview",
	"developer-tools/community-resources",
	"topics/teams",
	"topics/oauth2",
	"topics/permissions",
	"topics/rate-limits",
	"topics/threads",
	"resources/application",
	"resources/channel",
	"resources/guild",
	"resources/message",
	"resources/user",
	"resources/webhook",
	"events/overview",
	"events/gateway"
];

const DOCS_CUSTOM_STYLE = `
<style>
/* Zycord Developer Documentation Overrides */
:root {
  --primary: 88 101 242 !important;
  --primary-light: 121 141 249 !important;
  --primary-dark: 88 101 242 !important;
  --background-dark: 32 32 36 !important;
  --background-light: 255 255 255 !important;
}
html, body {
  background-color: #202024 !important;
  color: #dbdee1 !important;
  font-family: "gg sans", "Noto Sans", system-ui, sans-serif !important;
}
#navbar {
  background-color: #202024 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.zy-docs-brand {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  text-decoration: none !important;
}
.zy-docs-brand-text {
  font-family: "gg sans", "Noto Sans", sans-serif !important;
  font-weight: 800 !important;
  font-size: 19px !important;
  color: #ffffff !important;
  letter-spacing: -0.015em !important;
  display: inline-flex !important;
  align-items: center !important;
}
.zy-docs-brand-sub {
  font-weight: 500 !important;
  color: #949ba4 !important;
  font-size: 15px !important;
  margin-left: 6px !important;
}
.card-group {
  display: grid !important;
  gap: 16px !important;
  margin-top: 16px !important;
  margin-bottom: 32px !important;
}
.card-group[style*="--cols:3"] {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
}
.card-group[style*="--cols:2"] {
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)) !important;
}
.card {
  display: block !important;
  background-color: #2b2d31 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
  padding: 24px !important;
  text-decoration: none !important;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s ease, box-shadow 0.2s ease !important;
}
.card:hover {
  border-color: #5865F2 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35) !important;
}
.card h2, .card [data-component-part="card-title"] {
  color: #ffffff !important;
  font-size: 17px !important;
  font-weight: 700 !important;
  margin-top: 12px !important;
  margin-bottom: 6px !important;
}
.card p, .card [data-component-part="card-content"] {
  color: #949ba4 !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}
#sidebar-content {
  background-color: #202024 !important;
}
#sidebar-content a {
  transition: background-color 0.15s ease, color 0.15s ease !important;
  border-radius: 8px !important;
}
#sidebar-content a:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #ffffff !important;
}
#sidebar-content [data-active="true"] > a {
  color: #5865F2 !important;
  font-weight: 700 !important;
}
img[alt="Zycord Developer Platform"], img[alt="Discord Developer Platform"] {
  border-radius: 16px !important;
  max-width: 100% !important;
  height: auto !important;
}
</style>
`;

export function transformDocsHtml(raw) {
	// 1. Rewrite relative Mintlify asset paths to Discord live CDN
	raw = raw.replaceAll("/mintlify-assets/", "https://docs.discord.com/mintlify-assets/");

	// 2. Replace Mintlify navbar logo with Zycord Docs Logo
	const zycordDocsLogo = `<a class="select-none zy-docs-brand" style="-webkit-touch-callout:none" href="/developers"><span class="sr-only">Zycord Documentation</span><img class="nav-logo" src="/branding/zycord_icon_white.svg" alt="Zycord" style="width:28px;height:28px;object-fit:contain;display:block;" onerror="this.src='/site/zycord_icon_white.svg'"/><span class="zy-docs-brand-text">Zycord <span class="zy-docs-brand-sub">Docs</span></span></a>`;
	raw = raw.replace(/<a[^>]*class="select-none"[^>]*href="https?:\/\/docs\.discord\.com\/developers"[^>]*>[\s\S]*?<\/a>/i, zycordDocsLogo);

	// 3. Replace all Discord Docs Mintlify SVG logo CDN references
	raw = raw.replace(/https:\/\/mintcdn\.com\/discord\/CoUXJJtPEdmG4KWD\/logo\/docs-(?:light|dark)\.svg(?:\?[^"'\s\\]*)?/gi, "/branding/zycord_icon_white.svg");

	// 4. Inject custom CSS for documentation
	raw = raw.replace("</head>", `${DOCS_CUSTOM_STYLE}\n</head>`);

	// 5. Normalize internal developer links
	raw = raw.replaceAll("https://discord.com/developers/home", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/applications", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/docs/intro", "/developers/docs");
	raw = raw.replaceAll("https://docs.discord.com/developers/intro", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/developers/docs", "/developers/docs");
	raw = raw.replaceAll("https://docs.discord.com/developers", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/community", "/discover");
	raw = raw.replaceAll("https://discord.com/servers", "/discover");
	raw = raw.replaceAll("https://discord.com/download", "/download");
	raw = raw.replaceAll("https://discord.com/nitro", "/nitro");
	raw = raw.replaceAll("https://discord.com/safety", "/safety");
	raw = raw.replaceAll("https://discord.com/blog", "/blog");
	raw = raw.replaceAll("https://discord.com/careers", "/careers");
	raw = raw.replaceAll("https://discord.com/app", "/app");
	raw = raw.replaceAll("https://support-dev.discord.com/hc/en-us", "/support");
	raw = raw.replaceAll("https://support.discord.com/hc", "/support");
	raw = raw.replaceAll("https://support-dev.discord.com/", "/support");
	raw = raw.replaceAll("https://discordstatus.com/", "/status");
	raw = raw.replaceAll("https://discord.com/invite/discord-developers", "/discover");
	raw = raw.replaceAll("https://github.com/discord/discord-api-docs", "/community");

	// 6. Brand naming replacements
	raw = raw.replaceAll("Documentation - Discord", "Zycord Developer Documentation");
	raw = raw.replaceAll("Discord Developer Platform", "Zycord Developer Platform");
	raw = raw.replaceAll("Discord Developer Portal", "Zycord Developer Portal");
	raw = raw.replaceAll("New to Discord development?", "New to Zycord development?");
	raw = raw.replaceAll("New to Discord", "New to Zycord");
	raw = raw.replaceAll("Discord Bots", "Zycord Bots");
	raw = raw.replaceAll("Discord bots", "Zycord bots");
	raw = raw.replaceAll("Discord apps", "Zycord apps");
	raw = raw.replaceAll("Discord app", "Zycord app");
	raw = raw.replaceAll("Discord server", "Zycord server");
	raw = raw.replaceAll("Discord Server", "Zycord Server");
	raw = raw.replaceAll("Discord community", "Zycord community");
	raw = raw.replaceAll("Discord's", "Zycord's");
	raw = raw.replaceAll("Discord’s", "Zycord’s");
	raw = raw.replaceAll("Discord?s", "Zycord’s");
	raw = raw.replaceAll("inside Discord", "inside Zycord");
	raw = raw.replaceAll("with Discord", "with Zycord");
	raw = raw.replaceAll("to Discord", "to Zycord");
	raw = raw.replaceAll("on Discord", "on Zycord");
	raw = raw.replaceAll("How to Discord", "How to Zycord");
	raw = raw.replaceAll("Why Discord", "Why Zycord");
	raw = raw.replaceAll("Discord API", "Zycord API");
	raw = raw.replaceAll("Discord SDK", "Zycord SDK");
	raw = raw.replaceAll("Join the Developer Discord", "Join Developer Community");
	raw = raw.replaceAll("Discord Developer Policy", "Zycord Developer Policy");
	raw = raw.replaceAll("Discord Developer Terms of Service", "Zycord Developer Terms of Service");

	// 7. Strip trackers
	raw = raw.replace(/<!-- section:dataLayer -->[\s\S]*?<!-- endsection -->/gi, "");
	raw = raw.replace(/<script[^>]*otSDKStub\.js[^>]*><\/script>/gi, "");
	raw = raw.replace(/<script[^>]*OtAutoBlock\.js[^>]*><\/script>/gi, "");
	raw = raw.replace(/<script>[^<]*challenge-platform[^<]*<\/script>/gi, "");

	return raw;
}

function fetchPage(slug) {
	const url = `https://docs.discord.com/developers/${slug}`;
	return new Promise((resolve, reject) => {
		const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (res) => {
			if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				return resolve(fetchPage(res.headers.location.replace(/^https:\/\/docs\.discord\.com\/developers\/?/, "")));
			}
			if (res.statusCode !== 200) {
				return reject(new Error(`Failed to fetch ${url}: HTTP ${res.statusCode}`));
			}
			let data = "";
			res.on("data", (chunk) => data += chunk);
			res.on("end", () => resolve(data));
		});
		req.on("error", reject);
		req.setTimeout(8000, () => {
			req.destroy();
			reject(new Error(`Timeout fetching ${url}`));
		});
	});
}

async function main() {
	await fs.mkdir(DEST_DIR, { recursive: true });
	console.log(`Pre-caching ${PAGES.length} documentation pages...`);

	const concurrency = 4;
	for (let i = 0; i < PAGES.length; i += concurrency) {
		const chunk = PAGES.slice(i, i + concurrency);
		await Promise.all(
			chunk.map(async (slug) => {
				const safeName = slug.replaceAll("/", "__") + ".html";
				const targetPath = path.join(DEST_DIR, safeName);
				try {
					const raw = await fetchPage(slug);
					const transformed = transformDocsHtml(raw);
					await fs.writeFile(targetPath, transformed, "utf8");
					console.log(`✓ Cached ${slug} -> ${safeName} (${transformed.length} bytes)`);
				} catch (err) {
					console.warn(`✗ Skipped ${slug}: ${err.message}`);
				}
			})
		);
	}
	console.log("Pre-caching completed!");
}

main().catch(console.error);
