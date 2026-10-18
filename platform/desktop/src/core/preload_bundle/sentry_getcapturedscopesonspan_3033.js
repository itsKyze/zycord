3033(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let object = __webpack_require__(4204),
                    weakRef = __webpack_require__(2158),
                    SCOPE_ON_START_SPAN_FIELD = "_sentryScope",
                    ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
                ((exports.getCapturedScopesOnSpan = function (span) {
                    return { scope: span[SCOPE_ON_START_SPAN_FIELD], isolationScope: weakRef.derefWeakRef(span[ISOLATION_SCOPE_ON_START_SPAN_FIELD]) };
                }),
                    (exports.setCapturedScopesOnSpan = function (span, scope, isolationScope) {
                        span &&
                            (object.addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, weakRef.makeWeakRef(isolationScope)),
                            object.addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope));
                    }));
            }