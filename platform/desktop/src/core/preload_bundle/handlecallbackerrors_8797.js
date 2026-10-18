8797(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let chainAndCopyPromiselike = __webpack_require__(2317),
                    is = __webpack_require__(7431);
                exports.handleCallbackErrors = function (fn, onError, onFinally = () => {}, onSuccess = () => {}) {
                    var value, onError1, onFinally1, onSuccess1;
                    let maybePromiseResult;
                    try {
                        maybePromiseResult = fn();
                    } catch (e) {
                        throw (onError(e), onFinally(), e);
                    }
                    return (
                        (value = maybePromiseResult),
                        (onError1 = onError),
                        (onFinally1 = onFinally),
                        (onSuccess1 = onSuccess),
                        is.isThenable(value)
                            ? chainAndCopyPromiselike.chainAndCopyPromiseLike(
                                  value,
                                  (result) => {
                                      (onFinally1(), onSuccess1(result));
                                  },
                                  (err) => {
                                      (onError1(err), onFinally1());
                                  },
                              )
                            : (onFinally1(), onSuccess1(value), value)
                    );
                };
            }