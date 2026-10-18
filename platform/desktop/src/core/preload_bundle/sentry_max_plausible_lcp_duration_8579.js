8579(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    instrument = __webpack_require__(6811),
                    utils = __webpack_require__(8933);
                function isValidLcpMetric(lcpValue) {
                    return null != lcpValue && lcpValue > 0 && lcpValue <= 6e4;
                }
                function _sendStandaloneLcpSpan(lcpValue, entry, pageloadSpanId, reportEvent) {
                    if (!isValidLcpMetric(lcpValue)) return;
                    debugBuild.DEBUG_BUILD && core.debug.log(`Sending LCP span (${lcpValue})`);
                    let startTime = utils.msToSec((core.browserPerformanceTimeOrigin() || 0) + (entry?.startTime || 0)),
                        routeName = core.getCurrentScope().getScopeData().transactionName,
                        name = entry ? core.htmlTreeAsString(entry.element) : "Largest contentful paint",
                        attributes = {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser.lcp",
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "ui.webvital.lcp",
                            [core.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: 0,
                            "sentry.pageload.span_id": pageloadSpanId,
                            "sentry.report_event": reportEvent,
                        };
                    entry &&
                        (entry.element && (attributes["lcp.element"] = core.htmlTreeAsString(entry.element)),
                        entry.id && (attributes["lcp.id"] = entry.id),
                        entry.url && (attributes["lcp.url"] = entry.url),
                        null != entry.loadTime && (attributes["lcp.loadTime"] = entry.loadTime),
                        null != entry.renderTime && (attributes["lcp.renderTime"] = entry.renderTime),
                        null != entry.size && (attributes["lcp.size"] = entry.size));
                    let span = utils.startStandaloneWebVitalSpan({ name, transaction: routeName, attributes, startTime });
                    span &&
                        (span.addEvent("lcp", { [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT]: "millisecond", [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE]: lcpValue }),
                        span.end(startTime));
                }
                ((exports.MAX_PLAUSIBLE_LCP_DURATION = 6e4),
                    (exports._sendStandaloneLcpSpan = _sendStandaloneLcpSpan),
                    (exports.isValidLcpMetric = isValidLcpMetric),
                    (exports.trackLcpAsStandaloneSpan = function (client) {
                        let standaloneLcpEntry,
                            standaloneLcpValue = 0;
                        if (!utils.supportsWebVital("largest-contentful-paint")) return;
                        let cleanupLcpHandler = instrument.addLcpInstrumentationHandler(({ metric }) => {
                            let entry = metric.entries[metric.entries.length - 1];
                            entry && isValidLcpMetric(metric.value) && ((standaloneLcpValue = metric.value), (standaloneLcpEntry = entry));
                        }, !0);
                        utils.listenForWebVitalReportEvents(client, (reportEvent, pageloadSpanId) => {
                            (_sendStandaloneLcpSpan(standaloneLcpValue, standaloneLcpEntry, pageloadSpanId, reportEvent), cleanupLcpHandler());
                        });
                    }));
            }