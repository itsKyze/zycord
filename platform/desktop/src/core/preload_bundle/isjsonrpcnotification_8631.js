8631(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533);
                ((exports.isJsonRpcNotification = function (message) {
                    return "object" == typeof message && null !== message && "jsonrpc" in message && "2.0" === message.jsonrpc && "method" in message && !("id" in message);
                }),
                    (exports.isJsonRpcRequest = function (message) {
                        return "object" == typeof message && null !== message && "jsonrpc" in message && "2.0" === message.jsonrpc && "method" in message && "id" in message;
                    }),
                    (exports.isJsonRpcResponse = function (message) {
                        return (
                            "object" == typeof message &&
                            null !== message &&
                            "jsonrpc" in message &&
                            "2.0" === message.jsonrpc &&
                            "id" in message &&
                            ("result" in message || "error" in message)
                        );
                    }),
                    (exports.isValidContentItem = function (item) {
                        return null != item && "object" == typeof item;
                    }),
                    (exports.validateMcpServerInstance = function (instance) {
                        return (
                            ("object" == typeof instance &&
                                null !== instance &&
                                "connect" in instance &&
                                (("tool" in instance && "resource" in instance && "prompt" in instance) ||
                                    ("registerTool" in instance && "registerResource" in instance && "registerPrompt" in instance))) ||
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Did not patch MCP server. Interface is incompatible."), !1)
                        );
                    }));
            }