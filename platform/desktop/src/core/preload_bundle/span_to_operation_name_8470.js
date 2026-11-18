8470(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let toolCallSpanContextMap = new Map();
                ((exports.SPAN_TO_OPERATION_NAME = new Map([
                    ["ai.generateText", "invoke_agent"],
                    ["ai.streamText", "invoke_agent"],
                    ["ai.generateObject", "invoke_agent"],
                    ["ai.streamObject", "invoke_agent"],
                    ["ai.generateText.doGenerate", "generate_content"],
                    ["ai.streamText.doStream", "generate_content"],
                    ["ai.generateObject.doGenerate", "generate_content"],
                    ["ai.streamObject.doStream", "generate_content"],
                    ["ai.embed.doEmbed", "embeddings"],
                    ["ai.embedMany.doEmbed", "embeddings"],
                    ["ai.rerank.doRerank", "rerank"],
                    ["ai.toolCall", "execute_tool"],
                ])),
                    (exports.toolCallSpanContextMap = toolCallSpanContextMap));
            }