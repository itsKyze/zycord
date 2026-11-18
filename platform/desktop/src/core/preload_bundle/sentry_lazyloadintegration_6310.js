6310(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445),
                    LAZY_LOADABLE_NAMES = [
                        "replayIntegration",
                        "replayCanvasIntegration",
                        "feedbackIntegration",
                        "feedbackModalIntegration",
                        "feedbackScreenshotIntegration",
                        "captureConsoleIntegration",
                        "contextLinesIntegration",
                        "linkedErrorsIntegration",
                        "dedupeIntegration",
                        "extraErrorDataIntegration",
                        "graphqlClientIntegration",
                        "httpClientIntegration",
                        "reportingObserverIntegration",
                        "rewriteFramesIntegration",
                        "browserProfilingIntegration",
                        "moduleMetadataIntegration",
                        "instrumentAnthropicAiClient",
                        "instrumentOpenAiClient",
                        "instrumentGoogleGenAIClient",
                        "instrumentLangGraph",
                        "createLangChainCallbackHandler",
                        "instrumentLangChainEmbeddings",
                    ],
                    HYPHENATED_BUNDLES = {
                        replayCanvasIntegration: "replay-canvas",
                        feedbackModalIntegration: "feedback-modal",
                        feedbackScreenshotIntegration: "feedback-screenshot",
                    },
                    WindowWithMaybeIntegration = helpers.WINDOW;
                exports.lazyLoadIntegration = async function lazyLoadIntegration(name, scriptNonce) {
                    var bundle;
                    let client,
                        baseURL,
                        bundle1 = LAZY_LOADABLE_NAMES.includes(name) ? HYPHENATED_BUNDLES[name] || name.replace("Integration", "").toLowerCase() : void 0,
                        sentryOnWindow = (WindowWithMaybeIntegration.Sentry = WindowWithMaybeIntegration.Sentry || {});
                    if (!bundle1) throw Error(`Cannot lazy load integration: ${name}`);
                    let existing = sentryOnWindow[name];
                    if ("function" == typeof existing && !("_isShim" in existing)) return existing;
                    let url =
                            ((bundle = bundle1),
                            (client = core.getClient()),
                            (baseURL = client?.getOptions()?.cdnBaseUrl || "https://browser.sentry-cdn.com"),
                            new URL(`/${core.SDK_VERSION}/${bundle}.min.js`, baseURL).toString()),
                        script = helpers.WINDOW.document.createElement("script");
                    ((script.src = url), (script.crossOrigin = "anonymous"), (script.referrerPolicy = "strict-origin"), scriptNonce && script.setAttribute("nonce", scriptNonce));
                    let waitForLoad = new Promise((resolve, reject) => {
                            (script.addEventListener("load", () => resolve()), script.addEventListener("error", reject));
                        }),
                        currentScript = helpers.WINDOW.document.currentScript,
                        parent = helpers.WINDOW.document.body || helpers.WINDOW.document.head || currentScript?.parentElement;
                    if (parent) parent.appendChild(script);
                    else throw Error(`Could not find parent element to insert lazy-loaded ${name} script`);
                    try {
                        await waitForLoad;
                    } catch {
                        throw Error(`Error when loading integration: ${name}`);
                    }
                    let integrationFn = sentryOnWindow[name];
                    if ("function" != typeof integrationFn) throw Error(`Could not load integration: ${name}`);
                    return integrationFn;
                };
            }