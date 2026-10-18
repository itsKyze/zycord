8854(__unused_rspack_module, exports, __webpack_require__) {
                let lastHref;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863);
                function instrumentHistory() {
                    function historyReplacementFunction(originalHistoryFunction) {
                        return function (...args) {
                            let url = args.length > 2 ? args[2] : void 0;
                            if (url) {
                                let from = lastHref,
                                    to = (function (urlOrPath) {
                                        try {
                                            return new URL(urlOrPath, types.WINDOW.location.origin).toString();
                                        } catch {
                                            return urlOrPath;
                                        }
                                    })(String(url));
                                if (((lastHref = to), from === to)) return originalHistoryFunction.apply(this, args);
                                core.triggerHandlers("history", { from, to });
                            }
                            return originalHistoryFunction.apply(this, args);
                        };
                    }
                    (types.WINDOW.addEventListener("popstate", () => {
                        let to = types.WINDOW.location.href,
                            from = lastHref;
                        ((lastHref = to), from === to || core.triggerHandlers("history", { from, to }));
                    }),
                        core.supportsHistory() &&
                            (core.fill(types.WINDOW.history, "pushState", historyReplacementFunction),
                            core.fill(types.WINDOW.history, "replaceState", historyReplacementFunction)));
                }
                ((exports.addHistoryInstrumentationHandler = function (handler) {
                    let type = "history";
                    (core.addHandler(type, handler), core.maybeInstrument(type, instrumentHistory));
                }),
                    (exports.instrumentHistory = instrumentHistory));
            }