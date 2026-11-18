2093(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugLogger = __webpack_require__(2533),
                    baggage = __webpack_require__(3549),
                    dsn = __webpack_require__(6058),
                    parseSampleRate = __webpack_require__(8068),
                    propagationContext = __webpack_require__(8034),
                    randomSafeContext = __webpack_require__(638),
                    TRACEPARENT_REGEXP = RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");
                function extractTraceparentData(traceparent) {
                    let parentSampled;
                    if (!traceparent) return;
                    let matches = traceparent.match(TRACEPARENT_REGEXP);
                    if (matches)
                        return (
                            "1" === matches[3] ? (parentSampled = !0) : "0" === matches[3] && (parentSampled = !1),
                            { traceId: matches[1], parentSampled, parentSpanId: matches[2] }
                        );
                }
                ((exports.TRACEPARENT_REGEXP = TRACEPARENT_REGEXP),
                    (exports.extractTraceparentData = extractTraceparentData),
                    (exports.generateSentryTraceHeader = function (traceId = propagationContext.generateTraceId(), spanId = propagationContext.generateSpanId(), sampled) {
                        let sampledString = "";
                        return (void 0 !== sampled && (sampledString = sampled ? "-1" : "-0"), `${traceId}-${spanId}${sampledString}`);
                    }),
                    (exports.generateTraceparentHeader = function (traceId = propagationContext.generateTraceId(), spanId = propagationContext.generateSpanId(), sampled) {
                        return `00-${traceId}-${spanId}-${sampled ? "01" : "00"}`;
                    }),
                    (exports.propagationContextFromHeaders = function (sentryTrace, baggage$1) {
                        let traceparentData = extractTraceparentData(sentryTrace),
                            dynamicSamplingContext = baggage.baggageHeaderToDynamicSamplingContext(baggage$1);
                        if (!traceparentData?.traceId) return { traceId: propagationContext.generateTraceId(), sampleRand: randomSafeContext.safeMathRandom() };
                        let sampleRand = (function (traceparentData, dsc) {
                            let parsedSampleRand = parseSampleRate.parseSampleRate(dsc?.sample_rand);
                            if (void 0 !== parsedSampleRand) return parsedSampleRand;
                            let parsedSampleRate = parseSampleRate.parseSampleRate(dsc?.sample_rate);
                            return parsedSampleRate && traceparentData?.parentSampled !== void 0
                                ? traceparentData.parentSampled
                                    ? randomSafeContext.safeMathRandom() * parsedSampleRate
                                    : parsedSampleRate + randomSafeContext.safeMathRandom() * (1 - parsedSampleRate)
                                : randomSafeContext.safeMathRandom();
                        })(traceparentData, dynamicSamplingContext);
                        dynamicSamplingContext && (dynamicSamplingContext.sample_rand = sampleRand.toString());
                        let { traceId, parentSpanId, parentSampled } = traceparentData;
                        return { traceId, parentSpanId, sampled: parentSampled, dsc: dynamicSamplingContext || {}, sampleRand };
                    }),
                    (exports.shouldContinueTrace = function (client, baggageOrgId) {
                        let clientOrgId = dsn.extractOrgIdFromClient(client);
                        return baggageOrgId && clientOrgId && baggageOrgId !== clientOrgId
                            ? (debugLogger.debug.log(`Won't continue trace because org IDs don't match (incoming baggage: ${baggageOrgId}, SDK options: ${clientOrgId})`), !1)
                            : !client.getOptions().strictTraceContinuation ||
                                  ((!baggageOrgId || !!clientOrgId) && (!!baggageOrgId || !clientOrgId)) ||
                                  (debugLogger.debug.log(
                                      `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${baggageOrgId}, Sentry client: ${clientOrgId})`,
                                  ),
                                  !1);
                    }));
            }