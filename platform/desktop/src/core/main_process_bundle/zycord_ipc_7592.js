7592(__unused_rspack_module, exports, __webpack_require__) {
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
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron = __importStar(__webpack_require__(1288)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    appFeatures_1 = __webpack_require__(5976),
                    utils_1 = __webpack_require__(4161),
                    ZycordIPC_1 = __webpack_require__(1999),
                    nativeModules_1 = __webpack_require__(216),
                    notificationModuleStatus_1 = __webpack_require__(1279);
                function sendToAllWindows(channel, ...args) {
                    electron.BrowserWindow.getAllWindows().forEach((win) => {
                        let contents = win.webContents;
                        null != contents && contents.send(channel, ...args);
                    });
                }
                let moduleStatus = (0, notificationModuleStatus_1.unsupportedStatus)(process.platform),
                    nativeLib = null;
                function requireLoadedLib() {
                    if (null == nativeLib) throw (0, notificationModuleStatus_1.moduleUnavailableError)(moduleStatus);
                    return nativeLib;
                }
                if (
                    (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NOTIFICATIONS_GET_MODULE_STATUS, (_event) => Promise.resolve(moduleStatus)),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.NOTIFICATIONS_GET_AUTHORIZATION,
                        async (_event, provisional) => await requireLoadedLib().getAuthorization(provisional),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NOTIFICATIONS_GET_SETTINGS, async (_event) => await requireLoadedLib().getSettings()),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NOTIFICATIONS_SEND_NOTIFICATION, async (_event, options) =>
                        (0, notificationModuleStatus_1.normalizeSendResult)(await requireLoadedLib().sendNotification(options)),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NOTIFICATIONS_REMOVE_NOTIFICATIONS, async (_event, identifiers) => {
                        await requireLoadedLib().removeNotifications(identifiers);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.NOTIFICATIONS_REMOVE_ALL_NOTIFICATIONS, async (_event) => {
                        await requireLoadedLib().removeAllNotifications();
                    }),
                    utils_1.isOSX)
                ) {
                    let kernelMajor = (0, notificationModuleStatus_1.parseDarwinKernelMajor)(os_1.default.release());
                    if (kernelMajor < notificationModuleStatus_1.MIN_MACOS_KERNEL_MAJOR)
                        moduleStatus = (0, notificationModuleStatus_1.unsupportedStatus)(
                            process.platform,
                            `macOS kernel ${kernelMajor} < ${notificationModuleStatus_1.MIN_MACOS_KERNEL_MAJOR}`,
                        );
                    else if (null == moduleDataPath)
                        ((moduleStatus = (0, notificationModuleStatus_1.loadFailedStatus)(process.platform, "moduleDataPath is unavailable")),
                            console.error("zycord_notifications unavailable: moduleDataPath is unavailable"));
                    else
                        try {
                            let modulePath = (0, nativeModules_1.getModulePath)("zycord_notifications") ?? path_1.default.join(moduleDataPath, "zycord_notifications"),
                                lib = require(modulePath);
                            (lib.setDataPath(modulePath),
                                lib.setCallbacks(
                                    (action, identifier, userText, fallbackDeepLink) => {
                                        sendToAllWindows(ZycordIPC_1.IPCEvents.NOTIFICATIONS_RECEIVED_RESPONSE, action, identifier, userText, fallbackDeepLink);
                                    },
                                    (_identifier) => ["badge", "banner", "list", "sound"],
                                    (identifier) => {
                                        sendToAllWindows("USER_SETTINGS_OPEN", identifier, "Notifications");
                                    },
                                ),
                                (nativeLib = lib),
                                (moduleStatus = (0, notificationModuleStatus_1.loadedStatus)(process.platform)),
                                (0, appFeatures_1.getFeatures)().declareSupported("notifications"),
                                (0, appFeatures_1.getFeatures)().declareSupported("notifications_provisional"));
                        } catch (e) {
                            ((moduleStatus = (0, notificationModuleStatus_1.loadFailedStatus)(process.platform, e)),
                                console.error("zycord_notifications setup failed with error: ", e));
                        }
                } else if (utils_1.isWindows)
                    if (electron.Notification.isSupported())
                        try {
                            let lib = __webpack_require__(5385);
                            null == lib
                                ? ((moduleStatus = (0, notificationModuleStatus_1.loadFailedStatus)(process.platform, "zycord_notifications module not found")),
                                  console.error("zycord_notifications module not found."))
                                : (lib.setCallbacks((action, identifier, userText) => {
                                      sendToAllWindows(ZycordIPC_1.IPCEvents.NOTIFICATIONS_RECEIVED_RESPONSE, action, identifier, userText);
                                  }),
                                  (nativeLib = lib),
                                  (moduleStatus = (0, notificationModuleStatus_1.loadedStatus)(process.platform)),
                                  (0, appFeatures_1.getFeatures)().declareSupported("notifications"));
                        } catch (e) {
                            ((moduleStatus = (0, notificationModuleStatus_1.loadFailedStatus)(process.platform, e)),
                                console.error("zycord_notifications setup failed with error: ", e));
                        }
                    else moduleStatus = (0, notificationModuleStatus_1.unsupportedStatus)(process.platform, "electron.Notification is not supported");
            }