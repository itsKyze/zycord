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

// 1. Inject Authentic Top Bar Window Controls & Header Drag Management
window.addEventListener("DOMContentLoaded", () => {
    try {
        if (!document.body || !document.head) return;
        if (document.getElementById("zycord-win-controls")) return;

        // Fallback drag area for login / initial loading screen
        const dragArea = document.createElement("div");
        dragArea.id = "zycord-drag-area";

        // Window controls container (Minimize, Maximize, Close)
        const winControls = document.createElement("div");
        winControls.id = "zycord-win-controls";
        winControls.innerHTML = `
            <button class="zycord-win-btn" id="zycord-btn-min" title="Minimize" aria-label="Minimize">
                <svg width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1.2" x="1" y="6"></rect></svg>
            </button>
            <button class="zycord-win-btn" id="zycord-btn-max" title="Maximize" aria-label="Maximize">
                <svg id="zycord-icon-max" width="12" height="12" viewBox="0 0 12 12"><rect fill="none" stroke="currentColor" width="9" height="9" x="1.5" y="1.5" stroke-width="1.2"></rect></svg>
            </button>
            <button class="zycord-win-btn close" id="zycord-btn-close" title="Close" aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fill-rule="evenodd" points="11 1.8 10.2 1 6 5.2 1.8 1 1 1.8 5.2 6 1 10.2 1.8 11 6 6.8 10.2 11 11 10.2 6.8 6"></polygon></svg>
            </button>
        `;

        const style = document.createElement("style");
        style.id = "zycord-app-styles";
        style.textContent = `
            /* Initial / login fallback drag bar */
            #zycord-drag-area {
                position: fixed;
                top: 0;
                left: 0;
                right: 112px;
                height: 28px;
                z-index: 9999;
                -webkit-app-region: drag;
                pointer-events: auto;
            }
            body.app-ready #zycord-drag-area {
                display: none !important;
            }

            /* Window Controls Container */
            #zycord-win-controls {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: 108px !important;
                height: 32px !important;
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
                user-select: none !important;
            }
            .zycord-win-btn {
                width: 36px !important;
                height: 32px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                color: #949ba4 !important;
                cursor: pointer !important;
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

            /* Shift Discord's top toolbar to avoid any collision with window controls */
            [class*="toolbar_"] {
                margin-right: 112px !important;
                -webkit-app-region: no-drag !important;
                pointer-events: auto !important;
            }
            [class*="toolbar_"],
            [class*="toolbar_"] * {
                -webkit-app-region: no-drag !important;
                pointer-events: auto !important;
                cursor: pointer !important;
            }

            /* Make Discord header bars draggable */
            section[class*="title_"],
            div[class*="subtitleContainer_"],
            header[class*="header_"] {
                -webkit-app-region: drag !important;
            }

            /* Ensure all buttons, search bar, and interactive items inside headers are clickable */
            section[class*="title_"] button,
            section[class*="title_"] [role="button"],
            section[class*="title_"] a,
            section[class*="title_"] input,
            section[class*="title_"] svg,
            section[class*="title_"] [class*="children_"] > *,
            header[class*="header_"] button,
            header[class*="header_"] * {
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
        document.body.prepend(dragArea);
        document.body.prepend(winControls);

        // Bind control buttons with multiple event types to guarantee responsive action
        const bindControl = (id, action) => {
            const el = document.getElementById(id);
            if (!el) return;
            const trigger = (e) => {
                e.preventDefault();
                e.stopPropagation();
                ipcRenderer.send(action);
            };
            el.addEventListener("click", trigger, true);
            el.addEventListener("mouseup", trigger, true);
            el.addEventListener("pointerup", trigger, true);
        };

        bindControl("zycord-btn-min", "window-minimize");
        bindControl("zycord-btn-max", "window-maximize");
        bindControl("zycord-btn-close", "window-close");

        // Dynamically update Maximize / Restore icon
        ipcRenderer.on("window-maximized-state", (event, isMaximized) => {
            const maxBtn = document.getElementById("zycord-btn-max");
            if (!maxBtn) return;
            if (isMaximized) {
                maxBtn.title = "Restore";
                maxBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path fill="none" stroke="currentColor" stroke-width="1.2" d="M3.5 1.5h6v6m-2-4h-6v6h6v-6z"/></svg>`;
            } else {
                maxBtn.title = "Maximize";
                maxBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><rect fill="none" stroke="currentColor" width="9" height="9" x="1.5" y="1.5" stroke-width="1.2"></rect></svg>`;
            }
        });

        // App mounted state tracker to hide fallback drag bar
        const checkAppMounted = () => {
            const hasHeader = Boolean(
                document.querySelector('section[class*="title_"], header[class*="header_"], [class*="panels_"]')
            );
            if (hasHeader && !document.body.classList.contains("app-ready")) {
                document.body.classList.add("app-ready");
            } else if (!hasHeader && document.body.classList.contains("app-ready")) {
                document.body.classList.remove("app-ready");
            }
        };

        new MutationObserver(checkAppMounted).observe(document.body, { childList: true, subtree: true });
        checkAppMounted();
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
    function findVoiceButtons() {
        let muteBtn = null;
        let deafenBtn = null;

        const panels = document.querySelector('section[class*="panels_"]');
        if (panels) {
            // Find all buttons inside the bottom user section
            const allButtons = Array.from(panels.querySelectorAll("button"));

            // Find Settings button (gear icon or settings label in any language)
            const settingsBtn = allButtons.find((b) => {
                const label = (b.getAttribute("aria-label") || "").toLowerCase();
                return (
                    label.includes("setting") ||
                    label.includes("param") ||
                    label.includes("إعداد") ||
                    label.includes("einstell") ||
                    label.includes("ajuste") ||
                    label.includes("config")
                );
            });

            if (settingsBtn && settingsBtn.parentElement) {
                // In Discord, Mute, Deafen, and Settings are direct siblings in the same container div
                const siblings = Array.from(settingsBtn.parentElement.querySelectorAll("button"));
                const sIdx = siblings.indexOf(settingsBtn);
                if (sIdx >= 2) {
                    muteBtn = siblings[sIdx - 2];
                    deafenBtn = siblings[sIdx - 1];
                } else if (siblings.length >= 3) {
                    muteBtn = siblings[0];
                    deafenBtn = siblings[1];
                }
            }

            // Fallback: Look for the cluster div inside panels that contains exactly 3 buttons
            if (!muteBtn || !deafenBtn) {
                const allDivs = Array.from(panels.querySelectorAll("div"));
                for (const d of allDivs) {
                    const btns = Array.from(d.children).filter((c) => c.tagName === "BUTTON");
                    if (btns.length === 3) {
                        muteBtn = btns[0];
                        deafenBtn = btns[1];
                        break;
                    }
                }
            }
        }

        // Secondary fallback by explicit aria-labels
        if (!muteBtn) {
            muteBtn = document.querySelector(
                'button[aria-label*="Mute" i], button[aria-label*="micro" i], button[aria-label*="كتم" i]'
            );
        }
        if (!deafenBtn) {
            deafenBtn = document.querySelector(
                'button[aria-label*="Deafen" i], button[aria-label*="Undeafen" i], button[aria-label*="sourdine" i], button[aria-label*="casque" i], button[aria-label*="headphone" i]'
            );
        }

        return { muteBtn, deafenBtn };
    }

    // Accurate active state detector (detects muted / deafened)
    function isButtonActive(btn, type) {
        if (!btn) return false;

        // 1. Check aria-checked switch attribute
        const checked = btn.getAttribute("aria-checked");
        if (checked === "true") return true;
        if (checked === "false") return false;

        // 2. Check aria-label for active toggle keywords across languages
        const label = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
        if (type === "mute") {
            if (
                label.startsWith("un") ||
                label.includes("unmute") ||
                label.includes("إلغاء") ||
                label.includes("activer") ||
                label.includes("désactiver") ||
                label.includes("réactiver") ||
                label.includes("microfon einschalten")
            ) {
                return true;
            }
        } else if (type === "deafen") {
            if (
                label.startsWith("un") ||
                label.includes("undeafen") ||
                label.includes("إلغاء") ||
                label.includes("activer") ||
                label.includes("désactiver") ||
                label.includes("réactiver") ||
                label.includes("einschalten")
            ) {
                return true;
            }
        }

        // 3. Check for Discord's red danger / strikethrough styling
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

        // 4. Check if any SVG child element has a red stroke or fill
        const redEl = btn.querySelector(
            '[stroke*="f23f43" i], [fill*="f23f43" i], [stroke*="red" i], [fill*="red" i], [class*="strikethrough" i], line'
        );
        if (redEl) return true;

        return false;
    }

    // React 18 & DOM safe click simulation
    function simulateClick(el) {
        if (!el) return false;
        try {
            const rect = el.getBoundingClientRect();
            const clientX = rect.left + rect.width / 2;
            const clientY = rect.top + rect.height / 2;

            const opts = {
                bubbles: true,
                cancelable: true,
                composed: true,
                view: window,
                clientX,
                clientY,
                button: 0,
                buttons: 1,
            };

            const target = el.querySelector("svg") || el.firstElementChild || el;
            target.dispatchEvent(new PointerEvent("pointerdown", opts));
            target.dispatchEvent(new MouseEvent("mousedown", opts));
            target.dispatchEvent(new PointerEvent("pointerup", opts));
            target.dispatchEvent(new MouseEvent("mouseup", opts));
            target.dispatchEvent(new MouseEvent("click", opts));
            el.click();
            return true;
        } catch (e) {
            try {
                el.click();
                return true;
            } catch (_) {
                return false;
            }
        }
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
        const { muteBtn } = findVoiceButtons();
        const wasMuted = isButtonActive(muteBtn, "mute");
        simulateClick(muteBtn);

        // Fallback check after 120ms: if state didn't change, trigger Ctrl+Shift+M keybind
        setTimeout(() => {
            const { muteBtn: curBtn } = findVoiceButtons();
            if (isButtonActive(curBtn, "mute") === wasMuted) {
                const init = {
                    key: "M",
                    code: "KeyM",
                    keyCode: 77,
                    which: 77,
                    ctrlKey: true,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window,
                };
                window.dispatchEvent(new KeyboardEvent("keydown", init));
                document.dispatchEvent(new KeyboardEvent("keydown", init));
                window.dispatchEvent(new KeyboardEvent("keyup", init));
                document.dispatchEvent(new KeyboardEvent("keyup", init));
            }
            checkState();
        }, 120);

        setTimeout(checkState, 40);
        setTimeout(checkState, 300);
    });

    ipcRenderer.on("action-toggle-deafen", () => {
        const { deafenBtn } = findVoiceButtons();
        const wasDeafened = isButtonActive(deafenBtn, "deafen");
        simulateClick(deafenBtn);

        // Fallback check after 120ms: if state didn't change, trigger Ctrl+Shift+D keybind
        setTimeout(() => {
            const { deafenBtn: curBtn } = findVoiceButtons();
            if (isButtonActive(curBtn, "deafen") === wasDeafened) {
                const init = {
                    key: "D",
                    code: "KeyD",
                    keyCode: 68,
                    which: 68,
                    ctrlKey: true,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window,
                };
                window.dispatchEvent(new KeyboardEvent("keydown", init));
                document.dispatchEvent(new KeyboardEvent("keydown", init));
                window.dispatchEvent(new KeyboardEvent("keyup", init));
                document.dispatchEvent(new KeyboardEvent("keyup", init));
            }
            checkState();
        }, 120);

        setTimeout(checkState, 40);
        setTimeout(checkState, 300);
    });

    ipcRenderer.on("action-toggle-video", () => {
        const videoBtn = document.querySelector(
            'button[aria-label*="Camera" i], button[aria-label*="Video" i]'
        );
        if (videoBtn) {
            simulateClick(videoBtn);
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });

    ipcRenderer.on("action-toggle-disconnect", () => {
        const disconnectBtn = document.querySelector(
            'button[aria-label*="Disconnect" i], button[aria-label*="Hang Up" i], button[aria-label*="Déconnexion" i], button[aria-label*="قطع" i], [class*="disconnectButton"]'
        );
        if (disconnectBtn) {
            simulateClick(disconnectBtn);
        }
        setTimeout(checkState, 40);
        setTimeout(checkState, 120);
    });
})();
