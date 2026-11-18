3121(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.buildRevision = exports.release = exports.arch = exports.appArch = void 0));
                let os_1 = __importDefault(__webpack_require__(857)),
                    process_1 = __importDefault(__webpack_require__(932)),
                    electronProcess = process_1.default;
                ((exports.appArch = os_1.default.arch()),
                    (exports.arch = os_1.default.arch()),
                    "win32" === process_1.default.platform && null != process_1.default.env.PROCESSOR_ARCHITEW6432 && (exports.arch = "x64"),
                    (process_1.default.env.PROCESSOR_ARCHITECTURE?.toString().toLowerCase() === "arm64" ||
                        process_1.default.env.PROCESSOR_ARCHITEW6432?.toString().toLowerCase() === "arm64" ||
                        process_1.default.env.PROCESSOR_IDENTIFIER?.toString().toLowerCase().includes("arm")) &&
                        (exports.arch = "arm64"),
                    (exports.release = os_1.default.release()),
                    (exports.buildRevision = "win32" === process_1.default.platform ? (electronProcess.getWindowsBuildRevision?.() ?? null) : null));
            }