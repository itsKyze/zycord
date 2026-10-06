(() => {
    const patchStores = (req) => {
        try {
            if (!req?.c) return;
            for (const id in req.c) {
                const mod = req.c[id]?.exports;
                if (!mod) continue;
                const targets = [mod, mod.default, mod.A, mod.Z].filter(Boolean);
                for (const item of targets) {
                    if (item && typeof item === "object" && item.purchases instanceof Map && typeof item.getPurchase === "function") {
                        if (!item.__zycordPatched) {
                            item.__zycordPatched = true;
                            const origGetPurchase = item.getPurchase.bind(item);
                            item.getPurchase = function (skuId) {
                                if (!skuId) return undefined;
                                const existing = origGetPurchase(skuId);
                                if (existing != null) return existing;
                                return { skuId, id: skuId, purchasedAt: new Date().toISOString() };
                            };
                        }
                    }
                }
            }
        } catch (_) {}
    };

    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-collectibles-unlock")],
        {},
        (req) => {
            patchStores(req);
            setTimeout(() => patchStores(req), 500);
            setTimeout(() => patchStores(req), 1500);
            setTimeout(() => patchStores(req), 4000);
        },
    ]);
})();
