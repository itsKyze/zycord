9863(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.runOnce = (cb) => {
                        let called = !1;
                        return () => {
                            called || (cb(), (called = !0));
                        };
                    }));
            }