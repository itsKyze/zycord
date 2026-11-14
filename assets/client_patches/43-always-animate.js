(() => {
    const patchAnimations = (req) => {
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
                        if (item && typeof item === "object") {
                            // Safely enable animations without breaking React hooks
                            if (typeof item.isAnimationEnabled === "function") item.isAnimationEnabled = () => true;
                            if (typeof item.rawPrefersReducedMotion === "function") item.rawPrefersReducedMotion = () => "no-preference";
                        }
                }
            }
        } catch (_) {}
    };

    let reqInstance;
    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-always-animate")],
        {},
        (req) => {
            reqInstance = req;
            patchAnimations(req);
            setInterval(() => patchAnimations(reqInstance), 1000);
        },
    ]);
})();
