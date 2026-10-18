6366(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(5667);
                function extractToolCalls(messages) {
                    if (!messages || 0 === messages.length) return null;
                    let toolCalls = [];
                    for (let message of messages)
                        if (message && "object" == typeof message) {
                            let msgToolCalls = message.tool_calls;
                            msgToolCalls && Array.isArray(msgToolCalls) && toolCalls.push(...msgToolCalls);
                        }
                    return toolCalls.length > 0 ? toolCalls : null;
                }
                function extractTokenUsageFromMessage(message) {
                    let inputTokens = 0,
                        outputTokens = 0,
                        totalTokens = 0;
                    if (message.usage_metadata && "object" == typeof message.usage_metadata) {
                        let usage = message.usage_metadata;
                        return (
                            "number" == typeof usage.input_tokens && (inputTokens = usage.input_tokens),
                            "number" == typeof usage.output_tokens && (outputTokens = usage.output_tokens),
                            "number" == typeof usage.total_tokens && (totalTokens = usage.total_tokens),
                            { inputTokens, outputTokens, totalTokens }
                        );
                    }
                    if (message.response_metadata && "object" == typeof message.response_metadata) {
                        let metadata = message.response_metadata;
                        if (metadata.tokenUsage && "object" == typeof metadata.tokenUsage) {
                            let tokenUsage = metadata.tokenUsage;
                            ("number" == typeof tokenUsage.promptTokens && (inputTokens = tokenUsage.promptTokens),
                                "number" == typeof tokenUsage.completionTokens && (outputTokens = tokenUsage.completionTokens),
                                "number" == typeof tokenUsage.totalTokens && (totalTokens = tokenUsage.totalTokens));
                        }
                    }
                    return { inputTokens, outputTokens, totalTokens };
                }
                function extractModelMetadata(span, message) {
                    if (message.response_metadata && "object" == typeof message.response_metadata) {
                        let metadata = message.response_metadata;
                        (metadata.model_name && "string" == typeof metadata.model_name && span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE, metadata.model_name),
                            metadata.finish_reason &&
                                "string" == typeof metadata.finish_reason &&
                                span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE, [metadata.finish_reason]));
                    }
                }
                ((exports.extractModelMetadata = extractModelMetadata),
                    (exports.extractTokenUsageFromMessage = extractTokenUsageFromMessage),
                    (exports.extractToolCalls = extractToolCalls),
                    (exports.extractToolsFromCompiledGraph = function (compiledGraph) {
                        if (!compiledGraph.builder?.nodes?.tools?.runnable?.tools) return null;
                        let tools = compiledGraph.builder?.nodes?.tools?.runnable?.tools;
                        return tools && Array.isArray(tools) && 0 !== tools.length
                            ? tools.map((tool) => ({ name: tool.lc_kwargs?.name, description: tool.lc_kwargs?.description, schema: tool.lc_kwargs?.schema }))
                            : null;
                    }),
                    (exports.setResponseAttributes = function (span, inputMessages, result) {
                        let outputMessages = result?.messages;
                        if (!outputMessages || !Array.isArray(outputMessages)) return;
                        let inputCount = inputMessages?.length ?? 0,
                            newMessages = outputMessages.length > inputCount ? outputMessages.slice(inputCount) : [];
                        if (0 === newMessages.length) return;
                        let toolCalls = extractToolCalls(newMessages);
                        toolCalls && span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, JSON.stringify(toolCalls));
                        let normalizedNewMessages = utils.normalizeLangChainMessages(newMessages);
                        span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE, JSON.stringify(normalizedNewMessages));
                        let totalInputTokens = 0,
                            totalOutputTokens = 0,
                            totalTokens = 0;
                        for (let message of newMessages) {
                            let tokens = extractTokenUsageFromMessage(message);
                            ((totalInputTokens += tokens.inputTokens),
                                (totalOutputTokens += tokens.outputTokens),
                                (totalTokens += tokens.totalTokens),
                                extractModelMetadata(span, message));
                        }
                        (totalInputTokens > 0 && span.setAttribute(genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE, totalInputTokens),
                            totalOutputTokens > 0 && span.setAttribute(genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE, totalOutputTokens),
                            totalTokens > 0 && span.setAttribute(genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE, totalTokens));
                    }));
            }