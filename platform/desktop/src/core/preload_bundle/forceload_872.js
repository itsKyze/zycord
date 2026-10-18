872(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    client = __webpack_require__(3409),
                    breadcrumbs = __webpack_require__(2928),
                    browserapierrors = __webpack_require__(9163),
                    browsersession = __webpack_require__(884),
                    culturecontext = __webpack_require__(2857),
                    globalhandlers = __webpack_require__(2266),
                    httpcontext = __webpack_require__(385),
                    linkederrors = __webpack_require__(5830);
                __webpack_require__(7226);
                let stackParsers = __webpack_require__(3369),
                    fetch1 = __webpack_require__(1547),
                    detectBrowserExtension = __webpack_require__(7394);
                function getDefaultIntegrations(_options) {
                    return [
                        core.inboundFiltersIntegration(),
                        core.functionToStringIntegration(),
                        core.conversationIdIntegration(),
                        browserapierrors.browserApiErrorsIntegration(),
                        breadcrumbs.breadcrumbsIntegration(),
                        globalhandlers.globalHandlersIntegration(),
                        linkederrors.linkedErrorsIntegration(),
                        core.dedupeIntegration(),
                        httpcontext.httpContextIntegration(),
                        culturecontext.cultureContextIntegration(),
                        browsersession.browserSessionIntegration(),
                    ];
                }
                ((exports.forceLoad = function () {}),
                    (exports.getDefaultIntegrations = getDefaultIntegrations),
                    (exports.init = function (options = {}) {
                        let shouldDisableBecauseIsBrowserExtenstion = !options.skipBrowserExtensionCheck && detectBrowserExtension.checkAndWarnIfIsEmbeddedBrowserExtension(),
                            defaultIntegrations = null == options.defaultIntegrations ? getDefaultIntegrations() : options.defaultIntegrations,
                            clientOptions = {
                                ...options,
                                enabled: !shouldDisableBecauseIsBrowserExtenstion && options.enabled,
                                stackParser: core.stackParserFromStackParserOptions(options.stackParser || stackParsers.defaultStackParser),
                                integrations: core.getIntegrationsToSetup({ integrations: options.integrations, defaultIntegrations }),
                                transport: options.transport || fetch1.makeFetchTransport,
                            };
                        return core.initAndBind(client.BrowserClient, clientOptions);
                    }),
                    (exports.onLoad = function (callback) {
                        callback();
                    }));
            }