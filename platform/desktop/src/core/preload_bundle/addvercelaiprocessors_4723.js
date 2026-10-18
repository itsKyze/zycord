4723(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    semanticAttributes = __webpack_require__(3052),
                    utils = __webpack_require__(782),
                    spanUtils = __webpack_require__(470),
                    genAiAttributes = __webpack_require__(3968),
                    constants = __webpack_require__(8470),
                    utils$1 = __webpack_require__(5886),
                    vercelAiAttributes = __webpack_require__(3029);
                function onVercelAiSpanStart(span) {
                    let { data: attributes, description: name } = spanUtils.spanToJSON(span);
                    if (!name) return;
                    if (attributes[vercelAiAttributes.AI_TOOL_CALL_NAME_ATTRIBUTE] && attributes[vercelAiAttributes.AI_TOOL_CALL_ID_ATTRIBUTE] && "ai.toolCall" === name) {
                        var span1, attributes1;
                        let toolCallId, toolName;
                        return void ((span1 = span),
                        (attributes1 = attributes),
                        span1.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, "auto.vercelai.otel"),
                        span1.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, "gen_ai.execute_tool"),
                        span1.setAttribute(genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE, "execute_tool"),
                        renameAttributeKey(attributes1, vercelAiAttributes.AI_TOOL_CALL_NAME_ATTRIBUTE, genAiAttributes.GEN_AI_TOOL_NAME_ATTRIBUTE),
                        renameAttributeKey(attributes1, vercelAiAttributes.AI_TOOL_CALL_ID_ATTRIBUTE, genAiAttributes.GEN_AI_TOOL_CALL_ID_ATTRIBUTE),
                        "string" == typeof (toolCallId = attributes1[genAiAttributes.GEN_AI_TOOL_CALL_ID_ATTRIBUTE]) &&
                            constants.toolCallSpanContextMap.set(toolCallId, span1.spanContext()),
                        attributes1[genAiAttributes.GEN_AI_TOOL_TYPE_ATTRIBUTE] || span1.setAttribute(genAiAttributes.GEN_AI_TOOL_TYPE_ATTRIBUTE, "function"),
                        (toolName = attributes1[genAiAttributes.GEN_AI_TOOL_NAME_ATTRIBUTE]) && span1.updateName(`execute_tool ${toolName}`));
                    }
                    if (!attributes[vercelAiAttributes.AI_OPERATION_ID_ATTRIBUTE] && !name.startsWith("ai.")) return;
                    let client = currentScopes.getClient(),
                        integration = client?.getIntegrationByName("VercelAI");
                    !(function (span, name, attributes, enableTruncation) {
                        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, "auto.vercelai.otel");
                        let nameWthoutAi = name.replace("ai.", "");
                        (span.setAttribute("ai.pipeline.name", nameWthoutAi), span.updateName(nameWthoutAi));
                        let functionId = attributes[vercelAiAttributes.AI_TELEMETRY_FUNCTION_ID_ATTRIBUTE];
                        (functionId && "string" == typeof functionId && span.setAttribute("gen_ai.function_id", functionId),
                            utils$1.requestMessagesFromPrompt(span, attributes, enableTruncation),
                            attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE] &&
                                !attributes[genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE] &&
                                span.setAttribute(genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE, attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]),
                            span.setAttribute("ai.streaming", name.includes("stream")));
                        let operationName = constants.SPAN_TO_OPERATION_NAME.get(name);
                        if (
                            (operationName
                                ? span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, `gen_ai.${operationName}`)
                                : name.startsWith("ai.stream") && span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, "ai.run"),
                            "invoke_agent" === operationName)
                        )
                            return functionId && "string" == typeof functionId ? span.updateName(`invoke_agent ${functionId}`) : span.updateName("invoke_agent");
                        let modelId = attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE];
                        modelId && operationName && span.updateName(`${operationName} ${modelId}`);
                    })(span, name, attributes, utils.shouldEnableTruncation(integration?.options?.enableTruncation));
                }
                function vercelAiEventProcessor(event) {
                    if ("transaction" === event.type && event.spans) {
                        let tokenAccumulator = new Map();
                        for (let span of event.spans)
                            ((function (span) {
                                let { data: attributes, origin } = span;
                                if ("auto.vercelai.otel" === origin) {
                                    if (
                                        (span.status && "ok" !== span.status && (span.status = "internal_error"),
                                        renameAttributeKey(
                                            attributes,
                                            vercelAiAttributes.AI_USAGE_COMPLETION_TOKENS_ATTRIBUTE,
                                            genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE,
                                        ),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_USAGE_PROMPT_TOKENS_ATTRIBUTE, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE),
                                        renameAttributeKey(
                                            attributes,
                                            vercelAiAttributes.AI_USAGE_CACHED_INPUT_TOKENS_ATTRIBUTE,
                                            genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE,
                                        ),
                                        renameAttributeKey(attributes, "ai.usage.inputTokens", genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE),
                                        renameAttributeKey(attributes, "ai.usage.outputTokens", genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_USAGE_TOKENS_ATTRIBUTE, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE),
                                        renameAttributeKey(attributes, "ai.response.avgOutputTokensPerSecond", "ai.response.avgCompletionTokensPerSecond"),
                                        "number" == typeof attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] &&
                                            "number" == typeof attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE] &&
                                            (attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] =
                                                attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] +
                                                attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE]),
                                        "number" == typeof attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE])
                                    ) {
                                        let outputTokens =
                                            "number" == typeof attributes[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]
                                                ? attributes[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]
                                                : 0;
                                        attributes[genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] =
                                            outputTokens + attributes[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE];
                                    }
                                    if (
                                        (attributes[vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE] &&
                                            Array.isArray(attributes[vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE]) &&
                                            (attributes[vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE] = utils$1.convertAvailableToolsToJsonString(
                                                attributes[vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE],
                                            )),
                                        attributes[vercelAiAttributes.OPERATION_NAME_ATTRIBUTE])
                                    ) {
                                        let rawOperationName = attributes[vercelAiAttributes.AI_OPERATION_ID_ATTRIBUTE]
                                                ? attributes[vercelAiAttributes.AI_OPERATION_ID_ATTRIBUTE]
                                                : attributes[vercelAiAttributes.OPERATION_NAME_ATTRIBUTE],
                                            operationName = constants.SPAN_TO_OPERATION_NAME.get(rawOperationName) ?? rawOperationName;
                                        ((attributes[genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE] = operationName),
                                            delete attributes[vercelAiAttributes.OPERATION_NAME_ATTRIBUTE]);
                                    }
                                    if (
                                        (renameAttributeKey(attributes, vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE, genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE),
                                        !(function (attributes) {
                                            let responseText = attributes[vercelAiAttributes.AI_RESPONSE_TEXT_ATTRIBUTE],
                                                responseToolCalls = attributes[vercelAiAttributes.AI_RESPONSE_TOOL_CALLS_ATTRIBUTE],
                                                finishReason = attributes[vercelAiAttributes.AI_RESPONSE_FINISH_REASON_ATTRIBUTE];
                                            if (null == responseText && null == responseToolCalls) return;
                                            let parts = [];
                                            if (
                                                ("string" == typeof responseText && responseText.length > 0 && parts.push({ type: "text", content: responseText }),
                                                null != responseToolCalls)
                                            )
                                                try {
                                                    let toolCalls = "string" == typeof responseToolCalls ? JSON.parse(responseToolCalls) : responseToolCalls;
                                                    if (Array.isArray(toolCalls)) {
                                                        for (let toolCall of toolCalls) {
                                                            let args = toolCall.input ?? toolCall.args;
                                                            parts.push({
                                                                type: "tool_call",
                                                                id: toolCall.toolCallId,
                                                                name: toolCall.toolName,
                                                                arguments: "string" == typeof args ? args : JSON.stringify(args ?? {}),
                                                            });
                                                        }
                                                        delete attributes[vercelAiAttributes.AI_RESPONSE_TOOL_CALLS_ATTRIBUTE];
                                                    }
                                                } catch {}
                                            if (parts.length > 0) {
                                                let outputMessage = {
                                                    role: "assistant",
                                                    parts,
                                                    finish_reason: "string" != typeof finishReason ? "stop" : "tool-calls" === finishReason ? "tool_call" : finishReason,
                                                };
                                                ((attributes[genAiAttributes.GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE] = JSON.stringify([outputMessage])),
                                                    delete attributes[vercelAiAttributes.AI_RESPONSE_TEXT_ATTRIBUTE]);
                                            }
                                        })(attributes),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_RESPONSE_OBJECT_ATTRIBUTE, "gen_ai.response.object"),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE, "gen_ai.request.available_tools"),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_ARGS_ATTRIBUTE, genAiAttributes.GEN_AI_TOOL_INPUT_ATTRIBUTE),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_RESULT_ATTRIBUTE, genAiAttributes.GEN_AI_TOOL_OUTPUT_ATTRIBUTE),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_SCHEMA_ATTRIBUTE, "gen_ai.request.schema"),
                                        renameAttributeKey(attributes, vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE, genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE),
                                        Array.isArray(attributes[vercelAiAttributes.AI_VALUES_ATTRIBUTE]))
                                    ) {
                                        let parsed = attributes[vercelAiAttributes.AI_VALUES_ATTRIBUTE].map((v) => {
                                            try {
                                                return JSON.parse(v);
                                            } catch {
                                                return v;
                                            }
                                        });
                                        attributes[genAiAttributes.GEN_AI_EMBEDDINGS_INPUT_ATTRIBUTE] = 1 === parsed.length ? parsed[0] : JSON.stringify(parsed);
                                    }
                                    for (let key of ((function (attributes) {
                                        let providerMetadata = attributes[vercelAiAttributes.AI_RESPONSE_PROVIDER_METADATA_ATTRIBUTE];
                                        if (providerMetadata)
                                            try {
                                                let providerMetadataObject = JSON.parse(providerMetadata),
                                                    openaiMetadata = providerMetadataObject.openai ?? providerMetadataObject.azure;
                                                if (
                                                    (openaiMetadata &&
                                                        (setAttributeIfDefined(
                                                            attributes,
                                                            genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE,
                                                            openaiMetadata.cachedPromptTokens,
                                                        ),
                                                        setAttributeIfDefined(attributes, "gen_ai.usage.output_tokens.reasoning", openaiMetadata.reasoningTokens),
                                                        setAttributeIfDefined(
                                                            attributes,
                                                            "gen_ai.usage.output_tokens.prediction_accepted",
                                                            openaiMetadata.acceptedPredictionTokens,
                                                        ),
                                                        setAttributeIfDefined(
                                                            attributes,
                                                            "gen_ai.usage.output_tokens.prediction_rejected",
                                                            openaiMetadata.rejectedPredictionTokens,
                                                        ),
                                                        attributes["gen_ai.conversation.id"] ||
                                                            setAttributeIfDefined(attributes, "gen_ai.conversation.id", openaiMetadata.responseId)),
                                                    providerMetadataObject.anthropic)
                                                ) {
                                                    let cachedInputTokens =
                                                        providerMetadataObject.anthropic.usage?.cache_read_input_tokens ?? providerMetadataObject.anthropic.cacheReadInputTokens;
                                                    setAttributeIfDefined(attributes, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE, cachedInputTokens);
                                                    let cacheWriteInputTokens =
                                                        providerMetadataObject.anthropic.usage?.cache_creation_input_tokens ??
                                                        providerMetadataObject.anthropic.cacheCreationInputTokens;
                                                    setAttributeIfDefined(attributes, genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_ATTRIBUTE, cacheWriteInputTokens);
                                                }
                                                (providerMetadataObject.bedrock?.usage &&
                                                    (setAttributeIfDefined(
                                                        attributes,
                                                        genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE,
                                                        providerMetadataObject.bedrock.usage.cacheReadInputTokens,
                                                    ),
                                                    setAttributeIfDefined(
                                                        attributes,
                                                        genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHE_WRITE_ATTRIBUTE,
                                                        providerMetadataObject.bedrock.usage.cacheWriteInputTokens,
                                                    )),
                                                    providerMetadataObject.deepseek &&
                                                        (setAttributeIfDefined(
                                                            attributes,
                                                            genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_CACHED_ATTRIBUTE,
                                                            providerMetadataObject.deepseek.promptCacheHitTokens,
                                                        ),
                                                        setAttributeIfDefined(
                                                            attributes,
                                                            "gen_ai.usage.input_tokens.cache_miss",
                                                            providerMetadataObject.deepseek.promptCacheMissTokens,
                                                        )));
                                            } catch {}
                                    })(attributes),
                                    Object.keys(attributes)))
                                        key.startsWith("ai.") && renameAttributeKey(attributes, key, `vercel.${key}`);
                                }
                            })(span),
                                utils$1.accumulateTokensForParent(span, tokenAccumulator));
                        utils$1.applyToolDescriptionsAndTokens(event.spans, tokenAccumulator);
                        let trace = event.contexts?.trace;
                        trace?.op === "gen_ai.invoke_agent" && utils$1.applyAccumulatedTokens(trace, tokenAccumulator);
                    }
                    return event;
                }
                function renameAttributeKey(attributes, oldKey, newKey) {
                    null != attributes[oldKey] && ((attributes[newKey] = attributes[oldKey]), delete attributes[oldKey]);
                }
                function setAttributeIfDefined(attributes, key, value) {
                    null != value && (attributes[key] = value);
                }
                exports.addVercelAiProcessors = function (client) {
                    (client.on("spanStart", onVercelAiSpanStart), client.addEventProcessor(Object.assign(vercelAiEventProcessor, { id: "VercelAiEventProcessor" })));
                };
            }