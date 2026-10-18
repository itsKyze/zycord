3959(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(5706),
                    streaming = __webpack_require__(1211),
                    utils$1 = __webpack_require__(3938);
                function addRequestAttributes(span, params, operationName, enableTruncation) {
                    if ("embeddings" === operationName && "input" in params) {
                        let input = params.input;
                        if (null == input || ("string" == typeof input && 0 === input.length) || (Array.isArray(input) && 0 === input.length)) return;
                        span.setAttribute(genAiAttributes.GEN_AI_EMBEDDINGS_INPUT_ATTRIBUTE, "string" == typeof input ? input : JSON.stringify(input));
                        return;
                    }
                    let src = "input" in params ? params.input : "messages" in params ? params.messages : void 0;
                    if (!src || (Array.isArray(src) && 0 === src.length)) return;
                    let { systemInstructions, filteredMessages } = utils.extractSystemInstructions(src);
                    (systemInstructions && span.setAttribute(genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions),
                        span.setAttribute(
                            genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE,
                            enableTruncation ? utils.getTruncatedJsonString(filteredMessages) : utils.getJsonString(filteredMessages),
                        ),
                        Array.isArray(filteredMessages)
                            ? span.setAttribute(genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, filteredMessages.length)
                            : span.setAttribute(genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, 1));
                }
                exports.instrumentOpenAiClient = function (client, options) {
                    return (function createDeepProxy(target, currentPath = "", options) {
                        return new Proxy(target, {
                            get(obj, prop) {
                                let value = obj[prop],
                                    methodPath = utils.buildMethodPath(currentPath, String(prop)),
                                    instrumentedMethod = constants.OPENAI_METHOD_REGISTRY[methodPath];
                                if ("function" == typeof value && instrumentedMethod)
                                    return function (...args) {
                                        let originalResult,
                                            operationName = instrumentedMethod.operation || "unknown",
                                            requestAttributes = (function (args, operationName) {
                                                let attributes = {
                                                    [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: "openai",
                                                    [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: operationName,
                                                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.openai",
                                                };
                                                if (args.length > 0 && "object" == typeof args[0] && null !== args[0]) {
                                                    let params = args[0],
                                                        availableTools = (function (params) {
                                                            let availableTools = [
                                                                ...(Array.isArray(params.tools) ? params.tools : []),
                                                                ...(params.web_search_options && "object" == typeof params.web_search_options
                                                                    ? [{ type: "web_search_options", ...params.web_search_options }]
                                                                    : []),
                                                            ];
                                                            if (0 !== availableTools.length)
                                                                try {
                                                                    return JSON.stringify(availableTools);
                                                                } catch (error) {
                                                                    debugBuild.DEBUG_BUILD && debugLogger.debug.error("Failed to serialize OpenAI tools:", error);
                                                                    return;
                                                                }
                                                        })(params);
                                                    (availableTools && (attributes[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE] = availableTools),
                                                        Object.assign(attributes, utils$1.extractRequestParameters(params)));
                                                } else attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = "unknown";
                                                return attributes;
                                            })(args, operationName),
                                            model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] || "unknown",
                                            params = args[0],
                                            isStreamRequested = params && "object" == typeof params && !0 === params.stream,
                                            spanConfig = { name: `${operationName} ${model}`, op: `gen_ai.${operationName}`, attributes: requestAttributes };
                                        if (isStreamRequested) {
                                            let originalResult,
                                                instrumentedPromise = trace.startSpanManual(
                                                    spanConfig,
                                                    (span) => (
                                                        (originalResult = value.apply(obj, args)),
                                                        options.recordInputs &&
                                                            params &&
                                                            addRequestAttributes(span, params, operationName, utils.shouldEnableTruncation(options.enableTruncation)),
                                                        (async () => {
                                                            try {
                                                                let result = await originalResult;
                                                                return streaming.instrumentStream(result, span, options.recordOutputs ?? !1);
                                                            } catch (error) {
                                                                throw (
                                                                    span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                                                    _exports.captureException(error, {
                                                                        mechanism: { handled: !1, type: "auto.ai.openai.stream", data: { function: methodPath } },
                                                                    }),
                                                                    span.end(),
                                                                    error
                                                                );
                                                            }
                                                        })()
                                                    ),
                                                );
                                            return utils.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.openai");
                                        }
                                        let instrumentedPromise = trace.startSpan(
                                            spanConfig,
                                            (span) => (
                                                (originalResult = value.apply(obj, args)),
                                                options.recordInputs &&
                                                    params &&
                                                    addRequestAttributes(span, params, operationName, utils.shouldEnableTruncation(options.enableTruncation)),
                                                originalResult.then(
                                                    (result) => (utils$1.addResponseAttributes(span, result, options.recordOutputs), result),
                                                    (error) => {
                                                        throw (
                                                            _exports.captureException(error, {
                                                                mechanism: { handled: !1, type: "auto.ai.openai", data: { function: methodPath } },
                                                            }),
                                                            error
                                                        );
                                                    },
                                                )
                                            ),
                                        );
                                        return utils.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.openai");
                                    };
                                return "function" == typeof value ? value.bind(obj) : value && "object" == typeof value ? createDeepProxy(value, methodPath, options) : value;
                            },
                        });
                    })(client, "", utils.resolveAIRecordingOptions(options));
                };
            }