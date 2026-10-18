3831(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533);
                function isProfilingIntegrationWithProfiler(integration) {
                    return !!integration && void 0 !== integration._profiler && "function" == typeof integration._profiler.start && "function" == typeof integration._profiler.stop;
                }
                exports.profiler = {
                    startProfiler: function () {
                        let client = currentScopes.getClient();
                        if (!client) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No Sentry client available, profiling is not started");
                            return;
                        }
                        let integration = client.getIntegrationByName("ProfilingIntegration");
                        if (!integration) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("ProfilingIntegration is not available");
                            return;
                        }
                        if (!isProfilingIntegrationWithProfiler(integration)) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Profiler is not available on profiling integration.");
                            return;
                        }
                        integration._profiler.start();
                    },
                    stopProfiler: function () {
                        let client = currentScopes.getClient();
                        if (!client) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No Sentry client available, profiling is not started");
                            return;
                        }
                        let integration = client.getIntegrationByName("ProfilingIntegration");
                        if (!integration) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("ProfilingIntegration is not available");
                            return;
                        }
                        if (!isProfilingIntegrationWithProfiler(integration)) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Profiler is not available on profiling integration.");
                            return;
                        }
                        integration._profiler.stop();
                    },
                };
            }