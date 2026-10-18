3903(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863);
                ((exports.addPageListener = function (type, listener, options) {
                    types.WINDOW.document && types.WINDOW.addEventListener(type, listener, options);
                }),
                    (exports.removePageListener = function (type, listener, options) {
                        types.WINDOW.document && types.WINDOW.removeEventListener(type, listener, options);
                    }));
            }