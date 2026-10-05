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

// 1. Authentic Top Bar Window Controls ([ Inbox ] [ ? ] | [ - ] [ □ ] [ ✕ ])
function initWindowControls() {
    try {
        if (!document.documentElement) return;
        if (document.getElementById("zycord-win-controls")) return;

        // Top bar controls: Inbox, Help, Separator, Minimize, Maximize, Close
        const winControls = document.createElement("div");
        winControls.id = "zycord-win-controls";
        winControls.innerHTML = `
            <button class="zycord-win-btn" id="zycord-btn-inbox" title="Inbox" aria-label="Inbox">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.44 2s2.75-.81 3.44-2H19v3zm0-5h-4.18c-.41 1.16-1.51 2-2.82 2s-2.41-.84-2.82-2H5V5h14v9z"/></svg>
            </button>
            <button class="zycord-win-btn" id="zycord-btn-help" title="Help" aria-label="Help">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
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

        if (!document.getElementById("zycord-app-styles")) {
            const style = document.createElement("style");
            style.id = "zycord-app-styles";
            style.textContent = `
                /* Window Controls Container */
                #zycord-win-controls {
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    width: 153px !important;
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
                    height: 14px !important;
                    background: rgba(255, 255, 255, 0.16) !important;
                    margin: 0 4px !important;
                    flex-shrink: 0 !important;
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
                    cursor: pointer !important;
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    transition: background 0.12s ease, color 0.12s ease !important;
                    flex-shrink: 0 !important;
                }

                .zycord-win-btn:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }

                .zycord-win-btn.close {
                    width: 32px !important;
                }

                .zycord-win-btn.close:hover {
                    background: #f23f43 !important;
                    color: #ffffff !important;
                }

                /* Hide duplicate native Inbox & Help from lower channel header so they only appear in top bar */
                [class*="trailing_"] [class*="iconWrapper_"]:has([aria-label*="Inbox" i]),
                [class*="trailing_"] [class*="iconWrapper_"]:has([aria-label*="صندوق الوارد" i]),
                [class*="trailing_"] [aria-label*="Inbox" i]:not(#zycord-win-controls *),
                [class*="trailing_"] [aria-label*="صندوق الوارد" i]:not(#zycord-win-controls *),
                [class*="trailing_"] a[href*="support.discord.com"],
                [class*="trailing_"] [aria-label*="Help" i],
                [class*="trailing_"] [aria-label*="مساعدة" i],
                [class*="toolbar_"] [aria-label*="Inbox" i]:not(#zycord-win-controls *),
                [class*="toolbar_"] [aria-label*="صندوق الوارد" i]:not(#zycord-win-controls *),
                [class*="toolbar_"] a[href*="support.discord.com"],
                [class*="toolbar_"] [aria-label*="Help" i] {
                    display: none !important;
                }

                /* Ensure Discord native toolbar / header is clickable */
                [class*="trailing_"],
                [class*="trailing_"] *,
                [class*="toolbar_"],
                [class*="toolbar_"] *,
                section[class*="title_"] [class*="toolbar_"] * {
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }

                /* Stop draggable top bar 156px before right edge so window controls are in a 100% non-drag zone */
                [class*="typeWindows_"],
                [class*="titleBar_"],
                [class*="withFrame_"] {
                    height: 22px !important;
                    -webkit-app-region: drag !important;
                    max-width: calc(100% - 156px) !important;
                    width: calc(100% - 156px) !important;
                    margin-right: 156px !important;
                    box-sizing: border-box !important;
                }

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
            (document.head || document.documentElement).appendChild(style);
        }

        (document.body || document.documentElement).appendChild(winControls);

        let lastMaxClick = 0;
        const handleMaximize = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const now = Date.now();
            if (now - lastMaxClick < 350) return;
            lastMaxClick = now;
            ipcRenderer.send("window-maximize");
        };

        const handleMinimize = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            ipcRenderer.send("window-minimize");
        };

        const handleClose = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            ipcRenderer.send("window-close");
        };

        const handleToggleInbox = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Trigger native keystroke Ctrl+I from Electron backend
            ipcRenderer.send("action-toggle-inbox");

            // Also attempt DOM click on native inbox if found
            try {
                const candidates = document.querySelectorAll('[aria-label*="Inbox" i], [aria-label*="صندوق الوارد" i]');
                for (const el of candidates) {
                    if (!el.closest('#zycord-win-controls')) {
                        el.click();
                        break;
                    }
                }
            } catch (_) {}
        };

        const handleOpenHelp = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            ipcRenderer.send("open-external", "https://support.discord.com");
        };

        const minBtn = document.getElementById("zycord-btn-min");
        if (minBtn) minBtn.addEventListener("click", handleMinimize);

        const maxBtn = document.getElementById("zycord-btn-max");
        if (maxBtn) maxBtn.addEventListener("click", handleMaximize);

        const closeBtn = document.getElementById("zycord-btn-close");
        if (closeBtn) closeBtn.addEventListener("click", handleClose);

        const inboxBtn = document.getElementById("zycord-btn-inbox");
        if (inboxBtn) inboxBtn.addEventListener("click", handleToggleInbox);

        const helpBtn = document.getElementById("zycord-btn-help");
        if (helpBtn) helpBtn.addEventListener("click", handleOpenHelp);

        try {
            if (ipcRenderer.sendSync("window-is-maximized")) {
                const maxBtnEl = document.getElementById("zycord-btn-max");
                if (maxBtnEl) {
                    maxBtnEl.title = "Restore";
                    maxBtnEl.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M3 1h6v6m-2-4h-6v6h6v-6z"/></svg>`;
                }
            }
        } catch (_) {}
    } catch (err) {
        console.warn("[Zycord] Controls setup error:", err);
    }
}

// Global capture fallback for window controls & native winButtons (click only with debounce)
let globalMaxClickTime = 0;
document.addEventListener("click", (e) => {
    const closeEl = e.target.closest('#zycord-btn-close, [class*="winButtonClose_"]');
    if (closeEl) {
        e.preventDefault();
        ipcRenderer.send("window-close");
        return;
    }
    const maxEl = e.target.closest('#zycord-btn-max, [class*="winButtonMinMax_"]:not(:first-child)');
    if (maxEl) {
        e.preventDefault();
        const now = Date.now();
        if (now - globalMaxClickTime < 350) return;
        globalMaxClickTime = now;
        ipcRenderer.send("window-maximize");
        return;
    }
    const minEl = e.target.closest('#zycord-btn-min, [class*="winButtonMinMax_"]:first-child');
    if (minEl) {
        e.preventDefault();
        ipcRenderer.send("window-minimize");
        return;
    }
    const inboxEl = e.target.closest('#zycord-btn-inbox');
    if (inboxEl) {
        e.preventDefault();
        ipcRenderer.send("action-toggle-inbox");
        return;
    }
    const helpEl = e.target.closest('#zycord-btn-help');
    if (helpEl) {
        e.preventDefault();
        ipcRenderer.send("open-external", "https://support.discord.com");
        return;
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
        maxBtn.innerHTML = `<svg id="zycord-icon-max" width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1.2"></rect></svg>`;
    }
});

function ensureWindowControls() {
    if (!document.getElementById("zycord-win-controls")) {
        initWindowControls();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureWindowControls);
} else {
    ensureWindowControls();
}

setInterval(ensureWindowControls, 1000);

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

            // 1. Search by toggle aria-label keywords
            for (const b of buttons) {
                if (isChevronOrSettings(b)) continue;
                const label = (b.getAttribute("aria-label") || "").toLowerCase().trim();

                if (
                    label.includes("mute") ||
                    label.includes("كتم الصوت") ||
                    label.includes("couper le micro") ||
                    label.includes("activer le micro") ||
                    label.includes("stummschalten")
                ) {
                    muteBtn = b;
                } else if (
                    label.includes("deafen") ||
                    label.includes("سماعة الرأس") ||
                    label.includes("casque") ||
                    label.includes("headphone") ||
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
                'button[aria-label*="Mute" i], button[aria-label*="Unmute" i]'
            );
        }
        if (!deafenBtn) {
            deafenBtn = document.querySelector(
                'button[aria-label*="Deafen" i], button[aria-label*="Undeafen" i]'
            );
        }

        return { muteBtn, deafenBtn };
    }

    // Accurate active state detector (detects muted / deafened)
    function isButtonActive(btn, type) {
        if (!btn) return false;

        // 1. Red danger styling in class, style or svg (most reliable in Discord)
        const className = (btn.className || "").toLowerCase();
        const html = btn.innerHTML.toLowerCase();
        if (
            className.includes("danger") ||
            className.includes("red") ||
            className.includes("strikethrough") ||
            html.includes("status-danger") ||
            html.includes("strikethrough") ||
            html.includes("#f23f43") ||
            html.includes("rgb(242, 63, 67)") ||
            html.includes("rgb(242,63,67)") ||
            html.includes("hsl(359")
        ) {
            return true;
        }

        const redEl = btn.querySelector(
            '[stroke*="f23f43" i], [fill*="f23f43" i], [stroke*="red" i], [fill*="red" i], [class*="strikethrough" i], line'
        );
        if (redEl) return true;

        // 2. Aria-checked attribute
        const checked = btn.getAttribute("aria-checked");
        if (checked === "true") return true;

        // 3. Aria-label check
        const label = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
        if (type === "mute") {
            if (
                label.includes("unmute") ||
                label.includes("إلغاء كتم") ||
                label.includes("activer") ||
                label.includes("einschalten")
            ) {
                return true;
            }
        } else if (type === "deafen") {
            if (
                label.includes("undeafen") ||
                label.includes("إلغاء كتم") ||
                label.includes("désactiver la sourdine") ||
                label.includes("aufheben")
            ) {
                return true;
            }
        }

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
