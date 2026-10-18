5830(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    eventbuilder = __webpack_require__(2081);
                exports.linkedErrorsIntegration = core.defineIntegration((options = {}) => {
                    let limit = options.limit || 5,
                        key = options.key || "cause";
                    return {
                        name: "LinkedErrors",
                        preprocessEvent(event, hint, client) {
                            let options = client.getOptions();
                            core.applyAggregateErrorsToEvent(eventbuilder.exceptionFromError, options.stackParser, key, limit, event, hint);
                        },
                    };
                });
            }