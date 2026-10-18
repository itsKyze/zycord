453(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777),
                    ipc = __webpack_require__(3306);
                exports.eventLoopBlockIntegration = core.defineIntegration((options) => {
                    let anrThreshold = options?.threshold ?? 1e3,
                        pollInterval = options?.pollInterval || anrThreshold / 2;
                    return {
                        name: "EventLoopBlockRenderer",
                        setup(client) {
                            let config = { pollInterval, anrThreshold, captureStackTrace: !0, ...options },
                                ipc$1 = ipc.getIPC(client);
                            (ipc$1.sendStatus({ status: document.visibilityState, config }),
                                setInterval(() => {
                                    ipc$1.sendStatus({ status: "alive", config });
                                }, config.pollInterval));
                        },
                    };
                });
            }