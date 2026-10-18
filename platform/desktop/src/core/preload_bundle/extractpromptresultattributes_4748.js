4748(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(2277),
                    validation = __webpack_require__(8631);
                ((exports.extractPromptResultAttributes = function (result, recordOutputs) {
                    let attributes$1 = {};
                    if (!validation.isValidContentItem(result)) return attributes$1;
                    if (
                        (recordOutputs && "string" == typeof result.description && (attributes$1[attributes.MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE] = result.description),
                        Array.isArray(result.messages) && ((attributes$1[attributes.MCP_PROMPT_RESULT_MESSAGE_COUNT_ATTRIBUTE] = result.messages.length), recordOutputs))
                    ) {
                        let messages = result.messages;
                        for (let [i, message] of messages.entries()) {
                            var key, value;
                            if (!validation.isValidContentItem(message)) continue;
                            let prefix = 1 === messages.length ? "mcp.prompt.result" : `mcp.prompt.result.${i}`;
                            if (
                                ((key = "role"),
                                "string" == typeof (value = message.role) && (attributes$1[1 === messages.length ? `${prefix}.message_${key}` : `${prefix}.${key}`] = value),
                                validation.isValidContentItem(message.content))
                            ) {
                                let content = message.content;
                                "string" == typeof content.text && (attributes$1[1 === messages.length ? `${prefix}.message_content` : `${prefix}.content`] = content.text);
                            }
                        }
                    }
                    return attributes$1;
                }),
                    (exports.extractToolResultAttributes = function (result, recordOutputs) {
                        if (!validation.isValidContentItem(result)) return {};
                        let attributes$1 = Array.isArray(result.content)
                            ? (function (content, includeContent) {
                                  let attributes$1 = { [attributes.MCP_TOOL_RESULT_CONTENT_COUNT_ATTRIBUTE]: content.length };
                                  for (let [i, item] of content.entries()) {
                                      if (!validation.isValidContentItem(item)) continue;
                                      let prefix = 1 === content.length ? "mcp.tool.result" : `mcp.tool.result.${i}`;
                                      if (("string" == typeof item.type && (attributes$1[`${prefix}.content_type`] = item.type), includeContent)) {
                                          let safeSet = (key, value) => {
                                              "string" == typeof value && (attributes$1[`${prefix}.${key}`] = value);
                                          };
                                          (safeSet("mime_type", item.mimeType),
                                              safeSet("uri", item.uri),
                                              safeSet("name", item.name),
                                              "string" == typeof item.text && (attributes$1[`${prefix}.content`] = item.text),
                                              "string" == typeof item.data && (attributes$1[`${prefix}.data_size`] = item.data.length));
                                          let resource = item.resource;
                                          validation.isValidContentItem(resource) && (safeSet("resource_uri", resource.uri), safeSet("resource_mime_type", resource.mimeType));
                                      }
                                  }
                                  return attributes$1;
                              })(result.content, recordOutputs)
                            : {};
                        return ("boolean" == typeof result.isError && (attributes$1[attributes.MCP_TOOL_RESULT_IS_ERROR_ATTRIBUTE] = result.isError), attributes$1);
                    }));
            }