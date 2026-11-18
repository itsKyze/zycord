9903(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    debugBuild = __webpack_require__(7734);
                function _parseCookieHeaders(cookieHeader, obj) {
                    var headers;
                    let result,
                        cookies,
                        headers1 =
                            ((headers = obj.headers),
                            (result = {}),
                            headers.forEach((value, key) => {
                                result[key] = value;
                            }),
                            result);
                    try {
                        let cookieString = headers1[cookieHeader] || headers1[cookieHeader.toLowerCase()] || void 0;
                        cookieString && (cookies = _parseCookieString(cookieString));
                    } catch {}
                    return [headers1, cookies];
                }
                function _parseCookieString(cookieString) {
                    return cookieString.split("; ").reduce((acc, cookie) => {
                        let [key, value] = cookie.split("=");
                        return (key && value && (acc[key] = value), acc);
                    }, {});
                }
                function _shouldCaptureResponse(options, status, url) {
                    var failedRequestStatusCodes, failedRequestTargets;
                    return (
                        (failedRequestStatusCodes = options.failedRequestStatusCodes),
                        failedRequestStatusCodes.some((range) => ("number" == typeof range ? range === status : status >= range[0] && status <= range[1])) &&
                            ((failedRequestTargets = options.failedRequestTargets),
                            failedRequestTargets.some((givenRequestTarget) =>
                                "string" == typeof givenRequestTarget ? url.includes(givenRequestTarget) : givenRequestTarget.test(url),
                            )) &&
                            !core.isSentryRequestUrl(url, core.getClient())
                    );
                }
                function _createEvent(data) {
                    let client = core.getClient(),
                        virtualStackTrace = client && data.error && data.error instanceof Error ? data.error.stack : void 0,
                        stack = virtualStackTrace && client ? client.getOptions().stackParser(virtualStackTrace, 0, 1) : void 0,
                        message = `HTTP Client Error with status code: ${data.status}`,
                        event = {
                            message,
                            exception: { values: [{ type: "Error", value: message, stacktrace: stack ? { frames: stack } : void 0 }] },
                            request: { url: data.url, method: data.method, headers: data.requestHeaders, cookies: data.requestCookies },
                            contexts: {
                                response: {
                                    status_code: data.status,
                                    headers: data.responseHeaders,
                                    cookies: data.responseCookies,
                                    body_size: (function (headers) {
                                        if (headers) {
                                            let contentLength = headers["Content-Length"] || headers["content-length"];
                                            if (contentLength) return parseInt(contentLength, 10);
                                        }
                                    })(data.responseHeaders),
                                },
                            },
                        };
                    return (core.addExceptionMechanism(event, { type: `auto.http.client.${data.type}`, handled: !1 }), event);
                }
                function _shouldSendDefaultPii() {
                    let client = core.getClient();
                    return !!client && !!client.getOptions().sendDefaultPii;
                }
                exports.httpClientIntegration = core.defineIntegration((options = {}) => {
                    let _options = { failedRequestStatusCodes: [[500, 599]], failedRequestTargets: [/.*/], ...options };
                    return {
                        name: "HttpClient",
                        setup(client) {
                            var client1, options, client2, options1;
                            ((client1 = client),
                                (options = _options),
                                core.supportsNativeFetch() &&
                                    core.addFetchInstrumentationHandler((handlerData) => {
                                        if (core.getClient() !== client1) return;
                                        let { response, args, error, virtualError } = handlerData,
                                            [requestInfo, requestInit] = args;
                                        response &&
                                            (function (options, requestInfo, response, requestInit, error) {
                                                if (_shouldCaptureResponse(options, response.status, response.url)) {
                                                    var requestInfo1, requestInit1;
                                                    let requestHeaders,
                                                        responseHeaders,
                                                        requestCookies,
                                                        responseCookies,
                                                        request =
                                                            ((requestInfo1 = requestInfo),
                                                            (!(requestInit1 = requestInit) && requestInfo1 instanceof Request) ||
                                                            (requestInfo1 instanceof Request && requestInfo1.bodyUsed)
                                                                ? requestInfo1
                                                                : new Request(requestInfo1, requestInit1));
                                                    _shouldSendDefaultPii() &&
                                                        (([requestHeaders, requestCookies] = _parseCookieHeaders("Cookie", request)),
                                                        ([responseHeaders, responseCookies] = _parseCookieHeaders("Set-Cookie", response)));
                                                    let event = _createEvent({
                                                        url: request.url,
                                                        method: request.method,
                                                        status: response.status,
                                                        requestHeaders,
                                                        responseHeaders,
                                                        requestCookies,
                                                        responseCookies,
                                                        error,
                                                        type: "fetch",
                                                    });
                                                    core.captureEvent(event);
                                                }
                                            })(options, requestInfo, response, requestInit, error || virtualError);
                                    }, !1),
                                (client2 = client),
                                (options1 = _options),
                                "XMLHttpRequest" in core.GLOBAL_OBJ &&
                                    browserUtils.addXhrInstrumentationHandler((handlerData) => {
                                        if (core.getClient() !== client2) return;
                                        let { error, virtualError } = handlerData,
                                            xhr = handlerData.xhr,
                                            sentryXhrData = xhr[browserUtils.SENTRY_XHR_DATA_KEY];
                                        if (!sentryXhrData) return;
                                        let { method, request_headers: headers } = sentryXhrData;
                                        try {
                                            !(function (options, xhr, method, headers, error) {
                                                if (_shouldCaptureResponse(options, xhr.status, xhr.responseURL)) {
                                                    let requestHeaders, responseCookies, responseHeaders;
                                                    if (_shouldSendDefaultPii()) {
                                                        try {
                                                            let cookieString = xhr.getResponseHeader("Set-Cookie") || xhr.getResponseHeader("set-cookie") || void 0;
                                                            cookieString && (responseCookies = _parseCookieString(cookieString));
                                                        } catch {}
                                                        try {
                                                            let headers;
                                                            responseHeaders = (headers = xhr.getAllResponseHeaders())
                                                                ? headers.split("\r\n").reduce((acc, line) => {
                                                                      let [key, value] = line.split(": ");
                                                                      return (key && value && (acc[key] = value), acc);
                                                                  }, {})
                                                                : {};
                                                        } catch {}
                                                        requestHeaders = headers;
                                                    }
                                                    let event = _createEvent({
                                                        url: xhr.responseURL,
                                                        method,
                                                        status: xhr.status,
                                                        requestHeaders,
                                                        responseHeaders,
                                                        responseCookies,
                                                        error,
                                                        type: "xhr",
                                                    });
                                                    core.captureEvent(event);
                                                }
                                            })(options1, xhr, method, headers, error || virtualError);
                                        } catch (e) {
                                            debugBuild.DEBUG_BUILD && core.debug.warn("Error while extracting response event form XHR response", e);
                                        }
                                    }));
                        },
                    };
                });
            }