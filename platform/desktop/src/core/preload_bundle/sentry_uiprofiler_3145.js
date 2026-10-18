3145(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734);
                exports.uiProfiler = {
                    startProfiler: function () {
                        let client = core.getClient();
                        if (!client) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("No Sentry client available, profiling is not started");
                            return;
                        }
                        if (!client.getIntegrationByName("BrowserProfiling")) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("BrowserProfiling integration is not available");
                            return;
                        }
                        client.emit("startUIProfiler");
                    },
                    stopProfiler: function () {
                        let client = core.getClient();
                        if (!client) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("No Sentry client available, profiling is not started");
                            return;
                        }
                        if (!client.getIntegrationByName("BrowserProfiling")) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("ProfilingIntegration is not available");
                            return;
                        }
                        client.emit("stopUIProfiler");
                    },
                };
            }