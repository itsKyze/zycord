1120(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    cookie = __webpack_require__(4505),
                    getIpAddress = __webpack_require__(7705),
                    DEFAULT_INCLUDE = { cookies: !0, data: !0, headers: !0, query_string: !0, url: !0 };
                exports.requestDataIntegration = integration.defineIntegration((options = {}) => {
                    let include = { ...DEFAULT_INCLUDE, ...options.include };
                    return {
                        name: "RequestData",
                        processEvent(event, _hint, client) {
                            let { sdkProcessingMetadata = {} } = event,
                                { normalizedRequest, ipAddress } = sdkProcessingMetadata,
                                includeWithDefaultPiiApplied = { ...include, ip: include.ip ?? client.getOptions().sendDefaultPii };
                            return (
                                normalizedRequest &&
                                    (function (event, req, additionalData, include) {
                                        var normalizedRequest, include1;
                                        let requestData, headers;
                                        if (
                                            ((event.request = {
                                                ...event.request,
                                                ...((normalizedRequest = req),
                                                (include1 = include),
                                                (requestData = {}),
                                                (headers = { ...normalizedRequest.headers }),
                                                include1.headers &&
                                                    ((requestData.headers = headers),
                                                    include1.cookies || delete headers.cookie,
                                                    include1.ip ||
                                                        getIpAddress.ipHeaderNames.forEach((ipHeaderName) => {
                                                            delete headers[ipHeaderName];
                                                        })),
                                                (requestData.method = normalizedRequest.method),
                                                include1.url && (requestData.url = normalizedRequest.url),
                                                include1.cookies &&
                                                    (requestData.cookies = normalizedRequest.cookies || (headers?.cookie ? cookie.parseCookie(headers.cookie) : void 0) || {}),
                                                include1.query_string && (requestData.query_string = normalizedRequest.query_string),
                                                include1.data && (requestData.data = normalizedRequest.data),
                                                requestData),
                                            }),
                                            include.ip)
                                        ) {
                                            let ip = (req.headers && getIpAddress.getClientIPAddress(req.headers)) || additionalData.ipAddress;
                                            ip && (event.user = { ...event.user, ip_address: ip });
                                        }
                                    })(event, normalizedRequest, { ipAddress }, includeWithDefaultPiiApplied),
                                event
                            );
                        },
                    };
                });
            }