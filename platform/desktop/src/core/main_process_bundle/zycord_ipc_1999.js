1999(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.ZycordIPC = exports.IPCEvents = void 0));
                let electron_1 = __importDefault(__webpack_require__(1288));
                __webpack_require__(3716);
                var constants_2 = __webpack_require__(3716);
                (Object.defineProperty(exports, "IPCEvents", {
                    enumerable: !0,
                    get: function () {
                        return constants_2.IPCEvents;
                    },
                }),
                    (exports.ZycordIPC = {
                        main: class {
                            static on(channel, listener) {
                                electron_1.default.ipcMain.on(channel, (...args) => listener.apply(this, args));
                            }
                            static handle(channel, listener) {
                                return electron_1.default.ipcMain.handle(channel, (...args) => listener.apply(this, args));
                            }
                        },
                        renderer: class {
                            static sendSync(...args) {
                                return electron_1.default.ipcRenderer.sendSync.apply(electron_1.default.ipcRenderer, args);
                            }
                            static invoke(...args) {
                                return electron_1.default.ipcRenderer.invoke.apply(electron_1.default.ipcRenderer, args);
                            }
                            static on(channel, listener) {
                                electron_1.default.ipcRenderer.on(channel, (...args) => listener.apply(this, args));
                            }
                        },
                    }));
            }