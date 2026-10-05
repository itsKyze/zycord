const { app, BrowserWindow, Tray, Menu, ipcMain, shell, session, desktopCapturer, clipboard } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
}

// Global References
let splashWindow = null;
let mainWindow = null;
let tray = null;
let isQuitting = false;

const APP_URL = "https://app.zyron.site/app";
const ICON_PATH = path.join(__dirname, "../assets/icon.ico");
const DISCORD_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9168 Chrome/128.0.6613.186 Electron/32.2.0 Safari/537.36";

// Configure Auto-Updater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Create Discord Splash Screen Window
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 320,
        height: 380,
        resizable: false,
        frame: false,
        transparent: false,
        backgroundColor: "#2b2d31",
        center: true,
        show: false,
        alwaysOnTop: true,
        icon: ICON_PATH,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    splashWindow.loadFile(path.join(__dirname, "splash/splash.html"));

    splashWindow.once("ready-to-show", () => {
        splashWindow.show();
        splashWindow.webContents.send("version", app.getVersion());

        // Check for updates
        checkForUpdates();
    });

    splashWindow.on("closed", () => {
        splashWindow = null;
    });
}

// Auto-Updater lifecycle
function checkForUpdates() {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates().catch((err) => {
            console.warn("[Updater] Check failed:", err.message);
            proceedToMainWindow("Starting Zycord...");
        });
    } else {
        // Dev mode simulation
        setTimeout(() => proceedToMainWindow("Starting Zycord..."), 1500);
    }
}

autoUpdater.on("checking-for-update", () => {
    splashWindow?.webContents.send("status", { message: "Checking for updates...", determinate: false });
});

autoUpdater.on("update-available", (info) => {
    splashWindow?.webContents.send("status", { message: "Downloading update 1 of 1...", percent: 0, determinate: true });
});

autoUpdater.on("download-progress", (progress) => {
    splashWindow?.webContents.send("status", {
        message: `Downloading update 1 of 1 (${Math.round(progress.percent)}%)...`,
        percent: progress.percent,
        determinate: true,
    });
});

autoUpdater.on("update-downloaded", () => {
    splashWindow?.webContents.send("status", { message: "Installing update...", percent: 100, determinate: true });
    setTimeout(() => {
        autoUpdater.quitAndInstall(false, true);
    }, 1200);
});

autoUpdater.on("update-not-available", () => {
    proceedToMainWindow("Starting Zycord...");
});

autoUpdater.on("error", () => {
    proceedToMainWindow("Starting Zycord...");
});

function proceedToMainWindow(statusMessage) {
    splashWindow?.webContents.send("status", { message: statusMessage, determinate: false });
    setTimeout(() => {
        createMainWindow();
    }, 800);
}

// Create Main Discord Window
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

    // Set Discord User Agent
    mainWindow.webContents.setUserAgent(DISCORD_USER_AGENT);

    // Load Zycord Web Client
    mainWindow.loadURL(APP_URL);

    // When ready, swap splash with main window
    mainWindow.once("ready-to-show", () => {
        if (splashWindow) {
            splashWindow.close();
        }
        mainWindow.show();
        mainWindow.focus();
    });

    // Prevent external window popups; open in system default browser
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
                autoUpdater.checkForUpdatesAndNotify().catch(() => {});
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
    createSplashWindow();

    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createSplashWindow();
    }
});

app.on("before-quit", () => {
    isQuitting = true;
});
