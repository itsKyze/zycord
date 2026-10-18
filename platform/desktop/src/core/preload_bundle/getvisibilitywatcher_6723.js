6723(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    getActivationStart = __webpack_require__(5251),
                    globalListeners = __webpack_require__(3903),
                    firstHiddenTime = -1,
                    onHiddenFunctions = new Set(),
                    onVisibilityUpdate = (event) => {
                        if (("pagehide" === event.type || types.WINDOW.document?.visibilityState === "hidden") && firstHiddenTime > -1) {
                            if ("visibilitychange" === event.type || "pagehide" === event.type) for (let onHiddenFunction of onHiddenFunctions) onHiddenFunction();
                            isFinite(firstHiddenTime) ||
                                ((firstHiddenTime = "visibilitychange" === event.type ? event.timeStamp : 0),
                                globalListeners.removePageListener("prerenderingchange", onVisibilityUpdate, !0));
                        }
                    };
                exports.getVisibilityWatcher = () => {
                    if (types.WINDOW.document && firstHiddenTime < 0) {
                        let activationStart = getActivationStart.getActivationStart();
                        ((firstHiddenTime =
                            (types.WINDOW.document.prerendering
                                ? void 0
                                : globalThis.performance.getEntriesByType("visibility-state").filter((e) => "hidden" === e.name && e.startTime > activationStart)[0]?.startTime) ??
                            (types.WINDOW.document?.visibilityState !== "hidden" || types.WINDOW.document?.prerendering ? 1 / 0 : 0)),
                            globalListeners.addPageListener("visibilitychange", onVisibilityUpdate, !0),
                            globalListeners.addPageListener("pagehide", onVisibilityUpdate, !0),
                            globalListeners.addPageListener("prerenderingchange", onVisibilityUpdate, !0));
                    }
                    return {
                        get firstHiddenTime() {
                            return firstHiddenTime;
                        },
                        onHidden(cb) {
                            onHiddenFunctions.add(cb);
                        },
                    };
                };
            }