3840(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712),
                    handlers = __webpack_require__(7130),
                    _oldOnErrorHandler = null;
                function instrumentError() {
                    ((_oldOnErrorHandler = worldwide.GLOBAL_OBJ.onerror),
                        (worldwide.GLOBAL_OBJ.onerror = function (msg, url, line, column, error) {
                            return (handlers.triggerHandlers("error", { column, error, line, msg, url }), !!_oldOnErrorHandler && _oldOnErrorHandler.apply(this, arguments));
                        }),
                        (worldwide.GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = !0));
                }
                exports.addGlobalErrorInstrumentationHandler = function (handler) {
                    let type = "error";
                    (handlers.addHandler(type, handler), handlers.maybeInstrument(type, instrumentError));
                };
            }