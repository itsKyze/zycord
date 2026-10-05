const { app, BrowserWindow, Tray, Menu, ipcMain, shell, session, desktopCapturer, clipboard } = require("electron");
const path = require("path");
const UpdaterService = require("./updater/UpdaterService");
const UpdaterConfig = require("./updater/UpdaterConfig");

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
}

// Global References
let updaterWindow = null;
let updaterService = null;
let mainWindow = null;
let tray = null;
let isQuitting = false;

const APP_URL = "https://app.zyron.site/app";
const ICON_PATH = path.join(__dirname, "../assets/icon.ico");
const DISCORD_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9168 Chrome/128.0.6613.186 Electron/32.2.0 Safari/537.36";

// Create Minimal Centered Desktop Updater Window (360x300)
function createUpdaterWindow() {
    updaterWindow = new BrowserWindow({
        width: UpdaterConfig.window.width || 360,
        height: UpdaterConfig.window.height || 300,
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: UpdaterConfig.window.backgroundColor || "#25282E",
        center: true,
        show: false,
        alwaysOnTop: true,
        icon: ICON_PATH,
        webPreferences: {
            preload: path.join(__dirname, "updater/preload-updater.js"),
            contextIsolation: true,
            nodeIntegration: false,
            backgroundThrottling: false,
        },
    });

    updaterWindow.loadFile(path.join(__dirname, "updater/updater.html"));

    updaterWindow.once("ready-to-show", () => {
        updaterWindow.show();
        updaterWindow.focus();

        // Initialize and start update state machine
        updaterService = new UpdaterService(UpdaterConfig);

        updaterService.on("state", (payload) => {
            if (updaterWindow && !updaterWindow.isDestroyed()) {
                updaterWindow.webContents.send("updater:state", payload);
            }
        });

        updaterService.on("retry-tick", (payload) => {
            if (updaterWindow && !updaterWindow.isDestroyed()) {
                updaterWindow.webContents.send("updater:retry-tick", payload);
            }
        });

        updaterService.on("ready-to-launch", () => {
            launchMainWindow();
        });

        updaterService.start();
    });

    updaterWindow.on("closed", () => {
        updaterWindow = null;
    });
}

function launchMainWindow() {
    if (mainWindow) return;

    createMainWindow();

    if (updaterWindow && !updaterWindow.isDestroyed()) {
        updaterWindow.close();
        updaterWindow = null;
    }
}

// Create Main Application Window
function createMainWindow() {
    if (mainWindow) return;

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 940,
        minHeight: 500,
        frame: false,
        backgroundColor: "#1e1f22",
        show: false,
        icon: ICON_PATH,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            backgroundThrottling: false,
            spellcheck: true,
        },
    });

    mainWindow.webContents.setUserAgent(DISCORD_USER_AGENT);
    mainWindow.loadURL(APP_URL);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // External URL handling
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (!url.startsWith("https://app.zyron.site")) {
            shell.openExternal(url);
            return { action: "deny" };
        }
        return { action: "allow" };
    });

    // Minimize to tray on close
    mainWindow.on("close", (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    createTray();
    setupScreenShareHandler();
}

// System Tray
function createTray() {
    if (tray) return;

    tray = new Tray(ICON_PATH);
    tray.setToolTip("Zycord");

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open Zycord",
            click: () => {
                mainWindow?.show();
                mainWindow?.focus();
            },
        },
        { type: "separator" },
        {
            label: "Check for Updates…",
            click: () => {
                updaterService?.checkForUpdates();
            },
        },
        {
            label: "Start with Windows",
            type: "checkbox",
            checked: app.getLoginItemSettings().openAtLogin,
            click: (menuItem) => {
                app.setLoginItemSettings({
                    openAtLogin: menuItem.checked,
                    openAsHidden: true,
                });
            },
        },
        { type: "separator" },
        {
            label: "Quit Zycord",
            click: () => {
                isQuitting = true;
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
        if (mainWindow?.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow?.show();
            mainWindow?.focus();
        }
    });
}

// Handle Screen Sharing Permission
function setupScreenShareHandler() {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ["screen", "window"] }).then((sources) => {
            if (sources.length > 0) {
                callback({ video: sources[0] });
            }
        });
    });
}

// IPC Handlers for Updater
ipcMain.on("updater:retry-now", () => {
    updaterService?.retryNow();
});

ipcMain.on("updater:close", () => {
    app.quit();
});

// IPC Handlers for DiscordNative
ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize();
    else mainWindow?.maximize();
});
ipcMain.on("window-close", () => mainWindow?.close());
ipcMain.on("window-is-maximized", (event) => {
    event.returnValue = mainWindow ? mainWindow.isMaximized() : false;
});
ipcMain.on("window-set-always-on-top", (event, enabled) => {
    mainWindow?.setAlwaysOnTop(Boolean(enabled));
});
ipcMain.on("get-app-version", (event) => {
    event.returnValue = app.getVersion();
});
ipcMain.on("app-relaunch", () => {
    app.relaunch();
    app.exit(0);
});
ipcMain.on("clipboard-copy", (event, text) => {
    clipboard.writeText(String(text));
});
ipcMain.on("clipboard-read", (event) => {
    event.returnValue = clipboard.readText();
});
ipcMain.on("set-badge-count", (event, count) => {
    app.setBadgeCount(Number(count) || 0);
});

// App Lifecycle
app.whenReady().then(() => {
    createUpdaterWindow();

    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        } else if (updaterWindow) {
            updaterWindow.show();
            updaterWindow.focus();
        }
    });
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createUpdaterWindow();
    }
});

app.on("before-quit", () => {
    isQuitting = true;
    updaterService?.dispose();
});
