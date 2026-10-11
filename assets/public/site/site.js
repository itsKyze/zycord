/* ============================================================================
   ZYCORD PUBLIC WEBSITE & APPLICATION ECOSYSTEM — RUNTIME & CONFIG
   Centralized Navigation, Footer, Smart Auth CTAs, Live Status & Interactive UI
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
		{ label: "Discover", href: "/discover", key: "discover" },
		{ label: "Safety", href: "/safety", key: "safety" },
		{ label: "Support", href: "/support", key: "support" },
		{ label: "Careers", href: "/careers", key: "careers" },
		{ label: "Developers", href: "/developers", key: "developers" }
	];

	var footerConfig = [
		{
			title: "Product",
			links: [
				{ label: "Download", href: "/download" },
				{ label: "Nitro & Collectibles", href: "/nitro" },
				{ label: "System Status", href: "/status" },
				{ label: "Open Web App", href: "/app" },
				{ label: "Community Directory", href: "/discover" }
			]
		},
		{
			title: "Company",
			links: [
				{ label: "About Zycord", href: "/#about" },
				{ label: "Careers & Jobs", href: "/careers" },
				{ label: "Brand & Identity", href: "/#collectibles" },
				{ label: "Platform Architecture", href: "/developers" }
			]
		},
		{
			title: "Resources",
			links: [
				{ label: "Help & Support", href: "/support" },
				{ label: "Safety Center", href: "/safety" },
				{ label: "Community Guidelines", href: "/guidelines" },
				{ label: "Server Moderation", href: "/safety#moderation" },
				{ label: "E2EE Security", href: "/safety#e2ee" }
			]
		},
		{
			title: "Developers",
			links: [
				{ label: "Developer Hub", href: "/developers" },
				{ label: "Applications & Bots", href: "/developers/applications" },
				{ label: "API Documentation", href: "/developers/docs" },
				{ label: "OpenAPI Specification", href: "/_spacebar/api/openapi.json" },
				{ label: "Rich Presence SDK", href: "/developers#rich-presence" }
			]
		},
		{
			title: "Policies",
			links: [
				{ label: "Terms of Service", href: "/terms" },
				{ label: "Privacy Policy", href: "/privacy" },
				{ label: "Community Guidelines", href: "/guidelines" },
				{ label: "Legal Center", href: "/legal" },
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
				return (
					'<li><a class="zy-nav-link' +
					activeClass +
					'" href="' +
					item.href +
					'">' +
					item.label +
					"</a></li>"
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
			'      <a class="zy-btn zy-btn-ghost zy-btn-sm" href="/status" title="Live System Status">' +
			'        <span class="zy-eyebrow-dot" data-zy-status-dot></span>' +
			'        <span data-zy-status-short>Status</span>' +
			"      </a>" +
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
			'  <div>' +
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
			'        <a class="zy-brand" href="/">' +
			'          <span class="zy-brand-mark"><img src="/favicon.svg" alt="" /></span>' +
			'          <span>Zycord</span>' +
			"        </a>" +
			'        <p class="zy-body" style="font-size:14px;max-width:260px;">' +
			"          Real-time voice, HD screen share, end-to-end encrypted DMs, custom collectibles, and community servers built for gamers and builders." +
			"        </p>" +
			'        <div>' +
			'          <a href="/status" class="zy-status-pill" data-zy-status-pill>' +
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
			" Zycord Platform. All rights reserved.</div>" +
			'      <div style="display:flex;gap:12px;flex-wrap:wrap;">' +
			'        <a class="zy-btn zy-btn-ghost zy-btn-sm" href="/download">Download App</a>' +
			'        <a class="zy-btn zy-btn-primary zy-btn-sm" data-zy-open-app href="/app">Open Zycord</a>' +
			"      </div>" +
			"    </div>" +
			'    <div class="zy-wordmark-banner" aria-hidden="true">ZYCORD</div>' +
			"  </div>" +
			"</footer>";
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
