3287(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.setBeforeRequireModuleHook = function (hook) {
                        onBeforeRequireModule = hook;
                    }),
                    (exports.runBeforeRequireModuleHook = function (name) {
                        if (null != onBeforeRequireModule)
                            try {
                                onBeforeRequireModule(name);
                            } catch {}
                    }));
                let onBeforeRequireModule = null;
            },
            4482(module1, exports, __webpack_require__) {
                "use strict";
                let riotRootCA;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    https_1 = __importDefault(__webpack_require__(5692)),
                    path_1 = __importDefault(__webpack_require__(6928));
                module1.exports = {
                    fetchLiveClientData: function (endpoint, params = {}) {
                        let queryString = new URLSearchParams({
                                ...(null != params.riotId ? { riotId: params.riotId } : {}),
                                ...(null != params.eventID ? { eventID: params.eventID.toString() } : {}),
                            }).toString(),
                            url = new URL(`https://127.0.0.1:2999/liveclientdata/${endpoint}${queryString?.length > 0 ? `?${queryString}` : ""}`);
                        return (
                            null == riotRootCA && (riotRootCA = fs_1.default.readFileSync(path_1.default.join(__dirname, "data/riotgames.pem"))),
                            new Promise((resolve, reject) => {
                                let req = https_1.default.request(url.toString(), { ca: riotRootCA, method: "GET", headers: { "Content-Type": "application/json" } }, (res) => {
                                    let responseData = "";
                                    (res.setEncoding("utf8"),
                                        res.on("data", (chunk) => {
                                            responseData += chunk;
                                        }),
                                        res.on("end", () => {
                                            resolve({ status: res.statusCode, body: responseData });
                                        }));
                                });
                                (req.on("error", (e) => {
                                    reject(e);
                                }),
                                    req.end());
                            })
                        );
                    },
                };
            }