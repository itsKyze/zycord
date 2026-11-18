8034(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let misc = __webpack_require__(735);
                ((exports.generateSpanId = function () {
                    return misc.uuid4().substring(16);
                }),
                    (exports.generateTraceId = function () {
                        return misc.uuid4();
                    }));
            }