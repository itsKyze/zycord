655(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.observe = (type, callback, opts = {}) => {
                        try {
                            if (PerformanceObserver.supportedEntryTypes.includes(type)) {
                                let po = new PerformanceObserver((list) => {
                                    Promise.resolve().then(() => {
                                        callback(list.getEntries());
                                    });
                                });
                                return (po.observe({ type, buffered: !0, ...opts }), po);
                            }
                        } catch {}
                    }));
            }