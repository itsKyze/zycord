import { h, Fragment } from "./runtime.jsx";
import { ZycordMark } from "./Icons.jsx";
import { applySiteLanguage, getSavedLanguage } from "./i18n.js";

export const NAVIGATION_ITEMS = [
	{ label: "Download", href: "/download", key: "download" },
	{ label: "Nitro", href: "/nitro", key: "nitro" },
	{
		label: "Discover",
		href: "/discover",
		key: "discover",
		decor: "/site/media/discord/nav-discover-scroll.webp",
		decorStyle: { width: "120px", right: "-38px", bottom: "-42px" },
		columns: [
			{
				title: "Resources",
				links: [
					{ label: "Server Directory", href: "/discover#directory" },
					{ label: "Trending Games", href: "/discover#trending" }
				]
			}
		]
	},
	{
		label: "Safety",
		href: "/safety",
		key: "safety",
		is2Col: true,
		decor: "/site/media/discord/nav-safety-egg.webp",
		decorStyle: { width: "126px", right: "-36px", bottom: "-44px" },
		columns: [
			{
				title: "Resources",
				links: [
					{ label: "Family Center", href: "/safety#family-center" },
					{ label: "Safety Library", href: "/safety#safety-library" },
					{ label: "Safety News", href: "/safety#safety-news" },
					{ label: "Teen Charter", href: "/safety#teen-charter" },
					{ label: "Zycord Player's Guide", href: "/safety#players-guide" },
					{ label: "Community Guidelines", href: "/guidelines", external: true }
				]
			},
			{
				title: "Hubs",
				links: [
					{ label: "Parent Hub", href: "/safety#parent-hub" },
					{ label: "Policy Hub", href: "/safety#policy-hub" },
					{ label: "Privacy Hub", href: "/safety#privacy-hub" },
					{ label: "Transparency Hub", href: "/safety#transparency-hub" },
					{ label: "Wellbeing Hub", href: "/safety#wellbeing-hub" }
				]
			}
		]
	},
	{
		label: "Quests",
		href: "/quests",
		key: "quests",
		decor: "/site/media/discord/nav-quests-trophy.webp",
		decorStyle: { width: "128px", right: "-42px", bottom: "-46px" },
		columns: [
			{
				title: "Resources",
				links: [
					{ label: "Advertising", href: "/quests" },
					{ label: "Success Stories", href: "/quests#stories" },
					{ label: "Quests FAQ", href: "/quests#faq" }
				]
			}
		]
	},
	{
		label: "Support",
		href: "/support",
		key: "support",
		decor: "/site/media/discord/nav-support-nelly.webp",
		decorStyle: { width: "136px", right: "-44px", bottom: "-46px" },
		columns: [
			{
				title: "Resources",
				links: [
					{ label: "Help Center", href: "/support" },
					{ label: "Feedback", href: "/feedback" },
					{ label: "Submit a Request", href: "/feedback#request" },
					{ label: "System Status", href: "/status" }
				]
			}
		]
	},
	{
		label: "Blog",
		href: "/blog",
		key: "blog",
		isWide: true,
		decor: "/site/media/discord/nav-blog-cube.webp",
		decorStyle: { width: "134px", right: "-42px", bottom: "-46px" },
		columns: [
			{
				title: "Collections",
				links: [
					{ label: "Featured", href: "/blog" },
					{ label: "Community", href: "/blog#community" },
					{ label: "Zycord HQ", href: "/blog#hq" },
					{ label: "Engineering & Developers", href: "/blog#engineering" },
					{ label: "How to Zycord", href: "/blog#guides" },
					{ label: "Policy & Safety", href: "/blog#safety" },
					{ label: "Product & Features", href: "/blog#product" }
				]
			}
		]
	},
	{
		label: "Developers",
		href: "/developers",
		key: "developers",
		isWide: true,
		decor: "/site/media/discord/nav-developers-clyde.webp",
		decorStyle: { width: "142px", right: "-48px", bottom: "-52px" },
		columns: [
			{
				title: "Learn",
				links: [
					{ label: "Zycord for Game Developers", href: "/developers" },
					{ label: "Integration", href: "/developers#rich-presence" },
					{ label: "Social Commerce", href: "/developers#commerce" },
					{ label: "Apps & Activities", href: "/developers/applications" },
					{ label: "Developer Newsletter", href: "/developers#newsletter" },
					{ label: "Developer Case Studies", href: "/developers#cases" }
				],
				subSection: {
					title: "Build",
					links: [
						{ label: "Official Game Communities", href: "/discover", external: true },
						{ label: "Developer Portal", href: "/developers/applications", external: true },
						{ label: "Documentation", href: "/developers/docs", external: true },
						{ label: "Developer Help Center", href: "/support", external: true }
					]
				}
			}
		]
	},
	{ label: "Careers", href: "/careers", key: "careers" }
];

export function hasActiveSession() {
	try {
		const raw = window.localStorage.getItem("token");
		if (!raw) return false;
		const cleaned = raw.replace(/^"|"$/g, "").trim();
		return cleaned.length > 10;
	} catch (_e) {
		return false;
	}
}

export function getCurrentPathKey() {
	const path = (window.location.pathname || "/").toLowerCase();
	if (path === "/" || path === "/index.html") return "home";
	if (path.startsWith("/download")) return "download";
	if (path.startsWith("/nitro")) return "nitro";
	if (path.startsWith("/discover")) return "discover";
	if (path.startsWith("/safety")) return "safety";
	if (path.startsWith("/quests") || path.startsWith("/ads/quests")) return "quests";
	if (path.startsWith("/support")) return "support";
	if (path.startsWith("/blog")) return "blog";
	if (path.startsWith("/careers")) return "careers";
	if (path.startsWith("/developers")) return "developers";
	if (path.startsWith("/status")) return "status";
	return "";
}

function DropdownMenu({ item }) {
	if (!item.columns || !item.columns.length) return null;

	const ddClass = [
		"zy-nav-dropdown",
		item.is2Col ? "is-2col" : "",
		item.isWide ? "is-wide" : ""
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={ddClass} role="menu">
			<div className="zy-dd-cols">
				{item.columns.map((col) => (
					<div className="zy-dd-col">
						{col.title ? <div className="zy-dd-col-title">{col.title}</div> : null}
						<ul className="zy-dd-list">
							{(col.links || []).map((lnk) => (
								<li>
									<a className="zy-dd-link" href={lnk.href}>
										<span>{lnk.label}</span>
										{lnk.external ? (
											<span className="zy-dd-ext" aria-hidden="true">
												<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
													<line x1="7" y1="17" x2="17" y2="7" />
													<polyline points="7 7 17 7 17 17" />
												</svg>
											</span>
										) : null}
									</a>
								</li>
							))}
						</ul>
						{col.subSection ? (
							<Fragment>
								<div className="zy-dd-divider"></div>
								<div className="zy-dd-col-title">{col.subSection.title}</div>
								<ul className="zy-dd-list">
									{(col.subSection.links || []).map((sl) => (
										<li>
											<a className="zy-dd-link" href={sl.href}>
												<span>{sl.label}</span>
												{sl.external ? (
													<span className="zy-dd-ext" aria-hidden="true">
														<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
															<line x1="7" y1="17" x2="17" y2="7" />
															<polyline points="7 7 17 7 17 17" />
														</svg>
													</span>
												) : null}
											</a>
										</li>
									))}
								</ul>
							</Fragment>
						) : null}
					</div>
				))}
			</div>
			{item.decor ? (
				<img
					className="zy-dd-decor"
					src={item.decor}
					alt=""
					aria-hidden="true"
					style={item.decorStyle || {}}
				/>
			) : null}
		</div>
	);
}

export function ZycordNavbar() {
	const activeKey = getCurrentPathKey();
	const authed = hasActiveSession();
	const authHref = authed ? "/app" : "/login";
	const authLabel = authed ? "Open Zycord" : "Log In";

	const setDrawer = (open) => {
		const drawer = document.getElementById("zy-mobile-drawer");
		const backdrop = document.getElementById("zy-drawer-backdrop");
		const openBtn = document.getElementById("zy-mobile-open");
		if (!drawer || !backdrop || !openBtn) return;
		drawer.classList.toggle("is-open", open);
		backdrop.classList.toggle("is-open", open);
		openBtn.setAttribute("aria-expanded", open ? "true" : "false");
		document.body.style.overflow = open ? "hidden" : "";
	};

	const closeAllNavDropdowns = (exceptLi) => {
		const openItems = document.querySelectorAll(".zy-nav-item.is-open");
		for (let i = 0; i < openItems.length; i++) {
			if (openItems[i] !== exceptLi) {
				openItems[i].classList.remove("is-open");
				const trigger = openItems[i].querySelector(".zy-nav-link");
				if (trigger) trigger.setAttribute("aria-expanded", "false");
			}
		}
		if (!exceptLi) {
			document.body.classList.remove("has-nav-dd-open");
		}
	};

	if (typeof document !== "undefined" && !window.__zyNavDdBound) {
		window.__zyNavDdBound = true;
		document.addEventListener("click", (ev) => {
			if (!ev.target || !ev.target.closest || !ev.target.closest(".zy-nav-item.has-dropdown")) {
				closeAllNavDropdowns(null);
			}
		});
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "Escape") {
				closeAllNavDropdowns(null);
			}
		});
	}

	return (
		<Fragment>
			<div className="zy-nav-page-blur" id="zy-nav-page-blur" aria-hidden="true"></div>
			<header className="zy-navbar" id="zy-navbar">
				<div className="zy-navbar-inner">
					<a className="zy-brand" href="/" aria-label="Zycord Home">
						<span className="zy-brand-mark">
							<ZycordMark size={22} color="#ffffff" />
						</span>
						<span>Zycord</span>
					</a>

					<nav aria-label="Primary Navigation">
						<ul className="zy-nav-links">
							{NAVIGATION_ITEMS.map((item) => {
								const hasDropdown = Boolean(item.columns && item.columns.length);
								const isActive = item.key === activeKey;
								return (
									<li
										className={`zy-nav-item${hasDropdown ? " has-dropdown" : ""}`}
										onMouseEnter={
											hasDropdown
												? () => document.body.classList.add("has-nav-dd-open")
												: undefined
										}
										onMouseLeave={
											hasDropdown
												? (e) => {
														if (!e.currentTarget.classList.contains("is-open")) {
															document.body.classList.remove("has-nav-dd-open");
														}
												  }
												: undefined
										}
									>
										<a
											className={`zy-nav-link${isActive ? " is-active" : ""}`}
											href={item.href}
											aria-haspopup={hasDropdown ? "true" : undefined}
											aria-expanded={hasDropdown ? "false" : undefined}
											onClick={
												hasDropdown
													? (e) => {
															const li = e.currentTarget.closest(".zy-nav-item");
															if (!li) return;
															// First click opens dropdown; second click when already open navigates to the hub page
															if (!li.classList.contains("is-open")) {
																e.preventDefault();
																closeAllNavDropdowns(li);
																li.classList.add("is-open");
																e.currentTarget.setAttribute("aria-expanded", "true");
																document.body.classList.add("has-nav-dd-open");
															}
													  }
													: undefined
											}
										>
											<span>{item.label}</span>
											{hasDropdown ? (
												<svg
													className="zy-nav-chevron"
													viewBox="0 0 16 16"
													fill="none"
													stroke="currentColor"
													stroke-width="2.2"
													stroke-linecap="round"
													stroke-linejoin="round"
													aria-hidden="true"
												>
													<polyline points="3.5 6 8 10.5 12.5 6" />
												</svg>
											) : null}
										</a>
										{hasDropdown ? <DropdownMenu item={item} /> : null}
									</li>
								);
							})}
						</ul>
					</nav>

					<div className="zy-nav-actions">
						<a
							className="zy-btn zy-btn-login"
							data-zy-login-cta
							href={authHref}
						>
							{authLabel}
						</a>
						<button
							type="button"
							className="zy-mobile-toggle"
							id="zy-mobile-open"
							aria-label="Open Navigation Menu"
							aria-expanded="false"
							onClick={() => setDrawer(true)}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
							>
								<line x1="3" y1="6" x2="21" y2="6" />
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="18" x2="21" y2="18" />
							</svg>
						</button>
					</div>
				</div>
			</header>

			<div
				className="zy-drawer-backdrop"
				id="zy-drawer-backdrop"
				onClick={() => setDrawer(false)}
			></div>
			<aside
				className="zy-mobile-drawer"
				id="zy-mobile-drawer"
				aria-label="Mobile Navigation"
			>
				<div>
					<div className="zy-drawer-header">
						<a className="zy-brand" href="/">
							<span className="zy-brand-mark">
								<ZycordMark size={22} color="#ffffff" />
							</span>
							<span>Zycord</span>
						</a>
						<button
							type="button"
							className="zy-mobile-toggle"
							style={{ display: "inline-flex" }}
							id="zy-mobile-close"
							aria-label="Close Menu"
							onClick={() => setDrawer(false)}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
					<ul className="zy-drawer-links">
						<li>
							<a href="/">
								<span>Home</span>
								<span aria-hidden="true">→</span>
							</a>
						</li>
						{NAVIGATION_ITEMS.map((item) => (
							<li>
								<a
									className={item.key === activeKey ? "is-active" : ""}
									href={item.href}
								>
									<span>{item.label}</span>
									<span aria-hidden="true">→</span>
								</a>
							</li>
						))}
						<li>
							<a href="/status">
								<span>System Status</span>
								<span aria-hidden="true">→</span>
							</a>
						</li>
					</ul>
				</div>
				<div className="zy-drawer-footer">
					<a className="zy-btn zy-btn-primary" href="/app">
						Open Zycord in Browser
					</a>
					<a className="zy-btn zy-btn-secondary" href="/download/windows">
						Download for Windows
					</a>
					<a className="zy-btn zy-btn-ghost" href={authHref}>
						{authLabel}
					</a>
				</div>
			</aside>
		</Fragment>
	);
}
