// Central Updater Configuration
const UpdaterConfig = {
    // Automatically check for updates on startup
    autoCheck: true,

    // Automatically begin download when update is found
    autoDownload: true,

    // Max number of automatic retries before requiring manual user action
    maxRetries: 5,

    // Seconds to wait before each retry attempt
    retryDelay: 11,

    // Close updater window when already on latest version
    closeWhenUpToDate: true,

    // Install immediately once update download is complete
    installAutomatically: true,

    // Timeout in milliseconds for update check
    checkTimeoutMs: 15000,

    // Window dimensions
    window: {
        width: 360,
        height: 300,
        backgroundColor: "#25282E",
    },
};

module.exports = UpdaterConfig;
