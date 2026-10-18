5163(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    spanstatus = __webpack_require__(2232),
                    utils = __webpack_require__(782);
                exports.instrumentStream = async function* (stream, span, recordOutputs) {
                    let state = { responseTexts: [], finishReasons: [], toolCalls: [] };
                    try {
                        for await (let chunk of stream)
                            (!(function (chunk, state, recordOutputs, span) {
                                if (!(
                                    !chunk ||
                                    (function (chunk, span) {
                                        let feedback = chunk?.promptFeedback;
                                        if (feedback?.blockReason) {
                                            let message = feedback.blockReasonMessage ?? feedback.blockReason;
                                            return (
                                                span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                                _exports.captureException(`Content blocked: ${message}`, { mechanism: { handled: !1, type: "auto.ai.google_genai" } }),
                                                !0
                                            );
                                        }
                                        return !1;
                                    })(chunk, span)
                                )) {
                                    let usage;
                                    for (let candidate of ("string" == typeof chunk.responseId && (state.responseId = chunk.responseId),
                                    "string" == typeof chunk.modelVersion && (state.responseModel = chunk.modelVersion),
                                    (usage = chunk.usageMetadata) &&
                                        ("number" == typeof usage.promptTokenCount && (state.promptTokens = usage.promptTokenCount),
                                        "number" == typeof usage.candidatesTokenCount && (state.completionTokens = usage.candidatesTokenCount),
                                        "number" == typeof usage.totalTokenCount && (state.totalTokens = usage.totalTokenCount)),
                                    Array.isArray(chunk.functionCalls) && state.toolCalls.push(...chunk.functionCalls),
                                    chunk.candidates ?? []))
                                        for (let part of (candidate?.finishReason &&
                                            !state.finishReasons.includes(candidate.finishReason) &&
                                            state.finishReasons.push(candidate.finishReason),
                                        candidate?.content?.parts ?? []))
                                            (recordOutputs && part.text && state.responseTexts.push(part.text),
                                                part.functionCall &&
                                                    state.toolCalls.push({
                                                        type: "function",
                                                        id: part.functionCall.id,
                                                        name: part.functionCall.name,
                                                        arguments: part.functionCall.args,
                                                    }));
                                }
                            })(chunk, state, recordOutputs, span),
                                yield chunk);
                    } finally {
                        utils.endStreamSpan(span, state, recordOutputs);
                    }
                };
            }