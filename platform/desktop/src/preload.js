/**
 * Zycord Desktop Preload Script
 * 1:1 Discord Native Integration with WebMediaEngine & Seamless Voice/Screen Sharing
 */
const { contextBridge, ipcRenderer, webFrame } = require("electron");

// 1. Prevent ETF or Zstd WebSockets (Use standard JSON & zlib for web gateway)
if (typeof window !== "undefined") {
    const OrigWebSocket = window.WebSocket;
    if (OrigWebSocket) {
        const PatchedWebSocket = function (url, protocols) {
            if (typeof url === "string") {
                url = url.replace("encoding=etf", "encoding=json")
                         .replace("compress=zstd-stream", "compress=zlib-stream");
            }
            return protocols !== undefined
                ? new OrigWebSocket(url, protocols)
                : new OrigWebSocket(url);
        };
        PatchedWebSocket.prototype = OrigWebSocket.prototype;
        Object.assign(PatchedWebSocket, OrigWebSocket);
        window.WebSocket = PatchedWebSocket;
    }
}

// 2. Hide nag banner
try {
    localStorage.setItem("hideNag", "true");
} catch (_) {}

// 3. Webpack Runtime Hook
// Intercepts module 823598 (WQ) so Discord cleanly selects WebMediaEngine (WebRTC)
// instead of the closed-source C++ binary. This eliminates "RTC Connecting" hangs,
// corrupt installation notices, and missing module errors.
function hookWebpack() {
    const patchChunkModules = (modules) => {
        if (!modules || typeof modules !== "object") return;
        for (const id in modules) {
            const origFn = modules[id];
            if (typeof origFn !== "function") continue;

            modules[id] = function () {
                const ret = origFn.apply(this, arguments);
                const exp = arguments[1] || (arguments[0] && arguments[0].exports) || this;
                if (exp && typeof exp.WQ === "function") {
                    const origWQ = exp.WQ;
                    exp.WQ = function (engine) {
                        if (engine && typeof engine.supported === "function") {
                            engine.supported = function () {
                                return false; // Cleanly tell Discord NativeMediaEngine is unavailable -> falls back to WebRTC
                            };
                        }
                        return origWQ.call(this, engine);
                    };
                }
                return ret;
            };
            Object.assign(modules[id], origFn);
        }
    };

    const patchPush = (pushFn) => {
        return function (chunk) {
            try {
                if (Array.isArray(chunk) && chunk[1]) {
                    patchChunkModules(chunk[1]);
                }
            } catch (err) {
                console.error("[Zycord] Webpack chunk patch error:", err);
            }
            return pushFn.apply(this, arguments);
        };
    };

    if (window.webpackChunkdiscord_app) {
        window.webpackChunkdiscord_app.push = patchPush(window.webpackChunkdiscord_app.push);
    } else {
        let _chunk = [];
        Object.defineProperty(window, "webpackChunkdiscord_app", {
            configurable: true,
            enumerable: true,
            get: () => _chunk,
            set: (val) => {
                _chunk = val;
                if (val && typeof val.push === "function") {
                    val.push = patchPush(val.push);
                }
            },
        });
    }
}

try {
    hookWebpack();
} catch (e) {
    console.error("[Zycord] hookWebpack failed:", e);
}

// 4. Omnipotent Safe Proxy Generator
// Resolves promises, handles array methods (.includes, .indexOf), event emitters (.on, .off),
// string representations (empty string), and constructors smoothly without throwing.
const createSafeUniverse = () => {
    const fn = function () {
        return createSafeUniverse();
    };

    fn.then = function (resolve) {
        return Promise.resolve(resolve ? resolve() : undefined);
    };
    fn.catch = function () {
        return fn;
    };
    fn.finally = function (cb) {
        if (typeof cb === "function") cb();
        return fn;
    };

    return new Proxy(fn, {
        get: (_target, prop) => {
            if (prop === "then") return fn.then;
            if (prop === "catch") return fn.catch;
            if (prop === "finally") return fn.finally;
            if (prop === Symbol.toPrimitive || prop === "toString") return () => "";
            if (prop === "valueOf") return () => 0;
            if (prop === Symbol.iterator) return function* () {};
            if (prop === "length") return 0;
            if (prop === "includes") return () => false;
            if (prop === "indexOf") return () => -1;
            if (prop === "on" || prop === "addListener") return () => () => {};
            if (prop === "off" || prop === "removeListener") return () => {};
            if (prop === "emit") return () => false;
            if (prop === "hasPermission") return () => Promise.resolve(true);
            if (prop === "command") return () => {};
            if (prop === "destroy" || prop === "close") return () => {};
            return createSafeUniverse();
        },
        apply: () => createSafeUniverse(),
        construct: () => createSafeUniverse(),
    });
};

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
            return createSafeUniverse();
        },
    });
}

// 5. Mock Discord RPC Transports for module 998921 / 33006
const createMockEmitter = () => {
    const emitter = {
        on: (_evt, _cb) => emitter,
        once: (_evt, _cb) => emitter,
        off: (_evt, _cb) => emitter,
        emit: () => false,
        removeListener: () => emitter,
        removeAllListeners: () => emitter,
        listen: (_port, cb) => { if (typeof cb === "function") cb(); return emitter; },
        close: (cb) => { if (typeof cb === "function") cb(); },
        write: () => true,
        end: () => {},
        address: () => ({ port: 6463, family: "IPv4", address: "127.0.0.1" }),
        setHeader: () => {},
        writeHead: () => {},
    };
    return emitter;
};

const mockDiscordRpc = {
    RPCIPC: {
        net: {
            createServer: () => createMockEmitter(),
            createConnection: () => createMockEmitter(),
        },
    },
    RPCWebSocket: {
        http: {
            createServer: () => createMockEmitter(),
        },
        ws: {
            Server: function () {
                return createMockEmitter();
            },
        },
    },
};

// 6. Discord Utils Implementation (Concrete JavaScript methods with safe callable fallback)
const discordUtilsTarget = {
    createDateFormatter: (_format) => {
        const dtf = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "short",
        });
        return (timestamp) => {
            try {
                return dtf.format(new Date(timestamp));
            } catch (_) {
                return new Date(timestamp).toLocaleString();
            }
        };
    },
    setProcessPriority: () => {},
    getAudioSubsystemInfo: () => Promise.resolve({ audio_subsystem: "standard" }),
    getDesktopCaptureSources: (opts) => ipcRenderer.invoke("desktop-capture-get-sources", opts),
    shouldDisplayNotifications: () => true,
    isSystemDarkMode: () => true,
    inputEventRegister: () => true,
    inputEventUnregister: () => true,
};

const discordUtils = new Proxy(discordUtilsTarget, {
    get: (target, prop) => {
        if (prop in target) return target[prop];
        if (typeof prop === "symbol" || prop === "then" || prop === "inspect") return undefined;
        return createSafeUniverse();
    },
});

// 7. Complete 1:1 DiscordNative Bridge
const rawDiscordNative = {
    isElectron: true,
    platform: "win32",
    appName: "Zycord",
    domain: "app.zyron.site",

    app: {
        getReleaseChannel: () => "stable",
        getVersion: () => "1.0.17",
        getBuildNumber: () => 17,
        getModuleVersions: () => ({}),
        relaunch: () => ipcRenderer.invoke("window-relaunch"),
        getPreferredSystemLanguages: () => Promise.resolve(["en-US"]),
        setBadgeCount: () => {},
    },

    os: {
        arch: process.arch,
        appArch: process.arch,
        release: "10.0.19045",
        systemVersion: "Windows 10",
        buildRevision: 1,
    },

    process: {
        platform: "win32",
        arch: process.arch,
        env: {},
    },

    processUtils: {
        getMainArgvSync: () => [],
        getCurrentPid: () => process.pid,
        getMemoryUsage: () => Promise.resolve({}),
        getLastCrash: () => Promise.resolve(null),
        purgeCrashReports: () => Promise.resolve(),
        getSystemInfo: () => Promise.resolve({
            cpu: { model: "AMD Ryzen", cores: 12 },
            memory: { total: 16000000, free: 8000000 },
            electronGPUInfo: { gpuDevice: [] },
        }),
    },

    window: {
        minimize: () => ipcRenderer.invoke("window-minimize"),
        maximize: () => ipcRenderer.invoke("window-maximize"),
        close: () => ipcRenderer.invoke("window-close"),
        isMaximized: () => ipcRenderer.sendSync("window-is-maximized"),
        setAlwaysOnTop: (enabled) => ipcRenderer.invoke("window-set-always-on-top", enabled),
        getMediaSourceId: () => Promise.resolve("window:0"),
        setZoomFactor: (factor) => {
            if (typeof factor === "number" && !isNaN(factor)) {
                webFrame.setZoomFactor(factor);
                try { localStorage.setItem("zycord-zoom-factor", String(factor)); } catch (_) {}
                ipcRenderer.invoke("set-zoom-factor", factor).catch(() => {});
            }
        },
        getZoomFactor: () => webFrame.getZoomFactor(),
        flashFrame: () => {},
        setBackgroundThrottling: () => {},
        setProgressBar: () => {},
        blur: () => {},
        focus: () => ipcRenderer.invoke("window-focus"),
    },

    desktopCapture: {
        getDesktopCaptureSources: (opts) => ipcRenderer.invoke("desktop-capture-get-sources", opts),
    },

    clipboard: {
        copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
        paste: () => ipcRenderer.invoke("clipboard-paste"),
        read: () => ipcRenderer.invoke("clipboard-paste"),
    },

    nativeModules: {
        canLoadNativeModules: true,
        hasUpdater: false,
        getMetadata: () => ({}),
        getModuleVersions: () => ({}),
        getDispatch: () => null,
        requireModule: (name) => {
            if (name === "discord_utils") return discordUtils;
            if (name === "discord_rpc") return mockDiscordRpc;
            if (["discord_erlpack", "erlpack", "discord_zstd", "zstd", "discord_dispatch", "discord_voice"].includes(name)) {
                const err = new Error(`Cannot find module '${name}'`);
                err.code = "MODULE_NOT_FOUND";
                throw err;
            }
            return createSafeUniverse();
        },
        ensureModule: (name) => {
            if (["discord_erlpack", "erlpack", "discord_zstd", "zstd", "discord_dispatch", "discord_voice"].includes(name)) {
                const err = new Error(`Cannot find module '${name}'`);
                err.code = "MODULE_NOT_FOUND";
                return Promise.reject(err);
            }
            return Promise.resolve();
        },
    },

    crashReporter: {
        getMetadata: () => ({
            distro: "CachyOS Linux",
            wm: "Hyprland",
            runtime_environment: "native",
            version: "1.0.17",
        }),
        updateCrashReporter: () => {},
    },

    settings: {
        get: (key, defaultValue) => {
            try {
                const val = localStorage.getItem("zycord-native-settings-" + key);
                return val !== null ? JSON.parse(val) : (defaultValue !== undefined ? defaultValue : null);
            } catch (_) {
                return defaultValue !== undefined ? defaultValue : null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem("zycord-native-settings-" + key, JSON.stringify(value));
            } catch (_) {}
            return Promise.resolve();
        },
        getSync: (key, defaultValue) => {
            try {
                const val = localStorage.getItem("zycord-native-settings-" + key);
                return val !== null ? JSON.parse(val) : (defaultValue !== undefined ? defaultValue : null);
            } catch (_) {
                return defaultValue !== undefined ? defaultValue : null;
            }
        },
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
        on: () => () => {},
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
        on: (_evt, _cb) => () => {},
        off: () => {},
        addListener: () => {},
        removeListener: () => {},
        getSystemIdleTimeMs: () => 0,
    },

    ipc: {
        send: (channel, ...args) => {
            try { ipcRenderer.send(channel, ...args); } catch (_) {}
        },
        sendSync: (channel, ...args) => {
            try { return ipcRenderer.sendSync(channel, ...args); } catch (_) { return null; }
        },
        invoke: (channel, ...args) => {
            try { return ipcRenderer.invoke(channel, ...args); } catch (_) { return Promise.resolve(); }
        },
        on: (channel, listener) => {
            try { ipcRenderer.on(channel, listener); } catch (_) {}
            return () => {
                try { ipcRenderer.removeListener(channel, listener); } catch (_) {}
            };
        },
        off: (channel, listener) => {
            try { ipcRenderer.removeListener(channel, listener); } catch (_) {}
        },
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

const ZycordNative = wrapWithSafeProxy(rawDiscordNative);

try {
    contextBridge.exposeInMainWorld("DiscordNative", ZycordNative);
    contextBridge.exposeInMainWorld("ZycordNative", ZycordNative);
    contextBridge.exposeInMainWorld("VesktopNative", {
        app: rawDiscordNative.app,
        win: rawDiscordNative.window,
        settings: rawDiscordNative.settings,
    });
} catch (_) {
    window.DiscordNative = ZycordNative;
    window.ZycordNative = ZycordNative;
    window.VesktopNative = ZycordNative;
}

// 8. Restore saved zoom factor on startup
try {
    const savedZoom = localStorage.getItem("zycord-zoom-factor");
    if (savedZoom) {
        const factor = parseFloat(savedZoom);
        if (!isNaN(factor) && factor >= 0.5 && factor <= 2.5) {
            webFrame.setZoomFactor(factor);
        }
    }
} catch (_) {}

// 9. Global Zoom shortcuts (Ctrl++, Ctrl+-, Ctrl+0, Ctrl+Wheel)
window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    if (e.key === "=" || e.key === "+" || e.code === "NumpadAdd") {
        e.preventDefault();
        const current = webFrame.getZoomFactor();
        const next = Math.min(2.5, Math.round((current + 0.1) * 10) / 10);
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
        ipcRenderer.invoke("set-zoom-factor", next).catch(() => {});
    } else if (e.key === "-" || e.key === "_" || e.code === "NumpadSubtract") {
        e.preventDefault();
        const current = webFrame.getZoomFactor();
        const next = Math.max(0.5, Math.round((current - 0.1) * 10) / 10);
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
        ipcRenderer.invoke("set-zoom-factor", next).catch(() => {});
    } else if (e.key === "0" || e.code === "Numpad0") {
        e.preventDefault();
        webFrame.setZoomFactor(1.0);
        try { localStorage.setItem("zycord-zoom-factor", "1.0"); } catch (_) {}
        ipcRenderer.invoke("set-zoom-factor", 1.0).catch(() => {});
    }
}, { capture: true });

window.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        const current = webFrame.getZoomFactor();
        const next = Math.max(0.5, Math.min(2.5, Math.round((current + delta) * 100) / 100));
        webFrame.setZoomFactor(next);
        try { localStorage.setItem("zycord-zoom-factor", String(next)); } catch (_) {}
        ipcRenderer.invoke("set-zoom-factor", next).catch(() => {});
    }
}, { passive: false });

// 10. UI Styling: Hide corrupt notices, hide browser navigation arrows, dark scrollbars
function applyDiscordUiFixes() {
    if (document.getElementById("zycord-ui-fixes")) return;

    const style = document.createElement("style");
    style.id = "zycord-ui-fixes";
    style.textContent = `
        /* Hide corrupt installation and danger banners */
        [class*="colorDanger"],
        [class*="notice"][class*="colorDanger"],
        [class*="notice_"][class*="colorDanger_"],
        [class*="notice__"][class*="colorDanger__"],
        [class*="notice-"][class*="colorDanger-"],
        [class*="noticeRegion"] [class*="colorDanger"] {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            overflow: hidden !important;
        }

        /* Hide browser navigation back/forward buttons */
        [class*="browserNavigation_"],
        [class*="navigationBack_"],
        [class*="navigationForward_"] {
            display: none !important;
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
            display: none !important;
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

        /* Clean full canvas window */
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

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", applyDiscordUiFixes);
} else {
    applyDiscordUiFixes();
}

