import { h } from "../runtime.jsx";

export function DevelopersHubPage() {
	return (
		<div>
			{/* =====================================================================
			    DEVELOPER HERO — EXACT DISCORD.COM/DEVELOPERS 3D OBJECTS & 16X9 STAGE
			    ===================================================================== */}
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<img src="/site/media/discord/dev-fire-extinguisher.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "92px", top: "6%", left: "3%" }} />
				<img src="/site/media/discord/dev-cog.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "86px", top: "10%", right: "4%" }} />
				<img src="/site/media/discord/dev-magnet.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "84px", bottom: "12%", left: "4%" }} />

				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/dev-rubber-duck.png" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "96px", top: "-42px", right: "8%" }} />

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div>
									<span className="zy-eyebrow">
										<span className="zy-eyebrow-dot" data-zy-status-dot></span>
										<span>Zycord Developer Platform · Social SDK, Bots &amp; Activities</span>
									</span>
								</div>
								<h1 className="zy-display">BUILD GAMES, APPS &amp; BOTS WHERE THE WORLD PLAYS</h1>
								<p className="zy-body-lg">
									Integrate Zycord's Social SDK, build automated Gateway bots, launch multiplayer embedded Activities, and power Rich Presence across desktop and web.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" }}>
									<a className="zy-btn zy-btn-primary" href="/developers/applications">
										<span>Open Developer Portal (Applications)</span>
									</a>
									<a className="zy-btn zy-btn-secondary" href="/_spacebar/api/openapi.json" target="_blank" rel="noopener">
										<span>OpenAPI JSON Spec ↗</span>
									</a>
								</div>
							</div>

							<div className="zy-scene-stage stage-blurple">
								<img
									src="/site/media/discord/dev-hero-16x9.webp"
									alt="Zycord Developer Ecosystem — Chat, Playtime, Rich Presence & Apps"
									style={{ width: "100%", height: "auto", borderRadius: "20px", display: "block" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    3 CORE PILLARS (DOCUMENTATION, DEVELOPER PORTAL, HELP CENTER)
			    ===================================================================== */}
			<section className="zy-section" id="rich-presence" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 40px" }}>
						<span className="zy-eyebrow">Everything You Need To Ship</span>
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
								100% compatible with Discord REST API v9/v10 and WebSocket Gateway opcodes, intents, slash commands, and webhooks.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-secondary zy-btn-sm" href="#sdk-quickstart">Read Quickstart ↓</a>
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
			    INTERACTIVE SDK & API QUICKSTART TABS
			    ===================================================================== */}
			<section className="zy-section" id="sdk-quickstart" style={{ paddingTop: "16px" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/dev-clyde-3d.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "124px", top: "-46px", left: "5%" }} />

					<div className="zy-showcase-card" id="commerce">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">DROP-IN API &amp; GATEWAY COMPATIBILITY</h2>
								<p className="zy-body-lg">
									Point your existing <code>discord.js</code>, <code>hikari</code>, <code>serenity</code>, or custom HTTP/WebSocket client to Zycord's REST and Gateway endpoints.
								</p>
								<div className="zy-tab-strip" data-zy-tabs="dev-code-panels">
									<button type="button" className="zy-tab-btn is-active" data-zy-tab="bot">🤖 Gateway Bot</button>
									<button type="button" className="zy-tab-btn" data-zy-tab="rest">📨 REST v9 Message</button>
									<button type="button" className="zy-tab-btn" data-zy-tab="oauth">🔑 OAuth2 Flow</button>
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
    content: "🚀 Tournament Match Ready!",
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
