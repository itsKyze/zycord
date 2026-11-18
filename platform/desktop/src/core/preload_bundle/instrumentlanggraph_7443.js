7443(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    utils$2 = __webpack_require__(5667),
                    constants = __webpack_require__(3590),
                    utils$1 = __webpack_require__(6366);
                function instrumentStateGraphCompile(originalCompile, options) {
                    return new Proxy(originalCompile, {
                        apply: (target, thisArg, args) =>
                            trace.startSpan(
                                {
                                    op: "gen_ai.create_agent",
                                    name: "create_agent",
                                    attributes: {
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGGRAPH_ORIGIN,
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "gen_ai.create_agent",
                                        [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: "create_agent",
                                    },
                                },
                                (span) => {
                                    try {
                                        var originalInvoke, graphInstance, compileOptions, options1;
                                        let compiledGraph = Reflect.apply(target, thisArg, args),
                                            compileOptions1 = args.length > 0 ? args[0] : {};
                                        compileOptions1?.name &&
                                            "string" == typeof compileOptions1.name &&
                                            (span.setAttribute(genAiAttributes.GEN_AI_AGENT_NAME_ATTRIBUTE, compileOptions1.name),
                                            span.updateName(`create_agent ${compileOptions1.name}`));
                                        let originalInvoke1 = compiledGraph.invoke;
                                        return (
                                            originalInvoke1 &&
                                                "function" == typeof originalInvoke1 &&
                                                ((originalInvoke = originalInvoke1.bind(compiledGraph)),
                                                (graphInstance = compiledGraph),
                                                (compileOptions = compileOptions1),
                                                (options1 = options),
                                                (compiledGraph.invoke = new Proxy(originalInvoke, {
                                                    apply: (target, thisArg, args) =>
                                                        trace.startSpan(
                                                            {
                                                                op: "gen_ai.invoke_agent",
                                                                name: "invoke_agent",
                                                                attributes: {
                                                                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGGRAPH_ORIGIN,
                                                                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: genAiAttributes.GEN_AI_INVOKE_AGENT_OPERATION_ATTRIBUTE,
                                                                    [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: "invoke_agent",
                                                                },
                                                            },
                                                            async (span) => {
                                                                try {
                                                                    let graphName = compileOptions?.name;
                                                                    graphName &&
                                                                        "string" == typeof graphName &&
                                                                        (span.setAttribute(genAiAttributes.GEN_AI_PIPELINE_NAME_ATTRIBUTE, graphName),
                                                                        span.setAttribute(genAiAttributes.GEN_AI_AGENT_NAME_ATTRIBUTE, graphName),
                                                                        span.updateName(`invoke_agent ${graphName}`));
                                                                    let config = args.length > 1 ? args[1] : void 0,
                                                                        configurable = config?.configurable,
                                                                        threadId = configurable?.thread_id;
                                                                    threadId &&
                                                                        "string" == typeof threadId &&
                                                                        span.setAttribute(genAiAttributes.GEN_AI_CONVERSATION_ID_ATTRIBUTE, threadId);
                                                                    let tools = utils$1.extractToolsFromCompiledGraph(graphInstance);
                                                                    tools && span.setAttribute(genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE, JSON.stringify(tools));
                                                                    let recordInputs = options1.recordInputs,
                                                                        recordOutputs = options1.recordOutputs,
                                                                        inputMessages = args.length > 0 ? (args[0]?.messages ?? []) : [];
                                                                    if (inputMessages && recordInputs) {
                                                                        let normalizedMessages = utils$2.normalizeLangChainMessages(inputMessages),
                                                                            { systemInstructions, filteredMessages } = utils.extractSystemInstructions(normalizedMessages);
                                                                        systemInstructions &&
                                                                            span.setAttribute(genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE, systemInstructions);
                                                                        let enableTruncation = utils.shouldEnableTruncation(options1.enableTruncation),
                                                                            filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 0;
                                                                        span.setAttributes({
                                                                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: enableTruncation
                                                                                ? utils.getTruncatedJsonString(filteredMessages)
                                                                                : utils.getJsonString(filteredMessages),
                                                                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
                                                                        });
                                                                    }
                                                                    let result = await Reflect.apply(target, thisArg, args);
                                                                    return (recordOutputs && utils$1.setResponseAttributes(span, inputMessages ?? null, result), result);
                                                                } catch (error) {
                                                                    throw (
                                                                        span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                                                        _exports.captureException(error, { mechanism: { handled: !1, type: "auto.ai.langgraph.error" } }),
                                                                        error
                                                                    );
                                                                }
                                                            },
                                                        ),
                                                }))),
                                            compiledGraph
                                        );
                                    } catch (error) {
                                        throw (
                                            span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" }),
                                            _exports.captureException(error, { mechanism: { handled: !1, type: "auto.ai.langgraph.error" } }),
                                            error
                                        );
                                    }
                                },
                            ),
                    });
                }
                ((exports.instrumentLangGraph = function (stateGraph, options) {
                    return ((stateGraph.compile = instrumentStateGraphCompile(stateGraph.compile, utils.resolveAIRecordingOptions(options))), stateGraph);
                }),
                    (exports.instrumentStateGraphCompile = instrumentStateGraphCompile));
            }