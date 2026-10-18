385(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445);
                exports.httpContextIntegration = core.defineIntegration(() => ({
                    name: "HttpContext",
                    preprocessEvent(event) {
                        if (!helpers.WINDOW.navigator && !helpers.WINDOW.location && !helpers.WINDOW.document) return;
                        let reqData = helpers.getHttpRequestData(),
                            headers = { ...reqData.headers, ...event.request?.headers };
                        event.request = { ...reqData, ...event.request, headers };
                    },
                }));
            }