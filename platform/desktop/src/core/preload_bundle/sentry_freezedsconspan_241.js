241(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let constants = __webpack_require__(4264),
                    currentScopes = __webpack_require__(7121),
                    semanticAttributes = __webpack_require__(3052),
                    baggage = __webpack_require__(3549),
                    dsn = __webpack_require__(6058),
                    hasSpansEnabled = __webpack_require__(3781),
                    object = __webpack_require__(4204),
                    spanUtils = __webpack_require__(470),
                    utils = __webpack_require__(3033),
                    FROZEN_DSC_FIELD = "_frozenDsc";
                function getDynamicSamplingContextFromClient(trace_id, client) {
                    let options = client.getOptions(),
                        { publicKey: public_key } = client.getDsn() || {},
                        dsc = {
                            environment: options.environment || constants.DEFAULT_ENVIRONMENT,
                            release: options.release,
                            public_key,
                            trace_id,
                            org_id: dsn.extractOrgIdFromClient(client),
                        };
                    return (client.emit("createDsc", dsc), dsc);
                }
                function getDynamicSamplingContextFromSpan(span) {
                    let client = currentScopes.getClient();
                    if (!client) return {};
                    let rootSpan = spanUtils.getRootSpan(span),
                        rootSpanJson = spanUtils.spanToJSON(rootSpan),
                        rootSpanAttributes = rootSpanJson.data,
                        traceState = rootSpan.spanContext().traceState,
                        rootSpanSampleRate =
                            traceState?.get("sentry.sample_rate") ??
                            rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] ??
                            rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE];
                    function applyLocalSampleRateToDsc(dsc) {
                        return (("number" == typeof rootSpanSampleRate || "string" == typeof rootSpanSampleRate) && (dsc.sample_rate = `${rootSpanSampleRate}`), dsc);
                    }
                    let frozenDsc = rootSpan[FROZEN_DSC_FIELD];
                    if (frozenDsc) return applyLocalSampleRateToDsc(frozenDsc);
                    let traceStateDsc = traceState?.get("sentry.dsc"),
                        dscOnTraceState = traceStateDsc && baggage.baggageHeaderToDynamicSamplingContext(traceStateDsc);
                    if (dscOnTraceState) return applyLocalSampleRateToDsc(dscOnTraceState);
                    let dsc = getDynamicSamplingContextFromClient(span.spanContext().traceId, client),
                        source = rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] ?? rootSpanAttributes["sentry.span.source"],
                        name = rootSpanJson.description;
                    return (
                        "url" !== source && name && (dsc.transaction = name),
                        hasSpansEnabled.hasSpansEnabled() &&
                            ((dsc.sampled = String(spanUtils.spanIsSampled(rootSpan))),
                            (dsc.sample_rand =
                                traceState?.get("sentry.sample_rand") ?? utils.getCapturedScopesOnSpan(rootSpan).scope?.getPropagationContext().sampleRand.toString())),
                        applyLocalSampleRateToDsc(dsc),
                        client.emit("createDsc", dsc, rootSpan),
                        dsc
                    );
                }
                ((exports.freezeDscOnSpan = function (span, dsc) {
                    object.addNonEnumerableProperty(span, FROZEN_DSC_FIELD, dsc);
                }),
                    (exports.getDynamicSamplingContextFromClient = getDynamicSamplingContextFromClient),
                    (exports.getDynamicSamplingContextFromScope = function (client, scope) {
                        let propagationContext = scope.getPropagationContext();
                        return propagationContext.dsc || getDynamicSamplingContextFromClient(propagationContext.traceId, client);
                    }),
                    (exports.getDynamicSamplingContextFromSpan = getDynamicSamplingContextFromSpan),
                    (exports.spanToBaggageHeader = function (span) {
                        let dsc = getDynamicSamplingContextFromSpan(span);
                        return baggage.dynamicSamplingContextToSentryBaggageHeader(dsc);
                    }));
            }