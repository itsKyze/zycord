1554(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.contentUnionToMessages = function contentUnionToMessages(content, role = "user") {
                        return "string" == typeof content
                            ? [{ role, content }]
                            : Array.isArray(content)
                              ? content.flatMap((content) => contentUnionToMessages(content, role))
                              : "object" == typeof content && content
                                ? "role" in content && "string" == typeof content.role
                                    ? [content]
                                    : "parts" in content
                                      ? [{ ...content, role }]
                                      : [{ role, content }]
                                : [];
                    }));
            }