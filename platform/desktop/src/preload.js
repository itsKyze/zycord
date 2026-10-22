/**
 * Zycord Desktop Preload Script
 * 1:1 Discord Titlebar Parity & safe native integration
 */
const { contextBridge, ipcRenderer } = require("electron");

const ZycordNative = {
    isElectron: true,
    platform: process.platform,
    appName: "Zycord",
    domain: "app.zyron.site",

    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.15",
        getBuildNumber: () => 15,
        relaunch: () => ipcRenderer.invoke("window-relaunch"),
    },

    window: {
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        close: () => ipcRenderer.invoke("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
    },
};

try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
}

// 1:1 Discord Top Bar (Left: ← → | Center: Drag Region | Right: - □ ✕)
function injectDiscordTitlebar() {
    if (document.getElementById("zycord-titlebar")) return;

    const bar = document.createElement("div");
    bar.id = "zycord-titlebar";
    bar.innerHTML = `
        <div class="zy-nav">
            <button id="zy-back" title="Back" class="zy-nav-btn" aria-label="Back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>
            <button id="zy-forward" title="Forward" class="zy-nav-btn" aria-label="Forward">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        </div>
        <div class="zy-drag-region"></div>
        <div class="zy-controls">
            <button id="zy-min" title="Minimize" class="zy-control-btn" aria-label="Minimize">
                <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"></rect></svg>
            </button>
            <button id="zy-max" title="Maximize" class="zy-control-btn" aria-label="Maximize">
                <svg width="10" height="10" viewBox="0 0 10 10"><rect width="8.5" height="8.5" x="0.75" y="0.75" fill="none" stroke="currentColor" stroke-width="1.1"></rect></svg>
            </button>
            <button id="zy-close" title="Close" class="zy-control-btn zy-close-btn" aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10">
                    <polygon fill="currentColor" fill-rule="evenodd" points="10 1.01 8.99 0 5 3.99 1.01 0 0 1.01 3.99 5 0 8.99 1.01 10 5 6.01 8.99 10 10 8.99 6.01 5"></polygon>
                </svg>
            </button>
        </div>
    `;

    const style = document.createElement("style");
    style.id = "zycord-titlebar-style";
    style.textContent = `
        #zycord-titlebar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 22px;
            background-color: #111214;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 2147483647;
            user-select: none;
            -webkit-user-select: none;
        }
        .zy-nav {
            display: flex;
            align-items: center;
            padding-left: 6px;
            gap: 2px;
            height: 100%;
            -webkit-app-region: no-drag;
        }
        .zy-nav-btn {
            background: transparent;
            border: none;
            color: #80848e;
            width: 22px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            cursor: pointer;
            padding: 0;
            transition: color 0.15s ease, background 0.15s ease;
        }
        .zy-nav-btn:hover {
            color: #dbdee1;
            background: rgba(255, 255, 255, 0.08);
        }
        .zy-drag-region {
            flex: 1;
            height: 100%;
            -webkit-app-region: drag;
        }
        .zy-controls {
            display: flex;
            align-items: center;
            height: 100%;
            -webkit-app-region: no-drag;
        }
        .zy-control-btn {
            background: transparent;
            border: none;
            color: #949ba4;
            width: 28px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: background 0.1s ease, color 0.1s ease;
        }
        .zy-control-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #f2f3f5;
        }
        .zy-close-btn:hover {
            background: #da373c !important;
            color: #ffffff !important;
        }
        html, body {
            padding-top: 22px !important;
            box-sizing: border-box !important;
        }
    `;

    document.head.appendChild(style);
    document.body.prepend(bar);

    document.getElementById("zy-back")?.addEventListener("click", () => window.history.back());
    document.getElementById("zy-forward")?.addEventListener("click", () => window.history.forward());
    document.getElementById("zy-min")?.addEventListener("click", () => ipcRenderer.invoke("window-minimize"));
    document.getElementById("zy-max")?.addEventListener("click", () => ipcRenderer.invoke("window-maximize"));
    document.getElementById("zy-close")?.addEventListener("click", () => ipcRenderer.invoke("window-close"));
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", injectDiscordTitlebar);
} else {
    injectDiscordTitlebar();
}
