7912(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    ZycordIPC_1 = __webpack_require__(1999);
                ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.ACCESSIBILITY_GET_ENABLED, (_) => Promise.resolve(electron_1.default.app.accessibilitySupportEnabled));
            }