5639(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.USE_OSX_NATIVE_TRAFFIC_LIGHTS = void 0),
                    (exports.flashFrame = function (flag) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_FLASH_FRAME, flag);
                    }),
                    (exports.minimize = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_MINIMIZE, key);
                    }),
                    (exports.restore = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_RESTORE, key);
                    }),
                    (exports.maximize = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_MAXIMIZE, key);
                    }),
                    (exports.focus = function (_hack, key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_FOCUS, key);
                    }),
                    (exports.setAlwaysOnTop = function (key, enabled) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_ALWAYS_ON_TOP, key, enabled);
                    }),
                    (exports.openDocumentPip = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_OPEN_DOCUMENT_PIP);
                    }),
                    (exports.isAlwaysOnTop = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_IS_ALWAYS_ON_TOP, key);
                    }),
                    (exports.showInactive = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SHOW_INACTIVE, key);
                    }),
                    (exports.blur = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_BLUR, key);
                    }),
                    (exports.setProgressBar = function (progress, key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_PROGRESS_BAR, key ?? null, progress);
                    }),
                    (exports.fullscreen = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_TOGGLE_FULLSCREEN, key);
                    }),
                    (exports.close = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_CLOSE, key);
                    }),
                    (exports.setMinimumSize = function (width, height) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_MINIMUM_SIZE, width, height);
                    }),
                    (exports.setZoomFactor = function (factor) {
                        electron_1.default.webFrame.setZoomFactor(factor / 100);
                    }),
                    (exports.setBackgroundThrottling = function (enabled) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_BACKGROUND_THROTTLING, enabled);
                    }),
                    (exports.setFrameRate = function (key, fps) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_FRAME_RATE, key, fps);
                    }),
                    (exports.setDevtoolsCallbacks = function (onOpened, onClosed) {
                        ((devtoolsOpenedCallback = onOpened), (devtoolsClosedCallback = onClosed));
                    }),
                    (exports.supportsContentProtection = supportsContentProtection),
                    (exports.setContentProtection = function (enabled) {
                        return supportsContentProtection()
                            ? ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_CONTENT_PROTCTION, enabled)
                            : (console.log("setContentProtection: Unsupported platform."), Promise.resolve());
                    }),
                    (exports.setWindowContentProtection = function (key, enabled) {
                        return supportsContentProtection()
                            ? ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_WINDOW_CONTENT_PROTECTION, key, enabled)
                            : (console.log("setWindowContentProtection: Unsupported platform."), Promise.resolve());
                    }),
                    (exports.getNativeHandle = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_GET_NATIVE_HANDLE, key);
                    }),
                    (exports.getMediaSourceId = function (key) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_GET_MEDIA_SOURCE_ID, key);
                    }),
                    (exports.setFocusable = function (key, enabled) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WINDOW_SET_FOCUSABLE, key, enabled);
                    }));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    processUtils_1 = __webpack_require__(5468),
                    ZycordIPC_1 = __webpack_require__(1999),
                    devtoolsOpenedCallback = () => {},
                    devtoolsClosedCallback = () => {};
                function supportsContentProtection() {
                    return processUtils_1.IS_WIN;
                }
                (ZycordIPC_1.ZycordIPC.renderer.on(ZycordIPC_1.IPCEvents.WINDOW_DEVTOOLS_OPENED, () => {
                    devtoolsOpenedCallback?.();
                }),
                    ZycordIPC_1.ZycordIPC.renderer.on(ZycordIPC_1.IPCEvents.WINDOW_DEVTOOLS_CLOSED, () => {
                        devtoolsClosedCallback?.();
                    }),
                    (exports.USE_OSX_NATIVE_TRAFFIC_LIGHTS = !0));
            }