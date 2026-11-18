6228(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.registerBeforeRequest = function (session, id, handler, urlPatterns) {
                        let entries = entriesBySession.get(session);
                        (null == entries && ((entries = new Map()), entriesBySession.set(session, entries)),
                            entries.set(id, { handler, patterns: urlPatterns }),
                            reinstallListener(session));
                    }),
                    (exports.unregisterBeforeRequest = function (session, id) {
                        let entries = entriesBySession.get(session);
                        null != entries && entries.delete(id) && reinstallListener(session);
                    }));
                let entriesBySession = new WeakMap();
                function reinstallListener(session) {
                    let entries = entriesBySession.get(session);
                    if (null == entries || 0 === entries.size) return void session.webRequest.onBeforeRequest(null);
                    let unionedPatterns = new Set();
                    for (let entry of entries.values()) for (let pattern of entry.patterns) unionedPatterns.add(pattern);
                    session.webRequest.onBeforeRequest({ urls: Array.from(unionedPatterns) }, (details, callback) => {
                        let list = entriesBySession.get(session);
                        if (null != list)
                            for (let { handler } of list.values()) {
                                let response = handler(details);
                                if (null != response) return void callback(response);
                            }
                        callback({});
                    });
                }
            }