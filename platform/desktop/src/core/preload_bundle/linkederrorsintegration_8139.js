8139(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    aggregateErrors = __webpack_require__(6934),
                    eventbuilder = __webpack_require__(7348);
                exports.linkedErrorsIntegration = integration.defineIntegration((options = {}) => {
                    let limit = options.limit || 5,
                        key = options.key || "cause";
                    return {
                        name: "LinkedErrors",
                        preprocessEvent(event, hint, client) {
                            let options = client.getOptions();
                            aggregateErrors.applyAggregateErrorsToEvent(eventbuilder.exceptionFromError, options.stackParser, key, limit, event, hint);
                        },
                    };
                });
            }