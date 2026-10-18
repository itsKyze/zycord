3845(__unused_rspack_module, exports, __webpack_require__) {
                let originalFunctionToString;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    integration = __webpack_require__(5579),
                    object = __webpack_require__(4204),
                    SETUP_CLIENTS = new WeakMap();
                exports.functionToStringIntegration = integration.defineIntegration(() => ({
                    name: "FunctionToString",
                    setupOnce() {
                        originalFunctionToString = Function.prototype.toString;
                        try {
                            Function.prototype.toString = function (...args) {
                                let originalFunction = object.getOriginalFunction(this),
                                    context = SETUP_CLIENTS.has(currentScopes.getClient()) && void 0 !== originalFunction ? originalFunction : this;
                                return originalFunctionToString.apply(context, args);
                            };
                        } catch {}
                    },
                    setup(client) {
                        SETUP_CLIENTS.set(client, !0);
                    },
                }));
            }