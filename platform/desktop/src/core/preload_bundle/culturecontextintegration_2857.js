2857(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445);
                function getCultureContext() {
                    try {
                        let intl = helpers.WINDOW.Intl;
                        if (!intl) return;
                        let options = intl.DateTimeFormat().resolvedOptions();
                        return { locale: options.locale, timezone: options.timeZone, calendar: options.calendar };
                    } catch {
                        return;
                    }
                }
                exports.cultureContextIntegration = core.defineIntegration(() => ({
                    name: "CultureContext",
                    preprocessEvent(event) {
                        let culture = getCultureContext();
                        culture && (event.contexts = { ...event.contexts, culture: { ...culture, ...event.contexts?.culture } });
                    },
                    processSegmentSpan(span) {
                        let culture = getCultureContext();
                        culture &&
                            (span.attributes = {
                                "culture.locale": culture.locale,
                                "culture.timezone": culture.timezone,
                                "culture.calendar": culture.calendar,
                                ...span.attributes,
                            });
                    },
                }));
            }