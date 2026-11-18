6078(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734);
                exports.spanStreamingIntegration = core.defineIntegration(() => ({
                    name: "SpanStreaming",
                    beforeSetup(client) {
                        let clientOptions = client.getOptions();
                        clientOptions.traceLifecycle ||
                            (debugBuild.DEBUG_BUILD && core.debug.log('[SpanStreaming] setting `traceLifecycle` to "stream"'), (clientOptions.traceLifecycle = "stream"));
                    },
                    setup(client) {
                        let initialMessage = "SpanStreaming integration requires",
                            fallbackMsg = "Falling back to static trace lifecycle.",
                            clientOptions = client.getOptions();
                        if (!core.hasSpanStreamingEnabled(client)) {
                            ((clientOptions.traceLifecycle = "static"),
                                debugBuild.DEBUG_BUILD && core.debug.warn(`${initialMessage} \`traceLifecycle\` to be set to "stream"! ${fallbackMsg}`));
                            return;
                        }
                        let beforeSendSpan = clientOptions.beforeSendSpan;
                        if (beforeSendSpan && !core.isStreamedBeforeSendSpanCallback(beforeSendSpan)) {
                            ((clientOptions.traceLifecycle = "static"),
                                debugBuild.DEBUG_BUILD && core.debug.warn(`${initialMessage} a beforeSendSpan callback using \`withStreamedSpan\`! ${fallbackMsg}`));
                            return;
                        }
                        let buffer = new core.SpanBuffer(client);
                        (client.on("afterSpanEnd", (span) => {
                            core.spanIsSampled(span) && buffer.add(core.captureSpan(span, client));
                        }),
                            client.on("afterSegmentSpanEnd", (segmentSpan) => {
                                let traceId = segmentSpan.spanContext().traceId;
                                setTimeout(() => {
                                    buffer.flush(traceId);
                                }, 500);
                            }));
                    },
                }));
            }