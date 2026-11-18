5667(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let semanticAttributes = __webpack_require__(3052),
                    genAiAttributes = __webpack_require__(3968),
                    mediaStripping = __webpack_require__(6773),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(227),
                    setIfDefined = (target, key, value) => {
                        null != value && (target[key] = value);
                    },
                    setNumberIfDefined = (target, key, value) => {
                        let n = Number(value);
                        Number.isNaN(n) || (target[key] = n);
                    };
                function asString(v) {
                    if ("string" == typeof v) return v;
                    try {
                        return JSON.stringify(v);
                    } catch {
                        return String(v);
                    }
                }
                function normalizeContent(v) {
                    if (Array.isArray(v))
                        try {
                            let stripped = v.map((part) =>
                                part && "object" == typeof part && mediaStripping.isContentMedia(part) ? mediaStripping.stripInlineMediaFromSingleMessage(part) : part,
                            );
                            return JSON.stringify(stripped);
                        } catch {
                            return String(v);
                        }
                    return asString(v);
                }
                function normalizeMessageRole(role) {
                    let normalized = role.toLowerCase();
                    return constants.ROLE_MAP[normalized] ?? normalized;
                }
                function normalizeRoleNameFromCtor(name) {
                    return name.includes("System")
                        ? "system"
                        : name.includes("Human")
                          ? "user"
                          : name.includes("AI") || name.includes("Assistant")
                            ? "assistant"
                            : name.includes("Function")
                              ? "function"
                              : name.includes("Tool")
                                ? "tool"
                                : "user";
                }
                function normalizeLangChainMessages(messages) {
                    return messages.map((message) => {
                        let maybeGetType = message._getType;
                        if ("function" == typeof maybeGetType) return { role: normalizeMessageRole(maybeGetType.call(message)), content: normalizeContent(message.content) };
                        if (1 === message.lc && message.kwargs) {
                            let id = message.id,
                                messageType = Array.isArray(id) && id.length > 0 ? id[id.length - 1] : "";
                            return {
                                role: normalizeMessageRole("string" == typeof messageType ? normalizeRoleNameFromCtor(messageType) : "user"),
                                content: normalizeContent(message.kwargs?.content),
                            };
                        }
                        if (message.type) return { role: normalizeMessageRole(String(message.type).toLowerCase()), content: normalizeContent(message.content) };
                        if (message.role) return { role: normalizeMessageRole(String(message.role)), content: normalizeContent(message.content) };
                        let ctor = message.constructor?.name;
                        return ctor && "Object" !== ctor
                            ? { role: normalizeMessageRole(normalizeRoleNameFromCtor(ctor)), content: normalizeContent(message.content) }
                            : { role: "user", content: normalizeContent(message.content) };
                    });
                }
                function baseRequestAttributes(system, modelName, serialized, invocationParams, langSmithMetadata) {
                    let attrs, kwargs, temperature, maxTokens, topP, frequencyPenalty, presencePenalty;
                    return {
                        [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: asString(system ?? "langchain"),
                        [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: "chat",
                        [genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE]: asString(modelName),
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGCHAIN_ORIGIN,
                        ...((attrs = {}),
                        (kwargs = "kwargs" in serialized ? serialized.kwargs : void 0),
                        (temperature = invocationParams?.temperature ?? langSmithMetadata?.ls_temperature ?? kwargs?.temperature),
                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE, temperature),
                        (maxTokens = invocationParams?.max_tokens ?? langSmithMetadata?.ls_max_tokens ?? kwargs?.max_tokens),
                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_MAX_TOKENS_ATTRIBUTE, maxTokens),
                        (topP = invocationParams?.top_p ?? kwargs?.top_p),
                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE, topP),
                        (frequencyPenalty = invocationParams?.frequency_penalty),
                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE, frequencyPenalty),
                        (presencePenalty = invocationParams?.presence_penalty),
                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE, presencePenalty),
                        invocationParams && "stream" in invocationParams && setIfDefined(attrs, genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE, !!invocationParams.stream),
                        attrs),
                    };
                }
                ((exports.extractChatModelRequestAttributes = function (llm, langChainMessages, recordInputs, enableTruncation, invocationParams, langSmithMetadata) {
                    let attrs = baseRequestAttributes(
                        langSmithMetadata?.ls_provider ?? llm.id?.[2],
                        invocationParams?.model ?? langSmithMetadata?.ls_model_name ?? "unknown",
                        llm,
                        invocationParams,
                        langSmithMetadata,
                    );
                    if (recordInputs && Array.isArray(langChainMessages) && langChainMessages.length > 0) {
                        let normalized = normalizeLangChainMessages(langChainMessages.flat()),
                            { systemInstructions, filteredMessages } = utils.extractSystemInstructions(normalized);
                        systemInstructions && setIfDefined(attrs, genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions);
                        let filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 0;
                        (setIfDefined(attrs, genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, filteredLength),
                            setIfDefined(
                                attrs,
                                genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE,
                                enableTruncation ? utils.getTruncatedJsonString(filteredMessages) : utils.getJsonString(filteredMessages),
                            ));
                    }
                    return attrs;
                }),
                    (exports.extractLLMRequestAttributes = function (llm, prompts, recordInputs, enableTruncation, invocationParams, langSmithMetadata) {
                        let attrs = baseRequestAttributes(
                            langSmithMetadata?.ls_provider,
                            invocationParams?.model ?? langSmithMetadata?.ls_model_name ?? "unknown",
                            llm,
                            invocationParams,
                            langSmithMetadata,
                        );
                        if (recordInputs && Array.isArray(prompts) && prompts.length > 0) {
                            setIfDefined(attrs, genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, prompts.length);
                            let messages = prompts.map((p) => ({ role: "user", content: p }));
                            setIfDefined(
                                attrs,
                                genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE,
                                enableTruncation ? utils.getTruncatedJsonString(messages) : utils.getJsonString(messages),
                            );
                        }
                        return attrs;
                    }),
                    (exports.extractLlmResponseAttributes = function (llmResult, recordOutputs) {
                        if (!llmResult) return;
                        let attrs = {};
                        if (Array.isArray(llmResult.generations)) {
                            let finishReasons = llmResult.generations
                                .flat()
                                .map((g) =>
                                    g.generationInfo?.finish_reason ? g.generationInfo.finish_reason : g.generation_info?.finish_reason ? g.generation_info.finish_reason : null,
                                )
                                .filter((r) => "string" == typeof r);
                            finishReasons.length > 0 && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE, asString(finishReasons));
                            var generations = llmResult.generations;
                            let toolCalls = [];
                            for (let gen of generations.flat()) {
                                let content = gen.message?.content;
                                if (Array.isArray(content)) for (let item of content) "tool_use" === item.type && toolCalls.push(item);
                            }
                            if ((toolCalls.length > 0 && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, asString(toolCalls)), recordOutputs)) {
                                let texts = llmResult.generations
                                    .flat()
                                    .map((gen) => gen.text ?? gen.message?.content)
                                    .filter((t) => "string" == typeof t);
                                texts.length > 0 && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE, asString(texts));
                            }
                        }
                        !(function (llmOutput, attrs) {
                            if (!llmOutput) return;
                            let tokenUsage = llmOutput.tokenUsage,
                                anthropicUsage = llmOutput.usage;
                            if (tokenUsage)
                                (setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE, tokenUsage.promptTokens),
                                    setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE, tokenUsage.completionTokens),
                                    setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE, tokenUsage.totalTokens));
                            else if (anthropicUsage) {
                                (setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE, anthropicUsage.input_tokens),
                                    setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE, anthropicUsage.output_tokens));
                                let input = Number(anthropicUsage.input_tokens),
                                    output = Number(anthropicUsage.output_tokens),
                                    total = (Number.isNaN(input) ? 0 : input) + (Number.isNaN(output) ? 0 : output);
                                (total > 0 && setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE, total),
                                    void 0 !== anthropicUsage.cache_creation_input_tokens &&
                                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_CACHE_CREATION_INPUT_TOKENS_ATTRIBUTE, anthropicUsage.cache_creation_input_tokens),
                                    void 0 !== anthropicUsage.cache_read_input_tokens &&
                                        setNumberIfDefined(attrs, genAiAttributes.GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS_ATTRIBUTE, anthropicUsage.cache_read_input_tokens));
                            }
                        })(llmResult.llmOutput, attrs);
                        let llmOutput = llmResult.llmOutput,
                            firstGeneration = llmResult.generations?.[0]?.[0],
                            v1Message = firstGeneration?.message,
                            modelName = llmOutput?.model_name ?? llmOutput?.model ?? v1Message?.response_metadata?.model_name;
                        modelName && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE, modelName);
                        let responseId = llmOutput?.id ?? v1Message?.id;
                        responseId && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE, responseId);
                        let stopReason = llmOutput?.stop_reason ?? v1Message?.response_metadata?.finish_reason;
                        return (stopReason && setIfDefined(attrs, genAiAttributes.GEN_AI_RESPONSE_STOP_REASON_ATTRIBUTE, asString(stopReason)), attrs);
                    }),
                    (exports.getInvocationParams = function (tags) {
                        if (!(!tags || Array.isArray(tags))) return tags.invocation_params;
                    }),
                    (exports.normalizeLangChainMessages = normalizeLangChainMessages));
            }