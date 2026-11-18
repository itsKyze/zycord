5886(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(8470),
                    vercelAiAttributes = __webpack_require__(3029);
                function applyAccumulatedTokens(spanOrTrace, tokenAccumulator) {
                    let accumulated = tokenAccumulator.get(spanOrTrace.span_id);
                    accumulated &&
                        spanOrTrace.data &&
                        (accumulated.inputTokens > 0 && (spanOrTrace.data[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] = accumulated.inputTokens),
                        accumulated.outputTokens > 0 && (spanOrTrace.data[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] = accumulated.outputTokens),
                        (accumulated.inputTokens > 0 || accumulated.outputTokens > 0) &&
                            (spanOrTrace.data["gen_ai.usage.total_tokens"] = accumulated.inputTokens + accumulated.outputTokens));
                }
                function filterMessagesArray(input) {
                    return input.filter((m) => !!m && "object" == typeof m && "role" in m && "content" in m);
                }
                function convertUserInputToMessagesFormat(userInput) {
                    try {
                        let p = JSON.parse(userInput);
                        if (p && "object" == typeof p) {
                            let { messages } = p,
                                { prompt, system } = p,
                                result = [];
                            if (("string" == typeof system && result.push({ role: "system", content: system }), "string" == typeof messages))
                                try {
                                    messages = JSON.parse(messages);
                                } catch {}
                            if (Array.isArray(messages)) return (result.push(...filterMessagesArray(messages)), result);
                            if (Array.isArray(prompt)) return (result.push(...filterMessagesArray(prompt)), result);
                            if (("string" == typeof prompt && result.push({ role: "user", content: prompt }), result.length > 0)) return result;
                        }
                    } catch {}
                    return [];
                }
                ((exports._INTERNAL_cleanupToolCallSpanContext = function (toolCallId) {
                    constants.toolCallSpanContextMap.delete(toolCallId);
                }),
                    (exports._INTERNAL_getSpanContextForToolCallId = function (toolCallId) {
                        return constants.toolCallSpanContextMap.get(toolCallId);
                    }),
                    (exports.accumulateTokensForParent = function (span, tokenAccumulator) {
                        let parentSpanId = span.parent_span_id;
                        if (!parentSpanId) return;
                        let inputTokens = span.data[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE],
                            outputTokens = span.data[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE];
                        if ("number" == typeof inputTokens || "number" == typeof outputTokens) {
                            let existing = tokenAccumulator.get(parentSpanId) || { inputTokens: 0, outputTokens: 0 };
                            ("number" == typeof inputTokens && (existing.inputTokens += inputTokens),
                                "number" == typeof outputTokens && (existing.outputTokens += outputTokens),
                                tokenAccumulator.set(parentSpanId, existing));
                        }
                    }),
                    (exports.applyAccumulatedTokens = applyAccumulatedTokens),
                    (exports.applyToolDescriptionsAndTokens = function (spans, tokenAccumulator) {
                        let toolDescriptions = (function (spans) {
                            let toolDescriptions = new Map();
                            for (let span of spans) {
                                let availableTools = span.data[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE];
                                if ("string" == typeof availableTools)
                                    try {
                                        for (let tool of JSON.parse(availableTools))
                                            tool.name && tool.description && !toolDescriptions.has(tool.name) && toolDescriptions.set(tool.name, tool.description);
                                    } catch {}
                            }
                            return toolDescriptions;
                        })(spans);
                        for (let span of spans) {
                            if ("gen_ai.execute_tool" === span.op) {
                                let toolName = span.data[genAiAttributes.GEN_AI_TOOL_NAME_ATTRIBUTE];
                                if ("string" == typeof toolName) {
                                    let description = toolDescriptions.get(toolName);
                                    description && (span.data[genAiAttributes.GEN_AI_TOOL_DESCRIPTION_ATTRIBUTE] = description);
                                }
                            }
                            "gen_ai.invoke_agent" === span.op && applyAccumulatedTokens(span, tokenAccumulator);
                        }
                    }),
                    (exports.convertAvailableToolsToJsonString = function (tools) {
                        return JSON.stringify(
                            tools.map((tool) => {
                                if ("string" == typeof tool)
                                    try {
                                        return JSON.parse(tool);
                                    } catch {}
                                return tool;
                            }),
                        );
                    }),
                    (exports.convertUserInputToMessagesFormat = convertUserInputToMessagesFormat),
                    (exports.requestMessagesFromPrompt = function (span, attributes, enableTruncation) {
                        if (
                            "string" != typeof attributes[vercelAiAttributes.AI_PROMPT_ATTRIBUTE] ||
                            attributes[genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE] ||
                            attributes[vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE]
                        ) {
                            if ("string" == typeof attributes[vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE])
                                try {
                                    let messages = JSON.parse(attributes[vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE]);
                                    if (Array.isArray(messages)) {
                                        let { systemInstructions, filteredMessages } = utils.extractSystemInstructions(messages);
                                        systemInstructions && span.setAttribute(genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions);
                                        let filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 0,
                                            messagesJson = enableTruncation ? utils.getTruncatedJsonString(filteredMessages) : utils.getJsonString(filteredMessages);
                                        span.setAttributes({
                                            [vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE]: messagesJson,
                                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: messagesJson,
                                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
                                        });
                                    }
                                } catch {}
                        } else {
                            let messages = convertUserInputToMessagesFormat(attributes[vercelAiAttributes.AI_PROMPT_ATTRIBUTE]);
                            if (messages.length) {
                                let { systemInstructions, filteredMessages } = utils.extractSystemInstructions(messages);
                                systemInstructions && span.setAttribute(genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions);
                                let filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 0,
                                    messagesJson = enableTruncation ? utils.getTruncatedJsonString(filteredMessages) : utils.getJsonString(filteredMessages);
                                span.setAttributes({
                                    [vercelAiAttributes.AI_PROMPT_ATTRIBUTE]: messagesJson,
                                    [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: messagesJson,
                                    [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
                                });
                            }
                        }
                    }));
            }