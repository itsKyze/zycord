5234(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    openFeatureIntegration = core.defineIntegration(() => ({
                        name: "OpenFeature",
                        processEvent: (event, _hint, _client) => core._INTERNAL_copyFlagsFromScopeToEvent(event),
                    }));
                ((exports.OpenFeatureIntegrationHook = class {
                    after(_hookContext, evaluationDetails) {
                        (core._INTERNAL_insertFlagToScope(evaluationDetails.flagKey, evaluationDetails.value),
                            core._INTERNAL_addFeatureFlagToActiveSpan(evaluationDetails.flagKey, evaluationDetails.value));
                    }
                    error(hookContext, _error, _hookHints) {
                        (core._INTERNAL_insertFlagToScope(hookContext.flagKey, hookContext.defaultValue),
                            core._INTERNAL_addFeatureFlagToActiveSpan(hookContext.flagKey, hookContext.defaultValue));
                    }
                }),
                    (exports.openFeatureIntegration = openFeatureIntegration));
            }