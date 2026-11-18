9698(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.hasInit = void 0),
                    (exports.init = function () {
                        exports.hasInit ? console.warn("popoutWindows: Has already init! Cancelling init.") : ((exports.hasInit = !0), features.declareSupported("popout_windows"));
                    }),
                    (exports.getWindow = function (key) {
                        return popoutWindows[key];
                    }),
                    (exports.getAllWindows = function () {
                        return Object.values(popoutWindows);
                    }),
                    (exports.setNewWindowEvent = function (event) {
                        newWindowEvent = event;
                    }),
                    (exports.openOrFocusWindow = function (_windowURL, key, features) {
                        let parsedFeatures = (function (features) {
                                var hasKey, getKey;
                                let keyValuesParsed = features.split(","),
                                    parsedFeatures = {};
                                for (let feature of keyValuesParsed) {
                                    let [key, value] = feature.split("=");
                                    parsedFeatures[key] = (function (feature) {
                                        if ("yes" === feature) return !0;
                                        if ("no" === feature) return !1;
                                        let parsedNumber = Number.parseInt(feature);
                                        return Number.isNaN(parsedNumber) ? feature : parsedNumber;
                                    })(value);
                                }
                                return (
                                    (hasKey = (key) => parsedFeatures.hasOwnProperty(key)),
                                    (getKey = (key) => parsedFeatures[key]),
                                    ALLOWED_FEATURES.reduce((acc, curr) => (hasKey(curr) ? { ...acc, [curr]: getKey(curr) } : acc), {})
                                );
                            })(features),
                            windowOptions = { ...DEFAULT_POPOUT_OPTIONS, ...parsedFeatures };
                        ("number" == typeof parsedFeatures.left && (windowOptions.x = parsedFeatures.left),
                            "number" == typeof parsedFeatures.top && (windowOptions.y = parsedFeatures.top));
                        let existingWindow = popoutWindows[key];
                        if (null != existingWindow)
                            return (
                                windowOptions.outOfProcessOverlay ||
                                    (null != existingWindow && (existingWindow.setAlwaysOnTop(!0), existingWindow.focus(), existingWindow.setAlwaysOnTop(!1))),
                                { action: "deny" }
                            );
                        if (windowOptions.outOfProcessOverlay) {
                            let rect = { x: 0, y: 0, width: 1280, height: 720 };
                            for (let { bounds } of electron_1.screen.getAllDisplays()) ((rect.x = Math.min(bounds.x, rect.x)), (rect.y = Math.min(bounds.y, rect.y)));
                            ((windowOptions.x = rect.x - rect.width),
                                (windowOptions.y = rect.y - rect.height),
                                (windowOptions.width = rect.width),
                                (windowOptions.height = rect.height),
                                (windowOptions.resizable = !0),
                                (windowOptions.title = "Zycord Overlay"),
                                (windowOptions.show = !1),
                                (windowOptions.backgroundColor = "#00000000"),
                                (windowOptions.type = "toolbar"),
                                (windowOptions.alwaysOnTop = !0),
                                (windowOptions.skipTaskbar = !0),
                                (windowOptions.webPreferences = windowOptions.webPreferences ? { ...windowOptions.webPreferences } : {}),
                                (windowOptions.webPreferences.preload = path_1.default.join(__dirname, "mainScreenPreload.js")),
                                (windowOptions.frame = !1),
                                (windowOptions.transparent = !0),
                                (windowOptions.webPreferences.backgroundThrottling = !1),
                                (windowOptions.paintWhenInitiallyHidden = !0));
                        }
                        return { action: "allow", overrideBrowserWindowOptions: windowOptions };
                    }),
                    (exports.setupPopout = function (popoutWindow, key, options, webappEndpoint) {
                        (options.outOfProcessOverlay &&
                            popoutWindow.on("will-resize", (event, _newBounds, _details) => {
                                event.preventDefault();
                            }),
                            (popoutWindows[popoutWindow.windowKey] = popoutWindow),
                            popoutWindow.webContents.on("will-navigate", (evt, url) => {
                                (0, securityUtils_1.checkUrlOriginMatches)(url, webappEndpoint) || evt.preventDefault();
                            }),
                            popoutWindow.webContents.setWindowOpenHandler(({ url }) => ((0, securityUtils_1.saferShellOpenExternal)(url), { action: "deny" })),
                            popoutWindow.once("closed", () => {
                                (popoutWindow.removeAllListeners(), delete popoutWindows[popoutWindow.windowKey]);
                            }),
                            newWindowEvent(popoutWindow));
                    }),
                    (exports.closePopouts = function () {
                        (Object.values(popoutWindows).forEach((popoutWindow) => popoutWindow.close()), (popoutWindows = {}));
                    }));
                let electron_1 = __webpack_require__(1288),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    securityUtils_1 = __webpack_require__(1331),
                    appFeatures_1 = __webpack_require__(5976),
                    ALLOWED_FEATURES = [
                        "width",
                        "height",
                        "left",
                        "top",
                        "resizable",
                        "movable",
                        "alwaysOnTop",
                        "frame",
                        "transparent",
                        "hasShadow",
                        "closable",
                        "skipTaskbar",
                        "backgroundColor",
                        "menubar",
                        "toolbar",
                        "location",
                        "directories",
                        "titleBarStyle",
                        "outOfProcessOverlay",
                        "focusable",
                    ],
                    DEFAULT_POPOUT_OPTIONS = {
                        title: "Zycord Popout",
                        backgroundColor: "#2f3136",
                        minWidth: 320,
                        minHeight: 180,
                        transparent: !1,
                        frame: !1,
                        resizable: !0,
                        show: !0,
                        titleBarStyle: "darwin" === process.platform ? "hidden" : void 0,
                        trafficLightPosition: "darwin" === process.platform ? { x: 12, y: 5 } : void 0,
                        webPreferences: { nodeIntegration: !1, nativeWindowOpen: !0, enableRemoteModule: !1, contextIsolation: !0 },
                    },
                    features = (0, appFeatures_1.getFeatures)();
                exports.hasInit = !1;
                let popoutWindows = {},
                    newWindowEvent = () => {};
            }