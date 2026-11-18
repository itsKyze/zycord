6435(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(2277),
                    sessionManagement = __webpack_require__(3573),
                    validation = __webpack_require__(8631);
                function extractPartyInfo(obj) {
                    let partyInfo = {};
                    return (
                        validation.isValidContentItem(obj) &&
                            ("string" == typeof obj.name && (partyInfo.name = obj.name),
                            "string" == typeof obj.title && (partyInfo.title = obj.title),
                            "string" == typeof obj.version && (partyInfo.version = obj.version)),
                        partyInfo
                    );
                }
                function getClientAttributes(transport) {
                    let clientInfo = sessionManagement.getClientInfoForTransport(transport),
                        attributes = {};
                    return (
                        clientInfo?.name && (attributes["mcp.client.name"] = clientInfo.name),
                        clientInfo?.title && (attributes["mcp.client.title"] = clientInfo.title),
                        clientInfo?.version && (attributes["mcp.client.version"] = clientInfo.version),
                        attributes
                    );
                }
                function getServerAttributes(transport) {
                    let serverInfo = sessionManagement.getSessionDataForTransport(transport)?.serverInfo,
                        attributes$1 = {};
                    return (
                        serverInfo?.name && (attributes$1[attributes.MCP_SERVER_NAME_ATTRIBUTE] = serverInfo.name),
                        serverInfo?.title && (attributes$1[attributes.MCP_SERVER_TITLE_ATTRIBUTE] = serverInfo.title),
                        serverInfo?.version && (attributes$1[attributes.MCP_SERVER_VERSION_ATTRIBUTE] = serverInfo.version),
                        attributes$1
                    );
                }
                function extractClientInfo(extra) {
                    return {
                        address: extra?.requestInfo?.remoteAddress || extra?.clientAddress || extra?.request?.ip || extra?.request?.connection?.remoteAddress,
                        port: extra?.requestInfo?.remotePort || extra?.clientPort || extra?.request?.connection?.remotePort,
                    };
                }
                function getTransportTypes(transport) {
                    if (!transport?.constructor) return { mcpTransport: "unknown", networkTransport: "unknown" };
                    let transportName = "string" == typeof transport.constructor?.name ? transport.constructor.name : "unknown",
                        networkTransport = "unknown",
                        lowerTransportName = transportName.toLowerCase();
                    return (
                        lowerTransportName.includes("stdio")
                            ? (networkTransport = "pipe")
                            : (lowerTransportName.includes("http") || lowerTransportName.includes("sse")) && (networkTransport = "tcp"),
                        { mcpTransport: transportName, networkTransport }
                    );
                }
                ((exports.buildClientAttributesFromInfo = function (clientInfo) {
                    let attributes = {};
                    return (
                        clientInfo?.name && (attributes["mcp.client.name"] = clientInfo.name),
                        clientInfo?.title && (attributes["mcp.client.title"] = clientInfo.title),
                        clientInfo?.version && (attributes["mcp.client.version"] = clientInfo.version),
                        attributes
                    );
                }),
                    (exports.buildServerAttributesFromInfo = function (serverInfo) {
                        let attributes$1 = {};
                        return (
                            serverInfo?.name && (attributes$1[attributes.MCP_SERVER_NAME_ATTRIBUTE] = serverInfo.name),
                            serverInfo?.title && (attributes$1[attributes.MCP_SERVER_TITLE_ATTRIBUTE] = serverInfo.title),
                            serverInfo?.version && (attributes$1[attributes.MCP_SERVER_VERSION_ATTRIBUTE] = serverInfo.version),
                            attributes$1
                        );
                    }),
                    (exports.buildTransportAttributes = function (transport, extra) {
                        let sessionId = transport && "sessionId" in transport ? transport.sessionId : void 0,
                            clientInfo = extra ? extractClientInfo(extra) : {},
                            { mcpTransport, networkTransport } = getTransportTypes(transport),
                            clientAttributes = getClientAttributes(transport),
                            serverAttributes = getServerAttributes(transport),
                            protocolVersion = sessionManagement.getProtocolVersionForTransport(transport);
                        return {
                            ...(sessionId && { [attributes.MCP_SESSION_ID_ATTRIBUTE]: sessionId }),
                            ...(clientInfo.address && { [attributes.CLIENT_ADDRESS_ATTRIBUTE]: clientInfo.address }),
                            ...(clientInfo.port && { [attributes.CLIENT_PORT_ATTRIBUTE]: clientInfo.port }),
                            [attributes.MCP_TRANSPORT_ATTRIBUTE]: mcpTransport,
                            [attributes.NETWORK_TRANSPORT_ATTRIBUTE]: networkTransport,
                            [attributes.NETWORK_PROTOCOL_VERSION_ATTRIBUTE]: "2.0",
                            ...(protocolVersion && { [attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE]: protocolVersion }),
                            ...clientAttributes,
                            ...serverAttributes,
                        };
                    }),
                    (exports.extractClientInfo = extractClientInfo),
                    (exports.extractSessionDataFromInitializeRequest = function (request) {
                        let sessionData = {};
                        return (
                            validation.isValidContentItem(request.params) &&
                                ("string" == typeof request.params.protocolVersion && (sessionData.protocolVersion = request.params.protocolVersion),
                                request.params.clientInfo && (sessionData.clientInfo = extractPartyInfo(request.params.clientInfo))),
                            sessionData
                        );
                    }),
                    (exports.extractSessionDataFromInitializeResponse = function (result) {
                        let sessionData = {};
                        return (
                            validation.isValidContentItem(result) &&
                                ("string" == typeof result.protocolVersion && (sessionData.protocolVersion = result.protocolVersion),
                                result.serverInfo && (sessionData.serverInfo = extractPartyInfo(result.serverInfo))),
                            sessionData
                        );
                    }),
                    (exports.getClientAttributes = getClientAttributes),
                    (exports.getServerAttributes = getServerAttributes),
                    (exports.getTransportTypes = getTransportTypes));
            }