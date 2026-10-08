// Central Updater Configuration
const UpdaterConfig = {
    // Automatically check for updates on startup
    autoCheck: true,

    // Automatically begin download when update is found
    autoDownload: true,

    // Never trap the user: if update check fails, proceed into the app smoothly!
    fallbackToAppOnError: true,

    // Max number of automatic retries during active download before stopping
    maxRetries: 3,

    // Seconds to wait before each retry attempt
    retryDelay: 10,

    // Close updater window and launch main app when up to date
    closeWhenUpToDate: true,

    // Do NOT install automatically — show the green badge and let the user click to restart
    installAutomatically: false,

    // Timeout in milliseconds for update check
    checkTimeoutMs: 6000,

    // Window dimensions
    window: {
        width: 360,
        height: 300,
        backgroundColor: "#25282E",
    },
};

module.exports = UpdaterConfig;
