833(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    semanticAttributes = __webpack_require__(3052),
                    spanUtils = __webpack_require__(470),
                    spanstatus = __webpack_require__(2232),
                    is = __webpack_require__(7431),
                    hasSpansEnabled = __webpack_require__(3781),
                    baggage = __webpack_require__(3549),
                    sentryNonRecordingSpan = __webpack_require__(3832),
                    trace = __webpack_require__(6833),
                    traceData = __webpack_require__(5386),
                    url = __webpack_require__(1410);
                function _callOnRequestSpanEnd(span, handlerData, spanOriginOrOptions) {
                    let onRequestSpanEnd = "object" == typeof spanOriginOrOptions && null !== spanOriginOrOptions ? spanOriginOrOptions.onRequestSpanEnd : void 0;
                    onRequestSpanEnd?.(span, { headers: handlerData.response?.headers, error: handlerData.error });
                }
                function _INTERNAL_getTracingHeadersForFetchRequest(request, fetchOptionsObj, span, propagateTraceparent) {
                    var headers, headers1;
                    let traceHeaders = traceData.getTraceData({ span, propagateTraceparent }),
                        sentryTrace = traceHeaders["sentry-trace"],
                        baggage = traceHeaders.baggage,
                        traceparent = traceHeaders.traceparent;
                    if (!sentryTrace) return;
                    let originalHeaders = fetchOptionsObj.headers || (is.isRequest(request) ? request.headers : void 0);
                    if (!originalHeaders) return { ...traceHeaders };
                    if (((headers = originalHeaders), "u" > typeof Headers && is.isInstanceOf(headers, Headers))) {
                        let newHeaders = new Headers(originalHeaders);
                        if (
                            (newHeaders.get("sentry-trace") || newHeaders.set("sentry-trace", sentryTrace),
                            propagateTraceparent && traceparent && !newHeaders.get("traceparent") && newHeaders.set("traceparent", traceparent),
                            baggage)
                        ) {
                            let prevBaggageHeader = newHeaders.get("baggage");
                            prevBaggageHeader
                                ? baggageHeaderHasSentryBaggageValues(prevBaggageHeader) || newHeaders.set("baggage", `${prevBaggageHeader},${baggage}`)
                                : newHeaders.set("baggage", baggage);
                        }
                        return newHeaders;
                    }
                    if (Array.isArray((headers1 = originalHeaders)) && headers1.every((item) => Array.isArray(item) && 2 === item.length && "string" == typeof item[0])) {
                        let newHeaders = [...originalHeaders];
                        (newHeaders.find((header) => "sentry-trace" === header[0]) || newHeaders.push(["sentry-trace", sentryTrace]),
                            propagateTraceparent && traceparent && !newHeaders.find((header) => "traceparent" === header[0]) && newHeaders.push(["traceparent", traceparent]));
                        let prevBaggageHeaderWithSentryValues = originalHeaders.find(
                            (header) => "baggage" === header[0] && "string" == typeof header[1] && baggageHeaderHasSentryBaggageValues(header[1]),
                        );
                        return (baggage && !prevBaggageHeaderWithSentryValues && newHeaders.push(["baggage", baggage]), newHeaders);
                    }
                    {
                        let existingSentryTraceHeader = "sentry-trace" in originalHeaders ? originalHeaders["sentry-trace"] : void 0,
                            existingTraceparentHeader = "traceparent" in originalHeaders ? originalHeaders.traceparent : void 0,
                            existingBaggageHeader = "baggage" in originalHeaders ? originalHeaders.baggage : void 0,
                            newBaggageHeaders = existingBaggageHeader ? (Array.isArray(existingBaggageHeader) ? [...existingBaggageHeader] : [existingBaggageHeader]) : [],
                            prevBaggageHeaderWithSentryValues =
                                existingBaggageHeader &&
                                (Array.isArray(existingBaggageHeader)
                                    ? existingBaggageHeader.find((headerItem) => baggageHeaderHasSentryBaggageValues(headerItem))
                                    : baggageHeaderHasSentryBaggageValues(existingBaggageHeader));
                        baggage && !prevBaggageHeaderWithSentryValues && newBaggageHeaders.push(baggage);
                        let newHeaders = Object.assign({}, originalHeaders, {
                            "sentry-trace": existingSentryTraceHeader ?? sentryTrace,
                            baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(",") : void 0,
                        });
                        return (propagateTraceparent && traceparent && !existingTraceparentHeader && (newHeaders.traceparent = traceparent), newHeaders);
                    }
                }
                function baggageHeaderHasSentryBaggageValues(baggageHeader) {
                    return "string" == typeof baggageHeader && baggageHeader.split(",").some((baggageEntry) => baggageEntry.trim().startsWith(baggage.SENTRY_BAGGAGE_KEY_PREFIX));
                }
                function getFetchSpanAttributes(url$1, parsedUrl, method, spanOrigin) {
                    let attributes = {
                        url: url.stripDataUrlContent(url$1),
                        type: "fetch",
                        "http.method": method,
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "http.client",
                    };
                    return (
                        parsedUrl &&
                            (url.isURLObjectRelative(parsedUrl) ||
                                ((attributes["http.url"] = url.stripDataUrlContent(parsedUrl.href)), (attributes["server.address"] = parsedUrl.host)),
                            parsedUrl.search && (attributes["http.query"] = parsedUrl.search),
                            parsedUrl.hash && (attributes["http.fragment"] = parsedUrl.hash)),
                        attributes
                    );
                }
                ((exports._INTERNAL_getTracingHeadersForFetchRequest = _INTERNAL_getTracingHeadersForFetchRequest),
                    (exports._callOnRequestSpanEnd = _callOnRequestSpanEnd),
                    (exports.instrumentFetchRequest = function (handlerData, shouldCreateSpan, shouldAttachHeaders, spans, spanOriginOrOptions) {
                        if (!handlerData.fetchData) return;
                        let { method, url: url1 } = handlerData.fetchData,
                            shouldCreateSpanResult = hasSpansEnabled.hasSpansEnabled() && shouldCreateSpan(url1);
                        if (handlerData.endTimestamp) {
                            let spanId = handlerData.fetchData.__span;
                            if (!spanId) return;
                            let span = spans[spanId];
                            span &&
                                (shouldCreateSpanResult &&
                                    ((function (span, handlerData) {
                                        if (handlerData.response) {
                                            spanstatus.setHttpStatus(span, handlerData.response.status);
                                            let contentLength = handlerData.response?.headers?.get("content-length");
                                            if (contentLength) {
                                                let contentLengthNum = parseInt(contentLength);
                                                contentLengthNum > 0 && span.setAttribute("http.response_content_length", contentLengthNum);
                                            }
                                        } else handlerData.error && span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
                                        span.end();
                                    })(span, handlerData),
                                    _callOnRequestSpanEnd(span, handlerData, spanOriginOrOptions)),
                                delete spans[spanId]);
                            return;
                        }
                        let { spanOrigin = "auto.http.browser", propagateTraceparent = !1 } =
                                "object" == typeof spanOriginOrOptions ? spanOriginOrOptions : { spanOrigin: spanOriginOrOptions },
                            client = currentScopes.getClient(),
                            hasParent = !!spanUtils.getActiveSpan(),
                            span =
                                shouldCreateSpanResult && hasParent
                                    ? trace.startInactiveSpan(
                                          (function (url$1, method, spanOrigin) {
                                              if (url$1.startsWith("data:")) {
                                                  let sanitizedUrl = url.stripDataUrlContent(url$1);
                                                  return { name: `${method} ${sanitizedUrl}`, attributes: getFetchSpanAttributes(url$1, void 0, method, spanOrigin) };
                                              }
                                              let parsedUrl = url.parseStringToURLObject(url$1),
                                                  sanitizedUrl = parsedUrl ? url.getSanitizedUrlStringFromUrlObject(parsedUrl) : url$1;
                                              return { name: `${method} ${sanitizedUrl}`, attributes: getFetchSpanAttributes(url$1, parsedUrl, method, spanOrigin) };
                                          })(url1, method, spanOrigin),
                                      )
                                    : new sentryNonRecordingSpan.SentryNonRecordingSpan();
                        if (
                            (shouldCreateSpanResult && !hasParent && client?.recordDroppedEvent("no_parent_span", "span"),
                            (handlerData.fetchData.__span = span.spanContext().spanId),
                            (spans[span.spanContext().spanId] = span),
                            shouldAttachHeaders(handlerData.fetchData.url))
                        ) {
                            let request = handlerData.args[0],
                                options = { ...(handlerData.args[1] || {}) },
                                headers = _INTERNAL_getTracingHeadersForFetchRequest(
                                    request,
                                    options,
                                    hasSpansEnabled.hasSpansEnabled() && hasParent ? span : void 0,
                                    propagateTraceparent,
                                );
                            headers && ((handlerData.args[1] = options), (options.headers = headers));
                        }
                        if (client) {
                            let fetchHint = {
                                input: handlerData.args,
                                response: handlerData.response,
                                startTimestamp: handlerData.startTimestamp,
                                endTimestamp: handlerData.endTimestamp,
                            };
                            client.emit("beforeOutgoingRequestSpan", span, fetchHint);
                        }
                        return span;
                    }));
            }