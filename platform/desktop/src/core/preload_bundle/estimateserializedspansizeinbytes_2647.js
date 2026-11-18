2647(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let attributes = __webpack_require__(4924);
                exports.estimateSerializedSpanSizeInBytes = function (span) {
                    let weight;
                    if (((weight = 156 + 2 * span.name.length + attributes.estimateTypedAttributesSizeInBytes(span.attributes)), span.links && span.links.length > 0)) {
                        let firstLink = span.links[0],
                            attributes$1 = firstLink?.attributes;
                        weight += (100 + (attributes$1 ? attributes.estimateTypedAttributesSizeInBytes(attributes$1) : 0)) * span.links.length;
                    }
                    return weight;
                };
            }