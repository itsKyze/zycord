1598(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let logfile;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.logFiles = exports.minidumpFiles = void 0),
                    (exports.captureMinidumpFromCrashpadSync = captureMinidumpFromCrashpadSync),
                    (exports.addMessage = addMessage),
                    (exports.addSentryReport = addSentryReport),
                    (exports.initializeRenderer = function (modulepath) {
                        storedModulepath = modulepath;
                    }),
                    (exports.initialize = initialize));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    util_1 = __importDefault(__webpack_require__(9023)),
                    processUtils_1 = __webpack_require__(5468),
                    utils_1 = __webpack_require__(4838),
                    fileWriteCounter = 0,
                    eventCounter = 0,
                    initialized = !1,
                    storedModulepath = null,
                    addMessageSequence = (0, utils_1.createLock)();
                function captureMinidumpFromCrashpadSync() {
                    if (null != storedModulepath)
                        try {
                            let dirContents,
                                reportsDir = path_1.default.join(electron_1.default.app.getPath("crashDumps"), processUtils_1.IS_WIN ? "reports" : "completed");
                            try {
                                dirContents = fs_1.default.readdirSync(reportsDir);
                            } catch (e) {
                                return;
                            }
                            let dmpFiles = dirContents
                                .filter((f) => f.endsWith(".dmp"))
                                .map((f) => {
                                    let fullPath = path_1.default.join(reportsDir, f);
                                    return { fullPath, mtime: fs_1.default.statSync(fullPath).mtimeMs };
                                })
                                .sort((a, b) => b.mtime - a.mtime);
                            if (0 === dmpFiles.length || Date.now() - dmpFiles[0].mtime > 6e4) return;
                            let crashlogsDir = path_1.default.join(storedModulepath, "crashlogs");
                            fs_1.default.existsSync(crashlogsDir) || fs_1.default.mkdirSync(crashlogsDir, { recursive: !0 });
                            let existingDmps = fs_1.default
                                .readdirSync(crashlogsDir)
                                .filter((f) => f.endsWith(".dmp"))
                                .map((f) => ({ fullPath: path_1.default.join(crashlogsDir, f), mtime: fs_1.default.statSync(path_1.default.join(crashlogsDir, f)).mtimeMs }))
                                .sort((a, b) => b.mtime - a.mtime);
                            if (existingDmps.length > 10)
                                for (let i = 10; i < existingDmps.length; i++)
                                    try {
                                        fs_1.default.unlinkSync(existingDmps[i].fullPath);
                                    } catch {}
                            let filenameStamp = new Date().toLocaleString("en-US", { timeZoneName: "short" }).replace(/[^\d\w]/g, "_"),
                                dmpFilename = `${filenameStamp}-${fileWriteCounter++}-minidump.dmp`,
                                dmpPath = path_1.default.join(crashlogsDir, dmpFilename);
                            (fs_1.default.writeFileSync(dmpPath, fs_1.default.readFileSync(dmpFiles[0].fullPath)),
                                fs_1.default.writeFileSync(path_1.default.join(crashlogsDir, "pending_minidump.txt"), dmpFilename),
                                console.log(`blackbox: captured minidump ${dmpFilename} from Crashpad`));
                        } catch (e) {
                            console.error(`blackbox: captureMinidumpFromCrashpadSync error ${e?.message}`);
                        }
                }
                class Files {
                    name;
                    extension;
                    static directory = void 0;
                    constructor(name, extension) {
                        ((this.name = name), (this.extension = extension));
                    }
                    static getBlackboxDirectory() {
                        if (void 0 === Files.directory)
                            try {
                                Files.directory = Files.getBlackboxDirectoryCore();
                            } catch (e) {
                                (console.error(`blackbox: getBlackboxDirectory error ${e?.message}`), (Files.directory = null));
                            }
                        return Files.directory;
                    }
                    static getBlackboxDirectoryCore() {
                        if (null == storedModulepath) return (console.error("blackbox: Unable to get module path"), null);
                        let crashlogsPath = path_1.default.join(storedModulepath, "crashlogs");
                        return (fs_1.default.existsSync(crashlogsPath) || fs_1.default.mkdirSync(crashlogsPath, { recursive: !0 }), fs_1.default.existsSync(crashlogsPath))
                            ? crashlogsPath
                            : (console.error("blackbox: Unable to create crashlogs directory"), null);
                    }
                    static orderFilesNewestFirst(files) {
                        return files
                            .map((file) => ({ file, time: fs_1.default.statSync(file).mtime.getTime() }))
                            .sort((a, b) => b.time - a.time)
                            .map((file) => file.file);
                    }
                    async getFiles() {
                        let blackboxDirectory = Files.getBlackboxDirectory();
                        if (null == blackboxDirectory) return [];
                        try {
                            let existing = (await fs_1.default.promises.readdir(blackboxDirectory)).filter((f) => f.endsWith("." + this.extension));
                            return Files.orderFilesNewestFirst(existing.map((file) => path_1.default.join(blackboxDirectory, file)));
                        } catch (e) {
                            return (console.error(`blackbox: getFiles error ${e?.message}`), []);
                        }
                    }
                    async getNewFilename() {
                        let blackboxDirectory = Files.getBlackboxDirectory();
                        if (null == blackboxDirectory) return null;
                        let existing = await this.getFiles();
                        if (existing.length > 10)
                            for (let i = 10; i < existing.length; i++) {
                                let file = existing[i];
                                try {
                                    (console.log(`blackbox: Deleting ${file}`), await fs_1.default.promises.unlink(file));
                                } catch (e) {
                                    console.error(`blackbox: unlink error ${file}, ${e?.message}`);
                                }
                            }
                        let filenameStamp = new Date().toLocaleString("en-US", { timeZoneName: "short" }).replace(/[^\d\w]/g, "_"),
                            filename = `${filenameStamp}-${fileWriteCounter++}-${this.name}.${this.extension}`;
                        return path_1.default.join(blackboxDirectory, filename);
                    }
                    async getNewestFile() {
                        return (await this.getFiles())[0] ?? null;
                    }
                }
                async function openLog(forcenew) {
                    if (forcenew || void 0 === logfile) {
                        if (null != logfile)
                            try {
                                await logfile.close();
                            } catch (e) {
                                console.error(`blackbox: openLog close error ${e?.message}`);
                            }
                        let logpath = forcenew ? await exports.logFiles.getNewFilename() : ((await exports.logFiles.getNewestFile()) ?? (await exports.logFiles.getNewFilename()));
                        if (null == logpath) return ((logfile = null), null);
                        logfile = await fs_1.default.promises.open(logpath, "a");
                    }
                    return logfile;
                }
                async function addMessage(message) {
                    await addMessageSequence(async () => {
                        try {
                            let log = await openLog(!1);
                            if (null == log) return;
                            let now = new Date().toLocaleString("en-US", { timeZoneName: "short" });
                            (console.log(`blackbox: ${now} ${eventCounter} ${message}`),
                                await log.write(`${now} ${eventCounter}: ${message}
`),
                                ++eventCounter,
                                await log.sync(),
                                (await log.stat()).size >= 204800 && (await openLog(!0)));
                        } catch (e) {
                            console.error(`blackbox: addMessage error ${e?.message}`);
                        }
                    });
                }
                async function addSentryReport(event) {
                    try {
                        await addMessage(`Sentry report: ${JSON.stringify(event)}`);
                    } catch (e) {
                        console.error(`blackbox: addSentryReport error ${e?.message}`);
                    }
                }
                async function initialize(modulepath, buildInfo) {
                    try {
                        await initializeCore(modulepath, buildInfo);
                    } catch (e) {
                        console.error(`blackbox: initialize error ${e?.message}`);
                    }
                }
                async function initializeCore(modulepath, buildInfo) {
                    if (initialized) return void console.error("blackbox: Ignoring double initialization of blackbox.");
                    function attachWebContentsEvents(webContents) {
                        let id = "unknown",
                            title = "";
                        try {
                            ((id = `web${webContents.id}`), (title = webContents.getTitle() ?? ""));
                        } catch (e) {
                            console.error(`blackbox: attachWebContentsEvents id error ${e?.message}`);
                        }
                        (addMessage(`\u{2705} webContents.created ${id} "${title}"`),
                            webContents.on("did-finish-load", () => addMessage(`\u{2705} webContents.did-finish-load ${id}`)),
                            webContents.on("preload-error", (_, _input, error) => addMessage(`\u{274C} webContents.preload-error ${id}: ${error?.message}`)),
                            webContents.on("destroyed", () => addMessage(`webContents.destroyed ${id}`)),
                            webContents.on("unresponsive", () => addMessage(`\u{274C} webContents.nresponsive ${id}`)),
                            webContents.on("did-fail-load", (_, code, desc) => addMessage(`\u{274C} webContents.did-fail-load ${id}" ${code} ${desc}`)),
                            webContents.on("did-fail-provisional-load", (_, code, desc) => addMessage(`\u{274C} webContents.did-fail-provisional-load ${id}: ${code} ${desc}`)));
                    }
                    for (let webContents of ((storedModulepath = modulepath),
                    await addMessage(`

----------------------------------------------`),
                    await addMessage(`Zycord starting: ${JSON.stringify(buildInfo)}, modulepath: ${modulepath}`),
                    electron_1.default.app.on("web-contents-created", (_, webContents) => attachWebContentsEvents(webContents)),
                    electron_1.default.webContents.getAllWebContents()))
                        attachWebContentsEvents(webContents);
                    function attachWindowEvents(window1) {
                        let id = "unknown",
                            title = "";
                        try {
                            ((id = `win${window1.id}`), (title = window1.title ?? ""));
                        } catch (e) {
                            console.error(`blackbox: attachWindowEvents id error ${e?.message}`);
                        }
                        (addMessage(`\u{2705} window.created ${id} "${title}"`),
                            window1.on("close", () => addMessage(`window.close ${id}`)),
                            window1.on("closed", () => addMessage(`window.closed ${id}`)));
                    }
                    for (let window1 of (electron_1.default.app.on("browser-window-created", (_, window1) => attachWindowEvents(window1)),
                    electron_1.default.BrowserWindow.getAllWindows()))
                        attachWindowEvents(window1);
                    (electron_1.default.app.on("child-process-gone", (_, details) => addMessage(`\u{274C} child-process-gone ${util_1.default.inspect(details)}`)),
                        electron_1.default.app.on("render-process-gone", (_, __, details) => {
                            (addMessage(`\u{274C} render-process-gone ${util_1.default.inspect(details)}`), captureMinidumpFromCrashpadSync());
                        }),
                        electron_1.default.app.on("before-quit", () => addMessage("before-quit")),
                        electron_1.default.app.on("will-quit", () => addMessage("will-quit")),
                        electron_1.default.app.on("quit", (_, exitCode) => addMessage(`quit ${exitCode}`)),
                        (initialized = !0));
                }
                ((exports.minidumpFiles = new Files("minidump", "dmp")), (exports.logFiles = new Files("events", "log")));
            }