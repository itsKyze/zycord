1998(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.ntpClock = void 0));
                let node_dgram_1 = __importDefault(__webpack_require__(1314)),
                    Backoff_1 = __importDefault(__webpack_require__(9164)),
                    logger_1 = __webpack_require__(1944),
                    ntpProtocol_1 = __webpack_require__(1830),
                    ntpLogger = logger_1.logger.createLogger("ntp_clock");
                async function measureOffset() {
                    let socket = node_dgram_1.default.createSocket("udp4");
                    socket.on("error", () => {});
                    try {
                        let samples = [],
                            failures = [];
                        for (let attempt = 0; attempt < 4; attempt++)
                            try {
                                samples.push(
                                    await (function (socket) {
                                        return new Promise((resolve, reject) => {
                                            let wallAnchorMs,
                                                monotonicAnchorMs,
                                                { packet, nonce } = (0, ntpProtocol_1.buildClientRequest)(),
                                                clock =
                                                    ((wallAnchorMs = Date.now()),
                                                    (monotonicAnchorMs = performance.now()),
                                                    () => wallAnchorMs + (performance.now() - monotonicAnchorMs)),
                                                sendMs = clock(),
                                                settled = !1,
                                                timeoutId = null;
                                            function cleanup() {
                                                ((settled = !0),
                                                    null != timeoutId && clearTimeout(timeoutId),
                                                    socket.removeListener("message", onMessage),
                                                    socket.removeListener("error", onError));
                                            }
                                            function fail(error) {
                                                settled || (cleanup(), reject(error));
                                            }
                                            function onError(error) {
                                                fail(error);
                                            }
                                            function onMessage(response) {
                                                let receiveMs = clock();
                                                if (!settled && (0, ntpProtocol_1.matchesNonce)(response, nonce))
                                                    try {
                                                        let sample = (0, ntpProtocol_1.parseSample)(response, sendMs, receiveMs);
                                                        (cleanup(), resolve(sample));
                                                    } catch (error) {
                                                        fail(error);
                                                    }
                                            }
                                            ((timeoutId = setTimeout(() => fail(Error("NTP request timed out")), 5e3)),
                                                socket.on("message", onMessage),
                                                socket.on("error", onError),
                                                socket.send(packet, 123, "time.cloudflare.com", (error) => {
                                                    null != error && fail(error);
                                                }));
                                        });
                                    })(socket),
                                );
                            } catch (error) {
                                failures.push(String(error));
                            }
                        let best = (0, ntpProtocol_1.selectBestSample)(samples, 1e3);
                        if (null == best) throw Error(`no usable samples from ${samples.length} response(s)` + (failures.length > 0 ? `; failures: ${failures.join("; ")}` : ""));
                        return best;
                    } finally {
                        try {
                            socket.close();
                        } catch {}
                    }
                }
                class NtpClock {
                    offsetMs = 0;
                    roundTripMs = null;
                    syncedAtMs = null;
                    stale = !1;
                    listeners = new Set();
                    backoff = new Backoff_1.default(3e4, 9e5, !0);
                    started = !1;
                    syncing = !1;
                    resyncRequested = !1;
                    syncTimeoutId = null;
                    lastCheckWallMs = 0;
                    lastCheckMonotonicMs = 0;
                    start() {
                        this.started || ((this.started = !0), this.markClockCheckpoint(), setInterval(() => this.checkForClockJump(), 3e4), this.sync());
                    }
                    now() {
                        return Date.now() + this.offsetMs;
                    }
                    getOffsetMs() {
                        return this.offsetMs;
                    }
                    getSyncInfo() {
                        return { offsetMs: this.offsetMs, roundTripMs: this.roundTripMs, syncedAtMs: this.syncedAtMs, synced: null != this.syncedAtMs && !this.stale };
                    }
                    onSync(listener) {
                        return (
                            this.listeners.add(listener),
                            () => {
                                this.listeners.delete(listener);
                            }
                        );
                    }
                    resync() {
                        if (this.started) {
                            if (this.syncing) {
                                this.resyncRequested = !0;
                                return;
                            }
                            (this.clearScheduledSync(), this.sync());
                        }
                    }
                    async sync() {
                        if (!this.syncing) {
                            this.syncing = !0;
                            try {
                                let sample = await measureOffset();
                                ((this.offsetMs = sample.offsetMs),
                                    (this.roundTripMs = sample.roundTripMs),
                                    (this.syncedAtMs = Date.now()),
                                    (this.stale = !1),
                                    this.markClockCheckpoint(),
                                    this.backoff.succeed(),
                                    ntpLogger.info(`[NTP] synced: offset=${sample.offsetMs.toFixed(1)}ms rtt=${sample.roundTripMs.toFixed(1)}ms`),
                                    this.emitSync(),
                                    this.scheduleSync(this.nextSyncDelayMs()));
                            } catch (error) {
                                (ntpLogger.warn(`[NTP] sync failed (attempt ${this.backoff.fails + 1}): ${error}`), this.scheduleSync(this.backoff.fail()));
                            } finally {
                                this.syncing = !1;
                            }
                            this.resyncRequested && ((this.resyncRequested = !1), this.resync());
                        }
                    }
                    nextSyncDelayMs() {
                        return 18e5 * (1 + (2 * Math.random() - 1) * 0.1);
                    }
                    scheduleSync(delayMs) {
                        (this.clearScheduledSync(),
                            (this.syncTimeoutId = setTimeout(() => {
                                ((this.syncTimeoutId = null), this.sync());
                            }, delayMs)));
                    }
                    clearScheduledSync() {
                        null != this.syncTimeoutId && (clearTimeout(this.syncTimeoutId), (this.syncTimeoutId = null));
                    }
                    markClockCheckpoint() {
                        ((this.lastCheckWallMs = Date.now()), (this.lastCheckMonotonicMs = performance.now()));
                    }
                    checkForClockJump() {
                        let wallMs = Date.now(),
                            monotonicMs = performance.now(),
                            wallDeltaMs = wallMs - this.lastCheckWallMs,
                            monotonicDeltaMs = monotonicMs - this.lastCheckMonotonicMs;
                        ((this.lastCheckWallMs = wallMs),
                            (this.lastCheckMonotonicMs = monotonicMs),
                            1e3 > Math.abs(wallDeltaMs - monotonicDeltaMs) ||
                                (ntpLogger.info(`[NTP] clock discontinuity: wall moved ${wallDeltaMs.toFixed(0)}ms vs monotonic ${monotonicDeltaMs.toFixed(0)}ms; resyncing`),
                                null != this.syncedAtMs && ((this.stale = !0), this.emitSync()),
                                this.resync()));
                    }
                    emitSync() {
                        let info = this.getSyncInfo();
                        for (let listener of this.listeners)
                            try {
                                listener(info);
                            } catch (error) {
                                ntpLogger.error(`[NTP] sync listener threw: ${error}`);
                            }
                    }
                }
                exports.ntpClock = new NtpClock();
            }