1296(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    spanstatus = __webpack_require__(2232),
                    utils = __webpack_require__(782),
                    utils$1 = __webpack_require__(2713);
                function processEvent(event, state, recordOutputs, span) {
                    if (
                        event &&
                        "object" == typeof event &&
                        (!("type" in event) ||
                            "string" != typeof event.type ||
                            "error" !== event.type ||
                            (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: utils$1.mapAnthropicErrorToStatusMessage(event.error?.type) }),
                            _exports.captureException(event.error, { mechanism: { handled: !1, type: "auto.ai.anthropic.anthropic_error" } }),
                            0))
                    ) {
                        if (
                            ("message_delta" === event.type &&
                                event.usage &&
                                "output_tokens" in event.usage &&
                                "number" == typeof event.usage.output_tokens &&
                                (state.completionTokens = event.usage.output_tokens),
                            event.message)
                        ) {
                            let message = event.message;
                            (message.id && (state.responseId = message.id),
                                message.model && (state.responseModel = message.model),
                                message.stop_reason && state.finishReasons.push(message.stop_reason),
                                message.usage &&
                                    ("number" == typeof message.usage.input_tokens && (state.promptTokens = message.usage.input_tokens),
                                    "number" == typeof message.usage.cache_creation_input_tokens && (state.cacheCreationInputTokens = message.usage.cache_creation_input_tokens),
                                    "number" == typeof message.usage.cache_read_input_tokens && (state.cacheReadInputTokens = message.usage.cache_read_input_tokens)));
                        }
                        "content_block_start" === event.type &&
                            "number" == typeof event.index &&
                            event.content_block &&
                            ("tool_use" === event.content_block.type || "server_tool_use" === event.content_block.type) &&
                            (state.activeToolBlocks[event.index] = { id: event.content_block.id, name: event.content_block.name, inputJsonParts: [] });
                        if ("content_block_delta" === event.type && event.delta) {
                            if ("number" == typeof event.index && "partial_json" in event.delta && "string" == typeof event.delta.partial_json) {
                                let active = state.activeToolBlocks[event.index];
                                active && active.inputJsonParts.push(event.delta.partial_json);
                            }
                            recordOutputs && "string" == typeof event.delta.text && state.responseTexts.push(event.delta.text);
                        }
                        !(function (event, state) {
                            let parsedInput;
                            if ("content_block_stop" !== event.type || "number" != typeof event.index) return;
                            let active = state.activeToolBlocks[event.index];
                            if (!active) return;
                            let raw = active.inputJsonParts.join("");
                            try {
                                parsedInput = raw ? JSON.parse(raw) : {};
                            } catch {
                                parsedInput = { __unparsed: raw };
                            }
                            (state.toolCalls.push({ type: "tool_use", id: active.id, name: active.name, input: parsedInput }), delete state.activeToolBlocks[event.index]);
                        })(event, state);
                    }
                }
                ((exports.instrumentAsyncIterableStream = async function* instrumentAsyncIterableStream(stream, span, recordOutputs) {
                    let state = {
                        responseTexts: [],
                        finishReasons: [],
                        responseId: "",
                        responseModel: "",
                        promptTokens: void 0,
                        completionTokens: void 0,
                        cacheCreationInputTokens: void 0,
                        cacheReadInputTokens: void 0,
                        toolCalls: [],
                        activeToolBlocks: {},
                    };
                    try {
                        for await (let event of stream) (processEvent(event, state, recordOutputs, span), yield event);
                    } finally {
                        utils.endStreamSpan(span, state, recordOutputs);
                    }
                }),
                    (exports.instrumentMessageStream = function (stream, span, recordOutputs) {
                        let state = {
                            responseTexts: [],
                            finishReasons: [],
                            responseId: "",
                            responseModel: "",
                            promptTokens: void 0,
                            completionTokens: void 0,
                            cacheCreationInputTokens: void 0,
                            cacheReadInputTokens: void 0,
                            toolCalls: [],
                            activeToolBlocks: {},
                        };
                        return (
                            stream.on("streamEvent", (event) => {
                                processEvent(event, state, recordOutputs, span);
                            }),
                            stream.on("message", () => {
                                utils.endStreamSpan(span, state, recordOutputs);
                            }),
                            stream.on("error", (error) => {
                                (_exports.captureException(error, { mechanism: { handled: !1, type: "auto.ai.anthropic.stream_error" } }),
                                    span.isRecording() && (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }), span.end()));
                            }),
                            stream
                        );
                    }));
            }