/**
 * Zycord Desktop Preload Script
 * High Performance WebMediaEngine & Clean Frameless Integration
 */
const { contextBridge, ipcRenderer, webFrame } = require("electron");

// 1. Prevent any attempt to use ETF or Zstd WebSockets (ensures standard JSON gateway)
if (typeof window !== "undefined") {
    const OrigWebSocket = window.WebSocket;
    if (OrigWebSocket) {
        const PatchedWebSocket = function (url, protocols) {
            if (typeof url === "string") {
                url = url.replace("encoding=etf", "encoding=json")
                         .replace("compress=zstd-stream", "compress=zlib-stream");
            }
            return new OrigWebSocket(url, protocols);
        };
        PatchedWebSocket.prototype = OrigWebSocket.prototype;
        Object.assign(PatchedWebSocket, OrigWebSocket);
        window.WebSocket = PatchedWebSocket;
    }
}

// 2. Hide nag banner / desktop download banner
try {
    localStorage.setItem("hideNag", "true");
} catch (_) {}

// 3. Vesktop & Zycord Native bridge
// Note: We deliberately do NOT expose window.DiscordNative.
// Without DiscordNative, Discord uses standard Chromium WebRTC (WebMediaEngine),
// which connects directly to the Pion SFU gateway without crashing, without corrupt banners,
// and without fake [SafeNativeProxy] formatting artifacts.
const VesktopNative = {
    app: {
        getVersion: () => "1.0.17",
        relaunch: () => ipcRenderer.invoke("window-relaunch"),
        setBadgeCount: () => {},
        supportsWindowsTransparency: () => false,
        getEnableHardwareAcceleration: () => true,
        isOutdated: () => Promise.resolve(false),
    },
    win: {
        focus: () => ipcRenderer.invoke("window-focus"),
        close: () => ipcRenderer.invoke("window-close"),
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        flashFrame: () => {},
    },
    settings: {
        get: () => ({}),
        set: () => Promise.resolve(),
    },
    zoom: {
        set: (factor) => {
            if (typeof factor === "number" && !isNaN(factor)) {
                webFrame.setZoomFactor(factor);
                try { localStorage.setItem("zycord-zoom-factor", String(factor)); } catch (_) {}
            }
        },
        get: () => webFrame.getZoomFactor(),
    }
};

try {
    contextBridge.exposeInMainWorld("VesktopNative", VesktopNative);
    contextBridge.exposeInMainWorld("ZycordNative", VesktopNative);
} catch (_) {
    window.VesktopNative = VesktopNative;
    window.ZycordNative = VesktopNative;
}

// 4. Restore saved zoom factor on startup
try {
    const savedZoom = localStorage.getItem("zycord-zoom-factor");
    if (savedZoom) {
        const factor = parseFloat(savedZoom);
        if (!isNaN(factor) && factor >= 0.5 && factor <= 2.5) {
            webFrame.setZoomFactor(factor);
        }
    }
} catch (_) {}

// 5. Global Zoom shortcuts & Ctrl+MouseWheel
window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    if (e.key === "=" || e.key === "+" || e.code === "NumpadAdd") {
        e.preventDefault();
        const current = webFrame.getZoomFactor();
        const next = Math.min(2.5, Math.round((current + 0.1) * 10) / 10);
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
    } else if (e.key === "-" || e.key === "_" || e.code === "NumpadSubtract") {
        e.preventDefault();
        const current = webFrame.getZoomFactor();
        const next = Math.max(0.5, Math.round((current - 0.1) * 10) / 10);
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
    } else if (e.key === "0" || e.code === "Numpad0") {
        e.preventDefault();
        webFrame.setZoomFactor(1.0);
        try { localStorage.setItem("zycord-zoom-factor", "1.0"); } catch (_) {}
    }
}, { capture: true });

window.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        const current = webFrame.getZoomFactor();
        const next = Math.max(0.5, Math.min(2.5, Math.round((current + delta) * 100) / 100));
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
    }
}, { passive: false });

// 6. Native Discord-style Window Controls & Drag Zone
function injectWindowControls() {
    if (document.getElementById("zycord-window-controls")) return;

    // Draggable top strip
    const dragStrip = document.createElement("div");
    dragStrip.id = "zycord-top-drag-strip";
    document.body.appendChild(dragStrip);

    // Controls container
    const controls = document.createElement("div");
    controls.id = "zycord-window-controls";
    controls.innerHTML = `
        <button id="zycord-btn-min" class="zycord-btn" title="Minimize" aria-label="Minimize">
            <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg>
        </button>
        <button id="zycord-btn-max" class="zycord-btn" title="Maximize" aria-label="Maximize">
            <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="none" stroke="currentColor" width="9" height="9" x="1.5" y="1.5"></rect></svg>
        </button>
        <button id="zycord-btn-close" class="zycord-btn zycord-btn-close" title="Close" aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 6.583 6.007 11 10.424 10.424 11 5.993 6.583 1.576 11 1 10.424 5.417 6.007 1 1.576 1.576 1 5.993 5.417 10.424 1"></polygon></svg>
        </button>
    `;
    document.body.appendChild(controls);

    document.getElementById("zycord-btn-min")?.addEventListener("click", () => {
        ipcRenderer.invoke("window-minimize");
    });
    document.getElementById("zycord-btn-max")?.addEventListener("click", () => {
        ipcRenderer.invoke("window-maximize");
    });
    document.getElementById("zycord-btn-close")?.addEventListener("click", () => {
        ipcRenderer.invoke("window-close");
    });
}

// 7. Inject Styles for UI & Window Controls
function applyStyles() {
    if (document.getElementById("zycord-custom-styles")) return;

    const style = document.createElement("style");
    style.id = "zycord-custom-styles";
    style.textContent = `
        /* Draggable edge */
        #zycord-top-drag-strip {
            position: fixed;
            top: 0;
            left: 0;
            right: 110px;
            height: 6px;
            z-index: 9999998;
            -webkit-app-region: drag;
            background: transparent;
        }

        /* Window controls */
        #zycord-window-controls {
            position: fixed;
            top: 0;
            right: 0;
            height: 28px;
            z-index: 9999999;
            display: flex;
            align-items: center;
            background: transparent;
            -webkit-app-region: no-drag;
        }

        .zycord-btn {
            width: 34px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #b5bac1;
            cursor: pointer;
            padding: 0;
            margin: 0;
            outline: none;
            transition: background-color 0.12s ease, color 0.12s ease;
        }

        .zycord-btn:hover {
            background-color: rgba(255, 255, 255, 0.08);
            color: #dbdee1;
        }

        .zycord-btn:active {
            background-color: rgba(255, 255, 255, 0.14);
        }

        .zycord-btn-close:hover {
            background-color: #da373c !important;
            color: #ffffff !important;
        }

        .zycord-btn-close:active {
            background-color: #a1282c !important;
        }

        /* Discord style dark transparent scrollbars */
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background-color: transparent !important;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent !important;
            border: none !important;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(26, 27, 30, 0.8) !important;
            border-radius: 4px !important;
            border: 2px solid transparent !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(17, 18, 20, 1) !important;
        }
        ::-webkit-scrollbar-corner {
            background-color: transparent !important;
        }

        /* Full canvas Discord window */
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background-color: #1e1f22 !important;
            border: none !important;
            outline: none !important;
            overflow: hidden !important;
        }

        #app-mount {
            width: 100vw !important;
            height: 100vh !important;
        }
    `;

    document.head.appendChild(style);
}

function initDom() {
    applyStyles();
    injectWindowControls();
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initDom);
} else {
    initDom();
}
