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
  function getToken() {
    try {
      const raw = localStorage.getItem("token");
      return raw ? raw.replace(/^"|"$/g, "") : "";
    } catch (_) {
      return "";
    }
  }
  function getStoredUser() {
    try {
      const raw = localStorage.getItem("user_object") || localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.username || parsed.id)) return parsed;
      }
    } catch (_) {
    }
    return null;
  }
  var CREATE_MENU_ITEMS = [
    {
      title: "Integrate Zycord into your game",
      alt: "Illustration representing the Zycord Social SDK",
      iconUrl: "https://cdn.discordapp.com/assets/content/9735045ea95a742d53f17de8e54b4333f8550c73cf58172975f5a4b2dba86f19.svg",
      purpose: "SOCIAL_SDK"
    },
    {
      title: "Customize your official game presence",
      alt: "Illustration representing a rich game presence profile",
      iconUrl: "https://cdn.discordapp.com/assets/content/1e0788596b23e1b054d123f0facc66e0370a7c6d9a31fc06802d4ad120d8a11d.svg",
      purpose: "GAME_CLAIM"
    },
    {
      title: "Advertise on Zycord with Quests",
      alt: "Illustration representing Zycord Quests",
      iconUrl: "https://cdn.discordapp.com/assets/content/7e0b174ab05662f5c61c2ec147a245380ab8e8d8b2de13ff0d979901183feda1.svg",
      href: "/developers/docs/intro"
    },
    {
      title: "Sell in-game items on Zycord",
      alt: "Illustration representing game monetization",
      iconUrl: "https://cdn.discordapp.com/assets/content/a7fdb03d057168154eff7acf5fc1f559ac8a0d284000c5a8c65a53fe463eb07c.svg",
      comingSoon: true,
      disabled: true
    },
    {
      title: "Build a bot for your server or community",
      alt: "Illustration representing a Zycord bot",
      iconUrl: "https://cdn.discordapp.com/assets/content/96552954edc2aaf6953969b70c978f2601341c8c90edbc90e605e0392cada677.svg",
      purpose: "BOT"
    },
    {
      title: "Build an activity inside Zycord",
      alt: "Illustration representing an embedded activity",
      iconUrl: "https://cdn.discordapp.com/assets/content/efcfd613e5757207169a2cd2ef870b2437cbb1aeb95fbe753332d0c60cc380f3.svg",
      purpose: "EMBEDDED_ACTIVITY"
    }
  ];
  function triggerPortalCreate(purpose = "DEFAULT") {
    if (typeof window.__zyOpenCreateAppModal === "function") {
      window.__zyOpenCreateAppModal({ purpose });
      return;
    }
    const createBtn = document.getElementById("create-app-btn");
    if (createBtn) {
      createBtn.click();
      return;
    }
    location.href = "/developers/applications?new_application=true";
  }
  function DeveloperPortalLogoSvg() {
    return /* @__PURE__ */ h(
      "svg",
      {
        width: "181",
        height: "24",
        viewBox: "0 0 181 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: "zy-dev-logo-svg",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ h("g", { transform: "translate(0, 2.75) scale(0.03647)" }, /* @__PURE__ */ h(
        "path",
        {
          fill: "currentColor",
          d: "M174 0H542C559 0 573 14 573 31C573 39 570 47 564 53L254 363H526C543 363 557 377 557 394V481C557 498 543 512 526 512H116C99 512 85 498 85 481C85 473 88 465 94 459L404 149H174C157 149 143 135 143 118V31C143 14 157 0 174 0Z"
        }
      ), /* @__PURE__ */ h(
        "path",
        {
          fill: "currentColor",
          opacity: "0.82",
          d: "M31 190H188L88 290H31C14 290 0 276 0 259V221C0 204 14 190 31 190Z"
        }
      ), /* @__PURE__ */ h(
        "path",
        {
          fill: "currentColor",
          opacity: "0.82",
          d: "M470 222H627C644 222 658 236 658 253V291C658 308 644 322 627 322H370L470 222Z"
        }
      )),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M173.273 7.80029H176.273V13.8363H180.989V16.2003H173.273V7.80029Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M165.227 7.80029H169.523L172.463 16.2003H169.415L168.899 14.5923H165.743L165.227 16.2003H162.263L165.227 7.80029ZM168.359 12.9123L167.327 9.70829L166.295 12.9123H168.359Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M157.178 10.1643H154.298V7.80029H163.058V10.1643H160.178V16.2003H157.178V10.1643Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M144.621 7.80029H150.177C151.313 7.80029 152.197 8.04429 152.829 8.53229C153.461 9.02029 153.777 9.70429 153.777 10.5843C153.777 11.3283 153.545 11.9323 153.081 12.3963C152.625 12.8523 152.009 13.1003 151.233 13.1403L153.861 16.2003H150.333L147.621 12.7563V16.2003H144.621V7.80029ZM149.433 11.8683C149.873 11.8683 150.209 11.7843 150.441 11.6163C150.673 11.4403 150.789 11.1883 150.789 10.8603C150.789 10.2283 150.365 9.91229 149.517 9.91229H147.621V11.8683H149.433Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M137.978 16.4401C136.882 16.4401 135.918 16.2441 135.086 15.8521C134.262 15.4521 133.626 14.9121 133.178 14.2321C132.73 13.5441 132.506 12.7841 132.506 11.9521C132.506 11.1041 132.73 10.3481 133.178 9.68406C133.626 9.01206 134.262 8.49206 135.086 8.12406C135.918 7.74806 136.886 7.56006 137.99 7.56006C139.086 7.56006 140.046 7.74806 140.87 8.12406C141.694 8.50006 142.33 9.02006 142.778 9.68406C143.226 10.3481 143.45 11.1041 143.45 11.9521C143.45 12.7921 143.222 13.5521 142.766 14.2321C142.318 14.9121 141.678 15.4521 140.846 15.8521C140.022 16.2441 139.066 16.4401 137.978 16.4401ZM137.978 14.0041C138.658 14.0041 139.202 13.8201 139.61 13.4521C140.018 13.0761 140.222 12.5841 140.222 11.9761C140.222 11.3761 140.018 10.8961 139.61 10.5361C139.202 10.1761 138.658 9.99606 137.978 9.99606C137.29 9.99606 136.742 10.1761 136.334 10.5361C135.926 10.8961 135.722 11.3761 135.722 11.9761C135.722 12.5841 135.926 13.0761 136.334 13.4521C136.742 13.8201 137.29 14.0041 137.978 14.0041Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M122.766 7.80029H128.574C129.654 7.80029 130.478 8.07629 131.046 8.62829C131.622 9.18029 131.91 9.93229 131.91 10.8843C131.91 11.5003 131.766 12.0443 131.478 12.5163C131.19 12.9883 130.758 13.3563 130.182 13.6203C129.614 13.8843 128.922 14.0163 128.106 14.0163H125.766V16.2003H122.766V7.80029ZM127.326 12.1083C127.814 12.1083 128.186 12.0083 128.442 11.8083C128.706 11.6083 128.838 11.3283 128.838 10.9683C128.838 10.6243 128.722 10.3563 128.49 10.1643C128.258 9.96429 127.926 9.86429 127.494 9.86429H125.766V12.1083H127.326Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M109.254 7.80029H114.81C115.946 7.80029 116.83 8.04429 117.462 8.53229C118.094 9.02029 118.41 9.70429 118.41 10.5843C118.41 11.3283 118.178 11.9323 117.714 12.3963C117.258 12.8523 116.642 13.1003 115.866 13.1403L118.494 16.2003H114.966L112.254 12.7563V16.2003H109.254V7.80029ZM114.066 11.8683C114.506 11.8683 114.842 11.7843 115.074 11.6163C115.306 11.4403 115.422 11.1883 115.422 10.8603C115.422 10.2283 114.998 9.91229 114.15 9.91229H112.254V11.8683H114.066Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M107.879 14.0643V16.2003H100.055V7.80029H107.843V9.93629H103.055V10.9323H107.603V12.9723H103.055V14.0643H107.879Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M89.9062 7.80029H95.7143C96.7943 7.80029 97.6183 8.07629 98.1863 8.62829C98.7623 9.18029 99.0504 9.93229 99.0504 10.8843C99.0504 11.5003 98.9063 12.0443 98.6183 12.5163C98.3303 12.9883 97.8984 13.3563 97.3224 13.6203C96.7544 13.8843 96.0624 14.0163 95.2464 14.0163H92.9062V16.2003H89.9062V7.80029ZM94.4663 12.1083C94.9543 12.1083 95.3264 12.0083 95.5824 11.8083C95.8464 11.6083 95.9783 11.3283 95.9783 10.9683C95.9783 10.6243 95.8623 10.3563 95.6303 10.1643C95.3983 9.96429 95.0663 9.86429 94.6343 9.86429H92.9062V12.1083H94.4663Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M83.263 16.4401C82.167 16.4401 81.203 16.2441 80.371 15.8521C79.547 15.4521 78.911 14.9121 78.463 14.2321C78.015 13.5441 77.791 12.7841 77.791 11.9521C77.791 11.1041 78.015 10.3481 78.463 9.68406C78.911 9.01206 79.547 8.49206 80.371 8.12406C81.203 7.74806 82.171 7.56006 83.275 7.56006C84.371 7.56006 85.331 7.74806 86.155 8.12406C86.979 8.50006 87.615 9.02006 88.063 9.68406C88.511 10.3481 88.735 11.1041 88.735 11.9521C88.735 12.7921 88.507 13.5521 88.051 14.2321C87.603 14.9121 86.963 15.4521 86.131 15.8521C85.307 16.2441 84.351 16.4401 83.263 16.4401ZM83.263 14.0041C83.943 14.0041 84.487 13.8201 84.895 13.4521C85.303 13.0761 85.507 12.5841 85.507 11.9761C85.507 11.3761 85.303 10.8961 84.895 10.5361C84.487 10.1761 83.943 9.99606 83.263 9.99606C82.575 9.99606 82.027 10.1761 81.619 10.5361C81.211 10.8961 81.007 11.3761 81.007 11.9761C81.007 12.5841 81.211 13.0761 81.619 13.4521C82.027 13.8201 82.575 14.0041 83.263 14.0041Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M69.7266 7.80029H72.7266V13.8363H77.4426V16.2003H69.7266V7.80029Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M68.3513 14.0643V16.2003H60.5273V7.80029H68.3153V9.93629H63.5273V10.9323H68.0753V12.9723H63.5273V14.0643H68.3513Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M49.4336 7.80029H52.6496L54.5576 13.1883L56.5256 7.80029H59.7656L56.2976 16.2003H52.8896L49.4336 7.80029Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M48.8865 14.0643V16.2003H41.0625V7.80029H48.8505V9.93629H44.0625V10.9323H48.6105V12.9723H44.0625V14.0643H48.8865Z" }),
      /* @__PURE__ */ h("path", { fill: "currentColor", d: "M30 7.80029H34.68C35.808 7.80029 36.76 7.97629 37.536 8.32829C38.32 8.68029 38.904 9.17229 39.288 9.80429C39.68 10.4283 39.876 11.1443 39.876 11.9523C39.876 12.7443 39.672 13.4643 39.264 14.1123C38.864 14.7523 38.248 15.2603 37.416 15.6363C36.592 16.0123 35.568 16.2003 34.344 16.2003H30V7.80029ZM34.296 14.0643C35.056 14.0643 35.64 13.8763 36.048 13.5003C36.456 13.1163 36.66 12.5963 36.66 11.9403C36.66 11.3323 36.476 10.8483 36.108 10.4883C35.748 10.1203 35.2 9.93629 34.464 9.93629H33V14.0643H34.296Z" })
    );
  }
  function getUserAvatarUrl(user) {
    if (!user) return "";
    if (user.avatar) {
      if (user.avatar.startsWith("http") || user.avatar.startsWith("/") || user.avatar.startsWith("data:")) {
        return user.avatar;
      }
      return `/avatars/${user.id}/${user.avatar}.png`;
    }
    return "";
  }
  function applyPortalTheme(theme) {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("theme-dark");
      root.classList.add("theme-light");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.remove("theme-light");
      root.classList.add("theme-dark");
      root.setAttribute("data-theme", "dark");
    }
    try {
      localStorage.setItem("zy_dev_theme", theme);
    } catch (_) {
    }
  }
  function initDevelopersPortalTopbar(mountTarget) {
    if (!mountTarget) return;
    const state = {
      scrolled: window.scrollY !== 0,
      createMenuOpen: false,
      userMenuOpen: false,
      user: getStoredUser(),
      theme: (() => {
        try {
          return localStorage.getItem("zy_dev_theme") || "dark";
        } catch (_) {
          return "dark";
        }
      })()
    };
    applyPortalTheme(state.theme);
    let createWrapEl = null;
    let userWrapEl = null;
    let topbarEl = null;
    const toggleMobileNav = () => {
      document.body.classList.toggle("dev-mobile-nav-open");
    };
    const handleLogout = () => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user_object");
        localStorage.removeItem("user");
      } catch (_) {
      }
      location.href = "/login?redirect_to=%2Fdevelopers%2Fapplications";
    };
    function rerender() {
      const user = state.user;
      const avatarUrl = getUserAvatarUrl(user);
      const userInitial = user && user.username ? user.username.slice(0, 1).toUpperCase() : "U";
      const node = /* @__PURE__ */ h("header", { className: "zy-dev-header-wrapper" }, /* @__PURE__ */ h(
        "div",
        {
          className: `zy-dev-topbar${state.scrolled ? " is-scrolled" : ""}`,
          ref: (el) => {
            topbarEl = el;
          }
        },
        /* @__PURE__ */ h("div", { className: "zy-dev-left-items" }, /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            className: "zy-dev-mobile-menu-btn",
            "aria-label": "Open menu",
            onClick: toggleMobileNav
          },
          /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
            "path",
            {
              fill: "currentColor",
              d: "M1 5a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM1 12a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM2 18a1 1 0 1 0 0 2h20a1 1 0 1 0 0-2H2Z"
            }
          ))
        ), /* @__PURE__ */ h("a", { className: "zy-dev-brand", href: "/developers", "aria-label": "Return to Zycord" }, /* @__PURE__ */ h(DeveloperPortalLogoSvg, null))),
        /* @__PURE__ */ h("div", { className: "zy-dev-right-items" }, /* @__PURE__ */ h(
          "div",
          {
            className: "zy-dev-popover-anchor",
            ref: (el) => {
              createWrapEl = el;
            }
          },
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "zy-dev-create-btn",
              "aria-label": "Create menu",
              "aria-haspopup": "dialog",
              "aria-expanded": state.createMenuOpen ? "true" : "false",
              onClick: () => {
                state.userMenuOpen = false;
                state.createMenuOpen = !state.createMenuOpen;
                rerender();
              }
            },
            /* @__PURE__ */ h("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
              "path",
              {
                fill: "currentColor",
                d: "M13 3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 0 0 2 0v-8h8a1 1 0 0 0 0-2h-8V3Z"
              }
            )),
            /* @__PURE__ */ h("span", null, "Create")
          ),
          state.createMenuOpen ? /* @__PURE__ */ h("div", { className: "zy-dev-popover zy-dev-create-popover", role: "dialog", "aria-label": "Start building" }, /* @__PURE__ */ h("div", { className: "zy-dev-create-menu-inner" }, /* @__PURE__ */ h("div", { className: "zy-dev-create-menu-header" }, /* @__PURE__ */ h("span", { className: "zy-dev-create-menu-title" }, "Start building"), /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "zy-dev-create-blank-btn",
              onClick: () => {
                state.createMenuOpen = false;
                rerender();
                triggerPortalCreate("DEFAULT");
              }
            },
            "Create blank app"
          )), /* @__PURE__ */ h("div", { className: "zy-dev-create-grid", role: "group", "aria-label": "Start building" }, CREATE_MENU_ITEMS.map((item) => /* @__PURE__ */ h(
            "button",
            {
              key: item.title,
              type: "button",
              className: "zy-dev-create-card",
              disabled: !!item.disabled,
              "aria-disabled": item.disabled ? "true" : "false",
              onClick: () => {
                if (item.disabled) return;
                state.createMenuOpen = false;
                rerender();
                if (item.href) {
                  window.open(item.href, "_blank");
                } else {
                  triggerPortalCreate(item.purpose || "DEFAULT");
                }
              }
            },
            /* @__PURE__ */ h("div", { className: "zy-dev-create-card-icon" }, /* @__PURE__ */ h("img", { src: item.iconUrl, alt: item.alt, width: "32", height: "32" })),
            /* @__PURE__ */ h("div", { className: "zy-dev-create-card-body" }, item.comingSoon ? /* @__PURE__ */ h("span", { className: "zy-dev-coming-soon-badge" }, "Coming Soon") : null, /* @__PURE__ */ h("span", { className: "zy-dev-create-card-title" }, item.title)),
            /* @__PURE__ */ h(
              "svg",
              {
                className: "zy-dev-create-card-arrow",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              },
              /* @__PURE__ */ h(
                "path",
                {
                  fill: "currentColor",
                  d: "M20.7 12.7a1 1 0 0 0 0-1.4l-8-8a1 1 0 1 0-1.4 1.4l6.29 6.3H4a1 1 0 1 0 0 2h13.59l-6.3 6.3a1 1 0 0 0 1.42 1.4l8-8Z"
                }
              )
            )
          ))))) : null
        ), /* @__PURE__ */ h("a", { className: "zy-dev-borderless-btn", href: "/developers/docs/intro" }, /* @__PURE__ */ h("div", null, "Docs"), /* @__PURE__ */ h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
          "path",
          {
            fill: "currentColor",
            d: "M8 5a1 1 0 0 0 0 2h7.59L5.29 17.3a1 1 0 1 0 1.42 1.4L17 8.42V16a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1H8Z"
          }
        ))), /* @__PURE__ */ h("div", { className: "zy-dev-divider" }), /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            className: "zy-dev-borderless-btn",
            onClick: () => {
              if (typeof window.__zyOpenTeams === "function") {
                window.__zyOpenTeams();
              } else {
                location.href = "/developers/applications";
              }
            }
          },
          /* @__PURE__ */ h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
            "path",
            {
              fill: "currentColor",
              d: "M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"
            }
          )),
          /* @__PURE__ */ h("div", null, "Teams")
        ), user ? /* @__PURE__ */ h(
          "div",
          {
            className: "zy-dev-popover-anchor",
            ref: (el) => {
              userWrapEl = el;
            }
          },
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "zy-dev-avatar-btn",
              "aria-label": "Open user menu",
              "aria-haspopup": "dialog",
              "aria-expanded": state.userMenuOpen ? "true" : "false",
              onClick: () => {
                state.createMenuOpen = false;
                state.userMenuOpen = !state.userMenuOpen;
                rerender();
              }
            },
            avatarUrl ? /* @__PURE__ */ h("img", { src: avatarUrl, alt: "", className: "zy-dev-avatar-img" }) : /* @__PURE__ */ h("span", { className: "zy-dev-avatar-fallback" }, userInitial)
          ),
          state.userMenuOpen ? /* @__PURE__ */ h("div", { className: "zy-dev-popover zy-dev-user-popover", role: "dialog", "aria-label": "User menu" }, /* @__PURE__ */ h("div", { className: "zy-dev-user-menu" }, /* @__PURE__ */ h("div", { className: "zy-dev-user-section" }, /* @__PURE__ */ h("div", { className: "zy-dev-user-avatar-lg" }, avatarUrl ? /* @__PURE__ */ h("img", { src: avatarUrl, alt: "", className: "zy-dev-avatar-img" }) : /* @__PURE__ */ h("span", { className: "zy-dev-avatar-fallback" }, userInitial)), /* @__PURE__ */ h("div", { className: "zy-dev-user-meta" }, /* @__PURE__ */ h("div", { className: "zy-dev-user-name" }, user.username || "Developer"), /* @__PURE__ */ h("div", { className: "zy-dev-user-email" }, user.email || `${user.username || "user"}@zyron.site`))), /* @__PURE__ */ h("div", { className: "zy-dev-user-divider" }), /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "zy-dev-user-menu-item",
              onClick: () => {
                state.theme = state.theme === "dark" ? "light" : "dark";
                applyPortalTheme(state.theme);
                rerender();
              }
            },
            /* @__PURE__ */ h("span", null, "Theme"),
            /* @__PURE__ */ h("div", { className: "zy-dev-theme-toggle" }, /* @__PURE__ */ h("div", { className: `zy-dev-theme-btn${state.theme === "dark" ? " is-active" : ""}` }, /* @__PURE__ */ h("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
              "path",
              {
                fill: "currentColor",
                d: "M20.52 18.96c.32-.4-.01-.96-.52-.96A11 11 0 0 1 9.77 2.94c.31-.78-.3-1.68-1.1-1.43a11 11 0 1 0 11.85 17.45Z"
              }
            ), /* @__PURE__ */ h(
              "path",
              {
                fill: "currentColor",
                d: "m17.73 9.27-.76-2.02a.5.5 0 0 0-.94 0l-.76 2.02-2.02.76a.5.5 0 0 0 0 .94l2.02.76.76 2.02a.5.5 0 0 0 .94 0l.76-2.02 2.02-.76a.5.5 0 0 0 0-.94l-2.02-.76ZM19.73 2.62l.45 1.2 1.2.45c.21.08.21.38 0 .46l-1.2.45-.45 1.2a.25.25 0 0 1-.46 0l-.45-1.2-1.2-.45a.25.25 0 0 1 0-.46l1.2-.45.45-1.2a.25.25 0 0 1 .46 0Z"
              }
            ))), /* @__PURE__ */ h("div", { className: `zy-dev-theme-btn${state.theme === "light" ? " is-active" : ""}` }, /* @__PURE__ */ h("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
              "path",
              {
                fill: "currentColor",
                d: "M12 1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1ZM19.78 4.22a1 1 0 0 1 0 1.42l-1.42 1.41a1 1 0 1 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0ZM18.36 19.78a1 1 0 0 0 1.42-1.42l-1.42-1.41a1 1 0 0 0-1.41 1.41l1.41 1.42ZM23 12a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1ZM13 20a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2ZM7.05 16.95a1 1 0 0 1 0 1.41l-1.41 1.42a1 1 0 0 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0ZM5.64 7.05a1 1 0 0 0 1.41-1.41L5.64 4.22a1 1 0 1 0-1.42 1.42l1.42 1.41ZM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
              }
            ))))
          ), /* @__PURE__ */ h("a", { className: "zy-dev-user-menu-item", href: "/channels/@me", target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ h("span", null, "Manage account"), /* @__PURE__ */ h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
            "path",
            {
              fill: "currentColor",
              d: "M8 5a1 1 0 0 0 0 2h7.59L5.29 17.3a1 1 0 1 0 1.42 1.4L17 8.42V16a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1H8Z"
            }
          ))), /* @__PURE__ */ h("a", { className: "zy-dev-user-menu-item", href: "/channels/@me", target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ h("div", { className: "zy-dev-user-lang-col" }, /* @__PURE__ */ h("span", null, "Language"), /* @__PURE__ */ h("span", { className: "zy-dev-user-lang-sub" }, "English, US")), /* @__PURE__ */ h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ h(
            "path",
            {
              fill: "currentColor",
              d: "M8 5a1 1 0 0 0 0 2h7.59L5.29 17.3a1 1 0 1 0 1.42 1.4L17 8.42V16a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1H8Z"
            }
          ))), /* @__PURE__ */ h("button", { type: "button", className: "zy-dev-user-menu-item", onClick: handleLogout }, /* @__PURE__ */ h("span", null, "Log Out")))) : null
        ) : null)
      ));
      mountJSX(mountTarget, node);
    }
    window.__zySetTopbarUser = (u) => {
      state.user = u || null;
      rerender();
    };
    window.addEventListener(
      "scroll",
      () => {
        const next = window.scrollY !== 0;
        if (next !== state.scrolled) {
          state.scrolled = next;
          if (topbarEl) {
            topbarEl.classList.toggle("is-scrolled", next);
          }
        }
      },
      { passive: true }
    );
    document.addEventListener("mousedown", (e) => {
      let changed = false;
      if (state.createMenuOpen && createWrapEl && !createWrapEl.contains(e.target)) {
        state.createMenuOpen = false;
        changed = true;
      }
      if (state.userMenuOpen && userWrapEl && !userWrapEl.contains(e.target)) {
        state.userMenuOpen = false;
        changed = true;
      }
      if (changed) rerender();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && (state.createMenuOpen || state.userMenuOpen)) {
        state.createMenuOpen = false;
        state.userMenuOpen = false;
        rerender();
      }
    });
    const token = getToken();
    if (token) {
      fetch("/api/v9/users/@me", {
        headers: { Authorization: token }
      }).then((r) => r.ok ? r.json() : null).then((u) => {
        if (u && u.id) {
          state.user = u;
          window.__zyCurrentUser = u;
          rerender();
        }
      }).catch(() => {
      });
    }
    rerender();
  }
  var mount = document.getElementById("zy-dev-topbar-mount");
  if (mount) initDevelopersPortalTopbar(mount);
})();
