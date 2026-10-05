const { contextBridge, ipcRenderer } = require("electron");

// Expose DiscordNative APIs to renderer process
const DiscordNative = {
    isElectron: true,
    process: {
        platform: "win32",
        arch: process.arch || "x64",
        env: {},
    },
    os: {
        arch: process.arch || "x64",
        release: "10.0.22631",
    },
    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.9168",
        getBuildNumber: () => 109168,
        getModuleVersions: () => ({}),
        getPath: (name) => "",
        relaunch: () => ipcRenderer.send("app-relaunch"),
    },
    window: {
        minimize: () => ipcRenderer.send("window-minimize"),
        maximize: () => ipcRenderer.send("window-maximize"),
        close: () => ipcRenderer.send("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        setAlwaysOnTop: (enabled) => ipcRenderer.send("window-set-always-on-top", enabled),
        setDevtoolsCallbacks: () => {},
        setBackgroundThrottling: () => {},
    },
    clipboard: {
        copy: (text) => ipcRenderer.send("clipboard-copy", text),
        read: () => ipcRenderer.sendSync("clipboard-read"),
        copyImage: () => {},
    },
    ipc: {
        send: (event, ...args) => ipcRenderer.send(event, ...args),
        on: (event, listener) => ipcRenderer.on(event, listener),
    },
    notifications: {
        setBadgeCount: (count) => ipcRenderer.send("set-badge-count", count),
    },
    powerSaveBlocker: {
        blockDisplaySleep: () => 0,
        unblockDisplaySleep: () => {},
    },
    spellCheck: {
        getAvailableDictionaries: () => Promise.resolve([]),
    },
    settings: {
        get: (k, def) => def,
        set: () => {},
    },
    crashReporter: {
        updateCrashReporter: () => {},
    },
};

// Safe bridge
try {
    contextBridge.exposeInMainWorld("DiscordNative", DiscordNative);
    contextBridge.exposeInMainWorld("ZycordNative", DiscordNative);
} catch (e) {
    window.DiscordNative = DiscordNative;
    window.ZycordNative = DiscordNative;
}

// Inject Discord Frameless Window Controls and Drag Bar
window.addEventListener("DOMContentLoaded", () => {
    try {
        if (!document.body || !document.head) return;
        if (document.getElementById("zycord-titlebar")) return;

    const titlebar = document.createElement("div");
    titlebar.id = "zycord-titlebar";
    titlebar.innerHTML = `
        <div class="zycord-titlebar-drag">
            <span class="zycord-titlebar-title">Zycord</span>
        </div>
        <div class="zycord-titlebar-controls">
            <button class="zycord-titlebar-btn" id="zycord-btn-min" title="Minimize">
                <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg>
            </button>
            <button class="zycord-titlebar-btn" id="zycord-btn-max" title="Maximize">
                <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="none" stroke="currentColor" width="9" height="9" x="1.5" y="1.5"></rect></svg>
            </button>
            <button class="zycord-titlebar-btn close" id="zycord-btn-close" title="Close">
                <svg width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 6.576 6 11 10.424 10.424 11 6 6.576 1.576 11 1 10.424 5.424 6 1 1.576 1.576 1 6 5.424 10.424 1"></polygon></svg>
            </button>
        </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
        #zycord-titlebar {
            height: 28px;
            background: #1e1f22;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #949ba4;
            font-size: 12px;
            font-weight: 600;
            font-family: "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            user-select: none;
            -webkit-user-select: none;
        }
        .zycord-titlebar-drag {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            padding-left: 12px;
            -webkit-app-region: drag;
        }
        .zycord-titlebar-title {
            opacity: 0.8;
            letter-spacing: 0.02em;
        }
        .zycord-titlebar-controls {
            display: flex;
            height: 100%;
            -webkit-app-region: no-drag;
        }
        .zycord-titlebar-btn {
            width: 38px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #949ba4;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .zycord-titlebar-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #dbdee1;
        }
        .zycord-titlebar-btn.close:hover {
            background: #da373c;
            color: #ffffff;
        }
        /* Offset main content slightly for titlebar */
        #app-mount {
            margin-top: 28px !important;
            height: calc(100vh - 28px) !important;
        }
    `;

    document.head.appendChild(style);
    document.body.prepend(titlebar);

    document.getElementById("zycord-btn-min")?.addEventListener("click", () => DiscordNative.window.minimize());
    document.getElementById("zycord-btn-max")?.addEventListener("click", () => DiscordNative.window.maximize());
    document.getElementById("zycord-btn-close")?.addEventListener("click", () => DiscordNative.window.close());
    } catch (err) {
        console.warn("[Zycord] Titlebar injection skipped:", err);
    }
});
