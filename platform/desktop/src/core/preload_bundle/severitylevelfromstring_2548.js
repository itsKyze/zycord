2548(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.severityLevelFromString = function (level) {
                        return "warn" === level ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(level) ? level : "log";
                    }));
            }