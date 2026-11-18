6509(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let object = __webpack_require__(4204);
                ((exports.isStreamedBeforeSendSpanCallback = function (callback) {
                    return !!callback && "function" == typeof callback && "_streamed" in callback && !!callback._streamed;
                }),
                    (exports.withStreamedSpan = function (callback) {
                        return (object.addNonEnumerableProperty(callback, "_streamed", !0), callback);
                    }));
            }