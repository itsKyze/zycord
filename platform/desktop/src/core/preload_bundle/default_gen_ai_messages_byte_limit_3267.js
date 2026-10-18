3267(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let mediaStripping = __webpack_require__(6773),
                    utf8Bytes = (text) => new TextEncoder().encode(text).length,
                    jsonBytes = (value) => utf8Bytes(JSON.stringify(value));
                function truncateTextByBytes(text, maxBytes) {
                    if (utf8Bytes(text) <= maxBytes) return text;
                    let low = 0,
                        high = text.length,
                        bestFit = "";
                    for (; low <= high;) {
                        let mid = Math.floor((low + high) / 2),
                            candidate = text.slice(0, mid);
                        utf8Bytes(candidate) <= maxBytes ? ((bestFit = candidate), (low = mid + 1)) : (high = mid - 1);
                    }
                    return bestFit;
                }
                function withItemText(item, text) {
                    return "string" == typeof item ? text : { ...item, text };
                }
                function isContentArrayMessage(message) {
                    return null !== message && "object" == typeof message && "content" in message && Array.isArray(message.content);
                }
                function isPartsMessage(message) {
                    return null !== message && "object" == typeof message && "parts" in message && Array.isArray(message.parts) && message.parts.length > 0;
                }
                ((exports.DEFAULT_GEN_AI_MESSAGES_BYTE_LIMIT = 2e4),
                    (exports.truncateGenAiMessages = function (messages) {
                        if (!Array.isArray(messages) || 0 === messages.length) return messages;
                        let stripped = (function stripInlineMediaFromMessages(messages) {
                                return messages.map((message) => {
                                    let newMessage;
                                    return (
                                        message &&
                                            "object" == typeof message &&
                                            (isContentArrayMessage(message)
                                                ? (newMessage = { ...message, content: stripInlineMediaFromMessages(message.content) })
                                                : "content" in message &&
                                                  mediaStripping.isContentMedia(message.content) &&
                                                  (newMessage = { ...message, content: mediaStripping.stripInlineMediaFromSingleMessage(message.content) }),
                                            isPartsMessage(message) && (newMessage = { ...(newMessage ?? message), parts: stripInlineMediaFromMessages(message.parts) }),
                                            mediaStripping.isContentMedia(newMessage)
                                                ? (newMessage = mediaStripping.stripInlineMediaFromSingleMessage(newMessage))
                                                : mediaStripping.isContentMedia(message) && (newMessage = mediaStripping.stripInlineMediaFromSingleMessage(message))),
                                        newMessage ?? message
                                    );
                                });
                            })([messages[messages.length - 1]]),
                            strippedMessage = stripped[0];
                        return 19998 >= jsonBytes(strippedMessage)
                            ? stripped
                            : (function (message) {
                                  if (!message) return [];
                                  if ("string" == typeof message) {
                                      let truncated = truncateTextByBytes(message, 19998);
                                      return truncated ? [truncated] : [];
                                  }
                                  if ("object" != typeof message) return [];
                                  if (null !== message && "object" == typeof message && "content" in message && "string" == typeof message.content) {
                                      let availableForContent = 19998 - jsonBytes({ ...message, content: "" });
                                      if (availableForContent <= 0) return [];
                                      let truncatedContent = truncateTextByBytes(message.content, availableForContent);
                                      return [{ ...message, content: truncatedContent }];
                                  }
                                  return isContentArrayMessage(message) || isPartsMessage(message)
                                      ? (function (message, maxBytes) {
                                            let { key, items } =
                                                "parts" in message && Array.isArray(message.parts)
                                                    ? { key: "parts", items: message.parts }
                                                    : "content" in message && Array.isArray(message.content)
                                                      ? { key: "content", items: message.content }
                                                      : { key: null, items: [] };
                                            if (null === key || 0 === items.length) return [];
                                            let emptyItems = items.map((item) => withItemText(item, "")),
                                                remainingBytes = maxBytes - jsonBytes({ ...message, [key]: emptyItems });
                                            if (remainingBytes <= 0) return [];
                                            let includedItems = [];
                                            for (let item of items) {
                                                let text = "string" == typeof item ? item : "text" in item && "string" == typeof item.text ? item.text : "",
                                                    textSize = utf8Bytes(text);
                                                if (textSize <= remainingBytes) (includedItems.push(item), (remainingBytes -= textSize));
                                                else if (0 === includedItems.length) {
                                                    let truncated = truncateTextByBytes(text, remainingBytes);
                                                    truncated && includedItems.push(withItemText(item, truncated));
                                                    break;
                                                } else break;
                                            }
                                            return includedItems.length <= 0 ? [] : [{ ...message, [key]: includedItems }];
                                        })(message, 19998)
                                      : [];
                              })(strippedMessage);
                    }),
                    (exports.truncateGenAiStringInput = function (input) {
                        return truncateTextByBytes(input, 2e4);
                    }));
            }