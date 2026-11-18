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
    (exports.WEBAPP_ENDPOINT = void 0),
    (exports.getMainWindowId = function () {
        return mainWindowId;
    }),
    (exports.webContentsSend = webContentsSend),
    (exports.init = function () {
        (electron_1.screen.on("display-added", handleDisplayChange),
            electron_1.screen.on("display-removed", handleDisplayChange),
            electron_1.screen.on("display-metrics-changed", handleDisplayChange),
            electron_1.app.on("window-all-closed", () => {
                null != envVariables.test && electron_1.app.quit();
            }),
            electron_1.app.on("before-quit", () => {
                (null != mainWindow && saveWindowConfig(mainWindow), (mainWindow = null));
            }),
            electron_1.app.on("child-process-gone", (_event, details) => {
                if (0 === details.exitCode) return;
                let serviceDescription = `${details.type} (${details.name})`;
                console.error(`child-process-gone! child: ${serviceDescription} exitCode: ${details.exitCode}`);
                let isFrequentCrash = !1;
                if ("GPU" === details.type || "Utility" === details.type) {
                    let crashTime = performance.now();
                    (crashTime - lastCrashedNonRenderer > 3e4
                        ? webContentsSend("CRASH_REPORTER_NEW_CRASH", details)
                        : ((isFrequentCrash = !0), console.error("Detected frequent crash for non-renderer process")),
                        (lastCrashedNonRenderer = crashTime));
                }
                let { reason } = details;
                if ("crashed" === reason || "oom" === reason) {
                    let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                    null != sentry &&
                        (isFrequentCrash ||
                            ("Utility" === details.type && -0x3ffffd95 === details.exitCode) ||
                            sentry.captureMessage(`'${details.type}' process exited with '${details.reason}' with exitcode '${details.exitCode}'`));
                }
            }),
            electron_1.app.on(Constants_1.MenuEvents.OPEN_HELP, () => webContentsSend("HELP_OPEN")),
            electron_1.app.on(Constants_1.MenuEvents.OPEN_SETTINGS, () => webContentsSend("USER_SETTINGS_OPEN")),
            electron_1.app.on("second-instance", (_event, args) => {
                args?.indexOf("--squirrel-uninstall") > -1 ||
                    process.argv?.slice(1).includes("--multi-instance") ||
                    null == mainWindow ||
                    mainWindow.isDestroyed() ||
                    (setWindowVisible(!0, !1), mainWindow.focus());
            }),
            ipcMain_1.default.on("SETTINGS_UPDATE_BACKGROUND_COLOR", (_event, backgroundColor) => {
                getBackgroundColor() !== backgroundColor &&
                    (settings?.set(BACKGROUND_COLOR_KEY, backgroundColor), mainWindow?.setBackgroundColor(backgroundColor), settings?.save());
            }),
            ipcMain_1.default.on(constants_1.IPCEvents.WINDOW_SET_TRAFFIC_LIGHT_POSITION, (_event, position) => {
                if ("darwin" === process.platform && !(null == mainWindow || mainWindow.isDestroyed()))
                    try {
                        mainWindow.setWindowButtonPosition(position);
                    } catch (e) {
                        console.error("Failed to set traffic light position", e);
                    }
            }),
            ipcMain_1.default.on(constants_1.IPCEvents.WINDOW_SET_TRAFFIC_LIGHT_APPEARANCE, (_event, appearance, windowKey) => {
                if ("darwin" !== process.platform) return;
                let targetWindow = null == windowKey ? mainWindow : popoutWindows.getWindow(windowKey);
                if (!(null == targetWindow || targetWindow.isDestroyed()) && "function" == typeof targetWindow.setWindowButtonAppearance)
                    try {
                        targetWindow.setWindowButtonAppearance(appearance);
                    } catch (e) {
                        console.error("Failed to set traffic light appearance", e);
                    }
            }),
            ipcMain_1.default.on(constants_1.IPCEvents.NAVIGATION_HISTORY_CLEAR, () => {
                null == mainWindow || mainWindow.isDestroyed() || mainWindow.webContents.navigationHistory?.clear();
            }),
            ipcMain_1.default.on("OPEN_EXTERNAL_URL", (_event, externalUrl) => {
                (0, securityUtils_1.saferShellOpenExternal)(externalUrl).catch((_) => {
                    console.error("Failed to open external URL", externalUrl);
                });
            }),
            (function () {
                (bootstrapModules_1.analytics?.getAnalytics()?.on("event", (event) => {
                    analyticsState.ready ? webContentsSend(Constants_1.AnalyticsEvents.APP_PUSH_ANALYTICS, [event]) : analyticsState.cached.push(event);
                }),
                    ipcMain_1.default.on(Constants_1.AnalyticsEvents.APP_GET_ANALYTICS_EVENTS, (_event) => {
                        let a = bootstrapModules_1.analytics?.getAnalytics();
                        if (null == a) return void console.log("[app] null analytics");
                        let events = a.getAndTruncateEvents();
                        (analyticsState.ready || ((analyticsState.ready = !0), events.push(...analyticsState.cached), (analyticsState.cached = [])),
                            webContentsSend(Constants_1.AnalyticsEvents.APP_PUSH_ANALYTICS, events));
                    }),
                    ipcMain_1.default.on(Constants_1.AnalyticsEvents.APP_VIEWED, (_event) => {
                        let a = bootstrapModules_1.analytics?.getDesktopTTI?.();
                        null != a && (a.trackMainWindowJSAppLoadDuration(), a.trackFullTTI());
                    }),
                    ipcMain_1.default.on(Constants_1.AnalyticsEvents.APP_LOADED, (_event) => {
                        (performance.measure("mainscreen-loadmainpage-duration", "mainscreen-loadmainpage"), (webAppLoaded = !0));
                    }));
                let fullInteractiveTTIMs = null,
                    wasAuthenticatedAtFirstRender = null,
                    handledAppFirstRenderAfterReadyPayload = !1,
                    pendingBundleStats = null,
                    pendingPaintMetrics = null,
                    detailedTTIFired = !1,
                    fcpTimeoutId = null;
                function pushDetailedTTI(force = !1) {
                    if (detailedTTIFired || (!force && null == pendingBundleStats)) return;
                    ((detailedTTIFired = !0), null != fcpTimeoutId && (clearTimeout(fcpTimeoutId), (fcpTimeoutId = null)));
                    let bundleStats = pendingBundleStats ?? {};
                    ((bundleStats.main_window_first_paint_time_ms = pendingPaintMetrics?.fpTimeMs ?? null),
                        (bundleStats.main_window_first_contentful_paint_time_ms = pendingPaintMetrics?.fcpTimeMs ?? null),
                        bootstrapModules_1.analytics?.getDesktopTTI?.().trackDetailedTTI(bundleStats, fullInteractiveTTIMs, wasAuthenticatedAtFirstRender),
                        (function (bundleStats) {
                            let rendererMarks = [],
                                navigationOriginMs = bundleStats.main_window_navigation_origin_ms;
                            if ("number" == typeof navigationOriginMs) {
                                let firstPaintMs = bundleStats.main_window_first_paint_time_ms;
                                "number" == typeof firstPaintMs &&
                                    rendererMarks.push(performance.mark("renderer-first-paint", { startTime: navigationOriginMs + firstPaintMs - performance.timeOrigin }));
                                let firstContentfulPaintMs = bundleStats.main_window_first_contentful_paint_time_ms;
                                "number" == typeof firstContentfulPaintMs &&
                                    rendererMarks.push(
                                        performance.mark("renderer-first-contentful-paint", {
                                            startTime: navigationOriginMs + firstContentfulPaintMs - performance.timeOrigin,
                                        }),
                                    );
                            }
                            if (
                                (null != fullInteractiveTTIMs && rendererMarks.push(performance.mark("renderer-full-interactive", { startTime: fullInteractiveTTIMs })),
                                rendererMarks.length > 0)
                            ) {
                                let entries = performance.getEntries(),
                                    lines = ["Startup timing:"];
                                for (let e of entries) {
                                    let label = `|  ${e.name}:`.padEnd(50);
                                    "mark" === e.entryType
                                        ? lines.push(`${label} ${e.startTime.toFixed(2)}`)
                                        : "measure" === e.entryType && lines.push(`${label} ${(e.startTime + e.duration).toFixed(2)} (${e.duration.toFixed(2)})`);
                                }
                                console.log(lines.join("\n"));
                            }
                        })(bundleStats));
                }
                function maybePushDetailedTTI() {
                    detailedTTIFired || null == pendingBundleStats || (pendingPaintMetrics?.fcpTimeMs != null && pushDetailedTTI());
                }
                (ipcMain_1.default.on(Constants_1.AnalyticsEvents.APP_FIRST_RENDER_AFTER_READY_PAYLOAD, (_event, wasAuthenticated) => {
                    if (!0 === handledAppFirstRenderAfterReadyPayload) return;
                    ((handledAppFirstRenderAfterReadyPayload = !0),
                        (fullInteractiveTTIMs = Math.ceil(1e3 * process.uptime())),
                        "boolean" == typeof wasAuthenticated && (wasAuthenticatedAtFirstRender = wasAuthenticated));
                    let a = bootstrapModules_1.analytics?.getDesktopTTI?.();
                    null != a &&
                        ("linux" !== process.platform && (a.trackMainWindowJSAppInteractiveDuration(), a.trackFullInteractiveTTI()),
                        webContentsSend("APP_GET_MAIN_BUNDLE_STATS"),
                        null != fcpTimeoutId && clearTimeout(fcpTimeoutId),
                        (fcpTimeoutId = setTimeout(() => {
                            ((fcpTimeoutId = null), pushDetailedTTI(!0));
                        }, 6e4)));
                }),
                    ipcMain_1.default.on(constants_1.IPCEvents.APP_MAIN_BUNDLE_STATS, (_event, bundleStats) => {
                        ((pendingBundleStats = bundleStats), maybePushDetailedTTI());
                    }),
                    ipcMain_1.default.on(constants_1.IPCEvents.APP_PAINT_METRICS, (_event, metrics) => {
                        ((pendingPaintMetrics = {
                            fpTimeMs: metrics.main_window_first_paint_time_ms ?? null,
                            fcpTimeMs: metrics.main_window_first_contentful_paint_time_ms ?? null,
                        }),
                            maybePushDetailedTTI());
                    }));
            })());
        let updater = updater_1.updater?.getUpdater();
        if (null != updater)
            (electron_1.app.on(Constants_1.MenuEvents.CHECK_FOR_UPDATES, () => checkForUpdatesWithUpdater(updater)),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.CHECK_FOR_UPDATES, (_evt, options) => checkForUpdatesWithUpdater(updater, options)),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.QUIT_AND_INSTALL, () => {
                    (null != mainWindow && saveWindowConfig(mainWindow), (mainWindow = null));
                    try {
                        updater.quitAndInstallUpdates();
                    } catch (e) {
                        (electron_1.app.relaunch(), electron_1.app.quit());
                    }
                }),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.UPDATER_HISTORY_QUERY_AND_TRUNCATE, () => {
                    null != updater.queryAndTruncateHistory
                        ? webContentsSend(Constants_1.UpdaterEvents.UPDATER_HISTORY_RESPONSE, updater.queryAndTruncateHistory())
                        : webContentsSend(Constants_1.UpdaterEvents.UPDATER_HISTORY_RESPONSE, []);
                }));
        else
            (electron_1.app.on(Constants_1.MenuEvents.CHECK_FOR_UPDATES, () => moduleUpdater_1.moduleUpdater.checkForUpdates()),
                moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.CHECKING_FOR_UPDATES, () => {
                    webContentsSend((updaterState = Constants_1.UpdaterEvents.CHECKING_FOR_UPDATES));
                }),
                moduleUpdater_1.moduleUpdater.supportsEventObjects
                    ? (moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.UPDATE_CHECK_FINISHED, ({ succeeded, updateCount, manualRequired }) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.UPDATE_CHECK_FINISHED}`),
                              handleModuleUpdateCheckFinished(succeeded, updateCount, manualRequired));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULE_PROGRESS, ({ name, progress }) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULE_PROGRESS} ${name} ${progress}`),
                              handleModuleUpdateDownloadProgress(name, progress));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULES_FINISHED, ({ succeeded, failed }) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULES_FINISHED} ${succeeded} ${failed}`),
                              handleModuleUpdateDownloadsFinished(succeeded, failed));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.INSTALLED_MODULE, ({ name, current, total, succeeded }) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.INSTALLED_MODULE} ${name} ${current} ${total} ${succeeded}`),
                              handleModuleUpdateInstalledModule(name, current, total, succeeded));
                      }))
                    : (moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.UPDATE_CHECK_FINISHED, (succeeded, updateCount, manualRequired) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.UPDATE_CHECK_FINISHED} ${succeeded} ${updateCount} ${manualRequired}`),
                              handleModuleUpdateCheckFinished(succeeded, updateCount, manualRequired));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULE_PROGRESS, (name, progress) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULE_PROGRESS} ${name} ${progress}`),
                              handleModuleUpdateDownloadProgress(name, progress));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULES_FINISHED, (succeeded, failed) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.DOWNLOADING_MODULES_FINISHED} ${succeeded} ${failed}`),
                              handleModuleUpdateDownloadsFinished(succeeded, failed));
                      }),
                      moduleUpdater_1.moduleUpdater.events.on(moduleUpdater_1.moduleUpdater.INSTALLED_MODULE, (name, current, total, succeeded) => {
                          (console.log(`legacyModuleUpdater: ${moduleUpdater_1.moduleUpdater.INSTALLED_MODULE} ${name} ${current} ${total} ${succeeded}`),
                              handleModuleUpdateInstalledModule(name, current, total, succeeded));
                      })),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.CHECK_FOR_UPDATES, () => {
                    (console.log(`mainScreen.UpdaterEvents: ${Constants_1.UpdaterEvents.CHECK_FOR_UPDATES} ${updaterState}`),
                        updaterState === Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE ? moduleUpdater_1.moduleUpdater.checkForUpdates() : webContentsSend(updaterState));
                }),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.QUIT_AND_INSTALL, () => {
                    (console.log(`mainScreen.UpdaterEvents: ${Constants_1.UpdaterEvents.QUIT_AND_INSTALL} ${updaterState}`),
                        null != mainWindow && saveWindowConfig(mainWindow),
                        (mainWindow = null));
                    try {
                        moduleUpdater_1.moduleUpdater.quitAndInstallUpdates();
                    } catch (e) {
                        (electron_1.app.relaunch(), electron_1.app.quit());
                    }
                }),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.MODULE_INSTALL, (_event, name) => {
                    (console.log(`mainScreen.UpdaterEvents: ${Constants_1.UpdaterEvents.MODULE_INSTALL} ${name}`), moduleUpdater_1.moduleUpdater.install(name, !1));
                }),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.MODULE_QUERY, (_event, name) => {
                    (console.log(`mainScreen.UpdaterEvents: ${Constants_1.UpdaterEvents.MODULE_QUERY} ${name}`),
                        webContentsSend(Constants_1.UpdaterEvents.MODULE_INSTALLED, name, moduleUpdater_1.moduleUpdater.isInstalled(name, void 0)));
                }),
                ipcMain_1.default.on(Constants_1.UpdaterEvents.UPDATER_HISTORY_QUERY_AND_TRUNCATE, () => {
                    (console.log(`mainScreen.UpdaterEvents: ${Constants_1.UpdaterEvents.UPDATER_HISTORY_QUERY_AND_TRUNCATE}`),
                        webContentsSend(Constants_1.UpdaterEvents.UPDATER_HISTORY_RESPONSE, moduleUpdater_1.moduleUpdater.events.history),
                        (moduleUpdater_1.moduleUpdater.events.history = []));
                }));
        launchMainAppWindow(!1);
    }),
    (exports.handleOpenUrl = function (url) {
        let sanitizedUrl = (function (fullUrl) {
            try {
                let parsedURL = new url_1.default.URL(fullUrl);
                if ("zycord:" === parsedURL.protocol) return { path: getSanitizedPath(parsedURL.pathname), query: parsedURL.search.replace(/^\?/, "") };
            } catch (_) {}
            return null;
        })(url);
        (null != sanitizedUrl &&
            (mainWindowDidFinishLoad || (mainWindowInitialPath = { path: sanitizedUrl.path, query: sanitizedUrl.query }),
            webContentsSend("MAIN_WINDOW_PATH", sanitizedUrl.path, sanitizedUrl.query)),
            null != mainWindow && (setWindowVisible(!0, !1), mainWindow.focus()));
    }),
    (exports.setMainWindowVisible = function (visible, inactive = !1) {
        (visible && bootstrapModules_1.analytics?.getDesktopTTI?.().trackMainWindowShown(), setWindowVisible(visible, !1, inactive));
    }));
let electron_1 = __importStar(__webpack_require__(1288)),
    fs_1 = __importDefault(__webpack_require__(9896)),
    path_1 = __importDefault(__webpack_require__(6928)),
    url_1 = __importDefault(__webpack_require__(7016)),
    Backoff_1 = __importDefault(__webpack_require__(9164)),
    securityUtils_1 = __webpack_require__(1331),
    appBadge = __importStar(__webpack_require__(6820)),
    appConfig = __importStar(__webpack_require__(4973)),
    appSettings_1 = __webpack_require__(8504),
    bootstrapModules_1 = __webpack_require__(9895),
    crashReporterSetup_1 = __webpack_require__(2283),
    logger_1 = __webpack_require__(1944),
    moduleUpdater_1 = __webpack_require__(2979),
    paths_1 = __webpack_require__(822),
    splashScreen_1 = __webpack_require__(5231),
    updater_1 = __webpack_require__(1623),
    processUtils_1 = __webpack_require__(9984),
    constants_1 = __webpack_require__(3716),
    ipcMain_1 = __importDefault(__webpack_require__(2799)),
    mouse = __importStar(__webpack_require__(9419)),
    networkDebugUtils_1 = __webpack_require__(7142),
    popoutWindows = __importStar(__webpack_require__(9698)),
    staffDevTools_1 = __webpack_require__(4520),
    systemTray = __importStar(__webpack_require__(1275)),
    thumbarButtons = __importStar(__webpack_require__(9090)),
    webRequestDispatcher_1 = __webpack_require__(6228),
    { buildInfo } = __webpack_require__(2130),
    Constants_1 = __webpack_require__(6605),
    BootstrapConstants = __webpack_require__(6605),
    settings = appSettings_1.appSettings.getSettings(),
    connectionBackoff = new Backoff_1.default(1e3, 2e4),
    ZYCORD_NAMESPACE = "ZYCORD_",
    envVariables = {
        disableRestart: process.env.ZYCORD_DISABLE_RESTART,
        webappEndpoint: process.env.ZYCORD_WEBAPP_ENDPOINT,
        test: void 0,
        networkDebugLog: process.env.ZYCORD_NETWORK_DEBUG_LOG,
    },
    webAppLoaded = !1;
function getSanitizedPath(path) {
    return new url_1.default.URL(path, exports.WEBAPP_ENDPOINT).pathname;
}
exports.WEBAPP_ENDPOINT = (() => {
    if (null != envVariables.webappEndpoint) return (console.log(`Using ZYCORD_WEBAPP_ENDPOINT override: ${envVariables.webappEndpoint}`), envVariables.webappEndpoint);
    let endpoint = settings?.get("WEBAPP_ENDPOINT");
    if (!1 === endpoint || null == endpoint)
        if ("stable" === buildInfo.releaseChannel) {
            let canMigrate = fs_1.default.existsSync(path_1.default.join(paths_1.paths.getUserData(), "userDataCache.json")),
                alreadyMigrated = fs_1.default.existsSync(path_1.default.join(paths_1.paths.getUserData(), "domainMigrated"));
            (canMigrate ||
                alreadyMigrated ||
                fs_1.default.existsSync(path_1.default.join(paths_1.paths.getUserData(), "settings.json")) ||
                (canMigrate = (function () {
                    try {
                        return (fs_1.default.writeFileSync(path_1.default.join(paths_1.paths.getUserData(), "userDataCache.json"), "{}"), !0);
                    } catch (e) {
                        return (console.warn("Failed to seed empty userDataCache.json for fresh install with error: ", e), !1);
                    }
                })()),
                (endpoint = canMigrate || alreadyMigrated ? "https://app.zyron.site" : "https://app.zyron.site"));
        } else endpoint = "development" === buildInfo.releaseChannel ? "https://app.zyron.site" : `https://${buildInfo.releaseChannel}.app.zyron.site`;
    return endpoint;
})();
let WEBAPP_PATH = (function () {
        let explicitSetting = settings?.get("WEBAPP_PATH", null);
        if (null != explicitSetting) return explicitSetting;
        let isConferenceModeEnabled = settings?.get("enableConferenceMode", !1);
        return `${isConferenceModeEnabled ? Constants_1.WEBAPP_PATHS.CONFERENCE_MODE : Constants_1.WEBAPP_PATHS.APP}?_=${Date.now()}`;
    })(),
    URL_TO_LOAD = `${exports.WEBAPP_ENDPOINT}${WEBAPP_PATH}`,
    MIN_WIDTH = settings?.get("MIN_WIDTH", 940),
    MIN_HEIGHT = settings?.get("MIN_HEIGHT", 500),
    ENABLE_DEVTOOLS = "stable" !== buildInfo.releaseChannel || settings?.get("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING", !1),
    ENABLE_NET_DEBUG = envVariables.networkDebugLog?.toLowerCase() === "true",
    mainWindow = null,
    mainWindowId = BootstrapConstants.DEFAULT_MAIN_WINDOW_ID,
    mainWindowInitialPath = null,
    mainWindowDidFinishLoad = !1,
    mainWindowIsVisible = !1,
    lastCrashed = 0,
    lastCrashedNonRenderer = -1 / 0,
    lastPageLoadFailed = !1,
    retryUpdateOptions = { skip_host_delta: !1, skip_module_delta: {}, skip_all_module_delta: !1, allow_optional_updates: !1 };
function webContentsSend(...args) {
    if (null == mainWindow || mainWindow.isDestroyed()) return void console.error("mainScreen.webContentsSend: mainWindow is null or destroyed");
    if (null == mainWindow.webContents || mainWindow.webContents.isDestroyed())
        return void console.error("mainScreen.webContentsSend: mainWindow.webContents is null or destroyed.");
    let [event, ...options] = args;
    mainWindow.webContents.send(`${ZYCORD_NAMESPACE}${event}`, ...options);
}
function saveWindowConfig(browserWindow) {
    try {
        if (null == browserWindow || browserWindow.isDestroyed()) return;
        (settings?.set("IS_MAXIMIZED", browserWindow.isMaximized()),
            settings?.set("IS_MINIMIZED", browserWindow.isMinimized()),
            settings?.get("IS_MAXIMIZED") || settings?.get("IS_MINIMIZED") || settings?.set("WINDOW_BOUNDS", browserWindow.getBounds()),
            settings?.save());
    } catch (e) {
        console.error(e);
    }
}
function setWindowVisible(isVisible, andUnminimize, inactive = !1) {
    if (null == mainWindow) return void console.error("mainScreen.setWindowVisible: mainWindow is null.");
    if (mainWindow.isDestroyed()) return void console.error("mainScreen.setWindowVisible: mainWindow isDestroyed.");
    if (isVisible) {
        let isMinimized = mainWindow.isMinimized();
        andUnminimize || !isMinimized
            ? inactive
                ? mainWindow.showInactive()
                : (mainWindow.show(), webContentsSend("MAIN_WINDOW_FOCUS"))
            : console.log(`mainScreen.setWindowVisible: didn't show. andUnminimize: ${andUnminimize}, isMinimized: ${isMinimized}.`);
    } else (webContentsSend("MAIN_WINDOW_BLUR"), mainWindow.hide(), systemTray.hasInit && systemTray.displayHowToCloseHint());
    (mainWindow.setSkipTaskbar(!isVisible), (mainWindowIsVisible = isVisible));
}
function getDisplayForBounds(displays, bounds) {
    return displays.find((display) => {
        let displayBound = display.workArea;
        return (
            (displayBound.x += 32),
            (displayBound.y += 32),
            (displayBound.width -= 64),
            (displayBound.height -= 64),
            (function (a, b) {
                let ax1 = a.x + a.width,
                    bx1 = b.x + b.width,
                    ay1 = a.y + a.height,
                    by1 = b.y + b.height;
                if ((ax1 < bx1 ? ax1 : bx1) - (a.x < b.x ? b.x : a.x) > 0 && (ay1 < by1 ? ay1 : by1) - (a.y < b.y ? b.y : a.y) > 0) return !0;
                return !1;
            })(bounds, displayBound)
        );
    });
}
function getSavedWindowBounds() {
    if (!settings?.get("WINDOW_BOUNDS")) return null;
    let bounds = settings.get("WINDOW_BOUNDS");
    return (
        (bounds.width = Math.max(MIN_WIDTH, bounds.width)),
        (bounds.height = Math.max(MIN_HEIGHT, bounds.height)),
        null != getDisplayForBounds(electron_1.screen.getAllDisplays(), bounds) ? bounds : null
    );
}
function openVoiceSettings() {
    (setWindowVisible(!0, !0), webContentsSend("SYSTEM_TRAY_OPEN_VOICE_SETTINGS"));
}
function toggleMute() {
    webContentsSend("SYSTEM_TRAY_TOGGLE_MUTE");
}
function toggleDeafen() {
    webContentsSend("SYSTEM_TRAY_TOGGLE_DEAFEN");
}
function launchApplication(applicationId) {
    webContentsSend("LAUNCH_APPLICATION", applicationId);
}
function loadMainPage() {
    (performance.mark("mainscreen-loadmainpage"),
        bootstrapModules_1.analytics?.getDesktopTTI?.().trackMainWindowLoadStart(),
        (lastPageLoadFailed = !1),
        mainWindow?.loadURL(URL_TO_LOAD),
        setTimeout(() => {
            if (!webAppLoaded && 0.05 > Math.random()) {
                let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                null != sentry && sentry.captureMessage("WebApp timed out loading (timeout=60s)");
            }
        }, 6e4));
}
let DEFAULT_BACKGROUND_COLOR = "#2f3136",
    BACKGROUND_COLOR_KEY = "BACKGROUND_COLOR";
function getBackgroundColor() {
    return settings?.get(BACKGROUND_COLOR_KEY, DEFAULT_BACKGROUND_COLOR) ?? DEFAULT_BACKGROUND_COLOR;
}
async function trackStartupCacheUsage(session) {
    let [httpCacheSizeBytes, sharedDictionaryUsage] = await Promise.all([session.getCacheSize().catch(() => null), session.getSharedDictionaryUsageInfo().catch(() => null)]),
        sharedDictionarySizeBytes = sharedDictionaryUsage?.reduce((total, usage) => total + usage.totalSizeBytes, 0) ?? null;
    bootstrapModules_1.analytics?.getDesktopTTI?.().trackCacheUsage(httpCacheSizeBytes, sharedDictionarySizeBytes);
}
async function launchMainAppWindow(isVisible) {
    var mainWindow1;
    let savedWindowBounds, currentBounds;
    (performance.mark("mainscreen-launch-window"), mainWindow?.destroy());
    let additionalArguments = ["--enable-node-leakage-in-renderers"];
    ("win32" === process.platform && settings?.get("DESKTOP_NATIVE_PREMAP", !1) === !0 && additionalArguments.push("--enable-native-premap"),
        exports.WEBAPP_ENDPOINT.startsWith("http://") &&
            !exports.WEBAPP_ENDPOINT.startsWith("http://localhost") &&
            (console.log("Allowing insecure origin for development"), additionalArguments.push(`--unsafely-treat-insecure-origin-as-secure=${exports.WEBAPP_ENDPOINT}`)));
    let mainWindowOptions = {
        title: "Zycord",
        backgroundColor: getBackgroundColor(),
        width: 1280,
        height: 720,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        transparent: !1,
        frame: !1,
        resizable: !0,
        show: isVisible,
        webPreferences: {
            enableBlinkFeatures: "EnumerateDevices,AudioOutputDevices",
            nodeIntegration: !1,
            sandbox: !1,
            preload: path_1.default.join(__dirname, "mainScreenPreload.js"),
            spellcheck: !0,
            contextIsolation: !0,
            additionalArguments,
            devTools: ENABLE_DEVTOOLS,
        },
    };
    ("linux" === process.platform && (mainWindowOptions.icon = path_1.default.join(path_1.default.dirname(electron_1.app.getPath("exe")), "icon.png")),
        "darwin" === process.platform && ((mainWindowOptions.titleBarStyle = "hidden"), (mainWindowOptions.trafficLightPosition = { x: 9, y: 9 })),
        (function (mainWindowOptions) {
            let bounds = getSavedWindowBounds();
            if (null == bounds) {
                mainWindowOptions.center = !0;
                return;
            }
            ((mainWindowOptions.width = bounds.width), (mainWindowOptions.height = bounds.height), (mainWindowOptions.x = bounds.x), (mainWindowOptions.y = bounds.y));
        })(mainWindowOptions),
        bootstrapModules_1.analytics?.getDesktopTTI?.().trackMainWindowCreated(),
        (mainWindowId = (mainWindow = new electron_1.BrowserWindow(mainWindowOptions)).id),
        (global.mainWindowId = mainWindowId),
        (function (path, cb) {
            try {
                let module1 = require(path);
                (null != cb && cb(module1), console.log(`Module ${path} was included.`));
            } catch (e) {
                e?.code === "MODULE_NOT_FOUND"
                    ? console.log(`Optional module ${path} was not included.`)
                    : (console.error(`Failed to initialize ${path}`, e), console.error(`e.toString() ${e.toString()}`));
            }
        })("./ElectronTestRpc", (module1) => module1.initialize(mainWindow)),
        trackStartupCacheUsage(mainWindow.webContents.session));
    try {
        (settings?.get("DESKTOP_TTI_REMOVE_SHADER_CACHE_CLEAR", !1) !== !0 &&
            (console.log("Clearing GPU cache..."), await mainWindow.webContents.session.clearStorageData({ storages: ["shadercache"] })),
            settings?.get("DESKTOP_TTI_REMOVE_V8_CACHE_CLEAR", !1) !== !0 && (console.log("Clearing code cache..."), await mainWindow.webContents.session.clearCodeCaches({})));
    } catch (error) {
        console.error("Failed to clear caches:", error);
    }
    if (settings?.get("DESKTOP_TTI_HTTP_CDT", !1) === !0) {
        let ENTRY_CHUNK_BASENAME_RE = /^web\.[a-f0-9]+\.js$/;
        (0, webRequestDispatcher_1.registerBeforeRequest)(
            mainWindow.webContents.session,
            "http-cdt",
            (details) => {
                try {
                    let parsedUrl = new url_1.default.URL(details.url),
                        basename = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/") + 1);
                    if (!ENTRY_CHUNK_BASENAME_RE.test(basename) || "1" === parsedUrl.searchParams.get("cdt")) return;
                    return (parsedUrl.searchParams.set("cdt", "1"), { redirectURL: parsedUrl.toString() });
                } catch (_) {
                    return;
                }
            },
            [`${exports.WEBAPP_ENDPOINT}/assets/web.*.js*`],
        );
    }
    ((mainWindow1 = mainWindow),
        (savedWindowBounds = getSavedWindowBounds()),
        (currentBounds = mainWindow1.getBounds()),
        null != savedWindowBounds &&
            (currentBounds.height !== savedWindowBounds.height || currentBounds.width !== savedWindowBounds.width) &&
            mainWindow1.setBounds(savedWindowBounds),
        mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
            switch (permission) {
                case "accessibility-events":
                    callback(!0);
                    return;
                case "notifications":
                    callback((0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, exports.WEBAPP_ENDPOINT));
                    return;
                case "pointerLock":
                case "fullscreen":
                case "clipboard-sanitized-write":
                    callback(!details.isMainFrame || (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, exports.WEBAPP_ENDPOINT));
                    return;
                case "media":
                    callback(
                        (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID) ||
                            (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID_V2) ||
                            (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID_FACE_SCAN) ||
                            (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, exports.WEBAPP_ENDPOINT),
                    );
                    return;
            }
            callback(!1);
        }),
        mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission, requestingOrigin, details) => {
            switch (permission) {
                case "notifications":
                case "fullscreen":
                case "pointerLock":
                case "clipboard-sanitized-write":
                    if (details.isMainFrame || null == details.embeddingOrigin) return (0, securityUtils_1.checkUrlOriginMatches)(requestingOrigin, exports.WEBAPP_ENDPOINT);
                    return (0, securityUtils_1.checkUrlOriginMatches)(details.embeddingOrigin, exports.WEBAPP_ENDPOINT);
                case "media":
                    if (null == details.requestingUrl) break;
                    return (
                        (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID) ||
                        (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID_V2) ||
                        (0, securityUtils_1.checkUrlOriginMatches)(details.requestingUrl, Constants_1.AllowedMediaOrigins.K_ID_FACE_SCAN) ||
                        (0, securityUtils_1.checkUrlOriginMatches)(requestingOrigin, exports.WEBAPP_ENDPOINT)
                    );
            }
            return !1;
        }),
        mainWindow.webContents.session.on("select-webauthn-account", (_event, details, callback) => {
            let { accounts } = details;
            if (1 === accounts.length) return void callback(accounts[0].credentialId);
            let labels = accounts.map((account) => account.displayName ?? account.name ?? account.credentialId),
                response = electron_1.default.dialog.showMessageBoxSync({
                    type: "question",
                    message: "Choose an account to continue",
                    buttons: [...labels, "Cancel"],
                    cancelId: labels.length,
                });
            callback(response < labels.length ? accounts[response].credentialId : void 0);
        }),
        mainWindow.setMenuBarVisibility(!1),
        settings?.get("IS_MAXIMIZED") && mainWindow.maximize(),
        settings?.get("IS_MINIMIZED") && mainWindow.minimize(),
        mainWindow.webContents.setWindowOpenHandler(({ url, frameName, features }) =>
            frameName.startsWith(ZYCORD_NAMESPACE) && (0, securityUtils_1.checkUrlOriginMatches)(url, exports.WEBAPP_ENDPOINT) && "/popout" === getSanitizedPath(url)
                ? popoutWindows.openOrFocusWindow(url, frameName, features)
                : ((0, securityUtils_1.shouldOpenExternalUrl)(url) && (0, securityUtils_1.saferShellOpenExternal)(url), { action: "deny" }),
        ),
        mainWindow.webContents.on("did-fail-load", (e, errCode, errDesc, validatedUrl) => {
            validatedUrl !== URL_TO_LOAD ||
                (-3 !== errCode &&
                    0 !== errCode &&
                    ((lastPageLoadFailed = !0),
                    console.error("[WebContents] did-fail-load", errCode, errDesc, `retry in ${connectionBackoff.current} ms`),
                    connectionBackoff.fail(() => {
                        (console.log("[WebContents] retrying load", URL_TO_LOAD), loadMainPage());
                    })));
        }),
        mainWindow.webContents.on("did-create-window", (childWindow, { options, frameName }) => {
            (childWindow.setMenuBarVisibility(!1), (childWindow.windowKey = frameName), popoutWindows.setupPopout(childWindow, frameName, options, exports.WEBAPP_ENDPOINT));
            let bounds = childWindow.getBounds(),
                displays = electron_1.screen.getAllDisplays();
            if (!getDisplayForBounds(displays, bounds) && displays.length > 0) {
                let displayBounds = displays[0].bounds;
                ((bounds.x = displayBounds.x),
                    (bounds.y = displayBounds.y),
                    (bounds.width = Math.min(bounds.width, displayBounds.width)),
                    (bounds.height = Math.min(bounds.height, displayBounds.height)),
                    childWindow.setBounds(bounds));
            }
        }));
    let loadingDragCssPromises = [];
    (mainWindow.webContents.once("did-finish-load", () => {
        bootstrapModules_1.analytics?.getDesktopTTI?.().trackMainWindowDocumentLoad();
    }),
        mainWindow.webContents.on("did-finish-load", () => {
            null != mainWindow && loadingDragCssPromises.push(mainWindow.webContents.insertCSS("body { -webkit-app-region: drag; }").catch(() => null));
        }),
        ipcMain_1.default.on(constants_1.IPCEvents.APP_ASYNC_INDEX_TSX_LOADED, () => {
            for (let promise of loadingDragCssPromises.splice(0))
                promise
                    .then((key) => {
                        null != key && mainWindow?.webContents.removeInsertedCSS(key).catch(() => {});
                    })
                    .catch(() => {});
            if ((mainWindowDidFinishLoad || bootstrapModules_1.analytics?.getDesktopTTI?.().trackMainWindowLoadDuration(), (mainWindowDidFinishLoad = !0), ENABLE_NET_DEBUG)) {
                let netLogger = logger_1.logger.networkDebugLogger();
                null != netLogger && (0, networkDebugUtils_1.setupNetworkLogging)(mainWindow, netLogger);
            }
            (null != mainWindowInitialPath && (webContentsSend("MAIN_WINDOW_PATH", mainWindowInitialPath.path, mainWindowInitialPath.query), (mainWindowInitialPath = null)),
                webContentsSend(mainWindow?.isFocused() ? "MAIN_WINDOW_FOCUS" : "MAIN_WINDOW_BLUR"),
                !lastPageLoadFailed &&
                    (connectionBackoff.succeed(),
                    splashScreen_1.splashScreen.pageReady(),
                    settings?.get(staffDevTools_1._STAFF_DEV_TOOLS_KEY, !1) &&
                        (0, staffDevTools_1.tryLoadStaffDevToolsModule)(mainWindow, exports.WEBAPP_ENDPOINT).catch((e) => {
                            let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                            sentry?.captureMessage(`[STAFF_DEV_TOOLS] Unexpected error: ${e instanceof Error ? e.message : e}`);
                        })));
        }),
        mainWindow.webContents.on("render-process-gone", (e, details) => {
            let reason = details?.reason ?? "Unknown";
            if (
                ((processUtils_1.processUtilsSettings.rendererCrashReason = reason),
                (processUtils_1.processUtilsSettings.rendererCrashExitCode = details?.exitCode ?? null),
                (processUtils_1.processUtilsSettings.lastRunsStoredInformation = processUtils_1.processUtilsSettings.currentStoredInformation),
                (processUtils_1.processUtilsSettings.currentStoredInformation = {}),
                "killed" === reason)
            )
                return void electron_1.app.quit();
            let crashTime = Date.now();
            if (crashTime - lastCrashed < 5e3) {
                (console.error(`[WebContents] double crashed (reason: ${reason}, exitCode: ${details?.exitCode})... RIP =(`), electron_1.app.quit());
                return;
            }
            ((lastCrashed = crashTime),
            console.error(`[WebContents] crashed (reason: ${reason}, exitCode: ${details?.exitCode})... reloading`),
            null != envVariables.disableRestart)
                ? electron_1.app.quit()
                : mainWindow?.webContents.reload();
        }),
        mainWindow.webContents.on("will-navigate", (evt, url) => {
            (0, securityUtils_1.checkUrlOriginMatches)(url, exports.WEBAPP_ENDPOINT) || evt.preventDefault();
        }),
        mainWindow.webContents.on("context-menu", (_, params) => {
            webContentsSend("SPELLCHECK_RESULT", params.misspelledWord, params.dictionarySuggestions);
        }),
        mainWindow.webContents.on("devtools-opened", () => {
            webContentsSend("WINDOW_DEVTOOLS_OPENED");
        }),
        mainWindow.webContents.on("devtools-closed", () => {
            webContentsSend("WINDOW_DEVTOOLS_CLOSED");
        }),
        mainWindow.on("focus", () => {
            webContentsSend("MAIN_WINDOW_FOCUS");
        }),
        mainWindow.on("blur", () => {
            webContentsSend("MAIN_WINDOW_BLUR");
        }),
        mainWindow.on("page-title-updated", (e, title) => {
            null != mainWindow && (e.preventDefault(), setMainWindowTitle(title));
        }),
        mainWindow.on("leave-html-full-screen", () => {
            null != mainWindow && mainWindow.setMenuBarVisibility(!1);
        }),
        mainWindow.on("show", () => {
            setTimeout(() => appBadge.refreshAppBadge(), 500);
        }),
        mainWindow.webContents.on("did-navigate-in-page", (_, eventUrl) => {
            let parsedUrl;
            if (null != mainWindow) {
                try {
                    parsedUrl = new url_1.default.URL(eventUrl);
                } catch (_) {
                    return;
                }
                ("/login" === parsedUrl.pathname && mainWindow.webContents.clearHistory(), setMainWindowTitle(mainWindow.webContents.getTitle()));
            }
        }),
        mainWindow.on("swipe", (_, direction) => {
            switch (direction) {
                case "left":
                    webContentsSend("NAVIGATE_BACK", "SWIPE");
                    break;
                case "right":
                    webContentsSend("NAVIGATE_FORWARD", "SWIPE");
            }
        }),
        null != logger_1.logger && mainWindow.webContents.on("console-message", logger_1.logger.ipcMainRendererLogger),
        "win32" === process.platform &&
            mainWindow.on("app-command", (_, cmd) => {
                switch (cmd) {
                    case "browser-backward":
                        webContentsSend("NAVIGATE_BACK", "BROWSER");
                        break;
                    case "browser-forward":
                        webContentsSend("NAVIGATE_FORWARD", "BROWSER");
                }
            }),
        "darwin" === process.platform &&
            mainWindow.on(
                "close",
                (e) => (
                    null != mainWindow &&
                        (mainWindow.isFullScreen()
                            ? mainWindow.setFullScreen(!1)
                            : (webContentsSend("MAIN_WINDOW_HIDDEN"), electron_1.default.Menu.sendActionToFirstResponder("hide:")),
                        e.preventDefault()),
                    !1
                ),
            ),
        performance.mark("mainscreen-launch-window-misc-setup"),
        systemTray.hasInit ||
            systemTray.init({
                onCheckForUpdates: () => {
                    let updater = updater_1.updater?.getUpdater();
                    null != updater ? checkForUpdatesWithUpdater(updater) : moduleUpdater_1.moduleUpdater.checkForUpdates();
                },
                onTrayClicked: () => setWindowVisible(!0, !0),
                onOpenVoiceSettings: openVoiceSettings,
                onToggleMute: toggleMute,
                onToggleDeafen: toggleDeafen,
                onLaunchApplication: launchApplication,
            }),
        appBadge.hasInit || appBadge.init(),
        appConfig.hasInit || appConfig.init(),
        popoutWindows.hasInit || popoutWindows.init(),
        thumbarButtons.init(),
        mouse.init(),
        performance.measure("mainscreen-launch-window-misc-setup-duration", "mainscreen-launch-window-misc-setup"),
        ("linux" === process.platform || "win32" === process.platform) &&
            mainWindow.on("close", (e) => {
                null == mainWindow
                    ? popoutWindows.closePopouts()
                    : (webContentsSend("MAIN_WINDOW_BLUR"), saveWindowConfig(mainWindow), settings?.get("MINIMIZE_TO_TRAY", !0))
                      ? (webContentsSend("MAIN_WINDOW_HIDDEN"), setWindowVisible(!1, !1), e.preventDefault())
                      : electron_1.app.quit();
            }),
        loadMainPage(),
        performance.measure("mainscreen-launch-window-duration", "mainscreen-launch-window"));
}
let updaterState = Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE;
function handleModuleUpdateCheckFinished(succeeded, updateCount, manualRequired) {
    if (!succeeded) {
        ((updaterState = Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE), webContentsSend(Constants_1.UpdaterEvents.UPDATE_ERROR));
        return;
    }
    webContentsSend(
        (updaterState =
            0 === updateCount
                ? Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE
                : manualRequired
                  ? Constants_1.UpdaterEvents.UPDATE_MANUALLY
                  : Constants_1.UpdaterEvents.UPDATE_AVAILABLE),
    );
}
function handleModuleUpdateDownloadProgress(name, progress) {
    (mainWindow?.setProgressBar(progress), webContentsSend(Constants_1.UpdaterEvents.MODULE_INSTALL_PROGRESS, name, progress));
}
function handleModuleUpdateDownloadsFinished(succeeded, failed) {
    (mainWindow?.setProgressBar(-1),
        updaterState === Constants_1.UpdaterEvents.UPDATE_AVAILABLE &&
            (failed > 0
                ? ((updaterState = Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE), webContentsSend(Constants_1.UpdaterEvents.UPDATE_ERROR))
                : webContentsSend((updaterState = Constants_1.UpdaterEvents.UPDATE_DOWNLOADED))));
}
function handleModuleUpdateInstalledModule(name, current, total, succeeded) {
    (mainWindow?.setProgressBar(-1), webContentsSend(Constants_1.UpdaterEvents.MODULE_INSTALLED, name, succeeded));
}
function setMainWindowTitle(title) {
    (title.endsWith("Zycord") || (title += " - Zycord"), mainWindow?.setTitle(title));
}
async function checkForUpdatesWithUpdater(updater, options) {
    let allowMultipleUpdates = options?.allowMultipleUpdates ?? !1;
    if (updaterState === Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE || allowMultipleUpdates) {
        webContentsSend((updaterState = Constants_1.UpdaterEvents.CHECKING_FOR_UPDATES));
        try {
            var newUpdaterState;
            let installedAnything = !1;
            function progressCallback(progress) {
                let task = progress.task.HostInstall || progress.task.ModuleInstall;
                if (null != task && "Complete" === progress.state && !installedAnything) {
                    var newUpdaterState;
                    ((installedAnything = !0), (newUpdaterState = Constants_1.UpdaterEvents.UPDATE_AVAILABLE), webContentsSend((updaterState = newUpdaterState)));
                }
                null != task &&
                    null != progress.state.Failed &&
                    (null != progress.task.HostInstall
                        ? (retryUpdateOptions.skip_host_delta = !0)
                        : null != progress.task.ModuleInstall && (retryUpdateOptions.skip_module_delta[task.version.module.name] = !0));
            }
            (updater.updateToLatestWithOptions ? await updater.updateToLatestWithOptions(retryUpdateOptions, progressCallback) : await updater.updateToLatest(progressCallback),
                (newUpdaterState = installedAnything ? Constants_1.UpdaterEvents.UPDATE_DOWNLOADED : Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE),
                webContentsSend((updaterState = newUpdaterState)));
        } catch (e) {
            (console.error("Update to latest failed: ", e),
                (updaterState = Constants_1.UpdaterEvents.UPDATE_NOT_AVAILABLE),
                webContentsSend(Constants_1.UpdaterEvents.UPDATE_ERROR));
        }
    } else webContentsSend(updaterState);
}
let analyticsState = { ready: !1, cached: [] };
function handleDisplayChange() {
    null != mainWindow && ("win32" !== process.platform || mainWindowIsVisible || setWindowVisible(mainWindowIsVisible, !1));
}
