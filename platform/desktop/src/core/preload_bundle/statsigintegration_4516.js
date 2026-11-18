4516(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                exports.statsigIntegration = core.defineIntegration(({ featureFlagClient: statsigClient }) => ({
                    name: "Statsig",
                    setup(_client) {
                        statsigClient.on("gate_evaluation", (event) => {
                            (core._INTERNAL_insertFlagToScope(event.gate.name, event.gate.value), core._INTERNAL_addFeatureFlagToActiveSpan(event.gate.name, event.gate.value));
                        });
                    },
                    processEvent: (event, _hint, _client) => core._INTERNAL_copyFlagsFromScopeToEvent(event),
                }));
            }