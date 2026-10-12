import { h } from "../runtime.jsx";

export function DevelopersHubPage() {
	return (
		<div>
			{/* =====================================================================
			    1. DEVELOPER CENTERED HERO — EXACT DISCORD.COM/DEVELOPERS 3D OBJECTS
			    ===================================================================== */}
			<section className="zy-subhero" style={{ paddingTop: "76px", paddingBottom: "48px" }}>
				<img src="/site/media/discord/dev-fire-extinguisher.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "92px", top: "10%", left: "6%" }} />
				<img src="/site/media/discord/dev-spider.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "86px", top: "14%", right: "8%" }} />
				<img src="/site/media/discord/dev-magnet.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "84px", bottom: "10%", left: "9%" }} />
				<img src="/site/media/discord/dev-cog.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "88px", bottom: "12%", right: "10%" }} />
				<img src="/site/media/discord/dev-rubber-duck.png" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "90px", top: "42%", left: "3%" }} />
				<img src="/site/media/discord/dev-clyde-3d.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "104px", top: "40%", right: "3%" }} />

				<div className="zy-container">
					<div className="zy-subhero-inner">
						<span className="zy-eyebrow">
							<span className="zy-eyebrow-dot" data-zy-status-dot></span>
							<span>Zycord Developer Platform · Social SDK, Bots &amp; Activities</span>
						</span>
						<h1 className="zy-subhero-title">Zycord for Game Developers</h1>
						<p className="zy-subhero-sub">
							Tools, integrations, and platform capabilities for game developers and bot builders to tap into the power of Zycord.
						</p>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    2. BUILD ON THE SOCIAL LAYER OF GAMES — 16X9 STAGE
			    ===================================================================== */}
			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">BUILD ON THE SOCIAL LAYER OF GAMES</h2>
								<p className="zy-body-lg">
									Players already spend time together on Zycord before, during, and after they play. Zycord is where the social layer of games lives today — and our developer platform lets you tap into that time to drive more players, more playtime, and richer community experiences.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" }}>
									<a className="zy-btn zy-btn-primary" href="/developers/applications">
										<span>Open Developer Portal</span>
									</a>
									<a className="zy-btn zy-btn-secondary" href="#sdk-quickstart">
										<span>Explore the Platform</span>
									</a>
								</div>
							</div>

							<div className="zy-scene-stage stage-blurple">
								<img
									src="/site/media/discord/dev-hero-16x9.webp"
									alt="Zycord Developer Ecosystem — Chat, Playtime, Rich Presence & Apps"
									style={{ width: "100%", height: "auto", borderRadius: "24px", display: "block" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    3. REACH INTO ONE OF THE WORLD'S MOST ENGAGED GAMING AUDIENCES
			    ===================================================================== */}
			<section className="zy-section" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 36px" }}>
						<h2 className="zy-heading">REACH THE WORLD’S MOST ENGAGED GAMING AUDIENCE</h2>
					</div>
					<div className="zy-grid-3">
						<article className="zy-card" style={{ background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px" }}>
							<div className="zy-display" style={{ fontSize: "52px" }}>90M+</div>
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "6px" }}>Daily Active Players</h3>
							<p className="zy-body">Reach players and communities who gather on Zycord every single day across desktop, web, and mobile.</p>
						</article>
						<article className="zy-card" style={{ background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px", position: "relative" }}>
							<img src="/site/media/discord/nav-blog-cube.webp" alt="" aria-hidden="true" style={{ width: "68px", position: "absolute", top: "18px", right: "18px" }} />
							<div className="zy-display" style={{ fontSize: "52px" }}>90%+</div>
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "6px" }}>Play Video Games</h3>
							<p className="zy-body">Meet players where they connect before, during, and after play with unified Rich Presence and party invites.</p>
						</article>
						<article className="zy-card" style={{ background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px" }}>
							<div className="zy-display" style={{ fontSize: "52px" }}>~40%</div>
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "6px" }}>Start a Game Within an Hour</h3>
							<p className="zy-body">Of watching someone stream that game in a voice channel on PC.</p>
						</article>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    4. HOW GAMES USE ZYCORD TO DRIVE GROWTH (3 ICON CARDS)
			    ===================================================================== */}
			<section className="zy-section" id="rich-presence" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 36px" }}>
						<h2 className="zy-heading">HOW GAMES USE ZYCORD TO DRIVE GROWTH</h2>
					</div>
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/dev-icon-1.png" alt="" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>Connect your game to Zycord</h3>
							<p className="zy-body">
								Social Layer integration links in-game accounts with Zycord accounts, so players stay connected beyond the session.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/dev-icon-2.png" alt="" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>Stay top of mind beyond gameplay</h3>
							<p className="zy-body">
								Live Rich Presence, custom status badges, and Profile Widgets keep your game present in conversations on Zycord.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/dev-icon-3.webp" alt="" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>Turn social activity into outcomes</h3>
							<p className="zy-body">
								With your game connected to Zycord, you can drive longer playtime, reach new players, and launch embedded Activities.
							</p>
						</article>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    5. 3 CORE PILLARS (DEVELOPER PORTAL, DOCS, SOCIAL SDK)
			    ===================================================================== */}
			<section className="zy-section" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 40px" }}>
						<span className="zy-eyebrow">Valuable Individually. Incredibly Powerful Together.</span>
						<h2 className="zy-heading" style={{ marginTop: "14px" }}>EXPLORE THE ZYCORD DEVELOPER SUITE</h2>
					</div>

					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/dev-portal-card.png" alt="Developer Portal" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>DEVELOPER PORTAL</h3>
							<p className="zy-body">
								Create applications, generate Bot tokens, configure OAuth2 redirect URIs, upload Rich Presence assets, and build Profile Widgets.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-primary zy-btn-sm" href="/developers/applications">Manage Applications →</a>
							</div>
						</article>

						<article className="zy-card">
							<img src="/site/media/discord/dev-docs-card.png" alt="API Documentation" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>API &amp; GATEWAY DOCS</h3>
							<p className="zy-body">
								100% compatible with Zycord REST API v9/v10 and WebSocket Gateway opcodes, intents, slash commands, and webhooks.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-secondary zy-btn-sm" href="/_spacebar/api/openapi.json" target="_blank" rel="noopener">OpenAPI JSON Spec ↗</a>
							</div>
						</article>

						<article className="zy-card">
							<img src="/site/media/discord/dev-help-card.png" alt="Social SDK & Activities" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>SOCIAL SDK &amp; ACTIVITIES</h3>
							<p className="zy-body">
								Embed multiplayer HTML5/WebGL games directly inside Zycord voice channels or sync unified friend lists and party invites.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-ghost zy-btn-sm" href="/developers/applications">Create an Activity →</a>
							</div>
						</article>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    6. INTERACTIVE SDK & API QUICKSTART TABS
			    ===================================================================== */}
			<section className="zy-section" id="sdk-quickstart" style={{ paddingTop: "16px" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<div className="zy-showcase-card" id="commerce">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">DROP-IN API &amp; GATEWAY COMPATIBILITY</h2>
								<p className="zy-body-lg">
									Connect your automated bots, slash command services, or custom HTTP/WebSocket clients directly to Zycord's REST and Gateway endpoints.
								</p>
								<div className="zy-tab-strip" data-zy-tabs="dev-code-panels">
									<button type="button" className="zy-tab-btn is-active" data-zy-tab="bot" style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>
										<span>Gateway Bot</span>
									</button>
									<button type="button" className="zy-tab-btn" data-zy-tab="rest" style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
										<span>REST v9 Message</span>
									</button>
									<button type="button" className="zy-tab-btn" data-zy-tab="oauth" style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
										<span>OAuth2 Flow</span>
									</button>
								</div>
							</div>

							<div className="zy-app-window" id="dev-code-panels">
								<div className="zy-app-titlebar">
									<div className="zy-window-dots">
										<span className="zy-window-dot red"></span>
										<span className="zy-window-dot amber"></span>
										<span className="zy-window-dot green"></span>
									</div>
									<span>zycord-sdk-quickstart.ts</span>
									<span style={{ color: "var(--color-spring-green)" }}>v9 / v10 Ready</span>
								</div>

								<pre
									data-zy-panel="bot"
									style={{
										margin: 0,
										padding: "20px",
										background: "#0d0f1d",
										color: "#d6deff",
										fontFamily: "var(--font-mono)",
										fontSize: "13px",
										lineHeight: "1.6",
										overflowX: "auto"
									}}
								>
									<code>{`// Connect a Bot to the Zycord WebSocket Gateway
const ws = new WebSocket("wss://" + location.host + "/?v=9&encoding=json");

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: 2, // IDENTIFY
    d: {
      token: "Bot YOUR_ZYCORD_BOT_TOKEN",
      intents: 513, // GUILDS | GUILD_MESSAGES
      properties: { $os: "linux", $browser: "zycord-bot", $device: "zycord-bot" }
    }
  }));
};`}</code>
								</pre>

								<pre
									data-zy-panel="rest"
									style={{
										display: "none",
										margin: 0,
										padding: "20px",
										background: "#0d0f1d",
										color: "#d6deff",
										fontFamily: "var(--font-mono)",
										fontSize: "13px",
										lineHeight: "1.6",
										overflowX: "auto"
									}}
								>
									<code>{`// Send an Embed & ActionRow via Zycord REST API v9
await fetch("/api/v9/channels/CHANNEL_ID/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bot YOUR_ZYCORD_BOT_TOKEN",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    content: "[READY] Tournament Match Lobby Open!",
    embeds: [{ title: "Squad Lobby #4", color: 0x5865f2 }]
  })
});`}</code>
								</pre>

								<pre
									data-zy-panel="oauth"
									style={{
										display: "none",
										margin: 0,
										padding: "20px",
										background: "#0d0f1d",
										color: "#d6deff",
										fontFamily: "var(--font-mono)",
										fontSize: "13px",
										lineHeight: "1.6",
										overflowX: "auto"
									}}
								>
									<code>{`// Authorize Users or Install Bots via OAuth2
const authorizeUrl = new URL("/oauth2/authorize", location.origin);
authorizeUrl.searchParams.set("client_id", "YOUR_APP_CLIENT_ID");
authorizeUrl.searchParams.set("scope", "bot applications.commands identify");
authorizeUrl.searchParams.set("permissions", "8"); // Administrator`}</code>
								</pre>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
