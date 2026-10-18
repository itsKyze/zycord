7915(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    path = __webpack_require__(732),
                    worldwide = __webpack_require__(3712),
                    rewriteFramesIntegration = integration.defineIntegration((options = {}) => {
                        let root = options.root,
                            prefix = options.prefix || "app:///",
                            isBrowser = "window" in worldwide.GLOBAL_OBJ && !!worldwide.GLOBAL_OBJ.window,
                            iteratee = options.iteratee || generateIteratee({ isBrowser, root, prefix });
                        return {
                            name: "RewriteFrames",
                            processEvent(originalEvent) {
                                let processedEvent = originalEvent;
                                return (
                                    originalEvent.exception &&
                                        Array.isArray(originalEvent.exception.values) &&
                                        (processedEvent = (function (event) {
                                            try {
                                                return {
                                                    ...event,
                                                    exception: {
                                                        ...event.exception,
                                                        values: event.exception.values.map((value) => {
                                                            var stacktrace;
                                                            return {
                                                                ...value,
                                                                ...(value.stacktrace && {
                                                                    stacktrace: { ...(stacktrace = value.stacktrace), frames: stacktrace?.frames?.map((f) => iteratee(f)) },
                                                                }),
                                                            };
                                                        }),
                                                    },
                                                };
                                            } catch {
                                                return event;
                                            }
                                        })(processedEvent)),
                                    processedEvent
                                );
                            },
                        };
                    });
                function generateIteratee({ isBrowser, root, prefix }) {
                    return (frame) => {
                        if (!frame.filename) return frame;
                        let isWindowsFrame = /^[a-zA-Z]:\\/.test(frame.filename) || (frame.filename.includes("\\") && !frame.filename.includes("/")),
                            startsWithSlash = /^\//.test(frame.filename);
                        if (isBrowser) {
                            if (root) {
                                let oldFilename = frame.filename;
                                0 === oldFilename.indexOf(root) && (frame.filename = oldFilename.replace(root, prefix));
                            }
                        } else if (isWindowsFrame || startsWithSlash) {
                            let filename = isWindowsFrame ? frame.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : frame.filename,
                                base = root ? path.relative(root, filename) : path.basename(filename);
                            frame.filename = `${prefix}${base}`;
                        }
                        return frame;
                    };
                }
                ((exports.generateIteratee = generateIteratee), (exports.rewriteFramesIntegration = rewriteFramesIntegration));
            }