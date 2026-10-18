1667(__unused_rspack_module, exports, __webpack_require__) {
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
                        });
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.injectGpuSettingsBackend = function (gpuSettings) {
                        injectedGpuSettings = gpuSettings;
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    constants_1 = __webpack_require__(3716),
                    { GPU_SETTINGS_SET_ENABLE_HWACCEL, GPU_SETTINGS_GET_ENABLE_HWACCEL_SYNC, GPU_SETTINGS_SET_CHROMIUM_SWITCHES } = __webpack_require__(3716).IPCEvents,
                    injectedGpuSettings = null;
                (electron.ipcMain.handle(GPU_SETTINGS_SET_ENABLE_HWACCEL, (_, enable) => {
                    injectedGpuSettings?.setEnableHardwareAcceleration(enable);
                }),
                    electron.ipcMain.on(GPU_SETTINGS_GET_ENABLE_HWACCEL_SYNC, (event) => {
                        event.returnValue = null != injectedGpuSettings && injectedGpuSettings.getEnableHardwareAcceleration();
                    }),
                    electron.ipcMain.handle(GPU_SETTINGS_SET_CHROMIUM_SWITCHES, (_, switches) => {
                        for (let key of Object.keys(switches))
                            if (!constants_1.RENDERER_SET_CHROMIUM_SWITCHES_ALLOWLIST.includes(key)) throw Error(`Cannot set chromium switch key: ${key}`);
                        injectedGpuSettings?.setChromiumSwitches(switches);
                    }));
            }