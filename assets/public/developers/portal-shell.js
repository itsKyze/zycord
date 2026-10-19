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
  var plusIcon = '<path fill="currentColor" d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/>';
  var externalIcon = '<path fill="currentColor" d="M15 2a1 1 0 0 0 0 2h3.59l-5.3 5.3a1 1 0 0 0 1.42 1.4L20 5.42V9a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-6Z"/><path fill="currentColor" d="M5 5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-6a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h6a1 1 0 1 1 0 2H5Z"/>';
  var menuIcon = '<path fill="currentColor" d="M3 5a1 1 0 0 0 0 2h18a1 1 0 1 0 0-2H3ZM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM2 18a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Z"/>';
  var Icon = ({ paths, size = 16 }) => /* @__PURE__ */ h("svg", { "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", width: size, height: size, fill: "none", viewBox: "0 0 24 24", dangerouslySetInnerHTML: { __html: paths } });
  function DevelopersPortalTopbar() {
    return /* @__PURE__ */ h("header", { className: "dp-header" }, /* @__PURE__ */ h("div", { className: "dp-header-content" }, /* @__PURE__ */ h("div", { className: "dp-header-left" }, /* @__PURE__ */ h("button", { className: "dp-mobile-menu", type: "button", "aria-label": "Open navigation", "data-dp-menu": true }, /* @__PURE__ */ h(Icon, { paths: menuIcon, size: 24 })), /* @__PURE__ */ h("a", { className: "dp-logo", href: "/developers", "aria-label": "Zycord Developers" }, /* @__PURE__ */ h("img", { src: "/branding/zycord_icon_white.svg", alt: "", width: "24", height: "24" }), /* @__PURE__ */ h("span", null, "Zycord Developers"))), /* @__PURE__ */ h("div", { className: "dp-header-right" }, /* @__PURE__ */ h("div", { className: "dp-create" }, /* @__PURE__ */ h("button", { className: "dp-button dp-button-secondary dp-button-sm", type: "button", "aria-haspopup": "menu", "aria-expanded": "false", "data-dp-create": true }, /* @__PURE__ */ h(Icon, { paths: plusIcon }), /* @__PURE__ */ h("span", null, "Create")), /* @__PURE__ */ h("div", { className: "dp-popover", role: "menu", hidden: true, "data-dp-create-menu": true }, /* @__PURE__ */ h("button", { type: "button", role: "menuitem", "data-dp-create-item": "application" }, "Application"), /* @__PURE__ */ h("button", { type: "button", role: "menuitem", "data-dp-create-item": "widget" }, "Profile Widget"))), /* @__PURE__ */ h("a", { className: "dp-header-link", href: "/developers/docs" }, /* @__PURE__ */ h("span", null, "Docs"), /* @__PURE__ */ h(Icon, { paths: externalIcon, size: 18 })), /* @__PURE__ */ h("div", { className: "dp-header-divider", role: "separator" }), /* @__PURE__ */ h("a", { className: "dp-header-user", href: "/channels/@me", title: "Open Zycord", "data-dp-user": true }, /* @__PURE__ */ h("span", { className: "dp-header-avatar", "data-dp-user-avatar": true }), /* @__PURE__ */ h("span", { className: "dp-header-username", "data-dp-user-name": true }, "Open App")))));
  }
  function initDevelopersPortalShell() {
    const topMount = document.getElementById("zy-dev-topbar-mount");
    if (!topMount) return;
    mountJSX(topMount, /* @__PURE__ */ h(DevelopersPortalTopbar, null));
    const header = topMount.querySelector(".dp-header-content");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const createButton = topMount.querySelector("[data-dp-create]");
    const createMenu = topMount.querySelector("[data-dp-create-menu]");
    const setMenu = (open) => {
      createMenu.hidden = !open;
      createButton.setAttribute("aria-expanded", String(open));
    };
    createButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenu(createMenu.hidden);
    });
    createMenu.addEventListener("click", (event) => {
      const item = event.target.closest("[data-dp-create-item]");
      if (!item) return;
      setMenu(false);
      document.dispatchEvent(new CustomEvent("dp:create", { detail: item.dataset.dpCreateItem }));
    });
    document.addEventListener("click", (event) => {
      if (!createMenu.hidden && !createMenu.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !createMenu.hidden) {
        setMenu(false);
        createButton.focus();
      }
    });
    topMount.querySelector("[data-dp-menu]").addEventListener("click", () => document.body.classList.toggle("dp-nav-open"));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
  } else {
    initDevelopersPortalShell();
  }
})();
