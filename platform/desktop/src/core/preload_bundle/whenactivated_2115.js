2115(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863);
                exports.whenActivated = (callback) => {
                    types.WINDOW.document?.prerendering ? addEventListener("prerenderingchange", () => callback(), !0) : callback();
                };
            }