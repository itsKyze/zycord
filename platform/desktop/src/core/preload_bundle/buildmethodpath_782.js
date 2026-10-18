782(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    currentScopes = __webpack_require__(7121),
                    hasSpanStreamingEnabled = __webpack_require__(9807),
                    is = __webpack_require__(7431),
                    genAiAttributes = __webpack_require__(3968),
                    messageTruncation = __webpack_require__(3267);
                async function createWithResponseWrapper(originalWithResponse, instrumentedPromise, mechanismType) {
                    let safeOriginalWithResponse = originalWithResponse.catch((error) => {
                            throw (_exports.captureException(error, { mechanism: { handled: !1, type: mechanismType } }), error);
                        }),
                        instrumentedResult = await instrumentedPromise,
                        originalWrapper = await safeOriginalWithResponse;
                    return originalWrapper && "object" == typeof originalWrapper && "data" in originalWrapper
                        ? { ...originalWrapper, data: instrumentedResult }
                        : instrumentedResult;
                }
                ((exports.buildMethodPath = function (currentPath, prop) {
                    return currentPath ? `${currentPath}.${prop}` : prop;
                }),
                    (exports.endStreamSpan = function (span, state, recordOutputs) {
                        if (!span.isRecording()) return;
                        let attrs = { [genAiAttributes.GEN_AI_RESPONSE_STREAMING_ATTRIBUTE]: !0 };
                        (state.responseId && (attrs[genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE] = state.responseId),
                            state.responseModel && (attrs[genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE] = state.responseModel),
                            void 0 !== state.promptTokens && (attrs[genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] = state.promptTokens),
                            void 0 !== state.completionTokens && (attrs[genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] = state.completionTokens),
                            void 0 !== state.totalTokens
                                ? (attrs[genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] = state.totalTokens)
                                : (void 0 !== state.promptTokens ||
                                      void 0 !== state.completionTokens ||
                                      void 0 !== state.cacheCreationInputTokens ||
                                      void 0 !== state.cacheReadInputTokens) &&
                                  (attrs[genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] =
                                      (state.promptTokens ?? 0) + (state.completionTokens ?? 0) + (state.cacheCreationInputTokens ?? 0) + (state.cacheReadInputTokens ?? 0)),
                            state.finishReasons.length && (attrs[genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE] = JSON.stringify(state.finishReasons)),
                            recordOutputs && state.responseTexts.length && (attrs[genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE] = state.responseTexts.join("")),
                            recordOutputs && state.toolCalls.length && (attrs[genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE] = JSON.stringify(state.toolCalls)),
                            span.setAttributes(attrs),
                            span.end());
                    }),
                    (exports.extractSystemInstructions = function (messages) {
                        if (!Array.isArray(messages)) return { systemInstructions: void 0, filteredMessages: messages };
                        let systemMessageIndex = messages.findIndex((msg) => msg && "object" == typeof msg && "role" in msg && "system" === msg.role);
                        if (-1 === systemMessageIndex) return { systemInstructions: void 0, filteredMessages: messages };
                        let systemMessage = messages[systemMessageIndex],
                            systemContent =
                                "string" == typeof systemMessage.content
                                    ? systemMessage.content
                                    : void 0 !== systemMessage.content
                                      ? JSON.stringify(systemMessage.content)
                                      : void 0;
                        return systemContent
                            ? {
                                  systemInstructions: JSON.stringify([{ type: "text", content: systemContent }]),
                                  filteredMessages: [...messages.slice(0, systemMessageIndex), ...messages.slice(systemMessageIndex + 1)],
                              }
                            : { systemInstructions: void 0, filteredMessages: messages };
                    }),
                    (exports.getJsonString = function (value) {
                        return "string" == typeof value ? value : JSON.stringify(value);
                    }),
                    (exports.getTruncatedJsonString = function (value) {
                        return "string" == typeof value
                            ? messageTruncation.truncateGenAiStringInput(value)
                            : Array.isArray(value)
                              ? JSON.stringify(messageTruncation.truncateGenAiMessages(value))
                              : JSON.stringify(value);
                    }),
                    (exports.resolveAIRecordingOptions = function (options) {
                        let sendDefaultPii = !!currentScopes.getClient()?.getOptions().sendDefaultPii;
                        return { ...options, recordInputs: options?.recordInputs ?? sendDefaultPii, recordOutputs: options?.recordOutputs ?? sendDefaultPii };
                    }),
                    (exports.setTokenUsageAttributes = function (span, promptTokens, completionTokens, cachedInputTokens, cachedOutputTokens) {
                        (void 0 !== promptTokens && span.setAttributes({ [genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE]: promptTokens }),
                            void 0 !== completionTokens && span.setAttributes({ [genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]: completionTokens }),
                            (void 0 !== promptTokens || void 0 !== completionTokens || void 0 !== cachedInputTokens || void 0 !== cachedOutputTokens) &&
                                span.setAttributes({
                                    [genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE]:
                                        (promptTokens ?? 0) + (completionTokens ?? 0) + (cachedInputTokens ?? 0) + (cachedOutputTokens ?? 0),
                                }));
                    }),
                    (exports.shouldEnableTruncation = function (enableTruncation) {
                        let client = currentScopes.getClient();
                        return enableTruncation ?? !(client && hasSpanStreamingEnabled.hasSpanStreamingEnabled(client));
                    }),
                    (exports.wrapPromiseWithMethods = function (originalPromiseLike, instrumentedPromise, mechanismType) {
                        return is.isThenable(originalPromiseLike)
                            ? new Proxy(originalPromiseLike, {
                                  get(target, prop) {
                                      let source = prop in Promise.prototype || prop === Symbol.toStringTag ? instrumentedPromise : target,
                                          value = Reflect.get(source, prop);
                                      return "withResponse" === prop && "function" == typeof value
                                          ? function () {
                                                return createWithResponseWrapper(value.call(target), instrumentedPromise, mechanismType);
                                            }
                                          : "function" == typeof value
                                            ? value.bind(source)
                                            : value;
                                  },
                              })
                            : instrumentedPromise;
                    }));
            }