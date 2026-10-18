7484(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let semanticAttributes = __webpack_require__(3052),
                    scopeData = __webpack_require__(4955),
                    spanUtils = __webpack_require__(470),
                    utils = __webpack_require__(3033),
                    beforeSendSpan = __webpack_require__(6509);
                function applyBeforeSendSpanCallback(span, beforeSendSpan) {
                    let modifedSpan = beforeSendSpan(span);
                    return modifedSpan || (spanUtils.showSpanDropWarning(), span);
                }
                function safeSetSpanJSONAttributes(spanJSON, newAttributes) {
                    let originalAttributes = spanJSON.attributes ?? (spanJSON.attributes = {});
                    Object.entries(newAttributes).forEach(([key, value]) => {
                        null == value || key in originalAttributes || (originalAttributes[key] = value);
                    });
                }
                ((exports.applyBeforeSendSpanCallback = applyBeforeSendSpanCallback),
                    (exports.captureSpan = function (span, client) {
                        let spanJSON = spanUtils.spanToStreamedSpanJSON(span),
                            segmentSpan = spanUtils.INTERNAL_getSegmentSpan(span),
                            serializedSegmentSpan = spanUtils.spanToStreamedSpanJSON(segmentSpan),
                            { isolationScope: spanIsolationScope, scope: spanScope } = utils.getCapturedScopesOnSpan(span);
                        ((function (spanJSON, serializedSegmentSpan, client, scopeData) {
                            let sdk = client.getSdkMetadata(),
                                { release, environment, sendDefaultPii } = client.getOptions();
                            safeSetSpanJSONAttributes(spanJSON, {
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_RELEASE]: release,
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT]: environment,
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SEGMENT_NAME]: serializedSegmentSpan.name,
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SEGMENT_ID]: serializedSegmentSpan.span_id,
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SDK_NAME]: sdk?.sdk?.name,
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SDK_VERSION]: sdk?.sdk?.version,
                                ...(sendDefaultPii
                                    ? {
                                          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_ID]: scopeData.user?.id,
                                          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_EMAIL]: scopeData.user?.email,
                                          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: scopeData.user?.ip_address,
                                          [semanticAttributes.SEMANTIC_ATTRIBUTE_USER_USERNAME]: scopeData.user?.username,
                                      }
                                    : {}),
                                ...scopeData.attributes,
                            });
                        })(spanJSON, serializedSegmentSpan, client, scopeData.getCombinedScopeData(spanIsolationScope, spanScope)),
                            spanJSON.is_segment && client.emit("processSegmentSpan", spanJSON),
                            client.emit("processSpan", spanJSON));
                        let { beforeSendSpan: beforeSendSpan$1 } = client.getOptions(),
                            processedSpan =
                                beforeSendSpan$1 && beforeSendSpan.isStreamedBeforeSendSpanCallback(beforeSendSpan$1)
                                    ? applyBeforeSendSpanCallback(spanJSON, beforeSendSpan$1)
                                    : spanJSON,
                            spanNameSource = processedSpan.attributes?.[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
                        return (
                            spanNameSource && safeSetSpanJSONAttributes(processedSpan, { "sentry.span.source": spanNameSource }),
                            { ...spanUtils.streamedSpanJsonToSerializedSpan(processedSpan), _segmentSpan: segmentSpan }
                        );
                    }),
                    (exports.safeSetSpanJSONAttributes = safeSetSpanJSONAttributes));
            }