3573(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let sessionToSessionData = new Map(),
                    statelessSessionData = new WeakMap();
                function getSessionData(transport) {
                    let sessionId = transport.sessionId;
                    return sessionId ? sessionToSessionData.get(sessionId) : statelessSessionData.get(transport);
                }
                function setSessionData(transport, data) {
                    let sessionId = transport.sessionId;
                    sessionId ? sessionToSessionData.set(sessionId, data) : statelessSessionData.set(transport, data);
                }
                ((exports.cleanupSessionDataForTransport = function (transport) {
                    let sessionId = transport.sessionId;
                    sessionId && sessionToSessionData.delete(sessionId);
                }),
                    (exports.getClientInfoForTransport = function (transport) {
                        return getSessionData(transport)?.clientInfo;
                    }),
                    (exports.getProtocolVersionForTransport = function (transport) {
                        return getSessionData(transport)?.protocolVersion;
                    }),
                    (exports.getSessionDataForTransport = function (transport) {
                        return getSessionData(transport);
                    }),
                    (exports.storeSessionDataForTransport = function (transport, sessionData) {
                        setSessionData(transport, sessionData);
                    }),
                    (exports.updateSessionDataForTransport = function (transport, partialSessionData) {
                        let existingData = getSessionData(transport) || {};
                        setSessionData(transport, { ...existingData, ...partialSessionData });
                    }));
            }