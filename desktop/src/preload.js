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

// Discord Voice, Mute, Deafen, and Taskbar Integration
(function setupDiscordIntegration() {
    let lastState = {
        inVoice: false,
        isMuted: false,
        isDeafened: false,
        isVideoOn: false,
    };
    let lastBadgeText = null;

    // Helper: Render crisp 16x16 red notification badge for Taskbar overlay
    function renderBadgeDataURL(text) {
        if (!text) return null;
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext("2d");

            // Red circle background
            ctx.fillStyle = "#f23f43";
            ctx.beginPath();
            ctx.arc(8, 8, 7.5, 0, Math.PI * 2);
            ctx.fill();

            // Dark outline
            ctx.strokeStyle = "#1e1f22";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // White text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const display = text.length > 2 ? "9+" : text;
            ctx.fillText(display, 8, 8.5);

            return canvas.toDataURL("image/png");
        } catch (e) {
            return null;
        }
    }

    function checkState() {
        try {
            // 1. Mute button detection
            const muteBtn = document.querySelector(
                'button[aria-label="Mute"], button[aria-label="Unmute"], button[aria-label*="Mute" i], button[aria-label*="micro" i]'
            );
            let isMuted = false;
            if (muteBtn) {
                const label = (muteBtn.getAttribute("aria-label") || "").toLowerCase();
                const checked = muteBtn.getAttribute("aria-checked");
                isMuted =
                    label.includes("unmute") ||
                    label.includes("activer") ||
                    checked === "true" ||
                    Boolean(muteBtn.querySelector('[stroke*="red"], [fill*="red"], line'));
            }

            // 2. Deafen button detection
            const deafenBtn = document.querySelector(
                'button[aria-label="Deafen"], button[aria-label="Undeafen"], button[aria-label*="Deafen" i], button[aria-label*="casque" i]'
            );
            let isDeafened = false;
            if (deafenBtn) {
                const label = (deafenBtn.getAttribute("aria-label") || "").toLowerCase();
                const checked = deafenBtn.getAttribute("aria-checked");
                isDeafened =
                    label.includes("undeafen") ||
                    label.includes("activer") ||
                    checked === "true" ||
                    Boolean(deafenBtn.querySelector('[stroke*="red"], [fill*="red"], line'));
            }

            // 3. In voice room detection (Voice Connected bar or disconnect button)
            const disconnectBtn = document.querySelector(
                'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], [class*="disconnectButton_"]'
            );
            const inVoice =
                Boolean(disconnectBtn) ||
                Boolean(document.querySelector('[class*="rtcConnectionStatus_"], [class*="voiceUsers_"], [class*="callContainer_"]'));

            // 4. Video state detection
            const videoBtn = document.querySelector(
                'button[aria-label*="Camera" i], button[aria-label*="Video" i]'
            );
            let isVideoOn = false;
            if (videoBtn) {
                const label = (videoBtn.getAttribute("aria-label") || "").toLowerCase();
                isVideoOn = label.includes("turn off") || label.includes("désactiver");
            }

            // 5. Unread badge from document.title
            const titleMatch = /^\((\d+\+?)\)/.exec(document.title);
            const badgeText = titleMatch ? titleMatch[1] : (document.title.startsWith("•") ? "•" : "");

            if (badgeText !== lastBadgeText) {
                lastBadgeText = badgeText;
                const dataUrl = renderBadgeDataURL(badgeText);
                ipcRenderer.send("set-taskbar-badge", dataUrl);
            }

            // Notify main process if voice state changed
            if (
                lastState.inVoice !== inVoice ||
                lastState.isMuted !== isMuted ||
                lastState.isDeafened !== isDeafened ||
                lastState.isVideoOn !== isVideoOn
            ) {
                lastState = { inVoice, isMuted, isDeafened, isVideoOn };
                ipcRenderer.send("discord-state-change", lastState);
            }
        } catch (e) {
            // Ignore DOM errors
        }
    }

    // Check frequently for instant response
    setInterval(checkState, 400);

    // IPC Action Handlers from Tray & Taskbar Thumbar
    ipcRenderer.on("action-toggle-mute", () => {
        const muteBtn = document.querySelector(
            'button[aria-label="Mute"], button[aria-label="Unmute"], button[aria-label*="Mute" i], button[aria-label*="micro" i]'
        );
        if (muteBtn) {
            muteBtn.click();
        } else {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "M", code: "KeyM", ctrlKey: true, shiftKey: true, bubbles: true }));
        }
        setTimeout(checkState, 80);
    });

    ipcRenderer.on("action-toggle-deafen", () => {
        const deafenBtn = document.querySelector(
            'button[aria-label="Deafen"], button[aria-label="Undeafen"], button[aria-label*="Deafen" i], button[aria-label*="casque" i]'
        );
        if (deafenBtn) {
            deafenBtn.click();
        } else {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "D", code: "KeyD", ctrlKey: true, shiftKey: true, bubbles: true }));
        }
        setTimeout(checkState, 80);
    });

    ipcRenderer.on("action-toggle-video", () => {
        const videoBtn = document.querySelector(
            'button[aria-label*="Camera" i], button[aria-label*="Video" i]'
        );
        if (videoBtn) {
            videoBtn.click();
        }
        setTimeout(checkState, 80);
    });

    ipcRenderer.on("action-toggle-disconnect", () => {
        const disconnectBtn = document.querySelector(
            'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], [class*="disconnectButton_"]'
        );
        if (disconnectBtn) {
            disconnectBtn.click();
        }
        setTimeout(checkState, 80);
    });
})();
