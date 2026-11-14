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

    const createSafePurchase = (skuId) => {
        if (!skuId || typeof skuId !== "string") return undefined;
        return {
            skuId,
            id: skuId,
            type: 1,
            purchasedAt: "2026-01-01T00:00:00.000Z",
            expiresAt: null,
            items: [],
            attributes: {},
            purchased: true,
        };
    };

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
                    if (!item || typeof item !== "object" || item.__zycordPatched) continue;

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

                    // Identify genuine Collectibles stores
                    const isCollectiblesStore =
                        typeof item.canUseCollectibles === "function" ||
                        typeof item.isPremiumCollectiblesProduct === "function" ||
                        typeof item.isItemPurchased === "function" ||
                        typeof item.hasItemPurchase === "function" ||
                        typeof item.getItemPurchase === "function" ||
                        (typeof item.getPurchase === "function" && typeof item.getCategoryByStoreListingId === "function");

                    if (!isCollectiblesStore) continue;
                    item.__zycordPatched = true;

                    if (typeof item.getPurchase === "function") {
                        const origGetPurchase = item.getPurchase.bind(item);
                        item.getPurchase = function (skuId) {
                            if (!skuId) return undefined;
                            try {
                                const existing = origGetPurchase(skuId);
                                if (existing != null) return existing;
                            } catch (_) {}
                            return createSafePurchase(skuId);
                        };
                    }

                    if (typeof item.getItemPurchase === "function") {
                        const origGetItemPurchase = item.getItemPurchase.bind(item);
                        item.getItemPurchase = function (skuId) {
                            if (!skuId) return undefined;
                            try {
                                const existing = origGetItemPurchase(skuId);
                                if (existing != null) return existing;
                            } catch (_) {}
                            return createSafePurchase(skuId);
                        };
                    }

                    if (typeof item.isPurchased === "function") {
                        const origIsPurchased = item.isPurchased.bind(item);
                        item.isPurchased = function (skuId) {
                            if (!skuId) return false;
                            try {
                                if (origIsPurchased(skuId)) return true;
                            } catch (_) {}
                            return typeof skuId === "string" && skuId.length > 5;
                        };
                    }

                    if (typeof item.hasPurchase === "function") {
                        const origHasPurchase = item.hasPurchase.bind(item);
                        item.hasPurchase = function (skuId) {
                            if (!skuId) return false;
                            try {
                                if (origHasPurchase(skuId)) return true;
                            } catch (_) {}
                            return typeof skuId === "string" && skuId.length > 5;
                        };
                    }

                    if (typeof item.isItemPurchased === "function") {
                        item.isItemPurchased = function (skuId) {
                            return typeof skuId === "string" && skuId.length > 5;
                        };
                    }

                    if (typeof item.hasItemPurchase === "function") {
                        item.hasItemPurchase = function (skuId) {
                            return typeof skuId === "string" && skuId.length > 5;
                        };
                    }

                    if (typeof item.canUseCollectibles === "function") {
                        item.canUseCollectibles = function () { return true; };
                    }

                    if (typeof item.isPremiumCollectiblesProduct === "function") {
                        item.isPremiumCollectiblesProduct = function () { return false; };
                    }

                    if (item.purchases && item.purchases instanceof Map) {
                        const origMapGet = item.purchases.get.bind(item.purchases);
                        const origMapHas = item.purchases.has.bind(item.purchases);
                        item.purchases.get = function (key) {
                            const existing = origMapGet(key);
                            if (existing != null) return existing;
                            if (typeof key === "string" && key.length > 5) {
                                return createSafePurchase(key);
                            }
                            return undefined;
                        };
                        item.purchases.has = function (key) {
                            if (origMapHas(key)) return true;
                            return typeof key === "string" && key.length > 5;
                        };
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
