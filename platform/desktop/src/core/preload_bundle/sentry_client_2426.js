2426(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let api = __webpack_require__(681),
                    constants = __webpack_require__(4264),
                    currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    envelope = __webpack_require__(2477),
                    integration = __webpack_require__(5579),
                    internal = __webpack_require__(8388),
                    internal$1 = __webpack_require__(802),
                    session = __webpack_require__(5649),
                    dynamicSamplingContext = __webpack_require__(241),
                    beforeSendSpan = __webpack_require__(6509),
                    base = __webpack_require__(5731),
                    clientreport = __webpack_require__(9906),
                    debugLogger = __webpack_require__(2533),
                    dsn = __webpack_require__(6058),
                    envelope$1 = __webpack_require__(1323),
                    eventUtils = __webpack_require__(5766),
                    is = __webpack_require__(7431),
                    merge = __webpack_require__(1451),
                    misc = __webpack_require__(735),
                    parseSampleRate = __webpack_require__(8068),
                    prepareEvent = __webpack_require__(6418),
                    promisebuffer = __webpack_require__(5260),
                    randomSafeContext = __webpack_require__(638),
                    shouldIgnoreSpan = __webpack_require__(7332),
                    spanUtils = __webpack_require__(470),
                    syncpromise = __webpack_require__(4335),
                    timer = __webpack_require__(90),
                    transactionEvent = __webpack_require__(7295),
                    ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.",
                    MISSING_RELEASE_FOR_SESSION_ERROR = "Discarded session because of missing or non-string release",
                    INTERNAL_ERROR_SYMBOL = Symbol.for("SentryInternalError"),
                    DO_NOT_SEND_EVENT_SYMBOL = Symbol.for("SentryDoNotSendEventError");
                function _makeInternalError(message) {
                    return { message, [INTERNAL_ERROR_SYMBOL]: !0 };
                }
                function _makeDoNotSendEventError(message) {
                    return { message, [DO_NOT_SEND_EVENT_SYMBOL]: !0 };
                }
                function _isInternalError(error) {
                    return !!error && "object" == typeof error && INTERNAL_ERROR_SYMBOL in error;
                }
                function _isDoNotSendEventError(error) {
                    return !!error && "object" == typeof error && DO_NOT_SEND_EVENT_SYMBOL in error;
                }
                function setupWeightBasedFlushing(client, afterCaptureHook, flushHook, estimateSizeFn, flushFn) {
                    let flushTimeout,
                        weight = 0,
                        isTimerActive = !1;
                    (client.on(flushHook, () => {
                        ((weight = 0), clearTimeout(flushTimeout), (isTimerActive = !1));
                    }),
                        client.on(afterCaptureHook, (item) => {
                            (weight += estimateSizeFn(item)) >= 8e5
                                ? flushFn(client)
                                : isTimerActive ||
                                  ((isTimerActive = !0),
                                  (flushTimeout = timer.safeUnref(
                                      setTimeout(() => {
                                          flushFn(client);
                                      }, 5e3),
                                  )));
                        }),
                        client.on("flush", () => {
                            flushFn(client);
                        }));
                }
                function getDataCategoryByType(type) {
                    return "replay_event" === type ? "replay" : type || "error";
                }
                function isErrorEvent(event) {
                    return void 0 === event.type;
                }
                function isTransactionEvent(event) {
                    return "transaction" === event.type;
                }
                function estimateMetricSizeInBytes(metric) {
                    let weight = 0;
                    return (metric.name && (weight += 2 * metric.name.length), (weight += 8) + estimateAttributesSizeInBytes(metric.attributes));
                }
                function estimateLogSizeInBytes(log) {
                    let weight = 0;
                    return (log.message && (weight += 2 * log.message.length), weight + estimateAttributesSizeInBytes(log.attributes));
                }
                function estimateAttributesSizeInBytes(attributes) {
                    if (!attributes) return 0;
                    let weight = 0;
                    return (
                        Object.values(attributes).forEach((value) => {
                            Array.isArray(value)
                                ? (weight += value.length * estimatePrimitiveSizeInBytes(value[0]))
                                : is.isPrimitive(value)
                                  ? (weight += estimatePrimitiveSizeInBytes(value))
                                  : (weight += 100);
                        }),
                        weight
                    );
                }
                function estimatePrimitiveSizeInBytes(value) {
                    return "string" == typeof value ? 2 * value.length : "number" == typeof value ? 8 : 4 * ("boolean" == typeof value);
                }
                exports.Client = class {
                    constructor(options) {
                        if (
                            ((this._options = options),
                            (this._integrations = {}),
                            (this._numProcessing = 0),
                            (this._outcomes = {}),
                            (this._hooks = {}),
                            (this._eventProcessors = []),
                            (this._promiseBuffer = promisebuffer.makePromiseBuffer(options.transportOptions?.bufferSize ?? base.DEFAULT_TRANSPORT_BUFFER_SIZE)),
                            options.dsn
                                ? (this._dsn = dsn.makeDsn(options.dsn))
                                : debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No DSN provided, client will not send events."),
                            this._dsn)
                        ) {
                            const url = api.getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options.tunnel, options._metadata ? options._metadata.sdk : void 0);
                            this._transport = options.transport({
                                tunnel: this._options.tunnel,
                                recordDroppedEvent: this.recordDroppedEvent.bind(this),
                                ...options.transportOptions,
                                url,
                            });
                        }
                        ((this._options.enableLogs = this._options.enableLogs ?? this._options._experiments?.enableLogs),
                            this._options.enableLogs && setupWeightBasedFlushing(this, "afterCaptureLog", "flushLogs", estimateLogSizeInBytes, internal._INTERNAL_flushLogsBuffer),
                            (this._options.enableMetrics ?? this._options._experiments?.enableMetrics ?? !0) &&
                                setupWeightBasedFlushing(this, "afterCaptureMetric", "flushMetrics", estimateMetricSizeInBytes, internal$1._INTERNAL_flushMetricsBuffer));
                    }
                    captureException(exception, hint, scope) {
                        let eventId = misc.uuid4();
                        if (misc.checkOrSetAlreadyCaught(exception)) return (debugBuild.DEBUG_BUILD && debugLogger.debug.log(ALREADY_SEEN_ERROR), eventId);
                        let hintWithEventId = { event_id: eventId, ...hint };
                        return (
                            this._process(
                                () =>
                                    this.eventFromException(exception, hintWithEventId)
                                        .then((event) => this._captureEvent(event, hintWithEventId, scope))
                                        .then((res) => res),
                                "error",
                            ),
                            hintWithEventId.event_id
                        );
                    }
                    captureMessage(message, level, hint, currentScope) {
                        let hintWithEventId = { event_id: misc.uuid4(), ...hint },
                            eventMessage = is.isParameterizedString(message) ? message : String(message),
                            isMessage = is.isPrimitive(message),
                            promisedEvent = isMessage ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
                        return (
                            this._process(() => promisedEvent.then((event) => this._captureEvent(event, hintWithEventId, currentScope)), isMessage ? "unknown" : "error"),
                            hintWithEventId.event_id
                        );
                    }
                    captureEvent(event, hint, currentScope) {
                        let eventId = misc.uuid4();
                        if (hint?.originalException && misc.checkOrSetAlreadyCaught(hint.originalException))
                            return (debugBuild.DEBUG_BUILD && debugLogger.debug.log(ALREADY_SEEN_ERROR), eventId);
                        let hintWithEventId = { event_id: eventId, ...hint },
                            sdkProcessingMetadata = event.sdkProcessingMetadata || {},
                            capturedSpanScope = sdkProcessingMetadata.capturedSpanScope,
                            capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope,
                            dataCategory = getDataCategoryByType(event.type);
                        return (
                            this._process(() => this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope, capturedSpanIsolationScope), dataCategory),
                            hintWithEventId.event_id
                        );
                    }
                    captureSession(session$1) {
                        (this.sendSession(session$1), session.updateSession(session$1, { init: !1 }));
                    }
                    getDsn() {
                        return this._dsn;
                    }
                    getOptions() {
                        return this._options;
                    }
                    getSdkMetadata() {
                        return this._options._metadata;
                    }
                    getTransport() {
                        return this._transport;
                    }
                    async flush(timeout) {
                        let transport = this._transport;
                        if (!transport) return !0;
                        this.emit("flush");
                        let clientFinished = await this._isClientDoneProcessing(timeout),
                            transportFlushed = await transport.flush(timeout);
                        return clientFinished && transportFlushed;
                    }
                    async close(timeout) {
                        internal._INTERNAL_flushLogsBuffer(this);
                        let result = await this.flush(timeout);
                        return ((this.getOptions().enabled = !1), this.emit("close"), result);
                    }
                    getEventProcessors() {
                        return this._eventProcessors;
                    }
                    addEventProcessor(eventProcessor) {
                        this._eventProcessors.push(eventProcessor);
                    }
                    init() {
                        (this._isEnabled() || this._options.integrations.some(({ name }) => name.startsWith("Spotlight"))) && this._setupIntegrations();
                    }
                    getIntegrationByName(integrationName) {
                        return this._integrations[integrationName];
                    }
                    addIntegration(integration$1) {
                        let isAlreadyInstalled = this._integrations[integration$1.name];
                        (!isAlreadyInstalled && integration$1.beforeSetup && integration$1.beforeSetup(this),
                            integration.setupIntegration(this, integration$1, this._integrations),
                            isAlreadyInstalled || integration.afterSetupIntegrations(this, [integration$1]));
                    }
                    sendEvent(event, hint = {}) {
                        this.emit("beforeSendEvent", event, hint);
                        let env = envelope.createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
                        for (let attachment of hint.attachments || []) env = envelope$1.addItemToEnvelope(env, envelope$1.createAttachmentEnvelopeItem(attachment));
                        this.sendEnvelope(env).then((sendResponse) => this.emit("afterSendEvent", event, sendResponse));
                    }
                    sendSession(session) {
                        let { release: clientReleaseOption, environment: clientEnvironmentOption = constants.DEFAULT_ENVIRONMENT } = this._options;
                        if ("aggregates" in session) {
                            let sessionAttrs = session.attrs || {};
                            if (!sessionAttrs.release && !clientReleaseOption) {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
                                return;
                            }
                            ((sessionAttrs.release = sessionAttrs.release || clientReleaseOption),
                                (sessionAttrs.environment = sessionAttrs.environment || clientEnvironmentOption),
                                (session.attrs = sessionAttrs));
                        } else {
                            if (!session.release && !clientReleaseOption) {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
                                return;
                            }
                            ((session.release = session.release || clientReleaseOption), (session.environment = session.environment || clientEnvironmentOption));
                        }
                        this.emit("beforeSendSession", session);
                        let env = envelope.createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
                        this.sendEnvelope(env);
                    }
                    recordDroppedEvent(reason, category, count = 1) {
                        if (this._options.sendClientReports) {
                            let key = `${reason}:${category}`;
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Recording outcome: "${key}"${count > 1 ? ` (${count} times)` : ""}`),
                                (this._outcomes[key] = (this._outcomes[key] || 0) + count));
                        }
                    }
                    on(hook, callback) {
                        let hookCallbacks = (this._hooks[hook] = this._hooks[hook] || new Set()),
                            uniqueCallback = (...args) => callback(...args);
                        return (
                            hookCallbacks.add(uniqueCallback),
                            () => {
                                hookCallbacks.delete(uniqueCallback);
                            }
                        );
                    }
                    emit(hook, ...rest) {
                        let callbacks = this._hooks[hook];
                        callbacks && callbacks.forEach((callback) => callback(...rest));
                    }
                    async sendEnvelope(envelope) {
                        if ((this.emit("beforeEnvelope", envelope), this._isEnabled() && this._transport))
                            try {
                                return await this._transport.send(envelope);
                            } catch (reason) {
                                return (debugBuild.DEBUG_BUILD && debugLogger.debug.error("Error while sending envelope:", reason), {});
                            }
                        return (debugBuild.DEBUG_BUILD && debugLogger.debug.error("Transport disabled"), {});
                    }
                    dispose() {}
                    _setupIntegrations() {
                        let { integrations } = this._options;
                        ((this._integrations = integration.setupIntegrations(this, integrations)), integration.afterSetupIntegrations(this, integrations));
                    }
                    _updateSessionFromEvent(session$1, event) {
                        let crashed = "fatal" === event.level,
                            errored = !1,
                            exceptions = event.exception?.values;
                        if (exceptions) {
                            for (let ex of ((errored = !0), (crashed = !1), exceptions))
                                if (ex.mechanism?.handled === !1) {
                                    crashed = !0;
                                    break;
                                }
                        }
                        let sessionNonTerminal = "ok" === session$1.status;
                        ((sessionNonTerminal && 0 === session$1.errors) || (sessionNonTerminal && crashed)) &&
                            (session.updateSession(session$1, { ...(crashed && { status: "crashed" }), errors: session$1.errors || Number(errored || crashed) }),
                            this.captureSession(session$1));
                    }
                    async _isClientDoneProcessing(timeout) {
                        let ticked = 0;
                        for (; !timeout || ticked < timeout;) {
                            if ((await new Promise((resolve) => setTimeout(resolve, 1)), !this._numProcessing)) return !0;
                            ticked++;
                        }
                        return !1;
                    }
                    _isEnabled() {
                        return !1 !== this.getOptions().enabled && void 0 !== this._transport;
                    }
                    _prepareEvent(event, hint, currentScope, isolationScope) {
                        let options = this.getOptions(),
                            integrations = Object.keys(this._integrations);
                        return (
                            !hint.integrations && integrations?.length && (hint.integrations = integrations),
                            this.emit("preprocessEvent", event, hint),
                            event.type || isolationScope.setLastEventId(event.event_id || hint.event_id),
                            prepareEvent
                                .prepareEvent(options, event, hint, currentScope, this, isolationScope)
                                .then(
                                    (evt) => (
                                        null === evt ||
                                            (this.emit("postprocessEvent", evt, hint),
                                            (evt.contexts = { trace: { ...evt.contexts?.trace, ...currentScopes.getTraceContextFromScope(currentScope) }, ...evt.contexts }),
                                            (evt.sdkProcessingMetadata = {
                                                dynamicSamplingContext: dynamicSamplingContext.getDynamicSamplingContextFromScope(this, currentScope),
                                                ...evt.sdkProcessingMetadata,
                                            })),
                                        evt
                                    ),
                                )
                        );
                    }
                    _captureEvent(event, hint = {}, currentScope = currentScopes.getCurrentScope(), isolationScope = currentScopes.getIsolationScope()) {
                        return (
                            debugBuild.DEBUG_BUILD &&
                                isErrorEvent(event) &&
                                debugLogger.debug.log(`Captured error event \`${eventUtils.getPossibleEventMessages(event)[0] || "<unknown>"}\``),
                            this._processEvent(event, hint, currentScope, isolationScope).then(
                                (finalEvent) => finalEvent.event_id,
                                (reason) => {
                                    debugBuild.DEBUG_BUILD &&
                                        (_isDoNotSendEventError(reason)
                                            ? debugLogger.debug.log(reason.message)
                                            : _isInternalError(reason)
                                              ? debugLogger.debug.warn(reason.message)
                                              : debugLogger.debug.warn(reason));
                                },
                            )
                        );
                    }
                    _processEvent(event, hint, currentScope, isolationScope) {
                        let options = this.getOptions(),
                            { sampleRate } = options,
                            isTransaction = isTransactionEvent(event),
                            isError = isErrorEvent(event),
                            eventType = event.type || "error",
                            beforeSendLabel = `before send for type \`${eventType}\``,
                            parsedSampleRate = void 0 === sampleRate ? void 0 : parseSampleRate.parseSampleRate(sampleRate);
                        if (isError && "number" == typeof parsedSampleRate && randomSafeContext.safeMathRandom() > parsedSampleRate)
                            return (
                                this.recordDroppedEvent("sample_rate", "error"),
                                syncpromise.rejectedSyncPromise(
                                    _makeDoNotSendEventError(`Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`),
                                )
                            );
                        let dataCategory = getDataCategoryByType(event.type);
                        return this._prepareEvent(event, hint, currentScope, isolationScope)
                            .then((prepared) => {
                                if (null === prepared)
                                    throw (
                                        this.recordDroppedEvent("event_processor", dataCategory),
                                        _makeDoNotSendEventError("An event processor returned `null`, will not send event.")
                                    );
                                return hint.data?.__sentry__ === !0
                                    ? prepared
                                    : (function (beforeSendResult, beforeSendLabel) {
                                          let invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
                                          if (is.isThenable(beforeSendResult))
                                              return beforeSendResult.then(
                                                  (event) => {
                                                      if (!is.isPlainObject(event) && null !== event) throw _makeInternalError(invalidValueError);
                                                      return event;
                                                  },
                                                  (e) => {
                                                      throw _makeInternalError(`${beforeSendLabel} rejected with ${e}`);
                                                  },
                                              );
                                          if (!is.isPlainObject(beforeSendResult) && null !== beforeSendResult) throw _makeInternalError(invalidValueError);
                                          return beforeSendResult;
                                      })(
                                          (function (client, options, event, hint) {
                                              let { beforeSend, beforeSendTransaction, ignoreSpans } = options,
                                                  beforeSendSpan$1 = !beforeSendSpan.isStreamedBeforeSendSpanCallback(options.beforeSendSpan) && options.beforeSendSpan,
                                                  processedEvent = event;
                                              if (isErrorEvent(processedEvent) && beforeSend) return beforeSend(processedEvent, hint);
                                              if (isTransactionEvent(processedEvent)) {
                                                  if (beforeSendSpan$1 || ignoreSpans) {
                                                      let rootSpanJson = transactionEvent.convertTransactionEventToSpanJson(processedEvent);
                                                      if (ignoreSpans?.length && shouldIgnoreSpan.shouldIgnoreSpan(rootSpanJson, ignoreSpans)) return null;
                                                      if (beforeSendSpan$1) {
                                                          let processedRootSpanJson = beforeSendSpan$1(rootSpanJson);
                                                          processedRootSpanJson
                                                              ? (processedEvent = merge.merge(event, transactionEvent.convertSpanJsonToTransactionEvent(processedRootSpanJson)))
                                                              : spanUtils.showSpanDropWarning();
                                                      }
                                                      if (processedEvent.spans) {
                                                          let processedSpans = [],
                                                              initialSpans = processedEvent.spans;
                                                          for (let span of initialSpans) {
                                                              if (ignoreSpans?.length && shouldIgnoreSpan.shouldIgnoreSpan(span, ignoreSpans)) {
                                                                  shouldIgnoreSpan.reparentChildSpans(initialSpans, span);
                                                                  continue;
                                                              }
                                                              if (beforeSendSpan$1) {
                                                                  let processedSpan = beforeSendSpan$1(span);
                                                                  processedSpan ? processedSpans.push(processedSpan) : (spanUtils.showSpanDropWarning(), processedSpans.push(span));
                                                              } else processedSpans.push(span);
                                                          }
                                                          let droppedSpans = processedEvent.spans.length - processedSpans.length;
                                                          (droppedSpans && client.recordDroppedEvent("before_send", "span", droppedSpans), (processedEvent.spans = processedSpans));
                                                      }
                                                  }
                                                  if (beforeSendTransaction) {
                                                      if (processedEvent.spans) {
                                                          let spanCountBefore = processedEvent.spans.length;
                                                          processedEvent.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, spanCountBeforeProcessing: spanCountBefore };
                                                      }
                                                      return beforeSendTransaction(processedEvent, hint);
                                                  }
                                              }
                                              return processedEvent;
                                          })(this, options, prepared, hint),
                                          beforeSendLabel,
                                      );
                            })
                            .then((processedEvent) => {
                                if (null === processedEvent) {
                                    if ((this.recordDroppedEvent("before_send", dataCategory), isTransaction)) {
                                        let spanCount = 1 + (event.spans || []).length;
                                        this.recordDroppedEvent("before_send", "span", spanCount);
                                    }
                                    throw _makeDoNotSendEventError(`${beforeSendLabel} returned \`null\`, will not send event.`);
                                }
                                let session = currentScope.getSession() || isolationScope.getSession();
                                if ((isError && session && this._updateSessionFromEvent(session, processedEvent), isTransaction)) {
                                    let droppedSpanCount =
                                        (processedEvent.sdkProcessingMetadata?.spanCountBeforeProcessing || 0) - (processedEvent.spans ? processedEvent.spans.length : 0);
                                    droppedSpanCount > 0 && this.recordDroppedEvent("before_send", "span", droppedSpanCount);
                                }
                                let transactionInfo = processedEvent.transaction_info;
                                return (
                                    isTransaction &&
                                        transactionInfo &&
                                        processedEvent.transaction !== event.transaction &&
                                        (processedEvent.transaction_info = { ...transactionInfo, source: "custom" }),
                                    this.sendEvent(processedEvent, hint),
                                    processedEvent
                                );
                            })
                            .then(null, (reason) => {
                                if (_isDoNotSendEventError(reason) || _isInternalError(reason)) throw reason;
                                throw (
                                    this.captureException(reason, { mechanism: { handled: !1, type: "internal" }, data: { __sentry__: !0 }, originalException: reason }),
                                    _makeInternalError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`)
                                );
                            });
                    }
                    _process(taskProducer, dataCategory) {
                        (this._numProcessing++,
                            this._promiseBuffer.add(taskProducer).then(
                                (value) => (this._numProcessing--, value),
                                (reason) => (
                                    this._numProcessing--,
                                    reason === promisebuffer.SENTRY_BUFFER_FULL_ERROR && this.recordDroppedEvent("queue_overflow", dataCategory),
                                    reason
                                ),
                            ));
                    }
                    _clearOutcomes() {
                        let outcomes = this._outcomes;
                        return (
                            (this._outcomes = {}),
                            Object.entries(outcomes).map(([key, quantity]) => {
                                let [reason, category] = key.split(":");
                                return { reason, category, quantity };
                            })
                        );
                    }
                    _flushOutcomes() {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log("Flushing outcomes...");
                        let outcomes = this._clearOutcomes();
                        if (0 === outcomes.length) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.log("No outcomes to send");
                            return;
                        }
                        if (!this._dsn) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.log("No dsn provided, will not send outcomes");
                            return;
                        }
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log("Sending outcomes:", outcomes);
                        let envelope = clientreport.createClientReportEnvelope(outcomes, this._options.tunnel && dsn.dsnToString(this._dsn));
                        this.sendEnvelope(envelope);
                    }
                };
            }