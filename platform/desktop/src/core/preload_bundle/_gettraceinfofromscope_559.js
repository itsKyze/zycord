559(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    dynamicSamplingContext = __webpack_require__(241),
                    spanUtils = __webpack_require__(470);
                exports._getTraceInfoFromScope = function (client, scope) {
                    return scope
                        ? currentScopes.withScope(scope, () => {
                              let span = spanUtils.getActiveSpan(),
                                  traceContext = span ? spanUtils.spanToTraceContext(span) : currentScopes.getTraceContextFromScope(scope);
                              return [
                                  span ? dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) : dynamicSamplingContext.getDynamicSamplingContextFromScope(client, scope),
                                  traceContext,
                              ];
                          })
                        : [void 0, void 0];
                };
            }