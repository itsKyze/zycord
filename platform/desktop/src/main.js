/**
 * Zycord Desktop Main Entry Point
 */
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, clipboard, session, desktopCapturer } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

Menu.setApplicationMenu(null);

// Linux Wayland & Hardware Acceleration flags
app.commandLine.appendSwitch("enable-features", "WaylandWindowDecorations,WebRTCPipeWireCapturer");
app.commandLine.appendSwitch("enable-webrtc-pipewire-capturer");
app.commandLine.appendSwitch("ozone-platform-hint", "auto");

log.transports.file.level = "info";
autoUpdater.logger = log;

const { IPCEvents } = require("./core/modules/ipc_events");

let splashWindow = null;
let mainWindow = null;

const DEFAULT_WEBAPP_URL = "https://app.zyron.site/app";
const APP_TITLE = "Zycord";
const APP_ICON = path.join(__dirname, "..", "assets", "icon.png");

// 1. Splash Window (300x350 - exactly like Discord splash)
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 300,
        height: 350,
        resizable: false,
        frame: false,
        show: false,
        center: true,
        backgroundColor: "#282b30",
        icon: APP_ICON,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
            webSecurity: false,
        },
    });

    splashWindow.loadFile(path.join(__dirname, "bootstrap", "splash", "index.html"));

    splashWindow.once("ready-to-show", () => {
        splashWindow.show();
        setupUpdates();
    });
}

function sendSplashState(state) {
    if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.webContents.send("ZYCORD_SPLASH_UPDATE_STATE", state);
    }
}

// 2. Main Window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: APP_TITLE,
        icon: APP_ICON,
        width: 1280,
        height: 720,
        minWidth: 940,
        minHeight: 500,
        backgroundColor: "#1e1f22",
        frame: false,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: false,
            sandbox: false,
            webSecurity: true,
        },
    });
    mainWindow.setMenuBarVisibility(false);

    // Auto-grant permissions for audio, video, screenshare, notifications
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
        callback(true);
    });
    session.defaultSession.setPermissionCheckHandler(() => true);

    const ZYCORD_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.186 Electron/33.4.11 Safari/537.36 Zycord/1.0.17";
    mainWindow.webContents.setUserAgent(ZYCORD_UA);

    const webappUrl = process.env.ZYCORD_WEBAPP_URL || DEFAULT_WEBAPP_URL;

    mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
        console.error("[MainWindow] Failed to load URL:", validatedURL, errorCode, errorDescription);
        setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.loadURL("https://app.zyron.site/app");
            }
        }, 1000);
    });

    mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
        console.log(`[Renderer] (${level}) ${message}`);
    });

    const showMain = () => {
        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.destroy();
            splashWindow = null;
        }
        if (mainWindow && !mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus();
        }
    };

    mainWindow.once("ready-to-show", showMain);
    mainWindow.webContents.once("did-finish-load", showMain);
    setTimeout(showMain, 2000);

    // Open DevTools with Ctrl+Shift+I or F12
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if ((input.control && input.shift && input.key.toLowerCase() === "i") || input.key === "F12") {
            mainWindow.webContents.toggleDevTools();
            event.preventDefault();
        }
    });

    mainWindow.loadURL(webappUrl).catch((err) => {
        console.error("[MainWindow] loadURL error:", err);
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// 3. Updater Flow
function setupUpdates() {
    let mainCreated = false;
    const launchMain = () => {
        if (mainCreated) return;
        mainCreated = true;
        sendSplashState({ status: "starting" });
        setTimeout(() => {
            createMainWindow();
        }, 800);
    };

    // Safety timeout: never hang on splash for more than 2.5s
    const fallbackTimer = setTimeout(launchMain, 2500);

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("checking-for-update", () => {
        sendSplashState({ status: "checking-for-updates" });
    });

    autoUpdater.on("update-available", (info) => {
        clearTimeout(fallbackTimer);
        sendSplashState({ status: "downloading-updates", progress: 0 });
    });

    autoUpdater.on("download-progress", (progress) => {
        sendSplashState({ status: "downloading-updates", progress: Math.round(progress.percent) });
    });

    autoUpdater.on("update-downloaded", () => {
        sendSplashState({ status: "installing-updates", progress: 100 });
        setTimeout(() => {
            autoUpdater.quitAndInstall();
        }, 1500);
    });

    autoUpdater.on("update-not-available", () => {
        clearTimeout(fallbackTimer);
        launchMain();
    });

    autoUpdater.on("error", (err) => {
        log.warn("[Updater] check skipped/failed:", err.message);
        clearTimeout(fallbackTimer);
        launchMain();
    });

    // Check updates
    try {
        autoUpdater.checkForUpdates().catch(() => {
            clearTimeout(fallbackTimer);
            launchMain();
        });
    } catch {
        clearTimeout(fallbackTimer);
        launchMain();
    }
}

// IPC Handlers
ipcMain.on("ZYCORD_SPLASH_SCREEN_READY", () => {
    sendSplashState({ status: "checking-for-updates" });
});

// Native Window Controls
const handleMinimize = () => { if (mainWindow) mainWindow.minimize(); };
const handleMaximize = () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) mainWindow.unmaximize();
        else mainWindow.maximize();
    }
};
const handleClose = () => { if (mainWindow) mainWindow.close(); };

ipcMain.handle(IPCEvents.WINDOW_MINIMIZE, handleMinimize);
ipcMain.handle("window-minimize", handleMinimize);

ipcMain.handle(IPCEvents.WINDOW_MAXIMIZE, handleMaximize);
ipcMain.handle("window-maximize", handleMaximize);

ipcMain.handle(IPCEvents.WINDOW_CLOSE, handleClose);
ipcMain.handle("window-close", handleClose);

ipcMain.handle(IPCEvents.WINDOW_SET_ALWAYS_ON_TOP, (_event, enabled) => {
    if (mainWindow) mainWindow.setAlwaysOnTop(!!enabled);
});
ipcMain.handle("window-set-always-on-top", (_event, enabled) => {
    if (mainWindow) mainWindow.setAlwaysOnTop(!!enabled);
});

ipcMain.on("window-is-maximized", (event) => {
    event.returnValue = mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle("clipboard-copy", (_event, text) => {
    clipboard.writeText(text || "");
});
ipcMain.handle("clipboard-paste", () => {
    return clipboard.readText();
});
ipcMain.handle("window-relaunch", () => {
    app.relaunch();
    app.quit();
});
ipcMain.handle("window-focus", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});
ipcMain.handle("set-zoom-factor", (_event, factor) => {
    if (mainWindow && typeof factor === "number") {
        mainWindow.webContents.setZoomFactor(factor);
    }
});
ipcMain.handle("get-zoom-factor", () => {
    return mainWindow ? mainWindow.webContents.getZoomFactor() : 1.0;
});
ipcMain.handle("desktop-capture-get-sources", async (_event, opts) => {
    try {
        const sources = await desktopCapturer.getSources(opts || { types: ["screen", "window"] });
        return sources.map((s) => ({
            id: s.id,
            name: s.name,
            url: s.thumbnail ? s.thumbnail.toDataURL() : "",
        }));
    } catch (e) {
        return [];
    }
});

ipcMain.handle("check-for-updates", async () => {
    return await autoUpdater.checkForUpdates();
});

ipcMain.handle("quit-and-install-update", () => {
    autoUpdater.quitAndInstall();
});

// App Lifecycle
app.whenReady().then(() => {
    app.name = APP_TITLE;
    createSplashWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            if (mainWindow) mainWindow.show();
            else createSplashWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
