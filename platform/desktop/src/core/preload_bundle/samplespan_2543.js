2543(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    hasSpansEnabled = __webpack_require__(3781),
                    parseSampleRate = __webpack_require__(8068);
                exports.sampleSpan = function (options, samplingContext, sampleRand) {
                    let sampleRate, localSampleRateWasApplied;
                    if (!hasSpansEnabled.hasSpansEnabled(options)) return [!1];
                    "function" == typeof options.tracesSampler
                        ? ((sampleRate = options.tracesSampler({
                              ...samplingContext,
                              inheritOrSampleWith: (fallbackSampleRate) =>
                                  "number" == typeof samplingContext.parentSampleRate
                                      ? samplingContext.parentSampleRate
                                      : "boolean" == typeof samplingContext.parentSampled
                                        ? Number(samplingContext.parentSampled)
                                        : fallbackSampleRate,
                          })),
                          (localSampleRateWasApplied = !0))
                        : void 0 !== samplingContext.parentSampled
                          ? (sampleRate = samplingContext.parentSampled)
                          : void 0 !== options.tracesSampleRate && ((sampleRate = options.tracesSampleRate), (localSampleRateWasApplied = !0));
                    let parsedSampleRate = parseSampleRate.parseSampleRate(sampleRate);
                    if (void 0 === parsedSampleRate)
                        return (
                            debugBuild.DEBUG_BUILD &&
                                debugLogger.debug.warn(
                                    `[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(sampleRate)} of type ${JSON.stringify(typeof sampleRate)}.`,
                                ),
                            [!1]
                        );
                    if (!parsedSampleRate)
                        return (
                            debugBuild.DEBUG_BUILD &&
                                debugLogger.debug.log(
                                    `[Tracing] Discarding transaction because ${"function" == typeof options.tracesSampler ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`,
                                ),
                            [!1, parsedSampleRate, localSampleRateWasApplied]
                        );
                    let shouldSample = sampleRand < parsedSampleRate;
                    return (
                        !shouldSample &&
                            debugBuild.DEBUG_BUILD &&
                            debugLogger.debug.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(sampleRate)})`),
                        [shouldSample, parsedSampleRate, localSampleRateWasApplied]
                    );
                };
            }