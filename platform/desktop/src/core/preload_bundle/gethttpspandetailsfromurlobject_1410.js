1410(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let semanticAttributes = __webpack_require__(3052);
                function isURLObjectRelative(url) {
                    return "isRelative" in url;
                }
                function getSanitizedUrlStringFromUrlObject(url) {
                    if (isURLObjectRelative(url)) return url.pathname;
                    let newUrl = new URL(url);
                    return (
                        (newUrl.search = ""),
                        (newUrl.hash = ""),
                        ["80", "443"].includes(newUrl.port) && (newUrl.port = ""),
                        newUrl.password && (newUrl.password = "%filtered%"),
                        newUrl.username && (newUrl.username = "%filtered%"),
                        newUrl.toString()
                    );
                }
                ((exports.getHttpSpanDetailsFromUrlObject = function (urlObject, kind, spanOrigin, request, routeName) {
                    let method,
                        route,
                        attributes = { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin, [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url" };
                    return (
                        routeName &&
                            ((attributes["server" === kind ? "http.route" : "url.template"] = routeName),
                            (attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = "route")),
                        request?.method && (attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD] = request.method.toUpperCase()),
                        urlObject &&
                            (urlObject.search && (attributes["url.query"] = urlObject.search),
                            urlObject.hash && (attributes["url.fragment"] = urlObject.hash),
                            urlObject.pathname &&
                                ((attributes["url.path"] = urlObject.pathname),
                                "/" === urlObject.pathname && (attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = "route")),
                            !isURLObjectRelative(urlObject) &&
                                ((attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_URL_FULL] = urlObject.href),
                                urlObject.port && (attributes["url.port"] = urlObject.port),
                                urlObject.protocol && (attributes["url.scheme"] = urlObject.protocol),
                                urlObject.hostname && (attributes["server" === kind ? "server.address" : "url.domain"] = urlObject.hostname))),
                        [
                            ((method = request?.method?.toUpperCase() ?? "GET"),
                            (route = routeName || (urlObject ? ("client" === kind ? getSanitizedUrlStringFromUrlObject(urlObject) : urlObject.pathname) : "/")),
                            `${method} ${route}`),
                            attributes,
                        ]
                    );
                }),
                    (exports.getSanitizedUrlString = function (url) {
                        let { protocol, host, path } = url,
                            filteredHost =
                                host
                                    ?.replace(/^.*@/, "[filtered]:[filtered]@")
                                    .replace(/(:80)$/, "")
                                    .replace(/(:443)$/, "") || "";
                        return `${protocol ? `${protocol}://` : ""}${filteredHost}${path}`;
                    }),
                    (exports.getSanitizedUrlStringFromUrlObject = getSanitizedUrlStringFromUrlObject),
                    (exports.isURLObjectRelative = isURLObjectRelative),
                    (exports.parseStringToURLObject = function (url, urlBase) {
                        let isRelative = 0 >= url.indexOf("://") && 0 !== url.indexOf("//"),
                            base = urlBase ?? (isRelative ? "thismessage:/" : void 0);
                        try {
                            if ("canParse" in URL && !URL.canParse(url, base)) return;
                            let fullUrlObject = new URL(url, base);
                            if (isRelative) return { isRelative, pathname: fullUrlObject.pathname, search: fullUrlObject.search, hash: fullUrlObject.hash };
                            return fullUrlObject;
                        } catch {}
                    }),
                    (exports.parseUrl = function (url) {
                        if (!url) return {};
                        let match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
                        if (!match) return {};
                        let query = match[6] || "",
                            fragment = match[8] || "";
                        return { host: match[4], path: match[5], protocol: match[2], search: query, hash: fragment, relative: match[5] + query + fragment };
                    }),
                    (exports.stripDataUrlContent = function (url, includeDataPrefix = !0) {
                        if (url.startsWith("data:")) {
                            let match = url.match(/^data:([^;,]+)/),
                                mimeType = match ? match[1] : "text/plain",
                                isBase64 = url.includes(";base64,"),
                                dataStart = url.indexOf(","),
                                dataPrefix = "";
                            if (includeDataPrefix && -1 !== dataStart) {
                                let data = url.slice(dataStart + 1);
                                dataPrefix = data.length > 10 ? `${data.slice(0, 10)}... [truncated]` : data;
                            }
                            return `data:${mimeType}${isBase64 ? ",base64" : ""}${dataPrefix ? `,${dataPrefix}` : ""}`;
                        }
                        return url;
                    }),
                    (exports.stripUrlQueryAndFragment = function (urlPath) {
                        return urlPath.split(/[?#]/, 1)[0];
                    }));
            }