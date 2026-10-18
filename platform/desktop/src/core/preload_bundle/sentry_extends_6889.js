6889(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.SentryError = class extends Error {
                        constructor(message, logLevel = "warn") {
                            (super(message), (this.message = message), (this.logLevel = logLevel));
                        }
                    }));
            }