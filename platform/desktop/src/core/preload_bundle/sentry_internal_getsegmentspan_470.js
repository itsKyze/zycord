470(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let index = __webpack_require__(3401),
                    attributes = __webpack_require__(4924),
                    carrier = __webpack_require__(5),
                    currentScopes = __webpack_require__(7121),
                    semanticAttributes = __webpack_require__(3052),
                    spanstatus = __webpack_require__(2232),
                    utils = __webpack_require__(3033),
                    object = __webpack_require__(4204),
                    propagationContext = __webpack_require__(8034),
                    time = __webpack_require__(602),
                    tracing = __webpack_require__(2093),
                    debugLogger = __webpack_require__(2533),
                    spanOnScope = __webpack_require__(8740),
                    hasShownSpanDropWarning = !1;
                function convertSpanLinksForEnvelope(links) {
                    return links && links.length > 0
                        ? links.map(({ context: { spanId, traceId, traceFlags, ...restContext }, attributes }) => ({
                              span_id: spanId,
                              trace_id: traceId,
                              sampled: 1 === traceFlags,
                              attributes,
                              ...restContext,
                          }))
                        : void 0;
                }
                function getStreamedSpanLinks(links) {
                    return links?.length
                        ? links.map(({ context: { spanId, traceId, traceFlags }, attributes }) => ({ span_id: spanId, trace_id: traceId, sampled: 1 === traceFlags, attributes }))
                        : void 0;
                }
                function spanTimeInputToSeconds(input) {
                    return "number" == typeof input
                        ? ensureTimestampInSeconds(input)
                        : Array.isArray(input)
                          ? input[0] + input[1] / 1e9
                          : input instanceof Date
                            ? ensureTimestampInSeconds(input.getTime())
                            : time.timestampInSeconds();
                }
                function ensureTimestampInSeconds(timestamp) {
                    return timestamp > 0x2540be3ff ? timestamp / 1e3 : timestamp;
                }
                function spanToJSON(span) {
                    if (spanIsSentrySpan(span)) return span.getSpanJSON();
                    let { spanId: span_id, traceId: trace_id } = span.spanContext();
                    if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
                        let { attributes, startTime, name, endTime, status, links } = span;
                        return {
                            span_id,
                            trace_id,
                            data: attributes,
                            description: name,
                            parent_span_id: getOtelParentSpanId(span),
                            start_timestamp: spanTimeInputToSeconds(startTime),
                            timestamp: spanTimeInputToSeconds(endTime) || void 0,
                            status: getStatusMessage(status),
                            op: attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP],
                            origin: attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
                            links: convertSpanLinksForEnvelope(links),
                        };
                    }
                    return { span_id, trace_id, start_timestamp: 0, data: {} };
                }
                function getOtelParentSpanId(span) {
                    return "parentSpanId" in span ? span.parentSpanId : "parentSpanContext" in span ? span.parentSpanContext?.spanId : void 0;
                }
                function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
                    return !!span.attributes && !!span.startTime && !!span.name && !!span.endTime && !!span.status;
                }
                function spanIsSentrySpan(span) {
                    return "function" == typeof span.getSpanJSON;
                }
                function spanIsSampled(span) {
                    let { traceFlags } = span.spanContext();
                    return 1 === traceFlags;
                }
                function getStatusMessage(status) {
                    if (status && status.code !== spanstatus.SPAN_STATUS_UNSET) return status.code === spanstatus.SPAN_STATUS_OK ? "ok" : status.message || "internal_error";
                }
                function getSimpleStatusMessage(status) {
                    return status && status.code !== spanstatus.SPAN_STATUS_OK && status.code !== spanstatus.SPAN_STATUS_UNSET && "cancelled" !== status.message ? "error" : "ok";
                }
                let CHILD_SPANS_FIELD = "_sentryChildSpans",
                    ROOT_SPAN_FIELD = "_sentryRootSpan";
                function INTERNAL_getSegmentSpan(span) {
                    return span[ROOT_SPAN_FIELD] || span;
                }
                ((exports.INTERNAL_getSegmentSpan = INTERNAL_getSegmentSpan),
                    (exports.TRACE_FLAG_NONE = 0),
                    (exports.TRACE_FLAG_SAMPLED = 1),
                    (exports.addChildSpanToSpan = function (span, childSpan) {
                        let rootSpan = span[ROOT_SPAN_FIELD] || span;
                        (object.addNonEnumerableProperty(childSpan, ROOT_SPAN_FIELD, rootSpan),
                            span[CHILD_SPANS_FIELD] ? span[CHILD_SPANS_FIELD].add(childSpan) : object.addNonEnumerableProperty(span, CHILD_SPANS_FIELD, new Set([childSpan])));
                    }),
                    (exports.convertSpanLinksForEnvelope = convertSpanLinksForEnvelope),
                    (exports.getActiveSpan = function () {
                        let carrier$1 = carrier.getMainCarrier(),
                            acs = index.getAsyncContextStrategy(carrier$1);
                        return acs.getActiveSpan ? acs.getActiveSpan() : spanOnScope._getSpanForScope(currentScopes.getCurrentScope());
                    }),
                    (exports.getRootSpan = INTERNAL_getSegmentSpan),
                    (exports.getSimpleStatusMessage = getSimpleStatusMessage),
                    (exports.getSpanDescendants = function (span) {
                        let resultSet = new Set();
                        return (
                            !(function addSpanChildren(span) {
                                if (!resultSet.has(span) && spanIsSampled(span))
                                    for (let childSpan of (resultSet.add(span), span[CHILD_SPANS_FIELD] ? Array.from(span[CHILD_SPANS_FIELD]) : [])) addSpanChildren(childSpan);
                            })(span),
                            Array.from(resultSet)
                        );
                    }),
                    (exports.getStatusMessage = getStatusMessage),
                    (exports.getStreamedSpanLinks = getStreamedSpanLinks),
                    (exports.removeChildSpanFromSpan = function (span, childSpan) {
                        span[CHILD_SPANS_FIELD] && span[CHILD_SPANS_FIELD].delete(childSpan);
                    }),
                    (exports.showSpanDropWarning = function () {
                        hasShownSpanDropWarning ||
                            (debugLogger.consoleSandbox(() => {
                                console.warn(
                                    "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
                                );
                            }),
                            (hasShownSpanDropWarning = !0));
                    }),
                    (exports.spanIsSampled = spanIsSampled),
                    (exports.spanTimeInputToSeconds = spanTimeInputToSeconds),
                    (exports.spanToJSON = spanToJSON),
                    (exports.spanToStreamedSpanJSON = function (span) {
                        if (spanIsSentrySpan(span)) return span.getStreamedSpanJSON();
                        let { spanId: span_id, traceId: trace_id } = span.spanContext();
                        if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
                            let { attributes, startTime, name, endTime, status, links } = span;
                            return {
                                name,
                                span_id,
                                trace_id,
                                parent_span_id: getOtelParentSpanId(span),
                                start_timestamp: spanTimeInputToSeconds(startTime),
                                end_timestamp: spanTimeInputToSeconds(endTime),
                                is_segment: span === INTERNAL_getSegmentSpan(span),
                                status: getSimpleStatusMessage(status),
                                attributes,
                                links: getStreamedSpanLinks(links),
                            };
                        }
                        return { span_id, trace_id, start_timestamp: 0, name: "", end_timestamp: 0, status: "ok", is_segment: span === INTERNAL_getSegmentSpan(span) };
                    }),
                    (exports.spanToTraceContext = function (span) {
                        let { spanId, traceId: trace_id, isRemote } = span.spanContext(),
                            parent_span_id = isRemote ? spanId : spanToJSON(span).parent_span_id,
                            scope = utils.getCapturedScopesOnSpan(span).scope;
                        return { parent_span_id, span_id: isRemote ? scope?.getPropagationContext().propagationSpanId || propagationContext.generateSpanId() : spanId, trace_id };
                    }),
                    (exports.spanToTraceHeader = function (span) {
                        let { traceId, spanId } = span.spanContext(),
                            sampled = spanIsSampled(span);
                        return tracing.generateSentryTraceHeader(traceId, spanId, sampled);
                    }),
                    (exports.spanToTraceparentHeader = function (span) {
                        let { traceId, spanId } = span.spanContext(),
                            sampled = spanIsSampled(span);
                        return tracing.generateTraceparentHeader(traceId, spanId, sampled);
                    }),
                    (exports.spanToTransactionTraceContext = function (span) {
                        let { spanId: span_id, traceId: trace_id } = span.spanContext(),
                            { data, op, parent_span_id, status, origin, links } = spanToJSON(span);
                        return { parent_span_id, span_id, trace_id, data, op, status, origin, links };
                    }),
                    (exports.streamedSpanJsonToSerializedSpan = function (spanJson) {
                        return {
                            ...spanJson,
                            attributes: attributes.serializeAttributes(spanJson.attributes),
                            links: spanJson.links?.map((link) => ({ ...link, attributes: attributes.serializeAttributes(link.attributes) })),
                        };
                    }),
                    (exports.updateSpanName = function (span, name) {
                        (span.updateName(name),
                            span.setAttributes({
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom",
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME]: name,
                            }));
                    }));
            }