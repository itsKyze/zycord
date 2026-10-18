6074(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.readCs2GsiToken = readCs2GsiToken),
                    (exports.debugLogCs2GsiPayload = debugLogCs2GsiPayload),
                    (exports.writeCs2GsiConfig = writeCs2GsiConfig),
                    (exports.deleteCs2GsiConfig = deleteCs2GsiConfig));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    gsiCommon_1 = __webpack_require__(827),
                    CS2_INSTALL_SUBDIR = ["steamapps", "common", "Counter-Strike Global Offensive", "game", "csgo", "cfg"];
                function getCs2GsiConfigFilename(channel) {
                    return `gamestate_integration_zycord_${channel}.cfg`;
                }
                async function resolveCs2ConfigDir() {
                    let steamPath = await (0, gsiCommon_1.readSteamPathFromRegistry)();
                    if (null == steamPath) return null;
                    let library = await (0, gsiCommon_1.findSteamGameLibraryPath)("730", steamPath);
                    return null == library ? null : path_1.default.join(library, ...CS2_INSTALL_SUBDIR);
                }
                async function readCs2GsiToken(channel) {
                    let dir = await resolveCs2ConfigDir();
                    if (null == dir) return null;
                    try {
                        let content = await fs_1.default.promises.readFile(path_1.default.join(dir, getCs2GsiConfigFilename(channel)), "utf8");
                        return /"token"\s+"([^"]+)"/.exec(content)?.[1] ?? null;
                    } catch (e) {
                        return null;
                    }
                }
                let debugPayloads = [];
                async function debugLogCs2GsiPayload(payload) {
                    debugPayloads.push(payload);
                    try {
                        await fs_1.default.promises.writeFile(
                            path_1.default.join(os_1.default.homedir(), "Desktop", "cs2_gsi_debug.json"),
                            JSON.stringify(debugPayloads, null, 2),
                            "utf8",
                        );
                    } catch (e) {}
                }
                async function writeCs2GsiConfig(uri, token, channel) {
                    let dir = await resolveCs2ConfigDir();
                    if (null == dir) return !1;
                    try {
                        return (
                            await fs_1.default.promises.writeFile(
                                path_1.default.join(dir, getCs2GsiConfigFilename(channel)),
                                `"Zycord CS2 GSI ${channel}"
{
  "uri" "${uri}"
  "timeout" "5.0"
  "buffer" "0"
  "throttle" "0.1"
  "heartbeat" "60.0"
  "auth"
  {
    "token" "${token}"
  }
  "data"
  {
    "provider"            "1"
    "map"                 "1"
    "round"               "1"
    "player_id"           "1"
    "player_state"        "1"
    "player_weapons"      "1"
    "player_match_stats"  "1"
  }
}
`,
                                "utf8",
                            ),
                            !0
                        );
                    } catch (e) {
                        return !1;
                    }
                }
                async function deleteCs2GsiConfig(channel) {
                    let dir = await resolveCs2ConfigDir();
                    if (null == dir) return !1;
                    try {
                        return (await fs_1.default.promises.unlink(path_1.default.join(dir, getCs2GsiConfigFilename(channel))), !0);
                    } catch (e) {
                        return "ENOENT" === e.code;
                    }
                }
            },
            9425(module1, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let ZycordIPC_1 = __webpack_require__(1999);
                module1.exports = {
                    getDesktopCaptureSources: function (options) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.DESKTOP_CAPTURER_GET_SOURCES, options);
                    },
                };
            }