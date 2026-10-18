8933(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863),
                    onHidden = __webpack_require__(1594);
                ((exports.extractNetworkProtocol = function (nextHopProtocol) {
                    let name = "unknown",
                        version = "unknown",
                        _name = "";
                    for (let char of nextHopProtocol) {
                        if ("/" === char) {
                            [name, version] = nextHopProtocol.split("/");
                            break;
                        }
                        if (!isNaN(Number(char))) {
                            ((name = "h" === _name ? "http" : _name), (version = nextHopProtocol.split(_name)[1]));
                            break;
                        }
                        _name += char;
                    }
                    return (_name === nextHopProtocol && (name = _name), { name, version });
                }),
                    (exports.getBrowserPerformanceAPI = function () {
                        return types.WINDOW.addEventListener && types.WINDOW.performance;
                    }),
                    (exports.isMeasurementValue = function (value) {
                        return "number" == typeof value && isFinite(value);
                    }),
                    (exports.listenForWebVitalReportEvents = function (client, collectorCallback) {
                        let pageloadSpan,
                            collected = !1;
                        function _runCollectorCallbackOnce(event) {
                            (!collected && pageloadSpan && collectorCallback(event, pageloadSpan.spanContext().spanId, pageloadSpan), (collected = !0));
                        }
                        onHidden.onHidden(() => {
                            _runCollectorCallbackOnce("pagehide");
                        });
                        let unsubscribeStartNavigation = client.on("beforeStartNavigationSpan", (_, options) => {
                                options?.isRedirect || (_runCollectorCallbackOnce("navigation"), unsubscribeStartNavigation(), unsubscribeAfterStartPageLoadSpan());
                            }),
                            unsubscribeAfterStartPageLoadSpan = client.on("afterStartPageLoadSpan", (span) => {
                                ((pageloadSpan = span), unsubscribeAfterStartPageLoadSpan());
                            });
                    }),
                    (exports.msToSec = function (time) {
                        return time / 1e3;
                    }),
                    (exports.startAndEndSpan = function (parentSpan, startTimeInSeconds, endTime, { ...ctx }) {
                        let parentStartTime = core.spanToJSON(parentSpan).start_timestamp;
                        return (
                            parentStartTime &&
                                parentStartTime > startTimeInSeconds &&
                                "function" == typeof parentSpan.updateStartTime &&
                                parentSpan.updateStartTime(startTimeInSeconds),
                            core.withActiveSpan(parentSpan, () => {
                                let span = core.startInactiveSpan({ startTime: startTimeInSeconds, ...ctx });
                                return (span && span.end(endTime), span);
                            })
                        );
                    }),
                    (exports.startStandaloneWebVitalSpan = function (options) {
                        let profileId,
                            client = core.getClient();
                        if (!client) return;
                        let { name, transaction, attributes: passedAttributes, startTime } = options,
                            { release, environment, sendDefaultPii } = client.getOptions(),
                            replay = client.getIntegrationByName("Replay"),
                            replayId = replay?.getReplayId(),
                            scope = core.getCurrentScope(),
                            user = scope.getUser(),
                            userDisplay = void 0 !== user ? user.email || user.id || user.ip_address : void 0;
                        try {
                            profileId = scope.getScopeData().contexts.profile.profile_id;
                        } catch {}
                        let attributes = {
                            release,
                            environment,
                            user: userDisplay || void 0,
                            profile_id: profileId || void 0,
                            replay_id: replayId || void 0,
                            transaction,
                            "user_agent.original": types.WINDOW.navigator?.userAgent,
                            "client.address": sendDefaultPii ? "{{auto}}" : void 0,
                            ...passedAttributes,
                        };
                        return core.startInactiveSpan({ name, attributes, startTime, experimental: { standalone: !0 } });
                    }),
                    (exports.supportsWebVital = function (entryType) {
                        try {
                            return PerformanceObserver.supportedEntryTypes.includes(entryType);
                        } catch {
                            return !1;
                        }
                    }));
            }