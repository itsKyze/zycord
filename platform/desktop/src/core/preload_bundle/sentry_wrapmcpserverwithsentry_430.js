430(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    object = __webpack_require__(4204),
                    handlers = __webpack_require__(7169),
                    transport = __webpack_require__(9331),
                    validation = __webpack_require__(8631),
                    wrappedMcpServerInstances = new WeakSet();
                exports.wrapMcpServerWithSentry = function (mcpServerInstance, options) {
                    if (wrappedMcpServerInstances.has(mcpServerInstance) || !validation.validateMcpServerInstance(mcpServerInstance)) return mcpServerInstance;
                    let client = currentScopes.getClient(),
                        sendDefaultPii = !!client?.getOptions().sendDefaultPii,
                        resolvedOptions = { recordInputs: options?.recordInputs ?? sendDefaultPii, recordOutputs: options?.recordOutputs ?? sendDefaultPii };
                    return (
                        object.fill(
                            mcpServerInstance,
                            "connect",
                            (originalConnect) =>
                                async function (transport$1, ...restArgs) {
                                    let result = await originalConnect.call(this, transport$1, ...restArgs);
                                    return (
                                        transport.wrapTransportOnMessage(transport$1, resolvedOptions),
                                        transport.wrapTransportSend(transport$1, resolvedOptions),
                                        transport.wrapTransportOnClose(transport$1),
                                        transport.wrapTransportError(transport$1),
                                        result
                                    );
                                },
                        ),
                        handlers.wrapAllMCPHandlers(mcpServerInstance),
                        wrappedMcpServerInstances.add(mcpServerInstance),
                        mcpServerInstance
                    );
                };
            }