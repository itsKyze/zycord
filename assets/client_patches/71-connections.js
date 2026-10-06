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
        if (!platforms || !enabled) return;
        platforms.map((platform) => {
            if (enabled[platform.type]?.enabled) {
                platform.enabled = true;
            } else if (enabled[platform.type] && enabled[platform.type].enabled === false) {
                platform.enabled = false;
            }
            return platform;
        });
    }, 500);

    // Rebrand domain verification instructions in the UI
    const brandDomainInstructions = () => {
        if (!document.body) return;
        const brandName = (window.GLOBAL_ENV?.INSTANCE_NAME || "zycord").toLowerCase();
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
    };

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
