802(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(4924),
                    carrier = __webpack_require__(5),
                    currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    scopeData = __webpack_require__(4955),
                    spanOnScope = __webpack_require__(8740),
                    time = __webpack_require__(602),
                    timestampSequence = __webpack_require__(7286),
                    traceInfo = __webpack_require__(559),
                    envelope = __webpack_require__(9947);
                function setMetricAttribute(metricAttributes, key, value, setEvenIfPresent = !0) {
                    !value || (!setEvenIfPresent && key in metricAttributes) || (metricAttributes[key] = value);
                }
                function _INTERNAL_captureSerializedMetric(client, serializedMetric) {
                    let bufferMap = _getBufferMap(),
                        metricBuffer = _INTERNAL_getMetricBuffer(client);
                    void 0 === metricBuffer
                        ? bufferMap.set(client, [serializedMetric])
                        : metricBuffer.length >= 1e3
                          ? (_INTERNAL_flushMetricsBuffer(client, metricBuffer), bufferMap.set(client, [serializedMetric]))
                          : bufferMap.set(client, [...metricBuffer, serializedMetric]);
                }
                function _INTERNAL_flushMetricsBuffer(client, maybeMetricBuffer) {
                    let metricBuffer = maybeMetricBuffer ?? _INTERNAL_getMetricBuffer(client) ?? [];
                    if (0 === metricBuffer.length) return;
                    let clientOptions = client.getOptions(),
                        envelope$1 = envelope.createMetricEnvelope(metricBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
                    (_getBufferMap().set(client, []), client.emit("flushMetrics"), client.sendEnvelope(envelope$1));
                }
                function _INTERNAL_getMetricBuffer(client) {
                    return _getBufferMap().get(client);
                }
                function _getBufferMap() {
                    return carrier.getGlobalSingleton("clientToMetricBufferMap", () => new WeakMap());
                }
                ((exports._INTERNAL_captureMetric = function (beforeMetric, options) {
                    let currentScope = options?.scope ?? currentScopes.getCurrentScope(),
                        captureSerializedMetric = options?.captureSerializedMetric ?? _INTERNAL_captureSerializedMetric,
                        client = currentScope?.getClient() ?? currentScopes.getClient();
                    if (!client) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No client available to capture metric.");
                        return;
                    }
                    let { _experiments, enableMetrics, beforeSendMetric } = client.getOptions();
                    if (!(enableMetrics ?? _experiments?.enableMetrics ?? !0)) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.warn("metrics option not enabled, metric will not be captured.");
                        return;
                    }
                    let { user, attributes: scopeAttributes } = scopeData.getCombinedScopeData(currentScopes.getIsolationScope(), currentScope),
                        enrichedMetric = (function (beforeMetric, client, user) {
                            let { release, environment } = client.getOptions(),
                                processedMetricAttributes = { ...beforeMetric.attributes };
                            (setMetricAttribute(processedMetricAttributes, "user.id", user.id, !1),
                                setMetricAttribute(processedMetricAttributes, "user.email", user.email, !1),
                                setMetricAttribute(processedMetricAttributes, "user.name", user.username, !1),
                                setMetricAttribute(processedMetricAttributes, "sentry.release", release),
                                setMetricAttribute(processedMetricAttributes, "sentry.environment", environment));
                            let { name, version } = client.getSdkMetadata()?.sdk ?? {};
                            (setMetricAttribute(processedMetricAttributes, "sentry.sdk.name", name), setMetricAttribute(processedMetricAttributes, "sentry.sdk.version", version));
                            let replay = client.getIntegrationByName("Replay"),
                                replayId = replay?.getReplayId(!0);
                            return (
                                setMetricAttribute(processedMetricAttributes, "sentry.replay_id", replayId),
                                replayId && replay?.getRecordingMode() === "buffer" && setMetricAttribute(processedMetricAttributes, "sentry._internal.replay_is_buffering", !0),
                                { ...beforeMetric, attributes: processedMetricAttributes }
                            );
                        })(beforeMetric, client, user);
                    client.emit("processMetric", enrichedMetric);
                    let beforeSendCallback = beforeSendMetric || _experiments?.beforeSendMetric,
                        processedMetric = beforeSendCallback ? beforeSendCallback(enrichedMetric) : enrichedMetric;
                    if (!processedMetric) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log("`beforeSendMetric` returned `null`, will not send metric.");
                        return;
                    }
                    let serializedMetric = (function (metric, client, currentScope, scopeAttributes) {
                        let [, traceContext] = traceInfo._getTraceInfoFromScope(client, currentScope),
                            span = spanOnScope._getSpanForScope(currentScope),
                            traceId = span ? span.spanContext().traceId : traceContext?.trace_id,
                            spanId = span ? span.spanContext().spanId : void 0,
                            timestamp = time.timestampInSeconds(),
                            sequenceAttr = timestampSequence.getSequenceAttribute(timestamp);
                        return {
                            timestamp,
                            trace_id: traceId ?? "",
                            span_id: spanId,
                            name: metric.name,
                            type: metric.type,
                            unit: metric.unit,
                            value: metric.value,
                            attributes: {
                                ...attributes.serializeAttributes(scopeAttributes),
                                ...attributes.serializeAttributes(metric.attributes, "skip-undefined"),
                                [sequenceAttr.key]: sequenceAttr.value,
                            },
                        };
                    })(processedMetric, client, currentScope, scopeAttributes);
                    (debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Metric]", serializedMetric),
                        captureSerializedMetric(client, serializedMetric),
                        client.emit("afterCaptureMetric", processedMetric));
                }),
                    (exports._INTERNAL_captureSerializedMetric = _INTERNAL_captureSerializedMetric),
                    (exports._INTERNAL_flushMetricsBuffer = _INTERNAL_flushMetricsBuffer),
                    (exports._INTERNAL_getMetricBuffer = _INTERNAL_getMetricBuffer));
            }