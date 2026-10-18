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
    return /* @__PURE__ */ h("header", { className: "zy-dev-topbar" }, /* @__PURE__ */ h("div", { className: "zy-dev-topbar-left" }, /* @__PURE__ */ h("a", { className: "zy-dev-logo", href: "/developers" }, /* @__PURE__ */ h("img", { src: "/branding/zycord_icon_white.svg", alt: "Zycord", width: "28", height: "28", style: { display: "block" } }), /* @__PURE__ */ h("span", null, "Zycord"), /* @__PURE__ */ h("span", { className: "zy-dev-badge" }, "DEVELOPERS")), /* @__PURE__ */ h("nav", { className: "zy-dev-topnav", "aria-label": "Developer Global Navigation" }, /* @__PURE__ */ h("a", { href: "/developers/applications", className: "is-active" }, "Applications"), /* @__PURE__ */ h("a", { href: "/developers/docs" }, "Documentation"), /* @__PURE__ */ h("a", { href: "/developers" }, "Zycord for Game Developers"), /* @__PURE__ */ h("a", { href: "/_zycord/api/openapi.json", target: "_blank", rel: "noopener" }, "OpenAPI Spec"))), /* @__PURE__ */ h("div", { className: "zy-dev-topbar-right" }, /* @__PURE__ */ h("a", { className: "zy-dev-pill-btn", href: "/status" }, /* @__PURE__ */ h("span", { className: "zy-dev-dot" }), /* @__PURE__ */ h("span", null, "API Operational")), /* @__PURE__ */ h("a", { className: "zy-dev-app-btn", href: "/app" }, "Open Zycord App")));
  }
  function initDevelopersPortalShell() {
    const topMount = document.getElementById("zy-dev-topbar-mount");
    if (topMount) {
      mountJSX(topMount, /* @__PURE__ */ h(DevelopersPortalTopbar, null));
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
  } else {
    initDevelopersPortalShell();
  }
})();
