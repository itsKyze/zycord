5726(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777);
                function getScopeData() {
                    let globalScope = core.getGlobalScope().getScopeData(),
                        isolationScope = core.getIsolationScope().getScopeData(),
                        currentScope = core.getCurrentScope().getScopeData();
                    return (core.mergeScopeData(globalScope, isolationScope), core.mergeScopeData(globalScope, currentScope), (globalScope.eventProcessors = []), globalScope);
                }
                ((exports.addScopeListener = function (callback) {
                    (core.getIsolationScope().addScopeListener((isolation) => {
                        callback(getScopeData(), isolation);
                    }),
                        core.getCurrentScope().addScopeListener((current) => {
                            callback(getScopeData(), current);
                        }),
                        core.getGlobalScope().addScopeListener((global1) => {
                            callback(getScopeData(), global1);
                        }));
                }),
                    (exports.getScopeData = getScopeData));
            }