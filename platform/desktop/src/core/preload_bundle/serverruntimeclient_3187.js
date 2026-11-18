3187(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let checkin = __webpack_require__(6854),
                    client = __webpack_require__(2426),
                    currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    errors = __webpack_require__(2801),
                    debugLogger = __webpack_require__(2533),
                    misc = __webpack_require__(735),
                    base = __webpack_require__(5731),
                    userAgent = __webpack_require__(3600),
                    eventbuilder = __webpack_require__(7348),
                    promisebuffer = __webpack_require__(5260),
                    syncpromise = __webpack_require__(4335),
                    traceInfo = __webpack_require__(559);
                class ServerRuntimeClient extends client.Client {
                    constructor(options) {
                        (errors.registerSpanErrorInstrumentation(), userAgent.addUserAgentToTransportHeaders(options), super(options), this._setUpMetricsProcessing());
                    }
                    eventFromException(exception, hint) {
                        let event = eventbuilder.eventFromUnknownInput(this, this._options.stackParser, exception, hint);
                        return ((event.level = "error"), syncpromise.resolvedSyncPromise(event));
                    }
                    eventFromMessage(message, level = "info", hint) {
                        return syncpromise.resolvedSyncPromise(eventbuilder.eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace));
                    }
                    captureException(exception, hint, scope) {
                        return (setCurrentRequestSessionErroredOrCrashed(hint), super.captureException(exception, hint, scope));
                    }
                    captureEvent(event, hint, scope) {
                        return (
                            !event.type && event.exception?.values && event.exception.values.length > 0 && setCurrentRequestSessionErroredOrCrashed(hint),
                            super.captureEvent(event, hint, scope)
                        );
                    }
                    captureCheckIn(checkIn, monitorConfig, scope) {
                        let id = "checkInId" in checkIn && checkIn.checkInId ? checkIn.checkInId : misc.uuid4();
                        if (!this._isEnabled()) return (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("SDK not enabled, will not capture check-in."), id);
                        let { release, environment, tunnel } = this.getOptions(),
                            serializedCheckIn = { check_in_id: id, monitor_slug: checkIn.monitorSlug, status: checkIn.status, release, environment };
                        ("duration" in checkIn && (serializedCheckIn.duration = checkIn.duration),
                            monitorConfig &&
                                (serializedCheckIn.monitor_config = {
                                    schedule: monitorConfig.schedule,
                                    checkin_margin: monitorConfig.checkinMargin,
                                    max_runtime: monitorConfig.maxRuntime,
                                    timezone: monitorConfig.timezone,
                                    failure_issue_threshold: monitorConfig.failureIssueThreshold,
                                    recovery_threshold: monitorConfig.recoveryThreshold,
                                }));
                        let [dynamicSamplingContext, traceContext] = traceInfo._getTraceInfoFromScope(this, scope);
                        traceContext && (serializedCheckIn.contexts = { trace: traceContext });
                        let envelope = checkin.createCheckInEnvelope(serializedCheckIn, dynamicSamplingContext, this.getSdkMetadata(), tunnel, this.getDsn());
                        return (debugBuild.DEBUG_BUILD && debugLogger.debug.log("Sending checkin:", checkIn.monitorSlug, checkIn.status), this.sendEnvelope(envelope), id);
                    }
                    dispose() {
                        for (let hookName of (debugBuild.DEBUG_BUILD && debugLogger.debug.log("Disposing client..."), Object.keys(this._hooks))) this._hooks[hookName]?.clear();
                        ((this._hooks = {}),
                            (this._eventProcessors.length = 0),
                            (this._integrations = {}),
                            (this._outcomes = {}),
                            (this._transport = void 0),
                            (this._promiseBuffer = promisebuffer.makePromiseBuffer(base.DEFAULT_TRANSPORT_BUFFER_SIZE)));
                    }
                    _prepareEvent(event, hint, currentScope, isolationScope) {
                        return (
                            this._options.platform && (event.platform = event.platform || this._options.platform),
                            this._options.runtime && (event.contexts = { ...event.contexts, runtime: event.contexts?.runtime || this._options.runtime }),
                            this._options.serverName && (event.server_name = event.server_name || this._options.serverName),
                            super._prepareEvent(event, hint, currentScope, isolationScope)
                        );
                    }
                    _setUpMetricsProcessing() {
                        this.on("processMetric", (metric) => {
                            this._options.serverName && (metric.attributes = { "server.address": this._options.serverName, ...metric.attributes });
                        });
                    }
                }
                function setCurrentRequestSessionErroredOrCrashed(eventHint) {
                    let requestSession = currentScopes.getIsolationScope().getScopeData().sdkProcessingMetadata.requestSession;
                    if (requestSession) {
                        let isHandledException = eventHint?.mechanism?.handled ?? !0;
                        isHandledException && "crashed" !== requestSession.status ? (requestSession.status = "errored") : isHandledException || (requestSession.status = "crashed");
                    }
                }
                exports.ServerRuntimeClient = ServerRuntimeClient;
            }