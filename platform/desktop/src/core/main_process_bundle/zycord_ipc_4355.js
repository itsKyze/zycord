4355(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let path_1 = __importDefault(__webpack_require__(6928)),
                    appFeatures_1 = __webpack_require__(5976),
                    utils_1 = __webpack_require__(4161),
                    ZycordIPC_1 = __webpack_require__(1999),
                    nativeModules_1 = __webpack_require__(216);
                if (utils_1.isOSX)
                    try {
                        if (null == moduleDataPath) throw Error("no moduleDataPath");
                        let modulePath = (0, nativeModules_1.getModulePath)("zycord_intents") ?? path_1.default.join(moduleDataPath, "zycord_intents"),
                            lib = require(modulePath);
                        (lib.setDataPath(modulePath),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SEARCH_INDEX_DOMAINS, (_event, domains) => (lib.indexDomains(domains), Promise.resolve())),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SEARCH_CLEAR_INDEX, (_event) => (lib.clearIndex(), Promise.resolve())),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SEARCH_DELETE_DOMAINS, (_event, domains) => (lib.deleteDomains(domains), Promise.resolve())),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SEARCH_DELETE_ITEMS, (_event, items) => (lib.deleteItems(items), Promise.resolve())),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.INTENTS_SET_ACTIVITY, (_event, activity) => (lib.setActivity(activity), Promise.resolve())),
                            ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.INTENTS_RESIGN_ACTIVITY, (_event) => (lib.resignActivity(), Promise.resolve())),
                            (0, appFeatures_1.getFeatures)().declareSupported("intents"));
                    } catch (e) {
                        console.warn("zycord_intents setup failed with error: ", e);
                    }
            }