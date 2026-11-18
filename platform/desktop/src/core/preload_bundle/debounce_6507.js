6507(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.debounce = function (func, wait, options) {
                        let callbackReturnValue,
                            timerId,
                            maxTimerId,
                            maxWait = options?.maxWait ? Math.max(options.maxWait, wait) : 0,
                            setTimeoutImpl = options?.setTimeoutImpl || setTimeout;
                        function invokeFunc() {
                            return (cancelTimers(), (callbackReturnValue = func()));
                        }
                        function cancelTimers() {
                            (void 0 !== timerId && clearTimeout(timerId), void 0 !== maxTimerId && clearTimeout(maxTimerId), (timerId = maxTimerId = void 0));
                        }
                        function debounced() {
                            return (
                                timerId && clearTimeout(timerId),
                                (timerId = setTimeoutImpl(invokeFunc, wait)),
                                maxWait && void 0 === maxTimerId && (maxTimerId = setTimeoutImpl(invokeFunc, maxWait)),
                                callbackReturnValue
                            );
                        }
                        return (
                            (debounced.cancel = cancelTimers),
                            (debounced.flush = function () {
                                return void 0 !== timerId || void 0 !== maxTimerId ? invokeFunc() : callbackReturnValue;
                            }),
                            debounced
                        );
                    }));
            }