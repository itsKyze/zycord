150(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777),
                    ipc = __webpack_require__(3306);
                function captureLog(level, message, attributes, severityNumber) {
                    let client = core.getClient();
                    core._INTERNAL_captureLog({ level, message, attributes, severityNumber }, core.getCurrentScope(), (_, log) => ipc.getIPC(client).sendStructuredLog(log));
                }
                ((exports.fmt = core.fmt),
                    (exports.debug = function (message, attributes) {
                        captureLog("debug", message, attributes);
                    }),
                    (exports.error = function (message, attributes) {
                        captureLog("error", message, attributes);
                    }),
                    (exports.fatal = function (message, attributes) {
                        captureLog("fatal", message, attributes);
                    }),
                    (exports.info = function (message, attributes) {
                        captureLog("info", message, attributes);
                    }),
                    (exports.trace = function (message, attributes) {
                        captureLog("trace", message, attributes);
                    }),
                    (exports.warn = function (message, attributes) {
                        captureLog("warn", message, attributes);
                    }));
            }