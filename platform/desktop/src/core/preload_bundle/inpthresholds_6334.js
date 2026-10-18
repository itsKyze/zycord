6334(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let bindReporter = __webpack_require__(49),
                    getVisibilityWatcher = __webpack_require__(6723),
                    initMetric = __webpack_require__(4013),
                    initUnique = __webpack_require__(7754),
                    InteractionManager = __webpack_require__(0),
                    observe = __webpack_require__(655),
                    interactionCountPolyfill = __webpack_require__(7818),
                    whenActivated = __webpack_require__(2115),
                    whenIdleOrHidden = __webpack_require__(6496),
                    INPThresholds = [200, 500];
                ((exports.INPThresholds = INPThresholds),
                    (exports.onINP = (onReport, opts = {}) => {
                        if (!(globalThis.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype)) return;
                        let visibilityWatcher = getVisibilityWatcher.getVisibilityWatcher();
                        whenActivated.whenActivated(() => {
                            let report;
                            interactionCountPolyfill.initInteractionCountPolyfill();
                            let metric = initMetric.initMetric("INP"),
                                interactionManager = initUnique.initUnique(opts, InteractionManager.InteractionManager),
                                handleEntries = (entries) => {
                                    whenIdleOrHidden.whenIdleOrHidden(() => {
                                        for (let entry of entries) interactionManager._processEntry(entry);
                                        let inp = interactionManager._estimateP98LongestInteraction();
                                        inp && inp._latency !== metric.value && ((metric.value = inp._latency), (metric.entries = inp.entries), report());
                                    });
                                },
                                po = observe.observe("event", handleEntries, { durationThreshold: opts.durationThreshold ?? 40 });
                            ((report = bindReporter.bindReporter(onReport, metric, INPThresholds, opts.reportAllChanges)),
                                po &&
                                    (po.observe({ type: "first-input", buffered: !0 }),
                                    visibilityWatcher.onHidden(() => {
                                        (handleEntries(po.takeRecords()), report(!0));
                                    })));
                        });
                    }));
            }