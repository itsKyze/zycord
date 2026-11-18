9895(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.updater =
                        exports.splashScreen =
                        exports.paths =
                        exports.moduleUpdater =
                        exports.logger =
                        exports.crashReporterSetup =
                        exports.buildInfo =
                        exports.autoStart =
                        exports.appSettings =
                        exports.analytics =
                        exports.GPUSettings =
                        exports.Constants =
                            void 0),
                    (exports.init = function (bootstrapModules) {
                        if (hasInit) throw Error("bootstrapModules has already init");
                        ((exports.Constants = bootstrapModules.Constants),
                            (exports.GPUSettings = bootstrapModules.GPUSettings),
                            (exports.analytics = bootstrapModules.analytics),
                            (exports.appSettings = bootstrapModules.appSettings),
                            (exports.autoStart = bootstrapModules.autoStart),
                            (exports.buildInfo = bootstrapModules.buildInfo),
                            (exports.crashReporterSetup = bootstrapModules.crashReporterSetup),
                            (exports.logger = bootstrapModules.logger),
                            (exports.moduleUpdater = bootstrapModules.moduleUpdater),
                            (exports.paths = bootstrapModules.paths),
                            (exports.splashScreen = bootstrapModules.splashScreen),
                            (exports.updater = bootstrapModules.updater),
                            (hasInit = !0));
                    }));
                let hasInit = !1;
                ((exports.Constants = null),
                    (exports.GPUSettings = null),
                    (exports.analytics = null),
                    (exports.appSettings = null),
                    (exports.autoStart = null),
                    (exports.buildInfo = null),
                    (exports.crashReporterSetup = null),
                    (exports.logger = null),
                    (exports.moduleUpdater = null),
                    (exports.paths = null),
                    (exports.splashScreen = null),
                    (exports.updater = null));
            }