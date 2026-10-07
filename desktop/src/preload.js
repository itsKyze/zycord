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

try {
    if (!localStorage.getItem("zycord.gifProvider")) {
        localStorage.setItem("zycord.gifProvider", "tenor");
    }
} catch (_) {}

// 1. Authentic Top Bar Window Controls (| [ - ] [ □ ] [ ✕ ])
function initWindowControls() {
    try {
        if (!document.documentElement) return;

        // Persistent top draggable titlebar across the whole app
        if (!document.getElementById("zycord-titlebar")) {
            const titlebar = document.createElement("div");
            titlebar.id = "zycord-titlebar";
            (document.body || document.documentElement).appendChild(titlebar);
        }

        if (document.getElementById("zycord-win-controls")) {
            const titlebarEl = document.getElementById("zycord-titlebar");
            if (titlebarEl && !titlebarEl.__zycordBound) {
                titlebarEl.__zycordBound = true;
                titlebarEl.addEventListener("dblclick", (e) => {
                    e.preventDefault();
                    ipcRenderer.send("window-maximize");
                });
            }
            return;
        }

        // Top bar controls: Update Badge, Separator, Minimize, Maximize, Close
        const winControls = document.createElement("div");
        winControls.id = "zycord-win-controls";
        winControls.innerHTML = `
            <button class="zycord-update-btn" id="zycord-btn-update" title="تحديث جديد جاهز! اضغط لإعادة التشغيل والتثبيت" aria-label="Update Ready" style="display: none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#23A55A" />
                    <path d="M12 7V13.5M12 13.5L9 10.5M12 13.5L15 10.5M8 16.5H16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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

        if (!document.getElementById("zycord-app-styles")) {
            const style = document.createElement("style");
            style.id = "zycord-app-styles";
            style.textContent = `
                /* Window Controls Container: Update Badge, Separator, Min, Max, Close */
                #zycord-win-controls {
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
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
                .zycord-win-btn *,
                .zycord-update-btn,
                .zycord-update-btn * {
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                    user-select: none !important;
                }

                /* Dedicated Top Draggable Bar (stops 145px before right edge so inbox & window controls are 100% non-drag and clickable) */
                #zycord-titlebar {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: calc(100% - 145px) !important;
                    height: 24px !important;
                    z-index: 2147483646 !important;
                    -webkit-app-region: drag !important;
                    pointer-events: auto !important;
                    background: transparent !important;
                    user-select: none !important;
                    -webkit-user-select: none !important;
                }

                /* Discord-style Emerald Green Update Button */
                .zycord-update-btn {
                    width: 26px !important;
                    height: 20px !important;
                    display: none;
                    align-items: center !important;
                    justify-content: center !important;
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 2px !important;
                    cursor: pointer !important;
                    outline: none !important;
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    transition: transform 0.15s ease, filter 0.15s ease !important;
                    flex-shrink: 0 !important;
                }

                .zycord-update-btn.visible {
                    display: flex !important;
                    animation: zycord-badge-pulse 2s infinite ease-in-out !important;
                }

                .zycord-update-btn:hover {
                    transform: scale(1.18) !important;
                    filter: drop-shadow(0 0 6px rgba(35, 165, 90, 0.9)) !important;
                }

                @keyframes zycord-badge-pulse {
                    0% { filter: drop-shadow(0 0 2px rgba(35, 165, 90, 0.4)); }
                    50% { filter: drop-shadow(0 0 7px rgba(35, 165, 90, 0.9)); }
                    100% { filter: drop-shadow(0 0 2px rgba(35, 165, 90, 0.4)); }
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

                /* Position the REAL native Discord Inbox button from the website */
                [class*="iconWrapper_"]:has([aria-label*="Inbox" i]),
                [class*="iconWrapper_"]:has([aria-label*="صندوق الوارد" i]),
                [class*="trailing_"] [class*="iconWrapper_"]:has([aria-label*="Inbox" i]),
                [class*="trailing_"] [class*="iconWrapper_"]:has([aria-label*="صندوق الوارد" i]),
                [class*="toolbar_"] [class*="iconWrapper_"]:has([aria-label*="Inbox" i]),
                [class*="toolbar_"] [class*="iconWrapper_"]:has([aria-label*="صندوق الوارد" i]) {
                    position: fixed !important;
                    top: 0 !important;
                    cursor: pointer !important;
                }

                [class*="iconWrapper_"]:has([aria-label*="Inbox" i]) *,
                [class*="iconWrapper_"]:has([aria-label*="صندوق الوارد" i]) * {
                    -webkit-app-region: no-drag !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }

                /* Hide native Help button so only the original Inbox is in the top bar */
                [class*="trailing_"] a[href*="support.discord.com"],
                [class*="trailing_"] [aria-label*="Help" i],
                [class*="trailing_"] [aria-label*="مساعدة" i],
                [class*="toolbar_"] a[href*="support.discord.com"],
                [class*="toolbar_"] [aria-label*="Help" i],
                [class*="toolbar_"] [aria-label*="مساعدة" i] {
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

                /* Stop draggable top bar 145px before right edge so both original inbox and window controls are 100% non-drag */
                [class*="typeWindows_"],
                [class*="titleBar_"],
                [class*="withFrame_"] {
                    height: 22px !important;
                    -webkit-app-region: drag !important;
                    max-width: calc(100% - 145px) !important;
                    width: calc(100% - 145px) !important;
                    margin-right: 145px !important;
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

                /* Auth / Login / Register Page: Allow dragging from background space and top branding */
                [class*="characterBackground_"],
                [class*="splashBackground_"],
                [class*="centeringWrapper_"],
                [class*="artwork_"],
                [class*="authWrapper_"],
                [class*="pageContainer_"],
                [class*="content_"]:has(> [class*="authBox_"]),
                [class*="content_"]:has(> [class*="authBoxExpanded_"]),
                div:has(> [class*="authBox_"]),
                div:has(> [class*="authBoxExpanded_"]),
                [class*="wordmark_"] {
                    -webkit-app-region: drag !important;
                }

                /* Ensure auth box / login card, form inputs, buttons, qr code are non-drag and fully interactive */
                [class*="authBox_"],
                [class*="authBoxExpanded_"],
                [class*="authBox_"] *,
                [class*="authBoxExpanded_"] *,
                [class*="qrCode_"],
                [class*="qrCode_"] *,
                [class*="form_"],
                [class*="form_"] *,
                form,
                form *,
                input,
                input *,
                button,
                button *,
                a,
                a *,
                [role="button"],
                [role="button"] * {
                    -webkit-app-region: no-drag !important;
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

        const titlebarEl = document.getElementById("zycord-titlebar");
        if (titlebarEl && !titlebarEl.__zycordBound) {
            titlebarEl.__zycordBound = true;
            titlebarEl.addEventListener("dblclick", handleMaximize);
        }

        const minBtn = document.getElementById("zycord-btn-min");
        if (minBtn) minBtn.addEventListener("click", handleMinimize);

        const maxBtn = document.getElementById("zycord-btn-max");
        if (maxBtn) maxBtn.addEventListener("click", handleMaximize);

        const closeBtn = document.getElementById("zycord-btn-close");
        if (closeBtn) closeBtn.addEventListener("click", handleClose);

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

// Ensure original website Inbox button is placed dynamically left of window controls
function ensureNativeInboxPosition() {
    try {
        const inbox = document.querySelector('[class*="trailing_"] [aria-label*="Inbox" i], [class*="trailing_"] [aria-label*="صندوق الوارد" i], [class*="iconWrapper_"] [aria-label*="Inbox" i], [aria-label*="Inbox" i]:not(#zycord-win-controls *)');
        if (!inbox) return;
        const wrapper = inbox.closest('[class*="iconWrapper_"]') || inbox.parentElement || inbox;
        if (wrapper && wrapper.id !== "zycord-win-controls") {
            const winControls = document.getElementById("zycord-win-controls");
            const controlsWidth = winControls ? Math.max(98, Math.round(winControls.getBoundingClientRect().width)) : 98;
            wrapper.style.setProperty("position", "fixed", "important");
            wrapper.style.setProperty("top", "0px", "important");
            wrapper.style.setProperty("right", `${controlsWidth}px`, "important");
            wrapper.style.setProperty("width", "28px", "important");
            wrapper.style.setProperty("height", "22px", "important");
            wrapper.style.setProperty("z-index", "2147483647", "important");
            wrapper.style.setProperty("display", "flex", "important");
            wrapper.style.setProperty("align-items", "center", "important");
            wrapper.style.setProperty("justify-content", "center", "important");
            wrapper.style.setProperty("-webkit-app-region", "no-drag", "important");
            wrapper.style.setProperty("pointer-events", "auto", "important");
            wrapper.style.setProperty("margin", "0", "important");
            wrapper.style.setProperty("padding", "0", "important");
        }
    } catch (_) {}
}

setInterval(ensureNativeInboxPosition, 300);

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
    if (!document.documentElement) return;
    if (!document.getElementById("zycord-win-controls") || !document.getElementById("zycord-titlebar")) {
        initWindowControls();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureWindowControls);
} else {
    ensureWindowControls();
}

setInterval(ensureWindowControls, 1000);

// Discord-Style Dynamic Update System (Web Updates + Desktop Updates)
(function setupUpdateNotificationSystem() {
    let pendingUpdateType = null; // "desktop" | "web"

    function triggerUpdateBadge(type, message) {
        pendingUpdateType = type;
        const btn = document.getElementById("zycord-btn-update");
        if (btn) {
            btn.classList.add("visible");
            btn.style.setProperty("display", "flex", "important");
            if (message) btn.title = message;
            ensureNativeInboxPosition();
        }
    }

    // A. Listen for Desktop App updates from Electron
    ipcRenderer.on("update-available-badge", (event, data) => {
        if (data?.ready) {
            triggerUpdateBadge("desktop", "تحديث البرنامج جاهز! اضغط لإعادة التشغيل والتثبيت\nZycord Desktop update ready! Click to restart");
        } else if (data?.available) {
            triggerUpdateBadge("desktop", "يتم تحميل تحديث البرنامج في الخلفية...\nDownloading update in background...");
        }
    });

    // B. Detect Web & Server updates by polling version hash
    let initialVersionHash = null;

    async function checkWebUpdate() {
        try {
            const channel = window.GLOBAL_ENV?.RELEASE_CHANNEL || "stable";
            const res = await fetch(`/assets/version.${channel}.json?_t=${Date.now()}`, {
                cache: "no-cache",
                headers: { "Cache-Control": "no-cache" },
            });
            if (!res.ok) return;
            const data = await res.json();
            const currentHash = data?.hash;
            if (!currentHash) return;

            if (!initialVersionHash) {
                initialVersionHash = window.GLOBAL_ENV?.VERSION_HASH || currentHash;
            } else if (currentHash !== initialVersionHash) {
                console.log("[Zycord] New web build detected:", currentHash, "Initial:", initialVersionHash);
                triggerUpdateBadge("web", "تحديث جديد في الموقع متوفر! اضغط لتحديث الصفحة فوراً\nWeb update available! Click to reload");
            }
        } catch (_) {}
    }

    // Initial check after 10 seconds, then poll every 60 seconds
    setTimeout(checkWebUpdate, 10000);
    setInterval(checkWebUpdate, 60000);

    // C. Click handler for the green update button
    document.addEventListener(
        "click",
        (e) => {
            const btn = e.target.closest("#zycord-btn-update");
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();

            if (pendingUpdateType === "desktop") {
                ipcRenderer.send("updater:install-update");
            } else {
                window.location.reload();
            }
        },
        true,
    );
})();

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
