6306(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470),
                    SPAN_FLAG_ATTRIBUTE_PREFIX = "flag.evaluation.";
                function _INTERNAL_insertToFlagBuffer(flags, name, value, maxSize) {
                    if ("boolean" != typeof value) return;
                    if (flags.length > maxSize) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.error(`[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${maxSize}`);
                        return;
                    }
                    let index = flags.findIndex((f) => f.flag === name);
                    (-1 !== index && flags.splice(index, 1), flags.length === maxSize && flags.shift(), flags.push({ flag: name, result: value }));
                }
                ((exports._INTERNAL_FLAG_BUFFER_SIZE = 100),
                    (exports._INTERNAL_MAX_FLAGS_PER_SPAN = 10),
                    (exports._INTERNAL_addFeatureFlagToActiveSpan = function (name, value, maxFlagsPerSpan = 10) {
                        if ("boolean" != typeof value) return;
                        let span = spanUtils.getActiveSpan();
                        if (!span) return;
                        let attributes = spanUtils.spanToJSON(span).data;
                        `${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}` in attributes
                            ? span.setAttribute(`${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}`, value)
                            : Object.keys(attributes).filter((key) => key.startsWith(SPAN_FLAG_ATTRIBUTE_PREFIX)).length < maxFlagsPerSpan &&
                              span.setAttribute(`${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}`, value);
                    }),
                    (exports._INTERNAL_copyFlagsFromScopeToEvent = function (event) {
                        if (event.type) return event;
                        let flagContext = currentScopes.getCurrentScope().getScopeData().contexts.flags,
                            flagBuffer = flagContext ? flagContext.values : [];
                        return (flagBuffer.length && (void 0 === event.contexts && (event.contexts = {}), (event.contexts.flags = { values: [...flagBuffer] })), event);
                    }),
                    (exports._INTERNAL_insertFlagToScope = function (name, value, maxSize = 100) {
                        let scopeContexts = currentScopes.getCurrentScope().getScopeData().contexts;
                        (scopeContexts.flags || (scopeContexts.flags = { values: [] }), _INTERNAL_insertToFlagBuffer(scopeContexts.flags.values, name, value, maxSize));
                    }),
                    (exports._INTERNAL_insertToFlagBuffer = _INTERNAL_insertToFlagBuffer));
            }