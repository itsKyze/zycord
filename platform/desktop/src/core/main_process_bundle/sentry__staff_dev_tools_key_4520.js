4520(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports._STAFF_DEV_TOOLS_KEY = void 0),
                    (exports.tryLoadStaffDevToolsModule = tryLoadStaffDevToolsModule));
                let electron_1 = __webpack_require__(1288),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    url_1 = __importDefault(__webpack_require__(7016)),
                    buildInfo_1 = __webpack_require__(2130),
                    crashReporterSetup_1 = __webpack_require__(2283),
                    paths_1 = __webpack_require__(822),
                    buildInfo = buildInfo_1.buildInfo,
                    LOG_PREFIX = "[STAFF_DEV_TOOLS]";
                function log(message) {
                    console.log(`${LOG_PREFIX} ${message}`);
                }
                exports._STAFF_DEV_TOOLS_KEY = "ENABLE_STAFF_DEV_TOOLS_BUNDLE";
                let _STAFF_DEV_TOOLS_ACTIVE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAIoaTnSgNjloxqzHKGBXIp0F7JX3AaZKZCocqMBpSi/A=
-----END PUBLIC KEY-----`;
                function _verifyStaffDevToolsSignature(version, hash, signatureB64) {
                    let crypto = __webpack_require__(6982);
                    if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error(`Invalid version format: ${version}`);
                    let payload = Buffer.from(`staff_dev_tools:v1:${version}:${hash.toLowerCase()}`),
                        signature = Buffer.from(signatureB64, "base64");
                    if (!crypto.verify(null, payload, _STAFF_DEV_TOOLS_ACTIVE_PUBLIC_KEY, signature)) throw Error("Module signature verification failed");
                }
                async function _getTokenFromDisk(userDataPath) {
                    let entries,
                        leveldbDir = path_1.default.join(userDataPath, "Local Storage", "leveldb");
                    try {
                        entries = await fs_1.default.promises.readdir(leveldbDir);
                    } catch (_e) {
                        return (log("Token read failed: leveldb directory not found"), null);
                    }
                    let files = entries.filter((f) => f.endsWith(".ldb") || f.endsWith(".log"));
                    for (let file of (files.sort().reverse(), files))
                        try {
                            let str = (await fs_1.default.promises.readFile(path_1.default.join(leveldbDir, file))).toString("latin1"),
                                encryptedMatches = [...str.matchAll(/"(dQw4w9WgXcQ:[A-Za-z0-9+/=]+)"/g)];
                            if (encryptedMatches.length > 0) {
                                let encryptedPart = encryptedMatches[encryptedMatches.length - 1][1].substring(12);
                                try {
                                    return electron_1.safeStorage.decryptString(Buffer.from(encryptedPart, "base64"));
                                } catch (e) {
                                    log(`Token decryption failed in ${file}: ${e instanceof Error ? e.message : e}`);
                                }
                            }
                            let plaintextMatches = [...str.matchAll(/"([\w-]{24,}\.[\w-]{6,}\.[\w-]{27,})"/g)];
                            if (plaintextMatches.length > 0) return plaintextMatches[plaintextMatches.length - 1][1];
                        } catch (_e) {}
                    return (log("Token not found in Local Storage"), null);
                }
                let _staffDevToolsLoading = null,
                    _staffDevToolsModule = null;
                async function tryLoadStaffDevToolsModule(mainWindow, webappEndpoint) {
                    if (!(null == mainWindow || mainWindow.isDestroyed())) {
                        if (null != _staffDevToolsModule) {
                            try {
                                (_staffDevToolsModule.installBridge(), log("Bridge reinstalled for new renderer context"));
                            } catch (e) {
                                let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                                sentry?.captureException(e instanceof Error ? e : Error(`${LOG_PREFIX} Bridge reinstall failed: ${e}`));
                            }
                            return;
                        }
                        if (null != _staffDevToolsLoading) return void (await _staffDevToolsLoading);
                        _staffDevToolsLoading = _tryLoadStaffDevToolsModuleImpl(mainWindow, webappEndpoint);
                        try {
                            await _staffDevToolsLoading;
                        } finally {
                            _staffDevToolsLoading = null;
                        }
                    }
                }
                async function _tryLoadStaffDevToolsModuleImpl(mainWindow, webappEndpoint) {
                    if (
                        (function () {
                            if (null == buildInfo.localModulesRoot) return !1;
                            let localModulePath = path_1.default.join(buildInfo.localModulesRoot, "..", "..", "native_modules", "zycord_staff_dev_tools");
                            if (!fs_1.default.existsSync(path_1.default.join(localModulePath, "package.json"))) return !1;
                            try {
                                let zycordStaffDevTools = require(localModulePath);
                                return (
                                    zycordStaffDevTools.init(),
                                    zycordStaffDevTools.installBridge(),
                                    global.features.declareSupported("staff_dev_tools"),
                                    (_staffDevToolsModule = zycordStaffDevTools),
                                    log("Module loaded from local native_modules (dev mode)"),
                                    !0
                                );
                            } catch (e) {
                                return (log(`Local module load failed: ${e instanceof Error ? e.message : e}`), !1);
                            }
                        })()
                    )
                        return;
                    let userDataPath = paths_1.paths.getUserData();
                    if (null == userDataPath) return void log("Aborted: userDataPath is null");
                    let token = await _getTokenFromDisk(userDataPath);
                    if (null == token) return;
                    let staffDevToolsBasePath = path_1.default.join(userDataPath, "staff_dev_tools_module"),
                        versionFilePath = path_1.default.join(staffDevToolsBasePath, "version.json");
                    function fetchFromWorker(urlPath, authToken, mode) {
                        let parsedUrl = new url_1.default.URL(urlPath, webappEndpoint),
                            isHttps = "https:" === parsedUrl.protocol,
                            httpModule = isHttps ? __webpack_require__(5692) : __webpack_require__(8611);
                        return new Promise((resolve, reject) => {
                            let req = httpModule.request(
                                {
                                    hostname: parsedUrl.hostname,
                                    port: "" !== parsedUrl.port ? parsedUrl.port : isHttps ? 443 : 80,
                                    path: parsedUrl.pathname + parsedUrl.search,
                                    method: "GET",
                                    headers: { Authorization: authToken },
                                },
                                (res) => {
                                    if ((res.on("error", reject), "buffer" === mode)) {
                                        let chunks = [];
                                        (res.on("data", (chunk) => {
                                            chunks.push(chunk);
                                        }),
                                            res.on("end", () => {
                                                200 !== res.statusCode ? reject(Error(`Worker ${parsedUrl.pathname}: HTTP ${res.statusCode}`)) : resolve(Buffer.concat(chunks));
                                            }));
                                    } else {
                                        res.setEncoding("utf8");
                                        let data = "";
                                        (res.on("data", (chunk) => {
                                            data += chunk;
                                        }),
                                            res.on("end", () => {
                                                if (200 !== res.statusCode) return void reject(Error(`Worker ${parsedUrl.pathname}: HTTP ${res.statusCode}`));
                                                try {
                                                    resolve(JSON.parse(data));
                                                } catch (e) {
                                                    reject(e);
                                                }
                                            }));
                                    }
                                },
                            );
                            (req.on("error", reject), req.end());
                        });
                    }
                    let activeHash = null;
                    try {
                        let remoteVersion = await fetchFromWorker("/__development/staff_dev_tools/version", token, "json");
                        if (((activeHash = remoteVersion.hash ?? null), null == activeHash || "string" != typeof activeHash || !/^[a-f0-9]{64}$/.test(activeHash)))
                            throw Error("Version endpoint returned invalid hash");
                        (_verifyStaffDevToolsSignature(remoteVersion.version, remoteVersion.hash, remoteVersion.signature),
                            log(`Remote version: ${remoteVersion.version} (${activeHash.substring(0, 12)}\u{2026})`));
                        let versionedModulePath = path_1.default.join(staffDevToolsBasePath, `zycord_staff_dev_tools_${activeHash}`);
                        if (!fs_1.default.existsSync(path_1.default.join(versionedModulePath, "package.json"))) {
                            let zipBuffer = await fetchFromWorker(`/__development/staff_dev_tools/module?hash=${activeHash}`, token, "buffer"),
                                actualHash = __webpack_require__(6982).createHash("sha256").update(zipBuffer).digest("hex");
                            if (actualHash !== activeHash) throw Error(`Hash mismatch: expected ${activeHash}, got ${actualHash}`);
                            let tmpModulePath = versionedModulePath + "_tmp";
                            try {
                                let yauzl, resolvedDest;
                                (fs_1.default.rmSync(tmpModulePath, { recursive: !0, force: !0 }),
                                    fs_1.default.mkdirSync(tmpModulePath, { recursive: !0 }),
                                    await ((yauzl = __webpack_require__(9619)),
                                    (resolvedDest = path_1.default.resolve(tmpModulePath)),
                                    new Promise((resolve, reject) => {
                                        yauzl.fromBuffer(zipBuffer, { lazyEntries: !0 }, (err, zipfile) => {
                                            null != err
                                                ? reject(err)
                                                : (zipfile.on("entry", (entry) => {
                                                      let filePath = path_1.default.resolve(tmpModulePath, entry.fileName);
                                                      if (!filePath.startsWith(resolvedDest + path_1.default.sep) && filePath !== resolvedDest) {
                                                          (reject(Error(`Zip entry escapes destination: ${entry.fileName}`)), zipfile.close());
                                                          return;
                                                      }
                                                      if (/\/$/.test(entry.fileName)) {
                                                          (fs_1.default.mkdirSync(filePath, { recursive: !0 }), zipfile.readEntry());
                                                          return;
                                                      }
                                                      (fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: !0 }),
                                                          zipfile.openReadStream(entry, (streamErr, stream) => {
                                                              if (null != streamErr) {
                                                                  (zipfile.close(), reject(streamErr));
                                                                  return;
                                                              }
                                                              let writeStream = fs_1.default.createWriteStream(filePath);
                                                              (stream.on("error", (e) => {
                                                                  (zipfile.close(), reject(e));
                                                              }),
                                                                  writeStream.on("error", (e) => {
                                                                      (zipfile.close(), reject(e));
                                                                  }),
                                                                  writeStream.on("finish", () => zipfile.readEntry()),
                                                                  stream.pipe(writeStream));
                                                          }));
                                                  }),
                                                  zipfile.on("error", reject),
                                                  zipfile.on("end", resolve),
                                                  zipfile.readEntry());
                                        });
                                    })),
                                    fs_1.default.renameSync(tmpModulePath, versionedModulePath));
                            } catch (extractErr) {
                                throw (fs_1.default.rmSync(tmpModulePath, { recursive: !0, force: !0 }), extractErr);
                            }
                        }
                        fs_1.default.writeFileSync(versionFilePath, JSON.stringify(remoteVersion));
                        try {
                            for (let entry of fs_1.default.readdirSync(staffDevToolsBasePath))
                                entry.startsWith("zycord_staff_dev_tools_") &&
                                    entry !== `zycord_staff_dev_tools_${activeHash}` &&
                                    fs_1.default.rmSync(path_1.default.join(staffDevToolsBasePath, entry), { recursive: !0, force: !0 });
                        } catch (_e) {}
                    } catch (e) {
                        ((activeHash = null), log(`Remote update failed: ${e instanceof Error ? e.message : e}`));
                        let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                        sentry?.captureMessage(`${LOG_PREFIX} Remote update failed: ${e instanceof Error ? e.message : e}`);
                    }
                    if (null == activeHash)
                        try {
                            let cachedVersion = JSON.parse(fs_1.default.readFileSync(versionFilePath, "utf-8"));
                            if (((activeHash = cachedVersion.hash ?? null), null == activeHash || "string" != typeof activeHash || !/^[a-f0-9]{64}$/.test(activeHash)))
                                return void log("Aborted: cached version has invalid hash");
                            (_verifyStaffDevToolsSignature(cachedVersion.version, cachedVersion.hash, cachedVersion.signature),
                                log(`Using cached version: ${cachedVersion.version} (${activeHash.substring(0, 12)}\u{2026})`));
                        } catch (e) {
                            log(`Aborted: no cached version available (${e instanceof Error ? e.message : e})`);
                            return;
                        }
                    let staffDevToolsModulePath = path_1.default.join(staffDevToolsBasePath, `zycord_staff_dev_tools_${activeHash}`);
                    if (!fs_1.default.existsSync(path_1.default.join(staffDevToolsModulePath, "package.json"))) return void log("Aborted: module package.json not found on disk");
                    try {
                        let zycordStaffDevTools = require(staffDevToolsModulePath);
                        (zycordStaffDevTools.init(),
                            zycordStaffDevTools.installBridge(),
                            global.features.declareSupported("staff_dev_tools"),
                            (_staffDevToolsModule = zycordStaffDevTools),
                            log("Module loaded successfully"));
                    } catch (e) {
                        log(`Module load failed: ${e instanceof Error ? e.message : e}`);
                        let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                        sentry?.captureException(e instanceof Error ? e : Error(`${LOG_PREFIX} Module load failed: ${e}`));
                    }
                }
            }