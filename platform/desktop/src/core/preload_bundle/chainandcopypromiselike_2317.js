2317(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let isActualPromise = (p) => p instanceof Promise && !p[kChainedCopy],
                    kChainedCopy = Symbol("chained PromiseLike");
                exports.chainAndCopyPromiseLike = (original, onSuccess, onError) => {
                    let chained = original.then(
                        (value) => (onSuccess(value), value),
                        (err) => {
                            throw (onError(err), err);
                        },
                    );
                    return isActualPromise(chained) && isActualPromise(original)
                        ? chained
                        : ((original, chained) => {
                              let mutated = !1;
                              for (let key in original) {
                                  if (key in chained) continue;
                                  mutated = !0;
                                  let value = original[key];
                                  "function" == typeof value
                                      ? Object.defineProperty(chained, key, { value: (...args) => value.apply(original, args), enumerable: !0, configurable: !0, writable: !0 })
                                      : (chained[key] = value);
                              }
                              return (mutated && Object.assign(chained, { [kChainedCopy]: !0 }), chained);
                          })(original, chained);
                };
            }