import { h, mountJSX } from "./runtime.jsx";

export function DevelopersPortalTopbar() {
	return (
		<header className="zy-dev-topbar">
			<div className="zy-dev-topbar-left">
				<a className="zy-dev-logo" href="/developers">
					<img src="/favicon.svg" alt="" width="28" height="28" />
					<span>Zycord</span>
					<span className="zy-dev-badge">DEVELOPERS</span>
				</a>
				<nav className="zy-dev-topnav" aria-label="Developer Global Navigation">
					<a href="/developers/applications" className="is-active">Applications</a>
					<a href="/developers">Developer Home</a>
					<a href="/developers#rich-presence">Social SDK</a>
					<a href="/developers#sdk-quickstart">Documentation</a>
					<a href="/_spacebar/api/openapi.json" target="_blank" rel="noopener">OpenAPI Spec ↗</a>
				</nav>
			</div>
			<div className="zy-dev-topbar-right">
				<a className="zy-dev-pill-btn" href="/status">
					<span className="zy-dev-dot"></span>
					<span>API Operational</span>
				</a>
				<a className="zy-dev-app-btn" href="/app">Open Zycord App</a>
			</div>
		</header>
	);
}

export function DevelopersPortalHeroBanner() {
	return (
		<div className="zy-dev-hero-banner">
			<div className="zy-dev-hero-copy">
				<span className="zy-dev-eyebrow">✦ ZYCORD DEVELOPER PORTAL · HOME</span>
				<h2>Build Bots, Social SDK Integrations &amp; Multiplayer Activities</h2>
				<p>
					Manage your OAuth2 credentials, Bot users, Gateway intents, Rich Presence assets, Profile Widgets, and embedded voice channel Activities.
				</p>
				<div className="zy-dev-hero-pills">
					<a href="/developers#sdk-quickstart">📘 Quickstart Guide</a>
					<a href="/_spacebar/api/openapi.json" target="_blank" rel="noopener">⚡ OpenAPI v9/v10 JSON</a>
					<a href="/support">🛟 Developer Support</a>
				</div>
			</div>
			<div className="zy-dev-hero-art">
				<img
					src="/site/media/discord/dev-hero-16x9.webp"
					alt="Zycord Developer Ecosystem"
					className="zy-dev-hero-img"
				/>
				<img
					src="/site/media/discord/dev-clyde-3d.webp"
					alt=""
					aria-hidden="true"
					className="zy-dev-clyde-float"
				/>
			</div>
		</div>
	);
}

function initDevelopersPortalShell() {
	const topMount = document.getElementById("zy-dev-topbar-mount");
	if (topMount) {
		mountJSX(topMount, <DevelopersPortalTopbar />);
	}
	const heroMount = document.getElementById("zy-dev-hero-mount");
	if (heroMount) {
		mountJSX(heroMount, <DevelopersPortalHeroBanner />);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
} else {
	initDevelopersPortalShell();
}
