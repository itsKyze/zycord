1279(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.MIN_MACOS_KERNEL_MAJOR = void 0),
                    (exports.parseDarwinKernelMajor = function (release) {
                        let major = parseInt(release.split(".")[0], 10);
                        return Number.isNaN(major) ? 0 : major;
                    }),
                    (exports.loadFailedStatus = function (platform, error) {
                        return { state: "load_failed", platform, error: error instanceof Error ? error.message : String(error) };
                    }),
                    (exports.loadedStatus = function (platform) {
                        return { state: "loaded", platform };
                    }),
                    (exports.unsupportedStatus = function (platform, error) {
                        return { state: "unsupported", platform, ...(null != error ? { error } : {}) };
                    }),
                    (exports.normalizeSendResult = function (result) {
                        return "string" == typeof result ? { identifier: result, delivered: !0 } : result;
                    }),
                    (exports.moduleUnavailableError = function (status) {
                        let detail = null != status.error ? `${status.state}: ${status.error}` : status.state;
                        return Error(`zycord_notifications module unavailable (${detail})`);
                    }),
                    (exports.MIN_MACOS_KERNEL_MAJOR = 21));
            }