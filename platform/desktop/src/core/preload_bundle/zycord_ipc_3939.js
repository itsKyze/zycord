3939(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.start = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.NTP_CLOCK_START);
                    }),
                    (exports.now = function () {
                        return Date.now() + syncInfo.offsetMs;
                    }),
                    (exports.getOffsetMs = function () {
                        return syncInfo.offsetMs;
                    }),
                    (exports.getSyncInfo = function () {
                        return syncInfo;
                    }),
                    (exports.onSync = function (callback) {
                        return (
                            events.on(SYNC_EVENT, callback),
                            () => {
                                events.removeListener(SYNC_EVENT, callback);
                            }
                        );
                    }));
                let events_1 = __importDefault(__webpack_require__(4434)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    SYNC_EVENT = "sync",
                    syncInfo = { offsetMs: 0, roundTripMs: null, syncedAtMs: null, synced: !1 },
                    events = new events_1.default();
                (ZycordIPC_1.ZycordIPC.renderer.on(ZycordIPC_1.IPCEvents.NTP_CLOCK_SYNCED, (_, info) => {
                    ((syncInfo = info), events.emit(SYNC_EVENT, info));
                }),
                    ZycordIPC_1.ZycordIPC.renderer
                        .invoke(ZycordIPC_1.IPCEvents.NTP_CLOCK_GET_SYNC_INFO)
                        .then((info) => {
                            null == syncInfo.syncedAtMs && ((syncInfo = info), events.emit(SYNC_EVENT, info));
                        })
                        .catch(() => {}));
            }