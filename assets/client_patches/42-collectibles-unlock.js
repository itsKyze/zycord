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

    let categoryStore = null;
    const findProduct = (skuId) => {
        if (!skuId || typeof skuId !== "string") return null;
        try {
            if (categoryStore && typeof categoryStore.getProduct === "function") {
                const p = categoryStore.getProduct(skuId);
                if (p) return p;
            }
        } catch (_) {}
        if (reqInstance?.c) {
            for (const id in reqInstance.c) {
                const mod = reqInstance.c[id]?.exports;
                const s = mod?.default || mod?.Z || mod;
                if (s && typeof s.getProduct === "function" && typeof s.getCategoryByStoreListingId === "function") {
                    categoryStore = s;
                    try {
                        const p = s.getProduct(skuId);
                        if (p) return p;
                    } catch (_) {}
                }
            }
        }
        return null;
    };

    const safePurchaseCache = new Map();
    const createSafePurchase = (skuId) => {
        if (!skuId || typeof skuId !== "string") return undefined;
        let purchase = safePurchaseCache.get(skuId);
        if (!purchase) {
            const prod = findProduct(skuId);
            const items = prod?.items?.length
                ? prod.items
                : [
                      {
                          id: skuId,
                          skuId,
                          type: prod?.type ?? 0,
                          name: prod?.name ?? "",
                          asset: prod?.items?.[0]?.asset ?? "",
                          label: prod?.name ?? "",
                      },
                  ];
            purchase = {
                skuId,
                id: skuId,
                type: prod?.type ?? 0,
                name: prod?.name ?? "",
                summary: prod?.summary ?? "",
                purchasedAt: "2026-01-01T00:00:00.000Z",
                expiresAt: null,
                items,
                attributes: {},
                purchased: true,
            };
            safePurchaseCache.set(skuId, purchase);
        }
        return purchase;
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

                    // Identify genuine Collectibles stores
                    const isCollectiblesStore =
                        typeof item.canUseCollectibles === "function" ||
                        typeof item.isPremiumCollectiblesProduct === "function" ||
                        typeof item.isItemPurchased === "function" ||
                        typeof item.hasItemPurchase === "function" ||
                        typeof item.getItemPurchase === "function" ||
                        (typeof item.getPurchase === "function" && typeof item.getCategoryByStoreListingId === "function");

                    if (!isCollectiblesStore) continue;
                    item.__zycordCollectiblesPatched = true;

                    if (typeof item.canUseCollectibles === "function") {
                        item.canUseCollectibles = function () {
                            return true;
                        };
                    }

                    if (typeof item.isPremiumCollectiblesProduct === "function") {
                        item.isPremiumCollectiblesProduct = function () {
                            return false;
                        };
                    }

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

                    if (typeof item.isItemPurchased === "function") {
                        const origIsItemPurchased = item.isItemPurchased.bind(item);
                        item.isItemPurchased = function (skuId) {
                            if (!skuId) return false;
                            try {
                                if (origIsItemPurchased(skuId)) return true;
                            } catch (_) {}
                            return Boolean(safePurchaseCache.has(skuId) || findProduct(skuId));
                        };
                    }

                    if (typeof item.hasItemPurchase === "function") {
                        const origHasItemPurchase = item.hasItemPurchase.bind(item);
                        item.hasItemPurchase = function (skuId) {
                            if (!skuId) return false;
                            try {
                                if (origHasItemPurchase(skuId)) return true;
                            } catch (_) {}
                            return Boolean(safePurchaseCache.has(skuId) || findProduct(skuId));
                        };
                    }

                    if (item.purchases && item.purchases instanceof Map && !item.purchases.__zycordPatched) {
                        item.purchases.__zycordPatched = true;
                        const origMapGet = item.purchases.get.bind(item.purchases);
                        const origMapHas = item.purchases.has.bind(item.purchases);
                        item.purchases.get = function (key) {
                            const existing = origMapGet(key);
                            if (existing != null) return existing;
                            if (typeof key === "string" && key.length > 5 && findProduct(key)) {
                                return createSafePurchase(key);
                            }
                            return undefined;
                        };
                        item.purchases.has = function (key) {
                            if (origMapHas(key)) return true;
                            return Boolean(typeof key === "string" && key.length > 5 && findProduct(key));
                        };
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
