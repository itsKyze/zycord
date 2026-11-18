3269(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.attach = function (origin) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_ATTACH, origin);
                    }),
                    (exports.runBatch = function (calls) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_RUN_BATCH, calls);
                    }),
                    (exports.detach = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_DETACH);
                    }),
                    (exports.onDetached = function (callback) {
                        return (
                            events.on(DETACHED, callback),
                            () => {
                                events.removeListener(DETACHED, callback);
                            }
                        );
                    }));
                let events_1 = __importDefault(__webpack_require__(4434)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    DETACHED = "detached",
                    events = new events_1.default();
                ZycordIPC_1.ZycordIPC.renderer.on(ZycordIPC_1.IPCEvents.FRAME_DEBUGGER_DETACHED, (_, sessionId, reason) => {
                    events.emit(DETACHED, sessionId, reason);
                });
            }