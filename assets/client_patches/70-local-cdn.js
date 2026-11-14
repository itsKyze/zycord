(() => {
    const cdnHost = window.GLOBAL_ENV?.CDN_HOST || (location.host.startsWith("app.") ? location.host.replace(/^app\./, "cdn.") : location.host);
    const cdnOrigin = `${location.protocol}//${cdnHost}`;
    const cdnEndpoint = `//${cdnHost}`;

    if (window.GLOBAL_ENV) {
        Object.assign(window.GLOBAL_ENV, {
            CDN_HOST: cdnHost,
            MEDIA_PROXY_ENDPOINT: cdnEndpoint,
            IMAGE_PROXY_ENDPOINTS: cdnEndpoint,
            ASSET_ENDPOINT: `//${location.host}`,
        });
    }
    const cdn = () => cdnOrigin;
    const mediaPaths = /^\/(?:cdn|attachments|avatars|icons|banners|emojis|stickers|clan-badges|badge-icons|avatar-decoration-presets|app-icons|app-assets|guild-events|role-icons|splashes|discovery-splashes|user-profile-effects|content-assets|krisp_browser_models|media|soundboard-sounds)(?:\/|$)/;
    const localHost = (host) => /^(?:localhost|[\w.-]+\.localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])$/i.test(host);
    const instanceUrl = (value) => {
        if (typeof value !== "string" || !/^(?:https?:)?\/\//i.test(value)) return value;
        try {
            const url = new URL(value, location.origin);
            if (url.username || url.password) return value;
            if (mediaPaths.test(url.pathname)) {
                if (url.host === location.host || url.host === cdnHost || localHost(url.hostname)) {
                    return `${cdnOrigin}${url.pathname}${url.search}${url.hash}`;
                }
            } else if (url.host === cdnHost) {
                // Non-media (API, assets, pages) mistakenly addressed to cdnHost must stay on app origin
                return `${location.origin}${url.pathname}${url.search}${url.hash}`;
            }
        } catch {}
        return value;
    };
    const rules = [
        [/^https:\/\/cdn\.discordapp\.com\/assets\/content\//, () => `${cdn()}/content-assets/`],
        [/^https:\/\/cdn\.discordapp\.com\/assets\/profile_effects\//, () => `${cdn()}/assets/profile_effects/`],
        [/^https:\/\/cdn\.discordapp\.com\/assets\/collectibles\//, () => `${cdn()}/assets/collectibles/`],
        [/^https:\/\/cdn\.discordapp\.com\/assets\/krisp_browser_models\//, () => `${cdn()}/krisp_browser_models/`],
        [/^https:\/\/cdn\.discordapp\.com\/(media\/v1\/collectibles-shop|badge-icons|avatar-decoration-presets|app-icons|bad-domains)\//, (match, prefix) => `${cdn()}/${prefix}/`],
    ];
    const downgraded = /^(?:http:)?\/\/((?:[\w-]+\.)*(?:discord\.com|discordapp\.com|discordapp\.net|discord\.gg|discord\.new|discord\.gift|discord\.media|dis\.gd|discordstatus\.com))(?=[/:?#]|$)/i;
    const rootDomain = location.hostname.split(".").slice(-2).join(".") || "zyron.site";
    const linkRules = [
        [/^https?:\/\/(?:www\.)?(?:discord|zycord)\.new\/([\w-]+)\/?$/i, (m, code) => `${location.origin}/template/${code}`],
        [/^https?:\/\/(?:www\.)?discord\.gg\/([\w-]+)\/?$/i, (m, code) => `${location.origin}/invite/${code}`],
        [/^https?:\/\/(?:www\.)?discord\.gift\/([\w-]+)\/?$/i, (m, code) => `${location.origin}/gift/${code}`],
        [/^https?:\/\/support\.discord\.com(?:\b.*)?$/i, () => `${location.origin}/support`],
        [/^https?:\/\/(?:status\.discord\.com|discordstatus\.com)(?:\b.*)?$/i, () => `${location.origin}/status`],
        [/^https?:\/\/(?:(?:www|ptb|canary)\.)?discord(?:app)?\.com\/developers\/docs(?:\b.*)?$/i, (m) => `https://docs.${rootDomain}${m.replace(/^https?:\/\/[^/]+\/developers\/docs/, "") || "/"}`],
        [/^https?:\/\/(?:(?:www|ptb|canary)\.)?discord(?:app)?\.com\/developers(?:\b.*)?$/i, (m) => `https://developers.${rootDomain}${m.replace(/^https?:\/\/[^/]+\/developers/, "") || "/"}`],
        [
            /^https?:\/\/(?:(?:www|ptb|canary)\.)?discord(?:app)?\.com\/(terms|privacy|guidelines|safety|nitro|download|branding|company|careers|blog|community|quests|ads\/quests|acknowledgements|licenses|company-information|status|support|template|invite|gifts?)(?=[/?#]|$)(.*)$/i,
            (m, route, rest) => `${location.origin}/${route}${rest || ""}`,
        ],
    ];
    const rewrite = (value) => {
        if (typeof value !== "string") return value;
        const local = instanceUrl(value);
        return rules.reduce((acc, [pattern, to]) => acc.replace(pattern, to), local);
    };
    const link = (value) => {
        if (typeof value !== "string") return value;
        const upgraded = rewrite(value.replace(downgraded, "https://$1"));
        return linkRules.reduce((acc, [pattern, to]) => acc.replace(pattern, to), upgraded);
    };
    const rewriteCss = (value) =>
        typeof value === "string" ? value.replace(/url\((["']?)((?:https?:)?\/\/[^"')]+)\1\)/g, (all, quote, url) => `url(${quote}${rewrite(url)}${quote})`) : value;

    const fetch = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === "string") return fetch.call(this, rewrite(input), init);
        if (input instanceof URL) return fetch.call(this, rewrite(input.href), init);
        if (input instanceof Request && rewrite(input.url) !== input.url) return fetch.call(this, new Request(rewrite(input.url), input), init);
        return fetch.call(this, input, init);
    };

    const openWindow = window.open;
    window.open = function (url, ...rest) {
        return openWindow.call(this, url == null ? url : link(String(url)), ...rest);
    };

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        return open.call(this, method, rewrite(String(url)), ...rest);
    };

    const setAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (name === "href" && this instanceof HTMLAnchorElement) return setAttribute.call(this, name, link(value));
        if (name === "src" || name === "href" || name === "poster" || name === "xlink:href") return setAttribute.call(this, name, rewrite(value));
        if (name === "style") return setAttribute.call(this, name, rewriteCss(value));
        return setAttribute.call(this, name, value);
    };

    const wrap = (proto, prop, transform) => {
        const descriptor = proto && Object.getOwnPropertyDescriptor(proto, prop);
        if (!descriptor?.set) return;
        Object.defineProperty(proto, prop, {
            ...descriptor,
            set(value) {
                descriptor.set.call(this, transform(value));
            },
        });
    };
    wrap(HTMLAnchorElement.prototype, "href", link);
    wrap(HTMLImageElement.prototype, "src", rewrite);
    wrap(HTMLMediaElement.prototype, "src", rewrite);
    wrap(HTMLSourceElement.prototype, "src", rewrite);
    wrap(HTMLVideoElement.prototype, "poster", rewrite);
    for (const prop of ["background", "backgroundImage", "maskImage", "webkitMaskImage", "content"]) wrap(CSSStyleDeclaration.prototype, prop, rewriteCss);
    const setProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
        return setProperty.call(this, name, rewriteCss(value), priority);
    };

    // Cross-subdomain SSO token sync across *.zyron.site
    const syncTokenCookie = () => {
        try {
            const rawToken = localStorage.getItem("token");
            if (rawToken) {
                const token = JSON.parse(rawToken);
                if (token && typeof token === "string") {
                    const cookieDomain = rootDomain ? `.${rootDomain}` : "";
                    const cookieStr = `zycord_token=${encodeURIComponent(token)}; domain=${cookieDomain}; path=/; max-age=31536000; SameSite=Lax; Secure`;
                    document.cookie = cookieStr;
                }
            }
        } catch {}
    };
    syncTokenCookie();
    window.addEventListener("storage", syncTokenCookie);
    setInterval(syncTokenCookie, 5000);

    // If redirected to login with redirect_to and already logged in, bounce back
    try {
        const urlParams = new URLSearchParams(location.search);
        const redirectTo = urlParams.get("redirect_to");
        if (redirectTo && location.pathname.startsWith("/login")) {
            const raw = localStorage.getItem("token");
            if (raw && JSON.parse(raw)) {
                syncTokenCookie();
                const target = decodeURIComponent(redirectTo);
                if (/^https?:\/\/[a-z0-9.-]+\.zyron\.site/i.test(target) || target.startsWith("/")) {
                    location.replace(target);
                }
            }
        }
    } catch {}
})();
