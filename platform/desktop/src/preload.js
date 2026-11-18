/**
 * Zycord Desktop Preload Script
 * 1:1 Discord Native Integration & Clean Window Frame
 */
const { contextBridge, ipcRenderer } = require("electron");

// Prevent any attempt to use ETF or Zstd WebSockets
if (typeof window !== "undefined") {
    const OrigWebSocket = window.WebSocket;
    if (OrigWebSocket) {
        const PatchedWebSocket = function (url, protocols) {
            if (typeof url === "string") {
                url = url.replace("encoding=etf", "encoding=json")
                         .replace("compress=zstd-stream", "compress=zlib-stream");
            }
            return new OrigWebSocket(url, protocols);
        };
        PatchedWebSocket.prototype = OrigWebSocket.prototype;
        Object.assign(PatchedWebSocket, OrigWebSocket);
        window.WebSocket = PatchedWebSocket;
    }
}

// Safe proxy to intercept ANY call without throwing
const createSafeProxy = (name = "") => {
    const fn = function () {
        return createSafeProxy(name);
    };
    return new Proxy(fn, {
        get: (_target, prop) => {
            if (prop === "then") return undefined;
            if (prop === Symbol.toPrimitive || prop === "toString") return () => `[SafeNativeProxy ${name}]`;
            if (prop === "length") return 0;
            if (prop === "hasPermission") return () => Promise.resolve(true);
            if (prop === "VoiceConnection") return function () {};
            return createSafeProxy(`${name}.${String(prop)}`);
        },
        apply: (_target, _thisArg, _argArray) => {
            return createSafeProxy(name);
        },
    });
};

const safeModuleProxy = createSafeProxy("discord_native_module");

// Auto-shim wrapper: if a property is not defined, returns a safe function/proxy rather than undefined
function wrapWithSafeProxy(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            if (prop in target) {
                const val = target[prop];
                if (val !== null && typeof val === "object" && !(val instanceof Promise) && !Array.isArray(val)) {
                    return wrapWithSafeProxy(val);
                }
                return val;
            }
            if (typeof prop === "symbol" || prop === "then" || prop === "inspect") return undefined;
            return createSafeProxy(String(prop));
        }
    });
}

const rawNative = {
    isElectron: true,
    platform: process.platform,
    appName: "Zycord",
    domain: "app.zyron.site",

    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.17",
        getBuildNumber: () => 17,
        getModuleVersions: () => ({}),
        relaunch: () => {
            console.log("[ZycordNative] Suppressed auto-relaunch watchdog call.");
        },
        getPreferredSystemLanguages: () => Promise.resolve(["en-US"]),
    },

    os: {
        arch: process.arch,
        appArch: process.arch,
        release: "6.6.0-generic",
        systemVersion: "Linux",
        buildRevision: 1,
    },

    process: {
        platform: process.platform,
        arch: process.arch,
        env: {
            LIBVA_DRIVER_NAME: "",
        },
    },

    window: {
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        close: () => ipcRenderer.invoke("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        setAlwaysOnTop: (enabled) => ipcRenderer.invoke("window-set-always-on-top", enabled),
        flashFrame: () => {},
        setBackgroundThrottling: () => {},
        setProgressBar: () => {},
        blur: () => {},
        focus: () => {},
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
        read: () => ipcRenderer.invoke("clipboard-paste"),
    },

    nativeModules: {
        canLoadNativeModules: false,
        hasUpdater: false,
        getMetadata: () => null,
        requireModule: (name) => {
            if (["discord_erlpack", "erlpack", "discord_zstd", "zstd"].includes(name)) {
                const err = new Error(`Cannot find module '${name}'`);
                err.code = "MODULE_NOT_FOUND";
                throw err;
            }
            if (name === "discord_voice") {
                return wrapWithSafeProxy({
                    VoiceConnection: function VoiceConnection() {
                        return createSafeProxy("VoiceConnection");
                    },
                    supported: true,
                    setDeviceChangeCallback: () => {},
                    getAudioSubsystemInfo: () => Promise.resolve({ audio_subsystem: "standard" }),
                    getSoundshareStatus: () => Promise.resolve(false),
                    getOutputDevices: () => Promise.resolve([]),
                    getInputDevices: () => Promise.resolve([]),
                    getVideoInputDevices: () => Promise.resolve([]),
                    setTransportOptions: () => {},
                });
            }
            return createSafeProxy(name);
        },
        ensureModule: (_name) => Promise.resolve(),
    },

    crashReporter: {
        getMetadata: () => ({
            wm: "Hyprland",
            distro: "CachyOS Linux",
            runtime_environment: "native",
            display_server: "wayland",
        }),
    },

    settings: {
        get: (_key, def) => Promise.resolve(def ?? null),
        set: () => Promise.resolve(),
    },

    fileManager: {
        getModulePath: () => "",
        showItemInFolder: () => {},
        openPath: () => {},
    },

    nativePermissions: {
        hasPermission: () => Promise.resolve(true),
        requestPermission: () => Promise.resolve(true),
        getPermissionState: () => Promise.resolve(true),
        openSettings: () => {},
    },

    voice: {
        supported: false,
        on: () => {},
        off: () => {},
        removeAllListeners: () => {},
        setTransportOptions: () => {},
        maybeDownloadOpenH264: () => Promise.resolve(),
    },

    gpuSettings: {
        getEnableHardwareAcceleration: () => true,
        setEnableHardwareAcceleration: () => {},
        setChromiumSwitches: () => {},
        getGPUSettings: () => Promise.resolve({}),
    },

    powerMonitor: {
        removeAllListeners: () => {},
        on: () => {},
        off: () => {},
        addListener: () => {},
        removeListener: () => {},
    },

    userDataCache: {
        cacheUserData: () => {},
        getCachedUserData: () => Promise.resolve(null),
    },

    features: {
        supports: () => false,
        declareSupported: () => {},
    },

    spellCheck: {
        getAvailableDictionaries: () => Promise.resolve([]),
        setSpellcheckLanguage: () => {},
    },

    safeStorage: {
        isEncryptionAvailable: () => false,
        encryptString: (str) => Promise.resolve(str),
        decryptString: (str) => Promise.resolve(str),
    },
};

const ZycordNative = wrapWithSafeProxy(rawNative);

try {
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
    contextBridge.exposeInMainWorld("DiscordNative", ZycordNative);
} catch (e) {
    window.ZycordNative = ZycordNative;
    window.DiscordNative = ZycordNative;
}

// Clean Discord Web Scrollbars, Remove Corrupt Notice Bar, Full Canvas
function applyDiscordUiFixes() {
    if (document.getElementById("zycord-scrollbar-fix")) return;

    const style = document.createElement("style");
    style.id = "zycord-scrollbar-fix";
    style.textContent = `
        /* Hide corrupt installation notice bar and danger notices */
        [class*="colorDanger"],
        [class*="notice"][class*="colorDanger"],
        [class*="notice_"][class*="colorDanger_"],
        [class*="notice__"][class*="colorDanger__"],
        [class*="notice-"][class*="colorDanger-"],
        [class*="noticeRegion"] [class*="colorDanger"] {
            display: none !important;
            height: 0 !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            overflow: hidden !important;
        }

        /* Discord style dark transparent scrollbars */
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background-color: transparent !important;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent !important;
            border: none !important;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(26, 27, 30, 0.8) !important;
            border-radius: 4px !important;
            border: 2px solid transparent !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(17, 18, 20, 1) !important;
        }
        ::-webkit-scrollbar-corner {
            background-color: transparent !important;
        }

        /* Full canvas Discord window */
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background-color: #1e1f22 !important;
            border: none !important;
            outline: none !important;
            overflow: hidden !important;
        }

        #app-mount {
            width: 100vw !important;
            height: 100vh !important;
        }
    `;

    document.head.appendChild(style);
}

function purgeCorruptBanner() {
    try {
        if (!document.body) return;
        const textNodes = document.evaluate(
            "//*[contains(text(), 'installation is corrupt') or contains(text(), \"Let's fix that\")]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            const banner = node.closest('[class*="notice"]') || node.closest('[class*="colorDanger"]') || node.parentElement;
            if (banner) {
                banner.style.setProperty("display", "none", "important");
                banner.remove();
            }
        }
    } catch (_) {}
}

setInterval(purgeCorruptBanner, 400);

if (typeof MutationObserver !== "undefined") {
    const bannerObserver = new MutationObserver(purgeCorruptBanner);
    if (document.documentElement) {
        bannerObserver.observe(document.documentElement, { childList: true, subtree: true });
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            bannerObserver.observe(document.documentElement, { childList: true, subtree: true });
        });
    }
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", applyDiscordUiFixes);
} else {
    applyDiscordUiFixes();
}
