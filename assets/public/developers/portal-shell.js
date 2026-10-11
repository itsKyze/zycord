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

  // assets/public/jsx/Icons.jsx
  var ZYCORD_MASCOT_PATH = "M6.25 4.42L6.8 4.51L6.8 4.6L7.16 4.7L7.25 4.88L7.43 4.88L7.62 5.15L7.8 5.15L9.08 6.61L9.53 6.52L9.53 6.43L9.9 6.43L9.9 6.34L10.27 6.34L10.27 6.25L10.81 6.25L10.81 6.16L13.19 6.16L13.19 6.25L13.73 6.25L13.73 6.34L14.1 6.34L14.1 6.43L14.47 6.43L14.47 6.52L14.92 6.61L16.11 5.24L16.29 5.24L16.57 4.88L16.75 4.88L16.84 4.7L17.02 4.7L17.2 4.51L17.48 4.51L17.48 4.42L18.03 4.51L18.39 4.88L18.39 5.06L18.57 5.15L18.57 5.43L18.76 5.61L18.94 6.52L19.21 6.52L19.21 6.43L19.4 6.43L19.76 6.16L20.03 6.16L20.13 5.97L20.67 5.79L21.04 5.43L21.22 5.43L22.13 4.51L22.5 4.6L22.5 5.43L22.41 5.43L22.41 5.79L22.32 5.79L22.32 6.07L22.23 6.07L22.13 6.43L21.95 6.52L21.77 6.98L21.22 7.53L20.95 7.62L20.95 7.71L21.22 7.71L21.22 7.62L21.5 7.62L21.5 7.53L21.68 7.53L21.68 7.43L22.32 7.16L22.41 7.25L22.32 7.98L22.23 7.98L22.04 8.53L21.13 9.44L20.77 9.53L20.67 9.72L20.4 9.72L20.4 9.9L20.49 9.81L21.22 9.81L21.22 9.72L21.59 9.72L21.68 9.9L21.59 9.9L21.5 10.27L21.31 10.36L21.31 10.54L20.77 11.09L20.58 11.09L20.22 11.45L19.85 11.54L19.94 12.09L20.03 12.09L20.03 12.37L20.13 12.37L20.13 12.73L20.22 12.73L20.22 13.1L20.31 13.1L20.31 13.46L20.4 13.46L20.4 13.92L20.49 13.92L20.49 14.37L20.58 14.37L20.58 15.01L20.67 15.01L20.67 15.65L20.77 15.65L20.77 17.75L20.67 17.75L20.67 18.12L20.58 18.12L20.49 18.57L20.31 18.67L20.31 18.85L19.94 19.21L19.76 19.21L19.4 19.49L18.94 19.49L18.94 19.58L18.57 19.58L18.57 19.49L17.84 19.3L16.57 18.03L16.57 17.84L16.11 17.39L16.11 17.2L15.83 17.02L15.83 16.84L15.56 16.75L15.47 16.57L15.1 16.47L15.1 16.38L8.9 16.38L8.9 16.47L8.71 16.47L8.44 16.75L8.17 16.84L8.17 17.02L7.71 17.48L7.71 17.66L7.43 17.84L7.43 18.03L7.07 18.3L7.07 18.48L6.52 19.03L6.34 19.03L5.97 19.4L5.06 19.58L5.06 19.49L4.7 19.49L4.7 19.4L4.42 19.4L4.15 19.12L3.97 19.12L3.69 18.85L3.69 18.67L3.51 18.57L3.42 18.03L3.33 18.03L3.33 17.75L3.23 17.75L3.23 15.74L3.33 15.74L3.42 14.37L3.51 14.37L3.6 13.46L3.69 13.46L3.69 13.1L3.78 13.1L3.78 12.73L3.87 12.73L3.87 12.37L3.97 12.37L3.97 12.09L4.06 12.09L4.15 11.54L3.97 11.54L3.69 11.27L3.51 11.27L3.42 11.09L3.23 11.09L2.69 10.54L2.69 10.36L2.5 10.27L2.5 10.08L2.32 9.9L2.41 9.72L2.87 9.72L2.87 9.81L3.6 9.81L3.6 9.72L3.33 9.72L3.23 9.53L2.78 9.35L2.05 8.62L2.05 8.44L1.77 8.17L1.68 7.62L1.59 7.62L1.68 7.16L2.32 7.43L2.32 7.53L2.5 7.53L2.5 7.62L3.05 7.71L3.05 7.8L3.14 7.71L2.96 7.53L2.78 7.53L2.23 6.98L2.05 6.52L1.87 6.43L1.77 5.97L1.59 5.79L1.59 5.33L1.5 5.33L1.5 4.6L1.87 4.51L2.32 5.06L2.5 5.06L2.69 5.33L2.87 5.33L3.33 5.79L3.51 5.79L3.51 5.88L3.87 5.97L3.97 6.16L4.24 6.16L4.24 6.25L4.42 6.25L4.79 6.52L5.06 6.52L5.15 5.88L5.24 5.88L5.24 5.61L5.43 5.43L5.43 5.15L5.61 5.06L5.61 4.88L5.97 4.51L6.25 4.51ZM8.17 10.17L8.07 10.17L8.07 10.27L7.89 10.27L7.89 10.36L7.71 10.36L7.71 10.45L7.53 10.45L7.53 10.54L7.43 10.54L7.43 10.63L7.34 10.63L7.25 10.81L7.16 10.81L7.16 11.0L6.98 11.09L6.98 11.27L6.89 11.27L6.89 11.54L6.8 11.54L6.8 12.46L6.89 12.46L6.89 12.73L6.98 12.73L6.98 12.91L7.16 13.0L7.16 13.19L7.25 13.19L7.25 13.28L7.34 13.28L7.43 13.46L7.62 13.46L7.71 13.64L7.89 13.64L7.89 13.73L8.17 13.73L8.17 13.83L9.17 13.83L9.17 13.73L9.44 13.73L9.44 13.64L9.63 13.64L9.63 13.55L9.72 13.55L9.72 13.46L9.9 13.46L9.9 13.37L10.08 13.28L10.08 13.1L10.27 13.0L10.27 12.82L10.36 12.82L10.36 12.64L10.45 12.64L10.45 12.27L10.54 12.27L10.54 11.73L10.45 11.73L10.45 11.36L10.36 11.36L10.36 11.09L10.17 11.0L10.17 10.81L10.08 10.81L10.08 10.72L9.99 10.72L9.9 10.54L9.72 10.54L9.63 10.36L9.44 10.36L9.44 10.27L9.17 10.27L9.17 10.17L8.26 10.17ZM14.92 10.17L14.83 10.17L14.83 10.27L14.56 10.27L14.56 10.36L14.37 10.36L14.28 10.54L14.1 10.54L14.1 10.63L14.01 10.63L14.01 10.72L13.83 10.81L13.83 11.0L13.73 11.0L13.73 11.18L13.64 11.18L13.64 11.36L13.55 11.36L13.55 11.73L13.46 11.73L13.46 12.27L13.55 12.27L13.55 12.64L13.64 12.64L13.73 13.0L13.92 13.1L13.92 13.28L14.01 13.28L14.1 13.46L14.28 13.46L14.37 13.64L14.56 13.64L14.56 13.73L14.83 13.73L14.83 13.83L15.83 13.83L15.83 13.73L16.11 13.73L16.11 13.64L16.29 13.64L16.38 13.46L16.57 13.46L16.57 13.37L16.66 13.37L16.66 13.28L16.84 13.19L16.84 13.0L17.02 12.91L17.02 12.73L17.11 12.73L17.11 12.46L17.2 12.46L17.2 11.54L17.11 11.54L17.11 11.27L17.02 11.27L16.93 10.9L16.84 10.9L16.84 10.81L16.75 10.81L16.75 10.72L16.66 10.72L16.66 10.63L16.47 10.54L16.47 10.45L16.29 10.45L16.29 10.36L16.11 10.36L16.11 10.27L15.93 10.27L15.93 10.17L15.01 10.17Z";
  function ZycordMark({ size = 28, color = "currentColor" }) {
    return /* @__PURE__ */ h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ h("path", { fill: color, "fill-rule": "evenodd", d: ZYCORD_MASCOT_PATH })
    );
  }

  // assets/public/jsx/DevelopersPortalShell.jsx
  function DevelopersPortalTopbar() {
    return /* @__PURE__ */ h("header", { className: "zy-dev-topbar" }, /* @__PURE__ */ h("div", { className: "zy-dev-topbar-left" }, /* @__PURE__ */ h("a", { className: "zy-dev-logo", href: "/developers" }, /* @__PURE__ */ h("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "8px", background: "#5865F2", color: "#fff" } }, /* @__PURE__ */ h(ZycordMark, { size: 20, color: "#ffffff" })), /* @__PURE__ */ h("span", null, "Zycord"), /* @__PURE__ */ h("span", { className: "zy-dev-badge" }, "DEVELOPERS")), /* @__PURE__ */ h("nav", { className: "zy-dev-topnav", "aria-label": "Developer Global Navigation" }, /* @__PURE__ */ h("a", { href: "/developers/applications", className: "is-active" }, "Applications"), /* @__PURE__ */ h("a", { href: "/developers" }, "Developer Home"), /* @__PURE__ */ h("a", { href: "/developers#rich-presence" }, "Social SDK"), /* @__PURE__ */ h("a", { href: "/developers#sdk-quickstart" }, "Documentation"), /* @__PURE__ */ h("a", { href: "/_spacebar/api/openapi.json", target: "_blank", rel: "noopener" }, "OpenAPI Spec"))), /* @__PURE__ */ h("div", { className: "zy-dev-topbar-right" }, /* @__PURE__ */ h("a", { className: "zy-dev-pill-btn", href: "/status" }, /* @__PURE__ */ h("span", { className: "zy-dev-dot" }), /* @__PURE__ */ h("span", null, "API Operational")), /* @__PURE__ */ h("a", { className: "zy-dev-app-btn", href: "/app" }, "Open Zycord App")));
  }
  function DevelopersPortalHeroBanner() {
    return /* @__PURE__ */ h("div", { className: "zy-dev-hero-banner" }, /* @__PURE__ */ h("div", { className: "zy-dev-hero-copy" }, /* @__PURE__ */ h("span", { className: "zy-dev-eyebrow" }, /* @__PURE__ */ h("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polyline", { points: "16 18 22 12 16 6" }), /* @__PURE__ */ h("polyline", { points: "8 6 2 12 8 18" })), "ZYCORD DEVELOPER PORTAL · HOME"), /* @__PURE__ */ h("h2", null, "Build Bots, Social SDK Integrations & Multiplayer Activities"), /* @__PURE__ */ h("p", null, "Manage your OAuth2 credentials, Bot users, Gateway intents, Rich Presence assets, Profile Widgets, and embedded voice channel Activities."), /* @__PURE__ */ h("div", { className: "zy-dev-hero-pills" }, /* @__PURE__ */ h("a", { href: "/developers#sdk-quickstart" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }), /* @__PURE__ */ h("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })), "Quickstart Guide"), /* @__PURE__ */ h("a", { href: "/_spacebar/api/openapi.json", target: "_blank", rel: "noopener" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })), "OpenAPI v9/v10 JSON"), /* @__PURE__ */ h("a", { href: "/support" }, /* @__PURE__ */ h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round", style: { marginRight: "6px", verticalAlign: "-2px" } }, /* @__PURE__ */ h("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ h("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }), /* @__PURE__ */ h("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })), "Developer Support"))), /* @__PURE__ */ h("div", { className: "zy-dev-hero-art" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/dev-hero-16x9.webp",
        alt: "Zycord Developer Ecosystem",
        className: "zy-dev-hero-img"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/dev-clyde-3d.webp",
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
