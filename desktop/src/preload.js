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

// 1. Native Window Controls & Discord Top Bar Integration (Inside the website, no floating overlays)
function setupNativeWindowControls() {
    try {
        // Remove any legacy floating controls if present
        const legacyControls = document.getElementById("zycord-win-controls");
        if (legacyControls) legacyControls.remove();

        if (!document.getElementById("zycord-app-styles")) {
            const style = document.createElement("style");
            style.id = "zycord-app-styles";
            style.textContent = `
                /* Ensure Discord native window buttons are fully visible and clickable inside the bar */
                [class*="winButton_"],
                [class*="winButtonClose_"],
                [class*="winButtonMinMax_"] {
                    display: flex !important;
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                    user-select: none !important;
                }

                [class*="winButton_"]:hover {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    color: #ffffff !important;
                }

                [class*="winButtonClose_"]:hover {
                    background-color: #f23f43 !important;
                    color: #ffffff !important;
                }

                /* Ensure Discord native toolbar (including native Inbox, Help, etc.) is fully visible & clickable */
                [class*="toolbar_"],
                [class*="toolbar_"] *,
                section[class*="title_"] [class*="toolbar_"] {
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }

                /* Draggable Discord top bar while keeping interactive buttons non-draggable */
                [class*="typeWindows_"],
                [class*="titleBar_"] {
                    -webkit-app-region: drag !important;
                }

                [class*="typeWindows_"] button,
                [class*="typeWindows_"] [role="button"],
                [class*="typeWindows_"] a,
                [class*="typeWindows_"] svg,
                [class*="typeWindows_"] [class*="history_"] *,
                [class*="typeWindows_"] [class*="winButton_"],
                [class*="typeWindows_"] [class*="winButton_"] *,
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

        // If the website's title bar exists but winButtons are not rendered by Discord yet,
        // place them neatly INSIDE the titlebar (never floating outside)
        const titleBar = document.querySelector('[class*="typeWindows_"], [class*="titleBar_"]');
        if (titleBar && !titleBar.querySelector('[class*="winButton_"], [class*="winButtonMinMax_"], [class*="winButtonClose_"]')) {
            let container = titleBar.querySelector(".zycord-native-win-container");
            if (!container) {
                container = document.createElement("div");
                container.className = "zycord-native-win-container";
                container.style.cssText = "display:flex;align-items:center;margin-left:auto;height:100%;-webkit-app-region:no-drag !important;z-index:100;";
                container.innerHTML = `
                    <div class="winButtonMinMax_native winButton_native" role="button" aria-label="Minimize" title="Minimize" style="width:28px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#949ba4;-webkit-app-region:no-drag !important;">
                        <svg width="10" height="10" viewBox="0 0 10 10"><rect fill="currentColor" width="10" height="1.4" x="0" y="5"></rect></svg>
                    </div>
                    <div class="winButtonMinMax_native winButton_native" role="button" aria-label="Maximize" title="Maximize" style="width:28px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#949ba4;-webkit-app-region:no-drag !important;">
                        <svg id="zycord-icon-max-native" width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1.2"></rect></svg>
                    </div>
                    <div class="winButtonClose_native winButton_native" role="button" aria-label="Close" title="Close" style="width:32px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#949ba4;-webkit-app-region:no-drag !important;">
                        <svg width="10" height="10" viewBox="0 0 10 10"><polygon fill="currentColor" fill-rule="evenodd" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon></svg>
                    </div>
                `;
                titleBar.appendChild(container);
            }
        }
    } catch (err) {
        console.warn("[Zycord] Controls setup skipped:", err);
    }
}

// Master event listener for all window buttons (both Discord native and inside-titlebar)
function handleNativeWindowControl(e) {
    const target = e.target;
    if (!target) return;

    const closeBtn = target.closest('[class*="winButtonClose_"], [class*="winButtonClose"]');
    if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        ipcRenderer.send("window-close");
        return;
    }

    const minMaxBtn = target.closest('[class*="winButtonMinMax_"], [class*="winButtonMinMax"]');
    if (minMaxBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const label = (minMaxBtn.getAttribute("aria-label") || minMaxBtn.getAttribute("title") || "").toLowerCase();
        if (label.includes("min") || label.includes("تصغير")) {
            ipcRenderer.send("window-minimize");
            return;
        }
        if (label.includes("max") || label.includes("restore") || label.includes("تكبير") || label.includes("استعادة")) {
            ipcRenderer.send("window-maximize");
            return;
        }

        const parent = minMaxBtn.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('[class*="winButtonMinMax"]')) : [];
        if (siblings.length >= 2) {
            if (siblings.indexOf(minMaxBtn) === 0) {
                ipcRenderer.send("window-minimize");
            } else {
                ipcRenderer.send("window-maximize");
            }
        } else {
            ipcRenderer.send("window-maximize");
        }
    }
}

document.addEventListener("mousedown", handleNativeWindowControl, true);
document.addEventListener("click", handleNativeWindowControl, true);

// Dynamically update Maximize / Restore icon on custom inside buttons
ipcRenderer.on("window-maximized-state", (event, isMaximized) => {
    const maxBtn = document.getElementById("zycord-icon-max-native");
    if (!maxBtn) return;
    if (isMaximized) {
        maxBtn.outerHTML = `<svg id="zycord-icon-max-native" width="10" height="10" viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M3 1h6v6m-2-4h-6v6h6v-6z"/></svg>`;
    } else {
        maxBtn.outerHTML = `<svg id="zycord-icon-max-native" width="10" height="10" viewBox="0 0 10 10"><rect fill="none" stroke="currentColor" width="8" height="8" x="1" y="1" stroke-width="1.2"></rect></svg>`;
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupNativeWindowControls);
} else {
    setupNativeWindowControls();
}

setInterval(setupNativeWindowControls, 1000);

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
