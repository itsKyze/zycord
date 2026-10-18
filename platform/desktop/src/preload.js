/**
 * Zycord Desktop Preload Script
 * Exposes safe ZycordNative & DiscordNative compatibility APIs to the web application
 */
const { contextBridge, ipcRenderer } = require("electron");
const { IPCEvents } = require("./core/modules/ipc_events");

const ZycordNative = {
    isElectron: true,
    platform: process.platform,
    appName: "Zycord",
    domain: "app.zyron.site",

    window: {
        minimize: () => ipcRenderer.invoke(IPCEvents.WINDOW_MINIMIZE),
        maximize: () => ipcRenderer.invoke(IPCEvents.WINDOW_MAXIMIZE),
        close: () => ipcRenderer.invoke(IPCEvents.WINDOW_CLOSE),
        setAlwaysOnTop: (enabled) => ipcRenderer.invoke(IPCEvents.WINDOW_SET_ALWAYS_ON_TOP, enabled),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
    },

    safeStorage: {
        isEncryptionAvailable: () => ipcRenderer.sendSync(IPCEvents.SAFE_STORAGE_IS_ENCRYPTION_AVAILABLE),
        encryptString: (plainText) => ipcRenderer.sendSync(IPCEvents.SAFE_STORAGE_ENCRYPT_STRING, plainText),
        decryptString: (encrypted) => ipcRenderer.sendSync(IPCEvents.SAFE_STORAGE_DECRYPT_STRING, encrypted),
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
    },
};

try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
    contextBridge.exposeInMainWorld("DiscordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
    window.DiscordNative = ZycordNative;
}
