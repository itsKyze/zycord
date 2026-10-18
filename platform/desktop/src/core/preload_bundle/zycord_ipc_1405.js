1405(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getPath = getPath),
                    (exports.getCrashFiles = getCrashFiles),
                    (exports.getUpdaterLogs = getUpdaterLogs),
                    (exports.getSystemServiceLogs = getSystemServiceLogs),
                    (exports.getSquirrelLogs = getSquirrelLogs));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    original_fs_1 = __importDefault(__webpack_require__(215)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    util_1 = __importDefault(__webpack_require__(9023)),
                    processUtils_1 = __webpack_require__(5468),
                    constants_1 = __webpack_require__(3716),
                    allowedAppPaths = new Set(["home", "appData", "desktop", "documents", "downloads", "crashDumps", "exe", "videos", "temp"]),
                    readdir = util_1.default.promisify(fs_1.default.readdir);
                async function getPath(path) {
                    if (!allowedAppPaths.has(path)) throw Error(`${path} is not an allowed app path`);
                    return await electron_1.default.ipcRenderer.invoke(constants_1.IPCEvents.APP_GET_PATH, path);
                }
                async function orderedFiles(folder) {
                    try {
                        var filenames;
                        let filenames1 = await readdir(folder);
                        return (
                            await ((filenames = filenames1.map((filename) => path_1.default.join(folder, filename))),
                            Promise.allSettled(
                                filenames.map(
                                    (filename) =>
                                        new Promise((resolve, reject) => {
                                            original_fs_1.default.stat(filename, (err, stats) =>
                                                null != err ? reject(err) : stats.isFile() ? resolve({ filename, mtime: stats.mtime }) : reject(Error("Not a file")),
                                            );
                                        }),
                                ),
                            ))
                        )
                            .filter((result) => "fulfilled" === result.status)
                            .map((result) => result.value)
                            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
                            .map((a) => a.filename);
                    } catch (err) {
                        return [];
                    }
                }
                async function getCrashFiles() {
                    let crashBaseFolder = await getPath("crashDumps");
                    return orderedFiles(processUtils_1.IS_WIN ? path_1.default.join(crashBaseFolder, "reports") : path_1.default.join(crashBaseFolder, "completed"));
                }
                async function getUpdaterLogs() {
                    if (!processUtils_1.IS_WIN) return [];
                    {
                        let exeFile = await getPath("exe"),
                            exeBaseFolder = path_1.default.resolve(exeFile, ".."),
                            updaterLogFolder = path_1.default.resolve(exeBaseFolder, "..");
                        return (await orderedFiles(updaterLogFolder)).filter((f) => f.endsWith("updater_rCURRENT.log"));
                    }
                }
                async function getSystemServiceLogs() {
                    if (!processUtils_1.IS_WIN) return [];
                    {
                        let commonFilesPath = process.env.CommonProgramFiles;
                        if (null == commonFilesPath) {
                            let programFilesPath = process.env.ProgramFiles;
                            if (null == programFilesPath) return [];
                            commonFilesPath = path_1.default.join(programFilesPath, "Common Files");
                        }
                        let releaseChannel = window?.DiscordNative?.app.getReleaseChannel?.() ?? "stable",
                            channelFolder = "stable" === releaseChannel ? "Zycord" : `Zycord${releaseChannel.charAt(0).toUpperCase() + releaseChannel.slice(1)}`,
                            zycordServiceLogFolder = path_1.default.join(commonFilesPath, "Zycord", channelFolder, "logs");
                        return (await orderedFiles(zycordServiceLogFolder)).filter((f) => f.endsWith("admin_rCURRENT.log"));
                    }
                }
                async function getSquirrelLogs() {
                    if (!processUtils_1.IS_WIN) return [];
                    {
                        let filesToUpload = [],
                            exeFile = await getPath("exe"),
                            exeBaseFolder = path_1.default.resolve(exeFile, ".."),
                            updaterLogFolder = path_1.default.resolve(exeBaseFolder, ".."),
                            zycordChannelLog = path_1.default.join(updaterLogFolder, "SquirrelSetup.log");
                        fs_1.default.existsSync(zycordChannelLog) && filesToUpload.push(zycordChannelLog);
                        let appData = await getPath("appData"),
                            squirrelTempLog = path_1.default.join(appData, "Local", "SquirrelTemp", "SquirrelSetup.log");
                        return (fs_1.default.existsSync(squirrelTempLog) && filesToUpload.push(squirrelTempLog), filesToUpload);
                    }
                }
            },
            7523(module1, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let ZycordIPC_1 = __webpack_require__(1999);
                module1.exports = {
                    isAccessibilitySupportEnabled: function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.ACCESSIBILITY_GET_ENABLED);
                    },
                };
            },
            2100(module1, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    paths_1 = __webpack_require__(1405),
                    crashReporter_1 = __webpack_require__(8986),
                    releaseChannel = ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.APP_GET_RELEASE_CHANNEL_SYNC),
                    hostVersion = ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.APP_GET_HOST_VERSION_SYNC),
                    buildNumber = ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.APP_GET_BUILD_NUMBER),
                    appArch = ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.APP_GET_ARCH);
                (0, crashReporter_1.updateCrashReporter)({ nativeBuildNumber: buildNumber?.toString() ?? "null" });
                let moduleVersions = {};
                async function dockBounce(type) {
                    return await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_DOCK_BOUNCE, type);
                }
                (ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_GET_MODULE_VERSIONS).then((versions) => {
                    moduleVersions = versions;
                }),
                    electron_1.default.ipcRenderer.on("ZYCORD_MODULE_INSTALLED", async (_) => {
                        moduleVersions = await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_GET_MODULE_VERSIONS);
                    }),
                    (module1.exports = {
                        getReleaseChannel: function () {
                            return releaseChannel;
                        },
                        getVersion: function () {
                            return hostVersion;
                        },
                        getModuleVersions: function () {
                            return moduleVersions;
                        },
                        getBuildNumber: function () {
                            return buildNumber;
                        },
                        getAppArch: function () {
                            return appArch;
                        },
                        getPath: paths_1.getPath,
                        setBadgeCount: function (count) {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_SET_BADGE_COUNT, count);
                        },
                        dock: {
                            setBadge: function (badge) {
                                return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_DOCK_SET_BADGE, badge);
                            },
                            bounce: dockBounce,
                            cancelBounce: function (id) {
                                return "number" == typeof id && !isNaN(id) && id >= 0
                                    ? ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_DOCK_CANCEL_BOUNCE, id)
                                    : Promise.resolve();
                            },
                        },
                        relaunch: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_RELAUNCH);
                        },
                        getDefaultDoubleClickAction: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_GET_DEFAULT_DOUBLE_CLICK_ACTION);
                        },
                        pauseFrameEvictor: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_PAUSE_FRAME_EVICTOR);
                        },
                        unpauseFrameEvictor: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_UNPAUSE_FRAME_EVICTOR);
                        },
                        getPreferredSystemLanguages: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_GET_PREFERRED_SYSTEM_LANGUAGES);
                        },
                        getSystemUIDirection: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.APP_GET_SYSTEM_UI_DIRECTION_SYNC);
                        },
                        getOpenOnStart: function () {
                            return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.APP_GET_OPEN_ON_START);
                        },
                        registerUserInteractionHandler: function (elementId, eventType, callback) {
                            let element = document.getElementById(elementId);
                            if (null == element) throw Error(`Element with id '${elementId}' was not found`);
                            function handleUserInteraction(ev) {
                                ev.isTrusted && callback(ev);
                            }
                            return (
                                element.addEventListener(eventType, handleUserInteraction),
                                () => {
                                    element.removeEventListener(eventType, handleUserInteraction);
                                }
                            );
                        },
                    }));
            }