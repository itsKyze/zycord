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
    "mask",
    "text",
    "tspan"
  ]);
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

  // assets/public/jsx/Icons.jsx
  var SVG_STRINGS = {
    overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    official: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m9 10 2 2 4-4"/></svg>`,
    announcements: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
    users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    guilds: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    reports: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
    store: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    badges: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    games: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>`,
    performance: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    status: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    system: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`
  };

  // assets/public/jsx/AdminPortalShell.jsx
  function AdminTopHeader() {
    const focusSearch = () => {
      const input = document.getElementById("nav-search");
      if (input) input.focus();
    };
    return /* @__PURE__ */ h("div", { className: "zy-admin-topbar" }, /* @__PURE__ */ h("div", { className: "zy-admin-topbar-left" }, /* @__PURE__ */ h("span", { className: "zy-admin-status-pill" }, /* @__PURE__ */ h("span", { className: "zy-admin-status-dot", "data-zy-admin-status-dot": true }), /* @__PURE__ */ h("span", { "data-zy-admin-status-text": true }, "All Systems Operational")), /* @__PURE__ */ h("span", { className: "zy-admin-topbar-divider", "aria-hidden": "true" }), /* @__PURE__ */ h("div", { className: "zy-admin-quicklinks" }, /* @__PURE__ */ h("a", { href: "https://status.zyron.site/", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "5px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })), "System Status"), /* @__PURE__ */ h("a", { href: "https://developers.zyron.site/developers/applications" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "5px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polyline", { points: "16 18 22 12 16 6" }), /* @__PURE__ */ h("polyline", { points: "8 6 2 12 8 18" })), "Developer Portal"), /* @__PURE__ */ h("a", { href: "https://app.zyron.site/nitro", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "5px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" }), /* @__PURE__ */ h("path", { d: "M3 6h18" }), /* @__PURE__ */ h("path", { d: "M16 10a4 4 0 0 1-8 0" })), "Collectibles Catalog"))), /* @__PURE__ */ h("div", { className: "zy-admin-topbar-right" }, /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "btn ghost small",
        onClick: focusSearch,
        style: { display: "inline-flex", alignItems: "center", gap: "6px" }
      },
      /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ h("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })),
      /* @__PURE__ */ h("span", null, "Quick Filter")
    ), /* @__PURE__ */ h("span", { className: "zy-admin-mascot-chip" }, /* @__PURE__ */ h("img", { src: "/site/media/zycord/safety-shield-3d.webp", alt: "", width: "22", height: "22" }), /* @__PURE__ */ h("span", null, "Staff")), /* @__PURE__ */ h("a", { className: "btn primary small", href: "https://app.zyron.site/app", style: { textDecoration: "none" } }, "Open Zycord")));
  }
  function decorateSidebarIcons() {
    const links = document.querySelectorAll("#nav a[data-tab]");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.querySelector(".zy-admin-nav-ic")) continue;
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
    fetch("/api/v9/status/summary.json", { credentials: "same-origin" }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (!data) return;
      const st = data.status && data.status.indicator || data.overallStatus || "none";
      const textEl = document.querySelector("[data-zy-admin-status-text]");
      const dotEl = document.querySelector("[data-zy-admin-status-dot]");
      if (textEl) {
        textEl.textContent = st === "none" || st === "operational" ? "All Systems Operational" : st === "minor" || st === "degraded" ? "Degraded Performance" : "Service Disruption";
      }
      if (dotEl) {
        dotEl.style.background = st === "none" || st === "operational" ? "#23a55a" : st === "minor" || st === "degraded" ? "#f0b232" : "#da373c";
      }
    }).catch(() => {
    });
  }
  function initAdminPortalShell() {
    const topMount = document.getElementById("zy-admin-topbar-mount");
    if (topMount) {
      mountJSX(topMount, /* @__PURE__ */ h(AdminTopHeader, null));
    }
    decorateSidebarIcons();
    hydrateAdminStatus();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminPortalShell);
  } else {
    initAdminPortalShell();
  }
})();
