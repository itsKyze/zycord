3409(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    eventbuilder = __webpack_require__(2081),
                    helpers = __webpack_require__(9445);
                class BrowserClient extends core.Client {
                    constructor(options) {
                        const opts = applyDefaultOptions(options),
                            sdkSource = helpers.WINDOW.SENTRY_SDK_SOURCE || core.getSDKSource();
                        (core.applySdkMetadata(opts, "browser", ["browser"], sdkSource),
                            opts._metadata?.sdk && (opts._metadata.sdk.settings = { infer_ip: opts.sendDefaultPii ? "auto" : "never", ...opts._metadata.sdk.settings }),
                            super(opts));
                        const { sendDefaultPii, sendClientReports, enableLogs, _experiments, enableMetrics: enableMetricsOption } = this._options,
                            enableMetrics = enableMetricsOption ?? _experiments?.enableMetrics ?? !0;
                        (helpers.WINDOW.document &&
                            (sendClientReports || enableLogs || enableMetrics) &&
                            helpers.WINDOW.document.addEventListener("visibilitychange", () => {
                                "hidden" === helpers.WINDOW.document.visibilityState &&
                                    (sendClientReports && this._flushOutcomes(),
                                    enableLogs && core._INTERNAL_flushLogsBuffer(this),
                                    enableMetrics && core._INTERNAL_flushMetricsBuffer(this));
                            }),
                            sendDefaultPii && this.on("beforeSendSession", core.addAutoIpAddressToSession));
                    }
                    eventFromException(exception, hint) {
                        return eventbuilder.eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
                    }
                    eventFromMessage(message, level = "info", hint) {
                        return eventbuilder.eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
                    }
                    _prepareEvent(event, hint, currentScope, isolationScope) {
                        return ((event.platform = event.platform || "javascript"), super._prepareEvent(event, hint, currentScope, isolationScope));
                    }
                }
                function applyDefaultOptions(optionsArg) {
                    return {
                        release: "string" == typeof __SENTRY_RELEASE__ ? __SENTRY_RELEASE__ : helpers.WINDOW.SENTRY_RELEASE?.id,
                        sendClientReports: !0,
                        parentSpanIsAlwaysRootSpan: !0,
                        ...optionsArg,
                    };
                }
                ((exports.BrowserClient = BrowserClient), (exports.applyDefaultOptions = applyDefaultOptions));
            }