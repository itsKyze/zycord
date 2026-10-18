7970(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/,
                    STRIP_FRAME_REGEXP = /captureMessage|captureException/;
                function createStackParser(...parsers) {
                    let sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
                    return (stack, skipFirstLines = 0, framesToPop = 0) => {
                        let frames = [],
                            lines = stack.split("\n");
                        for (let i = skipFirstLines; i < lines.length; i++) {
                            let line = lines[i];
                            line.length > 1024 && (line = line.slice(0, 1024));
                            let cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
                            if (!cleanedLine.includes("Error: ")) {
                                for (let parser of sortedParsers) {
                                    let frame = parser(cleanedLine);
                                    if (frame) {
                                        frames.push(frame);
                                        break;
                                    }
                                }
                                if (frames.length >= 50 + framesToPop) break;
                            }
                        }
                        return stripSentryFramesAndReverse(frames.slice(framesToPop));
                    };
                }
                function stripSentryFramesAndReverse(stack) {
                    if (!stack.length) return [];
                    let localStack = Array.from(stack);
                    return (
                        /sentryWrapped/.test(getLastStackFrame(localStack).function || "") && localStack.pop(),
                        localStack.reverse(),
                        STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "") &&
                            (localStack.pop(), STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "") && localStack.pop()),
                        localStack.slice(0, 50).map((frame) => ({ ...frame, filename: frame.filename || getLastStackFrame(localStack).filename, function: frame.function || "?" }))
                    );
                }
                function getLastStackFrame(arr) {
                    return arr[arr.length - 1] || {};
                }
                let defaultFunctionName = "<anonymous>";
                ((exports.UNKNOWN_FUNCTION = "?"),
                    (exports.createStackParser = createStackParser),
                    (exports.getFramesFromEvent = function (event) {
                        let exception = event.exception;
                        if (exception) {
                            let frames = [];
                            try {
                                return (
                                    exception.values.forEach((value) => {
                                        value.stacktrace.frames && frames.push(...value.stacktrace.frames);
                                    }),
                                    frames
                                );
                            } catch {}
                        }
                    }),
                    (exports.getFunctionName = function (fn) {
                        try {
                            if (!fn || "function" != typeof fn) return defaultFunctionName;
                            return fn.name || defaultFunctionName;
                        } catch {
                            return defaultFunctionName;
                        }
                    }),
                    (exports.getVueInternalName = function (value) {
                        return "__v_isVNode" in value && value.__v_isVNode ? "[VueVNode]" : "[VueViewModel]";
                    }),
                    (exports.normalizeStackTracePath = function (path) {
                        let filename = path?.startsWith("file://") ? path.slice(7) : path;
                        return (filename?.match(/\/[A-Z]:/) && (filename = filename.slice(1)), filename);
                    }),
                    (exports.stackParserFromStackParserOptions = function (stackParser) {
                        return Array.isArray(stackParser) ? createStackParser(...stackParser) : stackParser;
                    }),
                    (exports.stripSentryFramesAndReverse = stripSentryFramesAndReverse));
            }