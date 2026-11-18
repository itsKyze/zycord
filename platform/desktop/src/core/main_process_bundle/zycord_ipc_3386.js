3386(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.injectGetWindow = function (getWindow, getAllWindows) {
                        ((injectedGetWindow = getWindow), (injectedGetAllWindows = getAllWindows));
                    }),
                    (exports.newWindowEvent = function (window) {
                        contentProtectionEnabled && (window.setContentProtection(!0), console.log(`window: WINDOW_SET_CONTENT_PROTCTION ${window.id} = true`));
                    }));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    process_1 = __importDefault(__webpack_require__(932)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    injectedGetWindow = (_key) => null,
                    injectedGetAllWindows = () => [],
                    contentProtectionEnabled = !1,
                    windowContentProtectionOverride = new Set();
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_FLASH_FRAME, (_, flag) => {
                    let currentWindow = injectedGetWindow(null);
                    return (null == currentWindow || null == currentWindow.flashFrame || currentWindow.flashFrame(!currentWindow.isFocused() && flag), Promise.resolve());
                }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_MINIMIZE, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.minimize(), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_RESTORE, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.restore(), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_MAXIMIZE, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null != win && (win.isMaximized() ? win.unmaximize() : win.maximize()), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_FOCUS, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null != win && (win.show(), win.setSkipTaskbar(!1)), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_ALWAYS_ON_TOP, (_, key, enabled) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.setAlwaysOnTop(enabled), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_OPEN_DOCUMENT_PIP, (event) =>
                        event.sender.executeJavaScript("document.getElementById('__document_pip_trigger')?.click()", !0),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_IS_ALWAYS_ON_TOP, (_, key) => {
                        let win = injectedGetWindow(key);
                        return null == win ? Promise.resolve(!1) : Promise.resolve(win.isAlwaysOnTop());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_BLUR, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null == win || win.isDestroyed() || win.blur(), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_PROGRESS_BAR, (_, key, progress) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.setProgressBar(progress), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_TOGGLE_FULLSCREEN, (_, key) => {
                        let currentWindow = injectedGetWindow(key);
                        return (
                            null == currentWindow ? console.error(`window: Unable to find window with key ${key}`) : currentWindow.setFullScreen(!currentWindow.isFullScreen()),
                            Promise.resolve()
                        );
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_CLOSE, (_, key) => {
                        if (null == key && "darwin" === process_1.default.platform) electron_1.default.Menu.sendActionToFirstResponder("hide:");
                        else {
                            let win = injectedGetWindow(key);
                            null != win && win.close();
                        }
                        return Promise.resolve();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_BACKGROUND_THROTTLING, (_, enabled) => {
                        let win = injectedGetWindow();
                        return (null != win && win.webContents.setBackgroundThrottling(enabled), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_FRAME_RATE, (_, key, fps) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.webContents?.setMaxFPS?.(fps), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_CONTENT_PROTCTION, (_, enabled) => {
                        for (let window of injectedGetAllWindows())
                            null == window ||
                                windowContentProtectionOverride.has(window.id) ||
                                (window.setContentProtection(enabled), console.log(`window: WINDOW_SET_CONTENT_PROTCTION ${window.id} = ${enabled}`));
                        return ((contentProtectionEnabled = enabled), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_WINDOW_CONTENT_PROTECTION, (_, key, enabled) => {
                        let window = injectedGetWindow(key);
                        if (null != window) {
                            enabled ? windowContentProtectionOverride.add(window.id) : windowContentProtectionOverride.delete(window.id);
                            let combinedEnabled = enabled || contentProtectionEnabled;
                            (window.setContentProtection(combinedEnabled), console.log(`window: WINDOW_SET_WINDOW_CONTENT_PROTECTION ${key} ${window.id} = ${combinedEnabled}`));
                        }
                        return Promise.resolve();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_GET_NATIVE_HANDLE, (_, key) => {
                        let win = injectedGetWindow(key);
                        return null != win ? Promise.resolve(win.getNativeWindowHandle().readInt32LE().toString(10)) : Promise.resolve(null);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_GET_MEDIA_SOURCE_ID, (_, key) => {
                        let win = injectedGetWindow(key);
                        return Promise.resolve(win?.getMediaSourceId() ?? null);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_MINIMUM_SIZE, (_, width, height) => {
                        let win = injectedGetWindow();
                        return (null != win && win.setMinimumSize(width, height), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SET_FOCUSABLE, (_, key, enabled) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.setFocusable(enabled), Promise.resolve());
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WINDOW_SHOW_INACTIVE, (_, key) => {
                        let win = injectedGetWindow(key);
                        return (null != win && win.showInactive(), Promise.resolve());
                    }));
            }