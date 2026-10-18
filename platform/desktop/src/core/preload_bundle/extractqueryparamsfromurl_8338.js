8338(__unused_rspack_module, exports) {
                function winterCGHeadersToDict(winterCGHeaders) {
                    let headers = {};
                    try {
                        winterCGHeaders.forEach((value, key) => {
                            "string" == typeof value && (headers[key] = value);
                        });
                    } catch {}
                    return headers;
                }
                function headersToDict(reqHeaders) {
                    let headers = Object.create(null);
                    try {
                        Object.entries(reqHeaders).forEach(([key, value]) => {
                            "string" == typeof value && (headers[key] = value);
                        });
                    } catch {}
                    return headers;
                }
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let SENSITIVE_HEADER_SNIPPETS = [
                        "auth",
                        "token",
                        "secret",
                        "session",
                        "password",
                        "passwd",
                        "pwd",
                        "key",
                        "jwt",
                        "bearer",
                        "sso",
                        "saml",
                        "csrf",
                        "xsrf",
                        "credentials",
                        "set-cookie",
                        "cookie",
                    ],
                    PII_HEADER_SNIPPETS = ["x-forwarded-", "-user"];
                function normalizeAttributeKey(key) {
                    return key.replace(/-/g, "_");
                }
                function addSpanAttribute(spanAttributes, headerKey, cookieKey, value, sendPii, lifecycle) {
                    var lowerCasedKey, value1;
                    let headerValue =
                        ((lowerCasedKey = cookieKey || headerKey),
                        (value1 = value),
                        (
                            sendPii
                                ? SENSITIVE_HEADER_SNIPPETS.some((snippet) => lowerCasedKey.includes(snippet))
                                : [...PII_HEADER_SNIPPETS, ...SENSITIVE_HEADER_SNIPPETS].some((snippet) => lowerCasedKey.includes(snippet))
                        )
                            ? "[Filtered]"
                            : Array.isArray(value1)
                              ? value1.map((v) => (null != v ? String(v) : v)).join(";")
                              : "string" == typeof value1
                                ? value1
                                : void 0);
                    null == headerValue ||
                        (spanAttributes[`http.${lifecycle}.header.${normalizeAttributeKey(headerKey)}${cookieKey ? `.${normalizeAttributeKey(cookieKey)}` : ""}`] = headerValue);
                }
                function extractQueryParamsFromUrl(url) {
                    if (url)
                        try {
                            let queryParams = new URL(url, "http://s.io").search.slice(1);
                            return queryParams.length ? queryParams : void 0;
                        } catch {
                            return;
                        }
                }
                ((exports.extractQueryParamsFromUrl = extractQueryParamsFromUrl),
                    (exports.headersToDict = headersToDict),
                    (exports.httpHeadersToSpanAttributes = function (headers, sendDefaultPii = !1, lifecycle = "request") {
                        let spanAttributes = {};
                        try {
                            Object.entries(headers).forEach(([key, value]) => {
                                if (null == value) return;
                                let lowerCasedHeaderKey = key.toLowerCase();
                                if (("cookie" === lowerCasedHeaderKey || "set-cookie" === lowerCasedHeaderKey) && "string" == typeof value && "" !== value) {
                                    let isSetCookie = "set-cookie" === lowerCasedHeaderKey,
                                        semicolonIndex = value.indexOf(";"),
                                        cookieString = isSetCookie && -1 !== semicolonIndex ? value.substring(0, semicolonIndex) : value;
                                    for (let cookie of isSetCookie ? [cookieString] : cookieString.split("; ")) {
                                        let equalSignIndex = cookie.indexOf("="),
                                            cookieKey = -1 !== equalSignIndex ? cookie.substring(0, equalSignIndex) : cookie,
                                            cookieValue = -1 !== equalSignIndex ? cookie.substring(equalSignIndex + 1) : "",
                                            lowerCasedCookieKey = cookieKey.toLowerCase();
                                        addSpanAttribute(spanAttributes, lowerCasedHeaderKey, lowerCasedCookieKey, cookieValue, sendDefaultPii, lifecycle);
                                    }
                                } else addSpanAttribute(spanAttributes, lowerCasedHeaderKey, "", value, sendDefaultPii, lifecycle);
                            });
                        } catch {}
                        return spanAttributes;
                    }),
                    (exports.httpRequestToRequestData = function (request) {
                        let headers = request.headers || {},
                            host =
                                ("string" == typeof headers["x-forwarded-host"] ? headers["x-forwarded-host"] : void 0) ||
                                ("string" == typeof headers.host ? headers.host : void 0),
                            protocol =
                                ("string" == typeof headers["x-forwarded-proto"] ? headers["x-forwarded-proto"] : void 0) ||
                                request.protocol ||
                                (request.socket?.encrypted ? "https" : "http"),
                            url = request.url || "",
                            absoluteUrl = (function ({ url, protocol, host }) {
                                return url?.startsWith("http") ? url : url && host ? `${protocol}://${host}${url}` : void 0;
                            })({ url, host, protocol }),
                            data = request.body || void 0,
                            cookies = request.cookies;
                        return { url: absoluteUrl, method: request.method, query_string: extractQueryParamsFromUrl(url), headers: headersToDict(headers), cookies, data };
                    }),
                    (exports.winterCGHeadersToDict = winterCGHeadersToDict),
                    (exports.winterCGRequestToRequestData = function (req) {
                        let headers = winterCGHeadersToDict(req.headers);
                        return { method: req.method, url: req.url, query_string: extractQueryParamsFromUrl(req.url), headers };
                    }));
            }