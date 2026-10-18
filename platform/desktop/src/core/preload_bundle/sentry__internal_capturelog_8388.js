8388(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(4924),
                    carrier = __webpack_require__(5),
                    currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    scopeData = __webpack_require__(4955),
                    spanOnScope = __webpack_require__(8740),
                    time = __webpack_require__(602),
                    timestampSequence = __webpack_require__(7286),
                    traceInfo = __webpack_require__(559),
                    constants = __webpack_require__(7976),
                    envelope = __webpack_require__(5069);
                function setLogAttribute(logAttributes, key, value, setEvenIfPresent = !0) {
                    value && (!logAttributes[key] || setEvenIfPresent) && (logAttributes[key] = value);
                }
                function _INTERNAL_captureSerializedLog(client, serializedLog) {
                    let bufferMap = _getBufferMap(),
                        logBuffer = _INTERNAL_getLogBuffer(client);
                    void 0 === logBuffer
                        ? bufferMap.set(client, [serializedLog])
                        : logBuffer.length >= 100
                          ? (_INTERNAL_flushLogsBuffer(client, logBuffer), bufferMap.set(client, [serializedLog]))
                          : bufferMap.set(client, [...logBuffer, serializedLog]);
                }
                function _INTERNAL_flushLogsBuffer(client, maybeLogBuffer) {
                    let logBuffer = maybeLogBuffer ?? _INTERNAL_getLogBuffer(client) ?? [];
                    if (0 === logBuffer.length) return;
                    let clientOptions = client.getOptions(),
                        envelope$1 = envelope.createLogEnvelope(logBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
                    (_getBufferMap().set(client, []), client.emit("flushLogs"), client.sendEnvelope(envelope$1));
                }
                function _INTERNAL_getLogBuffer(client) {
                    return _getBufferMap().get(client);
                }
                function _getBufferMap() {
                    return carrier.getGlobalSingleton("clientToLogBufferMap", () => new WeakMap());
                }
                ((exports._INTERNAL_captureLog = function (beforeLog, currentScope = currentScopes.getCurrentScope(), captureSerializedLog = _INTERNAL_captureSerializedLog) {
                    let client = currentScope?.getClient() ?? currentScopes.getClient();
                    if (!client) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No client available to capture log.");
                        return;
                    }
                    let { release, environment, enableLogs = !1, beforeSendLog } = client.getOptions();
                    if (!enableLogs) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.warn("logging option not enabled, log will not be captured.");
                        return;
                    }
                    let [, traceContext] = traceInfo._getTraceInfoFromScope(client, currentScope),
                        processedLogAttributes = { ...beforeLog.attributes },
                        {
                            user: { id, email, username },
                            attributes: scopeAttributes = {},
                        } = scopeData.getCombinedScopeData(currentScopes.getIsolationScope(), currentScope);
                    (setLogAttribute(processedLogAttributes, "user.id", id, !1),
                        setLogAttribute(processedLogAttributes, "user.email", email, !1),
                        setLogAttribute(processedLogAttributes, "user.name", username, !1),
                        setLogAttribute(processedLogAttributes, "sentry.release", release),
                        setLogAttribute(processedLogAttributes, "sentry.environment", environment));
                    let { name, version } = client.getSdkMetadata()?.sdk ?? {};
                    (setLogAttribute(processedLogAttributes, "sentry.sdk.name", name), setLogAttribute(processedLogAttributes, "sentry.sdk.version", version));
                    let replay = client.getIntegrationByName("Replay"),
                        replayId = replay?.getReplayId(!0);
                    (setLogAttribute(processedLogAttributes, "sentry.replay_id", replayId),
                        replayId && replay?.getRecordingMode() === "buffer" && setLogAttribute(processedLogAttributes, "sentry._internal.replay_is_buffering", !0));
                    let beforeLogMessage = beforeLog.message;
                    if (is.isParameterizedString(beforeLogMessage)) {
                        let { __sentry_template_string__, __sentry_template_values__ = [] } = beforeLogMessage;
                        (__sentry_template_values__?.length && (processedLogAttributes["sentry.message.template"] = __sentry_template_string__),
                            __sentry_template_values__.forEach((param, index) => {
                                processedLogAttributes[`sentry.message.parameter.${index}`] = param;
                            }));
                    }
                    let span = spanOnScope._getSpanForScope(currentScope);
                    setLogAttribute(processedLogAttributes, "sentry.trace.parent_span_id", span?.spanContext().spanId);
                    let processedLog = { ...beforeLog, attributes: processedLogAttributes };
                    client.emit("beforeCaptureLog", processedLog);
                    let log = beforeSendLog ? debugLogger.consoleSandbox(() => beforeSendLog(processedLog)) : processedLog;
                    if (!log) {
                        (client.recordDroppedEvent("before_send", "log_item", 1),
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("beforeSendLog returned null, log will not be captured."));
                        return;
                    }
                    let { level, message, attributes: logAttributes = {}, severityNumber } = log,
                        timestamp = time.timestampInSeconds(),
                        sequenceAttr = timestampSequence.getSequenceAttribute(timestamp);
                    (captureSerializedLog(client, {
                        timestamp,
                        level,
                        body: message,
                        trace_id: traceContext?.trace_id,
                        severity_number: severityNumber ?? constants.SEVERITY_TEXT_TO_SEVERITY_NUMBER[level],
                        attributes: {
                            ...attributes.serializeAttributes(scopeAttributes),
                            ...attributes.serializeAttributes(logAttributes, !0),
                            [sequenceAttr.key]: sequenceAttr.value,
                        },
                    }),
                        client.emit("afterCaptureLog", log));
                }),
                    (exports._INTERNAL_captureSerializedLog = _INTERNAL_captureSerializedLog),
                    (exports._INTERNAL_flushLogsBuffer = _INTERNAL_flushLogsBuffer),
                    (exports._INTERNAL_getLogBuffer = _INTERNAL_getLogBuffer));
            }