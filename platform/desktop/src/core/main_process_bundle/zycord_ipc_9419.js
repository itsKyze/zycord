9419(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.init = function () {
                        hasInit || (ipcMain_1.default.handle(constants_1.IPCEvents.GET_MOUSE_COORDINATES, () => electron_1.screen.getCursorScreenPoint()), (hasInit = !0));
                    }));
                let electron_1 = __webpack_require__(1288),
                    constants_1 = __webpack_require__(3716),
                    ipcMain_1 = __importDefault(__webpack_require__(2799)),
                    hasInit = !1;
            }