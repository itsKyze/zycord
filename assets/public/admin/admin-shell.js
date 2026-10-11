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

  // assets/public/jsx/AdminPortalShell.jsx
  function AdminTopHeader() {
    const focusSearch = () => {
      const input = document.getElementById("nav-search");
      if (input) input.focus();
    };
    return /* @__PURE__ */ h("div", { className: "zy-admin-topbar" }, /* @__PURE__ */ h("div", { className: "zy-admin-topbar-left" }, /* @__PURE__ */ h("span", { className: "zy-admin-shield-badge" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/safety-shield-3d.webp", alt: "", width: "22", height: "22" }), /* @__PURE__ */ h("span", null, "ZYCORD COMMAND CENTER")), /* @__PURE__ */ h("button", { type: "button", className: "zy-admin-cmd-btn", onClick: focusSearch }, /* @__PURE__ */ h("span", null, "🔍 Quick Jump Section..."), /* @__PURE__ */ h("kbd", null, "Ctrl K"))), /* @__PURE__ */ h("div", { className: "zy-admin-topbar-right" }, /* @__PURE__ */ h("a", { className: "zy-admin-status-chip", href: "/status", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("span", { className: "zy-admin-dot", "data-zy-admin-status-dot": true }), /* @__PURE__ */ h("span", { "data-zy-admin-status-text": true }, "All Systems Operational")), /* @__PURE__ */ h("a", { className: "zy-admin-nav-chip", href: "/developers/applications" }, /* @__PURE__ */ h("span", null, "⚡ Developer Portal")), /* @__PURE__ */ h("a", { className: "zy-admin-nav-chip primary", href: "/app" }, /* @__PURE__ */ h("span", null, "Open Zycord App →"))));
  }
  function AdminLoginShowcase() {
    return /* @__PURE__ */ h("div", { className: "zy-admin-login-art" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/safety-shield-3d.webp",
        alt: "",
        className: "zy-admin-login-shield"
      }
    ), /* @__PURE__ */ h("div", { className: "zy-admin-login-art-copy" }, /* @__PURE__ */ h("span", { className: "zy-admin-login-pill" }, "✦ ZYCORD INSTANCE ADMINISTRATION"), /* @__PURE__ */ h("h2", null, "Enterprise Control, Real-Time Moderation & Collectibles"), /* @__PURE__ */ h("p", null, "Manage users, servers, 1,099+ profile collectibles, custom badges, security reports, announcements, and live system telemetry from a unified Discord-grade console.")));
  }
  var NAV_ICONS = {
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
    fetch("/status/summary.json", { credentials: "same-origin" }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (!data) return;
      const st = data.overallStatus || "operational";
      const textEl = document.querySelector("[data-zy-admin-status-text]");
      const dotEl = document.querySelector("[data-zy-admin-status-dot]");
      if (textEl) {
        textEl.textContent = st === "operational" ? "All Systems Operational" : st === "degraded" ? "Partial Degradation" : "Service Disruption";
      }
      if (dotEl) {
        dotEl.style.background = st === "operational" ? "#57f287" : st === "degraded" ? "#fda220" : "#de2761";
      }
    }).catch(() => {
    });
  }
  function initAdminPortalShell() {
    const topMount = document.getElementById("zy-admin-topbar-mount");
    if (topMount) {
      mountJSX(topMount, /* @__PURE__ */ h(AdminTopHeader, null));
    }
    const loginMount = document.getElementById("zy-admin-login-art-mount");
    if (loginMount) {
      mountJSX(loginMount, /* @__PURE__ */ h(AdminLoginShowcase, null));
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
