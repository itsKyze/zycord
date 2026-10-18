4623(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let url = __webpack_require__(1410),
                    attributes = __webpack_require__(2277),
                    methodConfig = __webpack_require__(5759);
                function getNotificationAttributes(method, params, recordInputs) {
                    let attributes$1 = {};
                    switch (method) {
                        case "notifications/cancelled":
                            (params?.requestId && (attributes$1["mcp.cancelled.request_id"] = String(params.requestId)),
                                params?.reason && (attributes$1["mcp.cancelled.reason"] = String(params.reason)));
                            break;
                        case "notifications/message":
                            if (
                                (params?.level && (attributes$1[attributes.MCP_LOGGING_LEVEL_ATTRIBUTE] = String(params.level)),
                                params?.logger && (attributes$1[attributes.MCP_LOGGING_LOGGER_ATTRIBUTE] = String(params.logger)),
                                params?.data !== void 0)
                            ) {
                                var data;
                                ((attributes$1[attributes.MCP_LOGGING_DATA_TYPE_ATTRIBUTE] = typeof params.data),
                                    recordInputs &&
                                        (attributes$1[attributes.MCP_LOGGING_MESSAGE_ATTRIBUTE] = "string" == typeof (data = params.data) ? data : JSON.stringify(data)));
                            }
                            break;
                        case "notifications/progress":
                            (params?.progressToken && (attributes$1["mcp.progress.token"] = String(params.progressToken)),
                                "number" == typeof params?.progress && (attributes$1["mcp.progress.current"] = params.progress),
                                "number" == typeof params?.total &&
                                    ((attributes$1["mcp.progress.total"] = params.total),
                                    "number" == typeof params?.progress && (attributes$1["mcp.progress.percentage"] = (params.progress / params.total) * 100)),
                                params?.message && (attributes$1["mcp.progress.message"] = String(params.message)));
                            break;
                        case "notifications/resources/updated":
                            if (params?.uri) {
                                attributes$1[attributes.MCP_RESOURCE_URI_ATTRIBUTE] = String(params.uri);
                                let urlObject = url.parseStringToURLObject(String(params.uri));
                                urlObject && !url.isURLObjectRelative(urlObject) && (attributes$1["mcp.resource.protocol"] = urlObject.protocol.replace(":", ""));
                            }
                            break;
                        case "notifications/initialized":
                            ((attributes$1["mcp.lifecycle.phase"] = "initialization_complete"), (attributes$1["mcp.protocol.ready"] = 1));
                    }
                    return attributes$1;
                }
                ((exports.buildTypeSpecificAttributes = function (type, message, params, recordInputs) {
                    if ("request" === type) {
                        let targetInfo = methodConfig.extractTargetInfo(message.method, params || {});
                        return {
                            ...(void 0 !== message.id && { [attributes.MCP_REQUEST_ID_ATTRIBUTE]: String(message.id) }),
                            ...targetInfo.attributes,
                            ...(recordInputs ? methodConfig.getRequestArguments(message.method, params || {}) : {}),
                        };
                    }
                    return getNotificationAttributes(message.method, params || {}, recordInputs);
                }),
                    (exports.getNotificationAttributes = getNotificationAttributes));
            }