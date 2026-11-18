602(__unused_rspack_module, exports, __webpack_require__) {
                let _cachedTimestampInSeconds;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let randomSafeContext = __webpack_require__(638),
                    worldwide = __webpack_require__(3712);
                function dateTimestampInSeconds() {
                    return randomSafeContext.safeDateNow() / 1e3;
                }
                let cachedTimeOrigin = null;
                ((exports.browserPerformanceTimeOrigin = function () {
                    return (
                        null === cachedTimeOrigin &&
                            (cachedTimeOrigin = (function () {
                                let { performance: performance1 } = worldwide.GLOBAL_OBJ;
                                if (!performance1?.now) return;
                                let performanceNow = randomSafeContext.withRandomSafeContext(() => performance1.now()),
                                    dateNow = randomSafeContext.safeDateNow(),
                                    timeOrigin = performance1.timeOrigin;
                                if ("number" == typeof timeOrigin && 3e5 > Math.abs(timeOrigin + performanceNow - dateNow)) return timeOrigin;
                                let navigationStart = performance1.timing?.navigationStart;
                                return "number" == typeof navigationStart && 3e5 > Math.abs(navigationStart + performanceNow - dateNow)
                                    ? navigationStart
                                    : dateNow - performanceNow;
                            })()),
                        cachedTimeOrigin
                    );
                }),
                    (exports.dateTimestampInSeconds = dateTimestampInSeconds),
                    (exports.timestampInSeconds = function () {
                        return (
                            _cachedTimestampInSeconds ??
                            (_cachedTimestampInSeconds = (function () {
                                let { performance: performance1 } = worldwide.GLOBAL_OBJ;
                                if (!performance1?.now || !performance1.timeOrigin) return dateTimestampInSeconds;
                                let timeOrigin = performance1.timeOrigin;
                                return () => (timeOrigin + randomSafeContext.withRandomSafeContext(() => performance1.now())) / 1e3;
                            })())
                        )();
                    }));
            }