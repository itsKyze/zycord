3401(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let carrier = __webpack_require__(5),
                    stackStrategy = __webpack_require__(424);
                ((exports.getAsyncContextStrategy = function (carrier$1) {
                    let sentry = carrier.getSentryCarrier(carrier$1);
                    return sentry.acs ? sentry.acs : stackStrategy.getStackAsyncContextStrategy();
                }),
                    (exports.setAsyncContextStrategy = function (strategy) {
                        let registry = carrier.getMainCarrier();
                        carrier.getSentryCarrier(registry).acs = strategy;
                    }));
            }