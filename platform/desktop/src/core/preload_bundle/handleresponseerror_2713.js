2713(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    spanstatus = __webpack_require__(2232),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    ANTHROPIC_ERROR_TYPE_TO_SPAN_STATUS = {
                        invalid_request_error: "invalid_argument",
                        authentication_error: "unauthenticated",
                        permission_error: "permission_denied",
                        not_found_error: "not_found",
                        request_too_large: "failed_precondition",
                        rate_limit_error: "resource_exhausted",
                        api_error: "internal_error",
                        overloaded_error: "unavailable",
                    };
                function mapAnthropicErrorToStatusMessage(errorType) {
                    return (errorType && ANTHROPIC_ERROR_TYPE_TO_SPAN_STATUS[errorType]) || "internal_error";
                }
                ((exports.handleResponseError = function (span, response) {
                    response.error &&
                        (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: mapAnthropicErrorToStatusMessage(response.error.type) }),
                        _exports.captureException(response.error, { mechanism: { handled: !1, type: "auto.ai.anthropic.anthropic_error" } }));
                }),
                    (exports.mapAnthropicErrorToStatusMessage = mapAnthropicErrorToStatusMessage),
                    (exports.messagesFromParams = function (params) {
                        let { system, messages, input } = params,
                            systemMessages = "string" == typeof system ? [{ role: "system", content: params.system }] : [],
                            inputParamMessages = Array.isArray(input) ? input : null != input ? [input] : void 0,
                            messagesParamMessages = Array.isArray(messages) ? messages : null != messages ? [messages] : [];
                        return [...systemMessages, ...(inputParamMessages ?? messagesParamMessages)];
                    }),
                    (exports.setMessagesAttribute = function (span, messages, enableTruncation) {
                        if (Array.isArray(messages) && 0 === messages.length) return;
                        let { systemInstructions, filteredMessages } = utils.extractSystemInstructions(messages);
                        systemInstructions && span.setAttributes({ [genAiAttributes.GEN_AI_SYSTEM_INSTRUCTIONS_ATTRIBUTE]: systemInstructions });
                        let filteredLength = Array.isArray(filteredMessages) ? filteredMessages.length : 1;
                        span.setAttributes({
                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ATTRIBUTE]: enableTruncation
                                ? utils.getTruncatedJsonString(filteredMessages)
                                : utils.getJsonString(filteredMessages),
                            [genAiAttributes.GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE]: filteredLength,
                        });
                    }));
            }