(() => {
    // 86-recovery-email.js: Backup / Recovery Email feature in Zycord User Settings (1:1 Discord Parity)
    const readToken = () => {
        try {
            return JSON.parse(localStorage.getItem("token") ?? "null");
        } catch {
            return null;
        }
    };

    let recoveryEmailData = null;
    let fetching = false;

    const fetchRecoveryEmail = async () => {
        const token = readToken();
        if (!token || fetching) return;
        fetching = true;
        try {
            const res = await fetch("/api/v9/users/@me/recovery-email", {
                headers: { authorization: token },
            });
            if (res.ok) {
                recoveryEmailData = await res.json();
            }
        } catch (e) {
            console.error("[RecoveryEmail] Failed to fetch recovery email status:", e);
        } finally {
            fetching = false;
        }
    };

    const openRecoveryModal = () => {
        const token = readToken();
        if (!token) return;

        document.getElementById("zycord-recovery-modal-backdrop")?.remove();

        const backdrop = document.createElement("div");
        backdrop.id = "zycord-recovery-modal-backdrop";
        backdrop.className = "zc-rec-backdrop";
        backdrop.tabIndex = -1;
        backdrop.innerHTML = `
            <div class="zc-rec-modal" role="dialog" aria-modal="true" aria-labelledby="zc-rec-modal-title">
                <button class="zc-modal-close" id="zc-modal-close-btn" type="button" aria-label="Close">
                    <svg style="pointer-events: none;" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                </button>
                <div class="zc-rec-header">
                    <h2 class="zc-rec-title" id="zc-rec-modal-title">Backup / Recovery Email</h2>
                    <p class="zc-rec-desc" id="zc-rec-modal-desc">
                        Enter a backup email address (such as Gmail) to protect your account and recover access if you ever lose your primary email or forget your password.
                    </p>
                </div>

                <div id="zc-rec-body" class="zc-rec-body">
                    <div id="zc-step-1">
                        <label class="zc-rec-label" for="zc-rec-email-input">Backup Email</label>
                        <input id="zc-rec-email-input" type="email" class="zc-rec-input" placeholder="name@gmail.com" autocomplete="email" spellcheck="false" />
                        <div id="zc-rec-error-1" class="zc-rec-error" style="display: none;"></div>
                    </div>

                    <div id="zc-step-2" style="display: none;">
                        <label class="zc-rec-label" for="zc-rec-code-input">Verification Code</label>
                        <input id="zc-rec-code-input" type="text" maxlength="6" class="zc-rec-input zc-code-field" placeholder="123456" autocomplete="one-time-code" spellcheck="false" />
                        <div id="zc-rec-error-2" class="zc-rec-error" style="display: none;"></div>
                    </div>
                </div>

                <div class="zc-rec-actions">
                    <div id="zc-footer-step-1" class="zc-footer-row">
                        <button id="zc-rec-cancel-btn" class="zc-rec-btn-cancel" type="button">Cancel</button>
                        <button id="zc-rec-send-btn" class="zc-rec-btn-primary" type="button">Send Verification Code</button>
                    </div>
                    <div id="zc-footer-step-2" class="zc-footer-row" style="display: none;">
                        <button id="zc-rec-back-btn" class="zc-rec-btn-cancel" type="button">Back</button>
                        <button id="zc-rec-verify-btn" class="zc-rec-btn-primary" type="button">Confirm & Link Email</button>
                    </div>
                </div>
            </div>
        `;

        const mountTarget = document.getElementById("app-mount") || document.body;
        mountTarget.appendChild(backdrop);

        const closeBtn = document.getElementById("zc-modal-close-btn");
        const modalTitle = document.getElementById("zc-rec-modal-title");
        const modalDesc = document.getElementById("zc-rec-modal-desc");
        const emailInput = document.getElementById("zc-rec-email-input");
        const sendBtn = document.getElementById("zc-rec-send-btn");
        const cancelBtn = document.getElementById("zc-rec-cancel-btn");
        const err1 = document.getElementById("zc-rec-error-1");

        const step1 = document.getElementById("zc-step-1");
        const step2 = document.getElementById("zc-step-2");
        const footer1 = document.getElementById("zc-footer-step-1");
        const footer2 = document.getElementById("zc-footer-step-2");

        const codeInput = document.getElementById("zc-rec-code-input");
        const verifyBtn = document.getElementById("zc-rec-verify-btn");
        const backBtn = document.getElementById("zc-rec-back-btn");
        const err2 = document.getElementById("zc-rec-error-2");

        let targetEmail = "";

        // Temporarily pause any active react-focus-lock
        const disabledLocks = [];
        document.querySelectorAll('[data-focus-lock-disabled="false"]').forEach((el) => {
            el.setAttribute("data-focus-lock-disabled", "true");
            disabledLocks.push(el);
        });

        // Intercept focusin and key events in capture phase so Discord cannot steal focus
        const interceptFocus = (e) => {
            if (backdrop && backdrop.contains(e.target)) {
                e.stopImmediatePropagation();
            }
        };
        window.addEventListener("focusin", interceptFocus, true);
        document.addEventListener("focusin", interceptFocus, true);
        window.addEventListener("focus", interceptFocus, true);
        document.addEventListener("focus", interceptFocus, true);

        const interceptKey = (e) => {
            if (document.activeElement === emailInput || document.activeElement === codeInput) {
                if (e.key !== "Escape") {
                    e.stopImmediatePropagation();
                }
            }
        };
        window.addEventListener("keydown", interceptKey, true);
        window.addEventListener("keyup", interceptKey, true);
        window.addEventListener("keypress", interceptKey, true);

        const onGlobalKey = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            }
        };
        window.addEventListener("keydown", onGlobalKey, true);

        const closeModal = () => {
            window.removeEventListener("focusin", interceptFocus, true);
            document.removeEventListener("focusin", interceptFocus, true);
            window.removeEventListener("focus", interceptFocus, true);
            document.removeEventListener("focus", interceptFocus, true);
            window.removeEventListener("keydown", interceptKey, true);
            window.removeEventListener("keyup", interceptKey, true);
            window.removeEventListener("keypress", interceptKey, true);
            window.removeEventListener("keydown", onGlobalKey, true);
            disabledLocks.forEach((el) => el.setAttribute("data-focus-lock-disabled", "false"));

            backdrop.classList.add("zc-rec-closing");
            setTimeout(() => {
                backdrop.remove();
            }, 120);
        };

        const setupInput = (input) => {
            if (!input) return;
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (input === emailInput) sendBtn.click();
                    if (input === codeInput) verifyBtn.click();
                } else if (e.key !== "Escape") {
                    e.stopImmediatePropagation();
                }
            });
            input.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
            input.addEventListener("click", (e) => {
                e.stopPropagation();
                input.focus();
            });
        };

        setupInput(emailInput);
        setupInput(codeInput);

        // Close button handlers (only close on X, Cancel, or ESC - NEVER on empty space)
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        };
        closeBtn.onmousedown = (e) => e.stopPropagation();

        cancelBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        };
        cancelBtn.onmousedown = (e) => e.stopPropagation();

        // Prevent accidental closing when clicking or moving in empty space
        backdrop.onmousedown = (e) => e.stopPropagation();
        backdrop.onmouseup = (e) => e.stopPropagation();
        backdrop.onclick = (e) => e.stopPropagation();

        // Focus input after modal mounts
        setTimeout(() => {
            emailInput?.focus();
            emailInput?.select?.();
        }, 50);

        backBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            step2.style.display = "none";
            footer2.style.display = "none";
            step1.style.display = "block";
            footer1.style.display = "flex";
            err1.style.display = "none";
            modalTitle.innerText = "Backup / Recovery Email";
            modalDesc.innerText = "Enter a backup email address (such as Gmail) to protect your account and recover access if you ever lose your primary email or forget your password.";
            setTimeout(() => emailInput?.focus(), 50);
        };

        sendBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const email = (emailInput.value || "").trim();
            if (!email || !email.includes("@")) {
                err1.innerText = "Please enter a valid email address.";
                err1.style.display = "block";
                return;
            }
            sendBtn.disabled = true;
            sendBtn.innerText = "Sending code...";
            err1.style.display = "none";

            try {
                const res = await fetch("/api/v9/users/@me/recovery-email/send-code", {
                    method: "POST",
                    headers: { authorization: token, "content-type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    const msg = data.email?.message || data.message || "Failed to send verification code. Please check your address and try again.";
                    err1.innerText = msg;
                    err1.style.display = "block";
                    sendBtn.disabled = false;
                    sendBtn.innerText = "Send Verification Code";
                    return;
                }

                targetEmail = email;
                step1.style.display = "none";
                footer1.style.display = "none";
                step2.style.display = "block";
                footer2.style.display = "flex";
                modalTitle.innerText = "Verify Backup Email";
                modalDesc.innerText = "Enter the 6-digit verification code sent to your backup email.";
                setTimeout(() => codeInput?.focus(), 50);
            } catch (err) {
                err1.innerText = "Connection error. Unable to reach the server.";
                err1.style.display = "block";
                sendBtn.disabled = false;
                sendBtn.innerText = "Send Verification Code";
            }
        };

        verifyBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const code = (codeInput.value || "").trim();
            if (!code || code.length < 6) {
                err2.innerText = "Please enter the 6-digit verification code.";
                err2.style.display = "block";
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.innerText = "Verifying...";
            err2.style.display = "none";

            try {
                const res = await fetch("/api/v9/users/@me/recovery-email/verify", {
                    method: "POST",
                    headers: { authorization: token, "content-type": "application/json" },
                    body: JSON.stringify({ email: targetEmail, code }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    const msg = data.code?.message || data.message || "Invalid or expired verification code.";
                    err2.innerText = msg;
                    err2.style.display = "block";
                    verifyBtn.disabled = false;
                    verifyBtn.innerText = "Confirm & Link Email";
                    return;
                }

                const result = await res.json();
                recoveryEmailData = { recovery_email: result.recovery_email, has_recovery_email: true };
                closeModal();
                updateSettingsUI();
            } catch (err) {
                err2.innerText = "An error occurred during verification.";
                err2.style.display = "block";
                verifyBtn.disabled = false;
                verifyBtn.innerText = "Confirm & Link Email";
            }
        };
    };

    // Helper: Find any native [ Edit ] button in Account Info to mirror exact classes & computed styles
    const findReferenceEditBtn = () => {
        const root = document.body || document.documentElement;
        if (!root) return null;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const val = (node.nodeValue || "").trim();
            if (val === "Username" || val === "Email") {
                let parent = node.parentElement;
                for (let i = 0; i < 6; i++) {
                    if (!parent || parent === document.body) break;
                    const btn = parent.querySelector("button:last-of-type") || parent.querySelector("button");
                    if (btn && (btn.innerText || "").trim().toLowerCase() === "edit") {
                        return btn;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return null;
    };

    // Helper: Style action button to 100% pixel-perfect Discord secondary button, matching [ Edit ]
    const styleActionButton = (btn) => {
        btn.classList.add("zc-rec-row-btn");
        const refBtn = findReferenceEditBtn();
        if (refBtn) {
            btn.className = refBtn.className + " zc-rec-row-btn";
            const computed = window.getComputedStyle(refBtn);
            const w = 112;
            const h = 38;

            btn.style.setProperty("width", `${w}px`, "important");
            btn.style.setProperty("min-width", `${w}px`, "important");
            btn.style.setProperty("height", `${h}px`, "important");
            btn.style.setProperty("min-height", `${h}px`, "important");
            btn.style.setProperty("border-radius", computed.borderRadius || "8px", "important");
            btn.style.setProperty("background-color", computed.backgroundColor || "#4e5058", "important");
            btn.style.setProperty("color", computed.color || "#ffffff", "important");
            btn.style.setProperty("font-family", computed.fontFamily, "important");
            btn.style.setProperty("font-size", computed.fontSize || "14px", "important");
            btn.style.setProperty("font-weight", computed.fontWeight || "500", "important");
            btn.style.setProperty("line-height", computed.lineHeight || "16px", "important");
            btn.style.setProperty("padding", "0 24px", "important");
            btn.style.setProperty("border", "none", "important");
            btn.style.setProperty("box-shadow", "none", "important");
        } else {
            btn.style.setProperty("width", "112px", "important");
            btn.style.setProperty("min-width", "112px", "important");
            btn.style.setProperty("height", "38px", "important");
            btn.style.setProperty("min-height", "38px", "important");
            btn.style.setProperty("border-radius", "8px", "important");
            btn.style.setProperty("background-color", "#4e5058", "important");
            btn.style.setProperty("color", "#ffffff", "important");
            btn.style.setProperty("padding", "0 24px", "important");
            btn.style.setProperty("font-size", "14px", "important");
            btn.style.setProperty("font-weight", "500", "important");
            btn.style.setProperty("border", "none", "important");
        }
        btn.style.setProperty("cursor", "pointer", "important");
        btn.style.setProperty("display", "inline-flex", "important");
        btn.style.setProperty("align-items", "center", "important");
        btn.style.justifyContent = "center";
        btn.style.boxSizing = "border-box";
        btn.style.marginLeft = "auto";
        btn.onmouseenter = () => {
            btn.style.filter = "brightness(1.18)";
        };
        btn.onmouseleave = () => {
            btn.style.filter = "none";
        };
    };

    // 1. Transform Discord's native Phone row into Recovery Email row
    const transformNativePhoneRow = () => {
        const root = document.body || document.documentElement;
        if (!root) return false;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const val = (node.nodeValue || "").trim();
            if (val === "Phone Number") {
                let parent = node.parentElement;
                for (let i = 0; i < 6; i++) {
                    if (!parent || parent === document.body) break;
                    const btn = parent.querySelector("button");
                    if (btn && (parent.innerText.includes("Phone Number") || parent.innerText.includes("phone number"))) {
                        parent.id = "zycord-recovery-email-row";
                        parent.setAttribute("data-zycord-recovery", "true");
                        parent.style.removeProperty("display");

                        // 1. Rename title label to "Recovery Email"
                        node.nodeValue = "Recovery Email";

                        // 2. Update value text
                        const emailText = recoveryEmailData?.has_recovery_email
                            ? recoveryEmailData.recovery_email
                            : "No recovery email linked";

                        const valWalker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
                        let vNode;
                        while ((vNode = valWalker.nextNode())) {
                            const vVal = (vNode.nodeValue || "").trim();
                            if (vVal.includes("haven't added") || vVal === "No recovery email linked" || vVal.includes("@")) {
                                vNode.nodeValue = emailText;
                                if (vNode.parentElement) {
                                    vNode.parentElement.style.color = recoveryEmailData?.has_recovery_email ? "var(--text-normal, #dbdee1)" : "var(--text-muted, #949ba4)";
                                }
                                break;
                            }
                        }

                        // 3. Update action button
                        btn.innerText = recoveryEmailData?.has_recovery_email ? "Edit" : "Add";
                        styleActionButton(btn);
                        btn.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openRecoveryModal();
                        };
                        return true;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return false;
    };

    // 2. Update already transformed Recovery Email row
    const updateExistingRecoveryRow = () => {
        const row = document.getElementById("zycord-recovery-email-row");
        if (!row) return false;
        row.style.removeProperty("display");
        const emailText = recoveryEmailData?.has_recovery_email
            ? recoveryEmailData.recovery_email
            : "No recovery email linked";

        const valWalker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
        let vNode;
        while ((vNode = valWalker.nextNode())) {
            const vVal = (vNode.nodeValue || "").trim();
            if (vVal.includes("haven't added") || vVal === "No recovery email linked" || vVal.includes("@")) {
                vNode.nodeValue = emailText;
                if (vNode.parentElement) {
                    vNode.parentElement.style.color = recoveryEmailData?.has_recovery_email ? "var(--text-normal, #dbdee1)" : "var(--text-muted, #949ba4)";
                }
                break;
            }
        }

        const btn = row.querySelector("button");
        if (btn) {
            btn.innerText = recoveryEmailData?.has_recovery_email ? "Edit" : "Add";
            styleActionButton(btn);
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openRecoveryModal();
            };
        }
        return true;
    };

    // 3. Find Email row for fallback cloning
    const findEmailRow = () => {
        const root = document.body || document.documentElement;
        if (!root) return null;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const val = (node.nodeValue || "").trim();
            if (val === "Email") {
                let parent = node.parentElement;
                for (let i = 0; i < 6; i++) {
                    if (!parent || parent === document.body) break;
                    if (parent.querySelector("button") && parent.innerText.includes("@")) {
                        return parent;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return null;
    };

    // 4. Fallback clone
    const cloneEmailRow = () => {
        const emailRow = findEmailRow();
        if (!emailRow || !emailRow.parentElement) return false;

        let recoveryRow = document.getElementById("zycord-recovery-email-row");
        if (!recoveryRow) {
            recoveryRow = emailRow.cloneNode(true);
            recoveryRow.id = "zycord-recovery-email-row";
            recoveryRow.setAttribute("data-zycord-recovery", "true");
            emailRow.parentElement.insertBefore(recoveryRow, emailRow.nextSibling);
        }

        const emailText = recoveryEmailData?.has_recovery_email
            ? recoveryEmailData.recovery_email
            : "No recovery email linked";

        // 1. Rename title label to "Recovery Email"
        const walker = document.createTreeWalker(recoveryRow, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if ((node.nodeValue || "").trim() === "Email") {
                node.nodeValue = "Recovery Email";
                break;
            }
        }

        // 2. Remove any "Reveal" button
        Array.from(recoveryRow.querySelectorAll("button")).forEach((b) => {
            if ((b.innerText || "").toLowerCase().includes("reveal")) {
                b.remove();
            }
        });

        // 3. Update value text
        const textWalker = document.createTreeWalker(recoveryRow, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = textWalker.nextNode())) {
            const val = (textNode.nodeValue || "").trim();
            if (val.includes("@") || val === "No recovery email linked") {
                textNode.nodeValue = emailText;
                if (textNode.parentElement) {
                    textNode.parentElement.style.color = recoveryEmailData?.has_recovery_email ? "var(--text-normal, #dbdee1)" : "var(--text-muted, #949ba4)";
                }
                break;
            }
        }

        // 4. Update or create action button
        let actionBtn = recoveryRow.querySelector("button:last-of-type") || recoveryRow.querySelector("button");
        if (!actionBtn) {
            actionBtn = document.createElement("button");
            recoveryRow.appendChild(actionBtn);
        }
        actionBtn.innerText = recoveryEmailData?.has_recovery_email ? "Edit" : "Add";
        styleActionButton(actionBtn);
        actionBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openRecoveryModal();
        };
        return true;
    };

    const updateSettingsUI = () => {
        if (updateExistingRecoveryRow()) return;
        if (transformNativePhoneRow()) return;
        cloneEmailRow();
    };

    // Inject Discord-native modal and button styles
    const style = document.createElement("style");
    style.id = "zycord-recovery-styles";
    style.textContent = `
        .zc-rec-row-btn {
            border-radius: 8px !important;
            height: 38px !important;
            min-height: 38px !important;
            width: 112px !important;
            min-width: 112px !important;
            padding: 0 24px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            font-family: inherit !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            border: none !important;
            margin-left: auto !important;
            transition: filter 0.15s ease, background-color 0.15s ease !important;
        }
        .zc-rec-row-btn:hover {
            filter: brightness(1.18) !important;
        }
        .zc-rec-backdrop {
            position: fixed;
            inset: 0;
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            font-family: var(--font-primary, "gg sans", "Noto Sans", sans-serif);
            animation: zc-backdrop-in 140ms ease-out forwards;
            pointer-events: auto;
        }
        .zc-rec-backdrop.zc-rec-closing {
            animation: zc-backdrop-out 120ms ease-in forwards;
        }
        .zc-rec-modal {
            position: relative;
            width: min(480px, calc(100vw - 32px));
            box-sizing: border-box;
            background-color: #313338 !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.05);
            padding: 28px 24px 24px 24px;
            overflow: hidden;
            text-align: left;
            direction: ltr;
            display: flex;
            flex-direction: column;
            color: #dbdee1;
            pointer-events: auto;
            transform-origin: center center;
            animation: zc-modal-in 140ms cubic-bezier(0.18, 0.89, 0.32, 1.15) forwards;
        }
        .zc-rec-backdrop.zc-rec-closing .zc-rec-modal {
            animation: zc-modal-out 120ms ease-in forwards;
        }
        .zc-modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: transparent;
            border: none;
            color: #949ba4;
            cursor: pointer;
            padding: 4px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: color 0.15s ease, background-color 0.15s ease;
            z-index: 20;
            pointer-events: auto;
        }
        .zc-modal-close:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.08);
        }
        .zc-rec-header {
            margin-bottom: 20px;
            padding-right: 36px;
        }
        .zc-rec-title {
            margin: 0 0 8px;
            font-size: 24px;
            font-weight: 700;
            line-height: 28px;
            color: #f2f3f5;
        }
        .zc-rec-desc {
            margin: 0;
            font-size: 14px;
            line-height: 20px;
            color: #b5bac1;
        }
        .zc-rec-body {
            display: flex;
            flex-direction: column;
        }
        .zc-rec-label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;
            color: #b5bac1;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }
        .zc-rec-input {
            width: 100%;
            box-sizing: border-box;
            height: 44px;
            padding: 0 14px;
            border-radius: 6px;
            background-color: #1e1f22 !important;
            border: 1px solid rgba(0, 0, 0, 0.3) !important;
            color: #dbdee1 !important;
            font-size: 16px !important;
            font-family: inherit !important;
            outline: none !important;
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            cursor: text !important;
            transition: border-color 0.15s ease !important;
        }
        .zc-rec-input:hover {
            border-color: #000000 !important;
        }
        .zc-rec-input:focus {
            border-color: #5865f2 !important;
            outline: 2px solid #5865f2 !important;
            outline-offset: -2px !important;
        }
        .zc-rec-input::placeholder {
            color: #6d737b !important;
        }
        .zc-rec-sub-hint {
            margin: 8px 0 0;
            font-size: 12px;
            line-height: 16px;
            color: #949ba4;
        }
        .zc-code-field {
            letter-spacing: 6px;
            font-weight: 700;
            text-align: center;
            font-size: 20px !important;
        }
        .zc-rec-error {
            margin-top: 8px;
            font-size: 13px;
            color: #f23f43;
        }
        .zc-rec-actions {
            margin-top: 28px;
            width: 100%;
        }
        .zc-footer-row {
            display: flex;
            align-items: center;
            gap: 16px;
            width: 100%;
        }
        .zc-rec-btn-cancel {
            flex: 1;
            height: 44px;
            min-height: 44px;
            border-radius: 6px;
            background-color: #4e5058 !important;
            color: #ffffff !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            font-family: inherit !important;
            border: none !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            transition: background-color 0.17s ease !important;
        }
        .zc-rec-btn-cancel:hover {
            background-color: #6d6f78 !important;
        }
        .zc-rec-btn-cancel:active {
            background-color: #80848e !important;
        }
        .zc-rec-btn-primary {
            flex: 1;
            height: 44px;
            min-height: 44px;
            border-radius: 6px;
            background-color: #5865f2 !important;
            color: #ffffff !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            font-family: inherit !important;
            border: none !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            transition: background-color 0.17s ease !important;
        }
        .zc-rec-btn-primary:hover {
            background-color: #4752c4 !important;
        }
        .zc-rec-btn-primary:active {
            background-color: #3c45a5 !important;
        }
        .zc-rec-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        @keyframes zc-backdrop-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes zc-backdrop-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes zc-modal-in {
            from {
                opacity: 0;
                transform: scale(0.92);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes zc-modal-out {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.94);
            }
        }
    `;
    document.head.appendChild(style);

    const loop = () => {
        if (location.pathname.includes("/channels/@me") || location.pathname.includes("/channels/")) {
            fetchRecoveryEmail();
            updateSettingsUI();
        }
    };

    setInterval(loop, 300);
})();