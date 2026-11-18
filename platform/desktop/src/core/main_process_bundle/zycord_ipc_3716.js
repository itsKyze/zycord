3716(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.RENDERER_SET_CHROMIUM_SWITCHES_ALLOWLIST = exports.RENDERER_SET_ALLOWLIST = exports.IPCEvents = void 0),
                    (exports.getZycordIPCEvent = function (ev) {
                        return zycordPrefixRegex.test(ev) ? ev : `ZYCORD_${ev}`;
                    }));
                var IPCEvents_1 = __webpack_require__(595);
                Object.defineProperty(exports, "IPCEvents", {
                    enumerable: !0,
                    get: function () {
                        return IPCEvents_1.IPCEvents;
                    },
                });
                let zycordPrefixRegex = /^ZYCORD_/;
                ((exports.RENDERER_SET_ALLOWLIST = [
                    "audioSubsystem",
                    "offloadAdmControls",
                    "debugLogging",
                    "asyncVideoInputDeviceInit",
                    "ALWAYS_ALLOW_UPDATES",
                    "ALLOW_OPTIONAL_UPDATES",
                    "openH264Enabled",
                    "DESKTOP_TTI_DNSTCP_WARMUP",
                    "DESKTOP_TTI_REMOVE_V8_CACHE_CLEAR",
                    "DESKTOP_TTI_REMOVE_SHADER_CACHE_CLEAR",
                    "DESKTOP_TTI_EARLY_UPDATE_CHECK",
                    "DESKTOP_TTI_HTTP_CDT",
                    "DESKTOP_TTI_SPLASH_USE_WEBP",
                    "DESKTOP_TTI_LEGACY_OVERLAY_WORKER",
                    "DESKTOP_TTI_UPDATE_BACKOFF_MAX_MS",
                    "DESKTOP_TTI_UPDATE_BACKOFF_ALGO",
                    "DESKTOP_NATIVE_PREMAP",
                ]),
                    (exports.RENDERER_SET_CHROMIUM_SWITCHES_ALLOWLIST = []));
            }