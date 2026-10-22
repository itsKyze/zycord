/**
 * Zycord Desktop Preload Script
 * Full DiscordNative & ZycordNative bridge with 1:1 Discord Custom Titlebar
 */
const { contextBridge, ipcRenderer } = require("electron");
const { IPCEvents } = require("./core/modules/ipc_events");

const ZycordNative = {
    isElectron: true,
    platform: process.platform,
    appName: "Zycord",
    domain: "app.zyron.site",

    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.13",
        getBuildNumber: () => 13,
        getModuleVersions: () => ({}),
        getPath: () => "",
        relaunch: () => ipcRenderer.invoke("window-relaunch"),
        dock: {
            setBadge: () => {},
            bounce: () => {},
            cancelBounce: () => {},
        },
    },

    window: {
        USE_SYSTEM_TITLE_BAR: false,
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        close: () => ipcRenderer.invoke("window-close"),
        restore: () => ipcRenderer.invoke("window-maximize"),
        focus: () => ipcRenderer.invoke("window-focus"),
        blur: () => ipcRenderer.invoke("window-blur"),
        setAlwaysOnTop: (enabled) => ipcRenderer.invoke("window-set-always-on-top", enabled),
        isAlwaysOnTop: () => false,
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        flashFrame: (flag) => ipcRenderer.invoke("window-flash-frame", flag),
        setProgressBar: (progress) => ipcRenderer.invoke("window-set-progress-bar", progress),
        setDevtoolsCallbacks: () => {},
    },

    processUtils: {
        getCPUUsage: () => 0,
        getMemoryInformation: () => ({}),
        getSystemInfo: () => ({}),
        getMainArgvSync: () => [],
    },

    features: {
        supports: () => true,
        declareSupported: () => {},
    },

    settings: {
        get: (k, d) => d,
        set: () => {},
        getSync: (k, d) => d,
    },

    safeStorage: {
        isEncryptionAvailable: () => true,
        encryptString: (plainText) => plainText,
        decryptString: (encrypted) => encrypted,
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
    },
};

// Expose safe APIs
try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
    contextBridge.exposeInMainWorld("DiscordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
    window.DiscordNative = ZycordNative;
}

// 1:1 Discord Titlebar Injection (Image 2 parity)
function injectDiscordTitlebar() {
    if (document.getElementById("zycord-desktop-titlebar")) return;

    const titlebar = document.createElement("div");
    titlebar.id = "zycord-desktop-titlebar";
    titlebar.innerHTML = `
        <div class="zy-titlebar-left">
            <button id="zy-nav-back" class="zy-nav-btn" title="Back">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button id="zy-nav-forward" class="zy-nav-btn" title="Forward">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
        <div class="zy-titlebar-center" id="zy-titlebar-title">Zycord</div>
        <div class="zy-titlebar-right">
            <button id="zy-win-min" class="zy-win-btn" title="Minimize">
                <svg width="11" height="11" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1.2" x="1" y="6"></rect></svg>
            </button>
            <button id="zy-win-max" class="zy-win-btn" title="Maximize">
                <svg width="11" height="11" viewBox="0 0 12 12"><rect width="8.5" height="8.5" x="1.75" y="1.75" fill="none" stroke="currentColor" stroke-width="1.2"></rect></svg>
            </button>
            <button id="zy-win-close" class="zy-win-btn zy-win-close" title="Close">
                <svg width="11" height="11" viewBox="0 0 12 12"><polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 9.424 0 5.5 3.924 1.576 0 0 1.576 3.924 5.5 0 9.424 1.576 11 5.5 7.076 9.424 11 11 9.424 7.076 5.5"></polygon></svg>
            </button>
        </div>
    `;

    const style = document.createElement("style");
    style.id = "zycord-titlebar-style";
    style.textContent = `
        #zycord-desktop-titlebar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 28px;
            background-color: #1e1f22;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 2147483647;
            user-select: none;
            -webkit-user-select: none;
            -webkit-app-region: drag;
            font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        }
        .zy-titlebar-left {
            display: flex;
            align-items: center;
            padding-left: 8px;
            gap: 2px;
            -webkit-app-region: no-drag;
        }
        .zy-nav-btn {
            background: transparent;
            border: none;
            color: #949ba4;
            width: 24px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
            padding: 0;
            transition: background 0.15s ease, color 0.15s ease;
        }
        .zy-nav-btn:hover {
            color: #dbdee1;
            background: rgba(255, 255, 255, 0.08);
        }
        .zy-titlebar-center {
            font-size: 12px;
            font-weight: 600;
            color: #949ba4;
            pointer-events: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 12px;
            letter-spacing: 0.2px;
        }
        .zy-titlebar-right {
            display: flex;
            align-items: center;
            height: 100%;
            -webkit-app-region: no-drag;
        }
        .zy-win-btn {
            background: transparent;
            border: none;
            color: #949ba4;
            width: 36px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: background 0.1s ease, color 0.1s ease;
        }
        .zy-win-btn:hover {
            background: #35373c;
            color: #f2f3f5;
        }
        .zy-win-btn.zy-win-close:hover {
            background: #f23f43 !important;
            color: #ffffff !important;
        }
        html, body {
            padding-top: 28px !important;
            box-sizing: border-box !important;
        }
    `;

    document.head.appendChild(style);
    document.body.prepend(titlebar);

    document.getElementById("zy-nav-back").addEventListener("click", () => window.history.back());
    document.getElementById("zy-nav-forward").addEventListener("click", () => window.history.forward());
    document.getElementById("zy-win-min").addEventListener("click", () => ipcRenderer.invoke("window-minimize"));
    document.getElementById("zy-win-max").addEventListener("click", () => ipcRenderer.invoke("window-maximize"));
    document.getElementById("zy-win-close").addEventListener("click", () => ipcRenderer.invoke("window-close"));

    const updateTitle = () => {
        const titleEl = document.getElementById("zy-titlebar-title");
        if (titleEl && document.title) {
            titleEl.textContent = document.title;
        }
    };
    updateTitle();
    setInterval(updateTitle, 1000);
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", injectDiscordTitlebar);
} else {
    injectDiscordTitlebar();
}
