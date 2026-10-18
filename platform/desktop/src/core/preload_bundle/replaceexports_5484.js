5484(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.replaceExports = function (exports$1, exportName, wrappedConstructor) {
                        let original = exports$1[exportName];
                        if ("function" == typeof original) {
                            try {
                                exports$1[exportName] = wrappedConstructor;
                            } catch {
                                Object.defineProperty(exports$1, exportName, { value: wrappedConstructor, writable: !0, configurable: !0, enumerable: !0 });
                            }
                            if (exports$1.default === original)
                                try {
                                    exports$1.default = wrappedConstructor;
                                } catch {
                                    Object.defineProperty(exports$1, "default", { value: wrappedConstructor, writable: !0, configurable: !0, enumerable: !0 });
                                }
                        }
                    }));
            }