const { app, BrowserWindow, Tray, Menu, ipcMain, shell, session, desktopCapturer, clipboard, nativeImage } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");
const UpdaterService = require("./updater/UpdaterService");
const UpdaterConfig = require("./updater/UpdaterConfig");

// Configure background updater: download silently, notify via badge, user decides when to install
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = false; // Don't silently quit+install; user triggers via green badge
autoUpdater.logger = null; // Suppress verbose updater logs

app.name = "Zycord";
if (process.platform === "win32") {
    app.setAppUserModelId("com.zyron.zycord");
}

// Thumbar and Tray Mascot Icons
const thumbarIcons = {
    cameraOn: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/camera_on.png")),
    cameraOff: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/camera_off.png")),
    mic: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/mic.png")),
    micMuted: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/mic_muted.png")),
    headset: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/headset.png")),
    deafen: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/deafen.png")),
    disconnect: nativeImage.createFromPath(path.join(__dirname, "../assets/thumbar/disconnect.png")),
};
const trayMascotIcon = nativeImage.createFromPath(path.join(__dirname, "../assets/tray_mascot.png"));

let clientState = {
    inVoice: false,
    isMuted: false,
    isDeafened: false,
    isVideoOn: false,
    unreadBadge: "",
};

// Single Instance Lock
// Optimize touch and pointer event handling for Windows touchscreens & 2-in-1s
app.commandLine.appendSwitch("touch-events", "enabled");
app.commandLine.appendSwitch("enable-touch-drag-drop");

// Clean up stale lockfile before requesting lock (handles crashes / dev sessions that didn't exit cleanly)
try {
    const lockFilePath = path.join(app.getPath("userData"), "lockfile");
    if (fs.existsSync(lockFilePath)) {
        // Check if any Zycord/electron process other than us is running
        const { execSync } = require("child_process");
        let zycordRunning = false;
        try {
            if (process.platform === "win32") {
                const taskList = execSync("tasklist /FI \"IMAGENAME eq Zycord.exe\" /NH", { encoding: "utf8", timeout: 2000 });
                zycordRunning = taskList.toLowerCase().includes("zycord.exe");
            }
        } catch (_) {}

        if (!zycordRunning) {
            fs.unlinkSync(lockFilePath);
            console.log("[Zycord] Removed stale lockfile");
        }
    }
} catch (e) {
    console.warn("[Zycord] Lockfile cleanup error:", e.message);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    // Another real instance is running — bring it to front
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
const ZYCORD_USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Zycord/${app.getVersion()}`;

// Create Minimal Centered Desktop Updater Window (360x300)
function createUpdaterWindow() {
    if (updaterWindow && !updaterWindow.isDestroyed()) {
        updaterWindow.focus();
        return;
    }

    updaterWindow = new BrowserWindow({
        title: "Zycord",
        width: UpdaterConfig.window?.width || 360,
        height: UpdaterConfig.window?.height || 300,
        resizable: false,
        frame: false,
        backgroundColor: UpdaterConfig.window?.backgroundColor || "#282b30",
        center: true,
        show: true,
        alwaysOnTop: false,
        icon: ICON_PATH,
        webPreferences: {
            preload: path.join(__dirname, "updater/preload-updater.js"),
            contextIsolation: true,
            nodeIntegration: false,
            backgroundThrottling: false,
        },
    });

    updaterWindow.loadFile(path.join(__dirname, "updater/updater.html"));

    if (!updaterService) {
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
    }

    updaterWindow.webContents.once("did-finish-load", () => {
        updaterService.start();
    });

    updaterWindow.on("closed", () => {
        updaterWindow = null;
    });
}

function launchMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (!mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus();
        }
        if (updaterWindow && !updaterWindow.isDestroyed()) {
            updaterWindow.destroy();
            updaterWindow = null;
        }
        return;
    }

    createMainWindow();
}

// Create Main Application Window
function createMainWindow() {
    if (mainWindow) return;

    mainWindow = new BrowserWindow({
        title: "Zycord",
        width: 1280,
        height: 720,
        minWidth: 940,
        minHeight: 500,
        frame: false,
        thickFrame: true,
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

    mainWindow.webContents.setUserAgent(ZYCORD_USER_AGENT);
    mainWindow.loadURL(APP_URL);

    let hasShown = false;
    const showMainWindowSafely = () => {
        if (hasShown) return;
        hasShown = true;
        if (!mainWindow || mainWindow.isDestroyed()) return;

        mainWindow.show();
        mainWindow.focus();
        updateThumbarButtons();

        // Safely destroy updater window now that main window is visible
        if (updaterWindow && !updaterWindow.isDestroyed()) {
            updaterWindow.destroy();
            updaterWindow = null;
        }

        // Start periodic background desktop update checks
        setTimeout(() => {
            if (app.isPackaged) {
                autoUpdater.checkForUpdates().catch(() => {});
            }
        }, 15000);

        setInterval(() => {
            if (app.isPackaged) {
                autoUpdater.checkForUpdates().catch(() => {});
            }
        }, 20 * 60 * 1000);
    };

    mainWindow.once("ready-to-show", () => {
        showMainWindowSafely();
    });

    mainWindow.webContents.once("did-finish-load", () => {
        showMainWindowSafely();
    });

    // Safety fallback: ensure window shows within 6.5s even on slow network
    setTimeout(showMainWindowSafely, 6500);

    mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
        console.log(`[Renderer Console ${level}] ${message} (${sourceId}:${line})`);
    });

    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
        console.warn("[Zycord] Page load failed:", errorCode, errorDescription, validatedURL);
        showMainWindowSafely();
    });

    // Keyboard shortcuts for convenience (Ctrl+R to reload, Ctrl+Shift+I for DevTools)
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.control && input.key.toLowerCase() === "r") {
            mainWindow.reload();
        }
        if (input.control && input.shift && input.key.toLowerCase() === "i") {
            mainWindow.webContents.toggleDevTools();
        }
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

    mainWindow.on("maximize", () => {
        mainWindow?.webContents.send("window-maximized-state", true);
    });

    mainWindow.on("unmaximize", () => {
        mainWindow?.webContents.send("window-maximized-state", false);
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    createTray();
    setupScreenShareHandler();
}

// System Tray & Thumbnail Toolbar
function updateTrayMenu() {
    if (!tray) return;

    try {
        const inVoice = Boolean(clientState.inVoice);
        const menuTemplate = [
            {
                label: "Zycord",
                icon: trayMascotIcon,
                click: () => {
                    mainWindow?.show();
                    mainWindow?.focus();
                },
            },
            { type: "separator" },
        ];

        // Mute & Deafen only appear when the user is in a voice room
        if (inVoice) {
            menuTemplate.push(
                {
                    label: "Mute",
                    type: "checkbox",
                    checked: Boolean(clientState.isMuted),
                    click: () => {
                        mainWindow?.webContents.send("action-toggle-mute");
                    },
                },
                {
                    label: "Deafen",
                    type: "checkbox",
                    checked: Boolean(clientState.isDeafened),
                    click: () => {
                        mainWindow?.webContents.send("action-toggle-deafen");
                    },
                },
                { type: "separator" }
            );
        }

        menuTemplate.push(
            {
                label: "Check for Updates…",
                click: () => {
                    updaterService?.checkForUpdates();
                },
            },
            {
                label: "Acknowledgements",
                click: () => {
                    shell.openExternal("https://app.zyron.site/legal.html");
                },
            },
            { type: "separator" },
            {
                label: "Quit Zycord",
                click: () => {
                    isQuitting = true;
                    app.quit();
                },
            }
        );

        const contextMenu = Menu.buildFromTemplate(menuTemplate);
        tray.setContextMenu(contextMenu);
    } catch (e) {
        console.warn("[Zycord] Tray context menu error:", e);
    }
}

function updateThumbarButtons() {
    if (!mainWindow || mainWindow.isDestroyed() || process.platform !== "win32") return;

    try {
        const inVoice = Boolean(clientState.inVoice);

        // Only show thumbnail toolbar buttons when connected to a voice room
        if (!inVoice) {
            mainWindow.setThumbarButtons([]);
            return;
        }

        const isMuted = Boolean(clientState.isMuted);
        const isDeafened = Boolean(clientState.isDeafened);
        const isVideoOn = Boolean(clientState.isVideoOn);

        const buttons = [
            {
                tooltip: isVideoOn ? "Turn Off Camera" : "Turn On Camera",
                icon: isVideoOn ? thumbarIcons.cameraOn : thumbarIcons.cameraOff,
                flags: [],
                click: () => {
                    mainWindow?.webContents.send("action-toggle-video");
                },
            },
            {
                tooltip: isMuted ? "Unmute" : "Mute",
                icon: isMuted ? thumbarIcons.micMuted : thumbarIcons.mic,
                flags: [],
                click: () => {
                    mainWindow?.webContents.send("action-toggle-mute");
                },
            },
            {
                tooltip: isDeafened ? "Undeafen" : "Deafen",
                icon: isDeafened ? thumbarIcons.deafen : thumbarIcons.headset,
                flags: [],
                click: () => {
                    mainWindow?.webContents.send("action-toggle-deafen");
                },
            },
            {
                tooltip: "Disconnect",
                icon: thumbarIcons.disconnect,
                flags: [],
                click: () => {
                    mainWindow?.webContents.send("action-toggle-disconnect");
                },
            },
        ];

        mainWindow.setThumbarButtons(buttons);
    } catch (err) {
        console.warn("[Zycord] Thumbar update error:", err);
    }
}

function createTray() {
    if (tray) return;

    try {
        tray = new Tray(ICON_PATH);
        tray.setToolTip("Zycord");
        updateTrayMenu();

        tray.on("click", () => {
            if (mainWindow?.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow?.show();
                mainWindow?.focus();
            }
        });
    } catch (e) {
        console.warn("[Zycord] Tray icon notice:", e);
    }
}

// Handle Screen Sharing Permission & Desktop Capturer
let currentSelectedSourceId = null;

ipcMain.on("desktop-capture-set-selected-source", (event, sourceId) => {
    currentSelectedSourceId = sourceId;
});

ipcMain.handle("desktop-capture-get-sources", async (event, options) => {
    try {
        const types = options?.types || ["screen", "window"];
        const thumbnailSize = options?.thumbnailSize || { width: 447, height: 251 };
        const sources = await desktopCapturer.getSources({
            types,
            thumbnailSize,
            fetchWindowIcons: true,
        });
        return sources.map((s) => ({
            id: s.id,
            name: s.name,
            url: s.thumbnail ? s.thumbnail.toDataURL() : "",
            appIcon: s.appIcon ? s.appIcon.toDataURL() : null,
        }));
    } catch (e) {
        console.error("[Zycord] desktopCapturer.getSources error:", e);
        return [];
    }
});

function setupScreenShareHandler() {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ["screen", "window"] }).then((sources) => {
            if (sources.length === 0) return callback({});
            if (currentSelectedSourceId) {
                const matched = sources.find((s) => s.id === currentSelectedSourceId);
                if (matched) {
                    return callback({ video: matched });
                }
            }
            callback({ video: sources[0] });
        }).catch((e) => {
            console.error("[Zycord] setDisplayMediaRequestHandler error:", e);
            callback({});
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

ipcMain.on("updater:install-update", () => {
    try {
        autoUpdater.quitAndInstall(false, true);
    } catch (e) {
        console.warn("[Zycord] Install update fallback to relaunch:", e);
        app.relaunch();
        app.exit(0);
    }
});

// Forward background update events to the main window
autoUpdater.on("update-available", (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("update-available-badge", { available: true, version: info?.version });
    }
});

autoUpdater.on("update-downloaded", (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("update-available-badge", { ready: true, version: info?.version });
    }
});

// IPC Handlers for ZycordNative & Window Controls
let lastMaximizeTime = 0;
ipcMain.on("window-minimize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    win?.minimize();
});
ipcMain.on("window-maximize", (event) => {
    const now = Date.now();
    if (now - lastMaximizeTime < 350) return;
    lastMaximizeTime = now;
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (win?.isMaximized()) win.unmaximize();
    else win?.maximize();
});
ipcMain.on("window-close", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    win?.close();
});
ipcMain.on("window-is-maximized", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    event.returnValue = win ? win.isMaximized() : false;
});
ipcMain.on("open-external", (event, url) => {
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
        shell.openExternal(url);
    }
});
ipcMain.on("action-toggle-inbox", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    if (!win) return;
    win.webContents.sendInputEvent({ type: "keyDown", keyCode: "I", modifiers: ["control"] });
    win.webContents.sendInputEvent({ type: "char", keyCode: "I", modifiers: ["control"] });
    win.webContents.sendInputEvent({ type: "keyUp", keyCode: "I", modifiers: ["control"] });
});
ipcMain.on("window-set-always-on-top", (event, enabled) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    win?.setAlwaysOnTop(Boolean(enabled));
});
ipcMain.on("window-focus", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
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

// IPC Handlers for Zycord Client State (Tray & Taskbar Thumbar)
for (const ch of ["zycord-state-change", "discord-state-change"]) ipcMain.on(ch, (event, state) => {
    clientState = { ...clientState, ...state };
    updateTrayMenu();
    updateThumbarButtons();
});

ipcMain.on("set-taskbar-badge", (event, dataUrl) => {
    if (!mainWindow || mainWindow.isDestroyed() || process.platform !== "win32") return;
    try {
        if (!dataUrl) {
            mainWindow.setOverlayIcon(null, "");
        } else {
            const overlay = nativeImage.createFromDataURL(dataUrl);
            mainWindow.setOverlayIcon(overlay, "Unread notifications");
        }
    } catch (e) {
        console.warn("[Zycord] Overlay icon error:", e);
    }
});

// App Lifecycle
app.whenReady().then(() => {
    if (process.platform === "win32") {
        try {
            app.setUserTasks([
                {
                    program: process.execPath,
                    arguments: "--toggle-mute",
                    iconPath: process.execPath,
                    iconIndex: 0,
                    title: "Toggle Mute",
                    description: "Mute or unmute microphone",
                },
                {
                    program: process.execPath,
                    arguments: "--toggle-deafen",
                    iconPath: process.execPath,
                    iconIndex: 0,
                    title: "Toggle Deafen",
                    description: "Deafen or undeafen audio",
                },
            ]);
        } catch (e) {
            console.warn("[Zycord] JumpList error:", e);
        }
    }

    createUpdaterWindow();

    app.on("second-instance", (event, commandLine) => {
        if (Array.isArray(commandLine)) {
            if (commandLine.includes("--toggle-mute")) {
                mainWindow?.webContents.send("action-toggle-mute");
                return;
            }
            if (commandLine.includes("--toggle-deafen")) {
                mainWindow?.webContents.send("action-toggle-deafen");
                return;
            }
        }
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        } else if (updaterWindow && !updaterWindow.isDestroyed()) {
            if (updaterWindow.isMinimized()) updaterWindow.restore();
            updaterWindow.show();
            updaterWindow.focus();
        }
    });
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        if (mainWindow) {
            createMainWindow();
        } else {
            createUpdaterWindow();
        }
    }
});

app.on("window-all-closed", (e) => {
    if (isQuitting) {
        app.quit();
    } else {
        // Prevent default quit so transitioning between updater and main window doesn't terminate process
        e.preventDefault();
    }
});

app.on("before-quit", () => {
    isQuitting = true;
    updaterService?.dispose();
});
