/* ============================================================================
   ZYCORD PUBLIC WEBSITE & APPLICATION ECOSYSTEM — RUNTIME & CONFIG (DISCORD 2026 EDITION)
   Centralized Mega-Dropdown Navbar, Footer, Smart Auth CTAs, Live Status & Interactive UI
   ============================================================================ */

(function () {
	"use strict";

	var siteConfig = {
		name: "Zycord",
		tagline: "Group Chat That's All Fun & Games",
		routes: {
			home: "/",
			app: "/app",
			channelsMe: "/channels/@me",
			login: "/login",
			register: "/register",
			download: "/download",
			downloadWindows: "/download/windows",
			nitro: "/nitro",
			discover: "/discover",
			safety: "/safety",
			support: "/support",
			careers: "/careers",
			developers: "/developers",
			developersDocs: "/developers/docs",
			developersPortal: "/developers/applications",
			status: "/status",
			terms: "/terms",
			privacy: "/privacy",
			guidelines: "/guidelines",
			legal: "/legal",
			admin: "/admin"
		}
	};

	var navigationConfig = [
		{ label: "Download", href: "/download", key: "download" },
		{ label: "Nitro", href: "/nitro", key: "nitro" },
		{
			label: "Discover",
			href: "/discover",
			key: "discover",
			decor: "/site/media/cosmic-egg-3d.svg",
			columns: [
				{
					links: [
						{ label: "Servers", href: "/discover#directory" },
						{ label: "Quests", href: "/discover#quests" },
						{ label: "Apps & Bots", href: "/developers/applications" },
						{ label: "Collectibles Shop", href: "/nitro#collectibles" }
					]
				}
			]
		},
		{
			label: "Safety",
			href: "/safety",
			key: "safety",
			is2Col: true,
			decor: "/site/media/emerald-gem-3d.svg",
			columns: [
				{
					title: "Resources",
					links: [
						{ label: "Safety News", href: "/safety" },
						{ label: "Safety Library", href: "/safety#moderation" },
						{ label: "Community Guidelines", href: "/guidelines", external: true }
					]
				},
				{
					title: "Hubs",
					links: [
						{ label: "Parent Hub", href: "/safety#moderation" },
						{ label: "Policy Hub", href: "/legal" },
						{ label: "Privacy Hub", href: "/privacy" },
						{ label: "Transparency Hub", href: "/safety#e2ee" },
						{ label: "Wellbeing Hub", href: "/safety#checklist" }
					]
				}
			]
		},
		{
			label: "Quests",
			href: "/nitro#collectibles",
			key: "quests",
			decor: "/site/media/crown-3d.svg",
			columns: [
				{
					title: "Resources",
					links: [
						{ label: "Rewards & Collectibles", href: "/nitro#collectibles" },
						{ label: "Avatar Decorations", href: "/nitro#collectibles" },
						{ label: "Profile Effects & Frames", href: "/nitro#collectibles" },
						{ label: "Quests FAQ", href: "/support#faq" }
					]
				}
			]
		},
		{
			label: "Support",
			href: "/support",
			key: "support",
			decor: "/site/media/clyde-cube-3d.svg",
			columns: [
				{
					title: "Resources",
					links: [
						{ label: "Help Center", href: "/support" },
						{ label: "Feedback & Diagnostics", href: "/support#diagnostics" },
						{ label: "Submit a Request", href: "/support#faq" },
						{ label: "System Status", href: "/status", external: true }
					]
				}
			]
		},
		{
			label: "Blog",
			href: "/discover",
			key: "blog",
			decor: "/site/media/cosmic-egg-3d.svg",
			columns: [
				{
					title: "Collections",
					links: [
						{ label: "Featured Updates", href: "/discover" },
						{ label: "Community Spotlights", href: "/discover#directory" },
						{ label: "Zycord HQ", href: "/careers" },
						{ label: "Engineering & Developers", href: "/developers" },
						{ label: "Product & Features", href: "/nitro" }
					]
				}
			]
		},
		{
			label: "Developers",
			href: "/developers",
			key: "developers",
			is2Col: true,
			decor: "/site/media/clyde-cube-3d.svg",
			columns: [
				{
					title: "Featured",
					links: [
						{ label: "Zycord Social SDK", href: "/developers#rich-presence" },
						{ label: "Apps and Activities", href: "/developers/applications" }
					],
					subSection: {
						title: "Documentation",
						links: [
							{ label: "Developer Home", href: "/developers" },
							{ label: "Developer Documentation", href: "/developers/docs", external: true },
							{ label: "Developer Applications", href: "/developers/applications", external: true },
							{ label: "OpenAPI Specification", href: "/_spacebar/api/openapi.json", external: true }
						]
					}
				}
			]
		},
		{ label: "Careers", href: "/careers", key: "careers" }
	];

	var footerConfig = [
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
				{ label: "Newsroom", href: "/discover" }
			]
		},
		{
			title: "Resources",
			links: [
				{ label: "Support", href: "/support" },
				{ label: "Safety", href: "/safety" },
				{ label: "Blog", href: "/discover" },
				{ label: "StreamKit", href: "/developers" },
				{ label: "Creators", href: "/discover#directory" },
				{ label: "Community", href: "/guidelines" },
				{ label: "Developers", href: "/developers" },
				{ label: "Quests", href: "/nitro#collectibles" }
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

	function hasActiveSession() {
		try {
			var raw = window.localStorage.getItem("token");
			if (!raw) return false;
			var cleaned = raw.replace(/^"|"$/g, "").trim();
			return cleaned.length > 10;
		} catch (_e) {
			return false;
		}
	}

	function getCurrentPathKey() {
		var path = (window.location.pathname || "/").toLowerCase();
		if (path === "/" || path === "/index.html") return "home";
		if (path.indexOf("/download") === 0) return "download";
		if (path.indexOf("/nitro") === 0) return "nitro";
		if (path.indexOf("/discover") === 0) return "discover";
		if (path.indexOf("/safety") === 0) return "safety";
		if (path.indexOf("/support") === 0) return "support";
		if (path.indexOf("/careers") === 0) return "careers";
		if (path.indexOf("/developers") === 0) return "developers";
		if (path.indexOf("/status") === 0) return "status";
		return "";
	}

	function renderDropdownColumns(item) {
		if (!item.columns || !item.columns.length) return "";
		var colsHtml = item.columns
			.map(function (col) {
				var titleHtml = col.title ? '<div class="zy-dd-col-title">' + col.title + "</div>" : "";
				var linksHtml = (col.links || [])
					.map(function (lnk) {
						var arrow = lnk.external ? '<span class="zy-dd-ext" aria-hidden="true">↗</span>' : "";
						return (
							'<li><a class="zy-dd-link" href="' +
							lnk.href +
							'"><span>' +
							lnk.label +
							"</span>" +
							arrow +
							"</a></li>"
						);
					})
					.join("");

				var subHtml = "";
				if (col.subSection) {
					var subLinks = (col.subSection.links || [])
						.map(function (sl) {
							var arrow = sl.external ? '<span class="zy-dd-ext" aria-hidden="true">↗</span>' : "";
							return (
								'<li><a class="zy-dd-link" href="' +
								sl.href +
								'"><span>' +
								sl.label +
								"</span>" +
								arrow +
								"</a></li>"
							);
						})
						.join("");
					subHtml =
						'<div class="zy-dd-divider"></div>' +
						'<div class="zy-dd-col-title">' +
						col.subSection.title +
						"</div>" +
						'<ul class="zy-dd-list">' +
						subLinks +
						"</ul>";
				}

				return '<div class="zy-dd-col">' + titleHtml + '<ul class="zy-dd-list">' + linksHtml + "</ul>" + subHtml + "</div>";
			})
			.join("");

		var decorHtml = item.decor
			? '<img class="zy-dd-decor" src="' + item.decor + '" alt="" aria-hidden="true" loading="lazy" />'
			: "";

		return (
			'<div class="zy-nav-dropdown' +
			(item.is2Col ? " is-2col" : "") +
			'" role="menu">' +
			'  <div class="zy-dd-cols">' +
			colsHtml +
			"  </div>" +
			decorHtml +
			"</div>"
		);
	}

	function renderNavbar() {
		var mount = document.querySelector("[data-zy-navbar]");
		if (!mount) return;

		var activeKey = getCurrentPathKey();
		var authed = hasActiveSession();
		var authHref = authed ? siteConfig.routes.app : siteConfig.routes.login;
		var authLabel = authed ? "Open Zycord" : "Log In";

		var navItemsHtml = navigationConfig
			.map(function (item) {
				var activeClass = item.key === activeKey ? " is-active" : "";
				var hasDropdown = Boolean(item.columns && item.columns.length);
				var chevron = hasDropdown
					? '<svg class="zy-nav-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3.5 6 8 10.5 12.5 6"/></svg>'
					: "";
				var ddHtml = hasDropdown ? renderDropdownColumns(item) : "";
				return (
					'<li class="zy-nav-item' +
					(hasDropdown ? " has-dropdown" : "") +
					'">' +
					'  <a class="zy-nav-link' +
					activeClass +
					'" href="' +
					item.href +
					'">' +
					"    <span>" +
					item.label +
					"</span>" +
					chevron +
					"  </a>" +
					ddHtml +
					"</li>"
				);
			})
			.join("");

		var drawerItemsHtml = navigationConfig
			.map(function (item) {
				var activeClass = item.key === activeKey ? " is-active" : "";
				return (
					'<li><a class="' +
					activeClass.trim() +
					'" href="' +
					item.href +
					'"><span>' +
					item.label +
					'</span><span aria-hidden="true">→</span></a></li>'
				);
			})
			.join("");

		mount.outerHTML =
			'<div class="zy-nav-page-blur" id="zy-nav-page-blur" aria-hidden="true"></div>' +
			'<header class="zy-navbar" id="zy-navbar">' +
			'  <div class="zy-navbar-inner">' +
			'    <a class="zy-brand" href="/" aria-label="Zycord Home">' +
			'      <span class="zy-brand-mark"><img src="/favicon.svg" alt="" /></span>' +
			'      <span>Zycord</span>' +
			"    </a>" +
			'    <nav aria-label="Primary Navigation">' +
			'      <ul class="zy-nav-links">' +
			navItemsHtml +
			"      </ul>" +
			"    </nav>" +
			'    <div class="zy-nav-actions">' +
			'      <a class="zy-btn zy-btn-login" data-zy-login-cta href="' +
			authHref +
			'">' +
			authLabel +
			"</a>" +
			'      <button type="button" class="zy-mobile-toggle" id="zy-mobile-open" aria-label="Open Navigation Menu" aria-expanded="false">' +
			'        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
			"      </button>" +
			"    </div>" +
			"  </div>" +
			"</header>" +
			'<div class="zy-drawer-backdrop" id="zy-drawer-backdrop"></div>' +
			'<aside class="zy-mobile-drawer" id="zy-mobile-drawer" aria-label="Mobile Navigation">' +
			"  <div>" +
			'    <div class="zy-drawer-header">' +
			'      <a class="zy-brand" href="/">' +
			'        <span class="zy-brand-mark"><img src="/favicon.svg" alt="" /></span>' +
			'        <span>Zycord</span>' +
			"      </a>" +
			'      <button type="button" class="zy-mobile-toggle" style="display:inline-flex" id="zy-mobile-close" aria-label="Close Menu">✕</button>' +
			"    </div>" +
			'    <ul class="zy-drawer-links">' +
			'      <li><a href="/"><span>Home</span><span aria-hidden="true">→</span></a></li>' +
			drawerItemsHtml +
			'      <li><a href="/status"><span>System Status</span><span aria-hidden="true">→</span></a></li>' +
			"    </ul>" +
			"  </div>" +
			'  <div class="zy-drawer-footer">' +
			'    <a class="zy-btn zy-btn-primary" href="/app">Open Zycord in Browser</a>' +
			'    <a class="zy-btn zy-btn-secondary" href="/download/windows">Download for Windows</a>' +
			'    <a class="zy-btn zy-btn-ghost" href="' +
			authHref +
			'">' +
			authLabel +
			"</a>" +
			"  </div>" +
			"</aside>";

		var navbar = document.getElementById("zy-navbar");
		var openBtn = document.getElementById("zy-mobile-open");
		var closeBtn = document.getElementById("zy-mobile-close");
		var drawer = document.getElementById("zy-mobile-drawer");
		var backdrop = document.getElementById("zy-drawer-backdrop");
		var dropdownItems = document.querySelectorAll(".zy-nav-item.has-dropdown");

		for (var i = 0; i < dropdownItems.length; i++) {
			dropdownItems[i].addEventListener("mouseenter", function () {
				document.body.classList.add("has-nav-dd-open");
			});
			dropdownItems[i].addEventListener("mouseleave", function () {
				document.body.classList.remove("has-nav-dd-open");
			});
		}

		function setDrawer(open) {
			if (!drawer || !backdrop || !openBtn) return;
			drawer.classList.toggle("is-open", open);
			backdrop.classList.toggle("is-open", open);
			openBtn.setAttribute("aria-expanded", open ? "true" : "false");
			document.body.style.overflow = open ? "hidden" : "";
		}

		if (openBtn) openBtn.addEventListener("click", function () { setDrawer(true); });
		if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });
		if (backdrop) backdrop.addEventListener("click", function () { setDrawer(false); });

		function onScroll() {
			if (!navbar) return;
			navbar.classList.toggle("is-scrolled", window.scrollY > 12);
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}

	function renderFooter() {
		var mount = document.querySelector("[data-zy-footer]");
		if (!mount) return;

		var colsHtml = footerConfig
			.map(function (col) {
				var linksHtml = col.links
					.map(function (l) {
						return '<li><a href="' + l.href + '">' + l.label + "</a></li>";
					})
					.join("");
				return (
					"<div>" +
					'  <h3 class="zy-footer-col-title">' +
					col.title +
					"</h3>" +
					'  <ul class="zy-footer-links">' +
					linksHtml +
					"  </ul>" +
					"</div>"
				);
			})
			.join("");

		var year = new Date().getFullYear();

		mount.outerHTML =
			'<footer class="zy-footer">' +
			'  <div class="zy-container">' +
			'    <div class="zy-footer-grid">' +
			'      <div class="zy-footer-brand-col">' +
			'        <a class="zy-brand" href="/" aria-label="Zycord Home">' +
			'          <span class="zy-brand-mark" style="width:48px;height:48px;border-radius:14px;background:#ffffff;"><img src="/favicon.svg" alt="" style="width:30px;height:30px;" /></span>' +
			"        </a>" +
			"        <div>" +
			'          <div class="zy-footer-col-title" style="margin-bottom:8px;">Language</div>' +
			'          <div class="zy-lang-picker" id="zy-lang-picker" role="button" tabindex="0" aria-label="Select Language">' +
			'            <span>🌐 English (US)</span>' +
			'            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 8 10 12 6"/></svg>' +
			"          </div>" +
			"        </div>" +
			"        <div>" +
			'          <div class="zy-footer-col-title" style="margin-bottom:10px;">Social</div>' +
			'          <div class="zy-social-row">' +
			'            <a class="zy-social-btn" href="/discover" aria-label="X / Twitter" title="Community Feed"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>' +
			'            <a class="zy-social-btn" href="/discover" aria-label="Instagram" title="Visual Highlights"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>' +
			'            <a class="zy-social-btn" href="/developers" aria-label="Developer GitHub" title="Developer Platform"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>' +
			'            <a class="zy-social-btn" href="/discover" aria-label="YouTube" title="Streams & Videos"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>' +
			"          </div>" +
			"        </div>" +
			"        <div>" +
			'          <a href="/status" class="zy-status-pill" data-zy-status-pill style="background:rgba(0,0,0,0.22);border-color:rgba(255,255,255,0.2);">' +
			'            <span class="zy-eyebrow-dot" data-zy-status-dot></span>' +
			'            <span data-zy-status-label>All Systems Operational</span>' +
			"          </a>" +
			"        </div>" +
			"      </div>" +
			colsHtml +
			"    </div>" +
			'    <div class="zy-footer-bottom">' +
			'      <div class="zy-footer-meta">© ' +
			year +
			" Zycord Platform. Built for gamers, friends, and communities everywhere.</div>" +
			'      <div style="display:flex;gap:12px;flex-wrap:wrap;">' +
			'        <a class="zy-btn zy-btn-secondary zy-btn-sm" href="/download">Download Zycord</a>' +
			'        <a class="zy-btn zy-btn-login zy-btn-sm" data-zy-open-app href="/app">Open Zycord</a>' +
			"      </div>" +
			"    </div>" +
			'    <div class="zy-wordmark-banner" aria-hidden="true">ZYCORD</div>' +
			"  </div>" +
			"</footer>";

		var langPicker = document.getElementById("zy-lang-picker");
		if (langPicker) {
			var langs = ["🌐 English (US)", "🌐 العربية (Arabic)", "🌐 Français (FR)", "🌐 Español (ES)", "🌐 Deutsch (DE)", "🌐 日本語 (JA)"];
			var idx = 0;
			langPicker.addEventListener("click", function () {
				idx = (idx + 1) % langs.length;
				var span = langPicker.querySelector("span");
				if (span) span.textContent = langs[idx];
			});
		}
	}

	function upgradeAuthLinks() {
		var authed = hasActiveSession();
		var appBtns = document.querySelectorAll("[data-zy-open-app]");
		for (var i = 0; i < appBtns.length; i++) {
			var btn = appBtns[i];
			btn.setAttribute("href", siteConfig.routes.app);
			if (authed && btn.hasAttribute("data-zy-open-label-authed")) {
				btn.textContent = btn.getAttribute("data-zy-open-label-authed");
			}
		}
	}

	function hydrateLiveStatus() {
		fetch("/status/summary.json", { credentials: "same-origin" })
			.then(function (r) {
				if (!r.ok) throw new Error("status unavailable");
				return r.json();
			})
			.then(function (data) {
				var status = (data && data.overallStatus) || "operational";
				var label = "All Systems Operational";
				var color = "#57f287";
				if (status === "degraded") {
					label = "Partial Degradation";
					color = "#fda220";
				} else if (status === "outage") {
					label = "Service Disruption";
					color = "#de2761";
				}
				var labels = document.querySelectorAll("[data-zy-status-label]");
				for (var i = 0; i < labels.length; i++) {
					labels[i].textContent = label;
				}
				var dots = document.querySelectorAll("[data-zy-status-dot]");
				for (var j = 0; j < dots.length; j++) {
					dots[j].style.background = color;
					dots[j].style.boxShadow = "0 0 10px " + color;
				}
			})
			.catch(function () {
				/* Keep default operational badge */
			});
	}

	function bindAccordions() {
		var triggers = document.querySelectorAll("[data-zy-accordion-trigger]");
		for (var i = 0; i < triggers.length; i++) {
			triggers[i].addEventListener("click", function () {
				var item = this.closest(".zy-accordion-item");
				if (!item) return;
				var isOpen = item.classList.contains("is-open");
				item.classList.toggle("is-open", !isOpen);
				this.setAttribute("aria-expanded", !isOpen ? "true" : "false");
			});
		}
	}

	function bindTabGroups() {
		var groups = document.querySelectorAll("[data-zy-tabs]");
		for (var i = 0; i < groups.length; i++) {
			(function (group) {
				var buttons = group.querySelectorAll("[data-zy-tab]");
				var targetContainerId = group.getAttribute("data-zy-tabs");
				var container = targetContainerId
					? document.getElementById(targetContainerId)
					: group.parentElement;
				if (!container) return;

				for (var b = 0; b < buttons.length; b++) {
					buttons[b].addEventListener("click", function () {
						var tabName = this.getAttribute("data-zy-tab");
						for (var k = 0; k < buttons.length; k++) {
							buttons[k].classList.toggle("is-active", buttons[k] === this);
						}
						var panels = container.querySelectorAll("[data-zy-panel]");
						for (var p = 0; p < panels.length; p++) {
							var match = panels[p].getAttribute("data-zy-panel") === tabName;
							panels[p].style.display = match ? "" : "none";
						}
					});
				}
			})(groups[i]);
		}
	}

	function bindReactions() {
		var pills = document.querySelectorAll("[data-zy-reaction]");
		for (var i = 0; i < pills.length; i++) {
			pills[i].addEventListener("click", function () {
				var countNode = this.querySelector("[data-zy-reaction-count]");
				if (!countNode) return;
				var current = parseInt(countNode.textContent || "0", 10) || 0;
				var inactive = this.classList.contains("is-inactive");
				if (inactive) {
					this.classList.remove("is-inactive");
					countNode.textContent = String(current + 1);
				} else {
					this.classList.add("is-inactive");
					countNode.textContent = String(Math.max(1, current - 1));
				}
			});
		}
	}

	window.ZycordSite = {
		siteConfig: siteConfig,
		navigationConfig: navigationConfig,
		footerConfig: footerConfig,
		hasActiveSession: hasActiveSession
	};

	function init() {
		renderNavbar();
		renderFooter();
		upgradeAuthLinks();
		hydrateLiveStatus();
		bindAccordions();
		bindTabGroups();
		bindReactions();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
