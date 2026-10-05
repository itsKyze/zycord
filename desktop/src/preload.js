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
            :root { --zy-bar-h: 22px; }
            #zycord-titlebar {
                height: var(--zy-bar-h);
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
                pointer-events: none;
            }
            .zycord-nav-controls {
                display: flex;
                align-items: center;
                gap: 2px;
                padding-left: 8px;
                height: 100%;
                pointer-events: auto;
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
                pointer-events: auto;
                -webkit-app-region: drag;
            }
            .zycord-win-controls {
                display: flex;
                height: 100%;
                pointer-events: auto;
                -webkit-app-region: no-drag;
            }
            .zycord-win-btn {
                width: 28px;
                height: 100%;
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

            /* No Discord top bar (login, splash): standalone 22px bar */
            html:not(.zy-has-bar) #app-mount {
                padding-top: 22px !important;
                box-sizing: border-box !important;
            }

            /* Discord's own top bar present: merge into a single row */
            html.zy-has-bar .zycord-drag-area {
                pointer-events: none;
                -webkit-app-region: no-drag;
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

        // Detect Discord's own top bar (title + Inbox/Help) and merge with it
        const root = document.documentElement;
        const barStyle = document.createElement("style");
        barStyle.id = "zycord-native-bar-style";
        document.head.appendChild(barStyle);
        let currentBarClass = null;
        const syncNativeBar = () => {
            let bar = null;
            for (const el of document.querySelectorAll('[class^="bar_"], [class*=" bar_"]')) {
                if (el.closest("#zycord-titlebar")) continue;
                const r = el.getBoundingClientRect();
                if (r.top <= 24 && r.height >= 16 && r.height <= 60 && r.width >= window.innerWidth * 0.6) {
                    bar = el;
                    break;
                }
            }
            const barClass = bar ? [...bar.classList].find((c) => c.startsWith("bar_")) : null;
            if (barClass !== currentBarClass) {
                currentBarClass = barClass;
                const s = barClass ? `html.zy-has-bar .${CSS.escape(barClass)}` : null;
                barStyle.textContent = s ? `
                    ${s} {
                        -webkit-app-region: drag;
                        padding-left: 56px !important;
                        padding-right: 92px !important;
                        box-sizing: border-box !important;
                    }
                    ${s} button, ${s} a, ${s} input, ${s} [role="button"], ${s} [tabindex] {
                        -webkit-app-region: no-drag;
                    }
                ` : "";
            }
            if (bar) {
                root.classList.add("zy-has-bar");
                root.style.setProperty("--zy-bar-h", `${Math.round(bar.getBoundingClientRect().height)}px`);
            } else {
                root.classList.remove("zy-has-bar");
                root.style.setProperty("--zy-bar-h", "22px");
            }
        };
        let pending = false;
        new MutationObserver(() => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => { pending = false; syncNativeBar(); });
        }).observe(document.body, { childList: true, subtree: true });
        window.addEventListener("resize", syncNativeBar);
        syncNativeBar();
    } catch (err) {
        console.warn("[Zycord] Titlebar injection skipped:", err);
    }
});
