4122(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    bindReporter = __webpack_require__(49),
                    getActivationStart = __webpack_require__(5251),
                    getNavigationEntry = __webpack_require__(9549),
                    initMetric = __webpack_require__(4013),
                    whenActivated = __webpack_require__(2115),
                    TTFBThresholds = [800, 1800],
                    whenReady = (callback) => {
                        types.WINDOW.document?.prerendering
                            ? whenActivated.whenActivated(() => whenReady(callback))
                            : types.WINDOW.document?.readyState !== "complete"
                              ? addEventListener("load", () => whenReady(callback), !0)
                              : setTimeout(callback);
                    };
                ((exports.TTFBThresholds = TTFBThresholds),
                    (exports.onTTFB = (onReport, opts = {}) => {
                        let metric = initMetric.initMetric("TTFB"),
                            report = bindReporter.bindReporter(onReport, metric, TTFBThresholds, opts.reportAllChanges);
                        whenReady(() => {
                            let navigationEntry = getNavigationEntry.getNavigationEntry();
                            navigationEntry &&
                                ((metric.value = Math.max(navigationEntry.responseStart - getActivationStart.getActivationStart(), 0)),
                                (metric.entries = [navigationEntry]),
                                report(!0));
                        });
                    }));
            }