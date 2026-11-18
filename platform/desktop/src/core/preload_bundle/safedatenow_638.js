638(__unused_rspack_module, exports, __webpack_require__) {
                let RESOLVED_RUNNER;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712);
                function withRandomSafeContext(cb) {
                    if (void 0 !== RESOLVED_RUNNER) return RESOLVED_RUNNER ? RESOLVED_RUNNER(cb) : cb();
                    let sym = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"),
                        globalWithSymbol = worldwide.GLOBAL_OBJ;
                    return sym in globalWithSymbol && "function" == typeof globalWithSymbol[sym] ? (RESOLVED_RUNNER = globalWithSymbol[sym])(cb) : ((RESOLVED_RUNNER = null), cb());
                }
                ((exports.safeDateNow = function () {
                    return withRandomSafeContext(() => Date.now());
                }),
                    (exports.safeMathRandom = function () {
                        return withRandomSafeContext(() => Math.random());
                    }),
                    (exports.withRandomSafeContext = withRandomSafeContext));
            }