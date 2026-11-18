7564(__unused_rspack_module, exports) {
                var IPCMode;
                ((exports.IPCMode = void 0),
                    ((IPCMode = exports.IPCMode || (exports.IPCMode = {}))[(IPCMode.Classic = 1)] = "Classic"),
                    (IPCMode[(IPCMode.Protocol = 2)] = "Protocol"),
                    (IPCMode[(IPCMode.Both = 3)] = "Both"));
                let UTILITY_PROCESS_MAGIC_MESSAGE_KEY = "__sentry_message_port_message__";
                ((exports.RENDERER_ID_HEADER = "sentry-electron-renderer-id"),
                    (exports.getMagicMessage = function () {
                        return { [UTILITY_PROCESS_MAGIC_MESSAGE_KEY]: !0 };
                    }),
                    (exports.ipcChannelUtils = function (namespace) {
                        return {
                            createUrl: (channel) => `${namespace}://${channel}/sentry_key`,
                            urlMatches: function (url, channel) {
                                return url.startsWith(this.createUrl(channel));
                            },
                            createKey: (channel) => `${namespace}.${channel}`,
                            namespace,
                        };
                    }),
                    (exports.isMagicMessage = function (msg) {
                        return !!(msg && "object" == typeof msg && UTILITY_PROCESS_MAGIC_MESSAGE_KEY in msg);
                    }));
            }