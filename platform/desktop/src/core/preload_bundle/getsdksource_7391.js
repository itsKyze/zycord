7391(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.getSDKSource = function () {
                        return "npm";
                    }),
                    (exports.isBrowserBundle = function () {
                        return "u" > typeof __SENTRY_BROWSER_BUNDLE__ && !!__SENTRY_BROWSER_BUNDLE__;
                    }));
            }