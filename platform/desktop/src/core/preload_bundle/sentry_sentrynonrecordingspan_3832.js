3832(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let propagationContext = __webpack_require__(8034),
                    spanUtils = __webpack_require__(470);
                exports.SentryNonRecordingSpan = class {
                    constructor(spanContext = {}) {
                        ((this._traceId = spanContext.traceId || propagationContext.generateTraceId()),
                            (this._spanId = spanContext.spanId || propagationContext.generateSpanId()),
                            (this.dropReason = spanContext.dropReason));
                    }
                    spanContext() {
                        return { spanId: this._spanId, traceId: this._traceId, traceFlags: spanUtils.TRACE_FLAG_NONE };
                    }
                    end(_timestamp) {}
                    setAttribute(_key, _value) {
                        return this;
                    }
                    setAttributes(_values) {
                        return this;
                    }
                    setStatus(_status) {
                        return this;
                    }
                    updateName(_name) {
                        return this;
                    }
                    isRecording() {
                        return !1;
                    }
                    addEvent(_name, _attributesOrStartTime, _startTime) {
                        return this;
                    }
                    addLink(_link) {
                        return this;
                    }
                    addLinks(_links) {
                        return this;
                    }
                    recordException(_exception, _time) {}
                };
            }