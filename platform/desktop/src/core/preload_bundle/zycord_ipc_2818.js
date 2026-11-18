2818(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var ownKeys,
                    __createBinding =
                        (this && this.__createBinding) ||
                        (Object.create
                            ? function (o, m, k, k2) {
                                  void 0 === k2 && (k2 = k);
                                  var desc = Object.getOwnPropertyDescriptor(m, k);
                                  ((!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) &&
                                      (desc = {
                                          enumerable: !0,
                                          get: function () {
                                              return m[k];
                                          },
                                      }),
                                      Object.defineProperty(o, k2, desc));
                              }
                            : function (o, m, k, k2) {
                                  (void 0 === k2 && (k2 = k), (o[k2] = m[k]));
                              }),
                    __setModuleDefault =
                        (this && this.__setModuleDefault) ||
                        (Object.create
                            ? function (o, v) {
                                  Object.defineProperty(o, "default", { enumerable: !0, value: v });
                              }
                            : function (o, v) {
                                  o.default = v;
                              }),
                    __importStar =
                        (this && this.__importStar) ||
                        ((ownKeys = function (o) {
                            return (ownKeys =
                                Object.getOwnPropertyNames ||
                                function (o) {
                                    var ar = [];
                                    for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && (ar[ar.length] = k);
                                    return ar;
                                })(o);
                        }),
                        function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (null != mod) for (var k = ownKeys(mod), i = 0; i < k.length; i++) "default" !== k[i] && __createBinding(result, mod, k[i]);
                            return (__setModuleDefault(result, mod), result);
                        }),
                    __importDefault =
                        (this && this.__importDefault) ||
                        function (mod) {
                            return mod && mod.__esModule ? mod : { default: mod };
                        };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.on = function (eventName, listener) {
                        return (events.on(eventName, listener), () => events.removeListener(eventName, listener));
                    }),
                    (exports.removeAllListeners = function (eventName) {
                        events.removeAllListeners(eventName);
                    }),
                    (exports.getSystemIdleTimeMs = function () {
                        return electron.ipcRenderer.invoke(POWER_MONITOR_GET_SYSTEM_IDLE_TIME);
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    events_1 = __importDefault(__webpack_require__(4434)),
                    { POWER_MONITOR_RESUME, POWER_MONITOR_SUSPEND, POWER_MONITOR_LOCK_SCREEN, POWER_MONITOR_UNLOCK_SCREEN, POWER_MONITOR_GET_SYSTEM_IDLE_TIME } =
                        __webpack_require__(3716).IPCEvents,
                    events = new events_1.default();
                (electron.ipcRenderer.on(POWER_MONITOR_RESUME, () => {
                    events.emit("resume");
                }),
                    electron.ipcRenderer.on(POWER_MONITOR_SUSPEND, () => {
                        events.emit("suspend");
                    }),
                    electron.ipcRenderer.on(POWER_MONITOR_LOCK_SCREEN, () => {
                        events.emit("lock-screen");
                    }),
                    electron.ipcRenderer.on(POWER_MONITOR_UNLOCK_SCREEN, () => {
                        events.emit("unlock-screen");
                    }));
            }