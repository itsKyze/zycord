6521(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let internal = __webpack_require__(8388);
                function captureLog(level, message, attributes, scope, severityNumber) {
                    internal._INTERNAL_captureLog({ level, message, attributes, severityNumber }, scope);
                }
                ((exports.fmt = __webpack_require__(5039).fmt),
                    (exports.debug = function (message, attributes, { scope } = {}) {
                        captureLog("debug", message, attributes, scope);
                    }),
                    (exports.error = function (message, attributes, { scope } = {}) {
                        captureLog("error", message, attributes, scope);
                    }),
                    (exports.fatal = function (message, attributes, { scope } = {}) {
                        captureLog("fatal", message, attributes, scope);
                    }),
                    (exports.info = function (message, attributes, { scope } = {}) {
                        captureLog("info", message, attributes, scope);
                    }),
                    (exports.trace = function (message, attributes, { scope } = {}) {
                        captureLog("trace", message, attributes, scope);
                    }),
                    (exports.warn = function (message, attributes, { scope } = {}) {
                        captureLog("warn", message, attributes, scope);
                    }));
            }