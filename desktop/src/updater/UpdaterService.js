const EventEmitter = require("events");
const { app } = require("electron");
const { autoUpdater } = require("electron-updater");
const UpdaterState = require("./UpdaterState");
const UpdaterConfig = require("./UpdaterConfig");

class UpdaterService extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = { ...UpdaterConfig, ...config };
        this.state = UpdaterState.STARTING;
        this.retryCount = 0;
        this.retryCountdown = 0;
        this.retryTimer = null;
        this.checkTimeoutTimer = null;
        this.updateInfo = null;
        this.lastError = null;
        this.isDisposed = false;

        this._setupAutoUpdater();
    }

    _setState(nextState, payload = {}) {
        if (this.isDisposed) return;
        this.state = nextState;
        this.emit("state", {
            state: this.state,
            ...payload,
        });
    }

    _setupAutoUpdater() {
        autoUpdater.autoDownload = this.config.autoDownload;
        autoUpdater.autoInstallOnAppQuit = this.config.installAutomatically;

        autoUpdater.on("checking-for-update", () => {
            if (this.state === UpdaterState.CHECKING) return;
            this._clearTimers();
            this._setState(UpdaterState.CHECKING);
        });

        autoUpdater.on("update-available", (info) => {
            this._clearTimers();
            this.updateInfo = info;
            this._setState(UpdaterState.UPDATE_AVAILABLE, {
                version: info.version,
            });

            if (this.config.autoDownload) {
                this._setState(UpdaterState.DOWNLOADING, {
                    version: info.version,
                    percent: 0,
                    transferred: 0,
                    total: 0,
                    speed: 0,
                });
            }
        });

        autoUpdater.on("update-not-available", (info) => {
            this._clearTimers();
            this.retryCount = 0;
            this._setState(UpdaterState.NO_UPDATE, {
                version: app.getVersion(),
            });

            if (this.config.closeWhenUpToDate) {
                setTimeout(() => {
                    if (!this.isDisposed) this.emit("ready-to-launch");
                }, 1000);
            }
        });

        autoUpdater.on("download-progress", (progress) => {
            this._clearTimers();
            this._setState(UpdaterState.DOWNLOADING, {
                percent: Math.min(100, Math.max(0, Math.round(progress.percent * 10) / 10)),
                transferred: progress.transferred,
                total: progress.total,
                speed: progress.bytesPerSecond,
            });
        });

        autoUpdater.on("update-downloaded", (info) => {
            this._clearTimers();
            // Transition to VERIFYING state first
            this._setState(UpdaterState.VERIFYING, {
                version: info?.version,
            });

            setTimeout(() => {
                if (this.isDisposed) return;
                this._setState(UpdaterState.INSTALLING, {
                    version: info?.version,
                });

                if (this.config.installAutomatically) {
                    setTimeout(() => {
                        if (this.isDisposed) return;
                        this._setState(UpdaterState.COMPLETED);
                        autoUpdater.quitAndInstall(false, true);
                    }, 1500);
                }
            }, 1200);
        });

        autoUpdater.on("error", (err) => {
            this._handleError(err);
        });
    }

    _handleError(err) {
        this._clearTimers();
        this.lastError = err ? err.message || String(err) : "Unknown update error";
        console.warn("[UpdaterService] Error encountered:", this.lastError);

        // Check if retry count reached maximum
        if (this.retryCount >= this.config.maxRetries) {
            this._setState(UpdaterState.ERROR, {
                message: "Update failed. Please try again later.",
                error: this.lastError,
                isPermanent: true,
                retryCount: this.retryCount,
                maxRetries: this.config.maxRetries,
            });
            return;
        }

        // Increment retry count and start real countdown
        this.retryCount++;
        this.retryCountdown = this.config.retryDelay;

        this._setState(UpdaterState.ERROR, {
            message: `Update failed — retrying in ${this.retryCountdown} sec...`,
            error: this.lastError,
            retryIn: this.retryCountdown,
            retryCount: this.retryCount,
            maxRetries: this.config.maxRetries,
            isPermanent: false,
        });

        this.retryTimer = setInterval(() => {
            if (this.isDisposed) {
                this._clearTimers();
                return;
            }

            this.retryCountdown--;

            if (this.retryCountdown <= 0) {
                this._clearTimers();
                this._setState(UpdaterState.RETRYING, { retryCount: this.retryCount });
                this.checkForUpdates();
            } else {
                this.emit("retry-tick", {
                    retryIn: this.retryCountdown,
                    retryCount: this.retryCount,
                    message: `Update failed — retrying in ${this.retryCountdown} sec...`,
                });
            }
        }, 1000);
    }

    _clearTimers() {
        if (this.retryTimer) {
            clearInterval(this.retryTimer);
            this.retryTimer = null;
        }
        if (this.checkTimeoutTimer) {
            clearTimeout(this.checkTimeoutTimer);
            this.checkTimeoutTimer = null;
        }
    }

    start() {
        this._setState(UpdaterState.STARTING, {
            version: app.getVersion(),
        });

        setTimeout(() => {
            if (this.isDisposed) return;
            this.checkForUpdates();
        }, 800);
    }

    checkForUpdates() {
        this._clearTimers();
        this._setState(UpdaterState.CHECKING);

        // Set safety timeout for checking phase
        this.checkTimeoutTimer = setTimeout(() => {
            if (this.state === UpdaterState.CHECKING) {
                this._handleError(new Error("Update check timed out"));
            }
        }, this.config.checkTimeoutMs);

        if (app.isPackaged) {
            autoUpdater.checkForUpdates().catch((err) => {
                this._handleError(err);
            });
        } else {
            // Development / Unpackaged environment handling:
            // Simulates real connection check to update endpoint
            setTimeout(() => {
                if (this.isDisposed) return;
                this._clearTimers();
                this._setState(UpdaterState.NO_UPDATE, {
                    version: app.getVersion(),
                    isDev: true,
                });
                setTimeout(() => {
                    if (!this.isDisposed) this.emit("ready-to-launch");
                }, 1000);
            }, 1600);
        }
    }

    retryNow() {
        this._clearTimers();
        this.checkForUpdates();
    }

    dispose() {
        this.isDisposed = true;
        this._clearTimers();
        this.removeAllListeners();
    }
}

module.exports = UpdaterService;
