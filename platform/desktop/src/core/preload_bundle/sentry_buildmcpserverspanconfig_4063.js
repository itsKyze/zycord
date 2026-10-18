4063(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    semanticAttributes = __webpack_require__(3052),
                    trace = __webpack_require__(6833),
                    attributeExtraction = __webpack_require__(4623),
                    attributes = __webpack_require__(2277),
                    methodConfig = __webpack_require__(5759),
                    piiFiltering = __webpack_require__(8668),
                    sessionExtraction = __webpack_require__(6435);
                function createSpanName(method, target) {
                    return target ? `${method} ${target}` : method;
                }
                function buildSentryAttributes(type) {
                    let op, origin;
                    switch (type) {
                        case "request":
                            ((op = attributes.MCP_SERVER_OP_VALUE), (origin = attributes.MCP_FUNCTION_ORIGIN_VALUE));
                            break;
                        case "notification-incoming":
                            ((op = attributes.MCP_NOTIFICATION_CLIENT_TO_SERVER_OP_VALUE), (origin = attributes.MCP_NOTIFICATION_ORIGIN_VALUE));
                            break;
                        case "notification-outgoing":
                            ((op = attributes.MCP_NOTIFICATION_SERVER_TO_CLIENT_OP_VALUE), (origin = attributes.MCP_NOTIFICATION_ORIGIN_VALUE));
                    }
                    return {
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: origin,
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: attributes.MCP_ROUTE_SOURCE_VALUE,
                    };
                }
                function createMcpSpan(config) {
                    let spanName,
                        { type, message, transport, extra, callback, options } = config,
                        { method } = message,
                        params = message.params;
                    if ("request" === type) {
                        let targetInfo = methodConfig.extractTargetInfo(method, params || {});
                        spanName = createSpanName(method, targetInfo.target);
                    } else spanName = method;
                    let rawAttributes = {
                            ...sessionExtraction.buildTransportAttributes(transport, extra),
                            [attributes.MCP_METHOD_NAME_ATTRIBUTE]: method,
                            ...attributeExtraction.buildTypeSpecificAttributes(type, message, params, options?.recordInputs),
                            ...buildSentryAttributes(type),
                        },
                        client = currentScopes.getClient(),
                        sendDefaultPii = !!client?.getOptions().sendDefaultPii,
                        attributes$1 = piiFiltering.filterMcpPiiFromSpanData(rawAttributes, sendDefaultPii);
                    return trace.startSpan({ name: spanName, forceTransaction: !0, attributes: attributes$1 }, callback);
                }
                ((exports.buildMcpServerSpanConfig = function (jsonRpcMessage, transport, extra, options) {
                    let { method } = jsonRpcMessage,
                        params = jsonRpcMessage.params,
                        targetInfo = methodConfig.extractTargetInfo(method, params || {}),
                        spanName = createSpanName(method, targetInfo.target),
                        rawAttributes = {
                            ...sessionExtraction.buildTransportAttributes(transport, extra),
                            [attributes.MCP_METHOD_NAME_ATTRIBUTE]: method,
                            ...attributeExtraction.buildTypeSpecificAttributes("request", jsonRpcMessage, params, options?.recordInputs),
                            ...buildSentryAttributes("request"),
                        },
                        client = currentScopes.getClient(),
                        sendDefaultPii = !!client?.getOptions().sendDefaultPii,
                        attributes$1 = piiFiltering.filterMcpPiiFromSpanData(rawAttributes, sendDefaultPii);
                    return { name: spanName, op: attributes.MCP_SERVER_OP_VALUE, forceTransaction: !0, attributes: attributes$1 };
                }),
                    (exports.createMcpNotificationSpan = function (jsonRpcMessage, transport, extra, options, callback) {
                        return createMcpSpan({ type: "notification-incoming", message: jsonRpcMessage, transport, extra, callback, options });
                    }),
                    (exports.createMcpOutgoingNotificationSpan = function (jsonRpcMessage, transport, options, callback) {
                        return createMcpSpan({ type: "notification-outgoing", message: jsonRpcMessage, transport, options, callback });
                    }));
            }