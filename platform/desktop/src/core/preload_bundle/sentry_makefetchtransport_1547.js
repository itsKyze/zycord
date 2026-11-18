1547(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794);
                exports.makeFetchTransport = function (options, nativeFetch = browserUtils.getNativeImplementation("fetch")) {
                    let pendingBodySize = 0,
                        pendingCount = 0;
                    async function makeRequest(request) {
                        let requestSize = request.body.length;
                        ((pendingBodySize += requestSize), pendingCount++);
                        let requestOptions = {
                            body: request.body,
                            method: "POST",
                            referrerPolicy: "strict-origin",
                            headers: options.headers,
                            keepalive: pendingBodySize <= 6e4 && pendingCount < 15,
                            ...options.fetchOptions,
                        };
                        try {
                            let response = await nativeFetch(options.url, requestOptions);
                            return {
                                statusCode: response.status,
                                headers: { "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"), "retry-after": response.headers.get("Retry-After") },
                            };
                        } catch (e) {
                            throw (browserUtils.clearCachedImplementation("fetch"), e);
                        } finally {
                            ((pendingBodySize -= requestSize), pendingCount--);
                        }
                    }
                    return core.createTransport(options, makeRequest, core.makePromiseBuffer(options.bufferSize || 40));
                };
            }