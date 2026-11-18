7572(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    _exports = __webpack_require__(6082),
                    spanUtils = __webpack_require__(470),
                    spanstatus = __webpack_require__(2232);
                exports.captureError = function (error, errorType, extraData) {
                    try {
                        if (!currentScopes.getClient()) return;
                        let activeSpan = spanUtils.getActiveSpan();
                        (activeSpan?.isRecording() && activeSpan.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                            _exports.captureException(error, {
                                mechanism: { type: "auto.ai.mcp_server", handled: !1, data: { error_type: errorType || "handler_execution", ...extraData } },
                            }));
                    } catch {}
                };
            }