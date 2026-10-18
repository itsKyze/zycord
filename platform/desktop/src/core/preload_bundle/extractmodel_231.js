231(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    handleCallbackErrors = __webpack_require__(8797),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(4570),
                    streaming = __webpack_require__(5163),
                    utils$1 = __webpack_require__(1554);
                function extractModel(params, context) {
                    if ("model" in params && "string" == typeof params.model) return params.model;
                    if (context && "object" == typeof context) {
                        if ("model" in context && "string" == typeof context.model) return context.model;
                        if ("modelVersion" in context && "string" == typeof context.modelVersion) return context.modelVersion;
                    }
                    return "unknown";
                }
                function addPrivateRequestAttributes(span, params, isEmbeddings, enableTruncation) {
                    if (isEmbeddings) {
                        let contents = params.contents;
                        null != contents && span.setAttribute(genAiAttributes.GEN_AI_EMBEDDINGS_INPUT_ATTRIBUTE, "string" == typeof contents ? contents : JSON.stringify(contents));
                        return;
                    }
                    let messages = [];
                    if (
                        ("config" in params &&
                            params.config &&
                            "object" == typeof params.config &&
                            "systemInstruction" in params.config &&
                            params.config.systemInstruction &&
                            messages.push(...utils$1.contentUnionToMessages(params.config.systemInstruction, "system")),
                        "history" in params && messages.push(...utils$1.contentUnionToMessages(params.history, "user")),
                        "contents" in params && messages.push(...utils$1.contentUnionToMessages(params.contents, "user")),
                        "message" in params && messages.push(...utils$1.contentUnionToMessages(params.message, "user")),
                        Array.isArray(messages) && messages.length)
                    ) {
                        let { systemInstructions, filteredMessages } = utils.extractSystemInstructions(messages);
                        systemInstructions && span.setAttribute(genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions);
                        let filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 0;
                        span.setAttributes({
                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: enableTruncation
                                ? utils.getTruncatedJsonString(filteredMessages)
                                : utils.getJsonString(filteredMessages),
                        });
                    }
                }
                ((exports.extractModel = extractModel),
                    (exports.instrumentGoogleGenAIClient = function (client, options) {
                        return (function createDeepProxy(target, currentPath = "", options) {
                            return new Proxy(target, {
                                get: (t, prop, receiver) => {
                                    let value = Reflect.get(t, prop, receiver),
                                        methodPath = utils.buildMethodPath(currentPath, String(prop)),
                                        instrumentedMethod = constants.GOOGLE_GENAI_METHOD_REGISTRY[methodPath];
                                    if ("function" == typeof value && instrumentedMethod) {
                                        let isEmbeddings,
                                            wrappedMethod = instrumentedMethod.operation
                                                ? ((isEmbeddings = "embeddings" === instrumentedMethod.operation),
                                                  new Proxy(value, {
                                                      apply(target, _, args) {
                                                          let operationName = instrumentedMethod.operation || "unknown",
                                                              params = args[0],
                                                              requestAttributes = (function (operationName, params, context) {
                                                                  let attributes = {
                                                                      [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: constants.GOOGLE_GENAI_SYSTEM_NAME,
                                                                      [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: operationName,
                                                                      [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.google_genai",
                                                                  };
                                                                  if (params) {
                                                                      if (
                                                                          ((attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = extractModel(params, context)),
                                                                          "config" in params && "object" == typeof params.config && params.config)
                                                                      ) {
                                                                          let attributes1,
                                                                              config = params.config;
                                                                          if (
                                                                              (Object.assign(
                                                                                  attributes,
                                                                                  ((attributes1 = {}),
                                                                                  "temperature" in config &&
                                                                                      "number" == typeof config.temperature &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE] = config.temperature),
                                                                                  "topP" in config &&
                                                                                      "number" == typeof config.topP &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE] = config.topP),
                                                                                  "topK" in config &&
                                                                                      "number" == typeof config.topK &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_TOP_K_ATTRIBUTE] = config.topK),
                                                                                  "maxOutputTokens" in config &&
                                                                                      "number" == typeof config.maxOutputTokens &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_MAX_TOKENS_ATTRIBUTE] = config.maxOutputTokens),
                                                                                  "frequencyPenalty" in config &&
                                                                                      "number" == typeof config.frequencyPenalty &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE] =
                                                                                          config.frequencyPenalty),
                                                                                  "presencePenalty" in config &&
                                                                                      "number" == typeof config.presencePenalty &&
                                                                                      (attributes1[genAiAttributes.GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE] =
                                                                                          config.presencePenalty),
                                                                                  attributes1),
                                                                              ),
                                                                              "tools" in config && Array.isArray(config.tools))
                                                                          ) {
                                                                              let functionDeclarations = config.tools.flatMap((tool) => tool.functionDeclarations);
                                                                              attributes[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE] =
                                                                                  JSON.stringify(functionDeclarations);
                                                                          }
                                                                      }
                                                                  } else attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = extractModel({}, context);
                                                                  return attributes;
                                                              })(operationName, params, t),
                                                              model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] ?? "unknown";
                                                          return instrumentedMethod.streaming
                                                              ? trace.startSpanManual(
                                                                    { name: `${operationName} ${model}`, op: `gen_ai.${operationName}`, attributes: requestAttributes },
                                                                    async (span) => {
                                                                        try {
                                                                            options.recordInputs &&
                                                                                params &&
                                                                                addPrivateRequestAttributes(
                                                                                    span,
                                                                                    params,
                                                                                    isEmbeddings,
                                                                                    utils.shouldEnableTruncation(options.enableTruncation),
                                                                                );
                                                                            let stream = await target.apply(t, args);
                                                                            return streaming.instrumentStream(stream, span, !!options.recordOutputs);
                                                                        } catch (error) {
                                                                            throw (
                                                                                span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                                                                _exports.captureException(error, {
                                                                                    mechanism: { handled: !1, type: "auto.ai.google_genai", data: { function: methodPath } },
                                                                                }),
                                                                                span.end(),
                                                                                error
                                                                            );
                                                                        }
                                                                    },
                                                                )
                                                              : trace.startSpan(
                                                                    { name: `${operationName} ${model}`, op: `gen_ai.${operationName}`, attributes: requestAttributes },
                                                                    (span) => (
                                                                        options.recordInputs &&
                                                                            params &&
                                                                            addPrivateRequestAttributes(
                                                                                span,
                                                                                params,
                                                                                isEmbeddings,
                                                                                utils.shouldEnableTruncation(options.enableTruncation),
                                                                            ),
                                                                        handleCallbackErrors.handleCallbackErrors(
                                                                            () => target.apply(t, args),
                                                                            (error) => {
                                                                                _exports.captureException(error, {
                                                                                    mechanism: { handled: !1, type: "auto.ai.google_genai", data: { function: methodPath } },
                                                                                });
                                                                            },
                                                                            () => {},
                                                                            (result) => {
                                                                                isEmbeddings ||
                                                                                    (function (span, response, recordOutputs) {
                                                                                        if (response && "object" == typeof response) {
                                                                                            if (
                                                                                                (response.modelVersion &&
                                                                                                    span.setAttribute(
                                                                                                        genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE,
                                                                                                        response.modelVersion,
                                                                                                    ),
                                                                                                response.usageMetadata && "object" == typeof response.usageMetadata)
                                                                                            ) {
                                                                                                let usage = response.usageMetadata;
                                                                                                ("number" == typeof usage.promptTokenCount &&
                                                                                                    span.setAttributes({
                                                                                                        [genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE]:
                                                                                                            usage.promptTokenCount,
                                                                                                    }),
                                                                                                    "number" == typeof usage.candidatesTokenCount &&
                                                                                                        span.setAttributes({
                                                                                                            [genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]:
                                                                                                                usage.candidatesTokenCount,
                                                                                                        }),
                                                                                                    "number" == typeof usage.totalTokenCount &&
                                                                                                        span.setAttributes({
                                                                                                            [genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE]:
                                                                                                                usage.totalTokenCount,
                                                                                                        }));
                                                                                            }
                                                                                            if (
                                                                                                recordOutputs &&
                                                                                                Array.isArray(response.candidates) &&
                                                                                                response.candidates.length > 0
                                                                                            ) {
                                                                                                let responseTexts = response.candidates
                                                                                                    .map((candidate) =>
                                                                                                        candidate.content?.parts && Array.isArray(candidate.content.parts)
                                                                                                            ? candidate.content.parts
                                                                                                                  .map((part) => ("string" == typeof part.text ? part.text : ""))
                                                                                                                  .filter((text) => text.length > 0)
                                                                                                                  .join("")
                                                                                                            : "",
                                                                                                    )
                                                                                                    .filter((text) => text.length > 0);
                                                                                                responseTexts.length > 0 &&
                                                                                                    span.setAttributes({
                                                                                                        [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: responseTexts.join(""),
                                                                                                    });
                                                                                            }
                                                                                            if (recordOutputs && response.functionCalls) {
                                                                                                let functionCalls = response.functionCalls;
                                                                                                Array.isArray(functionCalls) &&
                                                                                                    functionCalls.length > 0 &&
                                                                                                    span.setAttributes({
                                                                                                        [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]:
                                                                                                            JSON.stringify(functionCalls),
                                                                                                    });
                                                                                            }
                                                                                        }
                                                                                    })(span, result, options.recordOutputs);
                                                                            },
                                                                        )
                                                                    ),
                                                                );
                                                      },
                                                  }))
                                                : value.bind(t);
                                        return instrumentedMethod.proxyResultPath
                                            ? function (...args) {
                                                  let result = wrappedMethod(...args);
                                                  return result && "object" == typeof result ? createDeepProxy(result, instrumentedMethod.proxyResultPath, options) : result;
                                              }
                                            : wrappedMethod;
                                    }
                                    return "function" == typeof value ? value.bind(t) : value && "object" == typeof value ? createDeepProxy(value, methodPath, options) : value;
                                },
                            });
                        })(client, "", utils.resolveAIRecordingOptions(options));
                    }));
            }