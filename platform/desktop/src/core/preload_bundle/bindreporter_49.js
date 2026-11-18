49(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.bindReporter = (callback, metric, thresholds, reportAllChanges) => {
                        let prevValue, delta;
                        return (forceReport) => {
                            if (metric.value >= 0 && (forceReport || reportAllChanges) && ((delta = metric.value - (prevValue ?? 0)) || void 0 === prevValue)) {
                                var value;
                                ((prevValue = metric.value),
                                    (metric.delta = delta),
                                    (value = metric.value),
                                    (metric.rating = value > thresholds[1] ? "poor" : value > thresholds[0] ? "needs-improvement" : "good"),
                                    callback(metric));
                            }
                        };
                    }));
            }