import fs from "node:fs/promises";
import path from "node:path";

const SCRAPED_DIR = "C:\\Users\\Kyze\\.gemini\\antigravity\\brain\\0c453e88-25d0-4f07-ae4b-5adc9658a4b1\\.system_generated\\steps";
const DEST_DIR = "assets/public/developers";

const PAGES = [
	{
		step: "3501",
		output: "hub.html",
		title: "Zycord for Game Developers",
		desc: "Tools, integrations, and platform capabilities for game developers to tap into the power of Zycord.",
	},
	{
		step: "3521",
		output: "social-sdk.html",
		title: "Zycord Social SDK | Integration",
		desc: "Power player connections and enhance multiplayer experiences by integrating Zycord directly in your game.",
	},
	{
		step: "3527",
		output: "social-commerce.html",
		title: "Zycord Social Commerce",
		desc: "Sell in-game items to players and their friends, even when they're not in your game.",
	},
	{
		step: "3529",
		output: "build.html",
		title: "Apps & Activities | Build on Zycord",
		desc: "Build and scale social games and experiences where millions of friends are looking for fun things to do.",
	},
	{
		step: "3531",
		output: "developer-newsletter.html",
		title: "Zycord Developer Newsletter",
		desc: "Zycord Dev Scrolls – your go-to monthly round up for the latest product updates, partner successes, events, and technical changes.",
	},
	{
		step: "3533",
		output: "success-stories.html",
		title: "Zycord Developer Success Stories",
		desc: "Read Zycord Developer Success Stories to learn how game studios have integrated Zycord into their growth strategy.",
	},
	{
		step: "3535",
		output: "docs.html",
		title: "Zycord Developer Platform - Documentation",
		desc: "Build bots, apps, integrations, and games for communities with the Zycord Developer Platform and APIs.",
	},
];

const BRAND_STYLE = `
<style>
.zy-nav-brand-wrap {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  cursor: pointer !important;
}
.zy-nav-brand-icon {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  object-fit: contain !important;
  display: block !important;
}
.zy-nav-brand-name {
  font-family: var(--font-abc-ginto-zycord, "gg sans", "Noto Sans", sans-serif) !important;
  font-weight: 900 !important;
  font-size: 22px !important;
  letter-spacing: -0.025em !important;
  color: #ffffff !important;
  line-height: 1 !important;
  text-transform: none !important;
  user-select: none !important;
  display: inline-block !important;
}
.nav_brand_main-logo,
.nav_brand_main-black-logo {
  display: none !important;
}
.container_word {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  margin-top: 32px;
}
.zy-wordmark-svg {
  width: 100%;
  max-width: 1320px;
  height: auto;
  display: block;
}
</style>
`;

const NAV_BRAND_HTML = `<a class="nav_brand w-nav-brand" href="/" aria-label="Zycord Home">
  <span class="zy-nav-brand-wrap">
    <img alt="Zycord" class="zy-nav-brand-icon" loading="eager" src="/branding/zycord_icon_white.svg" onerror="this.src='/site/zycord_icon_white.svg'"/>
    <span class="zy-nav-brand-name">Zycord</span>
  </span>
</a>`;

const BURGER_BRAND_HTML = `<a class="nav_brand is-burger w-nav-brand" href="/" aria-label="Zycord Home">
  <span class="zy-nav-brand-wrap">
    <img alt="Zycord" class="zy-nav-brand-icon" loading="eager" src="/branding/zycord_icon_white.svg" onerror="this.src='/site/zycord_icon_white.svg'"/>
    <span class="zy-nav-brand-name">Zycord</span>
  </span>
</a>`;

const FOOTER_LOGO_HTML = `<a class="footer-logo-link w-inline-block" href="/" aria-label="Zycord Home">
  <img alt="Zycord Home" loading="lazy" src="/branding/zycord_icon_white.svg" style="width:34px;height:34px;object-fit:contain;display:block;" onerror="this.src='/site/zycord_icon_white.svg'"/>
</a>`;

const FOOTER_WORDMARK_HTML = `<div class="container_word" aria-hidden="true">
  <svg class="zy-wordmark-svg" viewBox="0 0 1765 390" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="882.5" y="292" text-anchor="middle" fill="#E0E3FF" font-family="Poppins, 'Inter', system-ui, sans-serif" font-weight="900" font-size="312" letter-spacing="-12" textLength="1710" lengthAdjust="spacingAndGlyphs">Zycord</text>
  </svg>
</div>`;

async function processPage(cfg) {
	const srcPath = path.join(SCRAPED_DIR, cfg.step, "content.md");
	let raw = await fs.readFile(srcPath, "utf8");

	// Strip markdown header
	const marker = raw.indexOf("<!DOCTYPE html>");
	if (marker !== -1) {
		raw = raw.slice(marker);
	}

	// Brand CSS injection before </head>
	raw = raw.replace("</head>", `${BRAND_STYLE}\n</head>`);

	// Replace title and og/meta descriptions
	raw = raw.replace(/<title>.*?<\/title>/gi, `<title>${cfg.title}</title>`);
	raw = raw.replace(/name="description" content=".*?"/gi, `name="description" content="${cfg.desc}"`);
	raw = raw.replace(/property="og:title" content=".*?"/gi, `property="og:title" content="${cfg.title}"`);
	raw = raw.replace(/property="og:description" content=".*?"/gi, `property="og:description" content="${cfg.desc}"`);
	raw = raw.replace(/name="twitter:title" content=".*?"/gi, `name="twitter:title" content="${cfg.title}"`);
	raw = raw.replace(/name="twitter:description" content=".*?"/gi, `name="twitter:description" content="${cfg.desc}"`);

	// Replace nav logo
	raw = raw.replace(/<a[^>]*class="[^"]*nav_brand w-nav-brand[^"]*"[^>]*>[\s\S]*?<\/a>/i, NAV_BRAND_HTML);
	raw = raw.replace(/<a[^>]*class="[^"]*nav_brand is-burger w-nav-brand[^"]*"[^>]*>[\s\S]*?<\/a>/i, BURGER_BRAND_HTML);

	// Replace footer logo and wordmark
	raw = raw.replace(/<a[^>]*class="[^"]*footer-logo-link w-inline-block[^"]*"[^>]*>[\s\S]*?<\/a>/i, FOOTER_LOGO_HTML);
	raw = raw.replace(/<div class="container_word"[\s\S]*?<\/div>/i, FOOTER_WORDMARK_HTML);

	// Normalize Discord URLs to Zycord internal URLs
	raw = raw.replaceAll("https://discord.com/developers/social-sdk", "/developers/social-sdk");
	raw = raw.replaceAll("https://discord.com/developers/social-commerce", "/developers/social-commerce");
	raw = raw.replaceAll("https://discord.com/developers/build", "/developers/build");
	raw = raw.replaceAll("https://discord.com/developers/developer-newsletter", "/developers/developer-newsletter");
	raw = raw.replaceAll("https://discord.com/developers/success-stories", "/developers/success-stories");
	raw = raw.replaceAll("https://discord.com/developers/home", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/applications", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/docs/intro", "/developers/docs");
	raw = raw.replaceAll("https://docs.discord.com/developers/intro", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/developers/docs", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/developers", "/developers");
	raw = raw.replaceAll("https://discord.com/community", "/discover");
	raw = raw.replaceAll("https://discord.com/servers", "/discover");
	raw = raw.replaceAll("https://discord.com/trending-games", "/discover#trending");
	raw = raw.replaceAll("https://discord.com/download", "/download");
	raw = raw.replaceAll("https://discord.com/nitro", "/nitro");
	raw = raw.replaceAll("https://discord.com/safety", "/safety");
	raw = raw.replaceAll("https://discord.com/blog", "/blog");
	raw = raw.replaceAll("https://discord.com/careers", "/careers");
	raw = raw.replaceAll("https://discord.com/app", "/app");
	raw = raw.replaceAll("https://support-dev.discord.com/hc/en-us", "/support");
	raw = raw.replaceAll("https://support.discord.com/hc", "/support");
	raw = raw.replaceAll("https://discordstatus.com/", "/status");
	raw = raw.replaceAll("https://discord.com/developers/contact-us", "/support");
	raw = raw.replaceAll("https://discord.com/", "/");

	raw = raw.replaceAll("https://x.com/discord", "/community");
	raw = raw.replaceAll("https://twitter.com/discord", "/community");
	raw = raw.replaceAll("https://www.instagram.com/discord/", "/community");
	raw = raw.replaceAll("https://www.facebook.com/discord/", "/community");
	raw = raw.replaceAll("https://www.youtube.com/discord", "/community");
	raw = raw.replaceAll("https://www.tiktok.com/@discord", "/community");
	raw = raw.replaceAll("https://discordmerch.com/evergreenfooter", "/merch");

	// Replace Discord branding texts with Zycord
	raw = raw.replaceAll("Discord for Game Developers", "Zycord for Game Developers");
	raw = raw.replaceAll("Discord for Game Developers", "Zycord for Game Developers");
	raw = raw.replaceAll("Discord for Developers", "Zycord for Developers");
	raw = raw.replaceAll("Discord Social SDK", "Zycord Social SDK");
	raw = raw.replaceAll("Discord Social Commerce", "Zycord Social Commerce");
	raw = raw.replaceAll("Discord Developer Newsletter", "Zycord Developer Newsletter");
	raw = raw.replaceAll("Discord Developer Success Stories", "Zycord Developer Success Stories");
	raw = raw.replaceAll("Discord Developer Platform", "Zycord Developer Platform");
	raw = raw.replaceAll("Discord Developer Portal", "Zycord Developer Portal");
	raw = raw.replaceAll("Ads on Discord", "Ads on Zycord");
	raw = raw.replaceAll("Games Unlocking Discord’s Full Potential", "Games Unlocking Zycord’s Full Potential");
	raw = raw.replaceAll("Games Unlocking Discord?s Full Potential", "Games Unlocking Zycord’s Full Potential");
	raw = raw.replaceAll("Make Discord Work for Your Game", "Make Zycord Work for Your Game");
	raw = raw.replaceAll("Power player connections and enhance multiplayer experiences by integrating Discord directly in your game", "Power player connections and enhance multiplayer experiences by integrating Zycord directly in your game");
	raw = raw.replaceAll("tap into the power of Discord", "tap into the power of Zycord");
	raw = raw.replaceAll("on Discord", "on Zycord");
	raw = raw.replaceAll("Discord’s", "Zycord’s");
	raw = raw.replaceAll("Discord?s", "Zycord’s");
	raw = raw.replaceAll("Discord's", "Zycord's");
	raw = raw.replaceAll("Discord account", "Zycord account");
	raw = raw.replaceAll("Discord Profile", "Zycord Profile");
	raw = raw.replaceAll("Discord server", "Zycord server");
	raw = raw.replaceAll("Discord Server", "Zycord Server");
	raw = raw.replaceAll("Discord community", "Zycord community");
	raw = raw.replaceAll("How to Discord", "How to Zycord");
	raw = raw.replaceAll("Discord HQ", "Zycord HQ");
	raw = raw.replaceAll("Discord Player's Guide", "Zycord Player's Guide");
	raw = raw.replaceAll("Discord Player&#x27;s Guide", "Zycord Player&#x27;s Guide");

	// Clean out telemetry and oneTrust tracking scripts
	raw = raw.replace(/<!-- section:dataLayer -->[\s\S]*?<!-- endsection -->/gi, "");
	raw = raw.replace(/<script[^>]*otSDKStub\.js[^>]*><\/script>/gi, "");
	raw = raw.replace(/<script[^>]*OtAutoBlock\.js[^>]*><\/script>/gi, "");

	// Remove Cloudflare turnstile/challenge scripts from scrapes if any
	raw = raw.replace(/<script>[^<]*challenge-platform[^<]*<\/script>/gi, "");

	const outPath = path.join(DEST_DIR, cfg.output);
	await fs.writeFile(outPath, raw, "utf8");
	console.log(`Generated ${cfg.output} (${raw.length} bytes)`);
}

async function run() {
	for (const p of PAGES) {
		await processPage(p);
	}
	console.log("All developer pages generated successfully!");
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
