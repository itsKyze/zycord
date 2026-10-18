3044(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let helpers = __webpack_require__(9445);
                ((exports.baggageHeaderHasSentryValues = function (baggageHeader) {
                    return baggageHeader.split(",").some((value) => value.trim().startsWith("sentry-"));
                }),
                    (exports.createHeadersSafely = function (headers) {
                        try {
                            return new Headers(headers);
                        } catch {
                            return;
                        }
                    }),
                    (exports.getFullURL = function (url) {
                        try {
                            return new URL(url, helpers.WINDOW.location.origin).href;
                        } catch {
                            return;
                        }
                    }),
                    (exports.isPerformanceResourceTiming = function (entry) {
                        return (
                            "resource" === entry.entryType &&
                            "initiatorType" in entry &&
                            "string" == typeof entry.nextHopProtocol &&
                            ("fetch" === entry.initiatorType || "xmlhttprequest" === entry.initiatorType)
                        );
                    }));
            }