(() => {
    // 86-recovery-email.js: Backup / Recovery Email feature in Zycord User Settings
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

        // Remove existing modal if any
        document.getElementById("zycord-recovery-modal-backdrop")?.remove();

        const backdrop = document.createElement("div");
        backdrop.id = "zycord-recovery-modal-backdrop";
        backdrop.innerHTML = `
            <div class="zc-rec-backdrop">
                <div class="zc-rec-modal">
                    <div class="zc-rec-header">
                        <h2 class="zc-rec-title">Backup / Recovery Email</h2>
                        <p class="zc-rec-desc">
                            Add a backup email address (such as Gmail) to protect your account and recover access if you ever lose your primary email or forget your password.
                        </p>
                    </div>

                    <div id="zc-rec-body" class="zc-rec-body">
                        <div id="zc-step-1">
                            <label class="zc-rec-label">Backup Email Address</label>
                            <input id="zc-rec-email-input" type="email" class="zc-rec-input" placeholder="name@gmail.com" />
                            <div id="zc-rec-error-1" class="zc-rec-error" style="display: none;"></div>
                            <div class="zc-rec-actions">
                                <button id="zc-rec-cancel-btn" class="zc-rec-btn zc-rec-btn-secondary">Cancel</button>
                                <button id="zc-rec-send-btn" class="zc-rec-btn zc-rec-btn-primary">Send Verification Code</button>
                            </div>
                        </div>

                        <div id="zc-step-2" style="display: none;">
                            <p class="zc-rec-desc" style="color: #23a55a; margin-bottom: 14px;">
                                A 6-digit verification code has been sent to your backup email! Please check your inbox or spam folder.
                            </p>
                            <label class="zc-rec-label">Verification Code</label>
                            <input id="zc-rec-code-input" type="text" maxlength="6" class="zc-rec-input" placeholder="123456" style="letter-spacing: 4px; font-weight: 700; text-align: center; font-size: 20px;" />
                            <div id="zc-rec-error-2" class="zc-rec-error" style="display: none;"></div>
                            <div class="zc-rec-actions">
                                <button id="zc-rec-back-btn" class="zc-rec-btn zc-rec-btn-secondary">Back</button>
                                <button id="zc-rec-verify-btn" class="zc-rec-btn zc-rec-btn-primary">Confirm & Link Email</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        const emailInput = document.getElementById("zc-rec-email-input");
        const sendBtn = document.getElementById("zc-rec-send-btn");
        const cancelBtn = document.getElementById("zc-rec-cancel-btn");
        const err1 = document.getElementById("zc-rec-error-1");

        const step1 = document.getElementById("zc-step-1");
        const step2 = document.getElementById("zc-step-2");
        const codeInput = document.getElementById("zc-rec-code-input");
        const verifyBtn = document.getElementById("zc-rec-verify-btn");
        const backBtn = document.getElementById("zc-rec-back-btn");
        const err2 = document.getElementById("zc-rec-error-2");

        let targetEmail = "";

        cancelBtn.onclick = () => backdrop.remove();
        backdrop.onclick = (e) => {
            if (e.target.classList.contains("zc-rec-backdrop")) backdrop.remove();
        };

        backBtn.onclick = () => {
            step2.style.display = "none";
            step1.style.display = "block";
            err1.style.display = "none";
        };

        sendBtn.onclick = async () => {
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
                step2.style.display = "block";
                codeInput.focus();
            } catch (err) {
                err1.innerText = "Connection error. Unable to reach the server.";
                err1.style.display = "block";
                sendBtn.disabled = false;
                sendBtn.innerText = "Send Verification Code";
            }
        };

        verifyBtn.onclick = async () => {
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
                backdrop.remove();
                updateSettingsUI();
            } catch (err) {
                err2.innerText = "An error occurred during verification.";
                err2.style.display = "block";
                verifyBtn.disabled = false;
                verifyBtn.innerText = "Confirm & Link Email";
            }
        };
    };

    const updateSettingsUI = () => {
        // Look for the account profile card field list
        const fields = document.querySelectorAll('div[class*="field_"]');
        if (!fields.length) return;

        let emailField = null;
        fields.forEach((f) => {
            const txt = (f.innerText || "").toLowerCase();
            if (txt.includes("email")) {
                emailField = f;
            }
        });

        if (!emailField || !emailField.parentElement) return;

        // Check if we already injected our recovery row
        let recoveryRow = document.getElementById("zycord-recovery-email-row");
        if (!recoveryRow) {
            recoveryRow = document.createElement("div");
            recoveryRow.id = "zycord-recovery-email-row";
            recoveryRow.className = emailField.className;
            recoveryRow.style.marginTop = "8px";
            emailField.parentElement.insertBefore(recoveryRow, emailField.nextSibling);
        }

        const emailText = recoveryEmailData?.has_recovery_email
            ? recoveryEmailData.recovery_email
            : "No recovery email linked";

        const btnText = recoveryEmailData?.has_recovery_email ? "Edit" : "Add";

        recoveryRow.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 4px 0;">
                <div>
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #b5bac1; margin-bottom: 4px; letter-spacing: 0.5px;">
                        RECOVERY EMAIL
                    </div>
                    <div style="font-size: 14px; color: ${recoveryEmailData?.has_recovery_email ? "#f2f3f5" : "#949ba4"}; font-weight: 500;">
                        ${emailText}
                    </div>
                </div>
                <button id="zc-rec-open-btn" style="background: #4e5058; color: #fff; border: 0; padding: 6px 14px; border-radius: 4px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s ease;">
                    ${btnText}
                </button>
            </div>
        `;

        document.getElementById("zc-rec-open-btn").onclick = openRecoveryModal;
    };

    // Inject styles for the modal
    const style = document.createElement("style");
    style.id = "zycord-recovery-styles";
    style.textContent = `
        .zc-rec-backdrop {
            position: fixed;
            inset: 0;
            z-index: 10002;
            display: grid;
            place-items: center;
            background: rgba(0, 0, 0, 0.75);
            font-family: var(--font-primary, "gg sans", "Noto Sans", sans-serif);
            animation: zc-fade 150ms ease-out;
        }
        .zc-rec-modal {
            width: min(460px, calc(100vw - 32px));
            box-sizing: border-box;
            padding: 24px;
            border-radius: 12px;
            background: #2b2d31;
            color: #dbdee1;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 12px 28px rgba(0,0,0,0.35);
            text-align: left;
            direction: ltr;
        }
        .zc-rec-title {
            margin: 0 0 8px;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }
        .zc-rec-desc {
            margin: 0 0 16px;
            font-size: 14px;
            line-height: 20px;
            color: #949ba4;
        }
        .zc-rec-label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #b5bac1;
        }
        .zc-rec-input {
            width: 100%;
            box-sizing: border-box;
            height: 42px;
            padding: 0 12px;
            border-radius: 6px;
            background: #1e1f22;
            border: 1px solid #35363c;
            color: #ffffff;
            font-size: 15px;
            outline: none;
            transition: border-color 0.15s ease;
        }
        .zc-rec-input:focus {
            border-color: #5865f2;
        }
        .zc-rec-error {
            margin-top: 8px;
            font-size: 13px;
            color: #fa777c;
        }
        .zc-rec-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            justify-content: flex-end;
        }
        .zc-rec-btn {
            height: 38px;
            padding: 0 16px;
            border: 0;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.15s ease;
        }
        .zc-rec-btn:hover {
            opacity: 0.9;
        }
        .zc-rec-btn-primary {
            background: #5865f2;
            color: #ffffff;
        }
        .zc-rec-btn-secondary {
            background: transparent;
            color: #ffffff;
        }
        @keyframes zc-fade {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Monitor for settings page appearance
    const loop = () => {
        if (location.pathname.includes("/channels/@me") || location.pathname.includes("/channels/")) {
            fetchRecoveryEmail();
            updateSettingsUI();
        }
    };

    setInterval(loop, 1500);
})();
