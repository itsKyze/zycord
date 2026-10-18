1793(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.capturePerformanceTrace = function (options) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.TRACING_CAPTURE_PERFORMANCE, options);
                    }),
                    (exports.saveTraceToDownloads = saveTraceToDownloads));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    paths_1 = __webpack_require__(1405),
                    files_1 = __webpack_require__(5696);
                async function saveTraceToDownloads(bytes, fileName) {
                    if ((0, files_1.containsInvalidFileChar)(fileName)) throw Error("fileName has invalid characters");
                    let downloadsPath = await (0, paths_1.getPath)("downloads"),
                        extension = path_1.default.extname(fileName),
                        baseName = path_1.default.basename(fileName, extension),
                        filePath = path_1.default.join(downloadsPath, fileName);
                    for (let suffix = 1; await fileExists(filePath); suffix++) filePath = path_1.default.join(downloadsPath, `${baseName}-${suffix}${extension}`);
                    return (await fs_1.default.promises.writeFile(filePath, bytes), { filePath });
                }
                async function fileExists(filePath) {
                    try {
                        return (await fs_1.default.promises.access(filePath), !0);
                    } catch {
                        return !1;
                    }
                }
            }