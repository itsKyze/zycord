8068(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.parseSampleRate = function (sampleRate) {
                        if ("boolean" == typeof sampleRate) return Number(sampleRate);
                        let rate = "string" == typeof sampleRate ? parseFloat(sampleRate) : sampleRate;
                        if (!("number" != typeof rate || isNaN(rate)) && !(rate < 0) && !(rate > 1)) return rate;
                    }));
            }