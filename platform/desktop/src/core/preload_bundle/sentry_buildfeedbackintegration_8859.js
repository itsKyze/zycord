8859(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    WINDOW = core.GLOBAL_OBJ,
                    DOCUMENT = WINDOW.document,
                    NAVIGATOR = WINDOW.navigator,
                    TRIGGER_LABEL = "Report a Bug",
                    CANCEL_BUTTON_LABEL = "Cancel",
                    SUBMIT_BUTTON_LABEL = "Send Bug Report",
                    CONFIRM_BUTTON_LABEL = "Confirm",
                    FORM_TITLE = "Report a Bug",
                    EMAIL_PLACEHOLDER = "your.email@example.org",
                    EMAIL_LABEL = "Email",
                    MESSAGE_PLACEHOLDER = "What's the bug? What did you expect?",
                    MESSAGE_LABEL = "Description",
                    NAME_PLACEHOLDER = "Your Name",
                    NAME_LABEL = "Name",
                    SUCCESS_MESSAGE_TEXT = "Thank you for your report!",
                    IS_REQUIRED_LABEL = "(required)",
                    ADD_SCREENSHOT_LABEL = "Add a screenshot",
                    REMOVE_SCREENSHOT_LABEL = "Remove screenshot",
                    HIGHLIGHT_TOOL_TEXT = "Highlight",
                    HIDE_TOOL_TEXT = "Hide",
                    REMOVE_HIGHLIGHT_TEXT = "Remove",
                    sendFeedback = (params, hint = { includeReplay: !0 }) => {
                        if (!params.message) throw Error("Unable to submit feedback with empty message");
                        let client = core.getClient();
                        if (!client) throw Error("No client setup, cannot send feedback.");
                        params.tags && Object.keys(params.tags).length && core.getCurrentScope().setTags(params.tags);
                        let eventId = core.captureFeedback({ source: "api", url: core.getLocationHref(), ...params }, hint);
                        return new Promise((resolve, reject) => {
                            let timeout = setTimeout(() => reject("Unable to determine if Feedback was correctly sent."), 3e4),
                                cleanup = client.on("afterSendEvent", (event, response) => {
                                    if (event.event_id === eventId)
                                        return (clearTimeout(timeout), cleanup(), response?.statusCode && response.statusCode >= 200 && response.statusCode < 300)
                                            ? resolve(eventId)
                                            : response?.statusCode === 403
                                              ? reject("Unable to send feedback. This could be because this domain is not in your list of allowed domains.")
                                              : reject("Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.");
                                });
                        });
                    },
                    DEBUG_BUILD = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
                function mergeOptions(defaultOptions, optionOverrides) {
                    return {
                        ...defaultOptions,
                        ...optionOverrides,
                        tags: { ...defaultOptions.tags, ...optionOverrides.tags },
                        onFormOpen: () => {
                            (optionOverrides.onFormOpen?.(), defaultOptions.onFormOpen?.());
                        },
                        onFormClose: () => {
                            (optionOverrides.onFormClose?.(), defaultOptions.onFormClose?.());
                        },
                        onSubmitSuccess: (data, eventId) => {
                            (optionOverrides.onSubmitSuccess?.(data, eventId), defaultOptions.onSubmitSuccess?.(data, eventId));
                        },
                        onSubmitError: (error) => {
                            (optionOverrides.onSubmitError?.(error), defaultOptions.onSubmitError?.(error));
                        },
                        onFormSubmitted: () => {
                            (optionOverrides.onFormSubmitted?.(), defaultOptions.onFormSubmitted?.());
                        },
                        themeDark: { ...defaultOptions.themeDark, ...optionOverrides.themeDark },
                        themeLight: { ...defaultOptions.themeLight, ...optionOverrides.themeLight },
                    };
                }
                function setAttributesNS(el, attributes) {
                    return (
                        Object.entries(attributes).forEach(([key, val]) => {
                            el.setAttributeNS(null, key, val);
                        }),
                        el
                    );
                }
                let PURPLE = "rgba(88, 74, 192, 1)",
                    DEFAULT_LIGHT = {
                        foreground: "#2b2233",
                        background: "#ffffff",
                        accentForeground: "white",
                        accentBackground: PURPLE,
                        successColor: "#268d75",
                        errorColor: "#df3338",
                        border: "1.5px solid rgba(41, 35, 47, 0.13)",
                        boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
                        outline: "1px auto var(--accent-background)",
                        interactiveFilter: "brightness(95%)",
                    },
                    DEFAULT_DARK = {
                        foreground: "#ebe6ef",
                        background: "#29232f",
                        accentForeground: "white",
                        accentBackground: PURPLE,
                        successColor: "#2da98c",
                        errorColor: "#f55459",
                        border: "1.5px solid rgba(235, 230, 239, 0.15)",
                        boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
                        outline: "1px auto var(--accent-background)",
                        interactiveFilter: "brightness(150%)",
                    };
                function getThemedCssVariables(theme) {
                    return `
  --foreground: ${theme.foreground};
  --background: ${theme.background};
  --accent-foreground: ${theme.accentForeground};
  --accent-background: ${theme.accentBackground};
  --success-color: ${theme.successColor};
  --error-color: ${theme.errorColor};
  --border: ${theme.border};
  --box-shadow: ${theme.boxShadow};
  --outline: ${theme.outline};
  --interactive-filter: ${theme.interactiveFilter};
  `;
                }
                function createMainStyles({ colorScheme, themeDark, themeLight, styleNonce }) {
                    let style = DOCUMENT.createElement("style");
                    return (
                        (style.textContent = `
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${"system" !== colorScheme ? `color-scheme: only ${colorScheme};` : ""}

  ${getThemedCssVariables("dark" === colorScheme ? { ...DEFAULT_DARK, ...themeDark } : { ...DEFAULT_LIGHT, ...themeLight })}
}

${
    "system" === colorScheme
        ? `
@media (prefers-color-scheme: dark) {
  :host {
    color-scheme: only dark;

    ${getThemedCssVariables({ ...DEFAULT_DARK, ...themeDark })}
  }
}`
        : ""
}
`),
                        styleNonce && style.setAttribute("nonce", styleNonce),
                        style
                    );
                }
                var n,
                    l$1,
                    u$1,
                    i$1,
                    o$1,
                    r$1,
                    f$1,
                    c$1 = {},
                    s$1 = [],
                    a$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
                    h$1 = Array.isArray;
                function v$1(n, l) {
                    for (var u in l) n[u] = l[u];
                    return n;
                }
                function p$1(n) {
                    var l = n.parentNode;
                    l && l.removeChild(n);
                }
                function y$1(l, u, t) {
                    var i,
                        o,
                        r,
                        f = {};
                    for (r in u) "key" == r ? (i = u[r]) : "ref" == r ? (o = u[r]) : (f[r] = u[r]);
                    if ((arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps))
                        for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
                    return d$1(l, f, i, o, null);
                }
                function d$1(n, t, i, o, r) {
                    var f = {
                        type: n,
                        props: t,
                        key: i,
                        ref: o,
                        __k: null,
                        __: null,
                        __b: 0,
                        __e: null,
                        __d: void 0,
                        __c: null,
                        constructor: void 0,
                        __v: null == r ? ++u$1 : r,
                        __i: -1,
                        __u: 0,
                    };
                    return (null == r && null != l$1.vnode && l$1.vnode(f), f);
                }
                function g$1(n) {
                    return n.children;
                }
                function b$1(n, l) {
                    ((this.props = n), (this.context = l));
                }
                function m$1(n, l) {
                    if (null == l) return n.__ ? m$1(n.__, n.__i + 1) : null;
                    for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
                    return "function" == typeof n.type ? m$1(n) : null;
                }
                function x$1(n) {
                    ((!n.__d && (n.__d = !0) && i$1.push(n) && !C$1.__r++) || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || r$1)(C$1);
                }
                function C$1() {
                    var n,
                        u,
                        t,
                        o = [],
                        r = [];
                    for (i$1.sort(f$1); (n = i$1.shift());)
                        n.__d &&
                            ((t = i$1.length),
                            (u =
                                (function (n, u, t) {
                                    var i,
                                        o = n.__v,
                                        r = o.__e,
                                        f = n.__P;
                                    if (f)
                                        return (
                                            ((i = v$1({}, o)).__v = o.__v + 1),
                                            l$1.vnode && l$1.vnode(i),
                                            M(f, i, o, n.__n, void 0 !== f.ownerSVGElement, 32 & o.__u ? [r] : null, u, null == r ? m$1(o) : r, !!(32 & o.__u), t),
                                            (i.__.__k[i.__i] = i),
                                            (i.__d = void 0),
                                            i.__e != r &&
                                                (function k$1(n) {
                                                    var l, u;
                                                    if (null != (n = n.__) && null != n.__c) {
                                                        for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
                                                            if (null != (u = n.__k[l]) && null != u.__e) {
                                                                n.__e = n.__c.base = u.__e;
                                                                break;
                                                            }
                                                        return k$1(n);
                                                    }
                                                })(i),
                                            i
                                        );
                                })(n, o, r) || u),
                            0 === t || i$1.length > t ? (j$1(o, u, r), (r.length = o.length = 0), (u = void 0), i$1.sort(f$1)) : u && l$1.__c && l$1.__c(u, s$1));
                    (u && j$1(o, u, r), (C$1.__r = 0));
                }
                function P$1(n, l, u, t, i, o, r, f, e, a, h) {
                    var v,
                        p,
                        y,
                        d,
                        _,
                        g = (t && t.__k) || s$1,
                        b = l.length;
                    for (
                        u.__d = e,
                            (function (n, l, u) {
                                var t,
                                    i,
                                    o,
                                    r,
                                    f,
                                    e = l.length,
                                    c = u.length,
                                    s = c,
                                    a = 0;
                                for (n.__k = [], t = 0; t < e; t++)
                                    null !=
                                    (i = n.__k[t] =
                                        null == (i = l[t]) || "boolean" == typeof i || "function" == typeof i
                                            ? null
                                            : "string" == typeof i || "number" == typeof i || "bigint" == typeof i || i.constructor == String
                                              ? d$1(null, i, null, null, i)
                                              : h$1(i)
                                                ? d$1(g$1, { children: i }, null, null, null)
                                                : void 0 === i.constructor && i.__b > 0
                                                  ? d$1(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v)
                                                  : i)
                                        ? ((i.__ = n),
                                          (i.__b = n.__b + 1),
                                          (f = (function (n, l, u, t) {
                                              var i = n.key,
                                                  o = n.type,
                                                  r = u - 1,
                                                  f = u + 1,
                                                  e = l[u];
                                              if (null === e || (e && i == e.key && o === e.type)) return u;
                                              if (t > +(null != e && 0 == (131072 & e.__u)))
                                                  for (; r >= 0 || f < l.length;) {
                                                      if (r >= 0) {
                                                          if ((e = l[r]) && 0 == (131072 & e.__u) && i == e.key && o === e.type) return r;
                                                          r--;
                                                      }
                                                      if (f < l.length) {
                                                          if ((e = l[f]) && 0 == (131072 & e.__u) && i == e.key && o === e.type) return f;
                                                          f++;
                                                      }
                                                  }
                                              return -1;
                                          })(i, u, (r = t + a), s)),
                                          (i.__i = f),
                                          (o = null),
                                          -1 !== f && (s--, (o = u[f]) && (o.__u |= 131072)),
                                          null == o || null === o.__v
                                              ? (-1 == f && a--, "function" != typeof i.type && (i.__u |= 65536))
                                              : f !== r &&
                                                (f === r + 1 ? a++ : f > r ? (s > e - r ? (a += f - r) : a--) : (a = f < r && f == r - 1 ? f - r : 0),
                                                f !== t + a && (i.__u |= 65536)))
                                        : (o = u[t]) && null == o.key && o.__e && (o.__e == n.__d && (n.__d = m$1(o)), O(o, o, !1), (u[t] = null), s--);
                                if (s) for (t = 0; t < c; t++) null != (o = u[t]) && 0 == (131072 & o.__u) && (o.__e == n.__d && (n.__d = m$1(o)), O(o, o));
                            })(u, l, g),
                            e = u.__d,
                            v = 0;
                        v < b;
                        v++
                    )
                        null != (y = u.__k[v]) &&
                            "boolean" != typeof y &&
                            "function" != typeof y &&
                            ((p = -1 === y.__i ? c$1 : g[y.__i] || c$1),
                            (y.__i = v),
                            M(n, y, p, i, o, r, f, e, a, h),
                            (d = y.__e),
                            y.ref && p.ref != y.ref && (p.ref && N(p.ref, null, y), h.push(y.ref, y.__c || d, y)),
                            null == _ && null != d && (_ = d),
                            65536 & y.__u || p.__k === y.__k
                                ? (e = (function $(n, l, u) {
                                      var t, i;
                                      if ("function" == typeof n.type) {
                                          for (t = n.__k, i = 0; t && i < t.length; i++) t[i] && ((t[i].__ = n), (l = $(t[i], l, u)));
                                          return l;
                                      }
                                      n.__e != l && (u.insertBefore(n.__e, l || null), (l = n.__e));
                                      do l = l && l.nextSibling;
                                      while (null != l && 8 === l.nodeType);
                                      return l;
                                  })(y, e, n))
                                : "function" == typeof y.type && void 0 !== y.__d
                                  ? (e = y.__d)
                                  : d && (e = d.nextSibling),
                            (y.__d = void 0),
                            (y.__u &= -196609));
                    ((u.__d = e), (u.__e = _));
                }
                function T$1(n, l, u) {
                    "-" === l[0] ? n.setProperty(l, null == u ? "" : u) : (n[l] = null == u ? "" : "number" != typeof u || a$1.test(l) ? u : u + "px");
                }
                function A$1(n, l, u, t, i) {
                    var o;
                    n: if ("style" === l)
                        if ("string" == typeof u) n.style.cssText = u;
                        else {
                            if (("string" == typeof t && (n.style.cssText = t = ""), t)) for (l in t) (u && l in u) || T$1(n.style, l, "");
                            if (u) for (l in u) (t && u[l] === t[l]) || T$1(n.style, l, u[l]);
                        }
                    else if ("o" === l[0] && "n" === l[1])
                        ((o = l !== (l = l.replace(/(PointerCapture)$|Capture$/i, "$1"))),
                            (l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2)),
                            n.l || (n.l = {}),
                            (n.l[l + o] = u),
                            u ? (t ? (u.u = t.u) : ((u.u = Date.now()), n.addEventListener(l, o ? L : D$1, o))) : n.removeEventListener(l, o ? L : D$1, o));
                    else {
                        if (i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
                        else if (
                            "width" !== l &&
                            "height" !== l &&
                            "href" !== l &&
                            "list" !== l &&
                            "form" !== l &&
                            "tabIndex" !== l &&
                            "download" !== l &&
                            "rowSpan" !== l &&
                            "colSpan" !== l &&
                            "role" !== l &&
                            l in n
                        )
                            try {
                                n[l] = null == u ? "" : u;
                                break n;
                            } catch (n) {}
                        "function" == typeof u || (null == u || (!1 === u && "-" !== l[4]) ? n.removeAttribute(l) : n.setAttribute(l, u));
                    }
                }
                function D$1(n) {
                    if (this.l) {
                        var u = this.l[n.type + !1];
                        if (n.t) {
                            if (n.t <= u.u) return;
                        } else n.t = Date.now();
                        return u(l$1.event ? l$1.event(n) : n);
                    }
                }
                function L(n) {
                    if (this.l) return this.l[n.type + !0](l$1.event ? l$1.event(n) : n);
                }
                function M(n1, u, t, i, o, r, f, e, c, s) {
                    var a,
                        p,
                        y,
                        d,
                        _,
                        m,
                        w,
                        k,
                        x,
                        C,
                        S,
                        $,
                        H,
                        I,
                        T,
                        A = u.type;
                    if (void 0 !== u.constructor) return null;
                    (128 & t.__u && ((c = !!(32 & t.__u)), (r = [(e = u.__e = t.__e)])), (a = l$1.__b) && a(u));
                    n: if ("function" == typeof A)
                        try {
                            if (
                                ((k = u.props),
                                (x = (a = A.contextType) && i[a.__c]),
                                (C = a ? (x ? x.props.value : a.__) : i),
                                t.__c
                                    ? (w = (p = u.__c = t.__c).__ = p.__E)
                                    : ("prototype" in A && A.prototype.render ? (u.__c = p = new A(k, C)) : ((u.__c = p = new b$1(k, C)), (p.constructor = A), (p.render = q$1)),
                                      x && x.sub(p),
                                      (p.props = k),
                                      p.state || (p.state = {}),
                                      (p.context = C),
                                      (p.__n = i),
                                      (y = p.__d = !0),
                                      (p.__h = []),
                                      (p._sb = [])),
                                null == p.__s && (p.__s = p.state),
                                null != A.getDerivedStateFromProps && (p.__s == p.state && (p.__s = v$1({}, p.__s)), v$1(p.__s, A.getDerivedStateFromProps(k, p.__s))),
                                (d = p.props),
                                (_ = p.state),
                                (p.__v = u),
                                y)
                            )
                                (null == A.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(),
                                    null != p.componentDidMount && p.__h.push(p.componentDidMount));
                            else {
                                if (
                                    (null == A.getDerivedStateFromProps && k !== d && null != p.componentWillReceiveProps && p.componentWillReceiveProps(k, C),
                                    !p.__e && ((null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(k, p.__s, C)) || u.__v === t.__v))
                                ) {
                                    for (
                                        u.__v !== t.__v && ((p.props = k), (p.state = p.__s), (p.__d = !1)),
                                            u.__e = t.__e,
                                            u.__k = t.__k,
                                            u.__k.forEach(function (n) {
                                                n && (n.__ = u);
                                            }),
                                            S = 0;
                                        S < p._sb.length;
                                        S++
                                    )
                                        p.__h.push(p._sb[S]);
                                    ((p._sb = []), p.__h.length && f.push(p));
                                    break n;
                                }
                                (null != p.componentWillUpdate && p.componentWillUpdate(k, p.__s, C),
                                    null != p.componentDidUpdate &&
                                        p.__h.push(function () {
                                            p.componentDidUpdate(d, _, m);
                                        }));
                            }
                            if (((p.context = C), (p.props = k), (p.__P = n1), (p.__e = !1), ($ = l$1.__r), (H = 0), "prototype" in A && A.prototype.render)) {
                                for (p.state = p.__s, p.__d = !1, $ && $(u), a = p.render(p.props, p.state, p.context), I = 0; I < p._sb.length; I++) p.__h.push(p._sb[I]);
                                p._sb = [];
                            } else
                                do ((p.__d = !1), $ && $(u), (a = p.render(p.props, p.state, p.context)), (p.state = p.__s));
                                while (p.__d && ++H < 25);
                            ((p.state = p.__s),
                                null != p.getChildContext && (i = v$1(v$1({}, i), p.getChildContext())),
                                y || null == p.getSnapshotBeforeUpdate || (m = p.getSnapshotBeforeUpdate(d, _)),
                                P$1(n1, h$1((T = null != a && a.type === g$1 && null == a.key ? a.props.children : a)) ? T : [T], u, t, i, o, r, f, e, c, s),
                                (p.base = u.__e),
                                (u.__u &= -161),
                                p.__h.length && f.push(p),
                                w && (p.__E = p.__ = null));
                        } catch (n) {
                            ((u.__v = null),
                                c || null != r ? ((u.__e = e), (u.__u |= c ? 160 : 32), (r[r.indexOf(e)] = null)) : ((u.__e = t.__e), (u.__k = t.__k)),
                                l$1.__e(n, u, t));
                        }
                    else
                        null == r && u.__v === t.__v
                            ? ((u.__k = t.__k), (u.__e = t.__e))
                            : (u.__e = (function (l, u, t, i, o, r, f, e, s) {
                                  var a,
                                      v,
                                      y,
                                      d,
                                      _,
                                      g,
                                      b,
                                      w = t.props,
                                      k = u.props,
                                      x = u.type;
                                  if (("svg" === x && (o = !0), null != r)) {
                                      for (a = 0; a < r.length; a++)
                                          if ((_ = r[a]) && "setAttribute" in _ == !!x && (x ? _.localName === x : 3 === _.nodeType)) {
                                              ((l = _), (r[a] = null));
                                              break;
                                          }
                                  }
                                  if (null == l) {
                                      if (null === x) return document.createTextNode(k);
                                      ((l = o ? document.createElementNS("http://www.w3.org/2000/svg", x) : document.createElement(x, k.is && k)), (r = null), (e = !1));
                                  }
                                  if (null === x) w === k || (e && l.data === k) || (l.data = k);
                                  else {
                                      if (((r = r && n.call(l.childNodes)), (w = t.props || c$1), !e && null != r))
                                          for (w = {}, a = 0; a < l.attributes.length; a++) w[(_ = l.attributes[a]).name] = _.value;
                                      for (a in w) ((_ = w[a]), "children" == a || ("dangerouslySetInnerHTML" == a ? (y = _) : "key" === a || a in k || A$1(l, a, null, _, o)));
                                      for (a in k)
                                          ((_ = k[a]),
                                              "children" == a
                                                  ? (d = _)
                                                  : "dangerouslySetInnerHTML" == a
                                                    ? (v = _)
                                                    : "value" == a
                                                      ? (g = _)
                                                      : "checked" == a
                                                        ? (b = _)
                                                        : "key" === a || (e && "function" != typeof _) || w[a] === _ || A$1(l, a, _, w[a], o));
                                      if (v) (e || (y && (v.__html === y.__html || v.__html === l.innerHTML)) || (l.innerHTML = v.__html), (u.__k = []));
                                      else if (
                                          (y && (l.innerHTML = ""),
                                          P$1(l, h$1(d) ? d : [d], u, t, i, o && "foreignObject" !== x, r, f, r ? r[0] : t.__k && m$1(t, 0), e, s),
                                          null != r)
                                      )
                                          for (a = r.length; a--;) null != r[a] && p$1(r[a]);
                                      e ||
                                          ((a = "value"),
                                          void 0 === g || (g === l[a] && ("progress" !== x || g) && ("option" !== x || g === w[a])) || A$1(l, a, g, w[a], !1),
                                          (a = "checked"),
                                          void 0 !== b && b !== l[a] && A$1(l, a, b, w[a], !1));
                                  }
                                  return l;
                              })(t.__e, u, t, i, o, r, f, c, s));
                    (a = l$1.diffed) && a(u);
                }
                function j$1(n, u, t) {
                    for (var i = 0; i < t.length; i++) N(t[i], t[++i], t[++i]);
                    (l$1.__c && l$1.__c(u, n),
                        n.some(function (u) {
                            try {
                                ((n = u.__h),
                                    (u.__h = []),
                                    n.some(function (n) {
                                        n.call(u);
                                    }));
                            } catch (n) {
                                l$1.__e(n, u.__v);
                            }
                        }));
                }
                function N(n, u, t) {
                    try {
                        "function" == typeof n ? n(u) : (n.current = u);
                    } catch (n) {
                        l$1.__e(n, t);
                    }
                }
                function O(n, u, t) {
                    var i, o;
                    if ((l$1.unmount && l$1.unmount(n), (i = n.ref) && ((i.current && i.current !== n.__e) || N(i, null, u)), null != (i = n.__c))) {
                        if (i.componentWillUnmount)
                            try {
                                i.componentWillUnmount();
                            } catch (n) {
                                l$1.__e(n, u);
                            }
                        ((i.base = i.__P = null), (n.__c = void 0));
                    }
                    if ((i = n.__k)) for (o = 0; o < i.length; o++) i[o] && O(i[o], u, t || "function" != typeof n.type);
                    (t || null == n.__e || p$1(n.__e), (n.__ = n.__e = n.__d = void 0));
                }
                function q$1(n, l, u) {
                    return this.constructor(n, u);
                }
                ((n = s$1.slice),
                    (l$1 = {
                        __e: function (n, l, u, t) {
                            for (var i, o, r; (l = l.__);)
                                if ((i = l.__c) && !i.__)
                                    try {
                                        if (
                                            ((o = i.constructor) && null != o.getDerivedStateFromError && (i.setState(o.getDerivedStateFromError(n)), (r = i.__d)),
                                            null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), (r = i.__d)),
                                            r)
                                        )
                                            return (i.__E = i);
                                    } catch (l) {
                                        n = l;
                                    }
                            throw n;
                        },
                    }),
                    (u$1 = 0),
                    (b$1.prototype.setState = function (n, l) {
                        var u;
                        ((u = null != this.__s && this.__s !== this.state ? this.__s : (this.__s = v$1({}, this.state))),
                            "function" == typeof n && (n = n(v$1({}, u), this.props)),
                            n && v$1(u, n),
                            null != n && this.__v && (l && this._sb.push(l), x$1(this)));
                    }),
                    (b$1.prototype.forceUpdate = function (n) {
                        this.__v && ((this.__e = !0), n && this.__h.push(n), x$1(this));
                    }),
                    (b$1.prototype.render = g$1),
                    (i$1 = []),
                    (r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
                    (f$1 = function (n, l) {
                        return n.__v.__b - l.__v.__b;
                    }),
                    (C$1.__r = 0));
                var t,
                    r,
                    u,
                    i,
                    o = 0,
                    f = [],
                    c = [],
                    e = l$1,
                    a = e.__b,
                    v = e.__r,
                    l = e.diffed,
                    m = e.__c,
                    s = e.unmount,
                    d = e.__;
                function h(n, t) {
                    (e.__h && e.__h(r, n, o || t), (o = 0));
                    var u = r.__H || (r.__H = { __: [], __h: [] });
                    return (n >= u.__.length && u.__.push({ __V: c }), u.__[n]);
                }
                function p(n) {
                    return ((o = 1), y(D, n));
                }
                function y(n, u, i) {
                    var o = h(t++, 2);
                    if (
                        ((o.t = n),
                        !o.__c &&
                            ((o.__ = [
                                i ? i(u) : D(void 0, u),
                                function (n) {
                                    var t = o.__N ? o.__N[0] : o.__[0],
                                        r = o.t(t, n);
                                    t !== r && ((o.__N = [r, o.__[1]]), o.__c.setState({}));
                                },
                            ]),
                            (o.__c = r),
                            !r.u))
                    ) {
                        var f = function (n, t, r) {
                            if (!o.__c.__H) return !0;
                            var u = o.__c.__H.__.filter(function (n) {
                                return !!n.__c;
                            });
                            if (
                                u.every(function (n) {
                                    return !n.__N;
                                })
                            )
                                return !c || c.call(this, n, t, r);
                            var i = !1;
                            return (
                                u.forEach(function (n) {
                                    if (n.__N) {
                                        var t = n.__[0];
                                        ((n.__ = n.__N), (n.__N = void 0), t !== n.__[0] && (i = !0));
                                    }
                                }),
                                !(!i && o.__c.props === n) && (!c || c.call(this, n, t, r))
                            );
                        };
                        r.u = !0;
                        var c = r.shouldComponentUpdate,
                            e = r.componentWillUpdate;
                        ((r.componentWillUpdate = function (n, t, r) {
                            if (this.__e) {
                                var u = c;
                                ((c = void 0), f(n, t, r), (c = u));
                            }
                            e && e.call(this, n, t, r);
                        }),
                            (r.shouldComponentUpdate = f));
                    }
                    return o.__N || o.__;
                }
                function A(n, u) {
                    var i = h(t++, 4);
                    !e.__s && C(i.__H, u) && ((i.__ = n), (i.i = u), r.__h.push(i));
                }
                function q(n, r) {
                    var u = h(t++, 7);
                    return C(u.__H, r) ? ((u.__V = n()), (u.i = r), (u.__h = n), u.__V) : u.__;
                }
                function x(n, t) {
                    return (
                        (o = 8),
                        q(function () {
                            return n;
                        }, t)
                    );
                }
                function j() {
                    for (var n; (n = f.shift());)
                        if (n.__P && n.__H)
                            try {
                                (n.__H.__h.forEach(z), n.__H.__h.forEach(B), (n.__H.__h = []));
                            } catch (t) {
                                ((n.__H.__h = []), e.__e(t, n.__v));
                            }
                }
                ((e.__b = function (n) {
                    ((r = null), a && a(n));
                }),
                    (e.__ = function (n, t) {
                        (t.__k && t.__k.__m && (n.__m = t.__k.__m), d && d(n, t));
                    }),
                    (e.__r = function (n) {
                        (v && v(n), (t = 0));
                        var i = (r = n.__c).__H;
                        (i &&
                            (u === r
                                ? ((i.__h = []),
                                  (r.__h = []),
                                  i.__.forEach(function (n) {
                                      (n.__N && (n.__ = n.__N), (n.__V = c), (n.__N = n.i = void 0));
                                  }))
                                : (i.__h.forEach(z), i.__h.forEach(B), (i.__h = []), (t = 0))),
                            (u = r));
                    }),
                    (e.diffed = function (n) {
                        l && l(n);
                        var t = n.__c;
                        (t &&
                            t.__H &&
                            (t.__H.__h.length &&
                                ((1 !== f.push(t) && i === e.requestAnimationFrame) ||
                                    (
                                        (i = e.requestAnimationFrame) ||
                                        function (n) {
                                            var t,
                                                r = function () {
                                                    (clearTimeout(u), k && cancelAnimationFrame(t), setTimeout(n));
                                                },
                                                u = setTimeout(r, 100);
                                            k && (t = requestAnimationFrame(r));
                                        }
                                    )(j)),
                            t.__H.__.forEach(function (n) {
                                (n.i && (n.__H = n.i), n.__V !== c && (n.__ = n.__V), (n.i = void 0), (n.__V = c));
                            })),
                            (u = r = null));
                    }),
                    (e.__c = function (n, t) {
                        (t.some(function (n) {
                            try {
                                (n.__h.forEach(z),
                                    (n.__h = n.__h.filter(function (n) {
                                        return !n.__ || B(n);
                                    })));
                            } catch (r) {
                                (t.some(function (n) {
                                    n.__h && (n.__h = []);
                                }),
                                    (t = []),
                                    e.__e(r, n.__v));
                            }
                        }),
                            m && m(n, t));
                    }),
                    (e.unmount = function (n) {
                        s && s(n);
                        var t,
                            r = n.__c;
                        r &&
                            r.__H &&
                            (r.__H.__.forEach(function (n) {
                                try {
                                    z(n);
                                } catch (n) {
                                    t = n;
                                }
                            }),
                            (r.__H = void 0),
                            t && e.__e(t, r.__v));
                    }));
                var k = "function" == typeof requestAnimationFrame;
                function z(n) {
                    var t = r,
                        u = n.__c;
                    ("function" == typeof u && ((n.__c = void 0), u()), (r = t));
                }
                function B(n) {
                    var t = r;
                    ((n.__c = n.__()), (r = t));
                }
                function C(n, t) {
                    return (
                        !n ||
                        n.length !== t.length ||
                        t.some(function (t, r) {
                            return t !== n[r];
                        })
                    );
                }
                function D(n, t) {
                    return "function" == typeof t ? t(n) : t;
                }
                let hooks = Object.defineProperty(
                    {
                        __proto__: null,
                        useCallback: x,
                        useContext: function (n) {
                            var u = r.context[n.__c],
                                i = h(t++, 9);
                            return ((i.c = n), u ? (null == i.__ && ((i.__ = !0), u.sub(r)), u.props.value) : n.__);
                        },
                        useDebugValue: function (n, t) {
                            e.useDebugValue && e.useDebugValue(t ? t(n) : n);
                        },
                        useEffect: function (n, u) {
                            var i = h(t++, 3);
                            !e.__s && C(i.__H, u) && ((i.__ = n), (i.i = u), r.__H.__h.push(i));
                        },
                        useErrorBoundary: function (n) {
                            var u = h(t++, 10),
                                i = p();
                            return (
                                (u.__ = n),
                                r.componentDidCatch ||
                                    (r.componentDidCatch = function (n, t) {
                                        (u.__ && u.__(n, t), i[1](n));
                                    }),
                                [
                                    i[0],
                                    function () {
                                        i[1](void 0);
                                    },
                                ]
                            );
                        },
                        useId: function () {
                            var n = h(t++, 11);
                            if (!n.__) {
                                for (var u = r.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
                                var i = u.__m || (u.__m = [0, 0]);
                                n.__ = "P" + i[0] + "-" + i[1]++;
                            }
                            return n.__;
                        },
                        useImperativeHandle: function (n, t, r) {
                            ((o = 6),
                                A(
                                    function () {
                                        return "function" == typeof n
                                            ? (n(t()),
                                              function () {
                                                  return n(null);
                                              })
                                            : n
                                              ? ((n.current = t()),
                                                function () {
                                                    return (n.current = null);
                                                })
                                              : void 0;
                                    },
                                    null == r ? r : r.concat(n),
                                ));
                        },
                        useLayoutEffect: A,
                        useMemo: q,
                        useReducer: y,
                        useRef: function (n) {
                            return (
                                (o = 5),
                                q(function () {
                                    return { current: n };
                                }, [])
                            );
                        },
                        useState: p,
                    },
                    Symbol.toStringTag,
                    { value: "Module" },
                );
                function DialogHeader({ options }) {
                    let logoHtml = q(() => {
                        let svg, path;
                        return {
                            __html: ((svg = setAttributesNS(DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg"), {
                                width: "32",
                                height: "30",
                                viewBox: "0 0 72 66",
                                fill: "inherit",
                            })),
                            (path = setAttributesNS(DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "path"), {
                                transform: "translate(11, 11)",
                                d: "M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z",
                            })),
                            svg.appendChild(path),
                            svg).outerHTML,
                        };
                    }, []);
                    return y$1(
                        "h2",
                        { class: "dialog__header" },
                        y$1("span", { class: "dialog__title" }, options.formTitle),
                        options.showBranding
                            ? y$1("a", {
                                  class: "brand-link",
                                  target: "_blank",
                                  href: "https://sentry.io/welcome/",
                                  title: "Powered by Sentry",
                                  rel: "noopener noreferrer",
                                  dangerouslySetInnerHTML: logoHtml,
                              })
                            : null,
                    );
                }
                function retrieveStringValue(formData, key) {
                    let value = formData.get(key);
                    return "string" == typeof value ? value.trim() : "";
                }
                function Form({ options, defaultEmail, defaultName, onFormClose, onSubmit, onSubmitSuccess, onSubmitError, showEmail, showName, screenshotInput }) {
                    let {
                            tags,
                            addScreenshotButtonLabel,
                            removeScreenshotButtonLabel,
                            cancelButtonLabel,
                            emailLabel,
                            emailPlaceholder,
                            isEmailRequired,
                            isNameRequired,
                            messageLabel,
                            messagePlaceholder,
                            nameLabel,
                            namePlaceholder,
                            submitButtonLabel,
                            isRequiredLabel,
                        } = options,
                        [isSubmitting, setIsSubmitting] = p(!1),
                        [error, setError] = p(null),
                        [showScreenshotInput, setShowScreenshotInput] = p(!1),
                        ScreenshotInputComponent = screenshotInput?.input,
                        [screenshotError, setScreenshotError] = p(null),
                        onScreenshotError = x((error) => {
                            (setScreenshotError(error), setShowScreenshotInput(!1));
                        }, []),
                        hasAllRequiredFields = x(
                            (data) => {
                                var props;
                                let emptyFields,
                                    missingFields =
                                        ((emptyFields = []),
                                        (props = { emailLabel, isEmailRequired, isNameRequired, messageLabel, nameLabel }).isNameRequired &&
                                            !data.name &&
                                            emptyFields.push(props.nameLabel),
                                        props.isEmailRequired && !data.email && emptyFields.push(props.emailLabel),
                                        data.message || emptyFields.push(props.messageLabel),
                                        emptyFields);
                                return (
                                    missingFields.length > 0 ? setError(`Please enter in the following required fields: ${missingFields.join(", ")}`) : setError(null),
                                    0 === missingFields.length
                                );
                            },
                            [emailLabel, isEmailRequired, isNameRequired, messageLabel, nameLabel],
                        );
                    return y$1(
                        "form",
                        {
                            class: "form",
                            onSubmit: x(
                                async (e) => {
                                    setIsSubmitting(!0);
                                    try {
                                        if ((e.preventDefault(), !(e.target instanceof HTMLFormElement))) return;
                                        let formData = new FormData(e.target),
                                            attachment = await (screenshotInput && showScreenshotInput ? screenshotInput.value() : void 0),
                                            data = {
                                                name: retrieveStringValue(formData, "name"),
                                                email: retrieveStringValue(formData, "email"),
                                                message: retrieveStringValue(formData, "message"),
                                                attachments: attachment ? [attachment] : void 0,
                                            };
                                        if (!hasAllRequiredFields(data)) return;
                                        try {
                                            let eventId = await onSubmit(
                                                { name: data.name, email: data.email, message: data.message, source: "widget", tags },
                                                { attachments: data.attachments },
                                            );
                                            onSubmitSuccess(data, eventId);
                                        } catch (error) {
                                            (DEBUG_BUILD && core.debug.error(error), setError(error), onSubmitError(error));
                                        }
                                    } finally {
                                        setIsSubmitting(!1);
                                    }
                                },
                                [screenshotInput && showScreenshotInput, onSubmitSuccess, onSubmitError],
                            ),
                        },
                        ScreenshotInputComponent && showScreenshotInput ? y$1(ScreenshotInputComponent, { onError: onScreenshotError }) : null,
                        y$1(
                            "fieldset",
                            { class: "form__right", "data-sentry-feedback": !0, disabled: isSubmitting },
                            y$1(
                                "div",
                                { class: "form__top" },
                                error ? y$1("div", { class: "form__error-container" }, error) : null,
                                showName
                                    ? y$1(
                                          "label",
                                          { for: "name", class: "form__label" },
                                          y$1(LabelText, { label: nameLabel, isRequiredLabel: isRequiredLabel, isRequired: isNameRequired }),
                                          y$1("input", {
                                              class: "form__input",
                                              defaultValue: defaultName,
                                              id: "name",
                                              name: "name",
                                              placeholder: namePlaceholder,
                                              required: isNameRequired,
                                              type: "text",
                                          }),
                                      )
                                    : y$1("input", { "aria-hidden": !0, value: defaultName, name: "name", type: "hidden" }),
                                showEmail
                                    ? y$1(
                                          "label",
                                          { for: "email", class: "form__label" },
                                          y$1(LabelText, { label: emailLabel, isRequiredLabel: isRequiredLabel, isRequired: isEmailRequired }),
                                          y$1("input", {
                                              class: "form__input",
                                              defaultValue: defaultEmail,
                                              id: "email",
                                              name: "email",
                                              placeholder: emailPlaceholder,
                                              required: isEmailRequired,
                                              type: "email",
                                          }),
                                      )
                                    : y$1("input", { "aria-hidden": !0, value: defaultEmail, name: "email", type: "hidden" }),
                                y$1(
                                    "label",
                                    { for: "message", class: "form__label" },
                                    y$1(LabelText, { label: messageLabel, isRequiredLabel: isRequiredLabel, isRequired: !0 }),
                                    y$1("textarea", {
                                        autoFocus: !0,
                                        class: "form__input form__input--textarea",
                                        id: "message",
                                        name: "message",
                                        placeholder: messagePlaceholder,
                                        required: !0,
                                        rows: 5,
                                    }),
                                ),
                                ScreenshotInputComponent
                                    ? y$1(
                                          "label",
                                          { for: "screenshot", class: "form__label" },
                                          y$1(
                                              "button",
                                              {
                                                  class: "btn btn--default",
                                                  disabled: isSubmitting,
                                                  type: "button",
                                                  onClick: () => {
                                                      (setScreenshotError(null), setShowScreenshotInput((prev) => !prev));
                                                  },
                                              },
                                              showScreenshotInput ? removeScreenshotButtonLabel : addScreenshotButtonLabel,
                                          ),
                                          screenshotError ? y$1("div", { class: "form__error-container" }, screenshotError.message) : null,
                                      )
                                    : null,
                            ),
                            y$1(
                                "div",
                                { class: "btn-group" },
                                y$1("button", { class: "btn btn--primary", disabled: isSubmitting, type: "submit" }, submitButtonLabel),
                                y$1("button", { class: "btn btn--default", disabled: isSubmitting, type: "button", onClick: onFormClose }, cancelButtonLabel),
                            ),
                        ),
                    );
                }
                function LabelText({ label, isRequired, isRequiredLabel }) {
                    return y$1("span", { class: "form__label__text" }, label, isRequired && y$1("span", { class: "form__label__text--required" }, isRequiredLabel));
                }
                function Dialog({ open, onFormSubmitted, ...props }) {
                    let options = props.options,
                        successIconHtml = q(() => {
                            let createElementNS, svg, g, path2, path, speakerDefs, speakerClipPathDef, speakerRect;
                            return {
                                __html: ((svg = setAttributesNS((createElementNS = (tagName) => WINDOW.document.createElementNS("http://www.w3.org/2000/svg", tagName))("svg"), {
                                    width: "16",
                                    height: "17",
                                    viewBox: "0 0 16 17",
                                    fill: "inherit",
                                })),
                                (g = setAttributesNS(createElementNS("g"), { clipPath: "url(#clip0_57_156)" })),
                                (path2 = setAttributesNS(createElementNS("path"), {
                                    "fill-rule": "evenodd",
                                    "clip-rule": "evenodd",
                                    d: "M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z",
                                })),
                                (path = setAttributesNS(createElementNS("path"), {
                                    d: "M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z",
                                })),
                                svg.appendChild(g).append(path, path2),
                                (speakerDefs = createElementNS("defs")),
                                (speakerClipPathDef = setAttributesNS(createElementNS("clipPath"), { id: "clip0_57_156" })),
                                (speakerRect = setAttributesNS(createElementNS("rect"), { width: "16", height: "16", fill: "white", transform: "translate(0 0.5)" })),
                                speakerClipPathDef.appendChild(speakerRect),
                                speakerDefs.appendChild(speakerClipPathDef),
                                svg.appendChild(speakerDefs).appendChild(speakerClipPathDef).appendChild(speakerRect),
                                svg).outerHTML,
                            };
                        }, []),
                        [timeoutId, setTimeoutId] = p(null),
                        handleOnSuccessClick = x(() => {
                            (timeoutId && (clearTimeout(timeoutId), setTimeoutId(null)), onFormSubmitted());
                        }, [timeoutId]),
                        onSubmitSuccess = x(
                            (data, eventId) => {
                                (props.onSubmitSuccess(data, eventId),
                                    setTimeoutId(
                                        setTimeout(() => {
                                            (onFormSubmitted(), setTimeoutId(null));
                                        }, 5e3),
                                    ));
                            },
                            [onFormSubmitted],
                        );
                    return y$1(
                        g$1,
                        null,
                        timeoutId
                            ? y$1(
                                  "div",
                                  { class: "success__position", onClick: handleOnSuccessClick },
                                  y$1(
                                      "div",
                                      { class: "success__content" },
                                      options.successMessageText,
                                      y$1("span", { class: "success__icon", dangerouslySetInnerHTML: successIconHtml }),
                                  ),
                              )
                            : y$1(
                                  "dialog",
                                  { class: "dialog", onClick: options.onFormClose, open: open },
                                  y$1(
                                      "div",
                                      { class: "dialog__position" },
                                      y$1(
                                          "div",
                                          {
                                              class: "dialog__content",
                                              onClick: (e) => {
                                                  e.stopPropagation();
                                              },
                                          },
                                          y$1(DialogHeader, { options: options }),
                                          y$1(Form, { ...props, onSubmitSuccess: onSubmitSuccess }),
                                      ),
                                  ),
                              ),
                    );
                }
                let DIALOG = `
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`,
                    DIALOG_HEADER = `
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`,
                    FORM = `
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`,
                    BUTTON = `
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`,
                    SUCCESS = `
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;
                function with2dContext(canvas, options, callback) {
                    if (!canvas) return;
                    let ctx = canvas.getContext("2d", options);
                    ctx && callback(canvas, ctx);
                }
                function paintImage(maybeDest, source) {
                    with2dContext(maybeDest, { alpha: !0 }, (destCanvas, destCtx) => {
                        destCtx.drawImage(source, 0, 0, source.width, source.height, 0, 0, destCanvas.width, destCanvas.height);
                    });
                }
                function paintForeground(maybeCanvas, strokeColor, drawCommands) {
                    with2dContext(maybeCanvas, { alpha: !0 }, (canvas, ctx) => {
                        (drawCommands.length && ((ctx.fillStyle = "rgba(0, 0, 0, 0.25)"), ctx.fillRect(0, 0, canvas.width, canvas.height)),
                            drawCommands.forEach((command) => {
                                switch (command.type) {
                                    case "highlight":
                                        ((ctx.shadowColor = "rgba(0, 0, 0, 0.7)"),
                                            (ctx.shadowBlur = 50),
                                            (ctx.fillStyle = strokeColor),
                                            ctx.fillRect(command.x - 1, command.y - 1, command.w + 2, command.h + 2),
                                            ctx.clearRect(command.x, command.y, command.w, command.h));
                                        break;
                                    case "hide":
                                        ((ctx.fillStyle = "rgb(0, 0, 0)"), ctx.fillRect(command.x, command.y, command.w, command.h));
                                }
                            }));
                    });
                }
                ((exports.buildFeedbackIntegration =
                    ({ lazyLoadIntegration, getModalIntegration, getScreenshotIntegration }) =>
                    ({
                        id = "sentry-feedback",
                        autoInject = !0,
                        showBranding = !0,
                        isEmailRequired = !1,
                        isNameRequired = !1,
                        showEmail = !0,
                        showName = !0,
                        enableScreenshot = !0,
                        useSentryUser = { email: "email", name: "username" },
                        tags,
                        styleNonce,
                        scriptNonce,
                        colorScheme = "system",
                        themeLight = {},
                        themeDark = {},
                        addScreenshotButtonLabel = ADD_SCREENSHOT_LABEL,
                        cancelButtonLabel = CANCEL_BUTTON_LABEL,
                        confirmButtonLabel = CONFIRM_BUTTON_LABEL,
                        emailLabel = EMAIL_LABEL,
                        emailPlaceholder = EMAIL_PLACEHOLDER,
                        formTitle = FORM_TITLE,
                        isRequiredLabel = IS_REQUIRED_LABEL,
                        messageLabel = MESSAGE_LABEL,
                        messagePlaceholder = MESSAGE_PLACEHOLDER,
                        nameLabel = NAME_LABEL,
                        namePlaceholder = NAME_PLACEHOLDER,
                        removeScreenshotButtonLabel = REMOVE_SCREENSHOT_LABEL,
                        submitButtonLabel = SUBMIT_BUTTON_LABEL,
                        successMessageText = SUCCESS_MESSAGE_TEXT,
                        triggerLabel = TRIGGER_LABEL,
                        triggerAriaLabel = "",
                        highlightToolText = HIGHLIGHT_TOOL_TEXT,
                        hideToolText = HIDE_TOOL_TEXT,
                        removeHighlightText = REMOVE_HIGHLIGHT_TEXT,
                        onFormOpen,
                        onFormClose,
                        onSubmitSuccess,
                        onSubmitError,
                        onFormSubmitted,
                    } = {}) => {
                        let _options = {
                                id,
                                autoInject,
                                showBranding,
                                isEmailRequired,
                                isNameRequired,
                                showEmail,
                                showName,
                                enableScreenshot,
                                useSentryUser,
                                tags,
                                styleNonce,
                                scriptNonce,
                                colorScheme,
                                themeDark,
                                themeLight,
                                triggerLabel,
                                triggerAriaLabel,
                                cancelButtonLabel,
                                submitButtonLabel,
                                confirmButtonLabel,
                                formTitle,
                                emailLabel,
                                emailPlaceholder,
                                messageLabel,
                                messagePlaceholder,
                                nameLabel,
                                namePlaceholder,
                                successMessageText,
                                isRequiredLabel,
                                addScreenshotButtonLabel,
                                removeScreenshotButtonLabel,
                                highlightToolText,
                                hideToolText,
                                removeHighlightText,
                                onFormClose,
                                onFormOpen,
                                onSubmitError,
                                onSubmitSuccess,
                                onFormSubmitted,
                            },
                            _shadow = null,
                            _mainStyle = null,
                            _subscriptions = [],
                            _createShadow = (options) => {
                                if (!_shadow) {
                                    let host = DOCUMENT.createElement("div");
                                    ((host.id = String(options.id)),
                                        DOCUMENT.body.appendChild(host),
                                        (_shadow = host.attachShadow({ mode: "open" })),
                                        (_mainStyle = createMainStyles(options)),
                                        _shadow.appendChild(_mainStyle));
                                }
                                return _shadow;
                            },
                            _loadAndRenderDialog = async (options) => {
                                let modalIntegration,
                                    screenshotIntegration,
                                    screenshotRequired =
                                        options.enableScreenshot &&
                                        !(
                                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(NAVIGATOR.userAgent) ||
                                            (/Macintosh/i.test(NAVIGATOR.userAgent) && NAVIGATOR.maxTouchPoints && NAVIGATOR.maxTouchPoints > 1)
                                        ) &&
                                        !!isSecureContext;
                                try {
                                    ((modalIntegration = (getModalIntegration ? getModalIntegration() : await lazyLoadIntegration("feedbackModalIntegration", scriptNonce))()),
                                        core.addIntegration(modalIntegration));
                                } catch {
                                    throw (
                                        DEBUG_BUILD &&
                                            core.debug.error(
                                                "[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`.",
                                            ),
                                        Error("[Feedback] Missing feedback modal integration!")
                                    );
                                }
                                try {
                                    let screenshotIntegrationFn = screenshotRequired
                                        ? getScreenshotIntegration
                                            ? getScreenshotIntegration()
                                            : await lazyLoadIntegration("feedbackScreenshotIntegration", scriptNonce)
                                        : void 0;
                                    screenshotIntegrationFn && ((screenshotIntegration = screenshotIntegrationFn()), core.addIntegration(screenshotIntegration));
                                } catch {
                                    DEBUG_BUILD && core.debug.error("[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.");
                                }
                                let dialog = modalIntegration.createDialog({
                                    options: {
                                        ...options,
                                        onFormClose: () => {
                                            (dialog?.close(), options.onFormClose?.());
                                        },
                                        onFormSubmitted: () => {
                                            (dialog?.close(), options.onFormSubmitted?.());
                                        },
                                    },
                                    screenshotIntegration,
                                    sendFeedback,
                                    shadow: _createShadow(options),
                                });
                                return dialog;
                            },
                            _attachTo = (el, optionOverrides = {}) => {
                                let mergedOptions = mergeOptions(_options, optionOverrides),
                                    targetEl = "string" == typeof el ? DOCUMENT.querySelector(el) : "function" == typeof el.addEventListener ? el : null;
                                if (!targetEl)
                                    throw (DEBUG_BUILD && core.debug.error("[Feedback] Unable to attach to target element"), Error("Unable to attach to target element"));
                                let dialog = null,
                                    handleClick = async () => {
                                        (dialog ||
                                            (dialog = await _loadAndRenderDialog({
                                                ...mergedOptions,
                                                onFormSubmitted: () => {
                                                    (dialog?.removeFromDom(), mergedOptions.onFormSubmitted?.());
                                                },
                                            })),
                                            dialog.appendToDom(),
                                            dialog.open());
                                    };
                                targetEl.addEventListener("click", handleClick);
                                let unsubscribe = () => {
                                    ((_subscriptions = _subscriptions.filter((sub) => sub !== unsubscribe)),
                                        dialog?.removeFromDom(),
                                        (dialog = null),
                                        targetEl.removeEventListener("click", handleClick));
                                };
                                return (_subscriptions.push(unsubscribe), unsubscribe);
                            },
                            _createActor = (optionOverrides = {}) => {
                                let mergedOptions = mergeOptions(_options, optionOverrides),
                                    shadow = _createShadow(mergedOptions),
                                    actor = (function ({ triggerLabel, triggerAriaLabel, shadow, styleNonce }) {
                                        let createElementNS,
                                            svg,
                                            g,
                                            path,
                                            speakerDefs,
                                            speakerClipPathDef,
                                            speakerRect,
                                            style,
                                            el = DOCUMENT.createElement("button");
                                        if (
                                            ((el.type = "button"),
                                            (el.className = "widget__actor"),
                                            (el.ariaHidden = "false"),
                                            (el.ariaLabel = triggerAriaLabel || triggerLabel || TRIGGER_LABEL),
                                            el.appendChild(
                                                ((svg = setAttributesNS(
                                                    (createElementNS = (tagName) => WINDOW.document.createElementNS("http://www.w3.org/2000/svg", tagName))("svg"),
                                                    { width: "20", height: "20", viewBox: "0 0 20 20", fill: "var(--actor-color, var(--foreground))" },
                                                )),
                                                (g = setAttributesNS(createElementNS("g"), { clipPath: "url(#clip0_57_80)" })),
                                                (path = setAttributesNS(createElementNS("path"), {
                                                    "fill-rule": "evenodd",
                                                    "clip-rule": "evenodd",
                                                    d: "M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z",
                                                })),
                                                svg.appendChild(g).appendChild(path),
                                                (speakerDefs = createElementNS("defs")),
                                                (speakerClipPathDef = setAttributesNS(createElementNS("clipPath"), { id: "clip0_57_80" })),
                                                (speakerRect = setAttributesNS(createElementNS("rect"), { width: "20", height: "20", fill: "white" })),
                                                speakerClipPathDef.appendChild(speakerRect),
                                                speakerDefs.appendChild(speakerClipPathDef),
                                                svg.appendChild(speakerDefs).appendChild(speakerClipPathDef).appendChild(speakerRect),
                                                svg),
                                            ),
                                            triggerLabel)
                                        ) {
                                            let label = DOCUMENT.createElement("span");
                                            (label.appendChild(DOCUMENT.createTextNode(triggerLabel)), el.appendChild(label));
                                        }
                                        let style1 =
                                            (((style = DOCUMENT.createElement("style")).textContent = `
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`),
                                            styleNonce && style.setAttribute("nonce", styleNonce),
                                            style);
                                        return {
                                            el,
                                            appendToDom() {
                                                (shadow.appendChild(style1), shadow.appendChild(el));
                                            },
                                            removeFromDom() {
                                                (el.remove(), style1.remove());
                                            },
                                            show() {
                                                el.ariaHidden = "false";
                                            },
                                            hide() {
                                                el.ariaHidden = "true";
                                            },
                                        };
                                    })({ triggerLabel: mergedOptions.triggerLabel, triggerAriaLabel: mergedOptions.triggerAriaLabel, shadow, styleNonce });
                                return (
                                    _attachTo(actor.el, {
                                        ...mergedOptions,
                                        onFormOpen() {
                                            actor.hide();
                                        },
                                        onFormClose() {
                                            actor.show();
                                        },
                                        onFormSubmitted() {
                                            actor.show();
                                        },
                                    }),
                                    actor
                                );
                            };
                        return {
                            name: "Feedback",
                            setupOnce() {
                                core.isBrowser() &&
                                    _options.autoInject &&
                                    ("loading" === DOCUMENT.readyState
                                        ? DOCUMENT.addEventListener("DOMContentLoaded", () => _createActor().appendToDom())
                                        : _createActor().appendToDom());
                            },
                            attachTo: _attachTo,
                            createWidget(optionOverrides = {}) {
                                let actor = _createActor(mergeOptions(_options, optionOverrides));
                                return (actor.appendToDom(), actor);
                            },
                            createForm: async (optionOverrides = {}) => _loadAndRenderDialog(mergeOptions(_options, optionOverrides)),
                            setTheme(colorScheme) {
                                if (((_options.colorScheme = colorScheme), _shadow)) {
                                    let newStyle = createMainStyles(_options);
                                    (_mainStyle ? _shadow.replaceChild(newStyle, _mainStyle) : _shadow.prepend(newStyle), (_mainStyle = newStyle));
                                }
                            },
                            remove() {
                                (_shadow && (_shadow.parentElement?.remove(), (_shadow = null), (_mainStyle = null)),
                                    _subscriptions.forEach((sub) => sub()),
                                    (_subscriptions = []));
                            },
                        };
                    }),
                    (exports.feedbackModalIntegration = () => ({
                        name: "FeedbackModal",
                        setupOnce() {},
                        createDialog: ({ options, screenshotIntegration, sendFeedback, shadow }) => {
                            var styleNonce;
                            let currentUser,
                                isolationUser,
                                globalUser,
                                style,
                                userKey = options.useSentryUser,
                                user =
                                    ((currentUser = core.getCurrentScope().getUser()),
                                    (isolationUser = core.getIsolationScope().getUser()),
                                    (globalUser = core.getGlobalScope().getUser()),
                                    currentUser && Object.keys(currentUser).length ? currentUser : isolationUser && Object.keys(isolationUser).length ? isolationUser : globalUser),
                                el = DOCUMENT.createElement("div"),
                                style1 =
                                    ((styleNonce = options.styleNonce),
                                    ((style = DOCUMENT.createElement("style")).textContent = `
:host {
  --dialog-inset: var(--inset);
}

${DIALOG}
${DIALOG_HEADER}
${FORM}
${BUTTON}
${SUCCESS}
`),
                                    styleNonce && style.setAttribute("nonce", styleNonce),
                                    style),
                                originalOverflow = "",
                                dialog = {
                                    get el() {
                                        return el;
                                    },
                                    appendToDom() {
                                        shadow.contains(style1) || shadow.contains(el) || (shadow.appendChild(style1), shadow.appendChild(el));
                                    },
                                    removeFromDom() {
                                        (el.remove(), style1.remove(), (DOCUMENT.body.style.overflow = originalOverflow));
                                    },
                                    open() {
                                        (renderContent(!0),
                                            options.onFormOpen?.(),
                                            core.getClient()?.emit("openFeedbackWidget"),
                                            (originalOverflow = DOCUMENT.body.style.overflow),
                                            (DOCUMENT.body.style.overflow = "hidden"));
                                    },
                                    close() {
                                        (renderContent(!1), (DOCUMENT.body.style.overflow = originalOverflow));
                                    },
                                },
                                screenshotInput = screenshotIntegration?.createInput({ h: y$1, hooks, dialog, options }),
                                renderContent = (open) => {
                                    var u, r, f, e;
                                    ((u = y$1(Dialog, {
                                        options: options,
                                        screenshotInput: screenshotInput,
                                        showName: options.showName || options.isNameRequired,
                                        showEmail: options.showEmail || options.isEmailRequired,
                                        defaultName: String((userKey && user?.[userKey.name]) || ""),
                                        defaultEmail: String((userKey && user?.[userKey.email]) || ""),
                                        onFormClose: () => {
                                            (renderContent(!1), options.onFormClose?.());
                                        },
                                        onSubmit: sendFeedback,
                                        onSubmitSuccess: (data, eventId) => {
                                            (renderContent(!1), options.onSubmitSuccess?.(data, eventId));
                                        },
                                        onSubmitError: (error) => {
                                            options.onSubmitError?.(error);
                                        },
                                        onFormSubmitted: () => {
                                            options.onFormSubmitted?.();
                                        },
                                        open: open,
                                    })),
                                        l$1.__ && l$1.__(u, el),
                                        (r = el.__k),
                                        (f = []),
                                        (e = []),
                                        M(
                                            el,
                                            (u = el.__k = y$1(g$1, null, [u])),
                                            r || c$1,
                                            c$1,
                                            void 0 !== el.ownerSVGElement,
                                            r ? null : el.firstChild ? n.call(el.childNodes) : null,
                                            f,
                                            r ? r.__e : el.firstChild,
                                            !1,
                                            e,
                                        ),
                                        (u.__d = void 0),
                                        j$1(f, u, e));
                                };
                            return dialog;
                        },
                    })),
                    (exports.feedbackScreenshotIntegration = () => ({
                        name: "FeedbackScreenshot",
                        setupOnce() {},
                        createInput: ({ h, hooks, dialog, options }) => {
                            let outputBuffer = DOCUMENT.createElement("canvas");
                            return {
                                input: (function ({ h, hooks, outputBuffer, dialog, options }) {
                                    var styleNonce;
                                    let style,
                                        surface200,
                                        gray100,
                                        useTakeScreenshot = (function ({ hooks }) {
                                            return function ({ onBeforeScreenshot, onScreenshot, onAfterScreenshot, onError }) {
                                                let dpi = (function () {
                                                    let [dpi, setDpi] = hooks.useState(WINDOW.devicePixelRatio ?? 1);
                                                    return (
                                                        hooks.useEffect(() => {
                                                            let onChange = () => {
                                                                    setDpi(WINDOW.devicePixelRatio);
                                                                },
                                                                media = matchMedia(`(resolution: ${WINDOW.devicePixelRatio}dppx)`);
                                                            return (
                                                                media.addEventListener("change", onChange),
                                                                () => {
                                                                    media.removeEventListener("change", onChange);
                                                                }
                                                            );
                                                        }, []),
                                                        dpi
                                                    );
                                                })();
                                                hooks.useEffect(() => {
                                                    (async () => {
                                                        onBeforeScreenshot();
                                                        let stream = await NAVIGATOR.mediaDevices.getDisplayMedia({
                                                                video: { width: WINDOW.innerWidth * dpi, height: WINDOW.innerHeight * dpi },
                                                                audio: !1,
                                                                monitorTypeSurfaces: "exclude",
                                                                preferCurrentTab: !0,
                                                                selfBrowserSurface: "include",
                                                                surfaceSwitching: "exclude",
                                                            }),
                                                            video = DOCUMENT.createElement("video");
                                                        (await new Promise((resolve, reject) => {
                                                            ((video.srcObject = stream),
                                                                (video.onloadedmetadata = () => {
                                                                    (onScreenshot(video, dpi), stream.getTracks().forEach((track) => track.stop()), resolve());
                                                                }),
                                                                video.play().catch(reject));
                                                        }),
                                                            onAfterScreenshot());
                                                    })().catch(onError);
                                                }, []);
                                            };
                                        })({ hooks }),
                                        Toolbar = (function ({ h }) {
                                            return function ({ action, setAction, options }) {
                                                return h(
                                                    "div",
                                                    { class: "editor__tool-container" },
                                                    h(
                                                        "div",
                                                        { class: "editor__tool-bar" },
                                                        h(
                                                            "button",
                                                            {
                                                                type: "button",
                                                                class: `editor__tool ${"highlight" === action ? "editor__tool--active" : ""}`,
                                                                onClick: () => {
                                                                    setAction("highlight" === action ? "" : "highlight");
                                                                },
                                                            },
                                                            options.highlightToolText,
                                                        ),
                                                        h(
                                                            "button",
                                                            {
                                                                type: "button",
                                                                class: `editor__tool ${"hide" === action ? "editor__tool--active" : ""}`,
                                                                onClick: () => {
                                                                    setAction("hide" === action ? "" : "hide");
                                                                },
                                                            },
                                                            options.hideToolText,
                                                        ),
                                                    ),
                                                );
                                            };
                                        })({ h }),
                                        IconClose = (function ({ h }) {
                                            return function () {
                                                return h(
                                                    "svg",
                                                    { "data-test-id": "icon-close", viewBox: "0 0 16 16", fill: "#2B2233", height: "25px", width: "25px" },
                                                    h("circle", { r: "7", cx: "8", cy: "8", fill: "white" }),
                                                    h("path", {
                                                        strokeWidth: "1.5",
                                                        d: "M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z",
                                                    }),
                                                    h("path", {
                                                        strokeWidth: "1.5",
                                                        d: "M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z",
                                                    }),
                                                    h("path", {
                                                        strokeWidth: "1.5",
                                                        d: "M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z",
                                                    }),
                                                );
                                            };
                                        })({ h }),
                                        editorStyleInnerText = {
                                            __html: ((styleNonce = options.styleNonce),
                                            (style = DOCUMENT.createElement("style")),
                                            (surface200 = "#1A141F"),
                                            (gray100 = "#302735"),
                                            (style.textContent = `
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${surface200};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${surface200} 8px,
      ${surface200} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${gray100} 15px,
      ${gray100} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`),
                                            styleNonce && style.setAttribute("nonce", styleNonce),
                                            style).innerText,
                                        },
                                        dialogStyle = dialog.el.style,
                                        ScreenshotEditor = ({ screenshot }) => {
                                            let [action, setAction] = hooks.useState("highlight"),
                                                [drawCommands, setDrawCommands] = hooks.useState([]),
                                                measurementRef = hooks.useRef(null),
                                                backgroundRef = hooks.useRef(null),
                                                foregroundRef = hooks.useRef(null),
                                                mouseRef = hooks.useRef(null),
                                                [scaleFactor, setScaleFactor] = hooks.useState(1),
                                                strokeColor = hooks.useMemo(() => {
                                                    let sentryFeedback = DOCUMENT.getElementById(options.id);
                                                    if (!sentryFeedback) return "white";
                                                    let computedStyle = getComputedStyle(sentryFeedback);
                                                    return computedStyle.getPropertyValue("--button-primary-background") || computedStyle.getPropertyValue("--accent-background");
                                                }, [options.id]);
                                            hooks.useLayoutEffect(() => {
                                                let handleResize = () => {
                                                    let measurementDiv = measurementRef.current;
                                                    measurementDiv &&
                                                        (with2dContext(screenshot.canvas, { alpha: !1 }, (canvas) => {
                                                            setScaleFactor(Math.min(measurementDiv.clientWidth / canvas.width, measurementDiv.clientHeight / canvas.height));
                                                        }),
                                                        (0 === measurementDiv.clientHeight || 0 === measurementDiv.clientWidth) && setTimeout(handleResize, 0));
                                                };
                                                return (
                                                    handleResize(),
                                                    WINDOW.addEventListener("resize", handleResize),
                                                    () => {
                                                        WINDOW.removeEventListener("resize", handleResize);
                                                    }
                                                );
                                            }, [screenshot]);
                                            let setCanvasSize = hooks.useCallback(
                                                (maybeCanvas, scale) => {
                                                    with2dContext(maybeCanvas, { alpha: !0 }, (canvas, ctx) => {
                                                        (ctx.scale(scale, scale), (canvas.width = screenshot.canvas.width), (canvas.height = screenshot.canvas.height));
                                                    });
                                                },
                                                [screenshot],
                                            );
                                            (hooks.useEffect(() => {
                                                (setCanvasSize(backgroundRef.current, screenshot.dpi), paintImage(backgroundRef.current, screenshot.canvas));
                                            }, [screenshot]),
                                                hooks.useEffect(() => {
                                                    (setCanvasSize(foregroundRef.current, screenshot.dpi),
                                                        with2dContext(foregroundRef.current, { alpha: !0 }, (canvas, ctx) => {
                                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                        }),
                                                        paintForeground(foregroundRef.current, strokeColor, drawCommands));
                                                }, [drawCommands, strokeColor]),
                                                hooks.useEffect(() => {
                                                    (setCanvasSize(outputBuffer, screenshot.dpi),
                                                        paintImage(outputBuffer, screenshot.canvas),
                                                        with2dContext(DOCUMENT.createElement("canvas"), { alpha: !0 }, (foreground, ctx) => {
                                                            (ctx.scale(screenshot.dpi, screenshot.dpi),
                                                                (foreground.width = screenshot.canvas.width),
                                                                (foreground.height = screenshot.canvas.height),
                                                                paintForeground(foreground, strokeColor, drawCommands),
                                                                paintImage(outputBuffer, foreground));
                                                        }));
                                                }, [drawCommands, screenshot, strokeColor]));
                                            let deleteRect = hooks.useCallback(
                                                    (index) => (e) => {
                                                        (e.preventDefault(),
                                                            e.stopPropagation(),
                                                            setDrawCommands((prev) => {
                                                                let updatedRects = [...prev];
                                                                return (updatedRects.splice(index, 1), updatedRects);
                                                            }));
                                                    },
                                                    [],
                                                ),
                                                dimensions = { width: `${screenshot.canvas.width * scaleFactor}px`, height: `${screenshot.canvas.height * scaleFactor}px` },
                                                handleStopPropagation = (e) => {
                                                    e.stopPropagation();
                                                };
                                            return h(
                                                "div",
                                                { class: "editor" },
                                                h("style", { nonce: options.styleNonce, dangerouslySetInnerHTML: editorStyleInnerText }),
                                                h(
                                                    "div",
                                                    { class: "editor__image-container" },
                                                    h(
                                                        "div",
                                                        { class: "editor__canvas-container", ref: measurementRef },
                                                        h("canvas", { ref: backgroundRef, id: "background", style: dimensions }),
                                                        h("canvas", { ref: foregroundRef, id: "foreground", style: dimensions }),
                                                        h(
                                                            "div",
                                                            {
                                                                ref: mouseRef,
                                                                onMouseDown: (e) => {
                                                                    if (!action || !mouseRef.current) return;
                                                                    let boundingRect = mouseRef.current.getBoundingClientRect(),
                                                                        startingPoint = { type: action, x: e.offsetX / scaleFactor, y: e.offsetY / scaleFactor },
                                                                        getDrawCommand = (startingPoint, e) => {
                                                                            let x = (e.clientX - boundingRect.x) / scaleFactor,
                                                                                y = (e.clientY - boundingRect.y) / scaleFactor;
                                                                            return {
                                                                                type: startingPoint.type,
                                                                                x: Math.min(startingPoint.x, x),
                                                                                y: Math.min(startingPoint.y, y),
                                                                                w: Math.abs(x - startingPoint.x),
                                                                                h: Math.abs(y - startingPoint.y),
                                                                            };
                                                                        },
                                                                        handleMouseMove = (e) => {
                                                                            (with2dContext(foregroundRef.current, { alpha: !0 }, (canvas, ctx) => {
                                                                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                                            }),
                                                                                paintForeground(foregroundRef.current, strokeColor, [
                                                                                    ...drawCommands,
                                                                                    getDrawCommand(startingPoint, e),
                                                                                ]));
                                                                        },
                                                                        handleMouseUp = (e) => {
                                                                            let drawCommand = getDrawCommand(startingPoint, e);
                                                                            (drawCommand.w * scaleFactor >= 1 &&
                                                                                drawCommand.h * scaleFactor >= 1 &&
                                                                                setDrawCommands((prev) => [...prev, drawCommand]),
                                                                                DOCUMENT.removeEventListener("mousemove", handleMouseMove),
                                                                                DOCUMENT.removeEventListener("mouseup", handleMouseUp));
                                                                        };
                                                                    (DOCUMENT.addEventListener("mousemove", handleMouseMove), DOCUMENT.addEventListener("mouseup", handleMouseUp));
                                                                },
                                                                style: dimensions,
                                                            },
                                                            drawCommands.map((rect, index) =>
                                                                h(
                                                                    "div",
                                                                    {
                                                                        key: index,
                                                                        class: "editor__rect",
                                                                        style: {
                                                                            top: `${rect.y * scaleFactor}px`,
                                                                            left: `${rect.x * scaleFactor}px`,
                                                                            width: `${rect.w * scaleFactor}px`,
                                                                            height: `${rect.h * scaleFactor}px`,
                                                                        },
                                                                    },
                                                                    h(
                                                                        "button",
                                                                        {
                                                                            "aria-label": options.removeHighlightText,
                                                                            onClick: deleteRect(index),
                                                                            onMouseDown: handleStopPropagation,
                                                                            onMouseUp: handleStopPropagation,
                                                                            type: "button",
                                                                        },
                                                                        h(IconClose, null),
                                                                    ),
                                                                ),
                                                            ),
                                                        ),
                                                    ),
                                                ),
                                                h(Toolbar, { options: options, action: action, setAction: setAction }),
                                            );
                                        };
                                    return function ({ onError }) {
                                        let [screenshot, setScreenshot] = hooks.useState();
                                        return (useTakeScreenshot({
                                            onBeforeScreenshot: hooks.useCallback(() => {
                                                dialogStyle.display = "none";
                                            }, []),
                                            onScreenshot: hooks.useCallback((screenshotVideo, dpi) => {
                                                (with2dContext(DOCUMENT.createElement("canvas"), { alpha: !1 }, (canvas, ctx) => {
                                                    (ctx.scale(dpi, dpi),
                                                        (canvas.width = screenshotVideo.videoWidth),
                                                        (canvas.height = screenshotVideo.videoHeight),
                                                        ctx.drawImage(screenshotVideo, 0, 0, canvas.width, canvas.height),
                                                        setScreenshot({ canvas, dpi }));
                                                }),
                                                    (outputBuffer.width = screenshotVideo.videoWidth),
                                                    (outputBuffer.height = screenshotVideo.videoHeight));
                                            }, []),
                                            onAfterScreenshot: hooks.useCallback(() => {
                                                dialogStyle.display = "block";
                                            }, []),
                                            onError: hooks.useCallback((error) => {
                                                ((dialogStyle.display = "block"), onError(error));
                                            }, []),
                                        }),
                                        screenshot)
                                            ? h(ScreenshotEditor, { screenshot: screenshot })
                                            : h("div", null);
                                    };
                                })({ h: h, hooks: hooks, outputBuffer, dialog, options }),
                                value: async () => {
                                    let blob = await new Promise((resolve) => {
                                        outputBuffer.toBlob(resolve, "image/png");
                                    });
                                    if (blob) return { data: new Uint8Array(await blob.arrayBuffer()), filename: "screenshot.png", contentType: "application/png" };
                                },
                            };
                        },
                    })),
                    (exports.getFeedback = function () {
                        let client = core.getClient();
                        return client?.getIntegrationByName("Feedback");
                    }),
                    (exports.sendFeedback = sendFeedback));
            }