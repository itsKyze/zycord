2158(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712);
                ((exports.derefWeakRef = function (ref) {
                    if (ref) {
                        if ("object" == typeof ref && "deref" in ref && "function" == typeof ref.deref)
                            try {
                                return ref.deref();
                            } catch {
                                return;
                            }
                        return ref;
                    }
                }),
                    (exports.makeWeakRef = function (value) {
                        try {
                            let WeakRefImpl = worldwide.GLOBAL_OBJ.WeakRef;
                            if ("function" == typeof WeakRefImpl) return new WeakRefImpl(value);
                        } catch {}
                        return value;
                    }));
            }