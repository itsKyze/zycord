3115(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let internal = __webpack_require__(802);
                function captureMetric(type, name, value, options) {
                    internal._INTERNAL_captureMetric({ type, name, value, unit: options?.unit, attributes: options?.attributes }, { scope: options?.scope });
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