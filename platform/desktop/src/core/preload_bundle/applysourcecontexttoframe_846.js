846(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    WINDOW = core.GLOBAL_OBJ,
                    contextLinesIntegration = core.defineIntegration((options = {}) => {
                        let contextLines = null != options.frameContextLines ? options.frameContextLines : 7;
                        return {
                            name: "ContextLines",
                            processEvent: (event) =>
                                (function (event, contextLines) {
                                    let doc = WINDOW.document,
                                        htmlFilename = WINDOW.location && core.stripUrlQueryAndFragment(WINDOW.location.href);
                                    if (!doc || !htmlFilename) return event;
                                    let exceptions = event.exception?.values;
                                    if (!exceptions?.length) return event;
                                    let html = doc.documentElement.innerHTML;
                                    if (!html) return event;
                                    let htmlLines = ["<!DOCTYPE html>", "<html>", ...html.split("\n"), "</html>"];
                                    return (
                                        exceptions.forEach((exception) => {
                                            let stacktrace = exception.stacktrace;
                                            stacktrace?.frames &&
                                                (stacktrace.frames = stacktrace.frames.map((frame) => applySourceContextToFrame(frame, htmlLines, htmlFilename, contextLines)));
                                        }),
                                        event
                                    );
                                })(event, contextLines),
                        };
                    });
                function applySourceContextToFrame(frame, htmlLines, htmlFilename, linesOfContext) {
                    return (frame.filename === htmlFilename && frame.lineno && htmlLines.length && core.addContextToFrame(htmlLines, frame, linesOfContext), frame);
                }
                ((exports.applySourceContextToFrame = applySourceContextToFrame), (exports.contextLinesIntegration = contextLinesIntegration));
            }