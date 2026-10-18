7588(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    hasSpansEnabled = __webpack_require__(3781),
                    shouldIgnoreSpan = __webpack_require__(7332),
                    spanOnScope = __webpack_require__(8740),
                    spanUtils = __webpack_require__(470),
                    time = __webpack_require__(602),
                    dynamicSamplingContext = __webpack_require__(241),
                    sentryNonRecordingSpan = __webpack_require__(3832),
                    sentrySpan = __webpack_require__(6637),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    TRACING_DEFAULTS = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 };
                ((exports.TRACING_DEFAULTS = TRACING_DEFAULTS),
                    (exports.startIdleSpan = function (startSpanOptions, options = {}) {
                        var options1;
                        let span,
                            _idleTimeoutID,
                            activities = new Map(),
                            _finished = !1,
                            _finishReason = "externalFinish",
                            _autoFinishAllowed = !options.disableAutoFinish,
                            _cleanupHooks = [],
                            {
                                idleTimeout = TRACING_DEFAULTS.idleTimeout,
                                finalTimeout = TRACING_DEFAULTS.finalTimeout,
                                childSpanTimeout = TRACING_DEFAULTS.childSpanTimeout,
                                beforeSpanEnd,
                                trimIdleSpanEndTimestamp = !0,
                            } = options,
                            client = currentScopes.getClient();
                        if (!client || !hasSpansEnabled.hasSpansEnabled()) {
                            let span = new sentryNonRecordingSpan.SentryNonRecordingSpan(),
                                dsc = { sample_rate: "0", sampled: "false", ...dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) };
                            return (dynamicSamplingContext.freezeDscOnSpan(span, dsc), span);
                        }
                        let scope = currentScopes.getCurrentScope(),
                            previousActiveSpan = spanUtils.getActiveSpan(),
                            span1 =
                                ((options1 = startSpanOptions),
                                (span = trace.startInactiveSpan(options1)),
                                spanOnScope._setSpanForScope(currentScopes.getCurrentScope(), span),
                                debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Tracing] Started span is an idle span"),
                                span);
                        function _cancelIdleTimeout() {
                            _idleTimeoutID && (clearTimeout(_idleTimeoutID), (_idleTimeoutID = void 0));
                        }
                        function _restartIdleTimeout(endTimestamp) {
                            (_cancelIdleTimeout(),
                                (_idleTimeoutID = setTimeout(() => {
                                    !_finished && 0 === activities.size && _autoFinishAllowed && ((_finishReason = "idleTimeout"), span1.end(endTimestamp));
                                }, idleTimeout)));
                        }
                        function _restartChildSpanTimeout(endTimestamp) {
                            _idleTimeoutID = setTimeout(() => {
                                !_finished && _autoFinishAllowed && ((_finishReason = "heartbeatFailed"), span1.end(endTimestamp));
                            }, childSpanTimeout);
                        }
                        function onIdleSpanEnded(endTimestamp) {
                            ((_finished = !0), activities.clear(), _cleanupHooks.forEach((cleanup) => cleanup()), spanOnScope._setSpanForScope(scope, previousActiveSpan));
                            let spanJSON = spanUtils.spanToJSON(span1),
                                { start_timestamp: startTimestamp } = spanJSON;
                            if (!startTimestamp) return;
                            spanJSON.data[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON] ||
                                span1.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, _finishReason);
                            let currentStatus = spanJSON.status;
                            ((currentStatus && "unknown" !== currentStatus) || span1.setStatus({ code: spanstatus.SPAN_STATUS_OK }),
                                debugLogger.debug.log(`[Tracing] Idle span "${spanJSON.op}" finished`));
                            let childSpans = spanUtils.getSpanDescendants(span1).filter((child) => child !== span1),
                                discardedSpans = 0;
                            (childSpans.forEach((childSpan) => {
                                childSpan.isRecording() &&
                                    (childSpan.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "cancelled" }),
                                    childSpan.end(endTimestamp),
                                    debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Tracing] Cancelling span since span ended early", JSON.stringify(childSpan, void 0, 2)));
                                let { timestamp: childEndTimestamp = 0, start_timestamp: childStartTimestamp = 0 } = spanUtils.spanToJSON(childSpan),
                                    spanStartedBeforeIdleSpanEnd = childStartTimestamp <= endTimestamp,
                                    spanEndedBeforeFinalTimeout = childEndTimestamp - childStartTimestamp <= (finalTimeout + idleTimeout) / 1e3;
                                if (debugBuild.DEBUG_BUILD) {
                                    let stringifiedSpan = JSON.stringify(childSpan, void 0, 2);
                                    spanStartedBeforeIdleSpanEnd
                                        ? spanEndedBeforeFinalTimeout ||
                                          debugLogger.debug.log("[Tracing] Discarding span since it finished after idle span final timeout", stringifiedSpan)
                                        : debugLogger.debug.log("[Tracing] Discarding span since it happened after idle span was finished", stringifiedSpan);
                                }
                                (!spanEndedBeforeFinalTimeout || !spanStartedBeforeIdleSpanEnd) && (spanUtils.removeChildSpanFromSpan(span1, childSpan), discardedSpans++);
                            }),
                                discardedSpans > 0 && span1.setAttribute("sentry.idle_span_discarded_spans", discardedSpans));
                        }
                        return (
                            (span1.end = new Proxy(span1.end, {
                                apply(target, thisArg, args) {
                                    if ((beforeSpanEnd && beforeSpanEnd(span1), thisArg instanceof sentryNonRecordingSpan.SentryNonRecordingSpan)) return;
                                    let [definedEndTimestamp, ...rest] = args,
                                        timestamp = definedEndTimestamp || time.timestampInSeconds(),
                                        spanEndTimestamp = spanUtils.spanTimeInputToSeconds(timestamp),
                                        spans = spanUtils.getSpanDescendants(span1).filter((child) => child !== span1),
                                        spanJson = spanUtils.spanToJSON(span1);
                                    if (!spans.length || !trimIdleSpanEndTimestamp)
                                        return (onIdleSpanEnded(spanEndTimestamp), Reflect.apply(target, thisArg, [spanEndTimestamp, ...rest]));
                                    let ignoreSpans = client.getOptions().ignoreSpans,
                                        latestSpanEndTimestamp = spans?.reduce(
                                            (acc, current) => {
                                                let currentSpanJson = spanUtils.spanToJSON(current);
                                                return !currentSpanJson.timestamp || (ignoreSpans && shouldIgnoreSpan.shouldIgnoreSpan(currentSpanJson, ignoreSpans))
                                                    ? acc
                                                    : acc
                                                      ? Math.max(acc, currentSpanJson.timestamp)
                                                      : currentSpanJson.timestamp;
                                            },
                                            void 0,
                                        ),
                                        spanStartTimestamp = spanJson.start_timestamp,
                                        endTimestamp = Math.min(
                                            spanStartTimestamp ? spanStartTimestamp + finalTimeout / 1e3 : 1 / 0,
                                            Math.max(spanStartTimestamp || -1 / 0, Math.min(spanEndTimestamp, latestSpanEndTimestamp || 1 / 0)),
                                        );
                                    return (onIdleSpanEnded(endTimestamp), Reflect.apply(target, thisArg, [endTimestamp, ...rest]));
                                },
                            })),
                            _cleanupHooks.push(
                                client.on("spanStart", (startedSpan) => {
                                    var spanId;
                                    !(
                                        _finished ||
                                        startedSpan === span1 ||
                                        spanUtils.spanToJSON(startedSpan).timestamp ||
                                        (startedSpan instanceof sentrySpan.SentrySpan && startedSpan.isStandaloneSpan())
                                    ) &&
                                        spanUtils.getSpanDescendants(span1).includes(startedSpan) &&
                                        ((spanId = startedSpan.spanContext().spanId),
                                        _cancelIdleTimeout(),
                                        activities.set(spanId, !0),
                                        _restartChildSpanTimeout(time.timestampInSeconds() + childSpanTimeout / 1e3));
                                }),
                            ),
                            _cleanupHooks.push(
                                client.on("spanEnd", (endedSpan) => {
                                    if (!_finished) {
                                        var spanId;
                                        ((spanId = endedSpan.spanContext().spanId),
                                            activities.has(spanId) && activities.delete(spanId),
                                            0 === activities.size && _restartIdleTimeout(time.timestampInSeconds() + idleTimeout / 1e3));
                                    }
                                }),
                            ),
                            _cleanupHooks.push(
                                client.on("idleSpanEnableAutoFinish", (spanToAllowAutoFinish) => {
                                    spanToAllowAutoFinish === span1 && ((_autoFinishAllowed = !0), _restartIdleTimeout(), activities.size && _restartChildSpanTimeout());
                                }),
                            ),
                            options.disableAutoFinish || _restartIdleTimeout(),
                            setTimeout(() => {
                                _finished || (span1.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "deadline_exceeded" }), (_finishReason = "finalTimeout"), span1.end());
                            }, finalTimeout),
                            span1
                        );
                    }));
            }