7026(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.ROOT_METHODS = exports.NETWORK_ENABLE_PARAMS = void 0),
                    (exports.injectFrameDebugger = function (nextConfig) {
                        config = nextConfig;
                    }),
                    (exports.sendRootCommand = sendRootCommand));
                let logger_1 = __webpack_require__(1944),
                    ZycordIPC_1 = __webpack_require__(1999),
                    frameCdpBatch_1 = __webpack_require__(5490),
                    frameDebuggerLogger = logger_1.logger.createLogger("frame_debugger");
                ((exports.NETWORK_ENABLE_PARAMS = { maxTotalBufferSize: 0, maxResourceBufferSize: 0, maxPostDataSize: 0 }),
                    (exports.ROOT_METHODS = new Set(["Target.getTargetInfo", "Target.setDiscoverTargets", "Target.attachToTarget"])));
                let ACTIVITY_FRAME_HOST = /^\d{17,20}\.(?:[a-z0-9-]+\.)?zyronsays\.com$/,
                    DEV_ACTIVITY_FRAME_HOST = /^\d{17,20}(?:\.|--)[a-z0-9.-]+$/,
                    config = null,
                    session = null,
                    pendingDetach = null,
                    nextSessionId = 1;
                function originOf(url) {
                    try {
                        return new URL(url).origin;
                    } catch {
                        return null;
                    }
                }
                function requireTrustedCaller(event) {
                    if (null == config) throw Error("FRAME_DEBUGGER_DISABLED");
                    let mainWebContents = config.getMainWebContents(),
                        frame = event.senderFrame;
                    if (
                        null == mainWebContents ||
                        mainWebContents.isDestroyed() ||
                        event.sender !== mainWebContents ||
                        null == frame ||
                        null != frame.parent ||
                        originOf(frame.url) !== config.webappOrigin
                    )
                        throw Error("FRAME_DEBUGGER_UNTRUSTED_CALLER");
                    return mainWebContents;
                }
                function sendRootCommand(dbg, method, params = {}) {
                    return exports.ROOT_METHODS.has(method) ? dbg.sendCommand(method, params) : Promise.reject(Error(`FRAME_DEBUGGER_ROOT_METHOD_DENIED: ${method}`));
                }
                function frameExec(current) {
                    return (method, params) =>
                        session !== current
                            ? Promise.reject(Error("FRAME_DEBUGGER_NOT_ATTACHED"))
                            : current.webContents.debugger.sendCommand(method, params ?? {}, current.sessionId);
                }
                function detachDebugger(webContents) {
                    try {
                        !webContents.isDestroyed() && webContents.debugger.isAttached() && webContents.debugger.detach();
                    } catch (e) {
                        frameDebuggerLogger.warn(`detach failed: ${e}`);
                    }
                }
                function teardown(reason, fromDebuggerEvent = !1) {
                    let current = session;
                    if (null != current) {
                        for (let stop of ((session = null), current.stops)) stop.stopped = !0;
                        (current.dispose(),
                            current.onFailed?.(Error(`FRAME_DEBUGGER_DETACHED: ${reason}`)),
                            fromDebuggerEvent
                                ? ((pendingDetach = current.webContents),
                                  setImmediate(() => {
                                      pendingDetach === current.webContents && ((pendingDetach = null), detachDebugger(current.webContents));
                                  }))
                                : detachDebugger(current.webContents),
                            null == current.sessionId ||
                                current.webContents.isDestroyed() ||
                                current.webContents.send(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_DETACHED, current.id, reason),
                            frameDebuggerLogger.info(`torn down: ${reason}`));
                    }
                }
                function matchingFrames(current) {
                    return [...current.frames].filter(([, url]) => originOf(url) === current.frameOrigin).map(([targetId]) => targetId);
                }
                function handleMessage(_event, method, params, sessionId) {
                    let current = session;
                    if (null == current) return;
                    if (null == sessionId || "" === sessionId)
                        return void ("Target.targetCreated" === method || "Target.targetInfoChanged" === method
                            ? (function (current, info) {
                                  if ("string" != typeof info?.targetId) return;
                                  let url = "string" == typeof info.url ? info.url : "";
                                  if (info.targetId === current.targetId) {
                                      originOf(url) !== current.frameOrigin && teardown("frame-navigated", !0);
                                      return;
                                  }
                                  "iframe" !== info.type ||
                                      null == current.pageTargetId ||
                                      info.parentFrameId !== current.pageTargetId ||
                                      (current.frames.set(info.targetId, url),
                                      originOf(url) === current.frameOrigin && (null != current.targetId ? teardown("ambiguous-frame", !0) : current.onMatched?.()));
                              })(current, params?.targetInfo)
                            : "Target.targetDestroyed" === method
                              ? params?.targetId === current.targetId
                                  ? teardown("frame-destroyed", !0)
                                  : current.frames.delete(params?.targetId)
                              : "Target.detachedFromTarget" === method && null != current.sessionId && params?.sessionId === current.sessionId && teardown("frame-detached", !0));
                    if (sessionId !== current.sessionId) return;
                    if ("DOM.documentUpdated" === method) return void (0, frameCdpBatch_1.forgetDocument)(current.document);
                    let event = (0, frameCdpBatch_1.shimEvent)(method, params, current.frameOrigin, current.requests);
                    if (null == event) return;
                    let ring = method.startsWith("Network.") ? current.networkEvents : current.consoleEvents;
                    (ring.push(event), ring.length > frameCdpBatch_1.MAX_HELD_EVENTS && ring.shift());
                }
                async function attach(webContents, frameOrigin) {
                    let timer;
                    (teardown("reattach"), pendingDetach === webContents && ((pendingDetach = null), detachDebugger(webContents)));
                    let dbg = webContents.debugger;
                    if (dbg.isAttached()) throw Error("FRAME_DEBUGGER_BUSY");
                    function onDetach(_event, reason) {
                        teardown(`debugger-detached: ${reason}`, !0);
                    }
                    function onNavigate(details) {
                        details.isMainFrame && !details.isSameDocument && teardown("host-navigated");
                    }
                    function onGone() {
                        teardown("render-process-gone");
                    }
                    function onDestroyed() {
                        teardown("destroyed");
                    }
                    dbg.attach("1.3");
                    let current = {
                        id: nextSessionId++,
                        webContents,
                        frameOrigin,
                        pageTargetId: null,
                        frames: new Map(),
                        targetId: null,
                        sessionId: null,
                        document: (0, frameCdpBatch_1.emptyFrameDocument)(),
                        requests: new Map(),
                        consoleEvents: [],
                        networkEvents: [],
                        stops: new Set(),
                        queue: Promise.resolve(),
                        onMatched: null,
                        onFailed: null,
                        dispose: () => {
                            (dbg.removeListener("message", handleMessage),
                                dbg.removeListener("detach", onDetach),
                                webContents.removeListener("did-start-navigation", onNavigate),
                                webContents.removeListener("render-process-gone", onGone),
                                webContents.removeListener("destroyed", onDestroyed));
                        },
                    };
                    ((session = current),
                        dbg.on("message", handleMessage),
                        dbg.on("detach", onDetach),
                        webContents.on("did-start-navigation", onNavigate),
                        webContents.on("render-process-gone", onGone),
                        webContents.once("destroyed", onDestroyed));
                    let matched = new Promise((resolve, reject) => {
                        ((current.onMatched = resolve), (current.onFailed = reject));
                    });
                    matched.catch(() => {});
                    let timeout = new Promise((_, reject) => {
                        timer = setTimeout(() => reject(Error("FRAME_DEBUGGER_NO_MATCHING_FRAME")), 5e3);
                    });
                    try {
                        let root = (method, params) =>
                            session !== current ? Promise.reject(Error("FRAME_DEBUGGER_NOT_ATTACHED")) : sendRootCommand(current.webContents.debugger, method, params);
                        ((current.pageTargetId = (await root("Target.getTargetInfo")).targetInfo.targetId),
                            await root("Target.setDiscoverTargets", { discover: !0, filter: [{ type: "iframe" }] }),
                            0 === matchingFrames(current).length && (await Promise.race([matched, timeout])));
                        let matches = matchingFrames(current);
                        if (1 !== matches.length) throw Error(matches.length > 1 ? "FRAME_DEBUGGER_AMBIGUOUS_FRAME" : "FRAME_DEBUGGER_NO_MATCHING_FRAME");
                        current.targetId = matches[0];
                        let { sessionId } = await root("Target.attachToTarget", { targetId: current.targetId, flatten: !0 });
                        if (session !== current || "string" != typeof sessionId || "" === sessionId) throw Error("FRAME_DEBUGGER_NOT_ATTACHED");
                        ((current.sessionId = sessionId), (current.onMatched = null), (current.onFailed = null));
                        let exec = frameExec(current);
                        return (
                            await Promise.all([exec("Runtime.enable"), exec("Network.enable", exports.NETWORK_ENABLE_PARAMS), exec("DOM.enable")]),
                            frameDebuggerLogger.info(`attached to ${frameOrigin}`),
                            current.id
                        );
                    } catch (e) {
                        throw (session === current && teardown("attach-failed"), e);
                    } finally {
                        clearTimeout(timer);
                    }
                }
                let NO_STATE = { url: "", title: "", doc: "", build: "" };
                async function runQueuedBatch(current, calls, stop) {
                    let exec = frameExec(current),
                        replies = await (0, frameCdpBatch_1.runFrameCalls)(exec, current.document, calls, stop),
                        state = stop.stopped ? NO_STATE : await (0, frameCdpBatch_1.readFrameState)(exec, current.document).catch(() => NO_STATE),
                        events = (function (events) {
                            let chars = 0;
                            for (let i = events.length - 1; i >= 0; i--) if ((chars += JSON.stringify(events[i]).length) > 2e5) return events.slice(i + 1);
                            return events;
                        })([...current.consoleEvents.splice(0), ...current.networkEvents.splice(0)]);
                    return { replies, stopped: stop.stopped, ...state, events };
                }
                async function runBatch(webContents, calls) {
                    if (!Array.isArray(calls) || 0 === calls.length || calls.length > 200) throw Error("FRAME_DEBUGGER_BAD_BATCH");
                    let current = (function (webContents) {
                            let current = session;
                            if (null == current || current.webContents !== webContents || null == current.sessionId) throw Error("FRAME_DEBUGGER_NOT_ATTACHED");
                            return current;
                        })(webContents),
                        stop = { stopped: !1 };
                    current.stops.add(stop);
                    let run = current.queue.then(() => runQueuedBatch(current, calls, stop));
                    current.queue = run.catch(() => {});
                    try {
                        return await run;
                    } finally {
                        current.stops.delete(stop);
                    }
                }
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_ATTACH, (event, frameOrigin) =>
                    attach(
                        requireTrustedCaller(event),
                        (function (raw) {
                            let origin = "string" == typeof raw ? originOf(raw) : null;
                            if (
                                null == config ||
                                null == origin ||
                                origin !== raw ||
                                origin === config.webappOrigin ||
                                !(function (origin, allowDevHosts) {
                                    let { protocol, hostname } = new URL(origin);
                                    return !!("https:" === protocol && ACTIVITY_FRAME_HOST.test(hostname)) || (allowDevHosts && DEV_ACTIVITY_FRAME_HOST.test(hostname));
                                })(origin, config.allowDevHosts)
                            )
                                throw Error("FRAME_DEBUGGER_BAD_ORIGIN");
                            return origin;
                        })(frameOrigin),
                    ),
                ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_RUN_BATCH, (event, calls) => runBatch(requireTrustedCaller(event), calls)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_DETACH, (event) => {
                        let webContents = requireTrustedCaller(event);
                        return (session?.webContents === webContents && teardown("renderer-detach"), Promise.resolve());
                    }));
            }