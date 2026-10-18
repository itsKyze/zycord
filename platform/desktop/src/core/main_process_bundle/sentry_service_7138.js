7138(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let assert_1 = __importDefault(__webpack_require__(2613)),
                    electron_1 = __importDefault(__webpack_require__(1288)),
                    lodash_1 = __importDefault(__webpack_require__(9240)),
                    crashReporterUtils_1 = __webpack_require__(977),
                    crashReporterSetup_1 = __webpack_require__(2283),
                    ZycordIPC_1 = __webpack_require__(1999);
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.CRASH_REPORTER_UPDATE_METADATA, (_, additionalMetadata) => {
                    let metadata = crashReporterSetup_1.crashReporterSetup.metadata;
                    (0, assert_1.default)(null != metadata, "Metadata imported improperly.");
                    let finalMetadata = lodash_1.default.defaultsDeep(metadata, additionalMetadata ?? {});
                    (0, crashReporterUtils_1.reconcileCrashReporterMetadata)(electron_1.default.crashReporter, finalMetadata);
                    let sentry = crashReporterSetup_1.crashReporterSetup.getGlobalSentry();
                    if (null != sentry) {
                        let user = additionalMetadata.sentry?.user;
                        null != user && sentry.setUser(user);
                        let nativeBuildNumber = additionalMetadata.nativeBuildNumber;
                        null != nativeBuildNumber && sentry.setTag("nativeBuildNumber", nativeBuildNumber);
                        let staff = additionalMetadata.staff;
                        null != staff && sentry.setTag("isStaff", staff.toString());
                    }
                    return Promise.resolve({ metadata: finalMetadata });
                }),
                    electron_1.default.ipcMain.handle(ZycordIPC_1.IPCEvents.UNHANDLED_JS_EXCEPTION, (_) => {
                        setTimeout(() => {
                            throw Error("UNHANDLED_EXCEPTION " + process.type);
                        }, 50);
                    }));
            }