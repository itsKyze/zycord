7754(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let instanceMap = new WeakMap();
                exports.initUnique = function (identityObj, ClassObj) {
                    try {
                        return (instanceMap.get(identityObj) || instanceMap.set(identityObj, new ClassObj()), instanceMap.get(identityObj));
                    } catch (_e) {
                        return new ClassObj();
                    }
                };
            }