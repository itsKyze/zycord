71(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    integration = __webpack_require__(5579),
                    semanticAttributes = __webpack_require__(3052),
                    spanUtils = __webpack_require__(470);
                exports.conversationIdIntegration = integration.defineIntegration(() => ({
                    name: "ConversationId",
                    setup(client) {
                        client.on("spanStart", (span) => {
                            let scopeData = currentScopes.getCurrentScope().getScopeData(),
                                isolationScopeData = currentScopes.getIsolationScope().getScopeData(),
                                conversationId = scopeData.conversationId || isolationScopeData.conversationId;
                            if (conversationId) {
                                let { op, data: attributes, description: name } = spanUtils.spanToJSON(span);
                                if (!op?.startsWith("gen_ai.") && !attributes["ai.operationId"] && !name?.startsWith("ai.")) return;
                                span.setAttribute(semanticAttributes.GEN_AI_CONVERSATION_ID_ATTRIBUTE, conversationId);
                            }
                        });
                    },
                }));
            }