827(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.readSteamPathFromRegistry = readSteamPathFromRegistry),
                    (exports.findSteamGameLibraryPath = findSteamGameLibraryPath));
                let child_process_1 = __webpack_require__(5317),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    execFileAsync = (0, __webpack_require__(9023).promisify)(child_process_1.execFile);
                async function readSteamPathFromRegistry() {
                    try {
                        let { stdout } = await execFileAsync("reg", ["query", "HKCU\\Software\\Valve\\Steam", "/v", "SteamPath"], { encoding: "utf8" }),
                            match = /SteamPath\s+REG_SZ\s+(.+)/.exec(stdout);
                        return match?.[1]?.trim() ?? null;
                    } catch (e) {
                        return null;
                    }
                }
                async function findSteamGameLibraryPath(appid, steamPath) {
                    let libraries = [steamPath];
                    try {
                        let libraryFoldersVdf = path_1.default.join(steamPath, "steamapps", "libraryfolders.vdf"),
                            content = await fs_1.default.promises.readFile(libraryFoldersVdf, "utf8");
                        libraries.push(
                            ...(function (vdfContent) {
                                let paths = [],
                                    regex = /"path"\s*"([^"]+)"/g,
                                    match = regex.exec(vdfContent);
                                for (; null != match;) (paths.push(match[1].replace(/\\\\/g, "\\")), (match = regex.exec(vdfContent)));
                                return paths;
                            })(content),
                        );
                    } catch (e) {}
                    for (let library of libraries) {
                        let manifestPath = path_1.default.join(library, "steamapps", `appmanifest_${appid}.acf`);
                        try {
                            return (await fs_1.default.promises.access(manifestPath), library);
                        } catch (e) {}
                    }
                    return null;
                }
            }