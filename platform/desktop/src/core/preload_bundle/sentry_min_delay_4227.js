4227(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    envelope = __webpack_require__(1323),
                    ratelimit = __webpack_require__(2074),
                    timer = __webpack_require__(90);
                ((exports.MIN_DELAY = 100),
                    (exports.START_DELAY = 5e3),
                    (exports.makeOfflineTransport = function (createTransport) {
                        function log(...args) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Offline]:", ...args);
                        }
                        return (options) => {
                            let flushTimer,
                                transport = createTransport(options);
                            if (!options.createStore) throw Error("No `createStore` function was provided");
                            let store = options.createStore(options),
                                retryDelay = 5e3;
                            function flushIn(delay) {
                                (flushTimer && clearTimeout(flushTimer),
                                    (flushTimer = timer.safeUnref(
                                        setTimeout(async () => {
                                            flushTimer = void 0;
                                            let found = await store.shift();
                                            found &&
                                                (log("Attempting to send previously queued event"),
                                                (found[0].sent_at = new Date().toISOString()),
                                                send(found, !0).catch((e) => {
                                                    log("Failed to retry sending", e);
                                                }));
                                        }, delay),
                                    )));
                            }
                            function flushWithBackOff() {
                                flushTimer || (flushIn(retryDelay), (retryDelay = Math.min(2 * retryDelay, 36e5)));
                            }
                            async function send(envelope$1, isRetry = !1) {
                                if (!isRetry && envelope.envelopeContainsItemType(envelope$1, ["replay_event", "replay_recording"]))
                                    return (await store.push(envelope$1), flushIn(100), {});
                                try {
                                    if (options.shouldSend && (await options.shouldSend(envelope$1)) === !1)
                                        throw Error("Envelope not sent because `shouldSend` callback returned false");
                                    let result = await transport.send(envelope$1),
                                        delay = 100;
                                    if (result) {
                                        if (result.headers?.["retry-after"]) delay = ratelimit.parseRetryAfterHeader(result.headers["retry-after"]);
                                        else if (result.headers?.["x-sentry-rate-limits"]) delay = 6e4;
                                        else if ((result.statusCode || 0) >= 400) return result;
                                    }
                                    return (flushIn(delay), (retryDelay = 5e3), result);
                                } catch (e) {
                                    var retryDelay1;
                                    if (
                                        await ((retryDelay1 = retryDelay),
                                        !envelope.envelopeContainsItemType(envelope$1, ["client_report"]) &&
                                            (!options.shouldStore || options.shouldStore(envelope$1, e, retryDelay1)))
                                    )
                                        return (
                                            isRetry ? await store.unshift(envelope$1) : await store.push(envelope$1),
                                            flushWithBackOff(),
                                            log("Error sending. Event queued.", e),
                                            {}
                                        );
                                    throw e;
                                }
                            }
                            return (
                                options.flushAtStartup && flushWithBackOff(),
                                { send, flush: (timeout) => (void 0 === timeout && ((retryDelay = 5e3), flushIn(100)), transport.flush(timeout)) }
                            );
                        };
                    }));
            }