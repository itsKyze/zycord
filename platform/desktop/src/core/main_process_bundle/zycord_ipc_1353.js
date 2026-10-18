1353(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.injectFeaturesBackend = function (features) {
                        injectedFeatures = features;
                    }));
                let ZycordIPC_1 = __webpack_require__(1999),
                    injectedFeatures = null;
                ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.FEATURES_GET_BROWSER_FEATURES, (event) => {
                    event.returnValue = injectedFeatures?.getSupported() ?? [];
                });
            }