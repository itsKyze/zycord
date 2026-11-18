4418(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    semanticAttributes = __webpack_require__(3052),
                    trace = __webpack_require__(6833),
                    genAiAttributes = __webpack_require__(3968),
                    utils = __webpack_require__(782),
                    constants = __webpack_require__(227);
                function instrumentEmbeddingMethod(originalMethod, options = {}) {
                    let { recordInputs } = utils.resolveAIRecordingOptions(options);
                    return new Proxy(originalMethod, {
                        apply(target, thisArg, args) {
                            let embeddingsInstance,
                                attributes,
                                name,
                                attributes1 =
                                    ((embeddingsInstance = thisArg ?? {}),
                                    ((attributes = {
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: constants.LANGCHAIN_ORIGIN,
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: genAiAttributes.GEN_AI_EMBEDDINGS_OPERATION_ATTRIBUTE,
                                        [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: "embeddings",
                                        [genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE]: embeddingsInstance.model ?? "unknown",
                                    })[genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE] = (name = embeddingsInstance.constructor?.name ?? "").includes("OpenAI")
                                        ? "openai"
                                        : name.includes("Google")
                                          ? "google_genai"
                                          : name.includes("Mistral")
                                            ? "mistralai"
                                            : name.includes("Vertex")
                                              ? "google_vertexai"
                                              : name.includes("Bedrock")
                                                ? "aws_bedrock"
                                                : name.includes("Ollama")
                                                  ? "ollama"
                                                  : name.includes("Cloudflare")
                                                    ? "cloudflare"
                                                    : name.includes("Cohere")
                                                      ? "cohere"
                                                      : "langchain"),
                                    "dimensions" in embeddingsInstance && (attributes[genAiAttributes.GEN_AI_REQUEST_DIMENSIONS_ATTRIBUTE] = embeddingsInstance.dimensions),
                                    "encodingFormat" in embeddingsInstance &&
                                        (attributes[genAiAttributes.GEN_AI_REQUEST_ENCODING_FORMAT_ATTRIBUTE] = embeddingsInstance.encodingFormat),
                                    attributes),
                                modelName = attributes1[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] || "unknown";
                            if (recordInputs) {
                                let input = args[0];
                                null != input && (attributes1[genAiAttributes.GEN_AI_EMBEDDINGS_INPUT_ATTRIBUTE] = "string" == typeof input ? input : JSON.stringify(input));
                            }
                            return trace.startSpan({ name: `embeddings ${modelName}`, op: genAiAttributes.GEN_AI_EMBEDDINGS_OPERATION_ATTRIBUTE, attributes: attributes1 }, () =>
                                Reflect.apply(target, thisArg, args).then(void 0, (error) => {
                                    throw (_exports.captureException(error, { mechanism: { handled: !1, type: "auto.ai.langchain" } }), error);
                                }),
                            );
                        },
                    });
                }
                ((exports.instrumentEmbeddingMethod = instrumentEmbeddingMethod),
                    (exports.instrumentLangChainEmbeddings = function (instance, options) {
                        return (
                            "function" == typeof instance.embedQuery && (instance.embedQuery = instrumentEmbeddingMethod(instance.embedQuery, options)),
                            "function" == typeof instance.embedDocuments && (instance.embedDocuments = instrumentEmbeddingMethod(instance.embedDocuments, options)),
                            instance
                        );
                    }));
            }