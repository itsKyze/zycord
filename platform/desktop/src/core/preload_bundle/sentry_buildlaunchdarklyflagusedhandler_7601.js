7601(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    launchDarklyIntegration = core.defineIntegration(() => ({
                        name: "LaunchDarkly",
                        processEvent: (event, _hint, _client) => core._INTERNAL_copyFlagsFromScopeToEvent(event),
                    }));
                ((exports.buildLaunchDarklyFlagUsedHandler = function () {
                    return {
                        name: "sentry-flag-auditor",
                        type: "flag-used",
                        synchronous: !0,
                        method: (flagKey, flagDetail, _context) => {
                            (core._INTERNAL_insertFlagToScope(flagKey, flagDetail.value), core._INTERNAL_addFeatureFlagToActiveSpan(flagKey, flagDetail.value));
                        },
                    };
                }),
                    (exports.launchDarklyIntegration = launchDarklyIntegration));
            }