3974(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777),
                    ipc = __webpack_require__(3306);
                function captureMetric(type, name, value, options) {
                    let client = core.getClient();
                    core._INTERNAL_captureMetric(
                        { type, name, value, unit: options?.unit, attributes: options?.attributes },
                        { scope: options?.scope ?? core.getCurrentScope(), captureSerializedMetric: (_, metric) => ipc.getIPC(client).sendMetric(metric) },
                    );
                }
                ((exports.count = function (name, value = 1, options) {
                    captureMetric("counter", name, value, options);
                }),
                    (exports.distribution = function (name, value, options) {
                        captureMetric("distribution", name, value, options);
                    }),
                    (exports.gauge = function (name, value, options) {
                        captureMetric("gauge", name, value, options);
                    }));
            }