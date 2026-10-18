8408(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.addGCListener = function (listener) {
                        return (listeners.add(listener), () => listeners.delete(listener));
                    }));
                let perf_hooks_1 = __webpack_require__(2987),
                    listeners = new Set();
                new perf_hooks_1.PerformanceObserver((list) => {
                    let now = Date.now();
                    try {
                        for (let entry of list.getEntries()) {
                            let kind = entry.detail?.kind ?? entry.kind ?? 1;
                            for (let listener of listeners) listener({ timestamp: now, kind });
                        }
                    } catch {
                        for (let listener of listeners) listener({ timestamp: now, kind: 1 });
                    }
                }).observe({ entryTypes: ["gc"] });
            }