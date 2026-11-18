7454(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777),
                    scope = __webpack_require__(5726),
                    ipc = __webpack_require__(3306);
                exports.scopeToMainIntegration = core.defineIntegration(() => ({
                    name: "ScopeToMain",
                    setup(client) {
                        let ipc$1 = ipc.getIPC(client);
                        scope.addScopeListener((merged, changed) => {
                            (ipc$1.sendScope(JSON.stringify(core.normalize(merged, 20, 2e3))), changed.clearBreadcrumbs(), changed.clearAttachments());
                        });
                    },
                }));
            }