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

    function findVoiceButtons() {
        let muteBtn = document.querySelector('button[aria-label*="Mute" i], button[aria-label*="micro" i]');
        let deafenBtn = document.querySelector('button[aria-label*="Deafen" i], button[aria-label*="casque" i], button[aria-label*="headphone" i]');

        // Reliable index fallback inside Discord's user panel
        const panel = document.querySelector('section[class*="panels_"]');
        if (panel) {
            const buttons = Array.from(panel.querySelectorAll('button')).filter((b) => {
                const label = (b.getAttribute("aria-label") || "").toLowerCase();
                return !b.querySelector('img[class*="avatar_"]') && !label.includes("status") && !label.includes("profil");
            });
            if (buttons.length >= 2) {
                if (!muteBtn) muteBtn = buttons[0];
                if (!deafenBtn) deafenBtn = buttons[1];
            }
        }

        return { muteBtn, deafenBtn };
    }

    function isButtonActive(btn, type) {
        if (!btn) return false;

        // 1. Check aria-checked switch state
        const checked = btn.getAttribute("aria-checked");
        if (checked === "true") return true;
        if (checked === "false") return false;

        // 2. Check aria-label for active toggle keywords
        const label = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
        if (type === "mute") {
            if (label.includes("unmute") || label.includes("activer") || label.includes("إلغاء كتم الصوت") || label.includes("microfon einschalten")) {
                return true;
            }
        } else if (type === "deafen") {
            if (label.includes("undeafen") || label.includes("activer") || label.includes("إلغاء كتم") || label.includes("einschalten")) {
                return true;
            }
        }

        // 3. Check for red danger styling or strikethrough slash in SVG/HTML
        const html = btn.innerHTML.toLowerCase();
        if (
            html.includes("status-danger") ||
            html.includes("strikethrough") ||
            html.includes("#f23f43") ||
            html.includes("rgb(242, 63, 67)") ||
            html.includes("hsl(359") ||
            html.includes("red")
        ) {
            return true;
        }

        // 4. In Discord, muted and deafened icons render the diagonal slash path (2+ paths vs 1 path)
        const paths = btn.querySelectorAll("svg path");
        if (paths.length >= 2) {
            return true;
        }

        // 5. Check if any SVG child element has a red stroke or fill
        const redEl = btn.querySelector('[stroke*="red"], [fill*="red"], [stroke*="f23f43"], [fill*="f23f43"], [class*="strikethrough"]');
        if (redEl) return true;

        return false;
    }

    function checkState() {
        try {
            const { muteBtn, deafenBtn } = findVoiceButtons();
            const isMuted = isButtonActive(muteBtn, "mute");
            const isDeafened = isButtonActive(deafenBtn, "deafen");

            // In voice room detection: ONLY true when the user is actually connected!
            // In Discord, the Disconnect button and RTC status only exist when actively in a voice channel or call.
            const disconnectBtn = document.querySelector(
                'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], button[aria-label*="قطع" i], [class*="disconnectButton_"]'
            );
            const rtcStatus = document.querySelector('[class*="rtcConnectionStatus_"]');
            const inVoice = Boolean(disconnectBtn) || Boolean(rtcStatus);

            // Video state detection
            const videoBtn = document.querySelector(
                'button[aria-label*="Camera" i], button[aria-label*="Video" i]'
            );
            let isVideoOn = false;
            if (videoBtn) {
                const label = (videoBtn.getAttribute("aria-label") || "").toLowerCase();
                isVideoOn = label.includes("turn off") || label.includes("désactiver") || label.includes("إيقاف");
            }

            // Unread badge from document.title
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

    // High frequency interval (200ms) for instant responsiveness
    setInterval(checkState, 200);

    // Instant reaction to user clicks anywhere in the interface
    document.addEventListener("click", () => {
        checkState();
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
        setTimeout(checkState, 300);
    }, true);

    // IPC Action Handlers from Tray & Taskbar Thumbar
    ipcRenderer.on("action-toggle-mute", () => {
        const { muteBtn } = findVoiceButtons();
        if (muteBtn) {
            muteBtn.click();
        } else {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "M", code: "KeyM", ctrlKey: true, shiftKey: true, bubbles: true }));
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });

    ipcRenderer.on("action-toggle-deafen", () => {
        const { deafenBtn } = findVoiceButtons();
        if (deafenBtn) {
            deafenBtn.click();
        } else {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "D", code: "KeyD", ctrlKey: true, shiftKey: true, bubbles: true }));
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });

    ipcRenderer.on("action-toggle-video", () => {
        const videoBtn = document.querySelector(
            'button[aria-label*="Camera" i], button[aria-label*="Video" i]'
        );
        if (videoBtn) {
            videoBtn.click();
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });

    ipcRenderer.on("action-toggle-disconnect", () => {
        const disconnectBtn = document.querySelector(
            'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], button[aria-label*="قطع" i], [class*="disconnectButton"]'
        );
        if (disconnectBtn) {
            disconnectBtn.click();
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });
})();
