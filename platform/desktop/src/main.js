/**
 * Zycord Desktop Main Entry Point
 */
const path = require("path");
const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

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
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
    });

    const DISCORD_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9168 Chrome/128.0.6613.186 Electron/33.2.0 Safari/537.36 Zycord/1.0.13";
    mainWindow.webContents.setUserAgent(DISCORD_UA);

    const webappUrl = process.env.ZYCORD_WEBAPP_URL || DEFAULT_WEBAPP_URL;

    mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
        log.warn("[MainWindow] Failed to load URL:", validatedURL, errorCode, errorDescription);
        if (validatedURL !== "https://app.zyron.site") {
            mainWindow.loadURL("https://app.zyron.site");
        }
    });

    mainWindow.loadURL(webappUrl).catch(() => {
        mainWindow.loadURL("https://app.zyron.site");
    });

    mainWindow.once("ready-to-show", () => {
        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.destroy();
            splashWindow = null;
        }
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// 3. Updater Flow
function setupUpdates() {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("checking-for-update", () => {
        sendSplashState({ status: "checking-for-updates" });
    });

    autoUpdater.on("update-available", (info) => {
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
        sendSplashState({ status: "starting" });
        setTimeout(() => {
            createMainWindow();
        }, 1000);
    });

    autoUpdater.on("error", (err) => {
        log.warn("[Updater] check skipped/failed:", err.message);
        sendSplashState({ status: "starting" });
        setTimeout(() => {
            createMainWindow();
        }, 1000);
    });

    // Check updates
    autoUpdater.checkForUpdates().catch(() => {
        sendSplashState({ status: "starting" });
        setTimeout(() => {
            createMainWindow();
        }, 1000);
    });
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
