6955(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getDisplayCount = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.HARDWARE_GET_DISPLAY_COUNT);
                    }));
                let ZycordIPC_1 = __webpack_require__(1999);
            }