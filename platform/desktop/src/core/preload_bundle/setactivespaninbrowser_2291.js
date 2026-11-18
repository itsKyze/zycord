2291(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                exports.setActiveSpanInBrowser = function (span) {
                    let maybePreviousActiveSpan = core.getActiveSpan();
                    if (maybePreviousActiveSpan === span) return;
                    let scope = core.getCurrentScope();
                    ((span.end = new Proxy(span.end, {
                        apply: (target, thisArg, args) => (core._INTERNAL_setSpanForScope(scope, maybePreviousActiveSpan), Reflect.apply(target, thisArg, args)),
                    })),
                        core._INTERNAL_setSpanForScope(scope, span));
                };
            }