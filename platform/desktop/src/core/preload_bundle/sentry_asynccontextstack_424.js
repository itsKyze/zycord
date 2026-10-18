424(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let defaultScopes = __webpack_require__(4197),
                    scope = __webpack_require__(9529),
                    chainAndCopyPromiselike = __webpack_require__(2317),
                    is = __webpack_require__(7431),
                    carrier = __webpack_require__(5);
                class AsyncContextStack {
                    constructor(scope$1, isolationScope) {
                        let assignedScope, assignedIsolationScope;
                        ((assignedScope = scope$1 || new scope.Scope()),
                            (assignedIsolationScope = isolationScope || new scope.Scope()),
                            (this._stack = [{ scope: assignedScope }]),
                            (this._isolationScope = assignedIsolationScope));
                    }
                    withScope(callback) {
                        let maybePromiseResult,
                            scope = this._pushScope();
                        try {
                            maybePromiseResult = callback(scope);
                        } catch (e) {
                            throw (this._popScope(), e);
                        }
                        return is.isThenable(maybePromiseResult)
                            ? chainAndCopyPromiselike.chainAndCopyPromiseLike(
                                  maybePromiseResult,
                                  () => this._popScope(),
                                  () => this._popScope(),
                              )
                            : (this._popScope(), maybePromiseResult);
                    }
                    getClient() {
                        return this.getStackTop().client;
                    }
                    getScope() {
                        return this.getStackTop().scope;
                    }
                    getIsolationScope() {
                        return this._isolationScope;
                    }
                    getStackTop() {
                        return this._stack[this._stack.length - 1];
                    }
                    _pushScope() {
                        let scope = this.getScope().clone();
                        return (this._stack.push({ client: this.getClient(), scope }), scope);
                    }
                    _popScope() {
                        return !(this._stack.length <= 1) && !!this._stack.pop();
                    }
                }
                function getAsyncContextStack() {
                    let registry = carrier.getMainCarrier(),
                        sentry = carrier.getSentryCarrier(registry);
                    return (sentry.stack = sentry.stack || new AsyncContextStack(defaultScopes.getDefaultCurrentScope(), defaultScopes.getDefaultIsolationScope()));
                }
                function withScope(callback) {
                    return getAsyncContextStack().withScope(callback);
                }
                function withSetScope(scope, callback) {
                    let stack = getAsyncContextStack();
                    return stack.withScope(() => ((stack.getStackTop().scope = scope), callback(scope)));
                }
                function withIsolationScope(callback) {
                    return getAsyncContextStack().withScope(() => callback(getAsyncContextStack().getIsolationScope()));
                }
                ((exports.AsyncContextStack = AsyncContextStack),
                    (exports.getStackAsyncContextStrategy = function () {
                        return {
                            withIsolationScope,
                            withScope,
                            withSetScope,
                            withSetIsolationScope: (_isolationScope, callback) => withIsolationScope(callback),
                            getCurrentScope: () => getAsyncContextStack().getScope(),
                            getIsolationScope: () => getAsyncContextStack().getIsolationScope(),
                        };
                    }));
            }