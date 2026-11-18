5(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let version = __webpack_require__(3771),
                    worldwide = __webpack_require__(3712);
                function getSentryCarrier(carrier) {
                    let __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
                    return ((__SENTRY__.version = __SENTRY__.version || version.SDK_VERSION), (__SENTRY__[version.SDK_VERSION] = __SENTRY__[version.SDK_VERSION] || {}));
                }
                ((exports.getGlobalSingleton = function (name, creator, obj = worldwide.GLOBAL_OBJ) {
                    let __SENTRY__ = (obj.__SENTRY__ = obj.__SENTRY__ || {}),
                        carrier = (__SENTRY__[version.SDK_VERSION] = __SENTRY__[version.SDK_VERSION] || {});
                    return carrier[name] || (carrier[name] = creator());
                }),
                    (exports.getMainCarrier = function () {
                        return (getSentryCarrier(worldwide.GLOBAL_OBJ), worldwide.GLOBAL_OBJ);
                    }),
                    (exports.getSentryCarrier = getSentryCarrier));
            }