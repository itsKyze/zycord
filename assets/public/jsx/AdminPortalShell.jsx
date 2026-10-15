import { h, mountJSX } from "./runtime.jsx";
import { SVG_STRINGS } from "./Icons.jsx";

export function AdminTopHeader() {
	const focusSearch = () => {
		const input = document.getElementById("nav-search");
		if (input) input.focus();
	};

	return (
		<div className="zy-admin-topbar">
			<div className="zy-admin-topbar-left">
				<span className="zy-admin-status-pill">
					<span className="zy-admin-status-dot" data-zy-admin-status-dot></span>
					<span data-zy-admin-status-text>All Systems Operational</span>
				</span>
				<span className="zy-admin-topbar-divider" aria-hidden="true"></span>
				<div className="zy-admin-quicklinks">
					<a href="/status" target="_blank" rel="noopener">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "5px", verticalAlign: "-2px" }}>
							<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
						</svg>
						System Status
					</a>
					<a href="/developers/applications">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "5px", verticalAlign: "-2px" }}>
							<polyline points="16 18 22 12 16 6" />
							<polyline points="8 6 2 12 8 18" />
						</svg>
						Developer Portal
					</a>
					<a href="/nitro" target="_blank" rel="noopener">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: "5px", verticalAlign: "-2px" }}>
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
							<path d="M3 6h18" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
						Collectibles Catalog
					</a>
				</div>
			</div>

			<div className="zy-admin-topbar-right">
				<button
					type="button"
					className="btn ghost small"
					onClick={focusSearch}
					style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<span>Quick Filter</span>
				</button>
				<span className="zy-admin-mascot-chip">
					<img src="/site/media/zycord/safety-shield-3d.webp" alt="" width="22" height="22" />
					<span>Staff</span>
				</span>
				<a className="btn primary small" href="/app" style={{ textDecoration: "none" }}>
					Open Zycord
				</a>
			</div>
		</div>
	);
}

export function AdminLoginShowcase() {
	return (
		<div className="zy-admin-login-art">
			<div className="zy-admin-login-qr" aria-hidden="true">
				<img src="/site/media/zycord/safety-shield-3d.webp" alt="" />
			</div>
			<h2>Log in with QR Code</h2>
			<p>
				Scan this with the <strong>Zycord mobile app</strong> to log in instantly.
			</p>
		</div>
	);
}

function decorateSidebarIcons() {
	const links = document.querySelectorAll("#nav a[data-tab]");
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		const existing = link.querySelector(".zy-admin-nav-ic");
		if (existing) existing.remove();
		const tab = link.getAttribute("data-tab") || "";
		const svgMarkup = SVG_STRINGS[tab] || SVG_STRINGS.overview;
		const span = document.createElement("span");
		span.className = "zy-admin-nav-ic";
		span.setAttribute("aria-hidden", "true");
		span.innerHTML = svgMarkup;
		link.insertBefore(span, link.firstChild);
	}
}

function hydrateAdminStatus() {
	fetch("/api/v9/status/summary.json", { credentials: "same-origin" })
		.then((r) => (r.ok ? r.json() : null))
		.then((data) => {
			if (!data) return;
			const st = (data.status && data.status.indicator) || data.overallStatus || "none";
			const textEl = document.querySelector("[data-zy-admin-status-text]");
			const dotEl = document.querySelector("[data-zy-admin-status-dot]");
			if (textEl) {
				textEl.textContent =
					st === "none" || st === "operational"
						? "All Systems Operational"
						: st === "minor" || st === "degraded"
						? "Degraded Performance"
						: "Service Disruption";
			}
			if (dotEl) {
				dotEl.style.background =
					st === "none" || st === "operational"
						? "#23a55a"
						: st === "minor" || st === "degraded"
						? "#f0b232"
						: "#da373c";
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
