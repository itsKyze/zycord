7987(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let nativeModule;
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
                        });
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getCapabilities = getCapabilities),
                    (exports.canConvertHeic = canConvertHeic),
                    (exports.canConvertJxr = canConvertJxr),
                    (exports.getBackendName = getBackendName),
                    (exports.convertBytes = function (inputBytes, optionsJson) {
                        let mod = getNativeModule();
                        return null == mod
                            ? Promise.reject(Error("zycord_sysimg not available"))
                            : new Promise((resolve, reject) => {
                                  mod.convertBytes(inputBytes, optionsJson, (err, result) => {
                                      null != err ? reject(Error(err)) : resolve(result);
                                  });
                              });
                    }));
                let nativeModules = __importStar(__webpack_require__(7927)),
                    cachedCapabilities = null,
                    capabilitiesPromise = null;
                function getNativeModule() {
                    if (void 0 !== nativeModule) return nativeModule;
                    try {
                        nativeModule = nativeModules.requireModule("zycord_sysimg");
                    } catch (err) {
                        ((nativeModule = null),
                            String(err?.message).includes("Cannot find") &&
                                nativeModules
                                    .ensureModule("zycord_sysimg")
                                    .then(() => {
                                        nativeModule = void 0;
                                    })
                                    .catch(() => {}));
                    }
                    return nativeModule;
                }
                function getCapabilities() {
                    if (null != cachedCapabilities) return Promise.resolve(cachedCapabilities);
                    if (null != capabilitiesPromise) return capabilitiesPromise;
                    let mod = getNativeModule();
                    if (null == mod) return Promise.resolve(null);
                    let promise = new Promise((resolve) => {
                        try {
                            mod.probe((err, caps) => {
                                null != err || null == caps ? resolve(null) : ((cachedCapabilities = caps), resolve(caps));
                            });
                        } catch {
                            resolve(null);
                        }
                    });
                    return (
                        (capabilitiesPromise = promise),
                        promise.then((caps) => {
                            null == caps && capabilitiesPromise === promise && (capabilitiesPromise = null);
                        }),
                        promise
                    );
                }
                async function canConvertHeic() {
                    let caps = await getCapabilities();
                    return caps?.conversionMatrix.conversions.heic?.includes("jpeg") === !0;
                }
                async function canConvertJxr() {
                    let caps = await getCapabilities();
                    return caps?.conversionMatrix.conversions.jxr?.includes("jpeg") === !0;
                }
                async function getBackendName() {
                    let caps = await getCapabilities();
                    return caps?.backend ?? null;
                }
            }