723(__unused_rspack_module, exports, __webpack_require__) {
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
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getAPIEndpoint = getAPIEndpoint),
                    (exports.makeChunkedRequest = function (route, chunks, options, callback) {
                        return _makeChunkedRequest(route, chunks, options)
                            .then((body) => callback(null, body))
                            .catch((err) => callback(err));
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    http = __importStar(__webpack_require__(8611)),
                    https = __importStar(__webpack_require__(5692)),
                    { CONSTANTS_GET } = __webpack_require__(3716).IPCEvents;
                async function getAPIEndpoint() {
                    let apiEndpoint = await electron.ipcRenderer.invoke(CONSTANTS_GET, "API_ENDPOINT");
                    return null == apiEndpoint || "" === apiEndpoint ? null : apiEndpoint;
                }
                async function _makeChunkedRequest(route, chunks, options) {
                    let { method, chunkInterval, token, contentType } = options,
                        httpRequest = http.request;
                    route.startsWith("https") && (httpRequest = https.request);
                    let apiEndpoint = await getAPIEndpoint();
                    if (null == apiEndpoint) throw Error("missing api endpoint setting");
                    let apiEndpointUrl = new URL(apiEndpoint),
                        url = new URL(route, apiEndpoint);
                    return (
                        (url.protocol = apiEndpointUrl.protocol),
                        (url.host = apiEndpointUrl.host),
                        url.pathname.startsWith(apiEndpointUrl.pathname) || (url.pathname = `${apiEndpointUrl.pathname}${url.pathname}`),
                        new Promise(async (resolve, reject) => {
                            let writeTimeout = null,
                                req = httpRequest(
                                    url.toString(),
                                    { method, headers: { authorization: token, "Content-Type": contentType, "Content-Length": Buffer.byteLength(chunks.join("")) } },
                                    (res) => {
                                        let responseData = "";
                                        (res.setEncoding("utf8"),
                                            res.on("data", (chunk) => {
                                                responseData += chunk;
                                            }),
                                            res.on("end", () => {
                                                resolve({ status: res.statusCode, body: responseData });
                                            }));
                                    },
                                );
                            req.on("error", (e) => {
                                (null !== writeTimeout && clearTimeout(writeTimeout), reject(e));
                            });
                            for (let i = 0; i < chunks.length; i++)
                                await new Promise((resolve) => {
                                    req.write(chunks[i], () => {
                                        writeTimeout = setTimeout(resolve, chunkInterval);
                                    });
                                });
                            req.end();
                        })
                    );
                }
            }