4601(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863),
                    instrument = __webpack_require__(6811),
                    utils = __webpack_require__(8933),
                    LAST_INTERACTIONS = [],
                    INTERACTIONS_SPAN_MAP = new Map(),
                    ELEMENT_NAME_TIMESTAMP_MAP = new Map(),
                    INP_ENTRY_MAP = {
                        click: "click",
                        pointerdown: "click",
                        pointerup: "click",
                        mousedown: "click",
                        mouseup: "click",
                        touchstart: "click",
                        touchend: "click",
                        mouseover: "hover",
                        mouseout: "hover",
                        mouseenter: "hover",
                        mouseleave: "hover",
                        pointerover: "hover",
                        pointerout: "hover",
                        pointerenter: "hover",
                        pointerleave: "hover",
                        dragstart: "drag",
                        dragend: "drag",
                        drag: "drag",
                        dragenter: "drag",
                        dragleave: "drag",
                        dragover: "drag",
                        drop: "drag",
                        keydown: "press",
                        keyup: "press",
                        keypress: "press",
                        input: "press",
                    };
                function _trackINP() {
                    return instrument.addInpInstrumentationHandler(_onInp);
                }
                let _onInp = ({ metric }) => {
                    if (void 0 == metric.value) return;
                    let duration = utils.msToSec(metric.value);
                    if (duration > 60) return;
                    let entry = metric.entries.find((entry) => entry.duration === metric.value && INP_ENTRY_MAP[entry.name]);
                    if (!entry) return;
                    let { interactionId } = entry,
                        interactionType = INP_ENTRY_MAP[entry.name],
                        startTime = utils.msToSec(core.browserPerformanceTimeOrigin() + entry.startTime),
                        activeSpan = core.getActiveSpan(),
                        rootSpan = activeSpan ? core.getRootSpan(activeSpan) : void 0,
                        cachedInteractionContext = null != interactionId ? INTERACTIONS_SPAN_MAP.get(interactionId) : void 0,
                        spanToUse = cachedInteractionContext?.span || rootSpan,
                        routeName = spanToUse ? core.spanToJSON(spanToUse).description : core.getCurrentScope().getScopeData().transactionName,
                        name = cachedInteractionContext?.elementName || core.htmlTreeAsString(entry.target),
                        attributes = {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser.inp",
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `ui.interaction.${interactionType}`,
                            [core.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: entry.duration,
                        },
                        span = utils.startStandaloneWebVitalSpan({ name, transaction: routeName, attributes, startTime });
                    span &&
                        (span.addEvent("inp", {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT]: "millisecond",
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE]: metric.value,
                        }),
                        span.end(startTime + duration));
                };
                ((exports.INP_ENTRY_MAP = INP_ENTRY_MAP),
                    (exports.MAX_PLAUSIBLE_INP_DURATION = 60),
                    (exports._onInp = _onInp),
                    (exports._trackINP = _trackINP),
                    (exports.getCachedInteractionContext = function (interactionId) {
                        return null != interactionId ? INTERACTIONS_SPAN_MAP.get(interactionId) : void 0;
                    }),
                    (exports.registerInpInteractionListener = function () {
                        let interactionEvents = Object.keys(INP_ENTRY_MAP);
                        function captureElementFromEvent(event) {
                            let target = event.target;
                            if (!target) return;
                            let elementName = core.htmlTreeAsString(target),
                                timestamp = Math.round(event.timeStamp);
                            if ((ELEMENT_NAME_TIMESTAMP_MAP.set(timestamp, elementName), ELEMENT_NAME_TIMESTAMP_MAP.size > 50)) {
                                let firstKey = ELEMENT_NAME_TIMESTAMP_MAP.keys().next().value;
                                void 0 !== firstKey && ELEMENT_NAME_TIMESTAMP_MAP.delete(firstKey);
                            }
                        }
                        core.isBrowser() &&
                            interactionEvents.forEach((eventType) => {
                                types.WINDOW.addEventListener(eventType, captureElementFromEvent, { capture: !0, passive: !0 });
                            });
                        let handleEntries = ({ entries }) => {
                            let activeSpan = core.getActiveSpan(),
                                activeRootSpan = activeSpan && core.getRootSpan(activeSpan);
                            entries.forEach((entry) => {
                                if (!instrument.isPerformanceEventTiming(entry)) return;
                                let interactionId = entry.interactionId;
                                if (null == interactionId || INTERACTIONS_SPAN_MAP.has(interactionId)) return;
                                let elementName = entry.target
                                    ? core.htmlTreeAsString(entry.target)
                                    : (function (entry) {
                                          let timestamp = Math.round(entry.startTime),
                                              elementName = ELEMENT_NAME_TIMESTAMP_MAP.get(timestamp);
                                          if (!elementName)
                                              for (let offset = -5; offset <= 5; offset++) {
                                                  let nearbyName = ELEMENT_NAME_TIMESTAMP_MAP.get(timestamp + offset);
                                                  if (nearbyName) {
                                                      elementName = nearbyName;
                                                      break;
                                                  }
                                              }
                                          return elementName || "<unknown>";
                                      })(entry);
                                if (LAST_INTERACTIONS.length > 10) {
                                    let last = LAST_INTERACTIONS.shift();
                                    INTERACTIONS_SPAN_MAP.delete(last);
                                }
                                (LAST_INTERACTIONS.push(interactionId), INTERACTIONS_SPAN_MAP.set(interactionId, { span: activeRootSpan, elementName }));
                            });
                        };
                        (instrument.addPerformanceInstrumentationHandler("event", handleEntries), instrument.addPerformanceInstrumentationHandler("first-input", handleEntries));
                    }),
                    (exports.startTrackingINP = function () {
                        if (utils.getBrowserPerformanceAPI() && core.browserPerformanceTimeOrigin()) {
                            let inpCallback = _trackINP();
                            return () => {
                                inpCallback();
                            };
                        }
                        return () => void 0;
                    }));
            }