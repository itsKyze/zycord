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
            this._setState(UpdaterState.STARTING, {
                message: "Starting...",
                version: app.getVersion(),
            });

            setTimeout(() => {
                if (!this.isDisposed) this.emit("ready-to-launch");
            }, 600);
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
                    }, 1200);
                }
            }, 1000);
        });

        autoUpdater.on("error", (err) => {
            this._handleError(err);
        });
    }

    _handleError(err) {
        this._clearTimers();
        this.lastError = err ? err.message || String(err) : "Unknown update error";
        console.warn("[UpdaterService] Notice:", this.lastError);

        // If error happened while in CHECKING phase:
        // Do NOT block the user on an error screen!
        // Show "Starting..." and seamlessly open the main application!
        if (this.state === UpdaterState.CHECKING || this.state === UpdaterState.STARTING) {
            console.log("[UpdaterService] Check skipped/no update release. Launching application...");
            this._setState(UpdaterState.STARTING, { message: "Starting..." });
            setTimeout(() => {
                if (!this.isDisposed) {
                    this.emit("ready-to-launch");
                }
            }, 700);
            return;
        }

        // If error happened during an ACTIVE download, then handle retry:
        if (this.retryCount >= this.config.maxRetries) {
            // After max retries during download, fallback to app
            if (this.config.fallbackToAppOnError) {
                console.log("[UpdaterService] Max retries reached during download. Launching application...");
                this._setState(UpdaterState.STARTING, { message: "Starting..." });
                setTimeout(() => {
                    if (!this.isDisposed) this.emit("ready-to-launch");
                }, 800);
            } else {
                this._setState(UpdaterState.ERROR, {
                    message: "Update failed. Please try again later.",
                    error: this.lastError,
                    isPermanent: true,
                });
            }
            return;
        }

        this.retryCount++;
        this.retryCountdown = this.config.retryDelay;

        this._setState(UpdaterState.ERROR, {
            message: `Update failed — retrying in ${this.retryCountdown} sec...`,
            error: this.lastError,
            retryIn: this.retryCountdown,
            retryCount: this.retryCount,
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
            message: "Starting...",
            version: app.getVersion(),
        });

        setTimeout(() => {
            if (this.isDisposed) return;
            this.checkForUpdates();
        }, 500);
    }

    checkForUpdates() {
        this._clearTimers();
        this._setState(UpdaterState.CHECKING);

        // Safety timeout for checking phase (e.g. 5 seconds)
        this.checkTimeoutTimer = setTimeout(() => {
            if (this.state === UpdaterState.CHECKING) {
                console.log("[UpdaterService] Check timeout. Launching application...");
                this._setState(UpdaterState.STARTING, { message: "Starting..." });
                setTimeout(() => {
                    if (!this.isDisposed) this.emit("ready-to-launch");
                }, 600);
            }
        }, this.config.checkTimeoutMs);

        if (app.isPackaged) {
            autoUpdater.checkForUpdates().catch((err) => {
                this._handleError(err);
            });
        } else {
            // Development mode: brief check simulation then launch app
            setTimeout(() => {
                if (this.isDisposed) return;
                this._clearTimers();
                this._setState(UpdaterState.STARTING, { message: "Starting..." });
                setTimeout(() => {
                    if (!this.isDisposed) this.emit("ready-to-launch");
                }, 600);
            }, 1200);
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
