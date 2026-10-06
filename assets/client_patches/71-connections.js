(() => {
    const knownId = "573648";
    const isPlatforms = (value) => typeof value?.map === "function" && typeof value?.isSupported === "function" && typeof value?.getByUrl === "function";
    let require;
    (window.webpackChunkdiscord_app ??= []).push([[Symbol("zycord-connections")], {}, (r) => (require = r)]);

    const findPlatforms = () => {
        if (!require?.m) return undefined;
        const ids = require.m[knownId] ? [knownId] : Object.keys(require.m).filter((id) => String(require.m[id]).includes('name:"Crunchyroll"'));
        for (const id of ids) {
            const found = Object.values(require(id) ?? {}).find(isPlatforms);
            if (found) return found;
        }
        return undefined;
    };

    const config = fetch(`${window.GLOBAL_ENV?.API_ENDPOINT ?? "/api"}/v${window.GLOBAL_ENV?.API_VERSION ?? 9}/connections`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

    let attempts = 0;
    const timer = setInterval(async () => {
        const platforms = findPlatforms();
        if (!platforms && ++attempts < 120) return;
        clearInterval(timer);
        const enabled = await config;
        if (!platforms) return;
        platforms.map((platform) => {
            if (enabled && enabled[platform.type]?.enabled) {
                platform.enabled = true;
            } else if (enabled && enabled[platform.type] && enabled[platform.type].enabled === false) {
                platform.enabled = false;
            } else {
                platform.enabled = true;
            }
            return platform;
        });
    }, 500);

    const getBrandName = () => (window.GLOBAL_ENV?.INSTANCE_NAME || "zycord").toLowerCase();

    // Intercept HTMLInputElement.value setter so React never sets _discord
    try {
        const origValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        if (origValueDescriptor && origValueDescriptor.set) {
            const origSet = origValueDescriptor.set;
            Object.defineProperty(HTMLInputElement.prototype, "value", {
                ...origValueDescriptor,
                set(val) {
                    const brand = getBrandName();
                    if (typeof val === "string" && (val.includes("_discord") || val.includes("/.well-known/discord") || val.includes("discord="))) {
                        val = val
                            .replace(/_discord/gi, `_${brand}`)
                            .replace(/\/\.well-known\/discord/gi, `/.well-known/${brand}`)
                            .replace(/discord=/gi, `${brand}=`);
                    }
                    return origSet.call(this, val);
                },
            });
        }
    } catch (_) {}

    // Intercept clipboard copy so copying DNS records copies _zycord
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            const origWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
            navigator.clipboard.writeText = function (text) {
                const brand = getBrandName();
                if (typeof text === "string" && (text.includes("_discord") || text.includes("/.well-known/discord") || text.includes("discord="))) {
                    text = text
                        .replace(/_discord/gi, `_${brand}`)
                        .replace(/\/\.well-known\/discord/gi, `/.well-known/${brand}`)
                        .replace(/discord=/gi, `${brand}=`);
                }
                return origWriteText(text);
            };
        }
    } catch (_) {}

    // Rebrand domain verification instructions in the UI (text nodes + inputs + anchor links)
    const brandDomainInstructions = () => {
        if (!document.body) return;
        const brandName = getBrandName();

        // Walk text nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue && (node.nodeValue.includes("_discord") || node.nodeValue.includes("/.well-known/discord") || node.nodeValue.includes("discord="))) {
                node.nodeValue = node.nodeValue
                    .replace(/_discord/gi, `_${brandName}`)
                    .replace(/\/\.well-known\/discord/gi, `/.well-known/${brandName}`)
                    .replace(/discord=/gi, `${brandName}=`);
            }
        }

        // Walk input and textarea elements
        const inputs = document.querySelectorAll("input, textarea");
        for (const input of inputs) {
            if (input.value && (input.value.includes("_discord") || input.value.includes("/.well-known/discord") || input.value.includes("discord="))) {
                const oldVal = input.value;
                input.value = input.value
                    .replace(/_discord/gi, `_${brandName}`)
                    .replace(/\/\.well-known\/discord/gi, `/.well-known/${brandName}`)
                    .replace(/discord=/gi, `${brandName}=`);
                if (input.value !== oldVal) {
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
            if (input.placeholder && (input.placeholder.includes("_discord") || input.placeholder.includes("/.well-known/discord"))) {
                input.placeholder = input.placeholder
                    .replace(/_discord/gi, `_${brandName}`)
                    .replace(/\/\.well-known\/discord/gi, `/.well-known/${brandName}`);
            }
        }

        // Fix any connection links that have numeric snowflake hrefs (e.g. https://1556977716765426788/)
        document.querySelectorAll("a[href]").forEach((a) => {
            const href = a.getAttribute("href") || "";
            if (/^https?:\/\/\d{15,22}\/?$/i.test(href)) {
                const text = (a.textContent || "").trim().replace(/[↗\s]/g, "");
                if (text && text.includes(".")) {
                    a.setAttribute("href", `https://${text}`);
                    a.setAttribute("target", "_blank");
                    a.setAttribute("rel", "noopener noreferrer");
                }
            }
        });
    };

    // Global capture listener to ensure clicking domain connections opens directly in browser
    document.addEventListener(
        "click",
        (e) => {
            const target = e.target;
            if (!target) return;
            const link = target.closest("a, [role='link'], [role='button']");
            if (!link) return;

            const href = link.getAttribute("href") || link.href || "";
            const text = (link.textContent || "").trim().replace(/[↗\s]/g, "");

            // 1. If href is a numeric snowflake like https://1556977716765426788/
            if (/^https?:\/\/\d{15,22}\/?$/i.test(href)) {
                e.preventDefault();
                e.stopPropagation();
                const domain = (text && text.includes(".")) ? text : null;
                if (domain) {
                    window.open(`https://${domain}`, "_blank", "noopener,noreferrer");
                }
                return;
            }

            // 2. If it is a domain connection badge on a profile
            const isConnectionElement =
                link.closest("[class*='connectedAccount']") ||
                link.closest("[class*='connection_']") ||
                (link.classList && Array.from(link.classList).some((c) => c.includes("connectedAccount") || c.includes("connection")));

            if (isConnectionElement && text && text.includes(".") && !text.includes(" ")) {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://${text}`, "_blank", "noopener,noreferrer");
            }
        },
        true
    );

    if (typeof MutationObserver !== "undefined") {
        const observer = new MutationObserver(() => brandDomainInstructions());
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            });
        }
    }
})();
