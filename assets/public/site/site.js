"use strict";
(() => {
  // assets/public/jsx/runtime.jsx
  var SVG_TAGS = /* @__PURE__ */ new Set([
    "svg",
    "path",
    "circle",
    "rect",
    "line",
    "polyline",
    "polygon",
    "g",
    "defs",
    "linearGradient",
    "radialGradient",
    "stop",
    "clipPath",
    "mask"
  ]);
  function Fragment(props) {
    return props.children;
  }
  function h(tag, props, ...children) {
    if (typeof tag === "function") {
      return tag({ ...props || {}, children });
    }
    const isSvg = SVG_TAGS.has(tag);
    const el = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    if (props) {
      for (const [key, val] of Object.entries(props)) {
        if (val === void 0 || val === null || val === false || key === "children" || key === "key") {
          continue;
        }
        if (key === "className" || key === "class") {
          if (isSvg) el.setAttribute("class", String(val));
          else el.className = String(val);
        } else if (key === "dangerouslySetInnerHTML" && val && typeof val.__html === "string") {
          el.innerHTML = val.__html;
        } else if (key === "style" && typeof val === "object") {
          Object.assign(el.style, val);
        } else if (key.startsWith("on") && typeof val === "function") {
          const evt = key.slice(2).toLowerCase();
          el.addEventListener(evt, val);
        } else if (key === "ref" && typeof val === "function") {
          val(el);
        } else if (val === true) {
          el.setAttribute(key, "");
          if (key in el && !isSvg) {
            try {
              el[key] = true;
            } catch (_e) {
            }
          }
        } else {
          el.setAttribute(key, String(val));
        }
      }
    }
    const appendChild = (child) => {
      if (child === null || child === void 0 || child === false || child === true) return;
      if (Array.isArray(child)) {
        child.forEach(appendChild);
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else {
        el.appendChild(document.createTextNode(String(child)));
      }
    };
    children.forEach(appendChild);
    return el;
  }
  function mountJSX(target, node) {
    if (!target) return null;
    target.innerHTML = "";
    if (Array.isArray(node)) {
      node.forEach((n) => {
        if (n instanceof Node) target.appendChild(n);
      });
    } else if (node instanceof Node) {
      target.appendChild(node);
    }
    return target;
  }
  function replaceJSX(target, node) {
    if (!target || !target.parentNode) return null;
    const parent = target.parentNode;
    if (Array.isArray(node)) {
      const frag = document.createDocumentFragment();
      node.forEach((n) => {
        if (n instanceof Node) frag.appendChild(n);
      });
      parent.replaceChild(frag, target);
    } else if (node instanceof Node) {
      parent.replaceChild(node, target);
    }
    return node;
  }

  // assets/public/jsx/Navbar.jsx
  var NAVIGATION_ITEMS = [
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
            { label: "Feedback", href: "/support#diagnostics" },
            { label: "Submit a Request", href: "/support#faq" }
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
  function hasActiveSession() {
    try {
      const raw = window.localStorage.getItem("token");
      if (!raw) return false;
      const cleaned = raw.replace(/^"|"$/g, "").trim();
      return cleaned.length > 10;
    } catch (_e) {
      return false;
    }
  }
  function getCurrentPathKey() {
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
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ h("div", { className: ddClass, role: "menu" }, /* @__PURE__ */ h("div", { className: "zy-dd-cols" }, item.columns.map((col) => /* @__PURE__ */ h("div", { className: "zy-dd-col" }, col.title ? /* @__PURE__ */ h("div", { className: "zy-dd-col-title" }, col.title) : null, /* @__PURE__ */ h("ul", { className: "zy-dd-list" }, (col.links || []).map((lnk) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { className: "zy-dd-link", href: lnk.href }, /* @__PURE__ */ h("span", null, lnk.label), lnk.external ? /* @__PURE__ */ h("span", { className: "zy-dd-ext", "aria-hidden": "true" }, "↗") : null)))), col.subSection ? /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", { className: "zy-dd-divider" }), /* @__PURE__ */ h("div", { className: "zy-dd-col-title" }, col.subSection.title), /* @__PURE__ */ h("ul", { className: "zy-dd-list" }, (col.subSection.links || []).map((sl) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { className: "zy-dd-link", href: sl.href }, /* @__PURE__ */ h("span", null, sl.label), sl.external ? /* @__PURE__ */ h("span", { className: "zy-dd-ext", "aria-hidden": "true" }, "↗") : null))))) : null))), item.decor ? /* @__PURE__ */ h(
      "img",
      {
        className: "zy-dd-decor",
        src: item.decor,
        alt: "",
        "aria-hidden": "true",
        style: item.decorStyle || {}
      }
    ) : null);
  }
  function ZycordNavbar() {
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
    return /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", { className: "zy-nav-page-blur", id: "zy-nav-page-blur", "aria-hidden": "true" }), /* @__PURE__ */ h("header", { className: "zy-navbar", id: "zy-navbar" }, /* @__PURE__ */ h("div", { className: "zy-navbar-inner" }, /* @__PURE__ */ h("a", { className: "zy-brand", href: "/", "aria-label": "Zycord Home" }, /* @__PURE__ */ h("span", { className: "zy-brand-mark" }, /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" })), /* @__PURE__ */ h("span", null, "Zycord")), /* @__PURE__ */ h("nav", { "aria-label": "Primary Navigation" }, /* @__PURE__ */ h("ul", { className: "zy-nav-links" }, NAVIGATION_ITEMS.map((item) => {
      const hasDropdown = Boolean(item.columns && item.columns.length);
      const isActive = item.key === activeKey;
      return /* @__PURE__ */ h(
        "li",
        {
          className: `zy-nav-item${hasDropdown ? " has-dropdown" : ""}`,
          onMouseEnter: hasDropdown ? () => document.body.classList.add("has-nav-dd-open") : void 0,
          onMouseLeave: hasDropdown ? () => document.body.classList.remove("has-nav-dd-open") : void 0
        },
        /* @__PURE__ */ h(
          "a",
          {
            className: `zy-nav-link${isActive ? " is-active" : ""}`,
            href: item.href
          },
          /* @__PURE__ */ h("span", null, item.label),
          hasDropdown ? /* @__PURE__ */ h(
            "svg",
            {
              className: "zy-nav-chevron",
              viewBox: "0 0 16 16",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            },
            /* @__PURE__ */ h("polyline", { points: "3.5 6 8 10.5 12.5 6" })
          ) : null
        ),
        hasDropdown ? /* @__PURE__ */ h(DropdownMenu, { item }) : null
      );
    }))), /* @__PURE__ */ h("div", { className: "zy-nav-actions" }, /* @__PURE__ */ h(
      "a",
      {
        className: "zy-btn zy-btn-login",
        "data-zy-login-cta": true,
        href: authHref
      },
      authLabel
    ), /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "zy-mobile-toggle",
        id: "zy-mobile-open",
        "aria-label": "Open Navigation Menu",
        "aria-expanded": "false",
        onClick: () => setDrawer(true)
      },
      /* @__PURE__ */ h(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.2",
          "stroke-linecap": "round"
        },
        /* @__PURE__ */ h("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
        /* @__PURE__ */ h("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
        /* @__PURE__ */ h("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
      )
    )))), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-drawer-backdrop",
        id: "zy-drawer-backdrop",
        onClick: () => setDrawer(false)
      }
    ), /* @__PURE__ */ h(
      "aside",
      {
        className: "zy-mobile-drawer",
        id: "zy-mobile-drawer",
        "aria-label": "Mobile Navigation"
      },
      /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-drawer-header" }, /* @__PURE__ */ h("a", { className: "zy-brand", href: "/" }, /* @__PURE__ */ h("span", { className: "zy-brand-mark" }, /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" })), /* @__PURE__ */ h("span", null, "Zycord")), /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "zy-mobile-toggle",
          style: { display: "inline-flex" },
          id: "zy-mobile-close",
          "aria-label": "Close Menu",
          onClick: () => setDrawer(false)
        },
        "✕"
      )), /* @__PURE__ */ h("ul", { className: "zy-drawer-links" }, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { href: "/" }, /* @__PURE__ */ h("span", null, "Home"), /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→"))), NAVIGATION_ITEMS.map((item) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h(
        "a",
        {
          className: item.key === activeKey ? "is-active" : "",
          href: item.href
        },
        /* @__PURE__ */ h("span", null, item.label),
        /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→")
      ))), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { href: "/status" }, /* @__PURE__ */ h("span", null, "System Status"), /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→"))))),
      /* @__PURE__ */ h("div", { className: "zy-drawer-footer" }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/app" }, "Open Zycord in Browser"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, "Download for Windows"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost", href: authHref }, authLabel))
    ));
  }

  // assets/public/jsx/Footer.jsx
  var FOOTER_COLUMNS = [
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
  var LANGUAGES = [
    "🌐 English (US)",
    "🌐 العربية (Arabic)",
    "🌐 Français (FR)",
    "🌐 Español (ES)",
    "🌐 Deutsch (DE)",
    "🌐 日本語 (JA)"
  ];
  function ZycordFooter() {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    let langIdx = 0;
    const cycleLanguage = (e) => {
      langIdx = (langIdx + 1) % LANGUAGES.length;
      const span = e.currentTarget.querySelector("span");
      if (span) span.textContent = LANGUAGES[langIdx];
    };
    return /* @__PURE__ */ h("footer", { className: "zy-footer" }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-footer-grid" }, /* @__PURE__ */ h("div", { className: "zy-footer-brand-col" }, /* @__PURE__ */ h("a", { className: "zy-brand", href: "/", "aria-label": "Zycord Home" }, /* @__PURE__ */ h(
      "span",
      {
        className: "zy-brand-mark",
        style: {
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "#ffffff"
        }
      },
      /* @__PURE__ */ h(
        "img",
        {
          src: "/favicon.svg",
          alt: "",
          style: { width: "30px", height: "30px" }
        }
      )
    )), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-footer-col-title", style: { marginBottom: "8px" } }, "Language"), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-lang-picker",
        id: "zy-lang-picker",
        role: "button",
        tabIndex: "0",
        "aria-label": "Select Language",
        onClick: cycleLanguage
      },
      /* @__PURE__ */ h("span", null, "🌐 English (US)"),
      /* @__PURE__ */ h(
        "svg",
        {
          width: "14",
          height: "14",
          viewBox: "0 0 16 16",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2"
        },
        /* @__PURE__ */ h("polyline", { points: "4 6 8 10 12 6" })
      )
    )), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-footer-col-title", style: { marginBottom: "10px" } }, "Social"), /* @__PURE__ */ h("div", { className: "zy-social-row" }, /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/discover",
        "aria-label": "X / Twitter",
        title: "Community Feed"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/discover",
        "aria-label": "Instagram",
        title: "Visual Highlights"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/developers",
        "aria-label": "Developer GitHub",
        title: "Developer Platform"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/discover",
        "aria-label": "YouTube",
        title: "Streams & Videos"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }))
    ))), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(
      "a",
      {
        href: "/status",
        className: "zy-status-pill",
        "data-zy-status-pill": true,
        style: {
          background: "rgba(0,0,0,0.22)",
          borderColor: "rgba(255,255,255,0.2)"
        }
      },
      /* @__PURE__ */ h("span", { className: "zy-eyebrow-dot", "data-zy-status-dot": true }),
      /* @__PURE__ */ h("span", { "data-zy-status-label": true }, "All Systems Operational")
    ))), FOOTER_COLUMNS.map((col) => /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("h3", { className: "zy-footer-col-title" }, col.title), /* @__PURE__ */ h("ul", { className: "zy-footer-links" }, col.links.map((l) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { href: l.href }, l.label))))))), /* @__PURE__ */ h("div", { className: "zy-footer-bottom" }, /* @__PURE__ */ h("div", { className: "zy-footer-meta" }, "© ", year, " Zycord Platform. Built for gamers, friends, and communities everywhere."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary zy-btn-sm", href: "/download" }, "Download Zycord"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-login zy-btn-sm", "data-zy-open-app": true, href: "/app" }, "Open Zycord"))), /* @__PURE__ */ h("div", { className: "zy-wordmark-banner", "aria-hidden": "true" }, "ZYCORD")));
  }

  // assets/public/jsx/pages/HomePage.jsx
  function HomePage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "hero-section" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "32px", top: "8%", left: "5%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-m.svg", alt: "", "aria-hidden": "true", className: "zy-star d2", style: { width: "22px", top: "15%", right: "7%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-sm.svg", alt: "", "aria-hidden": "true", className: "zy-star d3", style: { width: "16px", bottom: "18%", left: "11%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d4", style: { width: "28px", bottom: "14%", right: "12%" } }), /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "hero-grid" }, /* @__PURE__ */ h("div", { className: "hero-copy" }, /* @__PURE__ */ h("div", { className: "hero-crown-wrap" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/careers-crown.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-crown"
      }
    )), /* @__PURE__ */ h("h1", { className: "zy-display" }, "GROUP CHAT THAT'S ALL FUN & GAMES"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.")), /* @__PURE__ */ h("div", { className: "hero-art-stage" }, /* @__PURE__ */ h("div", { className: "hero-art-glow" }), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-clyde.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop tilt",
        style: { width: "118px", top: "-36px", left: "-18px", zIndex: 5 }
      }
    ), /* @__PURE__ */ h("div", { className: "hero-3d-composite" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-devices-2026.webp",
        alt: "Zycord 3D Desktop and Mobile Interface with Characters",
        className: "hero-main-devices-img",
        fetchpriority: "high"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-boy.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-boy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-girl-2026.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-girl"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-wumpus.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-wumpus"
      }
    )))), /* @__PURE__ */ h("div", { className: "hero-bottom-ctas" }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, /* @__PURE__ */ h("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ h("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ h("line", { x1: "12", y1: "15", x2: "12", y2: "3" })), /* @__PURE__ */ h("span", null, "Download for Windows")), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-btn zy-btn-primary",
        "data-zy-open-app": true,
        "data-zy-open-label-authed": "Launch Zycord App",
        href: "/app"
      },
      /* @__PURE__ */ h("span", null, "Open Zycord in your browser")
    )))), /* @__PURE__ */ h("section", { className: "zy-section", id: "chat" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/party-wumpus.gif",
        alt: "",
        "aria-hidden": "true",
        style: {
          position: "absolute",
          top: "-72px",
          left: "52%",
          transform: "translateX(-50%)",
          width: "160px",
          zIndex: 5,
          pointerEvents: "none"
        }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-egg.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop tilt",
        style: { width: "128px", top: "-52px", right: "6%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "MAKE YOUR GROUP CHATS MORE FUN"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or text chat. Set your avatar and a custom status, and write your own profile to show up in chat your way.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-magenta",
        style: { backgroundImage: "url('/site/media/discord/sec1-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec1-chat-fun.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec1-chat-fun.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "video" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-clyde-cube.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "136px", top: "-56px", left: "5%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-cerulean",
        style: { backgroundImage: "url('/site/media/discord/sec2-bkg.svg')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec2-stream.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec2-stream.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "STREAM LIKE YOU'RE IN THE SAME ROOM"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "High quality and low latency streaming makes it feel like you're hanging out on the couch with friends while playing a game, watching shows, looking at photos, or idk doing homework or something.")))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "voice" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-box.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop tilt",
        style: { width: "134px", top: "-54px", right: "7%" }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-rupee-gem.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "102px", bottom: "-38px", left: "8%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "HOP IN WHEN YOU'RE FREE, NO NEED TO CALL"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Easily hop in and out of voice or text chats without having to call or invite anyone, so your party chat lasts before, during, and after your game session.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-emerald",
        style: { backgroundImage: "url('/site/media/discord/sec3-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec3-hop-in.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec3-hop-in.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("div", { className: "zy-marquee-band", "aria-hidden": "true" }, /* @__PURE__ */ h("div", { className: "zy-marquee-track" }, [0, 1, 2, 3].map(() => /* @__PURE__ */ h("div", { className: "zy-marquee-item" }, /* @__PURE__ */ h("span", null, "TALK"), /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" }), /* @__PURE__ */ h("span", null, "PLAY"), /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" }), /* @__PURE__ */ h("span", null, "CHAT"), /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" }), /* @__PURE__ */ h("span", null, "HANG OUT"), /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "" }))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "presence" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-coin.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "110px", top: "-46px", left: "6%" }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-turnip.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop tilt",
        style: { width: "120px", bottom: "-44px", right: "8%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-blurple",
        style: { backgroundImage: "url('/site/media/discord/sec4-bkg.svg')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec4-chill.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec4-chill.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "SEE WHO'S AROUND TO CHILL"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "See who's around, playing games, or just hanging out. For supported games, you can see what modes or characters your friends are playing and directly join up.")))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "activities" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/sec5-garfield-simon.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "152px", top: "-68px", right: "10%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "ALWAYS HAVE SOMETHING TO DO TOGETHER"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Watch videos, play built-in games, listen to music, or just scroll together and spam memes. Seamlessly text, call, video chat, and play games, all in one group chat.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-sunset",
        style: { backgroundImage: "url('/site/media/discord/sec5-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec5-activities.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec5-activities.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "platforms" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-plump.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop tilt",
        style: { width: "126px", top: "-52px", left: "6%" }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-cerulean",
        style: { backgroundImage: "url('/site/media/discord/sec6-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec6-platforms.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec6-platforms.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "WHEREVER YOU GAME, HANG OUT HERE"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "On your PC, phone, or console, you can still hang out on Zycord. Easily switch between devices and use tools to manage multiple group chats with friends.")))))), /* @__PURE__ */ h("section", { className: "final-horizon-section", id: "about" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "30px", top: "10%", left: "14%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-m.svg", alt: "", "aria-hidden": "true", className: "zy-star d3", style: { width: "22px", top: "16%", right: "16%" } }), /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h(
      "h2",
      {
        className: "zy-display",
        style: {
          fontSize: "clamp(32px, 4.8vw, 58px)",
          maxWidth: "920px",
          margin: "0 auto"
        }
      },
      "YOU CAN'T SCROLL ANYMORE. BETTER GO CHAT."
    ), /* @__PURE__ */ h("div", { className: "hero-bottom-ctas", style: { marginTop: "32px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, /* @__PURE__ */ h("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ h("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ h("line", { x1: "12", y1: "15", x2: "12", y2: "3" })), /* @__PURE__ */ h("span", null, "Download for Windows")), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-btn zy-btn-primary",
        "data-zy-open-app": true,
        "data-zy-open-label-authed": "Launch Zycord App",
        href: "/app"
      },
      /* @__PURE__ */ h("span", null, "Open Zycord in your browser")
    ))), /* @__PURE__ */ h("div", { className: "final-horizon-art" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-horizon.webp",
        alt: "Zycord Cosmic Horizon Banner",
        className: "final-horizon-bg",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-wumpus-sitting.webp",
        alt: "Wumpus sitting on the cosmic horizon",
        className: "final-horizon-wumpus",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-wumpus-leaf.webp",
        alt: "",
        "aria-hidden": "true",
        className: "final-horizon-leaf",
        loading: "lazy"
      }
    ))));
  }

  // assets/public/jsx/pages/SubPages.jsx
  function DownloadPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "28px", top: "8%", left: "6%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-m.svg", alt: "", "aria-hidden": "true", className: "zy-star d2", style: { width: "22px", top: "14%", right: "9%" } }), /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-clyde-point.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "128px", top: "-46px", right: "5%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow-dot", "data-zy-status-dot": true }), /* @__PURE__ */ h("span", null, "Latest Release v4.0 · 64-bit Desktop & Web"))), /* @__PURE__ */ h("h1", { className: "zy-display" }, "GET ZYCORD FOR ANY DEVICE"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "An adventure awaits. Hang out with your friends on our desktop app and keep the conversation going on mobile and web."), /* @__PURE__ */ h("div", { style: { display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/download/windows" }, /* @__PURE__ */ h("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ h("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ h("line", { x1: "12", y1: "15", x2: "12", y2: "3" })), /* @__PURE__ */ h("span", null, "Download for Windows")), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", "data-zy-open-app": true, href: "/app" }, /* @__PURE__ */ h("span", null, "Open Zycord in Browser"))), /* @__PURE__ */ h("div", { style: { fontSize: "13px", color: "var(--color-fog)" } }, "Windows 10 / 11 (64-bit) · Signed NSIS Installer (ZycordSetup.exe)")), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-cerulean", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-hero.webp",
        alt: "Zycord on Desktop and Mobile",
        style: { width: "100%", height: "auto", borderRadius: "20px", display: "block" }
      }
    )))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-desktop-card.webp", alt: "Zycord for Desktop", style: { width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "WINDOWS DESKTOP"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Native desktop client with system tray integration, global push-to-talk keybinds, and hardware-accelerated 1080p 60fps screen share."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/download/windows" }, "Download for Windows"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-mobile-card.webp", alt: "Zycord for Mobile & Web", style: { width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "WEB & MOBILE PWA"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Instant browser access on Chrome, Edge, Firefox, and Safari — plus installable PWA for iOS, Android, macOS, and Linux."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary zy-btn-sm", "data-zy-open-app": true, href: "/app" }, "Launch Web App"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-console-card.webp", alt: "Zycord Rich Presence & Console Sync", style: { width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "CONNECTED ACCOUNTS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Link Steam, PlayStation, Xbox, Epic Games, Spotify, Twitch, YouTube, and GitHub to display live Rich Presence on your profile."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", "data-zy-open-app": true, href: "/app" }, "Connect Accounts →")))))));
  }
  function QuestsPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "28px", top: "8%", left: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nav-quests-trophy.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "136px", top: "-46px", right: "6%" } }), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-showcase-card",
        style: {
          backgroundImage: "linear-gradient(135deg, rgba(16,19,62,0.88), rgba(45,56,195,0.78)), url('/site/media/discord/quests-hero-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      },
      /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "✦ Zycord Quests & Rewards")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "PLAY GAMES. COMPLETE QUESTS. EARN REWARDS."), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Stream your favorite games to friends on Zycord, discover new titles, and unlock exclusive Avatar Decorations, Nameplates, Profile Effects, and Profile Frames."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", "data-zy-open-app": true, href: "/app" }, "Explore Quests in App"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/nitro" }, "View Collectibles Shop"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple" }, /* @__PURE__ */ h(
        "img",
        {
          src: "/site/media/discord/quests-wumpus-banner.webp",
          alt: "Zycord Quests Wumpus Spellcraft Reward Banner",
          style: { width: "100%", height: "auto", borderRadius: "20px", display: "block" }
        }
      )))
    ))), /* @__PURE__ */ h("section", { className: "zy-section", id: "stories", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "740px", margin: "0 auto 40px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "How Quests Work"), /* @__PURE__ */ h("h2", { className: "zy-heading", style: { marginTop: "14px" } }, "THREE STEPS TO UNLOCK COLLECTIBLES")), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-1.webp", alt: "Accept a Quest", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, "1. ACCEPT YOUR QUEST"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Browse active Quests in Zycord User Settings or the Discover tab and enroll with a single click.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-2.webp", alt: "Play or Stream", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, "2. PLAY OR STREAM TO FRIENDS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Hop into a voice channel and stream 1080p 60fps gameplay to your squad while Rich Presence tracks your progress.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-3.webp", alt: "Claim Your Reward", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, "3. EQUIP YOUR REWARD"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Claim limited-edition Avatar Decorations, Nameplates, Profile Effects, and Profile Frames immediately."))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "faq", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { maxWidth: "860px" } }, /* @__PURE__ */ h("h2", { className: "zy-heading", style: { textAlign: "center", marginBottom: "28px" } }, "QUESTS FAQ"), /* @__PURE__ */ h("div", { className: "zy-accordion" }, /* @__PURE__ */ h("div", { className: "zy-accordion-item is-open" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-accordion-trigger", "data-zy-accordion-trigger": true, "aria-expanded": "true" }, /* @__PURE__ */ h("span", null, "Where do my unlocked Quest rewards appear?"), /* @__PURE__ */ h("span", { className: "zy-accordion-icon" }, "▾")), /* @__PURE__ */ h("div", { className: "zy-accordion-content" }, "All unlocked Avatar Decorations, Nameplates, Profile Effects, and Profile Frames appear directly in ", /* @__PURE__ */ h("strong", null, "User Settings → Profiles"), " inside Zycord.")), /* @__PURE__ */ h("div", { className: "zy-accordion-item" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-accordion-trigger", "data-zy-accordion-trigger": true, "aria-expanded": "false" }, /* @__PURE__ */ h("span", null, "Can developers create custom activities and Rich Presence quests?"), /* @__PURE__ */ h("span", { className: "zy-accordion-icon" }, "▾")), /* @__PURE__ */ h("div", { className: "zy-accordion-content" }, "Yes! Visit the ", /* @__PURE__ */ h("a", { href: "/developers/applications", style: { color: "#fff", textDecoration: "underline" } }, "Zycord Developer Portal"), " to configure Rich Presence assets, Profile Widgets, and embedded Activities."))))));
  }
  function BlogPage() {
    const posts = [
      {
        cat: "Product & Features",
        id: "product",
        img: "/site/media/discord/sec1-chat-fun.webp",
        title: "Introducing Full Profile Collectibles: Avatar Decorations, Nameplates, Effects & Frames",
        desc: "Customize every layer of your Zycord identity with 1,099+ collectibles across 9 categories, full-card profile effects, and non-obscuring perimeter frames."
      },
      {
        cat: "Engineering & Developers",
        id: "engineering",
        img: "/site/media/discord/dev-hero-16x9.webp",
        title: "How Zycord Routes Sub-20ms WebRTC Voice & 1080p 60fps Video Streams",
        desc: "A deep dive into our SFU media architecture, Opus audio packet prioritization, and hardware-accelerated screen sharing."
      },
      {
        cat: "Policy & Safety",
        id: "safety",
        img: "/site/media/discord/safety-card-1.png",
        title: "End-to-End Encrypted Direct Messages & Passkey Authentication",
        desc: "Protecting private conversations with zero-knowledge client-side WebCrypto keys, recovery codes, and WebAuthn security."
      },
      {
        cat: "Community",
        id: "community",
        img: "/site/media/discord/sec5-activities.webp",
        title: "Community Spotlight: Hosting 100-Player Esports Watch Parties",
        desc: "See how gaming communities use Stage channels, custom soundboards, and Role Icons to run weekly tournaments."
      },
      {
        cat: "Zycord HQ",
        id: "hq",
        img: "/site/media/discord/careers-office-1.webp",
        title: "Inside Zycord HQ: Building the Future of Real-Time Hangouts",
        desc: "Meet the engineering and design teams crafting a faster, more expressive communication platform."
      },
      {
        cat: "How to Zycord",
        id: "guides",
        img: "/site/media/discord/sec4-chill.webp",
        title: "How to Link Steam, Spotify, GitHub, PlayStation & Xbox for Rich Presence",
        desc: "Step-by-step guide to connecting your accounts so friends can see what you're playing and jump right into your lobby."
      }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nav-blog-cube.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "132px", top: "-42px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord Blog & Newsroom")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "STORIES, UPDATES & ENGINEERING"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "The latest product releases, engineering deep-dives, community spotlights, and safety updates from the Zycord team.")), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-magenta" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-missions.webp", alt: "Zycord Featured Update", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, posts.map((p) => /* @__PURE__ */ h("article", { className: "zy-card", id: p.id }, /* @__PURE__ */ h("img", { src: p.img, alt: p.title, style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("span", { className: "zy-eyebrow", style: { alignSelf: "flex-start", marginTop: "6px" } }, p.cat), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "20px" } }, p.title), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, p.desc), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", href: "/app" }, "Try it in Zycord →"))))))));
  }

  // assets/public/jsx/pages/DevelopersHubPage.jsx
  function DevelopersHubPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-fire-extinguisher.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "92px", top: "6%", left: "3%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-cog.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "86px", top: "10%", right: "4%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-magnet.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "84px", bottom: "12%", left: "4%" } }), /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-rubber-duck.png", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "96px", top: "-42px", right: "8%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow-dot", "data-zy-status-dot": true }), /* @__PURE__ */ h("span", null, "Zycord Developer Platform · Social SDK, Bots & Activities"))), /* @__PURE__ */ h("h1", { className: "zy-display" }, "BUILD GAMES, APPS & BOTS WHERE THE WORLD PLAYS"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Integrate Zycord's Social SDK, build automated Gateway bots, launch multiplayer embedded Activities, and power Rich Presence across desktop and web."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/developers/applications" }, /* @__PURE__ */ h("span", null, "Open Developer Portal (Applications)")), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/_spacebar/api/openapi.json", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("span", null, "OpenAPI JSON Spec ↗")))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/dev-hero-16x9.webp",
        alt: "Zycord Developer Ecosystem — Chat, Playtime, Rich Presence & Apps",
        style: { width: "100%", height: "auto", borderRadius: "20px", display: "block" }
      }
    )))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "rich-presence", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "780px", margin: "0 auto 40px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Everything You Need To Ship"), /* @__PURE__ */ h("h2", { className: "zy-heading", style: { marginTop: "14px" } }, "EXPLORE THE ZYCORD DEVELOPER SUITE")), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-portal-card.png", alt: "Developer Portal", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "DEVELOPER PORTAL"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Create applications, generate Bot tokens, configure OAuth2 redirect URIs, upload Rich Presence assets, and build Profile Widgets."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/developers/applications" }, "Manage Applications →"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-docs-card.png", alt: "API Documentation", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "API & GATEWAY DOCS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "100% compatible with Discord REST API v9/v10 and WebSocket Gateway opcodes, intents, slash commands, and webhooks."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary zy-btn-sm", href: "#sdk-quickstart" }, "Read Quickstart ↓"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-help-card.png", alt: "Social SDK & Activities", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "SOCIAL SDK & ACTIVITIES"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Embed multiplayer HTML5/WebGL games directly inside Zycord voice channels or sync unified friend lists and party invites."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", href: "/developers/applications" }, "Create an Activity →")))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "sdk-quickstart", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-clyde-3d.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "124px", top: "-46px", left: "5%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card", id: "commerce" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "DROP-IN API & GATEWAY COMPATIBILITY"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Point your existing ", /* @__PURE__ */ h("code", null, "discord.js"), ", ", /* @__PURE__ */ h("code", null, "hikari"), ", ", /* @__PURE__ */ h("code", null, "serenity"), ", or custom HTTP/WebSocket client to Zycord's REST and Gateway endpoints."), /* @__PURE__ */ h("div", { className: "zy-tab-strip", "data-zy-tabs": "dev-code-panels" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn is-active", "data-zy-tab": "bot" }, "🤖 Gateway Bot"), /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn", "data-zy-tab": "rest" }, "📨 REST v9 Message"), /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn", "data-zy-tab": "oauth" }, "🔑 OAuth2 Flow"))), /* @__PURE__ */ h("div", { className: "zy-app-window", id: "dev-code-panels" }, /* @__PURE__ */ h("div", { className: "zy-app-titlebar" }, /* @__PURE__ */ h("div", { className: "zy-window-dots" }, /* @__PURE__ */ h("span", { className: "zy-window-dot red" }), /* @__PURE__ */ h("span", { className: "zy-window-dot amber" }), /* @__PURE__ */ h("span", { className: "zy-window-dot green" })), /* @__PURE__ */ h("span", null, "zycord-sdk-quickstart.ts"), /* @__PURE__ */ h("span", { style: { color: "var(--color-spring-green)" } }, "v9 / v10 Ready")), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "bot",
        style: {
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Connect a Bot to the Zycord WebSocket Gateway
const ws = new WebSocket("wss://" + location.host + "/?v=9&encoding=json");

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: 2, // IDENTIFY
    d: {
      token: "Bot YOUR_ZYCORD_BOT_TOKEN",
      intents: 513, // GUILDS | GUILD_MESSAGES
      properties: { $os: "linux", $browser: "zycord-bot", $device: "zycord-bot" }
    }
  }));
};`)
    ), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "rest",
        style: {
          display: "none",
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Send an Embed & ActionRow via Zycord REST API v9
await fetch("/api/v9/channels/CHANNEL_ID/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bot YOUR_ZYCORD_BOT_TOKEN",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    content: "🚀 Tournament Match Ready!",
    embeds: [{ title: "Squad Lobby #4", color: 0x5865f2 }]
  })
});`)
    ), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "oauth",
        style: {
          display: "none",
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Authorize Users or Install Bots via OAuth2
const authorizeUrl = new URL("/oauth2/authorize", location.origin);
authorizeUrl.searchParams.set("client_id", "YOUR_APP_CLIENT_ID");
authorizeUrl.searchParams.set("scope", "bot applications.commands identify");
authorizeUrl.searchParams.set("permissions", "8"); // Administrator`)
    )))))));
  }

  // assets/public/jsx/index.jsx
  var PAGE_COMPONENTS = {
    home: HomePage,
    download: DownloadPage,
    quests: QuestsPage,
    blog: BlogPage,
    developers: DevelopersHubPage
  };
  function bindScrollNavbar() {
    const navbar = document.getElementById("zy-navbar");
    if (!navbar) return;
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function upgradeAuthLinks() {
    const authed = hasActiveSession();
    const appBtns = document.querySelectorAll("[data-zy-open-app]");
    for (let i = 0; i < appBtns.length; i++) {
      const btn = appBtns[i];
      btn.setAttribute("href", "/app");
      if (authed && btn.hasAttribute("data-zy-open-label-authed")) {
        const span = btn.querySelector("span") || btn;
        span.textContent = btn.getAttribute("data-zy-open-label-authed");
      }
    }
  }
  function hydrateLiveStatus() {
    fetch("/status/summary.json", { credentials: "same-origin" }).then((r) => {
      if (!r.ok) throw new Error("status unavailable");
      return r.json();
    }).then((data) => {
      const status = data && data.overallStatus || "operational";
      let label = "All Systems Operational";
      let color = "#57f287";
      if (status === "degraded") {
        label = "Partial Degradation";
        color = "#fda220";
      } else if (status === "outage") {
        label = "Service Disruption";
        color = "#de2761";
      }
      const labels = document.querySelectorAll("[data-zy-status-label]");
      for (let i = 0; i < labels.length; i++) {
        labels[i].textContent = label;
      }
      const dots = document.querySelectorAll("[data-zy-status-dot]");
      for (let j = 0; j < dots.length; j++) {
        dots[j].style.background = color;
        dots[j].style.boxShadow = "0 0 10px " + color;
      }
    }).catch(() => {
    });
  }
  function bindAccordions() {
    const triggers = document.querySelectorAll("[data-zy-accordion-trigger]");
    for (let i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function() {
        const item = this.closest(".zy-accordion-item");
        if (!item) return;
        const isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        this.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      });
    }
  }
  function bindTabGroups() {
    const groups = document.querySelectorAll("[data-zy-tabs]");
    for (let i = 0; i < groups.length; i++) {
      ((group) => {
        const buttons = group.querySelectorAll("[data-zy-tab]");
        const targetContainerId = group.getAttribute("data-zy-tabs");
        const container = targetContainerId ? document.getElementById(targetContainerId) : group.parentElement;
        if (!container) return;
        for (let b = 0; b < buttons.length; b++) {
          buttons[b].addEventListener("click", function() {
            const tabName = this.getAttribute("data-zy-tab");
            for (let k = 0; k < buttons.length; k++) {
              buttons[k].classList.toggle("is-active", buttons[k] === this);
            }
            const panels = container.querySelectorAll("[data-zy-panel]");
            for (let p = 0; p < panels.length; p++) {
              const match = panels[p].getAttribute("data-zy-panel") === tabName;
              panels[p].style.display = match ? "" : "none";
            }
          });
        }
      })(groups[i]);
    }
  }
  function bindReactions() {
    const pills = document.querySelectorAll("[data-zy-reaction]");
    for (let i = 0; i < pills.length; i++) {
      pills[i].addEventListener("click", function() {
        const countNode = this.querySelector("[data-zy-reaction-count]");
        if (!countNode) return;
        const current = parseInt(countNode.textContent || "0", 10) || 0;
        const inactive = this.classList.contains("is-inactive");
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
  function initSiteJSX() {
    const navMount = document.querySelector("[data-zy-navbar]");
    if (navMount) {
      replaceJSX(navMount, /* @__PURE__ */ h(ZycordNavbar, null));
      bindScrollNavbar();
    }
    const pageMount = document.querySelector("[data-zy-jsx-page]");
    if (pageMount) {
      const pageName = pageMount.getAttribute("data-zy-jsx-page");
      const PageComp = PAGE_COMPONENTS[pageName];
      if (PageComp) {
        mountJSX(pageMount, /* @__PURE__ */ h(PageComp, null));
      }
    }
    const footerMount = document.querySelector("[data-zy-footer]");
    if (footerMount) {
      replaceJSX(footerMount, /* @__PURE__ */ h(ZycordFooter, null));
    }
    upgradeAuthLinks();
    hydrateLiveStatus();
    bindAccordions();
    bindTabGroups();
    bindReactions();
  }
  window.ZycordSite = {
    NAVIGATION_ITEMS,
    FOOTER_COLUMNS,
    hasActiveSession,
    PAGE_COMPONENTS
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteJSX);
  } else {
    initSiteJSX();
  }
})();
