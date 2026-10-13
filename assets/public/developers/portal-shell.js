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

  // assets/public/jsx/DevelopersPortalShell.jsx
  function DevelopersPortalTopbar() {
    return /* @__PURE__ */ h("header", { className: "zy-dev-topbar" }, /* @__PURE__ */ h("div", { className: "zy-dev-topbar-left" }, /* @__PURE__ */ h("a", { className: "zy-dev-logo", href: "/developers" }, /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "Zycord", width: "28", height: "28", style: { display: "block", borderRadius: "8px" } }), /* @__PURE__ */ h("span", null, "Zycord"), /* @__PURE__ */ h("span", { className: "zy-dev-badge" }, "DEVELOPERS")), /* @__PURE__ */ h("nav", { className: "zy-dev-topnav", "aria-label": "Developer Global Navigation" }, /* @__PURE__ */ h("a", { href: "/developers/applications", className: "is-active" }, "Applications"), /* @__PURE__ */ h("a", { href: "/developers" }, "Developer Home"), /* @__PURE__ */ h("a", { href: "/developers#rich-presence" }, "Social SDK"), /* @__PURE__ */ h("a", { href: "/developers#sdk-quickstart" }, "Documentation"), /* @__PURE__ */ h("a", { href: "/_zycord/api/openapi.json", target: "_blank", rel: "noopener" }, "OpenAPI Spec"))), /* @__PURE__ */ h("div", { className: "zy-dev-topbar-right" }, /* @__PURE__ */ h("a", { className: "zy-dev-pill-btn", href: "/status" }, /* @__PURE__ */ h("span", { className: "zy-dev-dot" }), /* @__PURE__ */ h("span", null, "API Operational")), /* @__PURE__ */ h("a", { className: "zy-dev-app-btn", href: "/app" }, "Open Zycord App")));
  }
  function DevelopersPortalHeroBanner() {
    return /* @__PURE__ */ h("div", { className: "zy-dev-hero-banner" }, /* @__PURE__ */ h("div", { className: "zy-dev-hero-copy" }, /* @__PURE__ */ h("span", { className: "zy-dev-eyebrow" }, /* @__PURE__ */ h("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polyline", { points: "16 18 22 12 16 6" }), /* @__PURE__ */ h("polyline", { points: "8 6 2 12 8 18" })), "ZYCORD DEVELOPER PORTAL · HOME"), /* @__PURE__ */ h("h2", null, "Build Bots, Social SDK Integrations & Multiplayer Activities"), /* @__PURE__ */ h("p", null, "Manage your OAuth2 credentials, Bot users, Gateway intents, Rich Presence assets, Profile Widgets, and embedded voice channel Activities."), /* @__PURE__ */ h("div", { className: "zy-dev-hero-pills" }, /* @__PURE__ */ h("a", { href: "/developers#sdk-quickstart" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }), /* @__PURE__ */ h("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })), "Quickstart Guide"), /* @__PURE__ */ h("a", { href: "/_zycord/api/openapi.json", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })), "OpenAPI v9/v10 JSON"), /* @__PURE__ */ h("a", { href: "/support" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ h("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }), /* @__PURE__ */ h("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })), "Developer Support"))), /* @__PURE__ */ h("div", { className: "zy-dev-hero-art" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/zycord/dev-hero-16x9.webp",
        alt: "Zycord Developer Ecosystem",
        className: "zy-dev-hero-img"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/zycord/dev-clyde-3d.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-dev-clyde-float"
      }
    )));
  }
  function initDevelopersPortalShell() {
    const topMount = document.getElementById("zy-dev-topbar-mount");
    if (topMount) {
      mountJSX(topMount, /* @__PURE__ */ h(DevelopersPortalTopbar, null));
    }
    const heroMount = document.getElementById("zy-dev-hero-mount");
    if (heroMount) {
      mountJSX(heroMount, /* @__PURE__ */ h(DevelopersPortalHeroBanner, null));
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
  } else {
    initDevelopersPortalShell();
  }
})();
