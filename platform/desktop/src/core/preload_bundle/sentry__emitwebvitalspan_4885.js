4885(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    types = __webpack_require__(3863),
                    inp = __webpack_require__(4601),
                    instrument = __webpack_require__(6811),
                    lcp = __webpack_require__(8579),
                    utils = __webpack_require__(8933);
                function _emitWebVitalSpan(options) {
                    let { name, op, origin, metricName, value, attributes: passedAttributes, parentSpan, reportEvent, startTime, endTime } = options,
                        routeName = core.getCurrentScope().getScopeData().transactionName,
                        attributes = {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: origin,
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
                            [core.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: 0,
                            [`browser.web_vital.${metricName}.value`]: value,
                            "sentry.transaction": routeName,
                            "user_agent.original": types.WINDOW.navigator?.userAgent,
                            ...passedAttributes,
                        };
                    (parentSpan &&
                        core.spanToStreamedSpanJSON(parentSpan).attributes?.[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] === "pageload" &&
                        (attributes["sentry.pageload.span_id"] = parentSpan.spanContext().spanId),
                        reportEvent && (attributes[`browser.web_vital.${metricName}.report_event`] = reportEvent));
                    let span = core.startInactiveSpan({ name, attributes, startTime, parentSpan: parentSpan });
                    span && span.end(endTime ?? startTime);
                }
                function _sendLcpSpan(lcpValue, entry, pageloadSpan, reportEvent) {
                    if (!lcp.isValidLcpMetric(lcpValue)) return;
                    debugBuild.DEBUG_BUILD && core.debug.log(`Sending LCP span (${lcpValue})`);
                    let performanceTimeOrigin = core.browserPerformanceTimeOrigin() || 0,
                        timeOrigin = utils.msToSec(performanceTimeOrigin),
                        endTime = utils.msToSec(performanceTimeOrigin + (entry?.startTime || 0)),
                        name = entry ? core.htmlTreeAsString(entry.element) : "Largest contentful paint",
                        attributes = {};
                    (entry?.element && (attributes["browser.web_vital.lcp.element"] = core.htmlTreeAsString(entry.element)),
                        entry?.id && (attributes["browser.web_vital.lcp.id"] = entry.id),
                        entry?.url && (attributes["browser.web_vital.lcp.url"] = entry.url),
                        entry?.loadTime != null && (attributes["browser.web_vital.lcp.load_time"] = entry.loadTime),
                        entry?.renderTime != null && (attributes["browser.web_vital.lcp.render_time"] = entry.renderTime),
                        entry?.size != null && (attributes["browser.web_vital.lcp.size"] = entry.size),
                        _emitWebVitalSpan({
                            name,
                            op: "ui.webvital.lcp",
                            origin: "auto.http.browser.lcp",
                            metricName: "lcp",
                            value: lcpValue,
                            attributes,
                            parentSpan: pageloadSpan,
                            reportEvent,
                            startTime: timeOrigin,
                            endTime,
                        }));
                }
                function _sendClsSpan(clsValue, entry, pageloadSpan, reportEvent) {
                    debugBuild.DEBUG_BUILD && core.debug.log(`Sending CLS span (${clsValue})`);
                    let startTime = entry ? utils.msToSec((core.browserPerformanceTimeOrigin() || 0) + entry.startTime) : core.timestampInSeconds(),
                        name = entry ? core.htmlTreeAsString(entry.sources[0]?.node) : "Layout shift",
                        attributes = {};
                    (entry?.sources &&
                        entry.sources.forEach((source, index) => {
                            attributes[`browser.web_vital.cls.source.${index + 1}`] = core.htmlTreeAsString(source.node);
                        }),
                        _emitWebVitalSpan({
                            name,
                            op: "ui.webvital.cls",
                            origin: "auto.http.browser.cls",
                            metricName: "cls",
                            value: clsValue,
                            attributes,
                            parentSpan: pageloadSpan,
                            reportEvent,
                            startTime,
                        }));
                }
                function _sendInpSpan(inpValue, entry) {
                    debugBuild.DEBUG_BUILD && core.debug.log(`Sending INP span (${inpValue})`);
                    let startTime = utils.msToSec(core.browserPerformanceTimeOrigin() + entry.startTime),
                        duration = utils.msToSec(inpValue),
                        interactionType = inp.INP_ENTRY_MAP[entry.name],
                        cachedContext = inp.getCachedInteractionContext(entry.interactionId),
                        activeSpan = core.getActiveSpan(),
                        rootSpan = activeSpan ? core.getRootSpan(activeSpan) : void 0,
                        spanToUse = cachedContext?.span || rootSpan,
                        routeName = spanToUse ? core.spanToStreamedSpanJSON(spanToUse).name : core.getCurrentScope().getScopeData().transactionName;
                    _emitWebVitalSpan({
                        name: cachedContext?.elementName || core.htmlTreeAsString(entry.target),
                        op: `ui.interaction.${interactionType}`,
                        origin: "auto.http.browser.inp",
                        metricName: "inp",
                        value: inpValue,
                        attributes: { [core.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: entry.duration, "sentry.transaction": routeName },
                        startTime,
                        endTime: startTime + duration,
                        parentSpan: spanToUse,
                    });
                }
                ((exports._emitWebVitalSpan = _emitWebVitalSpan),
                    (exports._sendClsSpan = _sendClsSpan),
                    (exports._sendInpSpan = _sendInpSpan),
                    (exports._sendLcpSpan = _sendLcpSpan),
                    (exports.trackClsAsSpan = function (client) {
                        let clsEntry,
                            clsValue = 0;
                        if (!utils.supportsWebVital("layout-shift")) return;
                        let cleanupClsHandler = instrument.addClsInstrumentationHandler(({ metric }) => {
                            let entry = metric.entries[metric.entries.length - 1];
                            entry && ((clsValue = metric.value), (clsEntry = entry));
                        }, !0);
                        utils.listenForWebVitalReportEvents(client, (reportEvent, _, pageloadSpan) => {
                            (_sendClsSpan(clsValue, clsEntry, pageloadSpan, reportEvent), cleanupClsHandler());
                        });
                    }),
                    (exports.trackInpAsSpan = function () {
                        utils.getBrowserPerformanceAPI() &&
                            core.browserPerformanceTimeOrigin() &&
                            instrument.addInpInstrumentationHandler(({ metric }) => {
                                if (null == metric.value || utils.msToSec(metric.value) > inp.MAX_PLAUSIBLE_INP_DURATION) return;
                                let entry = metric.entries.find((e) => e.duration === metric.value && inp.INP_ENTRY_MAP[e.name]);
                                entry && _sendInpSpan(metric.value, entry);
                            });
                    }),
                    (exports.trackLcpAsSpan = function (client) {
                        let lcpEntry,
                            lcpValue = 0;
                        if (!utils.supportsWebVital("largest-contentful-paint")) return;
                        let cleanupLcpHandler = instrument.addLcpInstrumentationHandler(({ metric }) => {
                            let entry = metric.entries[metric.entries.length - 1];
                            entry && lcp.isValidLcpMetric(metric.value) && ((lcpValue = metric.value), (lcpEntry = entry));
                        }, !0);
                        utils.listenForWebVitalReportEvents(client, (reportEvent, _, pageloadSpan) => {
                            (_sendLcpSpan(lcpValue, lcpEntry, pageloadSpan, reportEvent), cleanupLcpHandler());
                        });
                    }));
            }