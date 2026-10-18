1594(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863),
                    globalListeners = __webpack_require__(3903);
                exports.onHidden = (cb) => {
                    let onHiddenOrPageHide = (event) => {
                        ("pagehide" === event.type || types.WINDOW.document?.visibilityState === "hidden") && cb(event);
                    };
                    (globalListeners.addPageListener("visibilitychange", onHiddenOrPageHide, { capture: !0, once: !0 }),
                        globalListeners.addPageListener("pagehide", onHiddenOrPageHide, { capture: !0, once: !0 }));
                };
            }