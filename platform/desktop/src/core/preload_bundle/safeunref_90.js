90(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.safeUnref = function (timer) {
                        return ("object" == typeof timer && "function" == typeof timer.unref && timer.unref(), timer);
                    }));
            }