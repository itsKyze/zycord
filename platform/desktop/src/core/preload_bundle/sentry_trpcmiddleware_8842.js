8842(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    object = __webpack_require__(4204),
                    normalize = __webpack_require__(4496),
                    trace = __webpack_require__(6833),
                    trpcCaptureContext = { mechanism: { handled: !1, type: "auto.rpc.trpc.middleware" } };
                exports.trpcMiddleware = function (options = {}) {
                    return async function (opts) {
                        let { path, type, next, rawInput, getRawInput } = opts,
                            client = currentScopes.getClient(),
                            clientOptions = client?.getOptions(),
                            trpcContext = { procedure_path: path, procedure_type: type };
                        if (
                            (object.addNonEnumerableProperty(trpcContext, "__sentry_override_normalization_depth__", 1 + (clientOptions?.normalizeDepth ?? 5)),
                            (void 0 !== options.attachRpcInput ? options.attachRpcInput : clientOptions?.sendDefaultPii) &&
                                (void 0 !== rawInput && (trpcContext.input = normalize.normalize(rawInput)), void 0 !== getRawInput && "function" == typeof getRawInput))
                        )
                            try {
                                let rawRes = await getRawInput();
                                trpcContext.input = normalize.normalize(rawRes);
                            } catch {}
                        return currentScopes.withIsolationScope(
                            (scope) => (
                                scope.setContext("trpc", trpcContext),
                                trace.startSpanManual(
                                    {
                                        name: `trpc/${path}`,
                                        op: "rpc.server",
                                        attributes: {
                                            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "route",
                                            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.rpc.trpc",
                                        },
                                        forceTransaction: !!options.forceTransaction,
                                    },
                                    async (span) => {
                                        try {
                                            let nextResult = await next();
                                            return (
                                                "object" == typeof nextResult &&
                                                    null !== nextResult &&
                                                    "ok" in nextResult &&
                                                    !nextResult.ok &&
                                                    "error" in nextResult &&
                                                    _exports.captureException(nextResult.error, trpcCaptureContext),
                                                span.end(),
                                                nextResult
                                            );
                                        } catch (e) {
                                            throw (_exports.captureException(e, trpcCaptureContext), span.end(), e);
                                        }
                                    },
                                )
                            ),
                        );
                    };
                };
            }