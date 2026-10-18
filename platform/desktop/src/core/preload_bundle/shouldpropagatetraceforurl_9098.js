9098(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    string = __webpack_require__(2634),
                    NOT_PROPAGATED_MESSAGE = "[Tracing] Not injecting trace data for url because it does not match tracePropagationTargets:";
                exports.shouldPropagateTraceForUrl = function (url, tracePropagationTargets, decisionMap) {
                    if ("string" != typeof url || !tracePropagationTargets) return !0;
                    let cachedDecision = decisionMap?.get(url);
                    if (void 0 !== cachedDecision) return (debugBuild.DEBUG_BUILD && !cachedDecision && debugLogger.debug.log(NOT_PROPAGATED_MESSAGE, url), cachedDecision);
                    let decision = string.stringMatchesSomePattern(url, tracePropagationTargets);
                    return (decisionMap?.set(url, decision), debugBuild.DEBUG_BUILD && !decision && debugLogger.debug.log(NOT_PROPAGATED_MESSAGE, url), decision);
                };
            }