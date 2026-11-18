8123(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    bindReporter = __webpack_require__(49),
                    getVisibilityWatcher = __webpack_require__(6723),
                    initMetric = __webpack_require__(4013),
                    initUnique = __webpack_require__(7754),
                    LayoutShiftManager = __webpack_require__(2946),
                    observe = __webpack_require__(655),
                    runOnce = __webpack_require__(9863),
                    onFCP = __webpack_require__(2213),
                    CLSThresholds = [0.1, 0.25];
                ((exports.CLSThresholds = CLSThresholds),
                    (exports.onCLS = (onReport, opts = {}) => {
                        onFCP.onFCP(
                            runOnce.runOnce(() => {
                                let report,
                                    metric = initMetric.initMetric("CLS", 0),
                                    visibilityWatcher = getVisibilityWatcher.getVisibilityWatcher(),
                                    layoutShiftManager = initUnique.initUnique(opts, LayoutShiftManager.LayoutShiftManager),
                                    handleEntries = (entries) => {
                                        for (let entry of entries) layoutShiftManager._processEntry(entry);
                                        layoutShiftManager._sessionValue > metric.value &&
                                            ((metric.value = layoutShiftManager._sessionValue), (metric.entries = layoutShiftManager._sessionEntries), report());
                                    },
                                    po = observe.observe("layout-shift", handleEntries);
                                po &&
                                    ((report = bindReporter.bindReporter(onReport, metric, CLSThresholds, opts.reportAllChanges)),
                                    visibilityWatcher.onHidden(() => {
                                        (handleEntries(po.takeRecords()), report(!0));
                                    }),
                                    types.WINDOW?.setTimeout?.(report));
                            }),
                        );
                    }));
            }