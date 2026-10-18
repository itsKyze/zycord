7927(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var ownKeys,
                    __createBinding =
                        (this && this.__createBinding) ||
                        (Object.create
                            ? function (o, m, k, k2) {
                                  void 0 === k2 && (k2 = k);
                                  var desc = Object.getOwnPropertyDescriptor(m, k);
                                  ((!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) &&
                                      (desc = {
                                          enumerable: !0,
                                          get: function () {
                                              return m[k];
                                          },
                                      }),
                                      Object.defineProperty(o, k2, desc));
                              }
                            : function (o, m, k, k2) {
                                  (void 0 === k2 && (k2 = k), (o[k2] = m[k]));
                              }),
                    __setModuleDefault =
                        (this && this.__setModuleDefault) ||
                        (Object.create
                            ? function (o, v) {
                                  Object.defineProperty(o, "default", { enumerable: !0, value: v });
                              }
                            : function (o, v) {
                                  o.default = v;
                              }),
                    __importStar =
                        (this && this.__importStar) ||
                        ((ownKeys = function (o) {
                            return (ownKeys =
                                Object.getOwnPropertyNames ||
                                function (o) {
                                    var ar = [];
                                    for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && (ar[ar.length] = k);
                                    return ar;
                                })(o);
                        }),
                        function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (null != mod) for (var k = ownKeys(mod), i = 0; i < k.length; i++) "default" !== k[i] && __createBinding(result, mod, k[i]);
                            return (__setModuleDefault(result, mod), result);
                        }),
                    __importDefault =
                        (this && this.__importDefault) ||
                        function (mod) {
                            return mod && mod.__esModule ? mod : { default: mod };
                        };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.canBootstrapNewUpdater = void 0),
                    (exports.ensureModule = ensureModule),
                    (exports.requireModule = function (name) {
                        if ((!/^zycord_[a-z0-9_-]+$/.test(name) && "erlpack" !== name) || PRELOAD_ONLY_MODULES.has(name))
                            throw Error('"' + String(name) + '" is not a whitelisted native module');
                        return ((0, requireModuleHook_1.runBeforeRequireModuleHook)(name), nativeModule.require(name));
                    }),
                    (exports.getModulePath = function (name) {
                        return electron.ipcRenderer.sendSync(NATIVE_MODULES_GET_MODULE_PATH, name);
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    module_1 = __importDefault(__webpack_require__(3339)),
                    commonConstants = __importStar(__webpack_require__(3716)),
                    requireModuleHook_1 = __webpack_require__(3287),
                    { NATIVE_MODULES_GET_PATHS, NATIVE_MODULES_INSTALL, NATIVE_MODULES_GET_HAS_NEW_UPDATER, NATIVE_MODULES_GET_MODULE_PATH } = commonConstants.IPCEvents,
                    modulePromises = {},
                    nativeModule = new module_1.default(__filename);
                function processPaths({ mainAppDirname, browserModulePaths }) {
                    let sanitizedModulePaths = [];
                    browserModulePaths.forEach((modulePath) => {
                        modulePath.includes("electron.asar") || sanitizedModulePaths.push(modulePath);
                    });
                    let rendererModulePaths = module_1.default._nodeModulePaths(mainAppDirname);
                    return (sanitizedModulePaths = sanitizedModulePaths.concat(rendererModulePaths.slice(0, 2)));
                }
                async function updateNativeRequirePaths() {
                    nativeModule.paths = processPaths(await electron.ipcRenderer.invoke(NATIVE_MODULES_GET_PATHS));
                }
                async function ensureModule(name) {
                    null == modulePromises[name] && (modulePromises[name] = electron.ipcRenderer.invoke(NATIVE_MODULES_INSTALL, name));
                    let moduleInstall = modulePromises[name];
                    (await moduleInstall.catch((e) => ((modulePromises[name] = null), Promise.reject(e))), await updateNativeRequirePaths());
                }
                ((nativeModule.filename = __filename), (nativeModule.paths = []));
                let PRELOAD_ONLY_MODULES = new Set(["zycord_premap"]);
                ((exports.canBootstrapNewUpdater = !electron.ipcRenderer.sendSync(NATIVE_MODULES_GET_HAS_NEW_UPDATER)),
                    (nativeModule.paths = processPaths(electron.ipcRenderer.sendSync(NATIVE_MODULES_GET_PATHS))));
            }