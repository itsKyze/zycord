4943(__unused_rspack_module, exports, __webpack_require__) {
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
                    (exports.injectBuildInfo = function (buildInfo) {
                        injectedBuildInfo = buildInfo;
                    }),
                    (exports.injectModuleUpdater = function (moduleUpdater) {
                        injectedModuleUpdater = moduleUpdater;
                    }),
                    (exports.injectUpdater = function (updater) {
                        injectedUpdater = updater;
                    }));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    process1 = __importStar(__webpack_require__(932)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    injectedBuildInfo = null,
                    injectedModuleUpdater = null,
                    injectedUpdater = null;
                async function newUpdaterGetModuleVersions(updater) {
                    return (await updater.queryCurrentVersionsWithOptions({})).current_modules;
                }
                (ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.APP_GET_RELEASE_CHANNEL_SYNC, (event) => {
                    event.returnValue = injectedBuildInfo.releaseChannel;
                }),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.APP_GET_HOST_VERSION_SYNC, (event) => {
                        event.returnValue = electron_1.default.app.getVersion();
                    }),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.APP_GET_SYSTEM_UI_DIRECTION_SYNC, (event) => {
                        event.returnValue = "rtl" === electron_1.default.app.commandLine.getSwitchValue("force-ui-direction") ? "rtl" : "ltr";
                    }),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.APP_GET_BUILD_NUMBER, (event) => {
                        let newUpdater = injectedUpdater?.getUpdater();
                        if (null != newUpdater) {
                            let version;
                            event.returnValue =
                                null != (version = newUpdater.queryCurrentVersionsWithOptionsSync({})).running_update
                                    ? version.running_update.metadata_version
                                    : version.last_successful_update.metadata_version;
                            return;
                        }
                        event.returnValue = null;
                    }),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.APP_GET_ARCH, (event) => {
                        event.returnValue = process1.arch;
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_GET_MODULE_VERSIONS, async (_) => {
                        let newUpdater = injectedUpdater?.getUpdater();
                        if (null != newUpdater) return newUpdaterGetModuleVersions(newUpdater);
                        let versions = {},
                            installed = null != injectedModuleUpdater ? injectedModuleUpdater.getInstalled() : {};
                        for (let name of Object.keys(installed)) versions[name] = installed[name].installedVersion;
                        return versions;
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_GET_PATH, async (_, path) => electron_1.default.app.getPath(path)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_SET_BADGE_COUNT, async (_, count) => {
                        electron_1.default.app.setBadgeCount(count);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_DOCK_SET_BADGE, async (_, badge) => {
                        null != electron_1.default.app.dock && electron_1.default.app.dock.setBadge(badge);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_DOCK_BOUNCE, async (_, type) =>
                        null != electron_1.default.app.dock ? electron_1.default.app.dock.bounce(type) : -1,
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_DOCK_CANCEL_BOUNCE, async (_, id) => {
                        null != electron_1.default.app.dock && electron_1.default.app.dock.cancelBounce(id);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_RELAUNCH, async (_) => {
                        (electron_1.default.session.defaultSession.flushStorageData(), electron_1.default.app.relaunch(), electron_1.default.app.exit(0));
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_GET_DEFAULT_DOUBLE_CLICK_ACTION, async (_) =>
                        electron_1.default.systemPreferences.getUserDefault("AppleActionOnDoubleClick", "string"),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_PAUSE_FRAME_EVICTOR, async (_) => electron_1.default.app.pauseFrameEvictionManager?.()),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_UNPAUSE_FRAME_EVICTOR, async (_) => electron_1.default.app.unpauseFrameEvictionManager?.()),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.APP_GET_PREFERRED_SYSTEM_LANGUAGES, async (_) =>
                        electron_1.default.app.getPreferredSystemLanguages(),
                    ));
            }