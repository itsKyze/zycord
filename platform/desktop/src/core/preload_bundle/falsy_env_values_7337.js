7337(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let FALSY_ENV_VALUES = new Set(["false", "f", "n", "no", "off", "0"]),
                    TRUTHY_ENV_VALUES = new Set(["true", "t", "y", "yes", "on", "1"]);
                ((exports.FALSY_ENV_VALUES = FALSY_ENV_VALUES),
                    (exports.TRUTHY_ENV_VALUES = TRUTHY_ENV_VALUES),
                    (exports.envToBool = function (value, options) {
                        let normalized = String(value).toLowerCase();
                        return !FALSY_ENV_VALUES.has(normalized) && (!!TRUTHY_ENV_VALUES.has(normalized) || (options?.strict ? null : !!value));
                    }));
            }