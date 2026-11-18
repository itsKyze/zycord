3781(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121);
                exports.hasSpansEnabled = function (maybeOptions) {
                    if ("boolean" == typeof __SENTRY_TRACING__ && !__SENTRY_TRACING__) return !1;
                    let options = maybeOptions || currentScopes.getClient()?.getOptions();
                    return !!options && (null != options.tracesSampleRate || !!options.tracesSampler);
                };
            }