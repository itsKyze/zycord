// Updater UI Renderer Controller
(function () {
    "use strict";

    const logoStage = document.getElementById("logo-stage");
    const statusPrimary = document.getElementById("status-primary");
    const statusSecondary = document.getElementById("status-secondary");
    const progressWrapper = document.getElementById("progress-wrapper");
    const progressFill = document.getElementById("progress-fill");
    const actionWrapper = document.getElementById("action-wrapper");
    const btnRetry = document.getElementById("btn-retry");

    // Format bytes helper
    function formatBytes(bytes) {
        if (!bytes || bytes <= 0) return "";
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    }

    // Set text with subtle fade transition
    function updateText(primary, secondary = "") {
        if (statusPrimary.textContent === primary && statusSecondary.textContent === secondary) return;

        statusPrimary.classList.add("fade-out");
        setTimeout(() => {
            statusPrimary.textContent = primary;
            statusPrimary.classList.remove("fade-out");
            statusPrimary.classList.add("fade-in");
        }, 100);

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

        actionWrapper.hidden = true;

        switch (state) {
            case "STARTING":
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText(message || "Starting...");
                break;

            case "CHECKING":
            case "RETRYING":
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText("Checking for updates...");
                break;

            case "NO_UPDATE":
                logoStage.className = "logo-stage idle";
                progressWrapper.classList.remove("visible");
                updateText("Starting...");
                break;

            case "UPDATE_AVAILABLE":
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText("Update available");
                break;

            case "DOWNLOADING": {
                logoStage.className = "logo-stage";
                progressWrapper.classList.add("visible");

                const currentPercent = typeof percent === "number" ? Math.min(100, Math.max(0, percent)) : 0;
                progressFill.style.width = `${currentPercent}%`;

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
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText("Verifying update...");
                break;

            case "INSTALLING":
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText("Installing update...");
                break;

            case "COMPLETED":
                logoStage.className = "logo-stage";
                progressWrapper.classList.remove("visible");
                updateText("Restarting...");
                break;

            case "ERROR":
                logoStage.className = "logo-stage error";
                progressWrapper.classList.remove("visible");

                if (isPermanent) {
                    updateText("Update failed", "Please try again later.");
                    actionWrapper.hidden = false;
                } else {
                    const countdown = retryIn != null ? retryIn : 10;
                    updateText(`Update failed — retrying in ${countdown} sec...`);
                }
                break;

            default:
                break;
        }
    }

    // Bind IPC listeners
    if (window.updater) {
        window.updater.onState(handleState);

        window.updater.onRetryTick(({ retryIn, message }) => {
            statusPrimary.textContent = message || `Update failed — retrying in ${retryIn} sec...`;
        });

        btnRetry?.addEventListener("click", () => {
            window.updater.retryNow();
        });
    }
})();
