8640(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470);
                ((exports.setMeasurement = function (name, value, unit, activeSpan = spanUtils.getActiveSpan()) {
                    let rootSpan = activeSpan && spanUtils.getRootSpan(activeSpan);
                    rootSpan &&
                        (debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Measurement] Setting measurement on root span: ${name} = ${value} ${unit}`),
                        rootSpan.addEvent(name, {
                            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE]: value,
                            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT]: unit,
                        }));
                }),
                    (exports.timedEventsToMeasurements = function (events) {
                        if (!events || 0 === events.length) return;
                        let measurements = {};
                        return (
                            events.forEach((event) => {
                                let attributes = event.attributes || {},
                                    unit = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT],
                                    value = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE];
                                "string" == typeof unit && "number" == typeof value && (measurements[event.name] = { value, unit });
                            }),
                            measurements
                        );
                    }));
            }