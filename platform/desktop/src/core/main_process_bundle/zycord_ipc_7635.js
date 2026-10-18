7635(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var ownKeys,
                    ZycordMP4ErrorReason,
                    ZycordMP4ErrorReason1,
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
                    (exports.ZYCORD_UUID = void 0),
                    (exports.setupClipsProtocol = function () {
                        electron_1.protocol.handle(constants_1.ZYCORD_CLIP_PROTOCOL, async function (request) {
                            let originalPathname = new URL(request.url).pathname;
                            "win32" === process.platform && (originalPathname = originalPathname.slice(1));
                            let pathname = path_1.default.normalize(decodeURIComponent(originalPathname)),
                                filename = path_1.default.basename(pathname);
                            try {
                                (clipsLogger.info("[Clips] protocol requested: ", filename), await verifyzycordMP4(pathname));
                            } catch (e) {
                                return (clipsLogger.error("Invalid clip requested via protocol:", e), new Response("Clip not found", { status: 404 }));
                            }
                            try {
                                let stats = await promises_1.default.stat(pathname),
                                    rangeHeader = request.headers.get("Range");
                                if (null == rangeHeader)
                                    return new Response(node_stream_1.Readable.toWeb((0, node_fs_1.createReadStream)(pathname)), {
                                        status: 200,
                                        headers: { "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": `${stats.size}` },
                                    });
                                let matches = RANGE_HEADER_REGEX.exec(rangeHeader);
                                if (null == matches) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${stats.size}` } });
                                let start = null != matches[1] ? parseInt(matches[1], 10) : 0,
                                    end = null != matches[2] ? parseInt(matches[2], 10) : stats.size - 1;
                                if (Number.isNaN(start) || start > stats.size || end > stats.size)
                                    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${stats.size}` } });
                                let stream = (0, node_fs_1.createReadStream)(pathname, { start, end });
                                return new Response(node_stream_1.Readable.toWeb(stream), {
                                    status: 206,
                                    headers: {
                                        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
                                        "Accept-Ranges": "bytes",
                                        "Content-Length": `${end - start + 1}`,
                                        "Content-Type": "video/mp4",
                                    },
                                });
                            } catch (e) {
                                return (clipsLogger.error("Something went wrong when serving the clip:", e), new Response("Clip serve failure", { status: 500 }));
                            }
                        });
                    }),
                    (exports.moveClip = moveClip));
                let buffer_1 = __importDefault(__webpack_require__(181)),
                    childProcess = __importStar(__webpack_require__(5317)),
                    electron_1 = __webpack_require__(1288),
                    node_fs_1 = __webpack_require__(3024),
                    promises_1 = __importDefault(__webpack_require__(1455)),
                    node_stream_1 = __webpack_require__(7075),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    constants_1 = __webpack_require__(9157),
                    utils_1 = __webpack_require__(4838),
                    appFeatures_1 = __webpack_require__(5976),
                    logger_1 = __webpack_require__(1944),
                    ZycordIPC_1 = __webpack_require__(1999),
                    fileutils_1 = __webpack_require__(9590),
                    nativeModules_1 = __webpack_require__(216),
                    MAX_LENGTH = buffer_1.default.constants.MAX_LENGTH,
                    INVALID_FILE_ERROR = "Invalid file";
                exports.ZYCORD_UUID = "a1c8529933464db888f083f57a75a5ef";
                let UUID_BOX_NAME = "uuid",
                    RANGE_HEADER_REGEX = /bytes=(\d+)?-(\d+)?/,
                    clipsLogger = logger_1.logger.createLogger("zycord_clips_main_proc");
                (((ZycordMP4ErrorReason = ZycordMP4ErrorReason1 || (ZycordMP4ErrorReason1 = {})).NOT_MP4_EXTENSION = "not-mp4-extension"),
                    (ZycordMP4ErrorReason.NOT_MP4_SIGNATURE = "not-mp4-signature"),
                    (ZycordMP4ErrorReason.MALFORMED_BOX = "malformed-box"),
                    (ZycordMP4ErrorReason.NO_ZYCORD_UUID_BOX = "no-zycord-uuid-box"),
                    (ZycordMP4ErrorReason.NO_METADATA = "no-metadata"),
                    (ZycordMP4ErrorReason.RENAME_NOT_ALLOWED = "rename-not-allowed"),
                    (ZycordMP4ErrorReason.OUTPUT_ALREADY_EXISTS = "output-already-exists"),
                    (ZycordMP4ErrorReason.MALFORMED_RECIPE = "malformed-recipe"));
                class InvalidFileError extends Error {
                    reason;
                    recoverable;
                    constructor(reason, recoverable = !1) {
                        (super(`${INVALID_FILE_ERROR}: ${reason}`), (this.reason = reason), (this.recoverable = recoverable));
                    }
                }
                function isRecoverableFileFailure(e) {
                    return "ENOENT" !== e.code;
                }
                function verifyIsMP4(buffer) {
                    if ("ftypisom" !== buffer.toString("ascii", 4, 12)) throw new InvalidFileError(ZycordMP4ErrorReason1.NOT_MP4_SIGNATURE);
                }
                function verifyHasMP4Extension(filename) {
                    if (".mp4" !== path_1.default.parse(filename).ext.toLowerCase()) throw new InvalidFileError(ZycordMP4ErrorReason1.NOT_MP4_EXTENSION);
                }
                function getBoxSize(buffer, startIndex) {
                    return buffer.readUInt32BE(startIndex);
                }
                function isZycordUUIDBox(buffer, startIndex) {
                    return (
                        buffer.toString("ascii", startIndex + 4, startIndex + 8) === UUID_BOX_NAME &&
                        buffer.toString("hex", startIndex + 8, startIndex + 8 + 16) === exports.ZYCORD_UUID
                    );
                }
                let zycordMP4Locks = new Map();
                function withzycordMP4Lock(filepath, fn) {
                    let key = path_1.default.normalize(filepath),
                        run = (zycordMP4Locks.get(key) ?? Promise.resolve()).then(fn, fn),
                        guard = run.then(
                            () => {},
                            () => {},
                        );
                    return (
                        zycordMP4Locks.set(key, guard),
                        guard.then(() => {
                            zycordMP4Locks.get(key) === guard && zycordMP4Locks.delete(key);
                        }),
                        run
                    );
                }
                async function writeWithRetry(fn) {
                    for (let attempt = 1; ; attempt++)
                        try {
                            await fn();
                            return;
                        } catch (e) {
                            let code = e.code;
                            if (("EPERM" !== code && "EACCES" !== code && "EBUSY" !== code) || attempt >= 10) throw e;
                            let delay = Math.min(50 * 2 ** (attempt - 1), 1e3);
                            await new Promise((resolve) => setTimeout(resolve, delay));
                        }
                }
                async function findZycordUUIDBox(handle, fileSize) {
                    let headerBuffer = Buffer.alloc(24);
                    (await (0, fileutils_1.readExactly)({ handle, buffer: headerBuffer, position: 0 }), verifyIsMP4(headerBuffer));
                    let currIndex = getBoxSize(headerBuffer, 0);
                    for (; currIndex < fileSize;) {
                        await (0, fileutils_1.readExactly)({ handle, buffer: headerBuffer, position: currIndex });
                        let boxSize = getBoxSize(headerBuffer, 0);
                        if (boxSize < 8) throw new InvalidFileError(ZycordMP4ErrorReason1.MALFORMED_BOX);
                        if (isZycordUUIDBox(headerBuffer, 0)) return { position: currIndex, boxSize };
                        currIndex += boxSize;
                    }
                    throw new InvalidFileError(ZycordMP4ErrorReason1.NO_ZYCORD_UUID_BOX);
                }
                async function verifyzycordMP4(filepath) {
                    verifyHasMP4Extension(filepath);
                    let handle = await promises_1.default.open(filepath, "r");
                    try {
                        let stats = await handle.stat();
                        await findZycordUUIDBox(handle, stats.size);
                    } finally {
                        await handle.close();
                    }
                }
                async function verifyNewzycordMP4Path(filepath) {
                    verifyHasMP4Extension(filepath);
                    try {
                        await promises_1.default.stat(filepath);
                    } catch (e) {
                        if ("ENOENT" === e.code) return;
                        throw e;
                    }
                    throw new InvalidFileError(ZycordMP4ErrorReason1.OUTPUT_ALREADY_EXISTS);
                }
                async function loadClip(filename) {
                    try {
                        return (await verifyzycordMP4(filename), (await (0, fileutils_1.readFulfilledFiles)([filename], MAX_LENGTH, !0))[0]);
                    } catch (e) {
                        if (e instanceof InvalidFileError) throw (clipsLogger.info(`Invalid clips file (${e.reason}): ${e}`), e);
                        let reason = e.code ?? `unknown load failure: ${String(e)}`;
                        throw (clipsLogger.error(`Invalid clips file (${reason}): ${e}`), new InvalidFileError(reason, isRecoverableFileFailure(e)));
                    }
                }
                async function getClipMetadata(filename, dirPath) {
                    try {
                        verifyHasMP4Extension(filename);
                    } catch (e) {
                        return null;
                    }
                    let filepath = path_1.default.join(dirPath, filename);
                    return await withzycordMP4Lock(filepath, async () => {
                        let handle = await promises_1.default.open(filepath, "r");
                        try {
                            let stats = await handle.stat(),
                                { position, boxSize } = await findZycordUUIDBox(handle, stats.size),
                                metadataBuffer = Buffer.alloc(boxSize - 24);
                            await (0, fileutils_1.readExactly)({ handle, buffer: metadataBuffer, position: position + 24 });
                            let metadata = JSON.parse(metadataBuffer.toString("utf-8"));
                            return { filepath: filepath, metadata: metadata, sizeBytes: stats.size };
                        } catch (e) {
                            return (clipsLogger.warn(`[Clips] getClipMetadata error: ${e}`), null);
                        } finally {
                            await handle?.close();
                        }
                    });
                }
                async function extractJpegComment(filepath) {
                    let handle = await promises_1.default.open(filepath, "r");
                    try {
                        let headerBuffer = Buffer.alloc(2);
                        if ((await (0, fileutils_1.readExactly)({ handle, buffer: headerBuffer, position: 0 }), 255 !== headerBuffer[0] || 216 !== headerBuffer[1])) return null;
                        let position = 2,
                            markerBuffer = Buffer.alloc(4);
                        for (;;) {
                            if ((await (0, fileutils_1.readExactly)({ handle, buffer: markerBuffer, position }), 255 !== markerBuffer[0])) return null;
                            let markerType = markerBuffer[1],
                                segmentLength = markerBuffer.readUInt16BE(2);
                            if (254 === markerType) {
                                let commentLength = segmentLength - 2,
                                    commentBuffer = Buffer.alloc(commentLength);
                                return (await (0, fileutils_1.readExactly)({ handle, buffer: commentBuffer, position: position + 4 }), commentBuffer.toString("utf-8"));
                            }
                            if (218 === markerType) return null;
                            position += 2 + segmentLength;
                        }
                    } catch (e) {
                        return (clipsLogger.warn(`Error reading JPEG comment from ${filepath}: ${e}`), null);
                    } finally {
                        await handle?.close();
                    }
                }
                async function getScreenshotMetadata(filename, dirPath) {
                    try {
                        let thumbnail;
                        if (!(filename.endsWith(".jpeg") || filename.endsWith(".jpg"))) return null;
                        let filepath = path_1.default.join(dirPath, filename),
                            jpegComment = await extractJpegComment(filepath);
                        if (null == jpegComment) return null;
                        let handle = await promises_1.default.open(filepath, "r");
                        try {
                            let base64 = (await promises_1.default.readFile(handle)).toString("base64");
                            thumbnail = `data:image/jpeg;base64,${base64}`;
                        } catch (e) {
                            clipsLogger.warn(`Failed to create thumbnail for ${filename}: ${e}`);
                        } finally {
                            await handle.close();
                        }
                        try {
                            let metadata = JSON.parse(jpegComment);
                            return { filepath: filepath, metadata: { ...metadata, thumbnail } };
                        } catch (e) {
                            return (clipsLogger.warn(`Failed to parse JPEG comment as JSON for ${filename}: ${e}`), null);
                        }
                    } catch (e) {
                        return (clipsLogger.warn(`Error loading screenshot metadata for ${filename}: ${e}`), null);
                    }
                }
                async function moveClip(sourcePath, destPath) {
                    try {
                        if (path_1.default.basename(sourcePath) !== path_1.default.basename(destPath)) throw new InvalidFileError(ZycordMP4ErrorReason1.RENAME_NOT_ALLOWED);
                        await withzycordMP4Lock(sourcePath, async () => {
                            (await verifyzycordMP4(sourcePath), await promises_1.default.rename(sourcePath, destPath));
                        });
                    } catch (e) {
                        let reason = e instanceof InvalidFileError ? e.reason : (e.code ?? `unknown move failure: ${String(e)}`);
                        throw (clipsLogger.warn(`Invalid clips file to move (${reason}): ${e}`), Error(`${INVALID_FILE_ERROR}: ${reason}`));
                    }
                }
                async function deleteClip(filepath) {
                    try {
                        return (
                            filepath.endsWith(".jpeg") || filepath.endsWith(".jpg")
                                ? await (0, fileutils_1.deleteFile)(filepath)
                                : await withzycordMP4Lock(filepath, async () => {
                                      (await verifyzycordMP4(filepath), await (0, fileutils_1.deleteFile)(filepath));
                                  }),
                            { ok: !0 }
                        );
                    } catch (e) {
                        let reason = e instanceof InvalidFileError ? e.reason : (e.code ?? `unknown delete failure: ${String(e)}`),
                            recoverable = e instanceof InvalidFileError ? e.recoverable : isRecoverableFileFailure(e);
                        return (clipsLogger.warn(`Invalid clips file to delete (${reason}, recoverable=${recoverable}): ${e}`), { ok: !1, reason, recoverable });
                    }
                }
                async function updateClipMetadata(filepath, metadata) {
                    return await withzycordMP4Lock(filepath, async () => {
                        let data = await promises_1.default.readFile(filepath);
                        verifyIsMP4(data);
                        let uuidBoxStart = -1,
                            uuidBoxEnd = -1,
                            pos = 0;
                        for (; pos + 8 <= data.length;) {
                            let boxSize = getBoxSize(data, pos);
                            if (boxSize < 8 || pos + boxSize > data.length) break;
                            (isZycordUUIDBox(data, pos) && ((uuidBoxStart = pos), (uuidBoxEnd = pos + boxSize)), (pos += boxSize));
                        }
                        if (-1 === uuidBoxStart) return void clipsLogger.warn(`[Clips] updateClipMetadata: no Zycord UUID box found in ${filepath}; skipping`);
                        let metadataBuffer = Buffer.from(metadata, "utf-8"),
                            newBoxSize = 24 + metadataBuffer.length,
                            header = Buffer.alloc(8);
                        (header.writeUInt32BE(newBoxSize, 0), header.write(UUID_BOX_NAME, 4, "ascii"));
                        let newBox = Buffer.concat([header, Buffer.from(exports.ZYCORD_UUID, "hex"), metadataBuffer]),
                            tail = Buffer.concat([newBox, data.subarray(uuidBoxEnd)]);
                        try {
                            (await writeWithRetry(async () => {
                                let handle = await promises_1.default.open(filepath, "r+");
                                try {
                                    (await handle.write(tail, 0, tail.length, uuidBoxStart), await handle.truncate(uuidBoxStart + tail.length));
                                } finally {
                                    await handle.close();
                                }
                            }),
                                clipsLogger.info(`[Clips] updateClipMetadata: wrote ${newBox.length} byte metadata box to ${filepath}`));
                        } catch (e) {
                            throw (clipsLogger.error(`[Clips] updateClipMetadata: failed to write ${filepath}`, e), e);
                        }
                    });
                }
                async function stashClipDeciderData(data, stashName) {
                    let totalCandidates = data.clipCandidates.length;
                    clipsLogger.info(`[Clips][stash] starting stash "${stashName}" with ${totalCandidates} candidate(s)`);
                    let desktop = electron_1.app.getPath("desktop"),
                        sessionDir = path_1.default.join(desktop, "decider_stash", stashName.replace(/[^a-zA-Z0-9._-]/g, "_"));
                    for (let candidate of (await promises_1.default.mkdir(sessionDir, { recursive: !0 }), data.clipCandidates)) {
                        let sourcePath = candidate.filepath,
                            newPath = path_1.default.join(sessionDir, path_1.default.basename(sourcePath));
                        (await withzycordMP4Lock(sourcePath, () => writeWithRetry(() => promises_1.default.copyFile(sourcePath, newPath))), (candidate.filepath = newPath));
                    }
                    await promises_1.default.writeFile(path_1.default.join(sessionDir, "data.json"), JSON.stringify(data, null, 2));
                }
                async function renderMontageRecipe(recipeJson, outputPath, metadata) {
                    let modulePath,
                        exePath =
                            null ==
                            (modulePath =
                                (0, nativeModules_1.getModulePath)("zycord_clips") ?? (null != moduleDataPath ? path_1.default.join(moduleDataPath, "zycord_clips") : null))
                                ? null
                                : path_1.default.join(modulePath, "win32" === process.platform ? "zycord_clips.exe" : "zycord_clips");
                    if (null == exePath) throw Error("zycord_clips module path unavailable");
                    for (let inputPath of (function (recipeJson) {
                        let parsed;
                        try {
                            parsed = JSON.parse(recipeJson);
                        } catch {
                            throw new InvalidFileError(ZycordMP4ErrorReason1.MALFORMED_RECIPE);
                        }
                        let inputs = parsed?.inputs;
                        if (!Array.isArray(inputs) || 0 === inputs.length) throw new InvalidFileError(ZycordMP4ErrorReason1.MALFORMED_RECIPE);
                        let paths = inputs.map((input) => input?.path);
                        if (!paths.every((filepath) => "string" == typeof filepath && "" !== filepath)) throw new InvalidFileError(ZycordMP4ErrorReason1.MALFORMED_RECIPE);
                        return Array.from(new Set(paths));
                    })(recipeJson))
                        await verifyzycordMP4(inputPath);
                    return withzycordMP4Lock(outputPath, async () => {
                        (await verifyNewzycordMP4Path(outputPath),
                            await (clipsLogger.info(`[Clips] renderMontageRecipe: rendering ${outputPath} via ${exePath}`),
                            new Promise((resolve, reject) => {
                                let child = childProcess.spawn(exePath, ["--render-recipe", recipeJson, outputPath, metadata], {
                                        stdio: ["ignore", "ignore", "pipe"],
                                        windowsHide: !0,
                                    }),
                                    stderr = "";
                                (child.stderr?.on("data", (chunk) => {
                                    stderr += chunk.toString();
                                }),
                                    child.once("error", (error) => {
                                        reject(Error(`failed to launch zycord_clips: ${error.message}`));
                                    }),
                                    child.once("exit", async (code) => {
                                        if (0 === code) (clipsLogger.info(`[Clips] renderMontageRecipe: rendered ${outputPath}`), resolve());
                                        else {
                                            let message = `zycord_clips --render-recipe exited with code ${code ?? "null"}: ${stderr.trim()}`;
                                            clipsLogger.error(`[Clips] renderMontageRecipe: ${message}`);
                                            try {
                                                await promises_1.default.rm(outputPath, { force: !0 });
                                            } catch (cleanupError) {
                                                clipsLogger.warn(`[Clips] renderMontageRecipe: failed to remove partial output ${outputPath}`, cleanupError);
                                            }
                                            reject(Error(message));
                                        }
                                    }));
                            })));
                    });
                }
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.LOAD_CLIP, (_, path) => loadClip(path)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.LOAD_CLIPS_DIRECTORY, async (_, dirPath) => {
                        if (!(await (0, fileutils_1.directoryExists)(dirPath))) return [];
                        let filenames = await (0, fileutils_1.getFilesnamesFromDirectory)(dirPath);
                        return (
                            await Promise.all(
                                filenames.map(async (filename) => {
                                    let clipMetadata = await getClipMetadata(filename, dirPath);
                                    if (null != clipMetadata) return clipMetadata;
                                    let screenshotMetadata = await getScreenshotMetadata(filename, dirPath);
                                    return null != screenshotMetadata ? screenshotMetadata : null;
                                }),
                            )
                        ).filter(utils_1.isNotNullish);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.DELETE_CLIP, (_, path) => deleteClip(path)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.MOVE_CLIP, (_, sourcePath, destPath) => moveClip(sourcePath, destPath)),
                    (0, appFeatures_1.getFeatures)().declareSupported("clips_storage_size"),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.UPDATE_CLIP_METADATA, (_, filepath, metadata) => updateClipMetadata(filepath, metadata)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.DEBUG_STASH_CLIP_DECIDER_DATA, (_, data, stashName) => stashClipDeciderData(data, stashName)),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.RENDER_MONTAGE_RECIPE, (_, recipeJson, outputPath, metadata) =>
                        renderMontageRecipe(recipeJson, outputPath, metadata),
                    ));
            }