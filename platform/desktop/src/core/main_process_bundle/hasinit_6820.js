6820(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.hasInit = void 0),
                    (exports.init = function () {
                        if (isSupported()) {
                            if (exports.hasInit) return void console.warn("appBadge: Has already init! Cancelling init.");
                            ((exports.hasInit = !0), (lastIndex = null));
                            for (let i = 1; i <= 11; i++) {
                                let image = (0, utils_1.exposeModuleResource)("app/images/badges", `badge-${i}.ico`);
                                appIcons.push(image);
                            }
                            ipcMain_1.default.on("APP_BADGE_SET", (_event, count) => setAppBadge(count, !1));
                        }
                    }),
                    (exports.refreshAppBadge = function () {
                        isSupported() && null != lastCount && setAppBadge(lastCount, !0);
                    }));
                let electron_1 = __webpack_require__(1288),
                    ipcMain_1 = __importDefault(__webpack_require__(2799)),
                    mainScreen_1 = __webpack_require__(5203),
                    utils_1 = __webpack_require__(4161);
                exports.hasInit = !1;
                let lastIndex = null,
                    lastCount = null,
                    appIcons = [];
                function isSupported() {
                    return "win32" === process.platform;
                }
                function setAppBadge(count, force) {
                    let win = electron_1.BrowserWindow.fromId((0, mainScreen_1.getMainWindowId)());
                    if (null == win || win.isDestroyed()) return;
                    let { index, description } = (function (count) {
                        if (-1 === count) return { index: 10, description: "Unread messages" };
                        if (0 === count) return { index: null, description: "No Notifications" };
                        let index = Math.max(1, Math.min(count, 10)) - 1;
                        return { index, description: `${index} notifications` };
                    })(count);
                    ((force || lastIndex !== index) &&
                        (null == index ? win.setOverlayIcon(null, description) : win.setOverlayIcon(appIcons[index], description), (lastIndex = index)),
                        (lastCount = count));
                }
            }