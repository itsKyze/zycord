8740(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let object = __webpack_require__(4204),
                    SCOPE_SPAN_FIELD = "_sentrySpan";
                ((exports._getSpanForScope = function (scope) {
                    return scope[SCOPE_SPAN_FIELD];
                }),
                    (exports._setSpanForScope = function (scope, span) {
                        span ? object.addNonEnumerableProperty(scope, SCOPE_SPAN_FIELD, span) : delete scope[SCOPE_SPAN_FIELD];
                    }));
            }