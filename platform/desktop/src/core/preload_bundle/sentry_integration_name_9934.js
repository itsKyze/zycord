9934(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    eventbuilder = __webpack_require__(2081),
                    helpers = __webpack_require__(9445),
                    globalhandlers = __webpack_require__(2266),
                    INTEGRATION_NAME = "WebWorker",
                    webWorkerIntegration = core.defineIntegration(({ worker }) => ({
                        name: INTEGRATION_NAME,
                        setupOnce: () => {
                            (Array.isArray(worker) ? worker : [worker]).forEach((w) => listenForSentryMessages(w));
                        },
                        addWorker: (worker) => listenForSentryMessages(worker),
                    }));
                function listenForSentryMessages(worker) {
                    worker.addEventListener("message", (event) => {
                        if (
                            (function (eventData) {
                                if (!core.isPlainObject(eventData) || !0 !== eventData._sentryMessage) return !1;
                                let hasDebugIds = "_sentryDebugIds" in eventData,
                                    hasModuleMetadata = "_sentryModuleMetadata" in eventData,
                                    hasWorkerError = "_sentryWorkerError" in eventData,
                                    hasWasmImages = "_sentryWasmImages" in eventData;
                                return (
                                    (!!hasDebugIds || !!hasModuleMetadata || !!hasWorkerError || !!hasWasmImages) &&
                                    (!hasDebugIds || !!(core.isPlainObject(eventData._sentryDebugIds) || void 0 === eventData._sentryDebugIds)) &&
                                    (!hasModuleMetadata || !!(core.isPlainObject(eventData._sentryModuleMetadata) || void 0 === eventData._sentryModuleMetadata)) &&
                                    (!hasWorkerError || !!core.isPlainObject(eventData._sentryWorkerError)) &&
                                    (!hasWasmImages ||
                                        (!!Array.isArray(eventData._sentryWasmImages) &&
                                            !!eventData._sentryWasmImages.every((img) => core.isPlainObject(img) && "string" == typeof img.code_file))) &&
                                    !0
                                );
                            })(event.data)
                        ) {
                            if (
                                (event.stopImmediatePropagation(),
                                event.data._sentryDebugIds &&
                                    (debugBuild.DEBUG_BUILD && core.debug.log("Sentry debugId web worker message received", event.data),
                                    (helpers.WINDOW._sentryDebugIds = { ...event.data._sentryDebugIds, ...helpers.WINDOW._sentryDebugIds })),
                                event.data._sentryModuleMetadata &&
                                    (debugBuild.DEBUG_BUILD && core.debug.log("Sentry module metadata web worker message received", event.data),
                                    (helpers.WINDOW._sentryModuleMetadata = { ...event.data._sentryModuleMetadata, ...helpers.WINDOW._sentryModuleMetadata })),
                                event.data._sentryWasmImages)
                            ) {
                                debugBuild.DEBUG_BUILD && core.debug.log("Sentry WASM images web worker message received", event.data);
                                let existingImages = helpers.WINDOW._sentryWasmImages || [],
                                    newImages = event.data._sentryWasmImages.filter(
                                        (newImg) =>
                                            core.isPlainObject(newImg) &&
                                            "string" == typeof newImg.code_file &&
                                            !existingImages.some((existing) => existing.code_file === newImg.code_file),
                                    );
                                helpers.WINDOW._sentryWasmImages = [...existingImages, ...newImages];
                            }
                            event.data._sentryWorkerError &&
                                (debugBuild.DEBUG_BUILD && core.debug.log("Sentry worker rejection message received", event.data._sentryWorkerError),
                                (function (workerError) {
                                    let client = core.getClient();
                                    if (!client) return;
                                    let stackParser = client.getOptions().stackParser,
                                        attachStacktrace = client.getOptions().attachStacktrace,
                                        error = workerError.reason,
                                        event = core.isPrimitive(error)
                                            ? globalhandlers._eventFromRejectionWithPrimitive(error)
                                            : eventbuilder.eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, !0);
                                    ((event.level = "error"),
                                        workerError.filename && (event.contexts = { ...event.contexts, worker: { filename: workerError.filename } }),
                                        core.captureEvent(event, { originalException: error, mechanism: { handled: !1, type: "auto.browser.web_worker.onunhandledrejection" } }),
                                        debugBuild.DEBUG_BUILD && core.debug.log("Captured worker unhandled rejection", error));
                                })(event.data._sentryWorkerError));
                        }
                    });
                }
                ((exports.INTEGRATION_NAME = INTEGRATION_NAME),
                    (exports.registerWebWorker = function ({ self }) {
                        (self.postMessage({ _sentryMessage: !0, _sentryDebugIds: self._sentryDebugIds ?? void 0, _sentryModuleMetadata: self._sentryModuleMetadata ?? void 0 }),
                            self.addEventListener("unhandledrejection", (event) => {
                                let serializedError = { reason: globalhandlers._getUnhandledRejectionError(event), filename: self.location?.href };
                                (self.postMessage({ _sentryMessage: !0, _sentryWorkerError: serializedError }),
                                    debugBuild.DEBUG_BUILD && core.debug.log("[Sentry Worker] Forwarding unhandled rejection to parent", serializedError));
                            }),
                            debugBuild.DEBUG_BUILD && core.debug.log("[Sentry Worker] Registered worker with unhandled rejection handling"));
                    }),
                    (exports.webWorkerIntegration = webWorkerIntegration));
            }