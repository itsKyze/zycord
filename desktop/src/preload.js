const { contextBridge, ipcRenderer } = require("electron");

const NativeBridge = {
    isElectron: true,
    window: {
        minimize: () => ipcRenderer.send("window-minimize"),
        maximize: () => ipcRenderer.send("window-maximize"),
        close: () => ipcRenderer.send("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        setAlwaysOnTop: (enabled) => ipcRenderer.send("window-set-always-on-top", enabled),
    },
    clipboard: {
        copy: (text) => ipcRenderer.send("clipboard-copy", text),
        read: () => ipcRenderer.sendSync("clipboard-read"),
    },
    ipc: {
        send: (channel, ...args) => ipcRenderer.send(channel, ...args),
        on: (channel, listener) => ipcRenderer.on(channel, listener),
    }
};

try {
    contextBridge.exposeInMainWorld("DiscordNative", NativeBridge);
    contextBridge.exposeInMainWorld("ZycordNative", NativeBridge);
} catch (e) {
    window.DiscordNative = NativeBridge;
    window.ZycordNative = NativeBridge;
}

// 1. Inject Authentic Top Bar Window Controls (Inbox, Minimize, Maximize, Close)
window.addEventListener("DOMContentLoaded", () => {
    try {
        if (!document.body || !document.head) return;
        if (document.getElementById("zycord-win-controls")) return;

        // Window controls container (Inbox + Minimize, Maximize, Close)
        const winControls = document.createElement("div");
        winControls.id = "zycord-win-controls";
        winControls.innerHTML = `
            <button class="zycord-win-btn zycord-inbox-btn" id="zycord-btn-inbox" title="Inbox" aria-label="Inbox">
                <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.44 2s2.75-.81 3.44-2H19v3zm0-5h-4.18c-.41 1.16-1.51 2-2.82 2s-2.41-.84-2.82-2H5V5h14v9z"/>
                </svg>
            </button>
            <div class="zycord-win-separator"></div>
            <button class="zycord-win-btn" id="zycord-btn-min" title="Minimize" aria-label="Minimize">
                <svg width="10" height="10" viewBox="0 0 10 10"><rect fill="currentColor" width="10" height="1.4" x="0" y="5"></rect></svg>
            </button>
            <button class="zycord-win-btn" id="zycord-btn-max" title="Maximize" aria-label="Maximize">
                <svg id="zycord-icon-max" width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1.2"></rect></svg>
            </button>
            <button class="zycord-win-btn close" id="zycord-btn-close" title="Close" aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10"><polygon fill="currentColor" fill-rule="evenodd" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon></svg>
            </button>
        `;

        const style = document.createElement("style");
        style.id = "zycord-app-styles";
        style.textContent = `
            /* Hide Discord's broken internal window buttons so our controls are 100% in charge */
            [class*="winButton_"],
            [class*="winButtonClose_"],
            [class*="winButtonMinMax_"] {
                display: none !important;
            }

            /* Window Controls Container */
            #zycord-win-controls {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: 120px !important;
                height: 22px !important;
                z-index: 2147483647 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-end !important;
                -webkit-app-region: no-drag !important;
                pointer-events: auto !important;
                background: transparent !important;
            }

            #zycord-win-controls,
            #zycord-win-controls *,
            .zycord-win-btn,
            .zycord-win-btn * {
                -webkit-app-region: no-drag !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                user-select: none !important;
            }

            .zycord-win-separator {
                width: 1px !important;
                height: 12px !important;
                background: rgba(255, 255, 255, 0.12) !important;
                margin: 0 2px !important;
            }

            .zycord-win-btn {
                width: 28px !important;
                height: 22px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                color: #949ba4 !important;
                outline: none !important;
                transition: background 0.12s ease, color 0.12s ease !important;
            }

            .zycord-win-btn:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #ffffff !important;
            }

            .zycord-win-btn.close:hover {
                background: #f23f43 !important;
                color: #ffffff !important;
            }

            /* Make Discord native top title bar draggable, but STOP 125px before right edge */
            [class*="typeWindows_"],
            [class*="titleBar_"] {
                height: 22px !important;
                -webkit-app-region: drag !important;
                margin-right: 125px !important;
                width: auto !important;
                box-sizing: border-box !important;
            }

            /* Ensure all top bar buttons (navigation arrows ← →, wordmark, etc.) are 100% clickable */
            [class*="typeWindows_"] button,
            [class*="typeWindows_"] [role="button"],
            [class*="typeWindows_"] a,
            [class*="typeWindows_"] svg,
            [class*="typeWindows_"] [class*="history_"] *,
            [class*="titleBar_"] button,
            [class*="titleBar_"] [role="button"],
            [class*="titleBar_"] a,
            [class*="titleBar_"] svg,
            [class*="titleBar_"] * {
                -webkit-app-region: no-drag !important;
                pointer-events: auto !important;
                cursor: pointer !important;
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
        document.body.prepend(winControls);

        function toggleInbox() {
            const nativeInbox = document.querySelector(
                'button[aria-label*="Inbox" i], [aria-label*="Inbox" i], [aria-label*="صندوق الوارد" i]'
            );
            if (nativeInbox) {
                nativeInbox.click();
            } else {
                const init = {
                    key: "i",
                    code: "KeyI",
                    keyCode: 73,
                    which: 73,
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true,
                    view: window,
                };
                window.dispatchEvent(new KeyboardEvent("keydown", init));
                document.dispatchEvent(new KeyboardEvent("keydown", init));
                window.dispatchEvent(new KeyboardEvent("keyup", init));
                document.dispatchEvent(new KeyboardEvent("keyup", init));
            }
        }

        // Global capture-phase event delegation: guarantees instant click execution
        document.addEventListener("click", (e) => {
            if (e.target.closest('#zycord-btn-close, [class*="winButtonClose_"]')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-close");
                return;
            }
            if (e.target.closest('#zycord-btn-max, [class*="winButtonMinMax_"]:not(:first-child)')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-maximize");
                return;
            }
            if (e.target.closest('#zycord-btn-min, [class*="winButtonMinMax_"]:first-child')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-minimize");
                return;
            }
            if (e.target.closest('#zycord-btn-inbox')) {
                e.preventDefault();
                e.stopPropagation();
                toggleInbox();
                return;
            }
        }, true);

        // Immediate reaction on mousedown
        document.addEventListener("mousedown", (e) => {
            if (e.target.closest('#zycord-btn-close')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-close");
            } else if (e.target.closest('#zycord-btn-max')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-maximize");
            } else if (e.target.closest('#zycord-btn-min')) {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send("window-minimize");
            }
        }, true);

        // Dynamically update Maximize / Restore icon
        ipcRenderer.on("window-maximized-state", (event, isMaximized) => {
            const maxBtn = document.getElementById("zycord-btn-max");
            if (!maxBtn) return;
            if (isMaximized) {
                maxBtn.title = "Restore";
                maxBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M3 1h6v6m-2-4h-6v6h6v-6z"/></svg>`;
            } else {
                maxBtn.title = "Maximize";
                maxBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1.2"></rect></svg>`;
            }
        });
    } catch (err) {
        console.warn("[Zycord] Titlebar injection skipped:", err);
    }
});

// 2. Discord Voice, Mute, Deafen, and Taskbar Integration
(function setupDiscordIntegration() {
    let lastState = {
        inVoice: false,
        isMuted: false,
        isDeafened: false,
        isVideoOn: false,
    };
    let lastBadgeText = null;

    // Debounce flags to eliminate duplicate toggles and double audio chimes
    let isTogglingMute = false;
    let isTogglingDeafen = false;

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

    // Precise Voice Button Finder (Mute, Deafen)
    // Filters out chevron dropdown menus, avatar buttons, and settings
    function findVoiceButtons() {
        let muteBtn = null;
        let deafenBtn = null;

        const panel = document.querySelector('section[class*="panels_"]');
        if (panel) {
            const buttons = Array.from(panel.querySelectorAll("button"));

            // Helper: Detect dropdown chevron / options button
            const isChevronOrSettings = (b) => {
                const label = (b.getAttribute("aria-label") || "").toLowerCase().trim();
                if (
                    label.includes("setting") ||
                    label.includes("option") ||
                    label.includes("device") ||
                    label.includes("خيارات") ||
                    label.includes("إعداد")
                ) {
                    return true;
                }
                if (b.offsetWidth > 0 && b.offsetWidth < 28) return true;
                const cls = (b.className || "").toLowerCase();
                if (cls.includes("dropdown") || cls.includes("arrow")) return true;
                return false;
            };

            // 1. Search by exact toggle aria-label keywords
            for (const b of buttons) {
                if (isChevronOrSettings(b)) continue;
                const label = (b.getAttribute("aria-label") || "").toLowerCase().trim();

                if (
                    label === "mute" ||
                    label === "unmute" ||
                    label.startsWith("mute ") ||
                    label.startsWith("unmute ") ||
                    label.includes("كتم الصوت") ||
                    label.includes("couper le micro") ||
                    label.includes("activer le micro") ||
                    label.includes("stummschalten")
                ) {
                    muteBtn = b;
                } else if (
                    label === "deafen" ||
                    label === "undeafen" ||
                    label.startsWith("deafen ") ||
                    label.startsWith("undeafen ") ||
                    label.includes("سماعة الرأس") ||
                    label.includes("mettre en sourdine") ||
                    label.includes("désactiver la sourdine") ||
                    label.includes("taubschalten")
                ) {
                    deafenBtn = b;
                }
            }

            // 2. Structural fallback: candidate action buttons inside user panel
            if (!muteBtn || !deafenBtn) {
                const candidates = buttons.filter((b) => {
                    const label = (b.getAttribute("aria-label") || "").toLowerCase();
                    const isAvatar = b.querySelector('img[class*="avatar_"]') || label.includes("avatar") || label.includes("status");
                    const isSettings = label.includes("user setting") || label.includes("إعدادات المستخدم");
                    const isDisconnect = label.includes("disconnect") || label.includes("hang up") || label.includes("قطع");
                    return !isAvatar && !isSettings && !isDisconnect && !isChevronOrSettings(b);
                });

                if (candidates.length >= 2) {
                    if (!muteBtn) muteBtn = candidates[0];
                    if (!deafenBtn) deafenBtn = candidates[1];
                }
            }
        }

        // 3. Document-wide fallback
        if (!muteBtn) {
            muteBtn = document.querySelector(
                'button[aria-label="Mute" i], button[aria-label="Unmute" i]'
            );
        }
        if (!deafenBtn) {
            deafenBtn = document.querySelector(
                'button[aria-label="Deafen" i], button[aria-label="Undeafen" i]'
            );
        }

        return { muteBtn, deafenBtn };
    }

    // Accurate active state detector (detects muted / deafened)
    function isButtonActive(btn, type) {
        if (!btn) return false;

        // 1. Aria-label check
        const label = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
        if (type === "mute") {
            if (
                label.startsWith("unmute") ||
                label.includes("unmute") ||
                label.includes("إلغاء كتم") ||
                label.includes("activer") ||
                label.includes("einschalten")
            ) {
                return true;
            }
            if (label === "mute" || label.startsWith("mute ") || label === "كتم الصوت") {
                return false;
            }
        } else if (type === "deafen") {
            if (
                label.startsWith("undeafen") ||
                label.includes("undeafen") ||
                label.includes("إلغاء كتم") ||
                label.includes("désactiver la sourdine") ||
                label.includes("aufheben")
            ) {
                return true;
            }
            if (label === "deafen" || label.startsWith("deafen ") || label.includes("كتم صوت")) {
                return false;
            }
        }

        // 2. Aria-checked
        const checked = btn.getAttribute("aria-checked");
        if (checked === "true") return true;
        if (checked === "false") return false;

        // 3. Red danger styling in class, style or svg
        const className = (btn.className || "").toLowerCase();
        if (
            className.includes("danger") ||
            className.includes("red") ||
            className.includes("strikethrough")
        ) {
            return true;
        }

        const html = btn.innerHTML.toLowerCase();
        if (
            html.includes("status-danger") ||
            html.includes("strikethrough") ||
            html.includes("#f23f43") ||
            html.includes("rgb(242, 63, 67)") ||
            html.includes("rgb(242,63,67)") ||
            html.includes("hsl(359")
        ) {
            return true;
        }

        // 4. Strikethrough line / red stroke
        const redEl = btn.querySelector(
            '[stroke*="f23f43" i], [fill*="f23f43" i], [stroke*="red" i], [fill*="red" i], [class*="strikethrough" i], line'
        );
        if (redEl) return true;

        return false;
    }

    function triggerShortcut(code, keyCode) {
        const key = code.replace("Key", "");
        const opts = {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window,
        };
        window.dispatchEvent(new KeyboardEvent("keydown", opts));
        document.dispatchEvent(new KeyboardEvent("keydown", opts));
        window.dispatchEvent(new KeyboardEvent("keyup", opts));
        document.dispatchEvent(new KeyboardEvent("keyup", opts));
    }

    function checkState() {
        try {
            const { muteBtn, deafenBtn } = findVoiceButtons();
            const isMuted = isButtonActive(muteBtn, "mute");
            const isDeafened = isButtonActive(deafenBtn, "deafen");

            // In voice room detection: ONLY true when the user is actually connected!
            const disconnectBtn = document.querySelector(
                'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], button[aria-label*="قطع" i], [class*="disconnectButton"]'
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
        if (isTogglingMute) return;
        isTogglingMute = true;
        setTimeout(() => { isTogglingMute = false; }, 400);

        const { muteBtn } = findVoiceButtons();
        if (muteBtn) {
            muteBtn.click();
        } else {
            triggerShortcut("KeyM", 77);
        }
        setTimeout(checkState, 50);
        setTimeout(checkState, 180);
    });

    ipcRenderer.on("action-toggle-deafen", () => {
        if (isTogglingDeafen) return;
        isTogglingDeafen = true;
        setTimeout(() => { isTogglingDeafen = false; }, 400);

        const { deafenBtn } = findVoiceButtons();
        if (deafenBtn) {
            deafenBtn.click();
        } else {
            triggerShortcut("KeyD", 68);
        }
        setTimeout(checkState, 50);
        setTimeout(checkState, 180);
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
