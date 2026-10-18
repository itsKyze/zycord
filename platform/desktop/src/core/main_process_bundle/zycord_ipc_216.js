216(__unused_rspack_module, exports, __webpack_require__) {
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
                    (exports.injectModuleUpdater = function (moduleUpdater) {
                        injectedModuleUpdater = moduleUpdater;
                    }),
                    (exports.injectUpdater = function (updater) {
                        injectedUpdater = updater;
                    }),
                    (exports.getModulePath = getModulePath));
                let childProcess = __importStar(__webpack_require__(5317)),
                    electron = __importStar(__webpack_require__(1288)),
                    path = __importStar(__webpack_require__(6928)),
                    process1 = __importStar(__webpack_require__(932)),
                    nodeGlobalPaths_1 = __webpack_require__(7453),
                    {
                        NATIVE_MODULES_GET_PATHS,
                        NATIVE_MODULES_INSTALL,
                        NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP,
                        NATIVE_MODULES_GET_HAS_NEW_UPDATER,
                        NATIVE_MODULES_GET_MODULE_PATH,
                    } = __webpack_require__(3716).IPCEvents,
                    injectedModuleUpdater = null,
                    injectedUpdater = null;
                function getPathsResponse() {
                    return { mainAppDirname: global.mainAppDirname, browserModulePaths: (0, nodeGlobalPaths_1.getGlobalPaths)() };
                }
                async function newUpdaterInstall(updater, moduleName) {
                    try {
                        (await updater.installModule(moduleName), await updater.commitModules({}));
                    } catch (e) {
                        throw Error(`Failed to install ${moduleName}: ${e}`);
                    }
                }
                function getModulePath(name) {
                    let newUpdater = injectedUpdater?.getUpdater();
                    return null != newUpdater ? (newUpdater.committedModulePaths.get(name) ?? null) : null;
                }
                (electron.ipcMain.on(NATIVE_MODULES_GET_PATHS, (event) => {
                    event.returnValue = getPathsResponse();
                }),
                    electron.ipcMain.handle(NATIVE_MODULES_GET_PATHS, () => getPathsResponse()),
                    electron.ipcMain.handle(NATIVE_MODULES_INSTALL, async (_, moduleName) => {
                        let newUpdater = injectedUpdater?.getUpdater();
                        if (null != newUpdater) return newUpdaterInstall(newUpdater, moduleName);
                        let updater = injectedModuleUpdater;
                        if (null === updater) throw Error("Module updater is not available!");
                        let waitForInstall = new Promise((resolve, reject) => {
                            updater.events.on(updater.INSTALLED_MODULE, function installedHandler(installedModuleEvent) {
                                null != updater &&
                                    installedModuleEvent.name === moduleName &&
                                    (updater.events.removeListener(updater.INSTALLED_MODULE, installedHandler),
                                    installedModuleEvent.succeeded ? resolve() : reject(Error(`Failed to install ${moduleName}`)));
                            });
                        });
                        return (updater.install(moduleName, !1), await waitForInstall);
                    }),
                    electron.ipcMain.on(NATIVE_MODULES_GET_HAS_NEW_UPDATER, (event) => {
                        event.returnValue = injectedUpdater?.getUpdater() != null;
                    }),
                    electron.ipcMain.on(NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP, (_, [major, minor, revision]) => {
                        if ("number" != typeof major || "number" != typeof minor || "number" != typeof revision) throw Error("You tried.");
                        let hostVersionStr = `${major}.${minor}.${revision}`,
                            hostExePath = path.join(path.dirname(process1.execPath), "..", `app-${hostVersionStr}`, path.basename(process1.execPath));
                        (electron.app.once("will-quit", () => {
                            childProcess.spawn(hostExePath, [], { detached: !0, stdio: "inherit" });
                        }),
                            console.log(`Restarting from ${path.resolve(process1.execPath)} to ${path.resolve(hostExePath)}`),
                            electron.app.quit());
                    }),
                    electron.ipcMain.on(NATIVE_MODULES_GET_MODULE_PATH, (event, name) => {
                        event.returnValue = getModulePath(name) ?? null;
                    }));
            }