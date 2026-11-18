3651(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    ORIGINAL_REQ_BODY = Symbol.for("sentry__originalRequestBody");
                function serializeFormData(formData) {
                    return new URLSearchParams(formData).toString();
                }
                ((exports.ORIGINAL_REQ_BODY = ORIGINAL_REQ_BODY),
                    (exports.getBodyString = function (body, _debug = core.debug) {
                        try {
                            if ("string" == typeof body) return [body];
                            if (body instanceof URLSearchParams) return [body.toString()];
                            if (body instanceof FormData) return [serializeFormData(body)];
                            if (!body) return [void 0];
                        } catch (error) {
                            return (debugBuild.DEBUG_BUILD && _debug.error(error, "Failed to serialize body", body), [void 0, "BODY_PARSE_ERROR"]);
                        }
                        return (debugBuild.DEBUG_BUILD && _debug.log("Skipping network body because of body type", body), [void 0, "UNPARSEABLE_BODY_TYPE"]);
                    }),
                    (exports.getFetchRequestArgBody = function (fetchArgs = []) {
                        if (fetchArgs.length >= 2 && fetchArgs[1] && "object" == typeof fetchArgs[1] && "body" in fetchArgs[1]) return fetchArgs[1].body;
                        if (fetchArgs.length >= 1 && fetchArgs[0] instanceof Request) {
                            let originalBody = fetchArgs[0][ORIGINAL_REQ_BODY];
                            if (void 0 !== originalBody) return originalBody;
                        }
                    }),
                    (exports.parseXhrResponseHeaders = function (xhr) {
                        let headers;
                        try {
                            headers = xhr.getAllResponseHeaders();
                        } catch (error) {
                            return (debugBuild.DEBUG_BUILD && core.debug.error(error, "Failed to get xhr response headers", xhr), {});
                        }
                        return headers
                            ? headers.split("\r\n").reduce((acc, line) => {
                                  let [key, value] = line.split(": ");
                                  return (value && (acc[key.toLowerCase()] = value), acc);
                              }, {})
                            : {};
                    }),
                    (exports.serializeFormData = serializeFormData));
            }