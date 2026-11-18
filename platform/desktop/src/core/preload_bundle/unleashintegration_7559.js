7559(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734);
                function _wrappedIsEnabled(original) {
                    return function (...args) {
                        let toggleName = args[0],
                            result = original.apply(this, args);
                        return (
                            "string" == typeof toggleName && "boolean" == typeof result
                                ? (core._INTERNAL_insertFlagToScope(toggleName, result), core._INTERNAL_addFeatureFlagToActiveSpan(toggleName, result))
                                : debugBuild.DEBUG_BUILD &&
                                  core.debug.error(
                                      `[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${toggleName} (${typeof toggleName}), result: ${result} (${typeof result})`,
                                  ),
                            result
                        );
                    };
                }
                exports.unleashIntegration = core.defineIntegration(({ featureFlagClientClass: unleashClientClass }) => ({
                    name: "Unleash",
                    setupOnce() {
                        let unleashClientPrototype = unleashClientClass.prototype;
                        core.fill(unleashClientPrototype, "isEnabled", _wrappedIsEnabled);
                    },
                    processEvent: (event, _hint, _client) => core._INTERNAL_copyFlagsFromScopeToEvent(event),
                }));
            }