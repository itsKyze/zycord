5596(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let nodeStackTrace = __webpack_require__(658),
                    stacktrace = __webpack_require__(7970);
                ((exports.callFrameToStackFrame = function (frame, url, getModuleFromFilename) {
                    let filename = url ? url.replace(/^file:\/\//, "") : void 0,
                        colno = frame.location.columnNumber ? frame.location.columnNumber + 1 : void 0,
                        lineno = frame.location.lineNumber ? frame.location.lineNumber + 1 : void 0;
                    return {
                        filename,
                        module: getModuleFromFilename(filename),
                        function: frame.functionName || stacktrace.UNKNOWN_FUNCTION,
                        colno,
                        lineno,
                        in_app: filename ? nodeStackTrace.filenameIsInApp(filename) : void 0,
                    };
                }),
                    (exports.watchdogTimer = function (createTimer, pollInterval, anrThreshold, callback) {
                        let timer = createTimer(),
                            triggered = !1,
                            enabled = !0;
                        return (
                            setInterval(() => {
                                let diffMs = timer.getTimeMs();
                                (!1 === triggered && diffMs > pollInterval + anrThreshold && ((triggered = !0), enabled && callback()),
                                    diffMs < pollInterval + anrThreshold && (triggered = !1));
                            }, 20),
                            {
                                poll: () => {
                                    timer.reset();
                                },
                                enabled: (state) => {
                                    enabled = state;
                                },
                            }
                        );
                    }));
            }