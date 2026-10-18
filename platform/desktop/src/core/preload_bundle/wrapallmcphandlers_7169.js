7169(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    object = __webpack_require__(4204),
                    errorCapture = __webpack_require__(7572);
                function wrapMethodHandler(serverInstance, methodName) {
                    object.fill(
                        serverInstance,
                        methodName,
                        (originalMethod) =>
                            function (name, ...args) {
                                var originalHandler, methodName1, handlerName;
                                let handler = args[args.length - 1];
                                if ("function" != typeof handler) return originalMethod.call(this, name, ...args);
                                let wrappedHandler =
                                    ((originalHandler = handler),
                                    (methodName1 = methodName),
                                    (handlerName = name),
                                    function (...handlerArgs) {
                                        try {
                                            return createErrorCapturingHandler.call(this, originalHandler, methodName1, handlerName, handlerArgs);
                                        } catch (error) {
                                            return (
                                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn("MCP handler wrapping failed:", error),
                                                originalHandler.apply(this, handlerArgs)
                                            );
                                        }
                                    });
                                return originalMethod.call(this, name, ...args.slice(0, -1), wrappedHandler);
                            },
                    );
                }
                function createErrorCapturingHandler(originalHandler, methodName, handlerName, handlerArgs) {
                    try {
                        let result = originalHandler.apply(this, handlerArgs);
                        if (result && "object" == typeof result && "function" == typeof result.then)
                            return Promise.resolve(result).catch((error) => {
                                throw (captureHandlerError(error, methodName, handlerName), error);
                            });
                        return result;
                    } catch (error) {
                        throw (captureHandlerError(error, methodName, handlerName), error);
                    }
                }
                function captureHandlerError(error, methodName, handlerName) {
                    try {
                        let extraData = {};
                        "tool" === methodName || "registerTool" === methodName
                            ? ((extraData.tool_name = handlerName),
                              "ProtocolValidationError" === error.name || error.message.includes("validation") || error.message.includes("protocol")
                                  ? errorCapture.captureError(error, "validation", extraData)
                                  : "ServerTimeoutError" === error.name || error.message.includes("timed out") || error.message.includes("timeout")
                                    ? errorCapture.captureError(error, "timeout", extraData)
                                    : errorCapture.captureError(error, "tool_execution", extraData))
                            : "resource" === methodName || "registerResource" === methodName
                              ? ((extraData.resource_uri = handlerName), errorCapture.captureError(error, "resource_execution", extraData))
                              : ("prompt" === methodName || "registerPrompt" === methodName) &&
                                ((extraData.prompt_name = handlerName), errorCapture.captureError(error, "prompt_execution", extraData));
                    } catch (_captureErr) {}
                }
                function wrapToolHandlers(serverInstance) {
                    ("function" == typeof serverInstance.tool && wrapMethodHandler(serverInstance, "tool"),
                        "function" == typeof serverInstance.registerTool && wrapMethodHandler(serverInstance, "registerTool"));
                }
                function wrapResourceHandlers(serverInstance) {
                    ("function" == typeof serverInstance.resource && wrapMethodHandler(serverInstance, "resource"),
                        "function" == typeof serverInstance.registerResource && wrapMethodHandler(serverInstance, "registerResource"));
                }
                function wrapPromptHandlers(serverInstance) {
                    ("function" == typeof serverInstance.prompt && wrapMethodHandler(serverInstance, "prompt"),
                        "function" == typeof serverInstance.registerPrompt && wrapMethodHandler(serverInstance, "registerPrompt"));
                }
                ((exports.wrapAllMCPHandlers = function (serverInstance) {
                    (wrapToolHandlers(serverInstance), wrapResourceHandlers(serverInstance), wrapPromptHandlers(serverInstance));
                }),
                    (exports.wrapPromptHandlers = wrapPromptHandlers),
                    (exports.wrapResourceHandlers = wrapResourceHandlers),
                    (exports.wrapToolHandlers = wrapToolHandlers));
            }