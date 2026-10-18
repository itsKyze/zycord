642(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    SKIPPED_AI_PROVIDERS = new Set();
                ((exports._INTERNAL_clearAiProviderSkips = function () {
                    (SKIPPED_AI_PROVIDERS.clear(), debugBuild.DEBUG_BUILD && debugLogger.debug.log("Cleared AI provider skip registrations"));
                }),
                    (exports._INTERNAL_shouldSkipAiProviderWrapping = function (module1) {
                        return SKIPPED_AI_PROVIDERS.has(module1);
                    }),
                    (exports._INTERNAL_skipAiProviderWrapping = function (modules) {
                        modules.forEach((module1) => {
                            (SKIPPED_AI_PROVIDERS.add(module1), debugBuild.DEBUG_BUILD && debugLogger.debug.log(`AI provider "${module1}" wrapping will be skipped`));
                        });
                    }));
            }