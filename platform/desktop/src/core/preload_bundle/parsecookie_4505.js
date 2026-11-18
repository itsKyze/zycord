4505(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.parseCookie = function (str) {
                        let obj = {},
                            index = 0;
                        for (; index < str.length;) {
                            let eqIdx = str.indexOf("=", index);
                            if (-1 === eqIdx) break;
                            let endIdx = str.indexOf(";", index);
                            if (-1 === endIdx) endIdx = str.length;
                            else if (endIdx < eqIdx) {
                                index = str.lastIndexOf(";", eqIdx - 1) + 1;
                                continue;
                            }
                            let key = str.slice(index, eqIdx).trim();
                            if (void 0 === obj[key]) {
                                let val = str.slice(eqIdx + 1, endIdx).trim();
                                34 === val.charCodeAt(0) && (val = val.slice(1, -1));
                                try {
                                    obj[key] = -1 !== val.indexOf("%") ? decodeURIComponent(val) : val;
                                } catch {
                                    obj[key] = val;
                                }
                            }
                            index = endIdx + 1;
                        }
                        return obj;
                    }));
            }