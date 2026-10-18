7121(__unused_rspack_module, exports, __webpack_require__) {
                let _externalPropagationContextProvider;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let index = __webpack_require__(3401),
                    carrier = __webpack_require__(5),
                    scope = __webpack_require__(9529),
                    propagationContext = __webpack_require__(8034);
                function getExternalPropagationContext() {
                    return _externalPropagationContextProvider?.();
                }
                function getCurrentScope() {
                    let carrier$1 = carrier.getMainCarrier();
                    return index.getAsyncContextStrategy(carrier$1).getCurrentScope();
                }
                ((exports.getClient = function () {
                    return getCurrentScope().getClient();
                }),
                    (exports.getCurrentScope = getCurrentScope),
                    (exports.getExternalPropagationContext = getExternalPropagationContext),
                    (exports.getGlobalScope = function () {
                        return carrier.getGlobalSingleton("globalScope", () => new scope.Scope());
                    }),
                    (exports.getIsolationScope = function () {
                        let carrier$1 = carrier.getMainCarrier();
                        return index.getAsyncContextStrategy(carrier$1).getIsolationScope();
                    }),
                    (exports.getTraceContextFromScope = function (scope) {
                        let externalContext = getExternalPropagationContext();
                        if (externalContext) return { trace_id: externalContext.traceId, span_id: externalContext.spanId };
                        let { traceId, parentSpanId, propagationSpanId } = scope.getPropagationContext(),
                            traceContext = { trace_id: traceId, span_id: propagationSpanId || propagationContext.generateSpanId() };
                        return (parentSpanId && (traceContext.parent_span_id = parentSpanId), traceContext);
                    }),
                    (exports.hasExternalPropagationContext = function () {
                        return void 0 !== _externalPropagationContextProvider;
                    }),
                    (exports.registerExternalPropagationContext = function (fn) {
                        _externalPropagationContextProvider = fn;
                    }),
                    (exports.withIsolationScope = function (...rest) {
                        let carrier$1 = carrier.getMainCarrier(),
                            acs = index.getAsyncContextStrategy(carrier$1);
                        if (2 === rest.length) {
                            let [isolationScope, callback] = rest;
                            return isolationScope ? acs.withSetIsolationScope(isolationScope, callback) : acs.withIsolationScope(callback);
                        }
                        return acs.withIsolationScope(rest[0]);
                    }),
                    (exports.withScope = function (...rest) {
                        let carrier$1 = carrier.getMainCarrier(),
                            acs = index.getAsyncContextStrategy(carrier$1);
                        if (2 === rest.length) {
                            let [scope, callback] = rest;
                            return scope ? acs.withSetScope(scope, callback) : acs.withScope(callback);
                        }
                        return acs.withScope(rest[0]);
                    }));
            }