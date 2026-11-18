3822(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    integration = __webpack_require__(5579),
                    debugLogger = __webpack_require__(2533),
                    stacktrace = __webpack_require__(7970),
                    dedupeIntegration = integration.defineIntegration(() => {
                        let previousEvent;
                        return {
                            name: "Dedupe",
                            processEvent(currentEvent) {
                                if (currentEvent.type) return currentEvent;
                                try {
                                    if (_shouldDropEvent(currentEvent, previousEvent))
                                        return (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Event dropped due to being a duplicate of previously captured event."), null);
                                } catch {}
                                return (previousEvent = currentEvent);
                            },
                        };
                    });
                function _shouldDropEvent(currentEvent, previousEvent) {
                    var currentEvent1, previousEvent1, currentEvent2, previousEvent2;
                    let currentMessage, previousMessage, previousException, currentException;
                    return (
                        !!previousEvent &&
                        ((currentEvent1 = currentEvent),
                        (previousEvent1 = previousEvent),
                        (currentMessage = currentEvent1.message),
                        (previousMessage = previousEvent1.message),
                        !!(
                            ((currentMessage || previousMessage) &&
                                (!currentMessage || previousMessage) &&
                                (currentMessage || !previousMessage) &&
                                currentMessage === previousMessage &&
                                _isSameFingerprint(currentEvent1, previousEvent1) &&
                                _isSameStacktrace(currentEvent1, previousEvent1) &&
                                1) ||
                            ((currentEvent2 = currentEvent),
                            (previousException = _getExceptionFromEvent((previousEvent2 = previousEvent))),
                            (currentException = _getExceptionFromEvent(currentEvent2)),
                            previousException &&
                                currentException &&
                                previousException.type === currentException.type &&
                                previousException.value === currentException.value &&
                                _isSameFingerprint(currentEvent2, previousEvent2) &&
                                _isSameStacktrace(currentEvent2, previousEvent2))
                        ))
                    );
                }
                function _isSameStacktrace(currentEvent, previousEvent) {
                    let currentFrames = stacktrace.getFramesFromEvent(currentEvent),
                        previousFrames = stacktrace.getFramesFromEvent(previousEvent);
                    if (!currentFrames && !previousFrames) return !0;
                    if ((currentFrames && !previousFrames) || (!currentFrames && previousFrames) || previousFrames.length !== currentFrames.length) return !1;
                    for (let i = 0; i < previousFrames.length; i++) {
                        let frameA = previousFrames[i],
                            frameB = currentFrames[i];
                        if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function)
                            return !1;
                    }
                    return !0;
                }
                function _isSameFingerprint(currentEvent, previousEvent) {
                    let currentFingerprint = currentEvent.fingerprint,
                        previousFingerprint = previousEvent.fingerprint;
                    if (!currentFingerprint && !previousFingerprint) return !0;
                    if ((currentFingerprint && !previousFingerprint) || (!currentFingerprint && previousFingerprint)) return !1;
                    try {
                        return currentFingerprint.join("") === previousFingerprint.join("");
                    } catch {
                        return !1;
                    }
                }
                function _getExceptionFromEvent(event) {
                    return event.exception?.values?.[0];
                }
                ((exports._shouldDropEvent = _shouldDropEvent), (exports.dedupeIntegration = dedupeIntegration));
            }