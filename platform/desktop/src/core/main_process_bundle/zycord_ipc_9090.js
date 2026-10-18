9090(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.init = function () {
                        hasInit ||
                            ((hasInit = !0),
                            ipcMain_1.default.on(constants_1.IPCEvents.THUMBAR_BUTTONS_UPDATE, (event, buttons, isSystemDarkMode) => {
                                var buttons1, buttons2;
                                let thumbarButtons, win, touchbarButtons, win1, touchbar;
                                utils_1.isWindows
                                    ? ((thumbarButtons = createButtons(event, (buttons1 = buttons), isSystemDarkMode)),
                                      (win = electron_1.BrowserWindow.fromId((0, mainScreen_1.getMainWindowId)())),
                                      win?.setThumbarButtons(thumbarButtons) || console.error("setThumbarButtons: setThumbarButtons failed", buttons1))
                                    : utils_1.isOSX
                                      ? ((touchbarButtons = (buttons2 = createButtons(event, (buttons2 = buttons), !0)).map(
                                            (button) =>
                                                new electron_1.TouchBar.TouchBarButton({
                                                    accessibilityLabel: button.tooltip,
                                                    click: button.click,
                                                    icon: button.icon,
                                                    enabled: !button.flags?.includes("disabled"),
                                                }),
                                        )),
                                        (win1 = electron_1.BrowserWindow.fromId((0, mainScreen_1.getMainWindowId)())),
                                        (touchbar = new electron_1.TouchBar({ items: 0 === touchbarButtons.length ? [] : touchbarButtons })),
                                        win1?.setTouchBar(touchbar))
                                      : console.log(`thumbarButtons.init: Unknown operating system "${utils_1.platform}".`);
                            }));
                    }));
                let electron_1 = __webpack_require__(1288),
                    constants_1 = __webpack_require__(3716),
                    ipcMain_1 = __importDefault(__webpack_require__(2799)),
                    mainScreen_1 = __webpack_require__(5203),
                    utils_1 = __webpack_require__(4161),
                    hasInit = !1,
                    ThumbarButtonName = { VIDEO: "VIDEO", MUTE: "MUTE", DEAFEN: "DEAFEN", DISCONNECT: "DISCONNECT" };
                function createButtons(event, buttons, isSystemDarkMode) {
                    for (let button of buttons) {
                        if ("string" != typeof button.name) return (console.error("setThumbarButtons: button.icon missing."), []);
                        if (!(button.name in ThumbarButtonName)) return (console.error(`setThumbarButtons: button.icon for unknown icon "${button.icon}.`), []);
                        let buttonName = button.name;
                        ((button.click = () => ipcMain_1.default.reply(event, "THUMBAR_BUTTONS_CLICKED", { buttonName })),
                            (button.icon = (function (name, active, isSystemDarkMode) {
                                let root = ThumbarButtonName[name].toLowerCase();
                                return (0, utils_1.exposeModuleResource)(
                                    `app/images/thumbar/${utils_1.platform}`,
                                    `${root}${active ? "" : "-off"}${isSystemDarkMode ? "" : "-light"}.png`,
                                );
                            })(button.name, button.active ?? !1, isSystemDarkMode)));
                    }
                    return buttons;
                }
            }