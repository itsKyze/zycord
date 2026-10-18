2213(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let bindReporter = __webpack_require__(49),
                    getActivationStart = __webpack_require__(5251),
                    getVisibilityWatcher = __webpack_require__(6723),
                    initMetric = __webpack_require__(4013),
                    observe = __webpack_require__(655),
                    whenActivated = __webpack_require__(2115),
                    FCPThresholds = [1800, 3e3];
                ((exports.FCPThresholds = FCPThresholds),
                    (exports.onFCP = (onReport, opts = {}) => {
                        whenActivated.whenActivated(() => {
                            let report,
                                visibilityWatcher = getVisibilityWatcher.getVisibilityWatcher(),
                                metric = initMetric.initMetric("FCP"),
                                po = observe.observe("paint", (entries) => {
                                    for (let entry of entries)
                                        "first-contentful-paint" === entry.name &&
                                            (po.disconnect(),
                                            entry.startTime < visibilityWatcher.firstHiddenTime &&
                                                ((metric.value = Math.max(entry.startTime - getActivationStart.getActivationStart(), 0)), metric.entries.push(entry), report(!0)));
                                });
                            po && (report = bindReporter.bindReporter(onReport, metric, FCPThresholds, opts.reportAllChanges));
                        });
                    }));
            }