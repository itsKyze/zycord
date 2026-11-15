(() => {
    const KYZE_USER_ID = "1571030388745203811";
    const KYZE_TIMESTAMP = 1273752000000; // May 13, 2010 12:00:00 UTC

    const patchSnowflake = (req) => {
        try {
            if (!req?.c) return;
            for (const id in req.c) {
                const mod = req.c[id]?.exports;
                if (!mod) continue;
                const targets = [mod, mod.default, mod.A, mod.Z].filter(Boolean);
                for (const target of targets) {
                    if (!target || typeof target !== "object" || target.__kyze_ts_patched) continue;
                    if (typeof target.extractTimestamp === "function") {
                        target.__kyze_ts_patched = true;
                        const origExtract = target.extractTimestamp.bind(target);
                        target.extractTimestamp = function (snowflake) {
                            if (String(snowflake) === KYZE_USER_ID) {
                                return KYZE_TIMESTAMP;
                            }
                            return origExtract(snowflake);
                        };
                        if (typeof target.age === "function") {
                            const origAge = target.age.bind(target);
                            target.age = function (snowflake) {
                                if (String(snowflake) === KYZE_USER_ID) {
                                    return Date.now() - KYZE_TIMESTAMP;
                                }
                                return origAge(snowflake);
                            };
                        }
                    }
                }
            }
        } catch (_) {}
    };

    let reqInstance;
    let ticks = 0;
    (window.webpackChunkdiscord_app = window.webpackChunkdiscord_app || []).push([
        [Symbol("zycord-snowflake-timestamp")],
        {},
        (req) => {
            reqInstance = req;
            patchSnowflake(req);
            const interval = setInterval(() => {
                patchSnowflake(reqInstance);
                if (++ticks >= 6) clearInterval(interval);
            }, 1000);
        },
    ]);
})();
