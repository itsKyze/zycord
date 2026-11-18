8434(__unused_rspack_module, exports, __webpack_require__) {
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
                        });
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.env = exports.arch = exports.platform = exports.pid = void 0));
                let process1 = __importStar(__webpack_require__(932)),
                    _env = process1.env;
                exports.pid = process1.pid;
                let _platform = process1.platform;
                exports.platform = "darwin" === _platform || "linux" === _platform || "win32" === _platform ? _platform : "unknown";
                let _arch = process1.arch;
                ((exports.arch = "x64" === _arch || "arm64" === _arch ? _arch : ""),
                    (exports.env = {
                        ZYCORD_TEST: _env.ZYCORD_TEST,
                        ZYCORD_GATEWAY_PLAINTEXT: _env.ZYCORD_GATEWAY_PLAINTEXT,
                        ZYCORD_DISALLOW_POPUPS: _env.ZYCORD_DISALLOW_POPUPS,
                        LOCALAPPDATA: _env.LOCALAPPDATA,
                        "PROGRAMFILES(X86)": _env["PROGRAMFILES(X86)"],
                        PROGRAMFILES: _env.PROGRAMFILES,
                        PROGRAMW6432: _env.PROGRAMW6432,
                        PROGRAMDATA: _env.PROGRAMDATA,
                        LIBVA_DRIVER_NAME: _env.LIBVA_DRIVER_NAME,
                    }));
            }