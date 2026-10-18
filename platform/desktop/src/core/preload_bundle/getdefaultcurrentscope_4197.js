4197(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let carrier = __webpack_require__(5),
                    scope = __webpack_require__(9529);
                ((exports.getDefaultCurrentScope = function () {
                    return carrier.getGlobalSingleton("defaultCurrentScope", () => new scope.Scope());
                }),
                    (exports.getDefaultIsolationScope = function () {
                        return carrier.getGlobalSingleton("defaultIsolationScope", () => new scope.Scope());
                    }));
            }