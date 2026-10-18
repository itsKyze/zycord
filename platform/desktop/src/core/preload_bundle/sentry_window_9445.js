9445(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    WINDOW = core.GLOBAL_OBJ,
                    ignoreOnError = 0;
                function ignoreNextOnError() {
                    (ignoreOnError++,
                        setTimeout(() => {
                            ignoreOnError--;
                        }));
                }
                ((exports.WINDOW = WINDOW),
                    (exports.getHttpRequestData = function () {
                        let url = core.getLocationHref(),
                            { referrer } = WINDOW.document || {},
                            { userAgent } = WINDOW.navigator || {};
                        return { url, headers: { ...(referrer && { Referer: referrer }), ...(userAgent && { "User-Agent": userAgent }) } };
                    }),
                    (exports.ignoreNextOnError = ignoreNextOnError),
                    (exports.shouldIgnoreOnError = function () {
                        return ignoreOnError > 0;
                    }),
                    (exports.wrap = function wrap(fn, options = {}) {
                        if ("function" != typeof fn) return fn;
                        try {
                            let wrapper = fn.__sentry_wrapped__;
                            if (wrapper)
                                if ("function" == typeof wrapper) return wrapper;
                                else return fn;
                            if (core.getOriginalFunction(fn)) return fn;
                        } catch {
                            return fn;
                        }
                        let sentryWrapped = function (...args) {
                            try {
                                let wrappedArguments = args.map((arg) => wrap(arg, options));
                                return fn.apply(this, wrappedArguments);
                            } catch (ex) {
                                throw (
                                    ignoreNextOnError(),
                                    core.withScope((scope) => {
                                        (scope.addEventProcessor(
                                            (event) => (
                                                options.mechanism && (core.addExceptionTypeValue(event, void 0, void 0), core.addExceptionMechanism(event, options.mechanism)),
                                                (event.extra = { ...event.extra, arguments: args }),
                                                event
                                            ),
                                        ),
                                            core.captureException(ex));
                                    }),
                                    ex
                                );
                            }
                        };
                        try {
                            for (let property in fn) Object.prototype.hasOwnProperty.call(fn, property) && (sentryWrapped[property] = fn[property]);
                        } catch {}
                        (core.markFunctionWrapped(sentryWrapped, fn), core.addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped));
                        try {
                            Object.getOwnPropertyDescriptor(sentryWrapped, "name").configurable && Object.defineProperty(sentryWrapped, "name", { get: () => fn.name });
                        } catch {}
                        return sentryWrapped;
                    }));
            }