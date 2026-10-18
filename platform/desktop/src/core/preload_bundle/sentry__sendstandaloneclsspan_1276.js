1276(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    instrument = __webpack_require__(6811),
                    utils = __webpack_require__(8933);
                function _sendStandaloneClsSpan(clsValue, entry, pageloadSpanId, reportEvent) {
                    debugBuild.DEBUG_BUILD && core.debug.log(`Sending CLS span (${clsValue})`);
                    let startTime = entry ? utils.msToSec((core.browserPerformanceTimeOrigin() || 0) + entry.startTime) : core.timestampInSeconds(),
                        routeName = core.getCurrentScope().getScopeData().transactionName,
                        name = entry ? core.htmlTreeAsString(entry.sources[0]?.node) : "Layout shift",
                        attributes = {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser.cls",
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "ui.webvital.cls",
                            [core.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: 0,
                            "sentry.pageload.span_id": pageloadSpanId,
                            "sentry.report_event": reportEvent,
                        };
                    entry?.sources &&
                        entry.sources.forEach((source, index) => {
                            attributes[`cls.source.${index + 1}`] = core.htmlTreeAsString(source.node);
                        });
                    let span = utils.startStandaloneWebVitalSpan({ name, transaction: routeName, attributes, startTime });
                    span &&
                        (span.addEvent("cls", { [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT]: "", [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE]: clsValue }),
                        span.end(startTime));
                }
                ((exports._sendStandaloneClsSpan = _sendStandaloneClsSpan),
                    (exports.trackClsAsStandaloneSpan = function (client) {
                        let standaloneClsEntry,
                            standaloneCLsValue = 0;
                        if (!utils.supportsWebVital("layout-shift")) return;
                        let cleanupClsHandler = instrument.addClsInstrumentationHandler(({ metric }) => {
                            let entry = metric.entries[metric.entries.length - 1];
                            entry && ((standaloneCLsValue = metric.value), (standaloneClsEntry = entry));
                        }, !0);
                        utils.listenForWebVitalReportEvents(client, (reportEvent, pageloadSpanId) => {
                            (_sendStandaloneClsSpan(standaloneCLsValue, standaloneClsEntry, pageloadSpanId, reportEvent), cleanupClsHandler());
                        });
                    }));
            }