8204(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let bindReporter = __webpack_require__(49),
                    getActivationStart = __webpack_require__(5251),
                    getVisibilityWatcher = __webpack_require__(6723),
                    globalListeners = __webpack_require__(3903),
                    initMetric = __webpack_require__(4013),
                    initUnique = __webpack_require__(7754),
                    LCPEntryManager = __webpack_require__(5859),
                    observe = __webpack_require__(655),
                    runOnce = __webpack_require__(9863),
                    whenActivated = __webpack_require__(2115),
                    whenIdleOrHidden = __webpack_require__(6496),
                    LCPThresholds = [2500, 4e3];
                ((exports.LCPThresholds = LCPThresholds),
                    (exports.onLCP = (onReport, opts = {}) => {
                        whenActivated.whenActivated(() => {
                            let report,
                                visibilityWatcher = getVisibilityWatcher.getVisibilityWatcher(),
                                metric = initMetric.initMetric("LCP"),
                                lcpEntryManager = initUnique.initUnique(opts, LCPEntryManager.LCPEntryManager),
                                handleEntries = (entries) => {
                                    for (let entry of (opts.reportAllChanges || (entries = entries.slice(-1)), entries))
                                        (lcpEntryManager._processEntry(entry),
                                            entry.startTime < visibilityWatcher.firstHiddenTime &&
                                                ((metric.value = Math.max(entry.startTime - getActivationStart.getActivationStart(), 0)), (metric.entries = [entry]), report()));
                                },
                                po = observe.observe("largest-contentful-paint", handleEntries);
                            if (po) {
                                report = bindReporter.bindReporter(onReport, metric, LCPThresholds, opts.reportAllChanges);
                                let stopListening = runOnce.runOnce(() => {
                                        (handleEntries(po.takeRecords()), po.disconnect(), report(!0));
                                    }),
                                    stopListeningWrapper = (event) => {
                                        event.isTrusted &&
                                            (whenIdleOrHidden.whenIdleOrHidden(stopListening),
                                            globalListeners.removePageListener(event.type, stopListeningWrapper, { capture: !0 }));
                                    };
                                for (let type of ["keydown", "click", "visibilitychange"]) globalListeners.addPageListener(type, stopListeningWrapper, { capture: !0 });
                            }
                        });
                    }));
            }