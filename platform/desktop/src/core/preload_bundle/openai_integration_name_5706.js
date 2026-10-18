5706(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let RESPONSES_TOOL_CALL_EVENT_TYPES = [
                        "response.output_item.added",
                        "response.function_call_arguments.delta",
                        "response.function_call_arguments.done",
                        "response.output_item.done",
                    ],
                    RESPONSE_EVENT_TYPES = [
                        "response.created",
                        "response.in_progress",
                        "response.failed",
                        "response.completed",
                        "response.incomplete",
                        "response.queued",
                        "response.output_text.delta",
                        ...RESPONSES_TOOL_CALL_EVENT_TYPES,
                    ];
                ((exports.OPENAI_INTEGRATION_NAME = "OpenAI"),
                    (exports.OPENAI_METHOD_REGISTRY = {
                        "responses.create": { operation: "chat" },
                        "chat.completions.create": { operation: "chat" },
                        "embeddings.create": { operation: "embeddings" },
                        "conversations.create": { operation: "chat" },
                    }),
                    (exports.RESPONSES_TOOL_CALL_EVENT_TYPES = RESPONSES_TOOL_CALL_EVENT_TYPES),
                    (exports.RESPONSE_EVENT_TYPES = RESPONSE_EVENT_TYPES));
            }