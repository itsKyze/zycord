2801(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    globalError = __webpack_require__(3840),
                    globalUnhandledRejection = __webpack_require__(450),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470),
                    spanstatus = __webpack_require__(2232),
                    errorsInstrumented = !1;
                exports.registerSpanErrorInstrumentation = function () {
                    errorsInstrumented ||
                        ((errorCallback.tag = "sentry_tracingErrorCallback"),
                        (errorsInstrumented = !0),
                        globalError.addGlobalErrorInstrumentationHandler(errorCallback),
                        globalUnhandledRejection.addGlobalUnhandledRejectionInstrumentationHandler(errorCallback));
                    function errorCallback() {
                        let activeSpan = spanUtils.getActiveSpan(),
                            rootSpan = activeSpan && spanUtils.getRootSpan(activeSpan);
                        if (rootSpan) {
                            let message = "internal_error";
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Tracing] Root span: ${message} -> Global error occurred`),
                                rootSpan.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message }));
                        }
                    }
                };
            }