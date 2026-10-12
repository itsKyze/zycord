import { h } from "./runtime.jsx";
import { ZycordMark } from "./Icons.jsx";
import { applySiteLanguage } from "./i18n.js";

export const FOOTER_COLUMNS = [
	{
		title: "Product",
		links: [
			{ label: "Download", href: "/download" },
			{ label: "Nitro", href: "/nitro" },
			{ label: "Status", href: "/status" },
			{ label: "App Directory", href: "/application-directory" },
			{ label: "Gift Cards", href: "/gift-cards" }
		]
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/company" },
			{ label: "Jobs", href: "/careers" },
			{ label: "Brand", href: "/branding" },
			{ label: "Newsroom", href: "/newsroom" }
		]
	},
	{
		title: "Resources",
		links: [
			{ label: "Support", href: "/support" },
			{ label: "Safety", href: "/safety" },
			{ label: "Blog", href: "/blog" },
			{ label: "Creators", href: "/creators" },
			{ label: "Community", href: "/community" },
			{ label: "Developers", href: "/developers" },
			{ label: "Quests", href: "/ads/quests" },
			{ label: "Official 3rd Party Merch", href: "/merch" },
			{ label: "Feedback", href: "/feedback" }
		]
	},
	{
		title: "Policies",
		links: [
			{ label: "Terms", href: "/terms" },
			{ label: "Privacy", href: "/privacy" },
			{ label: "Cookie Settings", href: "#cookie-settings", isCookieSettings: true },
			{ label: "Guidelines", href: "/guidelines" },
			{ label: "Acknowledgements", href: "/acknowledgements" },
			{ label: "Licenses", href: "/licenses" },
			{ label: "Company Information", href: "/company-information" }
		]
	}
];

export const LANGUAGES = [
	{ code: "cs", label: "Čeština" },
	{ code: "da", label: "Dansk" },
	{ code: "de", label: "Deutsch" },
	{ code: "en-US", label: "English" },
	{ code: "en-GB", label: "English (UK)" },
	{ code: "es-ES", label: "Español" },
	{ code: "es-419", label: "Español (América Latina)" },
	{ code: "fr", label: "Français" },
	{ code: "hr", label: "Hrvatski" },
	{ code: "it", label: "Italiano" },
	{ code: "lt", label: "Lietuviškai" },
	{ code: "hu", label: "Magyar" },
	{ code: "nl", label: "Nederlands" },
	{ code: "no", label: "Norsk" },
	{ code: "pl", label: "Polski" },
	{ code: "pt-BR", label: "Português do Brasil" },
	{ code: "ro", label: "Română" },
	{ code: "fi", label: "Suomi" },
	{ code: "sv-SE", label: "Svenska" },
	{ code: "vi", label: "Tiếng Việt" },
	{ code: "tr", label: "Türkçe" },
	{ code: "el", label: "Ελληνικά" },
	{ code: "bg", label: "Български" },
	{ code: "ru", label: "Русский" },
	{ code: "uk", label: "Українська" },
	{ code: "hi", label: "हिन्दी" },
	{ code: "th", label: "ไทย" },
	{ code: "zh-CN", label: "中文" },
	{ code: "ja", label: "日本語" },
	{ code: "zh-TW", label: "繁體中文" },
	{ code: "ko", label: "한국어" },
	{ code: "ar", label: "العربية" }
];

function openCookieSettingsModal(e) {
	if (e) e.preventDefault();
	const modal = document.getElementById("zy-cookie-modal-backdrop");
	if (modal) modal.classList.add("is-open");
}

function closeCookieSettingsModal() {
	const modal = document.getElementById("zy-cookie-modal-backdrop");
	if (modal) modal.classList.remove("is-open");
}

export function ZycordFooter() {
	let currentLang = "English";
	try {
		const saved = window.localStorage.getItem("zy_site_lang");
		if (saved) currentLang = saved;
	} catch (_e) {}

	const toggleLangMenu = (e) => {
		e.stopPropagation();
		const wrap = document.getElementById("zy-lang-dropdown-wrap");
		const btn = document.getElementById("zy-lang-picker");
		if (!wrap) return;
		const open = !wrap.classList.contains("is-open");
		wrap.classList.toggle("is-open", open);
		if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
	};

	const selectLanguage = (langObj, e) => {
		e.stopPropagation();
		currentLang = langObj.label;
		applySiteLanguage(langObj.code, langObj.label);
		const navCodeEl = document.getElementById("zy-nav-lang-code");
		if (navCodeEl) navCodeEl.textContent = (langObj.code || "en").split("-")[0].toUpperCase();

		const items = document.querySelectorAll("[data-lang-option]");
		for (let i = 0; i < items.length; i++) {
			const isSelected = items[i].getAttribute("data-lang-option") === langObj.code;
			items[i].classList.toggle("is-selected", isSelected);
			items[i].setAttribute("aria-selected", isSelected ? "true" : "false");
		}

		const wrap = document.getElementById("zy-lang-dropdown-wrap");
		const btn = document.getElementById("zy-lang-picker");
		if (wrap) wrap.classList.remove("is-open");
		if (btn) btn.setAttribute("aria-expanded", "false");
	};

	if (typeof document !== "undefined" && !window.__zyLangOutsideBound) {
		window.__zyLangOutsideBound = true;
		document.addEventListener("click", (ev) => {
			const wrap = document.getElementById("zy-lang-dropdown-wrap");
			const btn = document.getElementById("zy-lang-picker");
			if (wrap && wrap.classList.contains("is-open") && !wrap.contains(ev.target)) {
				wrap.classList.remove("is-open");
				if (btn) btn.setAttribute("aria-expanded", "false");
			}
		});
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "Escape") {
				const wrap = document.getElementById("zy-lang-dropdown-wrap");
				const btn = document.getElementById("zy-lang-picker");
				if (wrap && wrap.classList.contains("is-open")) {
					wrap.classList.remove("is-open");
					if (btn) btn.setAttribute("aria-expanded", "false");
				}
				closeCookieSettingsModal();
			}
		});
	}

	return (
		<footer className="zy-footer">
			<div className="zy-container">
				<div className="zy-footer-grid">
					<div className="zy-footer-brand-col">
						<a className="zy-footer-logo-link" href="/" aria-label="Zycord Home">
							<ZycordMark size={44} color="#ffffff" />
						</a>

						<div>
							<div className="zy-footer-col-title" style={{ marginBottom: "8px" }}>
								Language
							</div>
							<div className="zy-lang-dropdown-wrap" id="zy-lang-dropdown-wrap">
								<button
									type="button"
									className="zy-lang-picker"
									id="zy-lang-picker"
									aria-haspopup="listbox"
									aria-expanded="false"
									aria-label="Select Language"
									onClick={toggleLangMenu}
								>
									<span data-lang-label>{currentLang}</span>
									<svg
										className="zy-lang-chevron"
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="4 6 8 10 12 6" />
									</svg>
								</button>

								<ul
									className="zy-lang-menu"
									id="zy-lang-menu"
									role="listbox"
									aria-label="Languages"
								>
									{LANGUAGES.map((l) => {
										const selected = l.label === currentLang;
										return (
											<li
												role="option"
												aria-selected={selected ? "true" : "false"}
												data-lang-option={l.code}
												className={`zy-lang-option${selected ? " is-selected" : ""}`}
												onClick={(e) => selectLanguage(l, e)}
											>
												<span>{l.label}</span>
											</li>
										);
									})}
								</ul>
							</div>
						</div>

						<div>
							<div className="zy-footer-col-title" style={{ marginBottom: "10px" }}>
								Social
							</div>
							<div className="zy-social-row">
								<a
									className="zy-social-btn"
									href="/community"
									aria-label="X / Twitter"
									title="X / Twitter"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/community"
									aria-label="Instagram"
									title="Instagram"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/community"
									aria-label="Facebook"
									title="Facebook"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/community"
									aria-label="YouTube"
									title="YouTube"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
									</svg>
								</a>
								<a
									className="zy-social-btn"
									href="/community"
									aria-label="TikTok"
									title="TikTok"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
									</svg>
								</a>
							</div>
						</div>
					</div>

					{FOOTER_COLUMNS.map((col) => (
						<div>
							<h3 className="zy-footer-col-title">{col.title}</h3>
							<ul className="zy-footer-links">
								{col.links.map((l) => (
									<li>
										<a
											href={l.href}
											onClick={l.isCookieSettings ? openCookieSettingsModal : undefined}
										>
											{l.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="zy-wordmark-container" aria-hidden="true">
				<svg
					className="zy-wordmark-svg"
					viewBox="0 0 1765 340"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<text
						x="882.5"
						y="236"
						text-anchor="middle"
						fill="#E0E3FF"
						font-family="Poppins, 'Inter', system-ui, sans-serif"
						font-weight="900"
						font-size="312"
						letter-spacing="-12"
						textLength="1710"
						lengthAdjust="spacingAndGlyphs"
					>
						Zycord
					</text>
				</svg>
			</div>

			{/* Cookie Settings Modal (Discord Cookie Preferences Dialog) */}
			<div
				className="zy-cookie-modal-backdrop"
				id="zy-cookie-modal-backdrop"
				onClick={(e) => {
					if (e.target.id === "zy-cookie-modal-backdrop") closeCookieSettingsModal();
				}}
			>
				<div className="zy-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="zy-cookie-title">
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
						<h3 id="zy-cookie-title" className="zy-heading-sm" style={{ fontSize: "22px" }}>
							PRIVACY &amp; COOKIE PREFERENCES
						</h3>
						<button
							type="button"
							className="zy-btn zy-btn-ghost zy-btn-sm"
							onClick={closeCookieSettingsModal}
							aria-label="Close Cookie Preferences"
						>
							✕
						</button>
					</div>
					<p className="zy-body" style={{ fontSize: "14px", marginTop: "10px" }}>
						Zycord uses strictly necessary local storage and session cookies to authenticate your account, maintain WebSocket Gateway connections, and store your local End-to-End Encryption (E2EE) key vault. We do not sell personal data or run third-party ad trackers.
					</p>
					<div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.06)" }}>
							<div>
								<div style={{ fontWeight: "700", fontSize: "14px", color: "#fff" }}>Strictly Necessary &amp; Authentication</div>
								<div style={{ fontSize: "12px", color: "var(--color-fog)" }}>Session tokens, E2EE Key Vault, WebRTC preferences</div>
							</div>
							<span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-spring-green)" }}>Always Active</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.06)" }}>
							<div>
								<div style={{ fontWeight: "700", fontSize: "14px", color: "#fff" }}>UI &amp; Language Preferences</div>
								<div style={{ fontSize: "12px", color: "var(--color-fog)" }}>Remembers your selected language and theme settings</div>
							</div>
							<input type="checkbox" checked readOnly style={{ width: "18px", height: "18px", accentColor: "#5865f2" }} />
						</div>
					</div>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
						<a className="zy-btn zy-btn-ghost zy-btn-sm" href="/privacy">Privacy Policy</a>
						<button type="button" className="zy-btn zy-btn-primary zy-btn-sm" onClick={closeCookieSettingsModal}>
							Save Preferences
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
