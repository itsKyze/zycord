/**
 * Zycord Desktop Preload Script
 * Exposes safe ZycordNative APIs to the web application
 */
const { contextBridge, ipcRenderer } = require("electron");

const ZycordNative = {
    isElectron: true,
    platform: process.platform,
    appName: "Zycord",
    domain: "app.zyron.site",

    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.13",
        getBuildNumber: () => 13,
        relaunch: () => ipcRenderer.invoke("window-relaunch"),
    },

    window: {
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        close: () => ipcRenderer.invoke("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
    },
};

try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
}
