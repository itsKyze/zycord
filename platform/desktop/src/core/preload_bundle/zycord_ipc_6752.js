6752(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.loadClip = function (path) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.LOAD_CLIP, path);
                    }),
                    (exports.loadClipsDirectory = function (path) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.LOAD_CLIPS_DIRECTORY, path);
                    }),
                    (exports.deleteClip = function (path) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.DELETE_CLIP, path);
                    }),
                    (exports.moveClip = function (sourcePath, destPath) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.MOVE_CLIP, sourcePath, destPath);
                    }),
                    (exports.updateClipMetadata = function (filepath, metadata) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.UPDATE_CLIP_METADATA, filepath, metadata);
                    }),
                    (exports.debugStashClipDeciderData = function (data, stashName) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.DEBUG_STASH_CLIP_DECIDER_DATA, data, stashName);
                    }),
                    (exports.renderMontageRecipe = function (recipeJson, outputPath, metadata) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.RENDER_MONTAGE_RECIPE, recipeJson, outputPath, metadata);
                    }),
                    (exports.getClipProtocolURLFromPath = function (filepath) {
                        let clipURL = new URL((0, node_url_1.pathToFileURL)(filepath).toString());
                        return ((clipURL.hostname = constants_1.ZYCORD_CLIP_PROTOCOL), clipURL.toString().replace(clipURL.protocol, `${constants_1.ZYCORD_CLIP_PROTOCOL}:`));
                    }),
                    (exports.debugListStashedClipDeciderSessions = debugListStashedClipDeciderSessions),
                    (exports.debugReadStashedClipDeciderData = debugReadStashedClipDeciderData));
                let node_fs_1 = __importDefault(__webpack_require__(3024)),
                    node_url_1 = __webpack_require__(3136),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    constants_1 = __webpack_require__(9157),
                    ZycordIPC_1 = __webpack_require__(1999),
                    paths_1 = __webpack_require__(1405);
                async function debugListStashedClipDeciderSessions() {
                    let entries,
                        desktop = await (0, paths_1.getPath)("desktop"),
                        root = path_1.default.join(desktop, "decider_stash");
                    try {
                        entries = await node_fs_1.default.promises.readdir(root, { withFileTypes: !0 });
                    } catch {
                        return [];
                    }
                    return (
                        await Promise.all(
                            entries
                                .filter((entry) => entry.isDirectory())
                                .map(async (entry) => {
                                    try {
                                        let stat = await node_fs_1.default.promises.stat(path_1.default.join(root, entry.name, "data.json"));
                                        return { name: entry.name, mtimeMs: stat.mtimeMs };
                                    } catch {
                                        return null;
                                    }
                                }),
                        )
                    )
                        .filter((item) => null != item)
                        .sort((a, b) => b.mtimeMs - a.mtimeMs)
                        .map((item) => item.name);
                }
                async function debugReadStashedClipDeciderData(stashName) {
                    let dataPath,
                        desktop = await (0, paths_1.getPath)("desktop"),
                        root = path_1.default.join(desktop, "decider_stash");
                    if (null != stashName && "" !== stashName) dataPath = path_1.default.join(root, stashName, "data.json");
                    else {
                        let sessions = await debugListStashedClipDeciderSessions();
                        dataPath = sessions.length > 0 ? path_1.default.join(root, sessions[0], "data.json") : path_1.default.join(root, "data.json");
                    }
                    let buffer = await node_fs_1.default.promises.readFile(dataPath);
                    return JSON.parse(new TextDecoder("utf-8").decode(buffer));
                }
            }