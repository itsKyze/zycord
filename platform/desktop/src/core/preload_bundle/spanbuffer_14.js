14(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    timer = __webpack_require__(90),
                    dynamicSamplingContext = __webpack_require__(241),
                    envelope = __webpack_require__(4812),
                    estimateSize = __webpack_require__(2647);
                exports.SpanBuffer = class {
                    constructor(client, options) {
                        ((this._traceBuckets = new Map()), (this._client = client));
                        const { maxSpanLimit, flushInterval, maxTraceWeightInBytes } = options ?? {};
                        ((this._maxSpanLimit = maxSpanLimit && maxSpanLimit > 0 && maxSpanLimit <= 1e3 ? maxSpanLimit : 1e3),
                            (this._flushInterval = flushInterval && flushInterval > 0 ? flushInterval : 5e3),
                            (this._maxTraceWeight = maxTraceWeightInBytes && maxTraceWeightInBytes > 0 ? maxTraceWeightInBytes : 5e6),
                            this._client.on("flush", () => {
                                this.drain();
                            }),
                            this._client.on("close", () => {
                                (this._traceBuckets.forEach((bucket) => {
                                    clearTimeout(bucket.timeout);
                                }),
                                    this._traceBuckets.clear());
                            }));
                    }
                    add(spanJSON) {
                        let traceId = spanJSON.trace_id,
                            bucket = this._traceBuckets.get(traceId);
                        (bucket ||
                            ((bucket = {
                                spans: new Set(),
                                size: 0,
                                timeout: timer.safeUnref(
                                    setTimeout(() => {
                                        this.flush(traceId);
                                    }, this._flushInterval),
                                ),
                            }),
                            this._traceBuckets.set(traceId, bucket)),
                            bucket.spans.add(spanJSON),
                            (bucket.size += estimateSize.estimateSerializedSpanSizeInBytes(spanJSON)),
                            (bucket.spans.size >= this._maxSpanLimit || bucket.size >= this._maxTraceWeight) && this.flush(traceId));
                    }
                    drain() {
                        this._traceBuckets.size &&
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Flushing span tree map with ${this._traceBuckets.size} traces`),
                            this._traceBuckets.forEach((_, traceId) => {
                                this.flush(traceId);
                            }));
                    }
                    flush(traceId) {
                        let bucket = this._traceBuckets.get(traceId);
                        if (!bucket) return;
                        if (!bucket.spans.size) return void this._removeTrace(traceId);
                        let spans = Array.from(bucket.spans),
                            segmentSpan = spans[0]?._segmentSpan;
                        if (!segmentSpan) {
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No segment span reference found on span JSON, cannot compute DSC"), this._removeTrace(traceId));
                            return;
                        }
                        let dsc = dynamicSamplingContext.getDynamicSamplingContextFromSpan(segmentSpan),
                            cleanedSpans = spans.map((spanJSON) => {
                                let { _segmentSpan, ...cleanSpanJSON } = spanJSON;
                                return cleanSpanJSON;
                            }),
                            envelope$1 = envelope.createStreamedSpanEnvelope(cleanedSpans, dsc, this._client);
                        (debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Sending span envelope for trace ${traceId} with ${cleanedSpans.length} spans`),
                            this._client.sendEnvelope(envelope$1).then(null, (reason) => {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.error("Error while sending streamed span envelope:", reason);
                            }),
                            this._removeTrace(traceId));
                    }
                    _removeTrace(traceId) {
                        let bucket = this._traceBuckets.get(traceId);
                        (bucket && clearTimeout(bucket.timeout), this._traceBuckets.delete(traceId));
                    }
                };
            }