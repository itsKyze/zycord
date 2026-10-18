4973(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.hasInit = void 0),
                    (exports.init = function () {
                        exports.hasInit ||
                            ((exports.hasInit = !0),
                            ipcMain_1.default.on("TOGGLE_MINIMIZE_TO_TRAY", (_event, value) => {
                                var minimizeToTray;
                                return (
                                    (minimizeToTray = value),
                                    void (null == settings
                                        ? console.warn("Could not execute 'setMinimizeOnClose', settings was null")
                                        : settings.set("MINIMIZE_TO_TRAY", minimizeToTray))
                                );
                            }),
                            ipcMain_1.default.on("TOGGLE_OPEN_ON_STARTUP", (_event, value) => {
                                value ? autoStart_1.autoStart.install(NOOP) : autoStart_1.autoStart.uninstall(NOOP);
                            }),
                            ipcMain_1.default.on("TOGGLE_START_MINIMIZED", (_event, value) => {
                                var startMinimized;
                                return (
                                    (startMinimized = value),
                                    void (null == settings
                                        ? console.warn("Could not execute 'toggleStartMinimized', settings was null")
                                        : (settings.set("START_MINIMIZED", startMinimized),
                                          autoStart_1.autoStart.isInstalled((installed) => {
                                              installed && autoStart_1.autoStart.install(NOOP);
                                          })))
                                );
                            }),
                            ipcMain_1.default.on("UPDATE_OPEN_ON_STARTUP", (_event) => void autoStart_1.autoStart.update(NOOP)),
                            ipcMain_1.default.handle(
                                constants_1.IPCEvents.APP_GET_OPEN_ON_START,
                                () =>
                                    new Promise((resolve) => {
                                        autoStart_1.autoStart.isInstalled(resolve);
                                    }),
                            ));
                    }));
                let appSettings_1 = __webpack_require__(8504),
                    autoStart_1 = __webpack_require__(2539),
                    constants_1 = __webpack_require__(3716),
                    ipcMain_1 = __importDefault(__webpack_require__(2799)),
                    settings = appSettings_1.appSettings.getSettings();
                function NOOP() {}
                exports.hasInit = !1;
            }