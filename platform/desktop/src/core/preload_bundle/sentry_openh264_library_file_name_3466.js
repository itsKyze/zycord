3466(__unused_rspack_module, exports, __webpack_require__) {
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
                    (exports.OPENH264_LIBRARY_FILE_NAME = exports.join = exports.dirname = exports.basename = exports.extname = void 0),
                    (exports.saveWithDialog = saveWithDialog),
                    (exports.saveWithDialog2 = saveWithDialog2),
                    (exports.showOpenDialog = showOpenDialog),
                    (exports.maybeDownloadMLModelFile = maybeDownloadMLModelFile),
                    (exports.stopMLModelDownloads = function () {
                        for (; mlModelDownloaders.length > 0;) {
                            let dl = mlModelDownloaders.pop()?.deref();
                            dl?.stop();
                        }
                    }),
                    (exports.checkMLModelFilesExist = checkMLModelFilesExist),
                    (exports.cleanupUnusedMLModelFiles = cleanupUnusedMLModelFiles),
                    (exports.maybeDownloadClipsFile = maybeDownloadClipsFile),
                    (exports.checkClipsFilesExist = checkClipsFilesExist),
                    (exports.cleanupUnusedClipsFiles = cleanupUnusedClipsFiles),
                    (exports.maybeDownloadOpenH264 = maybeDownloadOpenH264),
                    (exports.cleanupUnusedOpenH264Files = cleanupUnusedOpenH264Files),
                    (exports.getAndCreateLogDirectorySync = function () {
                        let logDir = null;
                        try {
                            logDir = getLogPathSync();
                        } catch (e) {
                            console.error("Failed to get log directory: ", e);
                        }
                        if (null != logDir)
                            try {
                                fs_1.default.mkdirSync(logDir, { recursive: !0 });
                            } catch (e) {
                                console.warn("Could not create module log directory ", logDir, ":", e);
                            }
                        return logDir;
                    }),
                    (exports.logLevelSync = function () {
                        return Settings.getSync("LOG_LEVEL", "info");
                    }),
                    (exports.readLogFiles = readLogFiles),
                    (exports.combineWebRtcLogs = combineWebRtcLogs),
                    (exports.uploadZycordHookCrashes = uploadZycordHookCrashes),
                    (exports.showItemInFolder = function (path) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_ITEM_IN_FOLDER, path);
                    }),
                    (exports.openFiles = openFiles),
                    (exports.readVoiceMessageRecording = readVoiceMessageRecording),
                    (exports.deleteVoiceMessageRecording = deleteVoiceMessageRecording),
                    (exports.getMLDataDir = getMLDataDir),
                    (exports.getMLDataDirSync = getMLDataDirSync),
                    (exports.getClipsDataDir = getClipsDataDir),
                    (exports.getClipsDataDirSync = getClipsDataDirSync),
                    (exports.getClipsSentryDirSync = function () {
                        return path_1.default.join(path_1.default.dirname(getAssetCachePathSync()), "sentry_clips");
                    }),
                    (exports.getOpenH264Dir = getOpenH264Dir),
                    (exports.getOpenH264LibraryPathSync = function () {
                        let assetCachePath = getAssetCachePathSync();
                        if (null != assetCachePath) return path_1.default.join(assetCachePath, "openh264", exports.OPENH264_LIBRARY_FILE_NAME);
                    }),
                    (exports.getModulePath = getModulePath),
                    (exports.getModuleDataPathSync = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_DATA_PATH_SYNC);
                    }),
                    (exports.getLogPath = getLogPath),
                    (exports.getLogPathSync = getLogPathSync),
                    (exports.getAssetCachePath = getAssetCachePath),
                    (exports.getAssetCachePathSync = getAssetCachePathSync),
                    (exports.createDirectoryIfNotExists = function (path, hidden) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_CREATE_DIRECTORY_IF_NOT_EXISTS, path, hidden);
                    }));
                let unbzip2_stream_1 = __importDefault(__webpack_require__(787)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    node_downloader_helper_1 = __webpack_require__(4360),
                    node_crypto_1 = __webpack_require__(7598),
                    promises_1 = __webpack_require__(1455),
                    node_stream_1 = __webpack_require__(7075),
                    promises_2 = __webpack_require__(6466),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    blackbox = __importStar(__webpack_require__(1598)),
                    utils_1 = __webpack_require__(4838),
                    ZycordIPC_1 = __webpack_require__(1999),
                    fileutils_1 = __webpack_require__(9590),
                    paths_1 = __webpack_require__(1405),
                    crashReporter_1 = __webpack_require__(8986),
                    endpoints_1 = __importDefault(__webpack_require__(3397)),
                    files_1 = __webpack_require__(5696),
                    minidump_1 = __webpack_require__(278),
                    Settings = __importStar(__webpack_require__(6434)),
                    voiceMessageRecordingFiles_1 = __webpack_require__(2632);
                var path_2 = __webpack_require__(6928);
                (Object.defineProperty(exports, "extname", {
                    enumerable: !0,
                    get: function () {
                        return path_2.extname;
                    },
                }),
                    Object.defineProperty(exports, "basename", {
                        enumerable: !0,
                        get: function () {
                            return path_2.basename;
                        },
                    }),
                    Object.defineProperty(exports, "dirname", {
                        enumerable: !0,
                        get: function () {
                            return path_2.dirname;
                        },
                    }),
                    Object.defineProperty(exports, "join", {
                        enumerable: !0,
                        get: function () {
                            return path_2.join;
                        },
                    }));
                let uploadHookCrashSequence = (0, utils_1.createLock)(),
                    combineWebRtcLogsSequence = (0, utils_1.createLock)();
                async function saveWithDialog(fileContents, fileName, defaultDirectory) {
                    let result = await saveWithDialog2(fileContents, fileName, defaultDirectory, !0);
                    return result?.directory ?? null;
                }
                async function saveWithDialog2(fileContents, fileName, defaultDirectory, throwOnCancel = !1) {
                    if ((0, files_1.containsInvalidFileChar)(fileName)) throw Error("fileName has invalid characters");
                    let defaultPath = null != defaultDirectory && "" !== defaultDirectory ? defaultDirectory : await (0, paths_1.getPath)("downloads"),
                        options = { defaultPath: path_1.default.join(defaultPath, fileName) },
                        extension = path_1.default.extname(fileName);
                    if (null != extension && "" !== extension && "." !== extension) {
                        let trimmedExtension = extension.slice(1);
                        options.filters = [
                            { name: trimmedExtension, extensions: [trimmedExtension] },
                            { name: "All", extensions: ["*"] },
                        ];
                    }
                    let results = await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_SAVE_DIALOG, options);
                    if (null == results || null == results.filePath) return null;
                    if (results.canceled || "" === results.filePath) {
                        if (throwOnCancel) throw Error("Save dialog was canceled by user");
                        return { canceledByUser: !0, filePath: "", directory: "" };
                    }
                    return (
                        fs_1.default.writeFileSync(results.filePath, fileContents),
                        { canceledByUser: !1, filePath: results.filePath, directory: path_1.default.dirname(results.filePath) }
                    );
                }
                async function showOpenDialog({ filters, properties }) {
                    return (await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_OPEN_DIALOG, { filters, properties })).filePaths;
                }
                async function maybeDownloadAsset(cdnURL, fileName, category, onProgress) {
                    let { destination, downloaders } = category;
                    if ((0, files_1.containsInvalidFileChar)(fileName)) throw Error(category.name + " fileName has invalid characters");
                    if (!fileName) throw Error(category.name + " fileName is not set");
                    try {
                        await (0, promises_1.mkdir)(destination, { recursive: !0 });
                    } catch (cause) {
                        throw Error(category.name + " unable create data dir", { cause });
                    }
                    let finishedFilePath = path_1.default.join(destination, fileName);
                    try {
                        return (await fs_1.default.promises.access(finishedFilePath), { fetchedFromNetwork: !1 });
                    } catch {}
                    let partialFileName = `${fileName}.partial`,
                        partialFilePath = path_1.default.join(destination, partialFileName),
                        dl = new node_downloader_helper_1.DownloaderHelper(cdnURL, destination, {
                            method: "GET",
                            resumeOnIncomplete: !0,
                            resumeOnIncompleteMaxRetry: 5,
                            resumeIfFileExists: !0,
                            fileName: partialFileName,
                            retry: { maxRetries: 3, delay: 1e3 },
                            removeOnStop: !1,
                            removeOnFail: !1,
                            progressThrottle: 200,
                        });
                    return (
                        downloaders.push(new WeakRef(dl)),
                        new Promise((resolve, reject) => {
                            (dl.on("end", ({ incomplete }) => {
                                incomplete
                                    ? reject(Error(category.name + " download incomplete"))
                                    : (0, promises_1.rename)(partialFilePath, finishedFilePath)
                                          .then(() => resolve({ fetchedFromNetwork: !0 }))
                                          .catch(reject);
                            }),
                                dl.on("skip", (_stats) => {
                                    (0, promises_1.rename)(partialFilePath, finishedFilePath)
                                        .then(() => resolve({ fetchedFromNetwork: !1 }))
                                        .catch(reject);
                                }),
                                dl.on("progress.throttled", ({ downloaded: downloadedBytes, total: totalBytes }) => {
                                    onProgress({ downloadedBytes, totalBytes });
                                }),
                                dl.on("timeout", () => reject(Error(category.name + " timeout"))),
                                dl.on("error", reject),
                                dl.on("stop", () => reject({ USER_CANCELED_DOWNLOAD: !0 })),
                                dl.start().catch(reject));
                        })
                    );
                }
                async function cleanupUnusedAssets(neededFileNames, assetPath, category) {
                    let deletedFiles = [],
                        errors = [];
                    try {
                        try {
                            await fs_1.default.promises.access(assetPath);
                        } catch {
                            return { deletedFiles, errors };
                        }
                        let existingFiles = await fs_1.default.promises.readdir(assetPath),
                            neededFileSet = new Set(neededFileNames),
                            neededPartialFileSet = new Set(neededFileNames.map((fileName) => `${fileName}.partial`));
                        for (let fileName of existingFiles) {
                            if (neededFileSet.has(fileName)) continue;
                            if (fileName.endsWith(".partial")) {
                                if (neededPartialFileSet.has(fileName)) continue;
                            } else if (fileName.startsWith(".") || !fileName.includes(".")) continue;
                            let fullPath = path_1.default.join(assetPath, fileName);
                            try {
                                (await fs_1.default.promises.unlink(fullPath), deletedFiles.push(fileName), console.log(`${category} cleanup: Deleted unused file "${fileName}"`));
                            } catch (error) {
                                let errorMsg = `Failed to delete "${fileName}": ${error}`;
                                (errors.push(errorMsg), console.error(`${category} cleanup: ${errorMsg}`));
                            }
                        }
                        deletedFiles.length > 0 && console.log(`${category} cleanup: Deleted ${deletedFiles.length} unused files`);
                    } catch (cause) {
                        let errorMsg = `${category} cleanup failed: ${cause}`;
                        (errors.push(errorMsg), console.error(errorMsg));
                    }
                    return { deletedFiles, errors };
                }
                let mlModelDownloaders = [];
                async function maybeDownloadMLModelFile(cdnURL, fileName, onProgress) {
                    let mlModelsDataPath;
                    if (!cdnURL.startsWith("https://app.zyron.site/assets/content")) throw Error("ML Models invalid CDN URL");
                    try {
                        mlModelsDataPath = await getMLDataDir();
                    } catch (cause) {
                        throw Error("ML Models unable to get path of data dir", { cause });
                    }
                    return maybeDownloadAsset(cdnURL, fileName, { name: "ML Models", destination: mlModelsDataPath, downloaders: mlModelDownloaders }, onProgress);
                }
                async function checkMLModelFilesExist(files) {
                    let mlModelsDataPath;
                    try {
                        mlModelsDataPath = getMLDataDirSync();
                    } catch (cause) {
                        throw Error("ML Models unable to get path of data dir", { cause });
                    }
                    return await Promise.all(
                        files.map(async (file) => {
                            let fullPath = path_1.default.join(mlModelsDataPath, file.fileName);
                            try {
                                return (await fs_1.default.promises.access(fullPath), { ...file, exists: !0 });
                            } catch (error) {
                                return { ...file, exists: !1 };
                            }
                        }),
                    );
                }
                async function cleanupUnusedMLModelFiles(neededFileNames) {
                    let mlModelsDataPath;
                    try {
                        mlModelsDataPath = await getMLDataDir();
                    } catch (cause) {
                        let errorMsg = `ML Models cleanup failed: ${cause}`;
                        return (console.error(errorMsg), { deletedFiles: [], errors: [errorMsg] });
                    }
                    return cleanupUnusedAssets(neededFileNames, mlModelsDataPath, "ML Models");
                }
                async function maybeDownloadClipsFile(cdnURL, fileName, onProgress) {
                    let clipsDataPath;
                    if (!cdnURL.startsWith("https://app.zyron.site/assets/content/")) throw Error("Clips invalid CDN URL");
                    try {
                        clipsDataPath = await getClipsDataDir();
                    } catch (cause) {
                        throw Error("Clips unable to get path of data dir", { cause });
                    }
                    return maybeDownloadAsset(cdnURL, fileName, { name: "Clips", destination: clipsDataPath, downloaders: [] }, onProgress);
                }
                async function checkClipsFilesExist(files) {
                    let clipsDataPath;
                    try {
                        clipsDataPath = getClipsDataDirSync();
                    } catch (cause) {
                        throw Error("Clips unable to get path of data dir", { cause });
                    }
                    return await Promise.all(
                        files.map(async (file) => {
                            let fullPath = path_1.default.join(clipsDataPath, file.fileName);
                            try {
                                return (await fs_1.default.promises.access(fullPath), { ...file, exists: !0 });
                            } catch (error) {
                                return { ...file, exists: !1 };
                            }
                        }),
                    );
                }
                async function cleanupUnusedClipsFiles(neededFileNames) {
                    let clipsDataPath;
                    try {
                        clipsDataPath = await getClipsDataDir();
                    } catch (cause) {
                        let errorMsg = `Clips cleanup failed: ${cause}`;
                        return (console.error(errorMsg), { deletedFiles: [], errors: [errorMsg] });
                    }
                    return cleanupUnusedAssets(neededFileNames, clipsDataPath, "Clips");
                }
                async function maybeDownloadOpenH264(cdnURL, fileName, sha256, onProgress) {
                    let openH264Path;
                    if (!cdnURL.startsWith("https://ciscobinary.openh264.org/")) throw Error("OpenH264 invalid CDN URL");
                    if (!cdnURL.endsWith(".bz2")) throw Error("OpenH264 CDN URL must point to a bzip2 archive");
                    try {
                        openH264Path = await getOpenH264Dir();
                    } catch (cause) {
                        throw Error("Unable to get OpenH264 path", { cause });
                    }
                    let filePath = path_1.default.join(openH264Path, fileName);
                    try {
                        return (await fs_1.default.promises.access(filePath), { fetchedFromNetwork: !1 });
                    } catch {}
                    let archiveName = fileName + ".bz2",
                        result = await maybeDownloadAsset(cdnURL, archiveName, { name: "OpenH264", destination: openH264Path, downloaders: [] }, onProgress),
                        archivePath = openH264Path + "/" + archiveName,
                        stream = (0, unbzip2_stream_1.default)(node_stream_1.Readable.toWeb(fs_1.default.createReadStream(archivePath))),
                        hash = (0, node_crypto_1.createHash)("sha256");
                    try {
                        await (0, promises_2.pipeline)(
                            stream,
                            async function* (source) {
                                for await (let chunk of source) (hash.update(chunk), yield chunk);
                            },
                            fs_1.default.createWriteStream(filePath),
                        );
                    } catch (cause) {
                        try {
                            await cleanupUnusedOpenH264Files([]);
                        } catch (e) {
                            console.warn("Removing bad OpenH264 download failed", e);
                        }
                        throw Error("OpenH264 unbzip2 failed", { cause });
                    }
                    let calcSha = hash.digest("hex");
                    if (calcSha !== sha256) {
                        try {
                            await cleanupUnusedOpenH264Files([]);
                        } catch (e) {
                            console.warn("Removing bad OpenH264 download failed", e);
                        }
                        throw Error("OpenH264 Expected sha256 " + sha256 + ", but got " + calcSha);
                    }
                    return result;
                }
                async function cleanupUnusedOpenH264Files(neededFileNames) {
                    let openH264Path;
                    try {
                        openH264Path = await getOpenH264Dir();
                    } catch (cause) {
                        let errorMsg = `OpenH264 cleanup failed: ${cause}`;
                        return (console.error(errorMsg), { deletedFiles: [], errors: [errorMsg] });
                    }
                    return cleanupUnusedAssets(neededFileNames, openH264Path, "OpenH264");
                }
                async function readLogFiles(maxSize, compressLogs = !1) {
                    (await combineWebRtcLogs("zycord-webrtc_0", "zycord-webrtc_1", "zycord-webrtc"),
                        await combineWebRtcLogs("zycord-last-webrtc_0", "zycord-last-webrtc_1", "zycord-last-webrtc"));
                    let modulePath = await getModulePath(),
                        voicePath = path_1.default.join(modulePath, "zycord_voice"),
                        utilsPath = path_1.default.join(modulePath, "zycord_utils"),
                        filesToUpload = [path_1.default.join(voicePath, "audio_state.json"), path_1.default.join(utilsPath, "live_minidump.dmp")],
                        logPath = await getLogPath(),
                        validLogFiles = (await (0, promises_1.readdir)(logPath))
                            .filter((filename) => filename.endsWith(".log"))
                            .map((filename) => path_1.default.join(logPath, filename));
                    filesToUpload.push(...validLogFiles);
                    let voiceLogFiles = ["zycord-webrtc", "zycord-last-webrtc"]
                        .map((filename) => path_1.default.join(logPath, filename))
                        .filter((filename) => fs_1.default.existsSync(filename));
                    (filesToUpload.push(...voiceLogFiles), blackbox.initializeRenderer(modulePath));
                    let minidump = await blackbox.minidumpFiles.getNewestFile();
                    null != minidump && filesToUpload.push(minidump);
                    let blackboxLog = await blackbox.logFiles.getNewestFile();
                    null != blackboxLog && filesToUpload.push(blackboxLog);
                    let updaterLogs = await (0, paths_1.getUpdaterLogs)();
                    updaterLogs.length > 0 && filesToUpload.push(updaterLogs[0]);
                    let systemServiceLogs = await (0, paths_1.getSystemServiceLogs)();
                    systemServiceLogs.length > 0 && filesToUpload.push(systemServiceLogs[0]);
                    let squirrelLogs = await (0, paths_1.getSquirrelLogs)();
                    squirrelLogs.length > 0 && filesToUpload.push(...squirrelLogs);
                    let crashFiles = await (0, paths_1.getCrashFiles)();
                    return (
                        crashFiles.length > 0 && filesToUpload.push(crashFiles[0]),
                        (0, fileutils_1.readFulfilledFiles)(
                            filesToUpload,
                            maxSize,
                            !1,
                            (filename) => (0, files_1.isMinidumpFile)(filename) || (compressLogs && (filename.endsWith(".log") || filename.endsWith("webrtc"))),
                        )
                    );
                }
                async function combineWebRtcLogs(path1, path2, destinationPath) {
                    let logPath = await getLogPath(),
                        webRtcFile1 = path_1.default.join(logPath, path1),
                        webRtcFile2 = path_1.default.join(logPath, path2),
                        combinedFilePath = path_1.default.join(logPath, destinationPath);
                    await combineWebRtcLogsSequence(async () => {
                        try {
                            let [file1Data, file2Data] = await Promise.all([
                                fs_1.default.promises.readFile(webRtcFile1).catch((_) => null),
                                fs_1.default.promises.readFile(webRtcFile2).catch((_) => null),
                            ]);
                            if (null !== file1Data && null === file2Data) await fs_1.default.promises.writeFile(combinedFilePath, file1Data);
                            else if (null === file1Data && null !== file2Data) await fs_1.default.promises.writeFile(combinedFilePath, file2Data);
                            else if (null !== file1Data && null !== file2Data) {
                                let webRtcFile1Stats = await fs_1.default.promises.stat(webRtcFile1),
                                    webRtcFile2Stats = await fs_1.default.promises.stat(webRtcFile2);
                                webRtcFile1Stats.mtimeMs > webRtcFile2Stats.mtimeMs
                                    ? await fs_1.default.promises.writeFile(combinedFilePath, Buffer.concat([file2Data, file1Data]))
                                    : await fs_1.default.promises.writeFile(combinedFilePath, Buffer.concat([file1Data, file2Data]));
                            }
                        } catch (e) {
                            console.error(`combineWebRtcLogs: Failed ${e?.message}`, e);
                        }
                    });
                }
                async function uploadHookMinidumpFile(filename, fullpath, metadata) {
                    let blob = new Blob([(await (0, fileutils_1.readFulfilledFiles)([fullpath], 0xa00000, !0))[0].data], { type: "text/plain" }),
                        minidump = await (0, minidump_1.readMinidump)(fullpath),
                        formData = new FormData();
                    for (let key of Object.keys(metadata)) formData.append(key, String(metadata[key]));
                    return (
                        formData.append("sentry[tags][game]", minidump?.processName ?? "Unknown"),
                        formData.append("game", minidump?.processName ?? "Unknown"),
                        formData.append("upload_file_minidump", blob, filename),
                        { response: await fetch(endpoints_1.default.HOOK_MINIDUMP_SENTRY, { method: "POST", body: formData }), minidump }
                    );
                }
                async function uploadZycordHookCrashes() {
                    let metadata = (0, crashReporter_1.getFlattenedMetadata)(),
                        crashCount = 0,
                        minidumps = [];
                    return (
                        await uploadHookCrashSequence(async () => {
                            try {
                                let modulePath = await getModulePath(),
                                    hookPath = path_1.default.join(modulePath, "zycord_hook");
                                for (let filename of await fs_1.default.promises.readdir(hookPath)) {
                                    if (!(0, files_1.isHookMinidumpFile)(filename)) continue;
                                    ++crashCount;
                                    let fullpath = path_1.default.join(hookPath, filename);
                                    try {
                                        console.log(`uploadZycordHookCrashes: Uploading "${fullpath}".`);
                                        let uploadResult = await uploadHookMinidumpFile(filename, fullpath, metadata);
                                        (console.log(`uploadZycordHookCrashes: Uploaded "${uploadResult.response?.status}".`),
                                            null != uploadResult.minidump && minidumps.push(uploadResult.minidump));
                                    } catch (e) {
                                        console.error(`uploadZycordHookCrashes: uploadHookMinidumpFile failed ${fullpath}: ${e}`);
                                    }
                                    console.log("uploadZycordHookCrashes: Deleting.");
                                    try {
                                        await fs_1.default.promises.unlink(fullpath);
                                    } catch (e) {
                                        console.error(`uploadZycordHookCrashes: unlink failed ${fullpath}: ${e}`);
                                    }
                                }
                            } catch (e) {
                                console.error(`uploadZycordHookCrashes: Failed ${e}`);
                            }
                            0 === crashCount && console.log("uploadZycordHookCrashes: No crash reports found.");
                        }),
                        minidumps
                    );
                }
                async function openFiles(dialogOptions, maxSize) {
                    let filenames = await showOpenDialog(dialogOptions);
                    return (0, fileutils_1.readFulfilledFiles)(filenames, maxSize, !0);
                }
                async function getValidatedVoiceMessageRecordingPath(filePath) {
                    let moduleDataPath = await getModulePath(),
                        recordingPath = (0, voiceMessageRecordingFiles_1.resolveVoiceMessageRecordingPath)(moduleDataPath, filePath);
                    return (await (0, voiceMessageRecordingFiles_1.validateVoiceMessageRecordingFile)(recordingPath), recordingPath);
                }
                async function readVoiceMessageRecording(filePath) {
                    let recordingPath = await getValidatedVoiceMessageRecordingPath(filePath),
                        [file] = await (0, fileutils_1.readFulfilledFiles)([recordingPath], 0x1900000, !0);
                    return file;
                }
                async function deleteVoiceMessageRecording(filePath) {
                    let moduleDataPath = await getModulePath(),
                        recordingPath = (0, voiceMessageRecordingFiles_1.resolveVoiceMessageRecordingPath)(moduleDataPath, filePath);
                    await (0, voiceMessageRecordingFiles_1.deleteVoiceMessageRecordingFile)(recordingPath);
                }
                async function getMLDataDir() {
                    let assetCachePath = await getAssetCachePath();
                    return path_1.default.join(assetCachePath, "ml");
                }
                function getMLDataDirSync() {
                    return path_1.default.join(getAssetCachePathSync(), "ml");
                }
                async function getClipsDataDir() {
                    let assetCachePath = await getAssetCachePath();
                    return path_1.default.join(assetCachePath, "clips");
                }
                function getClipsDataDirSync() {
                    return path_1.default.join(getAssetCachePathSync(), "clips");
                }
                async function getOpenH264Dir() {
                    let assetCachePath = await getAssetCachePath();
                    return path_1.default.join(assetCachePath, "openh264");
                }
                function getModulePath() {
                    return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_PATH);
                }
                function getLogPath() {
                    return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_LOG_PATH);
                }
                function getLogPathSync() {
                    return ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_LOG_PATH_SYNC);
                }
                function getAssetCachePath() {
                    return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_ASSET_CACHE_PATH);
                }
                function getAssetCachePathSync() {
                    return ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_ASSET_CACHE_PATH_SYNC);
                }
                exports.OPENH264_LIBRARY_FILE_NAME = "libopenh264-2.5.1-linux64.7.so";
            }