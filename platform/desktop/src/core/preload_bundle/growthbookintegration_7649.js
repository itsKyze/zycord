7649(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    featureFlags = __webpack_require__(6306),
                    object = __webpack_require__(4204);
                function _wrapAndCaptureBooleanResult(original) {
                    return function (...args) {
                        let flagName = args[0],
                            result = original.apply(this, args);
                        return (
                            "string" == typeof flagName &&
                                "boolean" == typeof result &&
                                (featureFlags._INTERNAL_insertFlagToScope(flagName, result), featureFlags._INTERNAL_addFeatureFlagToActiveSpan(flagName, result)),
                            result
                        );
                    };
                }
                exports.growthbookIntegration = integration.defineIntegration(({ growthbookClass }) => ({
                    name: "GrowthBook",
                    setupOnce() {
                        let proto = growthbookClass.prototype;
                        ("function" == typeof proto.isOn && object.fill(proto, "isOn", _wrapAndCaptureBooleanResult),
                            "function" == typeof proto.getFeatureValue && object.fill(proto, "getFeatureValue", _wrapAndCaptureBooleanResult));
                    },
                    processEvent: (event, _hint, _client) => featureFlags._INTERNAL_copyFlagsFromScopeToEvent(event),
                }));
            }