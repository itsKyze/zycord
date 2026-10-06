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
            if (!req?.c) return;
            for (const id in req.c) {
                const mod = req.c[id]?.exports;
                if (!mod) continue;
                const targets = [mod, mod.default, mod.A, mod.Z].filter(Boolean);
                for (const item of targets) {
                    if (item && typeof item === "object") {
                        const hasPurchaseMethods =
                            typeof item.isPurchased === "function" ||
                            typeof item.hasPurchase === "function" ||
                            typeof item.getPurchase === "function" ||
                            typeof item.isItemPurchased === "function" ||
                            typeof item.hasItemPurchase === "function" ||
                            typeof item.getItemPurchase === "function";

                        if (hasPurchaseMethods && !item.__zycordPatched) {
                            item.__zycordPatched = true;

                            if (typeof item.getPurchase === "function") {
                                const origGetPurchase = item.getPurchase.bind(item);
                                item.getPurchase = function (skuId) {
                                    if (!skuId) return undefined;
                                    const existing = origGetPurchase(skuId);
                                    if (existing != null) return existing;
                                    return { skuId, id: skuId, purchasedAt: new Date().toISOString() };
                                };
                            }

                            if (typeof item.getItemPurchase === "function") {
                                const origGetItemPurchase = item.getItemPurchase.bind(item);
                                item.getItemPurchase = function (skuId) {
                                    if (!skuId) return undefined;
                                    const existing = origGetItemPurchase(skuId);
                                    if (existing != null) return existing;
                                    return { skuId, id: skuId, purchasedAt: new Date().toISOString() };
                                };
                            }

                            if (typeof item.isPurchased === "function") {
                                item.isPurchased = function () { return true; };
                            }
                            if (typeof item.hasPurchase === "function") {
                                item.hasPurchase = function () { return true; };
                            }
                            if (typeof item.isItemPurchased === "function") {
                                item.isItemPurchased = function () { return true; };
                            }
                            if (typeof item.hasItemPurchase === "function") {
                                item.hasItemPurchase = function () { return true; };
                            }
                            if (typeof item.canUseCollectibles === "function") {
                                item.canUseCollectibles = function () { return true; };
                            }
                            if (typeof item.isPremiumCollectiblesProduct === "function") {
                                item.isPremiumCollectiblesProduct = function () { return false; };
                            }

                            // If purchases Map exists on the store, intercept has and get so all items appear owned in inventory
                            if (item.purchases && item.purchases instanceof Map) {
                                const origMapGet = item.purchases.get.bind(item.purchases);
                                item.purchases.has = function () { return true; };
                                item.purchases.get = function (key) {
                                    const existing = origMapGet(key);
                                    if (existing != null) return existing;
                                    return { skuId: key, id: key, purchasedAt: new Date().toISOString() };
                                };
                            }
                        }
                    }
                }
            }
        } catch (_) {}
    };

    let reqInstance;
    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-collectibles-unlock")],
        {},
        (req) => {
            reqInstance = req;
            patchStores(req);
            setInterval(() => patchStores(reqInstance), 1000);
        },
    ]);
})();
