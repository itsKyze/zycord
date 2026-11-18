7142(__unused_rspack_module, exports) {
                "use strict";
                function sanitizeHeaders(payload) {
                    if (!payload.headers) return payload;
                    let strippedHeaders = Object.keys(payload.headers).reduce(
                        (acc, key) => ("authorization" === key.toLowerCase() || "cookie" === key.toLowerCase() || (acc[key] = payload.headers[key]), acc),
                        {},
                    );
                    return { ...payload, headers: strippedHeaders };
                }
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.setupNetworkLogging = function (mainWindow, logger) {
                        if (mainWindow?.webContents != null) {
                            try {
                                mainWindow.webContents.debugger.attach("1.1");
                            } catch (err) {
                                logger.error("debugger attach failed: " + err, 3);
                                return;
                            }
                            (mainWindow.webContents.debugger.on("message", (event, method, params) => {
                                let entry = null;
                                if ("Network.requestWillBeSent" === method) {
                                    let { requestId, request, initiator, type } = params;
                                    entry = {
                                        timestamp: new Date().toISOString(),
                                        method,
                                        requestId,
                                        resource: sanitizeHeaders(request || {}),
                                        resourceType: type,
                                        initiator: initiator?.type,
                                    };
                                } else if ("Network.responseReceived" === method) {
                                    let { requestId, response, type } = params;
                                    entry = { timestamp: new Date().toISOString(), method, requestId, resource: sanitizeHeaders(response || {}), resourceType: type?.type };
                                }
                                null != entry && logger.info(JSON.stringify(entry));
                            }),
                                mainWindow.webContents.debugger.sendCommand("Network.enable"));
                        }
                    }));
            }