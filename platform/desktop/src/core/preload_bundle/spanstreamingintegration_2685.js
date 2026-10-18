2685(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    integration = __webpack_require__(5579),
                    beforeSendSpan = __webpack_require__(6509),
                    captureSpan = __webpack_require__(7484),
                    hasSpanStreamingEnabled = __webpack_require__(9807),
                    spanBuffer = __webpack_require__(14),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470);
                exports.spanStreamingIntegration = integration.defineIntegration(() => ({
                    name: "SpanStreaming",
                    setup(client) {
                        let initialMessage = "SpanStreaming integration requires",
                            fallbackMsg = "Falling back to static trace lifecycle.",
                            clientOptions = client.getOptions();
                        if (!hasSpanStreamingEnabled.hasSpanStreamingEnabled(client)) {
                            ((clientOptions.traceLifecycle = "static"),
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`${initialMessage} \`traceLifecycle\` to be set to "stream"! ${fallbackMsg}`));
                            return;
                        }
                        let beforeSendSpan$1 = clientOptions.beforeSendSpan;
                        if (beforeSendSpan$1 && !beforeSendSpan.isStreamedBeforeSendSpanCallback(beforeSendSpan$1)) {
                            ((clientOptions.traceLifecycle = "static"),
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`${initialMessage} a beforeSendSpan callback using \`withStreamedSpan\`! ${fallbackMsg}`));
                            return;
                        }
                        let buffer = new spanBuffer.SpanBuffer(client);
                        client.on("afterSpanEnd", (span) => {
                            spanUtils.spanIsSampled(span) && buffer.add(captureSpan.captureSpan(span, client));
                        });
                    },
                }));
            }