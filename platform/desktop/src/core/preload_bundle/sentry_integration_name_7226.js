7226(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    debugBuild = __webpack_require__(7734),
                    INTEGRATION_NAME = "SpotlightBrowser",
                    spotlightBrowserIntegration = core.defineIntegration((options = {}) => {
                        let sidecarUrl = options.sidecarUrl || "http://localhost:8969/stream";
                        return {
                            name: INTEGRATION_NAME,
                            setup: () => {
                                debugBuild.DEBUG_BUILD && core.debug.log("Using Sidecar URL", sidecarUrl);
                            },
                            processEvent: (event) => (isSpotlightInteraction(event) ? null : event),
                            afterAllSetup: (client) => {
                                var client1, sidecarUrl1;
                                let makeFetch, failCount;
                                ((client1 = client),
                                    (sidecarUrl1 = sidecarUrl),
                                    (makeFetch = browserUtils.getNativeImplementation("fetch")),
                                    (failCount = 0),
                                    client1.on("beforeEnvelope", (envelope) => {
                                        failCount > 3
                                            ? core.debug.warn("[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:", failCount)
                                            : makeFetch(sidecarUrl1, {
                                                  method: "POST",
                                                  body: core.serializeEnvelope(envelope),
                                                  headers: { "Content-Type": "application/x-sentry-envelope" },
                                                  mode: "cors",
                                              }).then(
                                                  (res) => {
                                                      res.status >= 200 && res.status < 400 && (failCount = 0);
                                                  },
                                                  (err) => {
                                                      (failCount++,
                                                          core.debug.error("Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/", err));
                                                  },
                                              );
                                    }));
                            },
                        };
                    });
                function isSpotlightInteraction(event) {
                    return !!(
                        "transaction" === event.type &&
                        event.spans &&
                        event.contexts?.trace &&
                        "ui.action.click" === event.contexts.trace.op &&
                        event.spans.some(({ description }) => description?.includes("#sentry-spotlight"))
                    );
                }
                ((exports.INTEGRATION_NAME = INTEGRATION_NAME),
                    (exports.isSpotlightInteraction = isSpotlightInteraction),
                    (exports.spotlightBrowserIntegration = spotlightBrowserIntegration));
            }