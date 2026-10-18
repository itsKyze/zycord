3306(__unused_rspack_module, exports, __webpack_require__) {
                let cachedInterfaces,
                    core = __webpack_require__(5777),
                    ipc = __webpack_require__(7564);
                exports.getIPC = function (client = core.getClient()) {
                    if (!client) throw Error("Could not find client, make sure to call Sentry.init before getIPC");
                    cachedInterfaces || (cachedInterfaces = new WeakMap());
                    let found = cachedInterfaces.get(client);
                    if (found) return found;
                    let implementation = (function (ipcKey) {
                        let ipcUtil = ipc.ipcChannelUtils(ipcKey);
                        if (window.__SENTRY_IPC__?.[ipcUtil.namespace]) return window.__SENTRY_IPC__[ipcUtil.namespace];
                        {
                            core.debug.log("IPC was not configured in preload script, falling back to custom protocol and fetch");
                            let id = (window.__SENTRY_RENDERER_ID__ = core.uuid4()),
                                headers = { [ipc.RENDERER_ID_HEADER]: id };
                            return {
                                sendRendererStart: () => {
                                    fetch(ipcUtil.createUrl("start"), { method: "POST", body: "", headers }).catch(() => {
                                        console.error(`Sentry SDK failed to establish connection with the Electron main process.
  - Ensure you have initialized the SDK in the main process
  - If your renderers use custom sessions, be sure to set 'getSessions' in the main process options
  - If you are bundling your main process code and using Electron < v5, you'll need to manually configure a preload script`);
                                    });
                                },
                                sendScope: (body) => {
                                    fetch(ipcUtil.createUrl("scope"), { method: "POST", body, headers }).catch(() => {});
                                },
                                sendEnvelope: (body) => {
                                    fetch(ipcUtil.createUrl("envelope"), { method: "POST", body, headers }).catch(() => {});
                                },
                                sendStatus: (status) => {
                                    fetch(ipcUtil.createUrl("status"), { method: "POST", body: JSON.stringify({ status }), headers }).catch(() => {});
                                },
                                sendStructuredLog: (log) => {
                                    fetch(ipcUtil.createUrl("structured-log"), { method: "POST", body: JSON.stringify(log), headers }).catch(() => {});
                                },
                                sendMetric: (metric) => {
                                    fetch(ipcUtil.createUrl("metric"), { method: "POST", body: JSON.stringify(metric), headers }).catch(() => {});
                                },
                            };
                        }
                    })(client.getOptions().ipcNamespace);
                    return (cachedInterfaces.set(client, implementation), implementation.sendRendererStart(), implementation);
                };
            }