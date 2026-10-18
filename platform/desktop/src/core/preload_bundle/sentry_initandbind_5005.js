5005(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533);
                function setCurrentClient(client) {
                    currentScopes.getCurrentScope().setClient(client);
                }
                ((exports.initAndBind = function (clientClass, options) {
                    (!0 === options.debug &&
                        (debugBuild.DEBUG_BUILD
                            ? debugLogger.debug.enable()
                            : debugLogger.consoleSandbox(() => {
                                  console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
                              })),
                        currentScopes.getCurrentScope().update(options.initialScope));
                    let client = new clientClass(options);
                    return (setCurrentClient(client), client.init(), client);
                }),
                    (exports.setCurrentClient = setCurrentClient));
            }