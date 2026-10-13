import { h, mountJSX } from "./runtime.jsx";
import { ZycordMark } from "./Icons.jsx";

export function DevelopersPortalTopbar() {
	return (
		<header className="zy-dev-topbar">
			<div className="zy-dev-topbar-left">
				<a className="zy-dev-logo" href="/developers">
					<img src="/favicon.svg" alt="Zycord" width="28" height="28" style={{ display: "block", borderRadius: "8px" }} />
					<span>Zycord</span>
					<span className="zy-dev-badge">DEVELOPERS</span>
				</a>
				<nav className="zy-dev-topnav" aria-label="Developer Global Navigation">
					<a href="/developers/applications" className="is-active">Applications</a>
					<a href="/developers">Developer Home</a>
					<a href="/developers#rich-presence">Social SDK</a>
					<a href="/developers#sdk-quickstart">Documentation</a>
					<a href="/_zycord/api/openapi.json" target="_blank" rel="noopener">OpenAPI Spec</a>
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
				<span className="zy-dev-eyebrow">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "6px", verticalAlign: "-2px" }}>
						<polyline points="16 18 22 12 16 6" />
						<polyline points="8 6 2 12 8 18" />
					</svg>
					ZYCORD DEVELOPER PORTAL · HOME
				</span>
				<h2>Build Bots, Social SDK Integrations &amp; Multiplayer Activities</h2>
				<p>
					Manage your OAuth2 credentials, Bot users, Gateway intents, Rich Presence assets, Profile Widgets, and embedded voice channel Activities.
				</p>
				<div className="zy-dev-hero-pills">
					<a href="/developers#sdk-quickstart">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "6px", verticalAlign: "-2px" }}>
							<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
							<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
						</svg>
						Quickstart Guide
					</a>
					<a href="/_zycord/api/openapi.json" target="_blank" rel="noopener">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "6px", verticalAlign: "-2px" }}>
							<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
						</svg>
						OpenAPI v9/v10 JSON
					</a>
					<a href="/support">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "6px", verticalAlign: "-2px" }}>
							<circle cx="12" cy="12" r="10" />
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
						Developer Support
					</a>
				</div>
			</div>
			<div className="zy-dev-hero-art">
				<img
					src="/site/media/zycord/dev-hero-16x9.webp"
					alt="Zycord Developer Ecosystem"
					className="zy-dev-hero-img"
				/>
				<img
					src="/site/media/zycord/dev-clyde-3d.webp"
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
