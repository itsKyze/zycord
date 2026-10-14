// Strict state machine definition for updater lifecycle
const UpdaterState = Object.freeze({
    STARTING: "STARTING",
    CHECKING: "CHECKING",
    NO_UPDATE: "NO_UPDATE",
    UPDATE_AVAILABLE: "UPDATE_AVAILABLE",
    DOWNLOADING: "DOWNLOADING",
    VERIFYING: "VERIFYING",
    INSTALLING: "INSTALLING",
    COMPLETED: "COMPLETED",
    ERROR: "ERROR",
    RETRYING: "RETRYING",
});

module.exports = UpdaterState;
