1025(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445),
                    backgroundtab = __webpack_require__(5866),
                    linkedTraces = __webpack_require__(5162),
                    request = __webpack_require__(5532),
                    BROWSER_TRACING_INTEGRATION_ID = "BrowserTracing",
                    BOT_USER_AGENT_RE =
                        /Googlebot|Google-InspectionTool|Storebot-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Facebot|facebookexternalhit|LinkedInBot|Twitterbot|Applebot/i;
                function isBotUserAgent() {
                    let nav = helpers.WINDOW.navigator;
                    return !!nav?.userAgent && BOT_USER_AGENT_RE.test(nav.userAgent);
                }
                let DEFAULT_BROWSER_TRACING_OPTIONS = {
                    ...core.TRACING_DEFAULTS,
                    instrumentNavigation: !0,
                    instrumentPageLoad: !0,
                    markBackgroundSpan: !0,
                    enableLongTask: !0,
                    enableLongAnimationFrame: !0,
                    enableInp: !0,
                    ignoreResourceSpans: [],
                    ignorePerformanceApiSpans: [],
                    detectRedirects: !0,
                    linkPreviousTrace: "in-memory",
                    consistentTraceSampling: !1,
                    enableReportPageLoaded: !1,
                    _experiments: {},
                    ...request.defaultRequestInstrumentationOptions,
                };
                function startBrowserTracingPageLoadSpan(client, spanOptions, traceOptions) {
                    (client.emit("startPageLoadSpan", spanOptions, traceOptions), core.getCurrentScope().setTransactionName(spanOptions.name));
                    let pageloadSpan = client[ACTIVE_IDLE_SPAN_PROPERTY];
                    return (pageloadSpan && client.emit("afterStartPageLoadSpan", pageloadSpan), pageloadSpan);
                }
                function startBrowserTracingNavigationSpan(client, spanOptions, options) {
                    let { url, isRedirect } = options || {};
                    (client.emit("beforeStartNavigationSpan", spanOptions, { isRedirect }), client.emit("startNavigationSpan", spanOptions, { isRedirect }));
                    let scope = core.getCurrentScope();
                    return (
                        scope.setTransactionName(spanOptions.name),
                        url && !isRedirect && scope.setSDKProcessingMetadata({ normalizedRequest: { ...helpers.getHttpRequestData(), url } }),
                        client[ACTIVE_IDLE_SPAN_PROPERTY]
                    );
                }
                function getMetaContent(metaName) {
                    let optionalWindowDocument = helpers.WINDOW.document,
                        metaTag = optionalWindowDocument?.querySelector(`meta[name=${metaName}]`);
                    return metaTag?.getAttribute("content") || void 0;
                }
                function getServerTiming(name) {
                    let navigation = helpers.WINDOW.performance?.getEntriesByType?.("navigation")[0],
                        entry = navigation?.serverTiming?.find((entry) => entry.name === name);
                    return entry?.description;
                }
                let ACTIVE_IDLE_SPAN_PROPERTY = "_sentry_idleSpan";
                function setActiveIdleSpan(client, span) {
                    core.addNonEnumerableProperty(client, ACTIVE_IDLE_SPAN_PROPERTY, span);
                }
                ((exports.BROWSER_TRACING_INTEGRATION_ID = BROWSER_TRACING_INTEGRATION_ID),
                    (exports.browserTracingIntegration = (options = {}) => {
                        let _collectWebVitals, lastInteractionTimestamp, _pageloadSpan;
                        "enableElementTiming" in options &&
                            core.consoleSandbox(() => {
                                console.warn("[Sentry] `enableElementTiming` is deprecated and no longer has any effect. Use the standalone `elementTimingIntegration` instead.");
                            });
                        let latestRoute = { name: void 0, source: void 0 },
                            optionalWindowDocument = helpers.WINDOW.document,
                            {
                                enableInp,
                                enableLongTask,
                                enableLongAnimationFrame,
                                _experiments: { enableInteractions, enableStandaloneClsSpans, enableStandaloneLcpSpans },
                                beforeStartSpan,
                                idleTimeout,
                                finalTimeout,
                                childSpanTimeout,
                                markBackgroundSpan,
                                traceFetch,
                                traceXHR,
                                trackFetchStreamPerformance,
                                shouldCreateSpanForRequest,
                                enableHTTPTimings,
                                ignoreResourceSpans,
                                ignorePerformanceApiSpans,
                                instrumentPageLoad,
                                instrumentNavigation,
                                detectRedirects,
                                linkPreviousTrace,
                                consistentTraceSampling,
                                enableReportPageLoaded,
                                onRequestSpanStart,
                                onRequestSpanEnd,
                            } = { ...DEFAULT_BROWSER_TRACING_OPTIONS, ...options },
                            _isBot = isBotUserAgent();
                        function _createRouteSpan(client, startSpanOptions, makeActive = !0) {
                            let isPageloadSpan = "pageload" === startSpanOptions.op,
                                initialSpanName = startSpanOptions.name,
                                finalStartSpanOptions = beforeStartSpan ? beforeStartSpan(startSpanOptions) : startSpanOptions,
                                attributes = finalStartSpanOptions.attributes || {};
                            if (
                                (initialSpanName !== finalStartSpanOptions.name &&
                                    ((attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = "custom"), (finalStartSpanOptions.attributes = attributes)),
                                !makeActive)
                            ) {
                                let now = core.dateTimestampInSeconds();
                                core.startInactiveSpan({ ...finalStartSpanOptions, startTime: now }).end(now);
                                return;
                            }
                            ((latestRoute.name = finalStartSpanOptions.name), (latestRoute.source = attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]));
                            let idleSpan = core.startIdleSpan(finalStartSpanOptions, {
                                idleTimeout,
                                finalTimeout,
                                childSpanTimeout,
                                disableAutoFinish: isPageloadSpan,
                                beforeSpanEnd: (span) => {
                                    _collectWebVitals?.();
                                    let spanStreamingEnabled = core.hasSpanStreamingEnabled(client);
                                    (browserUtils.addPerformanceEntries(span, {
                                        recordClsOnPageloadSpan: !spanStreamingEnabled && !enableStandaloneClsSpans,
                                        recordLcpOnPageloadSpan: !spanStreamingEnabled && !enableStandaloneLcpSpans,
                                        ignoreResourceSpans,
                                        ignorePerformanceApiSpans,
                                        spanStreamingEnabled,
                                    }),
                                        setActiveIdleSpan(client, void 0));
                                    let scope = core.getCurrentScope(),
                                        oldPropagationContext = scope.getPropagationContext();
                                    (scope.setPropagationContext({
                                        ...oldPropagationContext,
                                        traceId: idleSpan.spanContext().traceId,
                                        sampled: core.spanIsSampled(idleSpan),
                                        dsc: core.getDynamicSamplingContextFromSpan(span),
                                    }),
                                        isPageloadSpan && (_pageloadSpan = void 0));
                                },
                                trimIdleSpanEndTimestamp: !enableReportPageLoaded,
                            });
                            function emitFinish() {
                                optionalWindowDocument &&
                                    ["interactive", "complete"].includes(optionalWindowDocument.readyState) &&
                                    client.emit("idleSpanEnableAutoFinish", idleSpan);
                            }
                            (isPageloadSpan && enableReportPageLoaded && (_pageloadSpan = idleSpan),
                                setActiveIdleSpan(client, idleSpan),
                                isPageloadSpan &&
                                    !enableReportPageLoaded &&
                                    optionalWindowDocument &&
                                    (optionalWindowDocument.addEventListener("readystatechange", () => {
                                        emitFinish();
                                    }),
                                    emitFinish()));
                        }
                        return {
                            name: BROWSER_TRACING_INTEGRATION_ID,
                            setup(client) {
                                if (_isBot) {
                                    debugBuild.DEBUG_BUILD && core.debug.log("[Tracing] Skipping browserTracingIntegration setup for bot user agent.");
                                    return;
                                }
                                core.registerSpanErrorInstrumentation();
                                let spanStreamingEnabled = core.hasSpanStreamingEnabled(client);
                                if (
                                    ((_collectWebVitals = browserUtils.startTrackingWebVitals({
                                        recordClsStandaloneSpans: spanStreamingEnabled ? void 0 : enableStandaloneClsSpans || !1,
                                        recordLcpStandaloneSpans: spanStreamingEnabled ? void 0 : enableStandaloneLcpSpans || !1,
                                        client,
                                    })),
                                    spanStreamingEnabled
                                        ? (browserUtils.trackLcpAsSpan(client), browserUtils.trackClsAsSpan(client), enableInp && browserUtils.trackInpAsSpan())
                                        : enableInp && browserUtils.startTrackingINP(),
                                    enableLongAnimationFrame && core.GLOBAL_OBJ.PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes("long-animation-frame")
                                        ? browserUtils.startTrackingLongAnimationFrames()
                                        : enableLongTask && browserUtils.startTrackingLongTasks(),
                                    enableInteractions && browserUtils.startTrackingInteractions(),
                                    detectRedirects && optionalWindowDocument)
                                ) {
                                    let interactionHandler = () => {
                                        lastInteractionTimestamp = core.timestampInSeconds();
                                    };
                                    (addEventListener("click", interactionHandler, { capture: !0 }), addEventListener("keydown", interactionHandler, { capture: !0, passive: !0 }));
                                }
                                function maybeEndActiveSpan() {
                                    let activeSpan = client[ACTIVE_IDLE_SPAN_PROPERTY];
                                    activeSpan &&
                                        !core.spanToJSON(activeSpan).timestamp &&
                                        (debugBuild.DEBUG_BUILD && core.debug.log(`[Tracing] Finishing current active span with op: ${core.spanToJSON(activeSpan).op}`),
                                        activeSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, "cancelled"),
                                        activeSpan.end());
                                }
                                (client.on("startNavigationSpan", (startSpanOptions, navigationOptions) => {
                                    if (core.getClient() !== client) return;
                                    if (navigationOptions?.isRedirect) {
                                        (debugBuild.DEBUG_BUILD && core.debug.warn("[Tracing] Detected redirect, navigation span will not be the root span, but a child span."),
                                            _createRouteSpan(client, { op: "navigation.redirect", ...startSpanOptions }, !1));
                                        return;
                                    }
                                    ((lastInteractionTimestamp = void 0),
                                        maybeEndActiveSpan(),
                                        core
                                            .getIsolationScope()
                                            .setPropagationContext({
                                                traceId: core.generateTraceId(),
                                                sampleRand: Math.random(),
                                                propagationSpanId: core.hasSpansEnabled() ? void 0 : core.generateSpanId(),
                                            }));
                                    let scope = core.getCurrentScope();
                                    (scope.setPropagationContext({
                                        traceId: core.generateTraceId(),
                                        sampleRand: Math.random(),
                                        propagationSpanId: core.hasSpansEnabled() ? void 0 : core.generateSpanId(),
                                    }),
                                        scope.setSDKProcessingMetadata({ normalizedRequest: void 0 }),
                                        _createRouteSpan(client, { op: "navigation", ...startSpanOptions, parentSpan: null, forceTransaction: !0 }));
                                }),
                                    client.on("startPageLoadSpan", (startSpanOptions, traceOptions = {}) => {
                                        if (core.getClient() !== client) return;
                                        maybeEndActiveSpan();
                                        let sentryTrace = traceOptions.sentryTrace || getMetaContent("sentry-trace") || getServerTiming("sentry-trace"),
                                            baggage = traceOptions.baggage || getMetaContent("baggage") || getServerTiming("baggage"),
                                            propagationContext = core.propagationContextFromHeaders(sentryTrace, baggage),
                                            scope = core.getCurrentScope();
                                        (scope.setPropagationContext(propagationContext),
                                            core.hasSpansEnabled() || (scope.getPropagationContext().propagationSpanId = core.generateSpanId()),
                                            scope.setSDKProcessingMetadata({ normalizedRequest: helpers.getHttpRequestData() }),
                                            _createRouteSpan(client, { op: "pageload", ...startSpanOptions }));
                                    }),
                                    client.on("endPageloadSpan", () => {
                                        enableReportPageLoaded &&
                                            _pageloadSpan &&
                                            (_pageloadSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, "reportPageLoaded"), _pageloadSpan.end());
                                    }));
                            },
                            afterAllSetup(client) {
                                var client1, idleTimeout1, finalTimeout1, childSpanTimeout1, latestRoute1;
                                let inflightInteractionSpan;
                                if (_isBot) return;
                                let startingUrl = core.getLocationHref();
                                if (("off" !== linkPreviousTrace && linkedTraces.linkTraces(client, { linkPreviousTrace, consistentTraceSampling }), helpers.WINDOW.location)) {
                                    if (instrumentPageLoad) {
                                        let origin = core.browserPerformanceTimeOrigin();
                                        startBrowserTracingPageLoadSpan(client, {
                                            name: helpers.WINDOW.location.pathname,
                                            startTime: origin ? origin / 1e3 : void 0,
                                            attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url", [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.pageload.browser" },
                                        });
                                    }
                                    instrumentNavigation &&
                                        browserUtils.addHistoryInstrumentationHandler(({ to, from }) => {
                                            var activeSpan, lastInteractionTimestamp1;
                                            let spanData, now;
                                            if (void 0 === from && startingUrl?.indexOf(to) !== -1) {
                                                startingUrl = void 0;
                                                return;
                                            }
                                            startingUrl = void 0;
                                            let parsed = core.parseStringToURLObject(to),
                                                activeSpan1 = client[ACTIVE_IDLE_SPAN_PROPERTY],
                                                navigationIsRedirect =
                                                    activeSpan1 &&
                                                    detectRedirects &&
                                                    ((activeSpan = activeSpan1),
                                                    (lastInteractionTimestamp1 = lastInteractionTimestamp),
                                                    (spanData = core.spanToJSON(activeSpan)),
                                                    !((now = core.dateTimestampInSeconds()) - spanData.start_timestamp > 1.5) &&
                                                        (!lastInteractionTimestamp1 || !(now - lastInteractionTimestamp1 <= 1.5)));
                                            startBrowserTracingNavigationSpan(
                                                client,
                                                {
                                                    name: parsed?.pathname || helpers.WINDOW.location.pathname,
                                                    attributes: {
                                                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url",
                                                        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.navigation.browser",
                                                    },
                                                },
                                                { url: to, isRedirect: navigationIsRedirect },
                                            );
                                        });
                                }
                                (markBackgroundSpan && backgroundtab.registerBackgroundTabDetection(),
                                    enableInteractions &&
                                        ((client1 = client),
                                        (idleTimeout1 = idleTimeout),
                                        (finalTimeout1 = finalTimeout),
                                        (childSpanTimeout1 = childSpanTimeout),
                                        (latestRoute1 = latestRoute),
                                        helpers.WINDOW.document &&
                                            addEventListener(
                                                "click",
                                                () => {
                                                    let op = "ui.action.click",
                                                        activeIdleSpan = client1[ACTIVE_IDLE_SPAN_PROPERTY];
                                                    if (activeIdleSpan && ["navigation", "pageload"].includes(core.spanToJSON(activeIdleSpan).op)) {
                                                        debugBuild.DEBUG_BUILD &&
                                                            core.debug.warn(`[Tracing] Did not create ${op} span because a pageload or navigation span is in progress.`);
                                                        return;
                                                    }
                                                    if (
                                                        (inflightInteractionSpan &&
                                                            (inflightInteractionSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, "interactionInterrupted"),
                                                            inflightInteractionSpan.end(),
                                                            (inflightInteractionSpan = void 0)),
                                                        !latestRoute1.name)
                                                    ) {
                                                        debugBuild.DEBUG_BUILD &&
                                                            core.debug.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
                                                        return;
                                                    }
                                                    inflightInteractionSpan = core.startIdleSpan(
                                                        { name: latestRoute1.name, op, attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: latestRoute1.source || "url" } },
                                                        { idleTimeout: idleTimeout1, finalTimeout: finalTimeout1, childSpanTimeout: childSpanTimeout1 },
                                                    );
                                                },
                                                { capture: !0 },
                                            )),
                                    enableInp && browserUtils.registerInpInteractionListener(),
                                    request.instrumentOutgoingRequests(client, {
                                        traceFetch,
                                        traceXHR,
                                        trackFetchStreamPerformance,
                                        tracePropagationTargets: client.getOptions().tracePropagationTargets,
                                        shouldCreateSpanForRequest,
                                        enableHTTPTimings,
                                        onRequestSpanStart,
                                        onRequestSpanEnd,
                                    }));
                            },
                        };
                    }),
                    (exports.getMetaContent = getMetaContent),
                    (exports.getServerTiming = getServerTiming),
                    (exports.isBotUserAgent = isBotUserAgent),
                    (exports.startBrowserTracingNavigationSpan = startBrowserTracingNavigationSpan),
                    (exports.startBrowserTracingPageLoadSpan = startBrowserTracingPageLoadSpan));
            }