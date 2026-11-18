3979(__unused_rspack_module, exports, __webpack_require__) {
                let _lcpEntry, _clsEntry;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863),
                    cls = __webpack_require__(1276),
                    instrument = __webpack_require__(6811),
                    lcp = __webpack_require__(8579),
                    resourceTiming = __webpack_require__(6336),
                    utils = __webpack_require__(8933),
                    getActivationStart = __webpack_require__(5251),
                    getNavigationEntry = __webpack_require__(9549),
                    getVisibilityWatcher = __webpack_require__(6723),
                    debugBuild = __webpack_require__(600),
                    _performanceCursor = 0,
                    _measurements = {};
                function _addMeasureSpans(span, entry, startTime, duration, timeOrigin, ignorePerformanceApiSpans) {
                    if (
                        (function (entry) {
                            if (entry?.entryType === "measure")
                                try {
                                    return "Components \u269B" === entry.detail.devtools.track;
                                } catch {
                                    return;
                                }
                        })(entry) ||
                        (["mark", "measure"].includes(entry.entryType) && core.stringMatchesSomePattern(entry.name, ignorePerformanceApiSpans))
                    )
                        return;
                    let navEntry = getNavigationEntry.getNavigationEntry(!1),
                        measureStartTimestamp = timeOrigin + Math.max(startTime, utils.msToSec(navEntry ? navEntry.requestStart : 0)),
                        startTimeStamp = timeOrigin + startTime,
                        measureEndTimestamp = startTimeStamp + duration,
                        attributes = { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.resource.browser.metrics" };
                    (measureStartTimestamp !== startTimeStamp &&
                        ((attributes["sentry.browser.measure_happened_before_request"] = !0), (attributes["sentry.browser.measure_start_time"] = measureStartTimestamp)),
                        (function (attributes, performanceMeasure) {
                            try {
                                let detail = performanceMeasure.detail;
                                if (!detail) return;
                                if ("object" == typeof detail) {
                                    for (let [key, value] of Object.entries(detail))
                                        if (value && core.isPrimitive(value)) attributes[`sentry.browser.measure.detail.${key}`] = value;
                                        else if (void 0 !== value)
                                            try {
                                                attributes[`sentry.browser.measure.detail.${key}`] = JSON.stringify(value);
                                            } catch {}
                                    return;
                                }
                                if (core.isPrimitive(detail)) {
                                    attributes["sentry.browser.measure.detail"] = detail;
                                    return;
                                }
                                try {
                                    attributes["sentry.browser.measure.detail"] = JSON.stringify(detail);
                                } catch {}
                            } catch {}
                        })(attributes, entry),
                        measureStartTimestamp <= measureEndTimestamp &&
                            utils.startAndEndSpan(span, measureStartTimestamp, measureEndTimestamp, { name: entry.name, op: entry.entryType, attributes }));
                }
                function _addNavigationSpans(span, entry, timeOrigin) {
                    var span1, entry1, timeOrigin1;
                    let requestStartTimestamp, responseEndTimestamp, responseStartTimestamp;
                    (["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((event) => {
                        _addPerformanceNavigationTiming(span, entry, event, timeOrigin);
                    }),
                        _addPerformanceNavigationTiming(span, entry, "secureConnection", timeOrigin, "TLS/SSL"),
                        _addPerformanceNavigationTiming(span, entry, "fetch", timeOrigin, "cache"),
                        _addPerformanceNavigationTiming(span, entry, "domainLookup", timeOrigin, "DNS"),
                        (span1 = span),
                        (entry1 = entry),
                        (requestStartTimestamp = (timeOrigin1 = timeOrigin) + utils.msToSec(entry1.requestStart)),
                        (responseEndTimestamp = timeOrigin1 + utils.msToSec(entry1.responseEnd)),
                        (responseStartTimestamp = timeOrigin1 + utils.msToSec(entry1.responseStart)),
                        entry1.responseEnd &&
                            (utils.startAndEndSpan(span1, requestStartTimestamp, responseEndTimestamp, {
                                op: "browser.request",
                                name: entry1.name,
                                attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics" },
                            }),
                            utils.startAndEndSpan(span1, responseStartTimestamp, responseEndTimestamp, {
                                op: "browser.response",
                                name: entry1.name,
                                attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics" },
                            })));
                }
                function _addPerformanceNavigationTiming(span, entry, event, timeOrigin, name = event) {
                    var event1;
                    let end = entry["secureConnection" === (event1 = event) ? "connectEnd" : "fetch" === event1 ? "domainLookupStart" : `${event1}End`],
                        start = entry[`${event}Start`];
                    start &&
                        end &&
                        utils.startAndEndSpan(span, timeOrigin + utils.msToSec(start), timeOrigin + utils.msToSec(end), {
                            op: `browser.${name}`,
                            name: entry.name,
                            attributes: {
                                [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics",
                                ...("redirect" === event && null != entry.redirectCount ? { "http.redirect_count": entry.redirectCount } : {}),
                            },
                        });
                }
                function _addResourceSpans(span, entry, resourceUrl, startTime, duration, timeOrigin, ignoredResourceSpanOps) {
                    if ("xmlhttprequest" === entry.initiatorType || "fetch" === entry.initiatorType) return;
                    let op = entry.initiatorType ? `resource.${entry.initiatorType}` : "resource.other";
                    if (ignoredResourceSpanOps?.includes(op)) return;
                    let attributes = { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.resource.browser.metrics" },
                        parsedUrl = core.parseUrl(resourceUrl);
                    (parsedUrl.protocol && (attributes["url.scheme"] = parsedUrl.protocol.split(":").pop()),
                        parsedUrl.host && (attributes["server.address"] = parsedUrl.host),
                        (attributes["url.same_origin"] = resourceUrl.includes(types.WINDOW.location.origin)),
                        _setResourceRequestAttributes(entry, attributes, [
                            ["responseStatus", "http.response.status_code"],
                            ["transferSize", "http.response_transfer_size"],
                            ["encodedBodySize", "http.response_content_length"],
                            ["decodedBodySize", "http.decoded_response_content_length"],
                            ["renderBlockingStatus", "resource.render_blocking_status"],
                            ["deliveryType", "http.response_delivery_type"],
                        ]));
                    let attributesWithResourceTiming = { ...attributes, ...resourceTiming.resourceTimingToSpanAttributes(entry) },
                        startTimestamp = timeOrigin + startTime;
                    utils.startAndEndSpan(span, startTimestamp, startTimestamp + duration, {
                        name: resourceUrl.replace(types.WINDOW.location.origin, ""),
                        op,
                        attributes: attributesWithResourceTiming,
                    });
                }
                function _setResourceRequestAttributes(entry, attributes, properties) {
                    properties.forEach(([entryKey, attributeKey]) => {
                        let entryVal = entry[entryKey];
                        null != entryVal && (("number" == typeof entryVal && entryVal < 0x7fffffff) || "string" == typeof entryVal) && (attributes[attributeKey] = entryVal);
                    });
                }
                ((exports._addMeasureSpans = _addMeasureSpans),
                    (exports._addNavigationSpans = _addNavigationSpans),
                    (exports._addResourceSpans = _addResourceSpans),
                    (exports._setResourceRequestAttributes = _setResourceRequestAttributes),
                    (exports.addPerformanceEntries = function (span, options) {
                        let performance1 = utils.getBrowserPerformanceAPI(),
                            origin = core.browserPerformanceTimeOrigin();
                        if (!performance1?.getEntries || !origin) return;
                        let { spanStreamingEnabled, ignorePerformanceApiSpans, ignoreResourceSpans, recordClsOnPageloadSpan, recordLcpOnPageloadSpan } = options,
                            timeOrigin = utils.msToSec(origin),
                            performanceEntries = performance1.getEntries(),
                            { op, start_timestamp: transactionStartTime } = core.spanToJSON(span);
                        if (
                            (performanceEntries.slice(_performanceCursor).forEach((entry) => {
                                let startTime = utils.msToSec(entry.startTime),
                                    duration = utils.msToSec(Math.max(0, entry.duration));
                                if ("navigation" !== op || !transactionStartTime || !(timeOrigin + startTime < transactionStartTime))
                                    switch (entry.entryType) {
                                        case "navigation":
                                            _addNavigationSpans(span, entry, timeOrigin);
                                            break;
                                        case "mark":
                                        case "paint":
                                        case "measure": {
                                            _addMeasureSpans(span, entry, startTime, duration, timeOrigin, ignorePerformanceApiSpans);
                                            let firstHidden = getVisibilityWatcher.getVisibilityWatcher(),
                                                shouldRecord = entry.startTime < firstHidden.firstHiddenTime;
                                            ("first-paint" === entry.name && shouldRecord && (_measurements.fp = { value: entry.startTime, unit: "millisecond" }),
                                                "first-contentful-paint" === entry.name && shouldRecord && (_measurements.fcp = { value: entry.startTime, unit: "millisecond" }));
                                            break;
                                        }
                                        case "resource":
                                            _addResourceSpans(span, entry, entry.name, startTime, duration, timeOrigin, ignoreResourceSpans);
                                    }
                            }),
                            (_performanceCursor = Math.max(performanceEntries.length - 1, 0)),
                            (function (span, spanStreamingEnabled) {
                                let navigator1 = types.WINDOW.navigator;
                                if (!navigator1) return;
                                let connection = navigator1.connection;
                                (connection &&
                                    (connection.effectiveType &&
                                        span.setAttribute(spanStreamingEnabled ? "network.connection.effective_type" : "effectiveConnectionType", connection.effectiveType),
                                    connection.type && span.setAttribute(spanStreamingEnabled ? "network.connection.type" : "connectionType", connection.type),
                                    utils.isMeasurementValue(connection.rtt) &&
                                        ((_measurements["connection.rtt"] = { value: connection.rtt, unit: "millisecond" }),
                                        spanStreamingEnabled && span.setAttribute("network.connection.rtt", connection.rtt))),
                                    utils.isMeasurementValue(navigator1.deviceMemory) &&
                                        (spanStreamingEnabled
                                            ? span.setAttribute("device.memory.estimated_capacity", navigator1.deviceMemory)
                                            : span.setAttribute("deviceMemory", `${navigator1.deviceMemory} GB`)),
                                    utils.isMeasurementValue(navigator1.hardwareConcurrency) &&
                                        (spanStreamingEnabled
                                            ? span.setAttribute("device.processor_count", navigator1.hardwareConcurrency)
                                            : span.setAttribute("hardwareConcurrency", String(navigator1.hardwareConcurrency))));
                            })(span, spanStreamingEnabled),
                            "pageload" === op)
                        ) {
                            if (
                                ((function (_measurements) {
                                    let navEntry = getNavigationEntry.getNavigationEntry(!1);
                                    if (!navEntry) return;
                                    let { responseStart, requestStart } = navEntry;
                                    requestStart <= responseStart && (_measurements["ttfb.requestTime"] = { value: responseStart - requestStart, unit: "millisecond" });
                                })(_measurements),
                                spanStreamingEnabled)
                            ) {
                                let setAttr = (shortWebVitalName, value, customAttrName) => {
                                    let attrKey = customAttrName ?? `browser.web_vital.${shortWebVitalName}.value`;
                                    (span.setAttribute(attrKey, value),
                                        debugBuild.DEBUG_BUILD && core.debug.log("Setting web vital attribute", { [attrKey]: value }, "on pageload span"));
                                };
                                (["ttfb", "fp", "fcp"].forEach((measurementName) => {
                                    _measurements[measurementName] && setAttr(measurementName, _measurements[measurementName].value);
                                }),
                                    _measurements["ttfb.requestTime"] &&
                                        setAttr("ttfb.requestTime", _measurements["ttfb.requestTime"].value, "browser.web_vital.ttfb.request_time"));
                            } else {
                                var span1, options1;
                                (recordClsOnPageloadSpan || delete _measurements.cls,
                                    recordLcpOnPageloadSpan || delete _measurements.lcp,
                                    Object.entries(_measurements).forEach(([measurementName, measurement]) => {
                                        core.setMeasurement(measurementName, measurement.value, measurement.unit);
                                    }),
                                    (span1 = span),
                                    (options1 = options),
                                    _lcpEntry &&
                                        options1.recordLcpOnPageloadSpan &&
                                        (_lcpEntry.element && span1.setAttribute("lcp.element", core.htmlTreeAsString(_lcpEntry.element)),
                                        _lcpEntry.id && span1.setAttribute("lcp.id", _lcpEntry.id),
                                        _lcpEntry.url && span1.setAttribute("lcp.url", _lcpEntry.url.trim().slice(0, 200)),
                                        null != _lcpEntry.loadTime && span1.setAttribute("lcp.loadTime", _lcpEntry.loadTime),
                                        null != _lcpEntry.renderTime && span1.setAttribute("lcp.renderTime", _lcpEntry.renderTime),
                                        span1.setAttribute("lcp.size", _lcpEntry.size)),
                                    _clsEntry?.sources &&
                                        options1.recordClsOnPageloadSpan &&
                                        _clsEntry.sources.forEach((source, index) => span1.setAttribute(`cls.source.${index + 1}`, core.htmlTreeAsString(source.node))));
                            }
                            (span.setAttribute(spanStreamingEnabled ? "browser.performance.time_origin" : "performance.timeOrigin", timeOrigin),
                                span.setAttribute(
                                    spanStreamingEnabled ? "browser.performance.navigation.activation_start" : "performance.activationStart",
                                    getActivationStart.getActivationStart(),
                                ));
                        }
                        ((_lcpEntry = void 0), (_clsEntry = void 0), (_measurements = {}));
                    }),
                    (exports.startTrackingInteractions = function () {
                        instrument.addPerformanceInstrumentationHandler("event", ({ entries }) => {
                            let parent = core.getActiveSpan();
                            if (parent) {
                                for (let entry of entries)
                                    if ("click" === entry.name) {
                                        let startTime = utils.msToSec(core.browserPerformanceTimeOrigin() + entry.startTime),
                                            duration = utils.msToSec(entry.duration),
                                            spanOptions = {
                                                name: core.htmlTreeAsString(entry.target),
                                                op: `ui.interaction.${entry.name}`,
                                                startTime: startTime,
                                                attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics" },
                                            },
                                            componentName = core.getComponentName(entry.target);
                                        (componentName && (spanOptions.attributes["ui.component_name"] = componentName),
                                            utils.startAndEndSpan(parent, startTime, startTime + duration, spanOptions));
                                    }
                            }
                        });
                    }),
                    (exports.startTrackingLongAnimationFrames = function () {
                        new PerformanceObserver((list) => {
                            let parent = core.getActiveSpan();
                            if (parent)
                                for (let entry of list.getEntries()) {
                                    if (!entry.scripts[0]) continue;
                                    let startTime = utils.msToSec(core.browserPerformanceTimeOrigin() + entry.startTime),
                                        { start_timestamp: parentStartTimestamp, op: parentOp } = core.spanToJSON(parent);
                                    if ("navigation" === parentOp && parentStartTimestamp && startTime < parentStartTimestamp) continue;
                                    let duration = utils.msToSec(entry.duration),
                                        attributes = { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics" },
                                        { invoker, invokerType, sourceURL, sourceFunctionName, sourceCharPosition } = entry.scripts[0];
                                    ((attributes["browser.script.invoker"] = invoker),
                                        (attributes["browser.script.invoker_type"] = invokerType),
                                        sourceURL && (attributes["code.filepath"] = sourceURL),
                                        sourceFunctionName && (attributes["code.function"] = sourceFunctionName),
                                        -1 !== sourceCharPosition && (attributes["browser.script.source_char_position"] = sourceCharPosition),
                                        utils.startAndEndSpan(parent, startTime, startTime + duration, {
                                            name: "Main UI thread blocked",
                                            op: "ui.long-animation-frame",
                                            attributes,
                                        }));
                                }
                        }).observe({ type: "long-animation-frame", buffered: !0 });
                    }),
                    (exports.startTrackingLongTasks = function () {
                        instrument.addPerformanceInstrumentationHandler("longtask", ({ entries }) => {
                            let parent = core.getActiveSpan();
                            if (!parent) return;
                            let { op: parentOp, start_timestamp: parentStartTimestamp } = core.spanToJSON(parent);
                            for (let entry of entries) {
                                let startTime = utils.msToSec(core.browserPerformanceTimeOrigin() + entry.startTime),
                                    duration = utils.msToSec(entry.duration);
                                ("navigation" === parentOp && parentStartTimestamp && startTime < parentStartTimestamp) ||
                                    utils.startAndEndSpan(parent, startTime, startTime + duration, {
                                        name: "Main UI thread blocked",
                                        op: "ui.long-task",
                                        attributes: { [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ui.browser.metrics" },
                                    });
                            }
                        });
                    }),
                    (exports.startTrackingWebVitals = function ({ recordClsStandaloneSpans, recordLcpStandaloneSpans, client }) {
                        let performance1 = utils.getBrowserPerformanceAPI();
                        if (performance1 && core.browserPerformanceTimeOrigin()) {
                            performance1.mark && types.WINDOW.performance.mark("sentry-tracing-init");
                            let lcpCleanupCallback = recordLcpStandaloneSpans
                                    ? lcp.trackLcpAsStandaloneSpan(client)
                                    : !1 === recordLcpStandaloneSpans
                                      ? instrument.addLcpInstrumentationHandler(({ metric }) => {
                                            let entry = metric.entries[metric.entries.length - 1];
                                            entry &&
                                                lcp.isValidLcpMetric(metric.value) &&
                                                ((_measurements.lcp = { value: metric.value, unit: "millisecond" }), (_lcpEntry = entry));
                                        }, !0)
                                      : void 0,
                                clsCleanupCallback = recordClsStandaloneSpans
                                    ? cls.trackClsAsStandaloneSpan(client)
                                    : !1 === recordClsStandaloneSpans
                                      ? instrument.addClsInstrumentationHandler(({ metric }) => {
                                            let entry = metric.entries[metric.entries.length - 1];
                                            entry && ((_measurements.cls = { value: metric.value, unit: "" }), (_clsEntry = entry));
                                        }, !0)
                                      : void 0,
                                ttfbCleanupCallback = instrument.addTtfbInstrumentationHandler(({ metric }) => {
                                    metric.entries[metric.entries.length - 1] && (_measurements.ttfb = { value: metric.value, unit: "millisecond" });
                                });
                            return () => {
                                (ttfbCleanupCallback(), lcpCleanupCallback?.(), clsCleanupCallback?.());
                            };
                        }
                        return () => void 0;
                    }));
            }