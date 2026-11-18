6637(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    envelope = __webpack_require__(2477),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    propagationContext = __webpack_require__(8034),
                    spanUtils = __webpack_require__(470),
                    time = __webpack_require__(602),
                    dynamicSamplingContext = __webpack_require__(241),
                    logSpans = __webpack_require__(8101),
                    measurement = __webpack_require__(8640),
                    hasSpanStreamingEnabled = __webpack_require__(9807),
                    utils = __webpack_require__(3033);
                class SentrySpan {
                    constructor(spanContext = {}) {
                        ((this._traceId = spanContext.traceId || propagationContext.generateTraceId()),
                            (this._spanId = spanContext.spanId || propagationContext.generateSpanId()),
                            (this._startTime = spanContext.startTimestamp || time.timestampInSeconds()),
                            (this._links = spanContext.links),
                            (this._attributes = {}),
                            this.setAttributes({
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "manual",
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanContext.op,
                                ...spanContext.attributes,
                            }),
                            (this._name = spanContext.name),
                            spanContext.parentSpanId && (this._parentSpanId = spanContext.parentSpanId),
                            "sampled" in spanContext && (this._sampled = spanContext.sampled),
                            spanContext.endTimestamp && (this._endTime = spanContext.endTimestamp),
                            (this._events = []),
                            (this._isStandaloneSpan = spanContext.isStandalone),
                            this._endTime && this._onSpanEnded());
                    }
                    addLink(link) {
                        return (this._links ? this._links.push(link) : (this._links = [link]), this);
                    }
                    addLinks(links) {
                        return (this._links ? this._links.push(...links) : (this._links = links), this);
                    }
                    recordException(_exception, _time) {}
                    spanContext() {
                        let { _spanId: spanId, _traceId: traceId, _sampled: sampled } = this;
                        return { spanId, traceId, traceFlags: sampled ? spanUtils.TRACE_FLAG_SAMPLED : spanUtils.TRACE_FLAG_NONE };
                    }
                    setAttribute(key, value) {
                        return (void 0 === value ? delete this._attributes[key] : (this._attributes[key] = value), this);
                    }
                    setAttributes(attributes) {
                        return (Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key])), this);
                    }
                    updateStartTime(timeInput) {
                        this._startTime = spanUtils.spanTimeInputToSeconds(timeInput);
                    }
                    setStatus(value) {
                        return ((this._status = value), this);
                    }
                    updateName(name) {
                        return ((this._name = name), this.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "custom"), this);
                    }
                    end(endTimestamp) {
                        this._endTime || ((this._endTime = spanUtils.spanTimeInputToSeconds(endTimestamp)), logSpans.logSpanEnd(this), this._onSpanEnded());
                    }
                    getSpanJSON() {
                        return {
                            data: this._attributes,
                            description: this._name,
                            op: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP],
                            parent_span_id: this._parentSpanId,
                            span_id: this._spanId,
                            start_timestamp: this._startTime,
                            status: spanUtils.getStatusMessage(this._status),
                            timestamp: this._endTime,
                            trace_id: this._traceId,
                            origin: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
                            profile_id: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_PROFILE_ID],
                            exclusive_time: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
                            measurements: measurement.timedEventsToMeasurements(this._events),
                            is_segment: (this._isStandaloneSpan && spanUtils.getRootSpan(this) === this) || void 0,
                            segment_id: this._isStandaloneSpan ? spanUtils.getRootSpan(this).spanContext().spanId : void 0,
                            links: spanUtils.convertSpanLinksForEnvelope(this._links),
                        };
                    }
                    getStreamedSpanJSON() {
                        return {
                            name: this._name ?? "",
                            span_id: this._spanId,
                            trace_id: this._traceId,
                            parent_span_id: this._parentSpanId,
                            start_timestamp: this._startTime,
                            end_timestamp: this._endTime ?? this._startTime,
                            is_segment: this._isStandaloneSpan || this === spanUtils.getRootSpan(this),
                            status: spanUtils.getSimpleStatusMessage(this._status),
                            attributes: this._attributes,
                            links: spanUtils.getStreamedSpanLinks(this._links),
                        };
                    }
                    isRecording() {
                        return !this._endTime && !!this._sampled;
                    }
                    addEvent(name, attributesOrStartTime, startTime) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Tracing] Adding an event to span:", name);
                        let time$1 = isSpanTimeInput(attributesOrStartTime) ? attributesOrStartTime : startTime || time.timestampInSeconds(),
                            attributes = isSpanTimeInput(attributesOrStartTime) ? {} : attributesOrStartTime || {},
                            event = { name, time: spanUtils.spanTimeInputToSeconds(time$1), attributes };
                        return (this._events.push(event), this);
                    }
                    isStandaloneSpan() {
                        return !!this._isStandaloneSpan;
                    }
                    _onSpanEnded() {
                        let client = currentScopes.getClient();
                        if (
                            (client && (client.emit("spanEnd", this), this._isStandaloneSpan || client.emit("afterSpanEnd", this)),
                            !(this._isStandaloneSpan || this === spanUtils.getRootSpan(this)))
                        )
                            return;
                        if (this._isStandaloneSpan)
                            return void (this._sampled
                                ? (function (envelope) {
                                      let client = currentScopes.getClient();
                                      if (!client) return;
                                      let spanItems = envelope[1];
                                      spanItems && 0 !== spanItems.length ? client.sendEnvelope(envelope) : client.recordDroppedEvent("before_send", "span");
                                  })(envelope.createSpanEnvelope([this], client))
                                : (debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Tracing] Discarding standalone span because its trace was not chosen to be sampled."),
                                  client && client.recordDroppedEvent("sample_rate", "span")));
                        if (client && hasSpanStreamingEnabled.hasSpanStreamingEnabled(client)) return void client.emit("afterSegmentSpanEnd", this);
                        let transactionEvent = this._convertSpanToTransaction();
                        transactionEvent && (utils.getCapturedScopesOnSpan(this).scope || currentScopes.getCurrentScope()).captureEvent(transactionEvent);
                    }
                    _convertSpanToTransaction() {
                        if (!isFullFinishedSpan(spanUtils.spanToJSON(this))) return;
                        this._name ||
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Transaction has no name, falling back to `<unlabeled transaction>`."),
                            (this._name = "<unlabeled transaction>"));
                        let { scope: capturedSpanScope, isolationScope: capturedSpanIsolationScope } = utils.getCapturedScopesOnSpan(this),
                            normalizedRequest = capturedSpanScope?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
                        if (!0 !== this._sampled) return;
                        let spans = spanUtils
                                .getSpanDescendants(this)
                                .filter((span) => {
                                    var span1;
                                    return span !== this && !((span1 = span) instanceof SentrySpan && span1.isStandaloneSpan());
                                })
                                .map((span) => spanUtils.spanToJSON(span))
                                .filter(isFullFinishedSpan),
                            source = this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
                        (delete this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME],
                            spans.forEach((span) => {
                                delete span.data[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
                            }));
                        let transaction = {
                                contexts: { trace: spanUtils.spanToTransactionTraceContext(this) },
                                spans: spans.length > 1e3 ? spans.sort((a, b) => a.start_timestamp - b.start_timestamp).slice(0, 1e3) : spans,
                                start_timestamp: this._startTime,
                                timestamp: this._endTime,
                                transaction: this._name,
                                type: "transaction",
                                sdkProcessingMetadata: {
                                    capturedSpanScope,
                                    capturedSpanIsolationScope,
                                    dynamicSamplingContext: dynamicSamplingContext.getDynamicSamplingContextFromSpan(this),
                                },
                                request: normalizedRequest,
                                ...(source && { transaction_info: { source } }),
                            },
                            measurements = measurement.timedEventsToMeasurements(this._events);
                        return (
                            measurements &&
                                Object.keys(measurements).length &&
                                (debugBuild.DEBUG_BUILD &&
                                    debugLogger.debug.log("[Measurements] Adding measurements to transaction event", JSON.stringify(measurements, void 0, 2)),
                                (transaction.measurements = measurements)),
                            transaction
                        );
                    }
                }
                function isSpanTimeInput(value) {
                    return (value && "number" == typeof value) || value instanceof Date || Array.isArray(value);
                }
                function isFullFinishedSpan(input) {
                    return !!input.start_timestamp && !!input.timestamp && !!input.span_id && !!input.trace_id;
                }
                exports.SentrySpan = SentrySpan;
            }