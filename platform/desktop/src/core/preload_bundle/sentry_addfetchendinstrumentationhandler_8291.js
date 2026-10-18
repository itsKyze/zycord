8291(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    is = __webpack_require__(7431),
                    object = __webpack_require__(4204),
                    supports = __webpack_require__(7499),
                    time = __webpack_require__(602),
                    worldwide = __webpack_require__(3712),
                    handlers = __webpack_require__(7130);
                function instrumentFetch(onFetchResolved, skipNativeFetchCheck = !1) {
                    (!skipNativeFetchCheck || supports.supportsNativeFetch()) &&
                        object.fill(worldwide.GLOBAL_OBJ, "fetch", function (originalFetch) {
                            return function (...args) {
                                let virtualError = Error(),
                                    { method, url } = parseFetchArgs(args),
                                    handlerData = {
                                        args,
                                        fetchData: { method, url },
                                        startTimestamp: 1e3 * time.timestampInSeconds(),
                                        virtualError,
                                        headers: (function (fetchArgs) {
                                            let [requestArgument, optionsArgument] = fetchArgs;
                                            try {
                                                if ("object" == typeof optionsArgument && null !== optionsArgument && "headers" in optionsArgument && optionsArgument.headers)
                                                    return new Headers(optionsArgument.headers);
                                                if (is.isRequest(requestArgument)) return new Headers(requestArgument.headers);
                                            } catch {}
                                        })(args),
                                    };
                                return (
                                    onFetchResolved || handlers.triggerHandlers("fetch", { ...handlerData }),
                                    originalFetch.apply(worldwide.GLOBAL_OBJ, args).then(
                                        async (response) => (
                                            onFetchResolved
                                                ? onFetchResolved(response)
                                                : handlers.triggerHandlers("fetch", { ...handlerData, endTimestamp: 1e3 * time.timestampInSeconds(), response }),
                                            response
                                        ),
                                        (error) => {
                                            (handlers.triggerHandlers("fetch", { ...handlerData, endTimestamp: 1e3 * time.timestampInSeconds(), error }),
                                                is.isError(error) &&
                                                    void 0 === error.stack &&
                                                    ((error.stack = virtualError.stack), object.addNonEnumerableProperty(error, "framesToPop", 1)));
                                            let client = currentScopes.getClient(),
                                                enhanceOption = client?.getOptions().enhanceFetchErrorMessages ?? "always";
                                            if (
                                                !1 !== enhanceOption &&
                                                error instanceof TypeError &&
                                                ("Failed to fetch" === error.message ||
                                                    "Load failed" === error.message ||
                                                    "NetworkError when attempting to fetch resource." === error.message)
                                            )
                                                try {
                                                    let hostname = new URL(handlerData.fetchData.url).host;
                                                    "always" === enhanceOption
                                                        ? (error.message = `${error.message} (${hostname})`)
                                                        : object.addNonEnumerableProperty(error, "__sentry_fetch_url_host__", hostname);
                                                } catch {}
                                            throw error;
                                        },
                                    )
                                );
                            };
                        });
                }
                async function resolveResponse(res, onFinishedResolving) {
                    if (res?.body) {
                        let body = res.body,
                            responseReader = body.getReader(),
                            maxFetchDurationTimeout = setTimeout(() => {
                                body.cancel().then(null, () => {});
                            }, 9e4),
                            readingActive = !0;
                        for (; readingActive;) {
                            let chunkTimeout;
                            try {
                                chunkTimeout = setTimeout(() => {
                                    body.cancel().then(null, () => {});
                                }, 5e3);
                                let { done } = await responseReader.read();
                                (clearTimeout(chunkTimeout), done && (onFinishedResolving(), (readingActive = !1)));
                            } catch {
                                readingActive = !1;
                            } finally {
                                clearTimeout(chunkTimeout);
                            }
                        }
                        (clearTimeout(maxFetchDurationTimeout), responseReader.releaseLock(), body.cancel().then(null, () => {}));
                    }
                }
                function streamHandler(response) {
                    let clonedResponseForResolving;
                    try {
                        clonedResponseForResolving = response.clone();
                    } catch {
                        return;
                    }
                    resolveResponse(clonedResponseForResolving, () => {
                        handlers.triggerHandlers("fetch-body-resolved", { endTimestamp: 1e3 * time.timestampInSeconds(), response });
                    });
                }
                function hasProp(obj, prop) {
                    return !!obj && "object" == typeof obj && !!obj[prop];
                }
                function getUrlFromResource(resource) {
                    return "string" == typeof resource ? resource : resource ? (hasProp(resource, "url") ? resource.url : resource.toString ? resource.toString() : "") : "";
                }
                function parseFetchArgs(fetchArgs) {
                    if (0 === fetchArgs.length) return { method: "GET", url: "" };
                    if (2 === fetchArgs.length) {
                        let [resource, options] = fetchArgs;
                        return {
                            url: getUrlFromResource(resource),
                            method: hasProp(options, "method")
                                ? String(options.method).toUpperCase()
                                : is.isRequest(resource) && hasProp(resource, "method")
                                  ? String(resource.method).toUpperCase()
                                  : "GET",
                        };
                    }
                    let arg = fetchArgs[0];
                    return { url: getUrlFromResource(arg), method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET" };
                }
                ((exports.addFetchEndInstrumentationHandler = function (handler) {
                    let type = "fetch-body-resolved";
                    (handlers.addHandler(type, handler), handlers.maybeInstrument(type, () => instrumentFetch(streamHandler)));
                }),
                    (exports.addFetchInstrumentationHandler = function (handler, skipNativeFetchCheck) {
                        let type = "fetch";
                        (handlers.addHandler(type, handler), handlers.maybeInstrument(type, () => instrumentFetch(void 0, skipNativeFetchCheck)));
                    }),
                    (exports.parseFetchArgs = parseFetchArgs));
            }