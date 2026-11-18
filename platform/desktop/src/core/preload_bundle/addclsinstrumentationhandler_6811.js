6811(__unused_rspack_module, exports, __webpack_require__) {
                let _previousCls, _previousLcp, _previousTtfb, _previousInp;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    getCLS = __webpack_require__(8123),
                    getINP = __webpack_require__(6334),
                    getLCP = __webpack_require__(8204),
                    observe = __webpack_require__(655),
                    onTTFB = __webpack_require__(4122),
                    handlers = {},
                    instrumented = {};
                function triggerHandlers(type, data) {
                    let typeHandlers = handlers[type];
                    if (typeHandlers?.length)
                        for (let handler of typeHandlers)
                            try {
                                handler(data);
                            } catch (e) {
                                debugBuild.DEBUG_BUILD &&
                                    core.debug.error(
                                        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${core.getFunctionName(handler)}
Error:`,
                                        e,
                                    );
                            }
                }
                function instrumentCls() {
                    return getCLS.onCLS(
                        (metric) => {
                            (triggerHandlers("cls", { metric }), (_previousCls = metric));
                        },
                        { reportAllChanges: !0 },
                    );
                }
                function instrumentLcp() {
                    return getLCP.onLCP(
                        (metric) => {
                            (triggerHandlers("lcp", { metric }), (_previousLcp = metric));
                        },
                        { reportAllChanges: !0 },
                    );
                }
                function instrumentTtfb() {
                    return onTTFB.onTTFB((metric) => {
                        (triggerHandlers("ttfb", { metric }), (_previousTtfb = metric));
                    });
                }
                function instrumentInp() {
                    return getINP.onINP((metric) => {
                        (triggerHandlers("inp", { metric }), (_previousInp = metric));
                    });
                }
                function addMetricObserver(type, callback, instrumentFn, previousValue, stopOnCallback = !1) {
                    let stopListening;
                    return (
                        addHandler(type, callback),
                        instrumented[type] || ((stopListening = instrumentFn()), (instrumented[type] = !0)),
                        previousValue && callback({ metric: previousValue }),
                        getCleanupCallback(type, callback, stopOnCallback ? stopListening : void 0)
                    );
                }
                function addHandler(type, handler) {
                    ((handlers[type] = handlers[type] || []), handlers[type].push(handler));
                }
                function getCleanupCallback(type, callback, stopListening) {
                    return () => {
                        stopListening && stopListening();
                        let typeHandlers = handlers[type];
                        if (!typeHandlers) return;
                        let index = typeHandlers.indexOf(callback);
                        -1 !== index && typeHandlers.splice(index, 1);
                    };
                }
                ((exports.addClsInstrumentationHandler = function (callback, stopOnCallback = !1) {
                    return addMetricObserver("cls", callback, instrumentCls, _previousCls, stopOnCallback);
                }),
                    (exports.addInpInstrumentationHandler = function (callback) {
                        return addMetricObserver("inp", callback, instrumentInp, _previousInp);
                    }),
                    (exports.addLcpInstrumentationHandler = function (callback, stopOnCallback = !1) {
                        return addMetricObserver("lcp", callback, instrumentLcp, _previousLcp, stopOnCallback);
                    }),
                    (exports.addPerformanceInstrumentationHandler = function (type, callback) {
                        var type1;
                        let options;
                        return (
                            addHandler(type, callback),
                            instrumented[type] ||
                                ((options = {}),
                                "event" === (type1 = type) && (options.durationThreshold = 0),
                                observe.observe(
                                    type1,
                                    (entries) => {
                                        triggerHandlers(type1, { entries });
                                    },
                                    options,
                                ),
                                (instrumented[type] = !0)),
                            getCleanupCallback(type, callback)
                        );
                    }),
                    (exports.addTtfbInstrumentationHandler = function (callback) {
                        return addMetricObserver("ttfb", callback, instrumentTtfb, _previousTtfb);
                    }),
                    (exports.isPerformanceEventTiming = function (entry) {
                        return "duration" in entry;
                    }));
            }