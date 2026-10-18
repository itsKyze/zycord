8986(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.updateCrashReporter = updateCrashReporter),
                    (exports.getMetadata = function () {
                        return metadata;
                    }),
                    (exports.getFlattenedMetadata = function () {
                        return (0, crashReporterUtils_1.flatten)(metadata);
                    }),
                    (exports.triggerJSException = triggerJSException));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    crashReporterUtils_1 = __webpack_require__(977),
                    ZycordIPC_1 = __webpack_require__(1999),
                    metadata = {};
                async function updateCrashReporter(additionalMetadata) {
                    ((metadata = (await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.CRASH_REPORTER_UPDATE_METADATA, additionalMetadata)).metadata ?? {}),
                        (0, crashReporterUtils_1.reconcileCrashReporterMetadata)(electron_1.default.crashReporter, metadata));
                }
                async function triggerJSException(exceptionLocation) {
                    switch (exceptionLocation) {
                        case 0:
                            setTimeout(() => {
                                throw Error("Delayed UNHANDLED_EXCEPTION " + process.type);
                            }, 50);
                            break;
                        case 1:
                            throw Error("UNHANDLED_EXCEPTION " + process.type);
                        case 2:
                            await electron_1.default.ipcRenderer.invoke(ZycordIPC_1.IPCEvents.UNHANDLED_JS_EXCEPTION);
                    }
                }
                updateCrashReporter(metadata);
            }