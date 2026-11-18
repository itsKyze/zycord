3938(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let genAiAttributes = __webpack_require__(3968);
                ((exports.addResponseAttributes = function (span, result, recordOutputs) {
                    if (!result || "object" != typeof result) return;
                    let attrs = {};
                    if (
                        ("string" == typeof result.id && (attrs[genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE] = result.id),
                        "string" == typeof result.model && (attrs[genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE] = result.model),
                        "conversation" === result.object && "string" == typeof result.id && (attrs[genAiAttributes.GEN_AI_CONVERSATION_ID_ATTRIBUTE] = result.id),
                        result.usage && "object" == typeof result.usage)
                    ) {
                        let usage = result.usage,
                            inputTokens = usage.prompt_tokens ?? usage.input_tokens;
                        "number" == typeof inputTokens && (attrs[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] = inputTokens);
                        let outputTokens = usage.completion_tokens ?? usage.output_tokens;
                        ("number" == typeof outputTokens && (attrs[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] = outputTokens),
                            "number" == typeof usage.total_tokens && (attrs[genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] = usage.total_tokens));
                    }
                    if (Array.isArray(result.choices)) {
                        let choices = result.choices,
                            finishReasons = choices.map((choice) => choice.finish_reason).filter((reason) => "string" == typeof reason);
                        if ((finishReasons.length > 0 && (attrs[genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE] = JSON.stringify(finishReasons)), recordOutputs)) {
                            let responseTexts = choices.map((choice) => {
                                let message = choice.message;
                                return message?.content || "";
                            });
                            attrs[genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE] = JSON.stringify(responseTexts);
                            let toolCalls = choices
                                .map((choice) => {
                                    let message = choice.message;
                                    return message?.tool_calls;
                                })
                                .filter((calls) => Array.isArray(calls) && calls.length > 0)
                                .flat();
                            toolCalls.length > 0 && (attrs[genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE] = JSON.stringify(toolCalls));
                        }
                    }
                    if (
                        ("string" != typeof result.status ||
                            attrs[genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE] ||
                            (attrs[genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE] = JSON.stringify([result.status])),
                        recordOutputs &&
                            ("string" != typeof result.output_text ||
                                attrs[genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE] ||
                                (attrs[genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE] = result.output_text),
                            Array.isArray(result.output) && result.output.length > 0 && !attrs[genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]))
                    ) {
                        let functionCalls = result.output.filter((item) => item?.type === "function_call");
                        functionCalls.length > 0 && (attrs[genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE] = JSON.stringify(functionCalls));
                    }
                    span.setAttributes(attrs);
                }),
                    (exports.extractRequestParameters = function (params) {
                        let attributes = { [genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE]: params.model ?? "unknown" };
                        ("temperature" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE] = params.temperature),
                            "top_p" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE] = params.top_p),
                            "frequency_penalty" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE] = params.frequency_penalty),
                            "presence_penalty" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE] = params.presence_penalty),
                            "stream" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE] = params.stream),
                            "encoding_format" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_ENCODING_FORMAT_ATTRIBUTE] = params.encoding_format),
                            "dimensions" in params && (attributes[genAiAttributes.GEN_AI_REQUEST_DIMENSIONS_ATTRIBUTE] = params.dimensions));
                        let conversationId =
                            "conversation" in params && "string" == typeof params.conversation
                                ? params.conversation
                                : "previous_response_id" in params && "string" == typeof params.previous_response_id
                                  ? params.previous_response_id
                                  : void 0;
                        return (conversationId && (attributes[genAiAttributes.GEN_AI_CONVERSATION_ID_ATTRIBUTE] = conversationId), attributes);
                    }),
                    (exports.isChatCompletionChunk = function (event) {
                        return null !== event && "object" == typeof event && "object" in event && "chat.completion.chunk" === event.object;
                    }),
                    (exports.isResponsesApiStreamEvent = function (event) {
                        return null !== event && "object" == typeof event && "type" in event && "string" == typeof event.type && event.type.startsWith("response.");
                    }));
            }