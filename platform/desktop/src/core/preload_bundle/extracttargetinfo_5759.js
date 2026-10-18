5759(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(2277),
                    METHOD_CONFIGS = {
                        "tools/call": { targetField: "name", targetAttribute: attributes.MCP_TOOL_NAME_ATTRIBUTE, captureArguments: !0, argumentsField: "arguments" },
                        "resources/read": { targetField: "uri", targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE, captureUri: !0 },
                        "resources/subscribe": { targetField: "uri", targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE },
                        "resources/unsubscribe": { targetField: "uri", targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE },
                        "prompts/get": {
                            targetField: "name",
                            targetAttribute: attributes.MCP_PROMPT_NAME_ATTRIBUTE,
                            captureName: !0,
                            captureArguments: !0,
                            argumentsField: "arguments",
                        },
                    };
                ((exports.extractTargetInfo = function (method, params) {
                    let config = METHOD_CONFIGS[method];
                    if (!config) return { attributes: {} };
                    let target = config.targetField && "string" == typeof params?.[config.targetField] ? params[config.targetField] : void 0;
                    return { target, attributes: target && config.targetAttribute ? { [config.targetAttribute]: target } : {} };
                }),
                    (exports.getRequestArguments = function (method, params) {
                        let args = {},
                            config = METHOD_CONFIGS[method];
                        if (!config) return args;
                        if (config.captureArguments && config.argumentsField && params?.[config.argumentsField]) {
                            let argumentsObj = params[config.argumentsField];
                            if ("object" == typeof argumentsObj && null !== argumentsObj)
                                for (let [key, value] of Object.entries(argumentsObj)) args[`${attributes.MCP_REQUEST_ARGUMENT}.${key.toLowerCase()}`] = JSON.stringify(value);
                        }
                        return (
                            config.captureUri && params?.uri && (args[`${attributes.MCP_REQUEST_ARGUMENT}.uri`] = JSON.stringify(params.uri)),
                            config.captureName && params?.name && (args[`${attributes.MCP_REQUEST_ARGUMENT}.name`] = JSON.stringify(params.name)),
                            args
                        );
                    }));
            }