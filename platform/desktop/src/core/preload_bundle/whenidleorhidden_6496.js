6496(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    globalListeners = __webpack_require__(3903),
                    runOnce = __webpack_require__(9863);
                exports.whenIdleOrHidden = (cb) => {
                    let rIC = types.WINDOW.requestIdleCallback || types.WINDOW.setTimeout;
                    types.WINDOW.document?.visibilityState === "hidden"
                        ? cb()
                        : ((cb = runOnce.runOnce(cb)),
                          globalListeners.addPageListener("visibilitychange", cb, { once: !0, capture: !0 }),
                          globalListeners.addPageListener("pagehide", cb, { once: !0, capture: !0 }),
                          rIC(() => {
                              (cb(),
                                  globalListeners.removePageListener("visibilitychange", cb, { capture: !0 }),
                                  globalListeners.removePageListener("pagehide", cb, { capture: !0 }));
                          }));
                };
            }