1211(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    spanstatus = __webpack_require__(2232),
                    utils$1 = __webpack_require__(782),
                    constants = __webpack_require__(5706),
                    utils = __webpack_require__(3938);
                exports.instrumentStream = async function* (stream, span, recordOutputs) {
                    let state = {
                        eventTypes: [],
                        responseTexts: [],
                        finishReasons: [],
                        responseId: "",
                        responseModel: "",
                        promptTokens: void 0,
                        completionTokens: void 0,
                        totalTokens: void 0,
                        chatCompletionToolCalls: {},
                        responsesApiToolCalls: [],
                    };
                    try {
                        for await (let event of stream) {
                            if (utils.isChatCompletionChunk(event))
                                for (let choice of ((state.responseId = event.id ?? state.responseId),
                                (state.responseModel = event.model ?? state.responseModel),
                                event.usage &&
                                    ((state.promptTokens = event.usage.prompt_tokens),
                                    (state.completionTokens = event.usage.completion_tokens),
                                    (state.totalTokens = event.usage.total_tokens)),
                                event.choices ?? []))
                                    (recordOutputs &&
                                        (choice.delta?.content && state.responseTexts.push(choice.delta.content),
                                        choice.delta?.tool_calls &&
                                            (function (toolCalls, state) {
                                                for (let toolCall of toolCalls) {
                                                    let index = toolCall.index;
                                                    if (void 0 !== index && toolCall.function)
                                                        if (index in state.chatCompletionToolCalls) {
                                                            let existingToolCall = state.chatCompletionToolCalls[index];
                                                            toolCall.function.arguments &&
                                                                existingToolCall?.function &&
                                                                (existingToolCall.function.arguments += toolCall.function.arguments);
                                                        } else
                                                            state.chatCompletionToolCalls[index] = {
                                                                ...toolCall,
                                                                function: { name: toolCall.function.name, arguments: toolCall.function.arguments || "" },
                                                            };
                                                }
                                            })(choice.delta.tool_calls, state)),
                                        choice.finish_reason && state.finishReasons.push(choice.finish_reason));
                            else
                                utils.isResponsesApiStreamEvent(event) &&
                                    (function (streamEvent, state, recordOutputs, span) {
                                        if (!(streamEvent && "object" == typeof streamEvent)) return state.eventTypes.push("unknown:non-object");
                                        if (streamEvent instanceof Error) {
                                            (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                                _exports.captureException(streamEvent, { mechanism: { handled: !1, type: "auto.ai.openai.stream-response" } }));
                                            return;
                                        }
                                        if ("type" in streamEvent) {
                                            if (!constants.RESPONSE_EVENT_TYPES.includes(streamEvent.type)) return state.eventTypes.push(streamEvent.type);
                                            if (
                                                recordOutputs &&
                                                ("response.output_item.done" === streamEvent.type && "item" in streamEvent && state.responsesApiToolCalls.push(streamEvent.item),
                                                "response.output_text.delta" === streamEvent.type && "delta" in streamEvent && streamEvent.delta)
                                            )
                                                return state.responseTexts.push(streamEvent.delta);
                                            if ("response" in streamEvent) {
                                                let { response } = streamEvent;
                                                ((state.responseId = response.id ?? state.responseId),
                                                    (state.responseModel = response.model ?? state.responseModel),
                                                    response.usage &&
                                                        ((state.promptTokens = response.usage.input_tokens),
                                                        (state.completionTokens = response.usage.output_tokens),
                                                        (state.totalTokens = response.usage.total_tokens)),
                                                    response.status && state.finishReasons.push(response.status),
                                                    recordOutputs && response.output_text && state.responseTexts.push(response.output_text));
                                            }
                                        }
                                    })(event, state, recordOutputs, span);
                            yield event;
                        }
                    } finally {
                        let allToolCalls = [...Object.values(state.chatCompletionToolCalls), ...state.responsesApiToolCalls];
                        utils$1.endStreamSpan(span, { ...state, toolCalls: allToolCalls }, recordOutputs);
                    }
                };
            }