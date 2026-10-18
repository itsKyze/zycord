6082(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    session = __webpack_require__(5649),
                    trace = __webpack_require__(6833),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    misc = __webpack_require__(735),
                    prepareEvent = __webpack_require__(6418),
                    scopeData = __webpack_require__(4955),
                    time = __webpack_require__(602),
                    worldwide = __webpack_require__(3712);
                function captureCheckIn(checkIn, upsertMonitorConfig) {
                    let scope = currentScopes.getCurrentScope(),
                        client = currentScopes.getClient();
                    if (client)
                        if (client.captureCheckIn) return client.captureCheckIn(checkIn, upsertMonitorConfig, scope);
                        else debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Cannot capture check-in. Client does not support sending check-ins.");
                    else debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Cannot capture check-in. No client defined.");
                    return misc.uuid4();
                }
                async function flush(timeout) {
                    let client = currentScopes.getClient();
                    return client ? client.flush(timeout) : (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Cannot flush events. No client defined."), Promise.resolve(!1));
                }
                async function close(timeout) {
                    let client = currentScopes.getClient();
                    return client
                        ? client.close(timeout)
                        : (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Cannot flush events and disable SDK. No client defined."), Promise.resolve(!1));
                }
                function endSession() {
                    let isolationScope = currentScopes.getIsolationScope(),
                        session$1 = currentScopes.getCurrentScope().getSession() || isolationScope.getSession();
                    (session$1 && session.closeSession(session$1), _sendSessionUpdate(), isolationScope.setSession());
                }
                function _sendSessionUpdate() {
                    let isolationScope = currentScopes.getIsolationScope(),
                        client = currentScopes.getClient(),
                        session = isolationScope.getSession();
                    session && client && client.captureSession(session);
                }
                ((exports.addEventProcessor = function (callback) {
                    currentScopes.getIsolationScope().addEventProcessor(callback);
                }),
                    (exports.captureCheckIn = captureCheckIn),
                    (exports.captureEvent = function (event, hint) {
                        return currentScopes.getCurrentScope().captureEvent(event, hint);
                    }),
                    (exports.captureException = function (exception, hint) {
                        return currentScopes.getCurrentScope().captureException(exception, prepareEvent.parseEventHintOrCaptureContext(hint));
                    }),
                    (exports.captureMessage = function (message, captureContext) {
                        let level = "string" == typeof captureContext ? captureContext : void 0,
                            hint = "string" != typeof captureContext ? { captureContext } : void 0;
                        return currentScopes.getCurrentScope().captureMessage(message, level, hint);
                    }),
                    (exports.captureSession = function (end = !1) {
                        end ? endSession() : _sendSessionUpdate();
                    }),
                    (exports.close = close),
                    (exports.endSession = endSession),
                    (exports.flush = flush),
                    (exports.isEnabled = function () {
                        let client = currentScopes.getClient();
                        return client?.getOptions().enabled !== !1 && !!client?.getTransport();
                    }),
                    (exports.isInitialized = function () {
                        return !!currentScopes.getClient();
                    }),
                    (exports.lastEventId = function () {
                        return currentScopes.getIsolationScope().lastEventId();
                    }),
                    (exports.setContext = function (name, context) {
                        currentScopes.getIsolationScope().setContext(name, context);
                    }),
                    (exports.setConversationId = function (conversationId) {
                        currentScopes.getIsolationScope().setConversationId(conversationId);
                    }),
                    (exports.setExtra = function (key, extra) {
                        currentScopes.getIsolationScope().setExtra(key, extra);
                    }),
                    (exports.setExtras = function (extras) {
                        currentScopes.getIsolationScope().setExtras(extras);
                    }),
                    (exports.setTag = function (key, value) {
                        currentScopes.getIsolationScope().setTag(key, value);
                    }),
                    (exports.setTags = function (tags) {
                        currentScopes.getIsolationScope().setTags(tags);
                    }),
                    (exports.setUser = function (user) {
                        currentScopes.getIsolationScope().setUser(user);
                    }),
                    (exports.startSession = function (context) {
                        let isolationScope = currentScopes.getIsolationScope(),
                            { user } = scopeData.getCombinedScopeData(isolationScope, currentScopes.getCurrentScope()),
                            { userAgent } = worldwide.GLOBAL_OBJ.navigator || {},
                            session$1 = session.makeSession({ user, ...(userAgent && { userAgent }), ...context }),
                            currentSession = isolationScope.getSession();
                        return (
                            currentSession?.status === "ok" && session.updateSession(currentSession, { status: "exited" }),
                            endSession(),
                            isolationScope.setSession(session$1),
                            session$1
                        );
                    }),
                    (exports.withMonitor = function (monitorSlug, callback, upsertMonitorConfig) {
                        function runCallback() {
                            let maybePromiseResult,
                                checkInId = captureCheckIn({ monitorSlug, status: "in_progress" }, upsertMonitorConfig),
                                now = time.timestampInSeconds();
                            function finishCheckIn(status) {
                                captureCheckIn({ monitorSlug, status, checkInId, duration: time.timestampInSeconds() - now });
                            }
                            try {
                                maybePromiseResult = callback();
                            } catch (e) {
                                throw (finishCheckIn("error"), e);
                            }
                            return is.isThenable(maybePromiseResult)
                                ? maybePromiseResult.then(
                                      (r) => (finishCheckIn("ok"), r),
                                      (e) => {
                                          throw (finishCheckIn("error"), e);
                                      },
                                  )
                                : (finishCheckIn("ok"), maybePromiseResult);
                        }
                        return currentScopes.withIsolationScope(() => (upsertMonitorConfig?.isolateTrace ? trace.startNewTrace(runCallback) : runCallback()));
                    }));
            }