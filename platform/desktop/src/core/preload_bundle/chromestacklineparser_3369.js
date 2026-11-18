3369(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                function createFrame(filename, func, lineno, colno) {
                    let frame = { filename, function: "<anonymous>" === func ? core.UNKNOWN_FUNCTION : func, in_app: !0 };
                    return (void 0 !== lineno && (frame.lineno = lineno), void 0 !== colno && (frame.colno = colno), frame);
                }
                let chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
                    chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                    chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                    chromeDataUriRegex = /at (.+?) ?\(data:(.+?),/,
                    chromeStackLineParser = [
                        30,
                        (line) => {
                            let dataUriMatch = line.match(chromeDataUriRegex);
                            if (dataUriMatch) return { filename: `<data:${dataUriMatch[2]}>`, function: dataUriMatch[1] };
                            let noFnParts = chromeRegexNoFnName.exec(line);
                            if (noFnParts) {
                                let [, filename, line, col] = noFnParts;
                                return createFrame(filename, core.UNKNOWN_FUNCTION, +line, +col);
                            }
                            let parts = chromeRegex.exec(line);
                            if (parts) {
                                if (parts[2]?.indexOf("eval") === 0) {
                                    let subMatch = chromeEvalRegex.exec(parts[2]);
                                    subMatch && ((parts[2] = subMatch[1]), (parts[3] = subMatch[2]), (parts[4] = subMatch[3]));
                                }
                                let [func, filename] = extractSafariExtensionDetails(parts[1] || core.UNKNOWN_FUNCTION, parts[2]);
                                return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
                            }
                        },
                    ],
                    geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
                    geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                    geckoStackLineParser = [
                        50,
                        (line) => {
                            let parts = geckoREgex.exec(line);
                            if (parts) {
                                if (parts[3] && parts[3].indexOf(" > eval") > -1) {
                                    let subMatch = geckoEvalRegex.exec(parts[3]);
                                    subMatch && ((parts[1] = parts[1] || "eval"), (parts[3] = subMatch[1]), (parts[4] = subMatch[2]), (parts[5] = ""));
                                }
                                let filename = parts[3],
                                    func = parts[1] || core.UNKNOWN_FUNCTION;
                                return (
                                    ([func, filename] = extractSafariExtensionDetails(func, filename)),
                                    createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0)
                                );
                            }
                        },
                    ],
                    winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                    winjsStackLineParser = [
                        40,
                        (line) => {
                            let parts = winjsRegex.exec(line);
                            return parts ? createFrame(parts[2], parts[1] || core.UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : void 0) : void 0;
                        },
                    ],
                    opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
                    opera10StackLineParser = [
                        10,
                        (line) => {
                            let parts = opera10Regex.exec(line);
                            return parts ? createFrame(parts[2], parts[3] || core.UNKNOWN_FUNCTION, +parts[1]) : void 0;
                        },
                    ],
                    opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
                    opera11StackLineParser = [
                        20,
                        (line) => {
                            let parts = opera11Regex.exec(line);
                            return parts ? createFrame(parts[5], parts[3] || parts[4] || core.UNKNOWN_FUNCTION, +parts[1], +parts[2]) : void 0;
                        },
                    ],
                    defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser],
                    defaultStackParser = core.createStackParser(...defaultStackLineParsers),
                    extractSafariExtensionDetails = (func, filename) => {
                        let isSafariExtension = -1 !== func.indexOf("safari-extension"),
                            isSafariWebExtension = -1 !== func.indexOf("safari-web-extension");
                        return isSafariExtension || isSafariWebExtension
                            ? [
                                  -1 !== func.indexOf("@") ? func.split("@")[0] : core.UNKNOWN_FUNCTION,
                                  isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`,
                              ]
                            : [func, filename];
                    };
                ((exports.chromeStackLineParser = chromeStackLineParser),
                    (exports.defaultStackLineParsers = defaultStackLineParsers),
                    (exports.defaultStackParser = defaultStackParser),
                    (exports.geckoStackLineParser = geckoStackLineParser),
                    (exports.opera10StackLineParser = opera10StackLineParser),
                    (exports.opera11StackLineParser = opera11StackLineParser),
                    (exports.winjsStackLineParser = winjsStackLineParser));
            }