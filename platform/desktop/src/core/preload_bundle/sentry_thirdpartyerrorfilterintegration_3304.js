3304(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    metadata = __webpack_require__(2188),
                    envelope = __webpack_require__(1323),
                    stacktrace = __webpack_require__(7970),
                    thirdPartyErrorFilterIntegration = integration.defineIntegration((options) => ({
                        name: "ThirdPartyErrorsFilter",
                        setup(client) {
                            (client.on("beforeEnvelope", (envelope$1) => {
                                envelope.forEachEnvelopeItem(envelope$1, (item, type) => {
                                    if ("event" === type) {
                                        let event = Array.isArray(item) ? item[1] : void 0;
                                        event && (metadata.stripMetadataFromStackFrames(event), (item[1] = event));
                                    }
                                });
                            }),
                                client.on("applyFrameMetadata", (event) => {
                                    if (event.type) return;
                                    let stackParser = client.getOptions().stackParser;
                                    metadata.addMetadataToStackFrames(stackParser, event);
                                }));
                        },
                        processEvent(event) {
                            let frameKeys = (function (event, ignoreSentryInternalFrames) {
                                let frames = stacktrace.getFramesFromEvent(event);
                                if (frames)
                                    return frames
                                        .filter(
                                            (frame, index) =>
                                                !!frame.filename &&
                                                (null != frame.lineno || null != frame.colno || null != frame.instruction_addr) &&
                                                (!ignoreSentryInternalFrames ||
                                                    !(function (frame, frameIndex) {
                                                        if (
                                                            0 !== frameIndex ||
                                                            !frame.context_line ||
                                                            !frame.filename ||
                                                            !frame.filename.includes("sentry") ||
                                                            !frame.filename.includes("helpers") ||
                                                            !frame.context_line.includes(SENTRY_INTERNAL_FN_APPLY)
                                                        )
                                                            return !1;
                                                        if (frame.pre_context) {
                                                            let len = frame.pre_context.length;
                                                            for (let i = 0; i < len; i++) if (frame.pre_context[i]?.includes(SENTRY_INTERNAL_COMMENT)) return !0;
                                                        }
                                                        return !1;
                                                    })(frame, index)),
                                        )
                                        .map((frame) =>
                                            frame.module_metadata
                                                ? Object.keys(frame.module_metadata)
                                                      .filter((key) => key.startsWith(BUNDLER_PLUGIN_APP_KEY_PREFIX))
                                                      .map((key) => key.slice(BUNDLER_PLUGIN_APP_KEY_PREFIX.length))
                                                : [],
                                        );
                            })(event, options.ignoreSentryInternalFrames);
                            if (
                                frameKeys &&
                                frameKeys[
                                    "drop-error-if-contains-third-party-frames" === options.behaviour || "apply-tag-if-contains-third-party-frames" === options.behaviour
                                        ? "some"
                                        : "every"
                                ]((keys) => !keys.some((key) => options.filterKeys.includes(key)))
                            ) {
                                if (
                                    "drop-error-if-contains-third-party-frames" === options.behaviour ||
                                    "drop-error-if-exclusively-contains-third-party-frames" === options.behaviour
                                )
                                    return null;
                                event.tags = { ...event.tags, third_party_code: !0 };
                            }
                            return event;
                        },
                    })),
                    BUNDLER_PLUGIN_APP_KEY_PREFIX = "_sentryBundlerPluginAppKey:",
                    SENTRY_INTERNAL_COMMENT = "Attempt to invoke user-land function",
                    SENTRY_INTERNAL_FN_APPLY = "fn.apply(this, wrappedArguments)";
                exports.thirdPartyErrorFilterIntegration = thirdPartyErrorFilterIntegration;
            }