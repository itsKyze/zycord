9473(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    fileutils_1 = __webpack_require__(9590);
                function getModulePath() {
                    return global.moduleDataPath ?? global.modulePath;
                }
                function getLogPath() {
                    return global.logPath;
                }
                function getAssetCachePath() {
                    return global.assetCachePath;
                }
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_PATH, async (_) => getModulePath()),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_SAVE_DIALOG,
                        async (_, dialogOptions) => await electron_1.default.dialog.showSaveDialog(dialogOptions),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_OPEN_DIALOG,
                        async (_, dialogOptions) => await electron_1.default.dialog.showOpenDialog(dialogOptions),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FILE_MANAGER_SHOW_ITEM_IN_FOLDER, async (_, path) => {
                        electron_1.default.shell.showItemInFolder(path);
                    }),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_DATA_PATH_SYNC, (event) => {
                        event.returnValue = getModulePath();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_LOG_PATH, async (_) => getLogPath()),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_MODULE_LOG_PATH_SYNC, (event) => {
                        event.returnValue = getLogPath();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_ASSET_CACHE_PATH, async (_) => getAssetCachePath()),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.FILE_MANAGER_GET_ASSET_CACHE_PATH_SYNC, (event) => {
                        event.returnValue = getAssetCachePath();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.FILE_MANAGER_CREATE_DIRECTORY_IF_NOT_EXISTS, async (_, dirPath, hidden) => {
                        await (0, fileutils_1.ensureDirectoryExists)(dirPath, hidden);
                    }));
            }