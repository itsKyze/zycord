8668(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(2277),
                    NETWORK_PII_ATTRIBUTES = new Set([attributes.CLIENT_ADDRESS_ATTRIBUTE, attributes.CLIENT_PORT_ATTRIBUTE, attributes.MCP_RESOURCE_URI_ATTRIBUTE]);
                exports.filterMcpPiiFromSpanData = function (spanData, sendDefaultPii) {
                    return sendDefaultPii ? spanData : Object.entries(spanData).reduce((acc, [key, value]) => (NETWORK_PII_ATTRIBUTES.has(key) || (acc[key] = value), acc), {});
                };
            }