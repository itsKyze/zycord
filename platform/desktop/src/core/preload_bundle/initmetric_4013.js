4013(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    generateUniqueID = __webpack_require__(8006),
                    getActivationStart = __webpack_require__(5251),
                    getNavigationEntry = __webpack_require__(9549);
                exports.initMetric = (name, value = -1) => {
                    let navEntry = getNavigationEntry.getNavigationEntry(),
                        navigationType = "navigate";
                    return (
                        navEntry &&
                            (types.WINDOW.document?.prerendering || getActivationStart.getActivationStart() > 0
                                ? (navigationType = "prerender")
                                : types.WINDOW.document?.wasDiscarded
                                  ? (navigationType = "restore")
                                  : navEntry.type && (navigationType = navEntry.type.replace(/_/g, "-"))),
                        { name, value, rating: "good", delta: 0, entries: [], id: generateUniqueID.generateUniqueID(), navigationType }
                    );
                };
            }