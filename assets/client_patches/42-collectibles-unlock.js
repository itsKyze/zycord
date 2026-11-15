(() => {
    // Inject style to hide lock badges across all collectible grids and modals
    const style = document.createElement("style");
    style.id = "zycord-unlock-collectibles-style";
    style.textContent = `
        [class*="lockBadge"], [class*="lockIcon"], [class*="badge_"] svg[class*="lock"], [aria-label*="Locked" i] svg {
            display: none !important;
        }
    `;
    if (document.head) document.head.appendChild(style);
    else document.addEventListener("DOMContentLoaded", () => document.head?.appendChild(style));

    const patchStores = (req) => {
        try {
            if (/^\/(login|register)\b/.test(location.pathname)) return;
            if (!req?.c) return;
            for (const id in req.c) {
                const mod = req.c[id]?.exports;
                if (!mod) continue;
                let targets = [];
                try {
                    targets = [mod, mod.default, mod.A, mod.Z].filter(Boolean);
                } catch (_) {
                    targets = [mod];
                }
                for (const item of targets) {
                    if (!item || typeof item !== "object" || item.__zycordCollectiblesPatched) continue;

                    // DO NOT touch entitlement, subscription, or boost stores as that crashes profile rendering!
                    if (
                        typeof item.getEntitlementsForUser === "function" ||
                        typeof item.getApplicationEntitlements === "function" ||
                        typeof item.getSubscription === "function" ||
                        typeof item.getActiveGuildSubscriptions === "function" ||
                        typeof item.getUserSubscriptions === "function" ||
                        typeof item.getGuildBoosts === "function" ||
                        typeof item.getPlanId === "function"
                    ) {
                        continue;
                    }

                    let patched = false;
                    if (typeof item.canUseCollectibles === "function") {
                        item.canUseCollectibles = function () {
                            return true;
                        };
                        patched = true;
                    }

                    if (typeof item.isPremiumCollectiblesProduct === "function") {
                        item.isPremiumCollectiblesProduct = function () {
                            return false;
                        };
                        patched = true;
                    }

                    if (patched) {
                        item.__zycordCollectiblesPatched = true;
                    }
                }
            }
        } catch (_) {}
    };

    let reqInstance;
    let ticks = 0;
    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-collectibles-unlock")],
        {},
        (req) => {
            reqInstance = req;
            patchStores(req);
            const interval = setInterval(() => {
                patchStores(reqInstance);
                if (++ticks >= 4) clearInterval(interval);
            }, 1000);
        },
    ]);
})();
