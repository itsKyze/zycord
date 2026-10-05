const { contextBridge, ipcRenderer } = require("electron");

const ZycordNative = {
    isElectron: true,
    window: {
        minimize: () => ipcRenderer.send("window-minimize"),
        maximize: () => ipcRenderer.send("window-maximize"),
        close: () => ipcRenderer.send("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        setAlwaysOnTop: (enabled) => ipcRenderer.send("window-set-always-on-top", enabled),
    },
};

try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
}

// Inject Discord Authentic Top Bar with Navigation & Window Controls
window.addEventListener("DOMContentLoaded", () => {
    try {
        if (!document.body || !document.head) return;
        if (document.getElementById("zycord-titlebar")) return;

        const titlebar = document.createElement("div");
        titlebar.id = "zycord-titlebar";
        titlebar.innerHTML = `
            <div class="zycord-nav-controls">
                <button class="zycord-nav-btn" id="zycord-btn-back" title="Back">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="zycord-nav-btn" id="zycord-btn-forward" title="Forward">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div class="zycord-drag-area"></div>
            <div class="zycord-win-controls">
                <div class="zycord-win-btn" id="zycord-btn-min" title="Minimize">
                    <svg width="10" height="10" viewBox="0 0 10 10"><rect fill="currentColor" width="10" height="1" x="0" y="5"></rect></svg>
                </div>
                <div class="zycord-win-btn" id="zycord-btn-max" title="Maximize">
                    <svg width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1"></rect></svg>
                </div>
                <div class="zycord-win-btn close" id="zycord-btn-close" title="Close">
                    <svg width="10" height="10" viewBox="0 0 10 10"><polygon fill="currentColor" fill-rule="evenodd" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon></svg>
                </div>
            </div>
        `;

        const style = document.createElement("style");
        style.textContent = `
            #zycord-titlebar {
                height: 22px;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 999999;
                user-select: none;
                -webkit-user-select: none;
                -webkit-app-region: drag;
            }
            .zycord-nav-controls {
                display: flex;
                align-items: center;
                gap: 2px;
                padding-left: 8px;
                height: 100%;
                -webkit-app-region: no-drag;
            }
            .zycord-nav-btn {
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                color: #80848e;
                cursor: pointer;
                border-radius: 3px;
                padding: 0;
                transition: color 0.15s ease, background 0.15s ease;
            }
            .zycord-nav-btn:hover {
                color: #dbdee1;
                background: rgba(255, 255, 255, 0.08);
            }
            .zycord-drag-area {
                flex: 1;
                height: 100%;
                -webkit-app-region: drag;
            }
            .zycord-win-controls {
                display: flex;
                height: 100%;
                -webkit-app-region: no-drag;
            }
            .zycord-win-btn {
                width: 28px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                color: #949ba4;
                cursor: pointer;
                transition: background 0.12s ease, color 0.12s ease;
            }
            .zycord-win-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            .zycord-win-btn.close:hover {
                background: #f23f43 !important;
                color: #ffffff !important;
            }
            #app-mount {
                padding-top: 22px !important;
                box-sizing: border-box !important;
            }
            /* Center Zycord logo above login form */
            .discordLogo__921c5,
            .authBoxExpanded__921c5 .discordLogo__921c5 {
                background: url("/branding/meowcord.svg") no-repeat center !important;
                background-size: contain !important;
                width: 72px !important;
                height: 72px !important;
                margin: 0 auto 16px auto !important;
                display: block !important;
            }
        `;

        document.head.appendChild(style);
        document.body.prepend(titlebar);

        document.getElementById("zycord-btn-back")?.addEventListener("click", () => window.history.back());
        document.getElementById("zycord-btn-forward")?.addEventListener("click", () => window.history.forward());
        document.getElementById("zycord-btn-min")?.addEventListener("click", () => ipcRenderer.send("window-minimize"));
        document.getElementById("zycord-btn-max")?.addEventListener("click", () => ipcRenderer.send("window-maximize"));
        document.getElementById("zycord-btn-close")?.addEventListener("click", () => ipcRenderer.send("window-close"));
    } catch (err) {
        console.warn("[Zycord] Titlebar injection skipped:", err);
    }
});
