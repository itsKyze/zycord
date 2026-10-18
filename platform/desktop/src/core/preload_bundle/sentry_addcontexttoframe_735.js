735(__unused_rspack_module, exports, __webpack_require__) {
                let emptyUuid;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let object = __webpack_require__(4204),
                    randomSafeContext = __webpack_require__(638),
                    string = __webpack_require__(2634),
                    worldwide = __webpack_require__(3712);
                function getFirstException(event) {
                    return event.exception?.values?.[0];
                }
                let SEMVER_REGEXP =
                    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
                function _parseInt(input) {
                    return parseInt(input || "", 10);
                }
                function isAlreadyCaptured(exception) {
                    try {
                        return exception.__sentry_captured__;
                    } catch {}
                }
                ((exports.addContextToFrame = function (lines, frame, linesOfContext = 5) {
                    if (void 0 === frame.lineno) return;
                    let maxLines = lines.length,
                        sourceLine = Math.max(Math.min(maxLines - 1, frame.lineno - 1), 0);
                    frame.pre_context = lines.slice(Math.max(0, sourceLine - linesOfContext), sourceLine).map((line) => string.snipLine(line, 0));
                    let lineIndex = Math.min(maxLines - 1, sourceLine);
                    ((frame.context_line = string.snipLine(lines[lineIndex], frame.colno || 0)),
                        (frame.post_context = lines.slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext).map((line) => string.snipLine(line, 0))));
                }),
                    (exports.addExceptionMechanism = function (event, newMechanism) {
                        let firstException = getFirstException(event);
                        if (!firstException) return;
                        let currentMechanism = firstException.mechanism;
                        if (((firstException.mechanism = { type: "generic", handled: !0, ...currentMechanism, ...newMechanism }), newMechanism && "data" in newMechanism)) {
                            let mergedData = { ...currentMechanism?.data, ...newMechanism.data };
                            firstException.mechanism.data = mergedData;
                        }
                    }),
                    (exports.addExceptionTypeValue = function (event, value, type) {
                        let exception = (event.exception = event.exception || {}),
                            values = (exception.values = exception.values || []),
                            firstException = (values[0] = values[0] || {});
                        (firstException.value || (firstException.value = value || ""), firstException.type || (firstException.type = type || "Error"));
                    }),
                    (exports.checkOrSetAlreadyCaught = function (exception) {
                        if (isAlreadyCaptured(exception)) return !0;
                        try {
                            object.addNonEnumerableProperty(exception, "__sentry_captured__", !0);
                        } catch {}
                        return !1;
                    }),
                    (exports.getEventDescription = function (event) {
                        let { message, event_id: eventId } = event;
                        if (message) return message;
                        let firstException = getFirstException(event);
                        return firstException
                            ? firstException.type && firstException.value
                                ? `${firstException.type}: ${firstException.value}`
                                : firstException.type || firstException.value || eventId || "<unknown>"
                            : eventId || "<unknown>";
                    }),
                    (exports.isAlreadyCaptured = isAlreadyCaptured),
                    (exports.parseSemver = function (input) {
                        let match = input.match(SEMVER_REGEXP) || [],
                            major = _parseInt(match[1]),
                            minor = _parseInt(match[2]),
                            patch = _parseInt(match[3]);
                        return {
                            buildmetadata: match[5],
                            major: isNaN(major) ? void 0 : major,
                            minor: isNaN(minor) ? void 0 : minor,
                            patch: isNaN(patch) ? void 0 : patch,
                            prerelease: match[4],
                        };
                    }),
                    (exports.uuid4 = function (
                        crypto = (function () {
                            let gbl = worldwide.GLOBAL_OBJ;
                            return gbl.crypto || gbl.msCrypto;
                        })(),
                    ) {
                        try {
                            if (crypto?.randomUUID) return randomSafeContext.withRandomSafeContext(() => crypto.randomUUID()).replace(/-/g, "");
                        } catch {}
                        return (
                            emptyUuid || (emptyUuid = "10000000100040008000100000000000"),
                            emptyUuid.replace(/[018]/g, (c) => (c ^ ((15 & (16 * randomSafeContext.safeMathRandom())) >> (c / 4))).toString(16))
                        );
                    }));
            }