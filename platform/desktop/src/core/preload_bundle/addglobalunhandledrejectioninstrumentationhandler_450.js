450(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712),
                    handlers = __webpack_require__(7130),
                    _oldOnUnhandledRejectionHandler = null;
                function instrumentUnhandledRejection() {
                    ((_oldOnUnhandledRejectionHandler = worldwide.GLOBAL_OBJ.onunhandledrejection),
                        (worldwide.GLOBAL_OBJ.onunhandledrejection = function (e) {
                            return (handlers.triggerHandlers("unhandledrejection", e), !_oldOnUnhandledRejectionHandler || _oldOnUnhandledRejectionHandler.apply(this, arguments));
                        }),
                        (worldwide.GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0));
                }
                exports.addGlobalUnhandledRejectionInstrumentationHandler = function (handler) {
                    let type = "unhandledrejection";
                    (handlers.addHandler(type, handler), handlers.maybeInstrument(type, instrumentUnhandledRejection));
                };
            }