299(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    appFeatures_1 = __webpack_require__(5976),
                    paths_1 = __webpack_require__(822),
                    { USER_DATA_CACHE_SAVE, USER_DATA_CACHE_GET, USER_DATA_CACHE_DELETE } = __webpack_require__(3716).IPCEvents,
                    features = (0, appFeatures_1.getFeatures)();
                function getCachePath() {
                    let userData = paths_1.paths.getUserData();
                    return null === userData ? null : path_1.default.join(userData, "userDataCache.json");
                }
                (electron_1.default.ipcMain.handle(USER_DATA_CACHE_GET, () =>
                    (function () {
                        let cachePath = getCachePath();
                        if (null === cachePath) return null;
                        try {
                            return JSON.parse(fs_1.default.readFileSync(cachePath).toString("utf-8"));
                        } catch (_err) {}
                        return null;
                    })(),
                ),
                    electron_1.default.ipcMain.on(USER_DATA_CACHE_SAVE, (_event, userData) => {
                        let cachePath;
                        null !== (cachePath = getCachePath()) &&
                            fs_1.default.writeFile(cachePath, userData, (e) => {
                                null !== e && console.warn("Failed updating user data cache with error: ", e);
                            });
                    }),
                    electron_1.default.ipcMain.on(USER_DATA_CACHE_DELETE, (_event) => {
                        !(function () {
                            try {
                                let userData,
                                    cachePath = getCachePath(),
                                    migratedPath = ((userData = paths_1.paths.getUserData()), null === userData ? null : path_1.default.join(userData, "domainMigrated"));
                                if (null === cachePath || null === migratedPath) return;
                                (fs_1.default.unlinkSync(cachePath),
                                    fs_1.default.writeFile(migratedPath, "", (e) => {
                                        null !== e && console.warn("Failed to create domainMigrated file with error: ", e);
                                    }));
                            } catch (_err) {}
                        })();
                    }),
                    features.declareSupported("user_data_cache"));
            }