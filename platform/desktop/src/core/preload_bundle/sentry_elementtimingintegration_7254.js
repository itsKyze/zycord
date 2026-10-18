7254(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    instrument = __webpack_require__(6811),
                    utils = __webpack_require__(8933);
                ((exports.elementTimingIntegration = core.defineIntegration(() => ({
                    name: "ElementTiming",
                    setup() {
                        utils.getBrowserPerformanceAPI() &&
                            core.browserPerformanceTimeOrigin() &&
                            instrument.addPerformanceInstrumentationHandler("element", ({ entries }) => {
                                for (let entry of entries) {
                                    if (!entry.identifier) continue;
                                    let identifier = entry.identifier,
                                        paintType = entry.name,
                                        renderTime = entry.renderTime,
                                        loadTime = entry.loadTime,
                                        metricAttributes = { "sentry.origin": "auto.ui.browser.element_timing", "ui.element.identifier": identifier };
                                    (paintType && (metricAttributes["ui.element.paint_type"] = paintType),
                                        entry.id && (metricAttributes["ui.element.id"] = entry.id),
                                        entry.element && (metricAttributes["ui.element.type"] = entry.element.tagName.toLowerCase()),
                                        entry.url && (metricAttributes["ui.element.url"] = entry.url),
                                        entry.naturalWidth && (metricAttributes["ui.element.width"] = entry.naturalWidth),
                                        entry.naturalHeight && (metricAttributes["ui.element.height"] = entry.naturalHeight),
                                        renderTime > 0 && core.metrics.distribution("ui.element.render_time", renderTime, { unit: "millisecond", attributes: metricAttributes }),
                                        loadTime > 0 && core.metrics.distribution("ui.element.load_time", loadTime, { unit: "millisecond", attributes: metricAttributes }));
                                }
                            });
                    },
                }))),
                    (exports.startTrackingElementTiming = function () {
                        return () => void 0;
                    }));
            }