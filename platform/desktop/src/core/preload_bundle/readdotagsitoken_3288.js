3288(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.readDotaGsiToken = readDotaGsiToken),
                    (exports.debugLogDotaGsiPayload = debugLogDotaGsiPayload),
                    (exports.writeDotaGsiConfig = writeDotaGsiConfig),
                    (exports.deleteDotaGsiConfig = deleteDotaGsiConfig));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    gsiCommon_1 = __webpack_require__(827),
                    DOTA_2_INSTALL_SUBDIR = ["steamapps", "common", "dota 2 beta", "game", "dota", "cfg", "gamestate_integration"];
                function getDotaGsiConfigFilename(channel) {
                    return `gamestate_integration_zycord_${channel}.cfg`;
                }
                async function resolveDotaConfigDir() {
                    let steamPath = await (0, gsiCommon_1.readSteamPathFromRegistry)();
                    if (null == steamPath) return null;
                    let library = await (0, gsiCommon_1.findSteamGameLibraryPath)("570", steamPath);
                    return null == library ? null : path_1.default.join(library, ...DOTA_2_INSTALL_SUBDIR);
                }
                async function readDotaGsiToken(channel) {
                    let dir = await resolveDotaConfigDir();
                    if (null == dir) return null;
                    try {
                        let content = await fs_1.default.promises.readFile(path_1.default.join(dir, getDotaGsiConfigFilename(channel)), "utf8");
                        return /"token"\s+"([^"]+)"/.exec(content)?.[1] ?? null;
                    } catch (e) {
                        return null;
                    }
                }
                let debugPayloads = [];
                async function debugLogDotaGsiPayload(payload) {
                    debugPayloads.push(payload);
                    try {
                        await fs_1.default.promises.writeFile(
                            path_1.default.join(os_1.default.homedir(), "Desktop", "dota_gsi_debug.json"),
                            JSON.stringify(debugPayloads, null, 2),
                            "utf8",
                        );
                    } catch (e) {}
                }
                async function writeDotaGsiConfig(uri, token, channel) {
                    let dir = await resolveDotaConfigDir();
                    if (null == dir) return !1;
                    try {
                        return (
                            await fs_1.default.promises.mkdir(dir, { recursive: !0 }),
                            await fs_1.default.promises.writeFile(
                                path_1.default.join(dir, getDotaGsiConfigFilename(channel)),
                                `"Zycord Dota 2 GSI ${channel}"
{
  "uri" "${uri}"
  "timeout" "5.0"
  "buffer" "0"
  "throttle" "0.1"
  "heartbeat" "30.0"
  "auth"
  {
    "token" "${token}"
  }
  "data"
  {
    "provider"    "1"
    "map"         "1"
    "player"      "1"
    "hero"        "1"
    "abilities"   "1"
    "items"       "1"
    "buildings"   "1"
    "events"      "1"
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
                async function deleteDotaGsiConfig(channel) {
                    let dir = await resolveDotaConfigDir();
                    if (null == dir) return !1;
                    try {
                        return (await fs_1.default.promises.unlink(path_1.default.join(dir, getDotaGsiConfigFilename(channel))), !0);
                    } catch (e) {
                        return "ENOENT" === e.code;
                    }
                }
            }