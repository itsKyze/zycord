3397(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = { HOOK_MINIDUMP_SENTRY: "https://o64374.ingest.sentry.io/api/4505053715759104/minidump/?sentry_key=a6d1a1ca54ed4a729c6949f0237969e3" }));
            },
            7064(module1, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let ZycordIPC_1 = __webpack_require__(1999),
                    supportedFeatures = new Set(ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.FEATURES_GET_BROWSER_FEATURES));
                module1.exports = {
                    supports: function (feature) {
                        return supportedFeatures.has(feature);
                    },
                    declareSupported: function (feature) {
                        supportedFeatures.add(feature);
                    },
                };
            }