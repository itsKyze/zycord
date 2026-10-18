7683(__unused_rspack_module, exports, __webpack_require__) {
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
                    (exports.injectSettingsBackend = function (settings) {
                        injectedSettings = settings;
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    { RENDERER_SET_ALLOWLIST } = __webpack_require__(3716),
                    { SETTINGS_GET, SETTINGS_SET, SETTINGS_GET_SYNC } = __webpack_require__(3716).IPCEvents,
                    injectedSettings = null;
                function getSettings() {
                    return null != injectedSettings ? injectedSettings : { get: () => {}, set: () => {}, save: () => {} };
                }
                (electron.ipcMain.handle(SETTINGS_GET, (_, name, defaultValue) => getSettings().get(name, defaultValue)),
                    electron.ipcMain.handle(SETTINGS_SET, (_, name, value) => {
                        if (!RENDERER_SET_ALLOWLIST.includes(name)) throw Error(`Cannot set setting key: ${name}`);
                        let settings = getSettings();
                        (settings.set(name, value), settings.save());
                    }),
                    electron.ipcMain.on(SETTINGS_GET_SYNC, (event, name, defaultValue) => {
                        event.returnValue = getSettings().get(name, defaultValue);
                    }));
            }