5544(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let majorVersion;
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
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron = __importStar(__webpack_require__(1288)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    appFeatures_1 = __webpack_require__(5976),
                    utils_1 = __webpack_require__(4161),
                    ZycordIPC_1 = __webpack_require__(1999),
                    nativeModules_1 = __webpack_require__(216),
                    features = (0, appFeatures_1.getFeatures)();
                utils_1.isOSX && electron.app.configureWebAuthn({ touchID: { keychainAccessGroup: "53Q6R32WPB.com.hnc.agekeys" } });
                try {
                    majorVersion = parseInt(os_1.default.release().split(".")[0], 10);
                } catch (_e) {
                    majorVersion = 0;
                }
                if (utils_1.isOSX && majorVersion >= 21) {
                    function callNative(method, challenge) {
                        if (null == moduleDataPath) return Promise.reject(Error("Module data path unset"));
                        let webAuthnPath = (0, nativeModules_1.getModulePath)("zycord_webauthn") ?? path_1.default.join(moduleDataPath, "zycord_webauthn");
                        return new Promise((resolve, _reject) => {
                            require(webAuthnPath)[method](challenge, function (code, message) {
                                return resolve({ code, message });
                            });
                        });
                    }
                    function callSignalNative(method, ...args) {
                        if (null == moduleDataPath) return Promise.resolve();
                        let webAuthnPath = (0, nativeModules_1.getModulePath)("zycord_webauthn") ?? path_1.default.join(moduleDataPath, "zycord_webauthn");
                        return new Promise((resolve) => {
                            require(webAuthnPath)[method](...args, () => resolve());
                        });
                    }
                    (features.declareSupported("webauthn"),
                        ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WEBAUTHN_REGISTER_MAC, (_event, challenge) => callNative("webAuthnRegister", challenge)),
                        ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WEBAUTHN_AUTHENTICATE_MAC, (_event, challenge) => callNative("webAuthnAuthenticate", challenge)),
                        ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_ALL_ACCEPTED_CREDENTIALS, (_event, rpId, userId, allAcceptedCredentialIds) =>
                            callSignalNative("signalAllAcceptedCredentials", rpId, userId, [...allAcceptedCredentialIds]),
                        ),
                        ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_CURRENT_USER_DETAILS, (_event, rpId, userId, name, displayName) =>
                            callSignalNative("signalCurrentUserDetails", rpId, userId, name, displayName),
                        ),
                        ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_UNKNOWN_CREDENTIAL, (_event, rpId, credentialId) =>
                            callSignalNative("signalUnknownCredential", rpId, credentialId),
                        ));
                }
            }