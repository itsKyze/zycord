3647(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getEnableHardwareAcceleration = function () {
                        return "darwin" === process.platform || (null != settings && settings.get("enableHardwareAcceleration", !0));
                    }),
                    (exports.setEnableHardwareAcceleration = function (enableHardwareAcceleration) {
                        null != settings &&
                            (settings.set("enableHardwareAcceleration", enableHardwareAcceleration), settings.save(), electron_1.app.relaunch(), electron_1.app.exit(0));
                    }),
                    (exports.setChromiumSwitches = function (switches) {
                        null != settings && (settings.set("chromiumSwitches", switches), settings.save());
                    }));
                let electron_1 = __webpack_require__(1288),
                    settings = __webpack_require__(8504).appSettings.getSettings();
            }