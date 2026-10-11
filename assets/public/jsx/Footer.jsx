import { h } from "./runtime.jsx";
import { ZycordMark } from "./Icons.jsx";

export const FOOTER_COLUMNS = [
	{
		title: "Product",
		links: [
			{ label: "Download", href: "/download" },
			{ label: "Nitro", href: "/nitro" },
			{ label: "Status", href: "/status" },
			{ label: "App Directory", href: "/discover" },
			{ label: "Web Browser Client", href: "/app" }
		]
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/#about" },
			{ label: "Jobs", href: "/careers" },
			{ label: "Brand & Collectibles", href: "/nitro#collectibles" },
			{ label: "Newsroom", href: "/blog" }
		]
	},
	{
		title: "Resources",
		links: [
			{ label: "Support", href: "/support" },
			{ label: "Safety", href: "/safety" },
			{ label: "Blog", href: "/blog" },
			{ label: "StreamKit", href: "/developers" },
			{ label: "Creators", href: "/discover#directory" },
			{ label: "Community", href: "/guidelines" },
			{ label: "Developers", href: "/developers" },
			{ label: "Quests", href: "/quests" }
		]
	},
	{
		title: "Policies",
		links: [
			{ label: "Terms", href: "/terms" },
			{ label: "Privacy", href: "/privacy" },
			{ label: "Cookie Settings", href: "/privacy#cookies" },
			{ label: "Guidelines", href: "/guidelines" },
			{ label: "Acknowledgements", href: "/legal" },
			{ label: "Licenses", href: "/legal" },
			{ label: "Company Information", href: "/legal" },
			{ label: "Admin Console", href: "/admin" }
		]
	}
];

const LANGUAGES = [
	"English (US)",
	"العربية (Arabic)",
	"Français (FR)",
	"Español (ES)",
	"Deutsch (DE)",
	"日本語 (JA)"
];

export function ZycordFooter() {
	const year = new Date().getFullYear();
	let langIdx = 0;

	const cycleLanguage = (e) => {
		langIdx = (langIdx + 1) % LANGUAGES.length;
		const span = e.currentTarget.querySelector("[data-lang-label]");
		if (span) span.textContent = LANGUAGES[langIdx];
	};

	return (
		<footer className="zy-footer">
			<div className="zy-container">
				<div className="zy-footer-grid">
					<div className="zy-footer-brand-col">
						<a className="zy-brand" href="/" aria-label="Zycord Home">
							<span
								className="zy-brand-mark"
								style={{
									width: "48px",
									height: "48px",
									borderRadius: "14px",
									background: "#ffffff",
									color: "#5865F2"
								}}
							>
								<ZycordMark size={30} color="#5865F2" />
							</span>
						</a>

						<div>
							<div className="zy-footer-col-title" style={{ marginBottom: "8px" }}>
								Language
							</div>
							<div
								className="zy-lang-picker"
								id="zy-lang-picker"
								role="button"
								tabIndex="0"
								aria-label="Select Language"
								onClick={cycleLanguage}
							>
								<span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10" />
										<line x1="2" y1="12" x2="22" y2="12" />
										<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
									</svg>
									<span data-lang-label>English (US)</span>
								</span>
								<svg
									width="14"
									height="14"
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="4 6 8 10 12 6" />
								</svg>
							</div>
						</div>

						<div>
							<div className="zy-footer-col-title" style={{ marginBottom: "10px" }}>
								Social
							</div>
							<div className="zy-social-row">
								<a
									className="zy-social-btn"
									href="/discover"
									aria-label="X / Twitter"
									title="Community Feed"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/discover"
									aria-label="Instagram"
									title="Visual Highlights"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/developers"
									aria-label="Developer GitHub"
									title="Developer Platform"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/discover"
									aria-label="YouTube"
									title="Streams & Videos"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
									</svg>
								</a>
							</div>
						</div>

						<div>
							<a
								href="/status"
								className="zy-status-pill"
								data-zy-status-pill
								style={{
									background: "rgba(0,0,0,0.22)",
									borderColor: "rgba(255,255,255,0.2)"
								}}
							>
								<span className="zy-eyebrow-dot" data-zy-status-dot></span>
								<span data-zy-status-label>All Systems Operational</span>
							</a>
						</div>
					</div>

					{FOOTER_COLUMNS.map((col) => (
						<div>
							<h3 className="zy-footer-col-title">{col.title}</h3>
							<ul className="zy-footer-links">
								{col.links.map((l) => (
									<li>
										<a href={l.href}>{l.label}</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="zy-footer-bottom">
					<div className="zy-footer-meta">
						© {year} Zycord Platform. Built for gamers, friends, and communities everywhere.
					</div>
					<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
						<a className="zy-btn zy-btn-secondary zy-btn-sm" href="/download">
							Download Zycord
						</a>
						<a className="zy-btn zy-btn-login zy-btn-sm" data-zy-open-app href="/app">
							Open Zycord
						</a>
					</div>
				</div>

				<div className="zy-wordmark-banner" aria-hidden="true">
					ZYCORD
				</div>
			</div>
		</footer>
	);
}
