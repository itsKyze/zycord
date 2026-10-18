6336(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    utils = __webpack_require__(8933);
                function getAbsoluteTime(time) {
                    return time ? ((core.browserPerformanceTimeOrigin() || performance.timeOrigin) + time) / 1e3 : time;
                }
                exports.resourceTimingToSpanAttributes = function (resourceTiming) {
                    let timingSpanData = {};
                    if (void 0 != resourceTiming.nextHopProtocol) {
                        let { name, version } = utils.extractNetworkProtocol(resourceTiming.nextHopProtocol);
                        ((timingSpanData["network.protocol.version"] = version), (timingSpanData["network.protocol.name"] = name));
                    }
                    return core.browserPerformanceTimeOrigin() || utils.getBrowserPerformanceAPI()?.timeOrigin
                        ? Object.fromEntries(
                              Object.entries({
                                  ...timingSpanData,
                                  "http.request.redirect_start": getAbsoluteTime(resourceTiming.redirectStart),
                                  "http.request.redirect_end": getAbsoluteTime(resourceTiming.redirectEnd),
                                  "http.request.worker_start": getAbsoluteTime(resourceTiming.workerStart),
                                  "http.request.fetch_start": getAbsoluteTime(resourceTiming.fetchStart),
                                  "http.request.domain_lookup_start": getAbsoluteTime(resourceTiming.domainLookupStart),
                                  "http.request.domain_lookup_end": getAbsoluteTime(resourceTiming.domainLookupEnd),
                                  "http.request.connect_start": getAbsoluteTime(resourceTiming.connectStart),
                                  "http.request.secure_connection_start": getAbsoluteTime(resourceTiming.secureConnectionStart),
                                  "http.request.connection_end": getAbsoluteTime(resourceTiming.connectEnd),
                                  "http.request.request_start": getAbsoluteTime(resourceTiming.requestStart),
                                  "http.request.response_start": getAbsoluteTime(resourceTiming.responseStart),
                                  "http.request.response_end": getAbsoluteTime(resourceTiming.responseEnd),
                                  "http.request.time_to_first_byte": null != resourceTiming.responseStart ? resourceTiming.responseStart / 1e3 : void 0,
                              }).filter(([, value]) => null != value),
                          )
                        : timingSpanData;
                };
            }