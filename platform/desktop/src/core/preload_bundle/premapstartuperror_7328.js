7328(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.premapStartupError = function () {
                        return startupError;
                    }),
                    (exports.startNativePremap = function (loadPremapNative = (file) => require(file)) {
                        if ("win32" === process.platform && process.argv.includes("--enable-native-premap"))
                            try {
                                startupError = null;
                                let nativeModules = __webpack_require__(7927),
                                    { setBeforeRequireModuleHook } = __webpack_require__(3287),
                                    path = __webpack_require__(6928),
                                    targets = (function (nativeModules, path) {
                                        let targets = [];
                                        for (let name of PREMAP_MODULES) {
                                            let dir = nativeModules.getModulePath(name);
                                            null != dir && targets.push(path.join(dir, `${name}.node`));
                                        }
                                        return targets;
                                    })(nativeModules, path),
                                    premapDir = nativeModules.getModulePath("zycord_premap");
                                if (0 === targets.length || null == premapDir) {
                                    startupError = "no committed module paths to pre-map";
                                    return;
                                }
                                let premap = loadPremapNative(path.join(premapDir, "zycord_premap.node"));
                                (premap.premapModules(targets),
                                    setBeforeRequireModuleHook((name) => {
                                        let dir = nativeModules.getModulePath(name);
                                        null != dir && premap.dequeuePremap(path.join(dir, `${name}.node`));
                                    }));
                            } catch (error) {
                                startupError = String(error);
                            }
                    }));
                let PREMAP_MODULES = ["zycord_voice", "zycord_zstd", "zycord_cloudsync", "zycord_media"],
                    startupError = null;
            }