1275(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let options, trayIcons;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.hasInit = void 0),
                    (exports.displayHowToCloseHint = function () {
                        null == settings ||
                            null == atomTray ||
                            (null == settings.get("trayBalloonShown") &&
                                (settings.set("trayBalloonShown", !0),
                                settings.save(),
                                atomTray.displayBalloon({ title: currentStrings.appName, content: currentStrings.closeHint })));
                    }),
                    (exports.init = function (_options) {
                        if (exports.hasInit) return void console.warn("systemTray: Has already init! Cancelling init.");
                        ((exports.hasInit = !0), (options = _options));
                        let resourcePath = `app/images/systemtray/${process.platform}`,
                            suffix = IS_MACOS ? "Template" : "";
                        ((trayIcons = (0, lodash_1.mapValues)(TRAY_ICON_NAMES, (name) => {
                            let image = (0, utils_1.exposeModuleResource)(resourcePath, `${name}${suffix}.png`);
                            return (null == image && console.warn(`systemTray: tray icon ${name} missing from build!`), image);
                        })),
                            ipcMain_1.default.on("SYSTEM_TRAY_SET_ICON", (evt, iconKey) => {
                                let previousTrayStates;
                                return ((previousTrayStates = getTrayStates()), void ((currentIconKey = iconKey), applyTrayStates(previousTrayStates)));
                            }),
                            ipcMain_1.default.on("SYSTEM_TRAY_SET_APPLICATIONS", (evt, newApplications) => {
                                ((currentApplications = newApplications), setContextMenu());
                            }),
                            ipcMain_1.default.on("SYSTEM_TRAY_SET_STATES", (evt, states) => {
                                let previousTrayStates;
                                return ((previousTrayStates = getTrayStates()), void ((currentTrayStates = states), applyTrayStates(previousTrayStates)));
                            }),
                            ipcMain_1.default.on("SYSTEM_TRAY_SET_STRINGS", (evt, newStrings) => {
                                ((currentStrings = newStrings), atomTray?.setToolTip(currentStrings.appName), setContextMenu());
                            }),
                            (IS_WINDOWS || IS_LINUX) && createTray());
                    }));
                let electron_1 = __webpack_require__(1288),
                    lodash_1 = __webpack_require__(9240),
                    securityUtils_1 = __webpack_require__(1331),
                    appSettings_1 = __webpack_require__(8504),
                    ipcMain_1 = __importDefault(__webpack_require__(2799)),
                    utils_1 = __webpack_require__(4161),
                    { APP_NAME_FOR_HUMANS } = __webpack_require__(6605),
                    buildInfo = __webpack_require__(2130).buildInfo,
                    settings = appSettings_1.appSettings.getSettings(),
                    TRAY_ICON_NAMES = {
                        DEFAULT: "tray",
                        UNREAD: "tray-unread",
                        CONNECTED: "tray-connected",
                        SPEAKING: "tray-speaking",
                        MUTED: "tray-muted",
                        DEAFENED: "tray-deafened",
                    },
                    MENU_REBUILD_KEYS = ["connected", "muteStates", "deafStates"],
                    TrayGuidByChannel = {
                        stable: "699e423d-73da-42ba-b94e-881ff8672467",
                        ptb: "8bdf397e-37fc-440a-ac55-ec80cc585152",
                        canary: "d9c5e1da-d4ab-424f-97cf-00c2ce9bec67",
                        development: "6603ea8b-b21d-46e9-8ea5-d87b9105613f",
                    },
                    IS_WINDOWS = "win32" === process.platform,
                    IS_LINUX = "linux" === process.platform,
                    IS_MACOS = "darwin" === process.platform,
                    IDLE_STATES = {
                        muteStates: { selfMute: !1, serverMute: !1, suppress: !1 },
                        deafStates: { selfDeaf: !1, serverDeaf: !1 },
                        connected: !1,
                        speaking: !1,
                        unread: !1,
                    },
                    currentIconKey = null,
                    currentTrayStates = null,
                    currentApplications = [],
                    currentStrings = {
                        appName: APP_NAME_FOR_HUMANS,
                        openApp: `Open ${APP_NAME_FOR_HUMANS}`,
                        mute: "Mute",
                        deafen: "Deafen",
                        suppressed: "Suppressed",
                        serverMuted: "Server Muted",
                        serverDeafened: "Server Deafened",
                        voiceSettings: "Voice / Video Settings",
                        checkForUpdates: "Check for Updates...",
                        acknowledgements: "Acknowledgements",
                        quitApp: `Quit ${APP_NAME_FOR_HUMANS}`,
                        closeHint: "Hi! Zycord will run in the background to keep you in touch with your friends. You can right-click here to quit.",
                    },
                    atomTray = null;
                function getTrayStates() {
                    return (
                        currentTrayStates ??
                        (function (iconKey) {
                            switch (iconKey) {
                                case "DEAFENED":
                                    return (0, lodash_1.merge)({}, IDLE_STATES, { muteStates: { selfMute: !0 }, deafStates: { selfDeaf: !0 }, connected: !0 });
                                case "MUTED":
                                    return (0, lodash_1.merge)({}, IDLE_STATES, { muteStates: { selfMute: !0 }, connected: !0 });
                                case "SPEAKING":
                                    return (0, lodash_1.merge)({}, IDLE_STATES, { connected: !0, speaking: !0 });
                                case "CONNECTED":
                                    return (0, lodash_1.merge)({}, IDLE_STATES, { connected: !0 });
                                case "UNREAD":
                                    return (0, lodash_1.merge)({}, IDLE_STATES, { unread: !0 });
                                default:
                                    return null;
                            }
                        })(currentIconKey) ??
                        IDLE_STATES
                    );
                }
                function getTrayIcon() {
                    let { muteStates, deafStates, connected, speaking, unread } = getTrayStates();
                    return connected
                        ? deafStates.selfDeaf || deafStates.serverDeaf
                            ? trayIcons.DEAFENED
                            : muteStates.selfMute || muteStates.serverMute || muteStates.suppress
                              ? trayIcons.MUTED
                              : speaking
                                ? trayIcons.SPEAKING
                                : trayIcons.CONNECTED
                        : unread
                          ? trayIcons.UNREAD
                          : trayIcons.DEFAULT;
                }
                function applyTrayStates(previousTrayStates) {
                    let nextTrayStates = getTrayStates();
                    if (!(0, lodash_1.isEqual)(previousTrayStates, nextTrayStates)) {
                        if (IS_MACOS) {
                            if (!nextTrayStates.connected) return void (null != atomTray && (atomTray.destroy(), (atomTray = null)));
                            createTray();
                        }
                        ((function () {
                            let icon = getTrayIcon();
                            if (null != icon && null != atomTray)
                                try {
                                    atomTray.setImage(icon);
                                } catch (e) {
                                    console.error("systemTray: Failed to set tray icon:", e);
                                }
                        })(),
                            (0, lodash_1.isEqual)((0, lodash_1.pick)(previousTrayStates, MENU_REBUILD_KEYS), (0, lodash_1.pick)(nextTrayStates, MENU_REBUILD_KEYS)) ||
                                setContextMenu());
                    }
                }
                function setContextMenu() {
                    if (null != atomTray)
                        try {
                            let menu = electron_1.Menu.buildFromTemplate(
                                (function () {
                                    let { connected } = getTrayStates(),
                                        defaultItems = [
                                            { label: currentStrings.appName, icon: trayIcons.DEFAULT ?? void 0, enabled: !1, visible: !(IS_LINUX || IS_MACOS) },
                                            {
                                                label: currentStrings.openApp,
                                                icon: trayIcons.DEFAULT ?? void 0,
                                                enabled: !0,
                                                visible: IS_LINUX || IS_MACOS,
                                                click: options.onTrayClicked,
                                            },
                                        ],
                                        applicationItems = currentApplications.map((application) => ({
                                            type: "normal",
                                            label: application.name,
                                            click: () => options.onLaunchApplication(application.id),
                                        })),
                                        voiceItems = [
                                            {
                                                ...(function () {
                                                    let { selfMute, serverMute, suppress } = getTrayStates().muteStates,
                                                        checked = suppress || serverMute || selfMute;
                                                    return suppress
                                                        ? { label: currentStrings.suppressed, enabled: !1, checked }
                                                        : serverMute
                                                          ? { label: currentStrings.serverMuted, enabled: !1, checked }
                                                          : { label: currentStrings.mute, enabled: !0, checked };
                                                })(),
                                                type: "checkbox",
                                                visible: connected,
                                                click: options.onToggleMute,
                                            },
                                            {
                                                ...(function () {
                                                    let { selfDeaf, serverDeaf } = getTrayStates().deafStates,
                                                        checked = serverDeaf || selfDeaf;
                                                    return serverDeaf
                                                        ? { label: currentStrings.serverDeafened, enabled: !1, checked }
                                                        : { label: currentStrings.deafen, enabled: !0, checked };
                                                })(),
                                                type: "checkbox",
                                                visible: connected,
                                                click: options.onToggleDeafen,
                                            },
                                            { label: currentStrings.voiceSettings, type: "normal", visible: connected, click: options.onOpenVoiceSettings },
                                        ],
                                        metaItems = [
                                            { label: currentStrings.checkForUpdates, type: "normal", visible: !IS_MACOS, click: options.onCheckForUpdates },
                                            {
                                                label: currentStrings.acknowledgements,
                                                type: "normal",
                                                visible: !IS_MACOS,
                                                click: () => (0, securityUtils_1.saferShellOpenExternal)("https://app.zyron.site/acknowledgements"),
                                            },
                                        ];
                                    return [defaultItems, applicationItems, voiceItems, metaItems, [{ label: currentStrings.quitApp, role: "quit" }]].reduce((acc, items) =>
                                        items.some((item) => item?.visible ?? !0) ? acc.concat({ type: "separator" }, items) : acc.concat(items),
                                    );
                                })(),
                            );
                            atomTray.setContextMenu(menu);
                        } catch (_) {}
                }
                function createTray() {
                    if (null != atomTray) return;
                    let icon = getTrayIcon();
                    if (null == icon) return void console.error("systemTray: Cannot create tray icon: no image for the current state");
                    try {
                        ((atomTray = IS_WINDOWS || IS_MACOS ? new electron_1.Tray(icon, TrayGuidByChannel[buildInfo.releaseChannel]) : new electron_1.Tray(icon)).setToolTip(
                            currentStrings.appName,
                        ),
                            setContextMenu(),
                            (IS_WINDOWS || IS_LINUX) && atomTray.on("click", options.onTrayClicked));
                    } catch (e) {
                        console.error("systemTray: Failed to create tray icon:", e);
                    }
                }
                exports.hasInit = !1;
            }