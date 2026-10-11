import { h, mountJSX } from "./runtime.jsx";

export function AdminTopHeader() {
	const focusSearch = () => {
		const input = document.getElementById("nav-search");
		if (input) input.focus();
	};

	return (
		<div className="zy-admin-topbar">
			<div className="zy-admin-topbar-left">
				<span className="zy-admin-shield-badge">
					<img src="/site/media/discord/safety-shield-3d.webp" alt="" width="22" height="22" />
					<span>ZYCORD COMMAND CENTER</span>
				</span>
				<button type="button" className="zy-admin-cmd-btn" onClick={focusSearch}>
					<span>🔍 Quick Jump Section...</span>
					<kbd>Ctrl K</kbd>
				</button>
			</div>

			<div className="zy-admin-topbar-right">
				<a className="zy-admin-status-chip" href="/status" target="_blank" rel="noopener">
					<span className="zy-admin-dot" data-zy-admin-status-dot></span>
					<span data-zy-admin-status-text>All Systems Operational</span>
				</a>
				<a className="zy-admin-nav-chip" href="/developers/applications">
					<span>⚡ Developer Portal</span>
				</a>
				<a className="zy-admin-nav-chip primary" href="/app">
					<span>Open Zycord App →</span>
				</a>
			</div>
		</div>
	);
}

export function AdminLoginShowcase() {
	return (
		<div className="zy-admin-login-art">
			<img
				src="/site/media/discord/safety-shield-3d.webp"
				alt=""
				className="zy-admin-login-shield"
			/>
			<div className="zy-admin-login-art-copy">
				<span className="zy-admin-login-pill">✦ ZYCORD INSTANCE ADMINISTRATION</span>
				<h2>Enterprise Control, Real-Time Moderation &amp; Collectibles</h2>
				<p>
					Manage users, servers, 1,099+ profile collectibles, custom badges, security reports, announcements, and live system telemetry from a unified Discord-grade console.
				</p>
			</div>
		</div>
	);
}

const NAV_ICONS = {
	overview: "📊",
	settings: "⚙️",
	official: "📬",
	announcements: "📣",
	users: "👥",
	guilds: "🏰",
	reports: "🛡️",
	store: "✨",
	badges: "🏅",
	games: "🎮",
	performance: "⚡",
	status: "🟢",
	system: "🖥️"
};

function decorateSidebarIcons() {
	const links = document.querySelectorAll("#nav a[data-tab]");
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		if (link.querySelector(".zy-admin-nav-ic")) continue;
		const tab = link.getAttribute("data-tab") || "";
		const icon = NAV_ICONS[tab] || "•";
		const span = document.createElement("span");
		span.className = "zy-admin-nav-ic";
		span.setAttribute("aria-hidden", "true");
		span.textContent = icon;
		link.insertBefore(span, link.firstChild);
	}
}

function hydrateAdminStatus() {
	fetch("/status/summary.json", { credentials: "same-origin" })
		.then((r) => (r.ok ? r.json() : null))
		.then((data) => {
			if (!data) return;
			const st = data.overallStatus || "operational";
			const textEl = document.querySelector("[data-zy-admin-status-text]");
			const dotEl = document.querySelector("[data-zy-admin-status-dot]");
			if (textEl) {
				textEl.textContent =
					st === "operational"
						? "All Systems Operational"
						: st === "degraded"
						? "Partial Degradation"
						: "Service Disruption";
			}
			if (dotEl) {
				dotEl.style.background =
					st === "operational" ? "#57f287" : st === "degraded" ? "#fda220" : "#de2761";
			}
		})
		.catch(() => {});
}

function initAdminPortalShell() {
	const topMount = document.getElementById("zy-admin-topbar-mount");
	if (topMount) {
		mountJSX(topMount, <AdminTopHeader />);
	}
	const loginMount = document.getElementById("zy-admin-login-art-mount");
	if (loginMount) {
		mountJSX(loginMount, <AdminLoginShowcase />);
	}
	decorateSidebarIcons();
	hydrateAdminStatus();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAdminPortalShell);
} else {
	initAdminPortalShell();
}
