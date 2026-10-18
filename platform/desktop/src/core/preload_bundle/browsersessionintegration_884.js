884(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                exports.browserSessionIntegration = core.defineIntegration((options = {}) => {
                    let lifecycle = options.lifecycle ?? "route";
                    return {
                        name: "BrowserSession",
                        setupOnce() {
                            if (void 0 === helpers.WINDOW.document) {
                                debugBuild.DEBUG_BUILD && core.debug.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
                                return;
                            }
                            (core.startSession({ ignoreDuration: !0 }), core.captureSession());
                            let isolationScope = core.getIsolationScope(),
                                previousUser = isolationScope.getUser();
                            (isolationScope.addScopeListener((scope) => {
                                let maybeNewUser = scope.getUser();
                                (previousUser?.id !== maybeNewUser?.id || previousUser?.ip_address !== maybeNewUser?.ip_address) &&
                                    (core.captureSession(), (previousUser = maybeNewUser));
                            }),
                                "route" === lifecycle &&
                                    browserUtils.addHistoryInstrumentationHandler(({ from, to }) => {
                                        from !== to && (core.startSession({ ignoreDuration: !0 }), core.captureSession());
                                    }));
                        },
                    };
                });
            }