8750(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __webpack_require__(1288),
                    ZycordIPC_1 = __webpack_require__(1999);
                ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.HARDWARE_GET_DISPLAY_COUNT, () => Promise.resolve(electron_1.screen.getAllDisplays().length));
            }