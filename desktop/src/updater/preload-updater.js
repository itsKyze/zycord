const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("updater", {
    onState: (callback) => {
        const handler = (event, data) => callback(data);
        ipcRenderer.on("updater:state", handler);
        return () => ipcRenderer.removeListener("updater:state", handler);
    },
    onRetryTick: (callback) => {
        const handler = (event, data) => callback(data);
        ipcRenderer.on("updater:retry-tick", handler);
        return () => ipcRenderer.removeListener("updater:retry-tick", handler);
    },
    retryNow: () => {
        ipcRenderer.send("updater:retry-now");
    },
    close: () => {
        ipcRenderer.send("updater:close");
    },
});
