5454(__unused_rspack_module, exports, __webpack_require__) {
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
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron = __importStar(__webpack_require__(1288));
                __webpack_require__(5468);
                let { SAFE_STORAGE_IS_ENCRYPTION_AVAILABLE, SAFE_STORAGE_ENCRYPT_STRING, SAFE_STORAGE_DECRYPT_STRING } = __webpack_require__(3716).IPCEvents;
                (electron.ipcMain.on(SAFE_STORAGE_IS_ENCRYPTION_AVAILABLE, (event) => {
                    event.returnValue = null != electron.safeStorage && electron.safeStorage.isEncryptionAvailable();
                }),
                    electron.ipcMain.on(SAFE_STORAGE_ENCRYPT_STRING, (event, plainText) => {
                        null != plainText ? (event.returnValue = electron.safeStorage.encryptString(plainText).toString("base64")) : (event.returnValue = null);
                    }),
                    electron.ipcMain.on(SAFE_STORAGE_DECRYPT_STRING, (event, encrypted) => {
                        if (null != encrypted)
                            try {
                                event.returnValue = electron.safeStorage.decryptString(Buffer.from(encrypted, "base64"));
                            } catch {
                                event.returnValue = null;
                            }
                        else event.returnValue = null;
                    }));
            }