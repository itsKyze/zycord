7394(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                exports.checkAndWarnIfIsEmbeddedBrowserExtension = function () {
                    return (
                        !!(function () {
                            if (void 0 === helpers.WINDOW.window) return !1;
                            let _window = helpers.WINDOW;
                            if (_window.nw) return !1;
                            let extensionObject = _window.chrome || _window.browser;
                            if (!extensionObject?.runtime?.id) return !1;
                            let href = core.getLocationHref();
                            return !(helpers.WINDOW === helpers.WINDOW.top && /^(?:chrome-extension|moz-extension|ms-browser-extension|safari-web-extension):\/\//.test(href));
                        })() &&
                        (debugBuild.DEBUG_BUILD &&
                            core.consoleSandbox(() => {
                                console.error(
                                    "[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/",
                                );
                            }),
                        !0)
                    );
                };
            }