3042(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(227),
                    utils$1 = __webpack_require__(5667);
                exports.createLangChainCallbackHandler = function (options = {}) {
                    let { recordInputs, recordOutputs } = utils.resolveAIRecordingOptions(options),
                        enableTruncation = utils.shouldEnableTruncation(options.enableTruncation),
                        spanMap = new Map(),
                        exitSpan = (runId) => {
                            let span = spanMap.get(runId);
                            span?.isRecording() && (span.end(), spanMap.delete(runId));
                        },
                        handler = {
                            lc_serializable: !1,
                            lc_namespace: ["langchain_core", "callbacks", "sentry"],
                            lc_secrets: void 0,
                            lc_attributes: void 0,
                            lc_aliases: void 0,
                            lc_serializable_keys: void 0,
                            lc_id: ["langchain_core", "callbacks", "sentry"],
                            lc_kwargs: {},
                            name: "SentryCallbackHandler",
                            ignoreLLM: !1,
                            ignoreChain: !1,
                            ignoreAgent: !1,
                            ignoreRetriever: !1,
                            ignoreCustomEvent: !1,
                            raiseError: !1,
                            awaitHandlers: !0,
                            handleLLMStart(llm, prompts, runId, _parentRunId, _extraParams, tags, metadata, _runName) {
                                let invocationParams = utils$1.getInvocationParams(tags),
                                    attributes = utils$1.extractLLMRequestAttributes(llm, prompts, recordInputs, enableTruncation, invocationParams, metadata),
                                    modelName = attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE],
                                    operationName = attributes[genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE];
                                trace.startSpanManual(
                                    {
                                        name: `${operationName} ${modelName}`,
                                        op: "gen_ai.chat",
                                        attributes: { ...attributes, [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "gen_ai.chat" },
                                    },
                                    (span) => (spanMap.set(runId, span), span),
                                );
                            },
                            handleChatModelStart(llm, messages, runId, _parentRunId, _extraParams, tags, metadata, _runName) {
                                let invocationParams = utils$1.getInvocationParams(tags),
                                    attributes = utils$1.extractChatModelRequestAttributes(llm, messages, recordInputs, enableTruncation, invocationParams, metadata),
                                    modelName = attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE],
                                    operationName = attributes[genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE];
                                trace.startSpanManual(
                                    {
                                        name: `${operationName} ${modelName}`,
                                        op: "gen_ai.chat",
                                        attributes: { ...attributes, [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "gen_ai.chat" },
                                    },
                                    (span) => (spanMap.set(runId, span), span),
                                );
                            },
                            handleLLMEnd(output, runId, _parentRunId, _tags, _extraParams) {
                                let span = spanMap.get(runId);
                                if (span?.isRecording()) {
                                    let attributes = utils$1.extractLlmResponseAttributes(output, recordOutputs);
                                    (attributes && span.setAttributes(attributes), exitSpan(runId));
                                }
                            },
                            handleLLMError(error, runId) {
                                let span = spanMap.get(runId);
                                (span?.isRecording() && (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }), exitSpan(runId)),
                                    _exports.captureException(error, { mechanism: { handled: !1, type: `${constants.LANGCHAIN_ORIGIN}.llm_error_handler` } }));
                            },
                            handleChainStart(chain, inputs, runId, _parentRunId, _tags, _metadata, _runType, runName) {
                                let chainName = runName || chain.name || "unknown_chain",
                                    attributes = { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.langchain", "langchain.chain.name": chainName };
                                (recordInputs && (attributes["langchain.chain.inputs"] = JSON.stringify(inputs)),
                                    trace.startSpanManual(
                                        {
                                            name: `chain ${chainName}`,
                                            op: "gen_ai.invoke_agent",
                                            attributes: { ...attributes, [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "gen_ai.invoke_agent" },
                                        },
                                        (span) => (spanMap.set(runId, span), span),
                                    ));
                            },
                            handleChainEnd(outputs, runId) {
                                let span = spanMap.get(runId);
                                span?.isRecording() && (recordOutputs && span.setAttributes({ "langchain.chain.outputs": JSON.stringify(outputs) }), exitSpan(runId));
                            },
                            handleChainError(error, runId) {
                                let span = spanMap.get(runId);
                                (span?.isRecording() && (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }), exitSpan(runId)),
                                    _exports.captureException(error, { mechanism: { handled: !1, type: `${constants.LANGCHAIN_ORIGIN}.chain_error_handler` } }));
                            },
                            handleToolStart(tool, input, runId, _parentRunId) {
                                let toolName = tool.name || "unknown_tool",
                                    attributes = {
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGCHAIN_ORIGIN,
                                        [genAiAttributes.GEN_AI_TOOL_NAME_ATTRIBUTE]: toolName,
                                    };
                                (recordInputs && (attributes[genAiAttributes.GEN_AI_TOOL_INPUT_ATTRIBUTE] = input),
                                    trace.startSpanManual(
                                        {
                                            name: `execute_tool ${toolName}`,
                                            op: "gen_ai.execute_tool",
                                            attributes: { ...attributes, [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "gen_ai.execute_tool" },
                                        },
                                        (span) => (spanMap.set(runId, span), span),
                                    ));
                            },
                            handleToolEnd(output, runId) {
                                let span = spanMap.get(runId);
                                span?.isRecording() &&
                                    (recordOutputs && span.setAttributes({ [genAiAttributes.GEN_AI_TOOL_OUTPUT_ATTRIBUTE]: JSON.stringify(output) }), exitSpan(runId));
                            },
                            handleToolError(error, runId) {
                                let span = spanMap.get(runId);
                                (span?.isRecording() && (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }), exitSpan(runId)),
                                    _exports.captureException(error, { mechanism: { handled: !1, type: `${constants.LANGCHAIN_ORIGIN}.tool_error_handler` } }));
                            },
                            copy: () => handler,
                            toJSON: () => ({ lc: 1, type: "not_implemented", id: handler.lc_id }),
                            toJSONNotImplemented: () => ({ lc: 1, type: "not_implemented", id: handler.lc_id }),
                        };
                    return handler;
                };
            }