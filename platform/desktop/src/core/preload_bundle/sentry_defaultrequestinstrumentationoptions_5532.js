5532(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    utils = __webpack_require__(3044),
                    responseToSpanId = new WeakMap(),
                    spanIdToEndTimestamp = new Map(),
                    defaultRequestInstrumentationOptions = { traceFetch: !0, traceXHR: !0, enableHTTPTimings: !0, trackFetchStreamPerformance: !1 };
                function addHTTPTimings(span, client) {
                    let { url } = core.spanToJSON(span).data;
                    if (!url || "string" != typeof url) return;
                    let onEntryFound = () => void setTimeout(unsubscribePerformanceObsever);
                    if (core.hasSpanStreamingEnabled(client)) {
                        let originalEnd = span.end.bind(span);
                        span.end = (endTimestamp) => {
                            let capturedEndTimestamp = endTimestamp ?? core.timestampInSeconds(),
                                isEnded = !1,
                                endSpanAndCleanup = () => {
                                    isEnded || ((isEnded = !0), setTimeout(unsubscribePerformanceObsever), originalEnd(capturedEndTimestamp), clearTimeout(fallbackTimeout));
                                };
                            onEntryFound = endSpanAndCleanup;
                            let fallbackTimeout = setTimeout(endSpanAndCleanup, 300);
                        };
                    }
                    let unsubscribePerformanceObsever = browserUtils.addPerformanceInstrumentationHandler("resource", ({ entries }) => {
                        entries.forEach((entry) => {
                            utils.isPerformanceResourceTiming(entry) &&
                                entry.name.endsWith(url) &&
                                (span.setAttributes(browserUtils.resourceTimingToSpanAttributes(entry)), onEntryFound());
                        });
                    });
                }
                function shouldAttachHeaders(targetUrl, tracePropagationTargets) {
                    let href = core.getLocationHref();
                    if (href) {
                        let resolvedUrl, currentOrigin;
                        try {
                            ((resolvedUrl = new URL(targetUrl, href)), (currentOrigin = new URL(href).origin));
                        } catch {
                            return !1;
                        }
                        let isSameOriginRequest = resolvedUrl.origin === currentOrigin;
                        return tracePropagationTargets
                            ? core.stringMatchesSomePattern(resolvedUrl.toString(), tracePropagationTargets) ||
                                  (isSameOriginRequest && core.stringMatchesSomePattern(resolvedUrl.pathname, tracePropagationTargets))
                            : isSameOriginRequest;
                    }
                    {
                        let isRelativeSameOriginRequest = !!targetUrl.match(/^\/(?!\/)/);
                        return tracePropagationTargets ? core.stringMatchesSomePattern(targetUrl, tracePropagationTargets) : isRelativeSameOriginRequest;
                    }
                }
                ((exports.defaultRequestInstrumentationOptions = defaultRequestInstrumentationOptions),
                    (exports.instrumentOutgoingRequests = function (client, _options) {
                        let {
                                traceFetch,
                                traceXHR,
                                trackFetchStreamPerformance,
                                shouldCreateSpanForRequest,
                                enableHTTPTimings,
                                tracePropagationTargets,
                                onRequestSpanStart,
                                onRequestSpanEnd,
                            } = { ...defaultRequestInstrumentationOptions, ..._options },
                            shouldCreateSpan = "function" == typeof shouldCreateSpanForRequest ? shouldCreateSpanForRequest : (_) => !0,
                            shouldAttachHeadersWithTargets = (url) => shouldAttachHeaders(url, tracePropagationTargets),
                            spans = {},
                            propagateTraceparent = client.getOptions().propagateTraceparent;
                        (traceFetch &&
                            (client.addEventProcessor(
                                (event) => (
                                    "transaction" === event.type &&
                                        event.spans &&
                                        event.spans.forEach((span) => {
                                            if ("http.client" === span.op) {
                                                let updatedTimestamp = spanIdToEndTimestamp.get(span.span_id);
                                                updatedTimestamp && ((span.timestamp = updatedTimestamp / 1e3), spanIdToEndTimestamp.delete(span.span_id));
                                            }
                                        }),
                                    event
                                ),
                            ),
                            trackFetchStreamPerformance &&
                                core.addFetchEndInstrumentationHandler((handlerData) => {
                                    if (handlerData.response) {
                                        let span = responseToSpanId.get(handlerData.response);
                                        span && handlerData.endTimestamp && spanIdToEndTimestamp.set(span, handlerData.endTimestamp);
                                    }
                                }),
                            core.addFetchInstrumentationHandler((handlerData) => {
                                let createdSpan = core.instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans, {
                                    propagateTraceparent,
                                    onRequestSpanEnd,
                                });
                                if (
                                    (handlerData.response && handlerData.fetchData.__span && responseToSpanId.set(handlerData.response, handlerData.fetchData.__span), createdSpan)
                                ) {
                                    let fullUrl = utils.getFullURL(handlerData.fetchData.url),
                                        host = fullUrl ? core.parseUrl(fullUrl).host : void 0;
                                    (createdSpan.setAttributes({ "http.url": fullUrl ? core.stripDataUrlContent(fullUrl) : void 0, "server.address": host }),
                                        enableHTTPTimings && addHTTPTimings(createdSpan, client),
                                        onRequestSpanStart?.(createdSpan, { headers: handlerData.headers }));
                                }
                            })),
                            traceXHR &&
                                browserUtils.addXhrInstrumentationHandler((handlerData) => {
                                    let createdSpan = (function (handlerData, shouldCreateSpan, shouldAttachHeaders, spans, propagateTraceparent, onRequestSpanEnd) {
                                        let xhr = handlerData.xhr,
                                            sentryXhrData = xhr?.[browserUtils.SENTRY_XHR_DATA_KEY];
                                        if (!xhr || xhr.__sentry_own_request__ || !sentryXhrData) return;
                                        let { url, method } = sentryXhrData,
                                            shouldCreateSpanResult = core.hasSpansEnabled() && shouldCreateSpan(url);
                                        if (handlerData.endTimestamp) {
                                            let spanId = xhr.__sentry_xhr_span_id__;
                                            if (!spanId) return;
                                            let span = spans[spanId];
                                            span &&
                                                (shouldCreateSpanResult &&
                                                    void 0 !== sentryXhrData.status_code &&
                                                    (core.setHttpStatus(span, sentryXhrData.status_code),
                                                    span.end(),
                                                    onRequestSpanEnd?.(span, {
                                                        headers: utils.createHeadersSafely(browserUtils.parseXhrResponseHeaders(xhr)),
                                                        error: handlerData.error,
                                                    })),
                                                delete spans[spanId]);
                                            return;
                                        }
                                        let fullUrl = utils.getFullURL(url),
                                            parsedUrl = fullUrl ? core.parseUrl(fullUrl) : core.parseUrl(url),
                                            urlForSpanName = core.stripDataUrlContent(core.stripUrlQueryAndFragment(url)),
                                            client = core.getClient(),
                                            hasParent = !!core.getActiveSpan(),
                                            span =
                                                shouldCreateSpanResult && hasParent
                                                    ? core.startInactiveSpan({
                                                          name: `${method} ${urlForSpanName}`,
                                                          attributes: {
                                                              url: core.stripDataUrlContent(url),
                                                              type: "xhr",
                                                              "http.method": method,
                                                              "http.url": fullUrl ? core.stripDataUrlContent(fullUrl) : void 0,
                                                              "server.address": parsedUrl?.host,
                                                              [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser",
                                                              [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "http.client",
                                                              ...(parsedUrl?.search && { "http.query": parsedUrl?.search }),
                                                              ...(parsedUrl?.hash && { "http.fragment": parsedUrl?.hash }),
                                                          },
                                                      })
                                                    : new core.SentryNonRecordingSpan();
                                        return (
                                            shouldCreateSpanResult && !hasParent && client?.recordDroppedEvent("no_parent_span", "span"),
                                            (xhr.__sentry_xhr_span_id__ = span.spanContext().spanId),
                                            (spans[xhr.__sentry_xhr_span_id__] = span),
                                            shouldAttachHeaders(url) &&
                                                (function (xhr, span, propagateTraceparent) {
                                                    let { "sentry-trace": sentryTrace, baggage, traceparent } = core.getTraceData({ span, propagateTraceparent });
                                                    sentryTrace &&
                                                        (function (xhr, sentryTraceHeader, sentryBaggageHeader, traceparentHeader) {
                                                            let originalHeaders = xhr.__sentry_xhr_v3__?.request_headers;
                                                            if (!originalHeaders?.["sentry-trace"] && xhr.setRequestHeader)
                                                                try {
                                                                    if (
                                                                        (xhr.setRequestHeader("sentry-trace", sentryTraceHeader),
                                                                        traceparentHeader &&
                                                                            !originalHeaders?.traceparent &&
                                                                            xhr.setRequestHeader("traceparent", traceparentHeader),
                                                                        sentryBaggageHeader)
                                                                    ) {
                                                                        let originalBaggageHeader = originalHeaders?.baggage;
                                                                        (originalBaggageHeader && utils.baggageHeaderHasSentryValues(originalBaggageHeader)) ||
                                                                            xhr.setRequestHeader("baggage", sentryBaggageHeader);
                                                                    }
                                                                } catch {}
                                                        })(xhr, sentryTrace, baggage, traceparent);
                                                })(xhr, core.hasSpansEnabled() && hasParent ? span : void 0, propagateTraceparent),
                                            client && client.emit("beforeOutgoingRequestSpan", span, handlerData),
                                            span
                                        );
                                    })(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans, propagateTraceparent, onRequestSpanEnd);
                                    createdSpan &&
                                        (enableHTTPTimings && addHTTPTimings(createdSpan, client),
                                        onRequestSpanStart?.(createdSpan, { headers: utils.createHeadersSafely(handlerData.xhr.__sentry_xhr_v3__?.request_headers) }));
                                }));
                    }),
                    (exports.shouldAttachHeaders = shouldAttachHeaders));
            }