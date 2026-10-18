8046(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let spanstatus = __webpack_require__(2232),
                    attributes = __webpack_require__(2277),
                    resultExtraction = __webpack_require__(4748),
                    sessionExtraction = __webpack_require__(6435),
                    sessionToSpanMap = new Map(),
                    statelessSpanMap = new WeakMap();
                function getOrCreateSpanMap(transport) {
                    let sessionId = transport.sessionId;
                    if (sessionId) {
                        let spanMap = sessionToSpanMap.get(sessionId);
                        return (spanMap || ((spanMap = new Map()), sessionToSpanMap.set(sessionId, spanMap)), spanMap);
                    }
                    let spanMap = statelessSpanMap.get(transport);
                    return (spanMap || ((spanMap = new Map()), statelessSpanMap.set(transport, spanMap)), spanMap);
                }
                ((exports.cleanupPendingSpansForTransport = function (transport) {
                    let sessionId = transport.sessionId;
                    if (sessionId) {
                        let spanMap = sessionToSpanMap.get(sessionId);
                        if (spanMap) {
                            for (let [, spanData] of spanMap) (spanData.span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "cancelled" }), spanData.span.end());
                            sessionToSpanMap.delete(sessionId);
                        }
                        return;
                    }
                    let spanMap = statelessSpanMap.get(transport);
                    if (spanMap) {
                        for (let [, spanData] of spanMap) (spanData.span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "cancelled" }), spanData.span.end());
                        spanMap.clear();
                    }
                }),
                    (exports.completeSpanWithResults = function (transport, requestId, result, options, hasError = !1) {
                        let spanMap = getOrCreateSpanMap(transport),
                            spanData = spanMap.get(requestId);
                        if (spanData) {
                            let { span, method } = spanData;
                            if (hasError) span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
                            else if ("initialize" === method) {
                                let sessionData = sessionExtraction.extractSessionDataFromInitializeResponse(result),
                                    initAttributes = { ...sessionExtraction.buildServerAttributesFromInfo(sessionData.serverInfo) };
                                (sessionData.protocolVersion && (initAttributes[attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE] = sessionData.protocolVersion),
                                    span.setAttributes(initAttributes));
                            } else if ("tools/call" === method) {
                                let toolAttributes = resultExtraction.extractToolResultAttributes(result, options.recordOutputs);
                                span.setAttributes(toolAttributes);
                            } else if ("prompts/get" === method) {
                                let promptAttributes = resultExtraction.extractPromptResultAttributes(result, options.recordOutputs);
                                span.setAttributes(promptAttributes);
                            }
                            (span.end(), spanMap.delete(requestId));
                        }
                    }),
                    (exports.storeSpanForRequest = function (transport, requestId, span, method) {
                        getOrCreateSpanMap(transport).set(requestId, { span, method, startTime: Date.now() });
                    }));
            }