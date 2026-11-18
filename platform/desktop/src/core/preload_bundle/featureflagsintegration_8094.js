8094(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    featureFlags = __webpack_require__(6306);
                exports.featureFlagsIntegration = integration.defineIntegration(() => ({
                    name: "FeatureFlags",
                    processEvent: (event, _hint, _client) => featureFlags._INTERNAL_copyFlagsFromScopeToEvent(event),
                    addFeatureFlag(name, value) {
                        (featureFlags._INTERNAL_insertFlagToScope(name, value), featureFlags._INTERNAL_addFeatureFlagToActiveSpan(name, value));
                    },
                }));
            }