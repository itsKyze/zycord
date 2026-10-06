(() => {
    const patchAnimations = (req) => {
        try {
            if (!req?.c) return;
            for (const id in req.c) {
                const mod = req.c[id]?.exports;
                if (!mod) continue;
                const targets = [mod, mod.default, mod.A, mod.Z].filter(Boolean);
                for (const item of targets) {
                        if (item && typeof item === "object") {
                            // Safely enable animations without breaking React hooks
                            if (typeof item.isAnimationEnabled === "function") item.isAnimationEnabled = () => true;
                            if (typeof item.rawPrefersReducedMotion === "function") item.rawPrefersReducedMotion = () => "no-preference";
                        }
                }
            }
        } catch (_) {}
    };

    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-always-animate")],
        {},
        (req) => {
            patchAnimations(req);
            setTimeout(() => patchAnimations(req), 500);
            setTimeout(() => patchAnimations(req), 1500);
            setTimeout(() => patchAnimations(req), 3500);
        },
    ]);
})();
