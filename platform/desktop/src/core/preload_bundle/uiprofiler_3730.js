3730(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    utils = __webpack_require__(5764);
                exports.UIProfiler = class {
                    constructor() {
                        ((this._client = void 0),
                            (this._profiler = void 0),
                            (this._chunkTimer = void 0),
                            (this._profilerId = void 0),
                            (this._isRunning = !1),
                            (this._sessionSampled = !1),
                            (this._lifecycleMode = void 0),
                            (this._activeRootSpanIds = new Set()),
                            (this._rootSpanTimeouts = new Map()));
                    }
                    initialize(client) {
                        let lifecycleMode = client.getOptions().profileLifecycle,
                            sessionSampled = utils.shouldProfileSession(client.getOptions());
                        (debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Initializing profiler (lifecycle='${lifecycleMode}').`),
                            !sessionSampled && debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Session not sampled. Skipping lifecycle profiler initialization."),
                            (this._profilerId = core.uuid4()),
                            (this._client = client),
                            (this._sessionSampled = sessionSampled),
                            (this._lifecycleMode = lifecycleMode),
                            "trace" === lifecycleMode && this._setupTraceLifecycleListeners(client));
                    }
                    start() {
                        if ("trace" === this._lifecycleMode) {
                            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.');
                            return;
                        }
                        if (this._isRunning) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.");
                            return;
                        }
                        if (!this._sessionSampled) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.");
                            return;
                        }
                        this._beginProfiling();
                    }
                    stop() {
                        if ("trace" === this._lifecycleMode) {
                            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.stop()` are ignored in trace mode.');
                            return;
                        }
                        if (!this._isRunning) {
                            debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.");
                            return;
                        }
                        this._endProfiling();
                    }
                    notifyRootSpanActive(rootSpan) {
                        if ("trace" !== this._lifecycleMode || !this._sessionSampled) return;
                        let spanId = rootSpan.spanContext().spanId;
                        if (!spanId || this._activeRootSpanIds.has(spanId)) return;
                        this._registerTraceRootSpan(spanId);
                        let rootSpanCount = this._activeRootSpanIds.size;
                        1 === rootSpanCount &&
                            (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Detected already active root span during setup. Active root spans now:", rootSpanCount),
                            this._beginProfiling());
                    }
                    _beginProfiling() {
                        if (!this._isRunning) {
                            if (
                                ((this._isRunning = !0),
                                debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Started profiling with profiler ID:", this._profilerId),
                                core.getGlobalScope().setContext("profile", { profiler_id: this._profilerId }),
                                this._startProfilerInstance(),
                                !this._profiler)
                            ) {
                                (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Failed to start JS Profiler; stopping."), this._resetProfilerInfo());
                                return;
                            }
                            this._startPeriodicChunking();
                        }
                    }
                    _endProfiling() {
                        this._isRunning &&
                            ((this._isRunning = !1),
                            this._chunkTimer && (clearTimeout(this._chunkTimer), (this._chunkTimer = void 0)),
                            this._clearAllRootSpanTimeouts(),
                            this._collectCurrentChunk().catch((e) => {
                                debugBuild.DEBUG_BUILD && core.debug.error("[Profiling] Failed to collect current profile chunk on `stop()`:", e);
                            }),
                            "manual" === this._lifecycleMode && core.getGlobalScope().setContext("profile", {}));
                    }
                    _setupTraceLifecycleListeners(client) {
                        (client.on("spanStart", (span) => {
                            if (!this._sessionSampled) {
                                debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Span not profiled because of negative sampling decision for user session.");
                                return;
                            }
                            if (span !== core.getRootSpan(span)) return;
                            if (!span.isRecording()) {
                                debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Discarding profile because root span was not sampled.");
                                return;
                            }
                            let spanId = span.spanContext().spanId;
                            if (!spanId || this._activeRootSpanIds.has(spanId)) return;
                            this._registerTraceRootSpan(spanId);
                            let rootSpanCount = this._activeRootSpanIds.size;
                            1 === rootSpanCount &&
                                (debugBuild.DEBUG_BUILD &&
                                    core.debug.log(`[Profiling] Root span ${spanId} started. Profiling active while there are active root spans (count=${rootSpanCount}).`),
                                this._beginProfiling());
                        }),
                            client.on("spanEnd", (span) => {
                                if (!this._sessionSampled) return;
                                let spanId = span.spanContext().spanId;
                                if (!spanId || !this._activeRootSpanIds.has(spanId)) return;
                                this._activeRootSpanIds.delete(spanId);
                                let rootSpanCount = this._activeRootSpanIds.size;
                                (debugBuild.DEBUG_BUILD &&
                                    core.debug.log(
                                        `[Profiling] Root span with ID ${spanId} ended. Will continue profiling for as long as there are active root spans (currently: ${rootSpanCount}).`,
                                    ),
                                    0 === rootSpanCount &&
                                        (this._collectCurrentChunk().catch((e) => {
                                            debugBuild.DEBUG_BUILD && core.debug.error("[Profiling] Failed to collect current profile chunk on last `spanEnd`:", e);
                                        }),
                                        this._endProfiling()));
                            }));
                    }
                    _resetProfilerInfo() {
                        ((this._isRunning = !1), core.getGlobalScope().setContext("profile", {}));
                    }
                    _clearAllRootSpanTimeouts() {
                        (this._rootSpanTimeouts.forEach((timeout) => clearTimeout(timeout)), this._rootSpanTimeouts.clear());
                    }
                    _registerTraceRootSpan(spanId) {
                        this._activeRootSpanIds.add(spanId);
                        let timeout = setTimeout(() => this._onRootSpanTimeout(spanId), 3e5);
                        this._rootSpanTimeouts.set(spanId, timeout);
                    }
                    _startProfilerInstance() {
                        if (this._profiler?.stopped === !1) return;
                        let profiler = utils.startJSSelfProfile();
                        if (!profiler) {
                            debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Failed to start JS Profiler.");
                            return;
                        }
                        this._profiler = profiler;
                    }
                    _startPeriodicChunking() {
                        this._isRunning &&
                            (this._chunkTimer = setTimeout(() => {
                                if (
                                    (this._collectCurrentChunk().catch((e) => {
                                        debugBuild.DEBUG_BUILD && core.debug.error("[Profiling] Failed to collect current profile chunk during periodic chunking:", e);
                                    }),
                                    this._isRunning)
                                ) {
                                    if ((this._startProfilerInstance(), !this._profiler)) return void this._resetProfilerInfo();
                                    this._startPeriodicChunking();
                                }
                            }, 6e4));
                    }
                    _onRootSpanTimeout(rootSpanId) {
                        !this._rootSpanTimeouts.has(rootSpanId) ||
                            (this._rootSpanTimeouts.delete(rootSpanId),
                            this._activeRootSpanIds.has(rootSpanId) &&
                                (debugBuild.DEBUG_BUILD &&
                                    core.debug.log(
                                        `[Profiling] Reached 5-minute timeout for root span ${rootSpanId}. You likely started a manual root span that never called \`.end()\`.`,
                                    ),
                                this._activeRootSpanIds.delete(rootSpanId),
                                0 === this._activeRootSpanIds.size && this._endProfiling()));
                    }
                    async _collectCurrentChunk() {
                        let prevProfiler = this._profiler;
                        if (((this._profiler = void 0), prevProfiler))
                            try {
                                let profile = await prevProfiler.stop(),
                                    chunk = utils.createProfileChunkPayload(profile, this._client, this._profilerId),
                                    validationReturn = utils.validateProfileChunk(chunk);
                                if ("reason" in validationReturn) {
                                    debugBuild.DEBUG_BUILD &&
                                        core.debug.log("[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):", validationReturn.reason);
                                    return;
                                }
                                (this._sendProfileChunk(chunk), debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Collected browser profile chunk."));
                            } catch (e) {
                                debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Error while stopping JS Profiler for chunk:", e);
                            }
                    }
                    _sendProfileChunk(chunk) {
                        let client = this._client,
                            sdkInfo = core.getSdkMetadataForEnvelopeHeader(client.getSdkMetadata?.()),
                            dsn = client.getDsn(),
                            tunnel = client.getOptions().tunnel,
                            envelope = core.createEnvelope(
                                {
                                    event_id: core.uuid4(),
                                    sent_at: new Date().toISOString(),
                                    ...(sdkInfo && { sdk: sdkInfo }),
                                    ...(!!tunnel && dsn && { dsn: core.dsnToString(dsn) }),
                                },
                                [[{ type: "profile_chunk", platform: "javascript" }, chunk]],
                            );
                        client.sendEnvelope(envelope).then(null, (reason) => {
                            debugBuild.DEBUG_BUILD && core.debug.error("Error while sending profile chunk envelope:", reason);
                        });
                    }
                };
            }