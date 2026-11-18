1451(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.merge = function merge(initialObj, mergeObj, levels = 2) {
                        if (!mergeObj || "object" != typeof mergeObj || levels <= 0) return mergeObj;
                        if (initialObj && 0 === Object.keys(mergeObj).length) return initialObj;
                        let output = { ...initialObj };
                        for (let key in mergeObj) Object.prototype.hasOwnProperty.call(mergeObj, key) && (output[key] = merge(output[key], mergeObj[key], levels - 1));
                        return output;
                    }));
            }