7836(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    metadata = __webpack_require__(2188),
                    envelope = __webpack_require__(1323);
                exports.moduleMetadataIntegration = integration.defineIntegration(() => ({
                    name: "ModuleMetadata",
                    setup(client) {
                        (client.on("beforeEnvelope", (envelope$1) => {
                            envelope.forEachEnvelopeItem(envelope$1, (item, type) => {
                                if ("event" === type) {
                                    let event = Array.isArray(item) ? item[1] : void 0;
                                    event && (metadata.stripMetadataFromStackFrames(event), (item[1] = event));
                                }
                            });
                        }),
                            client.on("applyFrameMetadata", (event) => {
                                if (event.type) return;
                                let stackParser = client.getOptions().stackParser;
                                metadata.addMetadataToStackFrames(stackParser, event);
                            }));
                    },
                }));
            }