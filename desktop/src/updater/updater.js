// Updater UI Renderer State Machine
(function () {
    "use strict";

    const logoContainer = document.getElementById("logo-container");
    const statusPrimary = document.getElementById("status-primary");
    const statusSecondary = document.getElementById("status-secondary");
    const progressWrapper = document.getElementById("progress-wrapper");
    const progressFill = document.getElementById("progress-fill");
    const actionWrapper = document.getElementById("action-wrapper");
    const btnRetry = document.getElementById("btn-retry");

    // Format Bytes helper
    function formatBytes(bytes) {
        if (!bytes || bytes <= 0) return "";
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    }

    // Set Text with subtle fade transition
    function updateText(primary, secondary = "") {
        if (statusPrimary.textContent === primary && statusSecondary.textContent === secondary) return;

        statusPrimary.classList.add("fade-out");
        setTimeout(() => {
            statusPrimary.textContent = primary;
            statusPrimary.classList.remove("fade-out");
            statusPrimary.classList.add("fade-in");
        }, 120);

        if (secondary) {
            statusSecondary.textContent = secondary;
            statusSecondary.classList.add("visible");
        } else {
            statusSecondary.classList.remove("visible");
            statusSecondary.textContent = "";
        }
    }

    // State Handler
    function handleState(payload) {
        const { state, version, percent, transferred, total, message, retryIn, isPermanent } = payload;

        // Reset error / buttons by default
        statusPrimary.classList.remove("error");
        actionWrapper.hidden = true;

        switch (state) {
            case "STARTING":
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.remove("visible");
                updateText("Starting...");
                break;

            case "CHECKING":
            case "RETRYING":
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.remove("visible");
                updateText("Checking for updates...");
                break;

            case "NO_UPDATE":
                logoContainer.className = "logo-container";
                progressWrapper.classList.remove("visible");
                updateText("You're up to date.", version ? `Version ${version}` : "");
                break;

            case "UPDATE_AVAILABLE":
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.remove("visible");
                updateText("Update available", version ? `Version ${version}` : "");
                break;

            case "DOWNLOADING": {
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.add("visible");

                const currentPercent = typeof percent === "number" ? Math.min(100, Math.max(0, percent)) : 0;
                progressFill.style.width = `${currentPercent}%`;

                // Display download message
                let downloadText = "Downloading update...";
                if (currentPercent > 0) {
                    downloadText = `Downloading update — ${Math.round(currentPercent)}%`;
                }

                let secondaryText = "";
                if (transferred > 0 && total > 0) {
                    secondaryText = `${formatBytes(transferred)} / ${formatBytes(total)}`;
                }

                updateText(downloadText, secondaryText);
                break;
            }

            case "VERIFYING":
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.remove("visible");
                updateText("Verifying update...");
                break;

            case "INSTALLING":
                logoContainer.className = "logo-container animating";
                progressWrapper.classList.remove("visible");
                updateText("Installing update...");
                break;

            case "COMPLETED":
                logoContainer.className = "logo-container";
                progressWrapper.classList.remove("visible");
                updateText("Restarting...");
                break;

            case "ERROR":
                logoContainer.className = "logo-container error";
                progressWrapper.classList.remove("visible");
                statusPrimary.classList.add("error");

                if (isPermanent) {
                    updateText("Update failed", "Please try again later.");
                    actionWrapper.hidden = false;
                } else {
                    const countdown = retryIn != null ? retryIn : 11;
                    updateText(`Update failed — retrying in ${countdown} sec...`);
                }
                break;

            default:
                break;
        }
    }

    // Real Retry Tick Listener
    if (window.updater) {
        window.updater.onState(handleState);

        window.updater.onRetryTick(({ retryIn, message }) => {
            statusPrimary.classList.add("error");
            statusPrimary.textContent = message || `Update failed — retrying in ${retryIn} sec...`;
        });

        btnRetry?.addEventListener("click", () => {
            window.updater.retryNow();
        });
    }
})();
