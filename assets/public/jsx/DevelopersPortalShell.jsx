import { h, mountJSX } from "./runtime.jsx";

export function DevelopersPortalTopbar() {
	return (
		<header className="zy-dev-topbar">
			<div className="zy-dev-topbar-left">
				<a className="zy-dev-logo" href="/developers">
					<img src="/branding/zycord_icon_white.svg" alt="Zycord" width="28" height="28" style={{ display: "block" }} />
					<span>Zycord</span>
					<span className="zy-dev-badge">DEVELOPERS</span>
				</a>
				<nav className="zy-dev-topnav" aria-label="Developer Global Navigation">
					<a href="/developers/applications" className="is-active">Applications</a>
					<a href="/developers/docs">Documentation</a>
					<a href="/developers">Zycord for Game Developers</a>
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

function initDevelopersPortalShell() {
	const topMount = document.getElementById("zy-dev-topbar-mount");
	if (topMount) {
		mountJSX(topMount, <DevelopersPortalTopbar />);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
} else {
	initDevelopersPortalShell();
}
