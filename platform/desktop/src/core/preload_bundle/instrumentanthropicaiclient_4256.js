4256(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(9813),
                    streaming = __webpack_require__(1296),
                    utils$1 = __webpack_require__(2713);
                function addPrivateRequestAttributes(span, params, enableTruncation) {
                    let messages = utils$1.messagesFromParams(params);
                    (utils$1.setMessagesAttribute(span, messages, enableTruncation),
                        "prompt" in params && span.setAttributes({ [genAiAttributes.GEN_AI_PROMPT_ATTRIBUTE]: JSON.stringify(params.prompt) }));
                }
                function handleStreamingError(error, span, methodPath) {
                    throw (
                        _exports.captureException(error, { mechanism: { handled: !1, type: "auto.ai.anthropic", data: { function: methodPath } } }),
                        span.isRecording() && (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }), span.end()),
                        error
                    );
                }
                exports.instrumentAnthropicAiClient = function (anthropicAiClient, options) {
                    return (function createDeepProxy(target, currentPath = "", options) {
                        return new Proxy(target, {
                            get(obj, prop) {
                                let value = obj[prop],
                                    methodPath = utils.buildMethodPath(currentPath, String(prop)),
                                    instrumentedMethod = constants.ANTHROPIC_METHOD_REGISTRY[methodPath];
                                if ("function" == typeof value && instrumentedMethod)
                                    return new Proxy(value, {
                                        apply(target, thisArg, args) {
                                            let originalResult,
                                                operationName = instrumentedMethod.operation || "unknown",
                                                requestAttributes = (function (args, methodPath, operationName) {
                                                    let attributes = {
                                                        [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: "anthropic",
                                                        [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: operationName,
                                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.anthropic",
                                                    };
                                                    if (args.length > 0 && "object" == typeof args[0] && null !== args[0]) {
                                                        let params = args[0];
                                                        (params.tools &&
                                                            Array.isArray(params.tools) &&
                                                            (attributes[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE] = JSON.stringify(params.tools)),
                                                            (attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = params.model ?? "unknown"),
                                                            "temperature" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE] = params.temperature),
                                                            "top_p" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE] = params.top_p),
                                                            "stream" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE] = params.stream),
                                                            "top_k" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_TOP_K_ATTRIBUTE] = params.top_k),
                                                            "frequency_penalty" in params &&
                                                                (attributes[genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE] = params.frequency_penalty),
                                                            "max_tokens" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_MAX_TOKENS_ATTRIBUTE] = params.max_tokens));
                                                    } else
                                                        "models.retrieve" === methodPath || "models.get" === methodPath
                                                            ? (attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = args[0])
                                                            : (attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = "unknown");
                                                    return attributes;
                                                })(args, methodPath, operationName),
                                                model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] ?? "unknown",
                                                params = "object" == typeof args[0] ? args[0] : void 0,
                                                isStreamRequested = !!params?.stream,
                                                isStreamingMethod = !0 === instrumentedMethod.streaming;
                                            if (isStreamRequested || isStreamingMethod) {
                                                let model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] ?? "unknown",
                                                    spanConfig = { name: `${operationName} ${model}`, op: `gen_ai.${operationName}`, attributes: requestAttributes };
                                                if (!isStreamRequested || isStreamingMethod)
                                                    return trace.startSpanManual(spanConfig, (span) => {
                                                        try {
                                                            options.recordInputs &&
                                                                params &&
                                                                addPrivateRequestAttributes(span, params, utils.shouldEnableTruncation(options.enableTruncation));
                                                            let messageStream = target.apply(obj, args);
                                                            return streaming.instrumentMessageStream(messageStream, span, options.recordOutputs ?? !1);
                                                        } catch (error) {
                                                            return handleStreamingError(error, span, methodPath);
                                                        }
                                                    });
                                                {
                                                    let originalResult,
                                                        instrumentedPromise = trace.startSpanManual(
                                                            spanConfig,
                                                            (span) => (
                                                                (originalResult = value.apply(obj, args)),
                                                                options.recordInputs &&
                                                                    params &&
                                                                    addPrivateRequestAttributes(span, params, utils.shouldEnableTruncation(options.enableTruncation)),
                                                                (async () => {
                                                                    try {
                                                                        let result = await originalResult;
                                                                        return streaming.instrumentAsyncIterableStream(result, span, options.recordOutputs ?? !1);
                                                                    } catch (error) {
                                                                        return handleStreamingError(error, span, methodPath);
                                                                    }
                                                                })()
                                                            ),
                                                        );
                                                    return utils.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.anthropic");
                                                }
                                            }
                                            let instrumentedPromise = trace.startSpan(
                                                { name: `${operationName} ${model}`, op: `gen_ai.${operationName}`, attributes: requestAttributes },
                                                (span) => (
                                                    (originalResult = target.apply(obj, args)),
                                                    options.recordInputs &&
                                                        params &&
                                                        addPrivateRequestAttributes(span, params, utils.shouldEnableTruncation(options.enableTruncation)),
                                                    originalResult.then(
                                                        (result) => (
                                                            !(function (span, response, recordOutputs) {
                                                                if (response && "object" == typeof response) {
                                                                    if ("type" in response && "error" === response.type) return utils$1.handleResponseError(span, response);
                                                                    (recordOutputs &&
                                                                        (function (span, response) {
                                                                            if ("content" in response && Array.isArray(response.content)) {
                                                                                span.setAttributes({
                                                                                    [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: response.content
                                                                                        .map((item) => item.text)
                                                                                        .filter((text) => !!text)
                                                                                        .join(""),
                                                                                });
                                                                                let toolCalls = [];
                                                                                for (let item of response.content)
                                                                                    ("tool_use" === item.type || "server_tool_use" === item.type) && toolCalls.push(item);
                                                                                toolCalls.length > 0 &&
                                                                                    span.setAttributes({
                                                                                        [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]: JSON.stringify(toolCalls),
                                                                                    });
                                                                            }
                                                                            ("completion" in response &&
                                                                                span.setAttributes({ [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: response.completion }),
                                                                                "input_tokens" in response &&
                                                                                    span.setAttributes({
                                                                                        [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: JSON.stringify(response.input_tokens),
                                                                                    }));
                                                                        })(span, response),
                                                                        "id" in response &&
                                                                            "model" in response &&
                                                                            (span.setAttributes({
                                                                                [genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE]: response.id,
                                                                                [genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE]: response.model,
                                                                            }),
                                                                            "usage" in response &&
                                                                                response.usage &&
                                                                                utils.setTokenUsageAttributes(
                                                                                    span,
                                                                                    response.usage.input_tokens,
                                                                                    response.usage.output_tokens,
                                                                                    response.usage.cache_creation_input_tokens,
                                                                                    response.usage.cache_read_input_tokens,
                                                                                )));
                                                                }
                                                            })(span, result, options.recordOutputs),
                                                            result
                                                        ),
                                                        (error) => {
                                                            throw (
                                                                _exports.captureException(error, {
                                                                    mechanism: { handled: !1, type: "auto.ai.anthropic", data: { function: methodPath } },
                                                                }),
                                                                error
                                                            );
                                                        },
                                                    )
                                                ),
                                            );
                                            return utils.wrapPromiseWithMethods(originalResult, instrumentedPromise, "auto.ai.anthropic");
                                        },
                                    });
                                return "function" == typeof value ? value.bind(obj) : value && "object" == typeof value ? createDeepProxy(value, methodPath, options) : value;
                            },
                        });
                    })(anthropicAiClient, "", utils.resolveAIRecordingOptions(options));
                };
            }