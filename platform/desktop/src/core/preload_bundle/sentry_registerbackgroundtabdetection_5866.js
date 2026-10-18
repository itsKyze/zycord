5866(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                exports.registerBackgroundTabDetection = function () {
                    helpers.WINDOW.document
                        ? helpers.WINDOW.document.addEventListener("visibilitychange", () => {
                              let activeSpan = core.getActiveSpan();
                              if (!activeSpan) return;
                              let rootSpan = core.getRootSpan(activeSpan);
                              if (helpers.WINDOW.document.hidden && rootSpan) {
                                  let cancelledStatus = "cancelled",
                                      { op, status } = core.spanToJSON(rootSpan);
                                  (debugBuild.DEBUG_BUILD && core.debug.log(`[Tracing] Transaction: ${cancelledStatus} -> since tab moved to the background, op: ${op}`),
                                      status || rootSpan.setStatus({ code: core.SPAN_STATUS_ERROR, message: cancelledStatus }),
                                      rootSpan.setAttribute("sentry.cancellation_reason", "document.hidden"),
                                      rootSpan.end());
                              }
                          })
                        : debugBuild.DEBUG_BUILD && core.debug.warn("[Tracing] Could not set up background tab detection due to lack of global document");
                };
            }