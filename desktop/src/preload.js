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

            /* Layout mode (standalone vs merged with Discord's bar) is injected
               dynamically into #zycord-native-bar-style */
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

        document.getElementById("zycord-btn-min")?.addEventListener("click", () => ipcRenderer.send("window-minimize"));
        document.getElementById("zycord-btn-max")?.addEventListener("click", () => ipcRenderer.send("window-maximize"));
        document.getElementById("zycord-btn-close")?.addEventListener("click", () => ipcRenderer.send("window-close"));

        // Detect Discord's own top bar (title + Inbox/Help) and merge with it.
        // All state lives in our own <style>; Discord rewrites <html> class/style,
        // so relying on those caused the bar to flicker.
        const barStyle = document.createElement("style");
        barStyle.id = "zycord-native-bar-style";
        document.head.appendChild(barStyle);
        let currentBar = null;
        let currentKey = "";

        const findBar = () => {
            if (currentBar && currentBar.isConnected && !currentBar.closest("#zycord-titlebar")) {
                const r = currentBar.getBoundingClientRect();
                if (r.top <= 24 && r.height >= 16) return currentBar;
            }
            for (const el of document.querySelectorAll('[class^="bar_"], [class*=" bar_"]')) {
                if (el.closest("#zycord-titlebar")) continue;
                const r = el.getBoundingClientRect();
                if (r.top <= 24 && r.height >= 16 && r.height <= 60 && r.width >= window.innerWidth * 0.6) return el;
            }
            return null;
        };

        const syncNativeBar = () => {
            const bar = findBar();
            currentBar = bar;
            let key;
            let css;
            if (bar) {
                const barClass = [...bar.classList].find((c) => c.startsWith("bar_"));
                const h = Math.round(bar.getBoundingClientRect().height);
                key = `bar|${barClass}|${h}`;
                const s = `.${CSS.escape(barClass)}`;
                css = `
                    #zycord-titlebar { height: ${h}px !important; }
                    .zycord-drag-area { pointer-events: none !important; -webkit-app-region: no-drag !important; }
                    ${s} {
                        -webkit-app-region: drag;
                        padding-right: 92px !important;
                        box-sizing: border-box !important;
                    }
                    ${s} button, ${s} a, ${s} input, ${s} [role="button"], ${s} [tabindex] {
                        -webkit-app-region: no-drag;
                    }
                `;
            } else {
                key = "standalone";
                css = `
                    #zycord-titlebar { height: 22px !important; }
                    #app-mount { padding-top: 22px !important; box-sizing: border-box !important; }
                `;
            }
            if (key !== currentKey) {
                currentKey = key;
                barStyle.textContent = css;
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
