7407(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let node = __webpack_require__(9715),
                    worldwide = __webpack_require__(3712);
                exports.isBrowser = function () {
                    let process1;
                    return "u" > typeof window && (!node.isNodeEnv() || ((process1 = worldwide.GLOBAL_OBJ.process), process1?.type === "renderer"));
                };
            }