9331(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    object = __webpack_require__(4204),
                    trace = __webpack_require__(6833),
                    attributes = __webpack_require__(2277),
                    correlation = __webpack_require__(8046),
                    errorCapture = __webpack_require__(7572),
                    sessionExtraction = __webpack_require__(6435),
                    sessionManagement = __webpack_require__(3573),
                    spans = __webpack_require__(4063),
                    validation = __webpack_require__(8631);
                ((exports.wrapTransportError = function (transport) {
                    transport.onerror &&
                        object.fill(
                            transport,
                            "onerror",
                            (originalOnError) =>
                                function (error) {
                                    return (
                                        (function (error) {
                                            try {
                                                errorCapture.captureError(error, "transport");
                                            } catch {}
                                        })(error),
                                        originalOnError.call(this, error)
                                    );
                                },
                        );
                }),
                    (exports.wrapTransportOnClose = function (transport) {
                        transport.onclose &&
                            object.fill(
                                transport,
                                "onclose",
                                (originalOnClose) =>
                                    function (...args) {
                                        return (
                                            correlation.cleanupPendingSpansForTransport(transport),
                                            sessionManagement.cleanupSessionDataForTransport(transport),
                                            originalOnClose.call(this, ...args)
                                        );
                                    },
                            );
                    }),
                    (exports.wrapTransportOnMessage = function (transport, options) {
                        transport.onmessage &&
                            object.fill(
                                transport,
                                "onmessage",
                                (originalOnMessage) =>
                                    function (message, extra) {
                                        if (validation.isJsonRpcRequest(message)) {
                                            let initSessionData,
                                                isInitialize = "initialize" === message.method;
                                            if (isInitialize)
                                                try {
                                                    ((initSessionData = sessionExtraction.extractSessionDataFromInitializeRequest(message)),
                                                        sessionManagement.storeSessionDataForTransport(transport, initSessionData));
                                                } catch {}
                                            let isolationScope = currentScopes.getIsolationScope().clone();
                                            return currentScopes.withIsolationScope(isolationScope, () => {
                                                let spanConfig = spans.buildMcpServerSpanConfig(message, transport, extra, options),
                                                    span = trace.startInactiveSpan(spanConfig);
                                                return (
                                                    isInitialize &&
                                                        initSessionData &&
                                                        span.setAttributes({
                                                            ...sessionExtraction.buildClientAttributesFromInfo(initSessionData.clientInfo),
                                                            ...(initSessionData.protocolVersion && {
                                                                [attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE]: initSessionData.protocolVersion,
                                                            }),
                                                        }),
                                                    correlation.storeSpanForRequest(transport, message.id, span, message.method),
                                                    trace.withActiveSpan(span, () => originalOnMessage.call(this, message, extra))
                                                );
                                            });
                                        }
                                        return validation.isJsonRpcNotification(message)
                                            ? spans.createMcpNotificationSpan(message, transport, extra, options, () => originalOnMessage.call(this, message, extra))
                                            : originalOnMessage.call(this, message, extra);
                                    },
                            );
                    }),
                    (exports.wrapTransportSend = function (transport, options) {
                        transport.send &&
                            object.fill(
                                transport,
                                "send",
                                (originalSend) =>
                                    async function (...args) {
                                        let [message] = args;
                                        if (validation.isJsonRpcNotification(message))
                                            return spans.createMcpOutgoingNotificationSpan(message, transport, options, () => originalSend.call(this, ...args));
                                        if (validation.isJsonRpcResponse(message) && null !== message.id && void 0 !== message.id) {
                                            if (
                                                (message.error &&
                                                    (function (errorResponse) {
                                                        try {
                                                            if (
                                                                errorResponse &&
                                                                "object" == typeof errorResponse &&
                                                                "code" in errorResponse &&
                                                                "message" in errorResponse &&
                                                                (-32603 === errorResponse.code || (errorResponse.code >= -32099 && errorResponse.code <= -32e3))
                                                            ) {
                                                                let error = Error(errorResponse.message);
                                                                ((error.name = `JsonRpcError_${errorResponse.code}`), errorCapture.captureError(error, "protocol"));
                                                            }
                                                        } catch {}
                                                    })(message.error),
                                                validation.isValidContentItem(message.result) && (message.result.protocolVersion || message.result.serverInfo))
                                            )
                                                try {
                                                    let serverData = sessionExtraction.extractSessionDataFromInitializeResponse(message.result);
                                                    sessionManagement.updateSessionDataForTransport(transport, serverData);
                                                } catch {}
                                            correlation.completeSpanWithResults(transport, message.id, message.result, options, !!message.error);
                                        }
                                        return originalSend.call(this, ...args);
                                    },
                            );
                    }));
            }