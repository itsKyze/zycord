7314(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.initialize = function () {
                        (ntpClock_1.ntpClock.onSync(broadcastSyncInfo),
                            electron_1.default.powerMonitor.on("resume", () => {
                                ntpClock_1.ntpClock.resync();
                            }));
                    }));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    ntpClock_1 = __webpack_require__(1998),
                    ZycordIPC_1 = __webpack_require__(1999);
                function broadcastSyncInfo(info) {
                    for (let window of electron_1.default.BrowserWindow.getAllWindows()) window.webContents?.send(ZycordIPC_1.IPCEvents.NTP_CLOCK_SYNCED, info);
                }
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NTP_CLOCK_START, () => (ntpClock_1.ntpClock.start(), Promise.resolve())),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NTP_CLOCK_GET_SYNC_INFO, () => Promise.resolve(ntpClock_1.ntpClock.getSyncInfo())));
            }