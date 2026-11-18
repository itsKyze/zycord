4924(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431);
                function isAttributeObject(maybeObj) {
                    return "object" == typeof maybeObj && null != maybeObj && !Array.isArray(maybeObj) && Object.keys(maybeObj).includes("value");
                }
                function attributeValueToTypedAttributeValue(rawValue, useFallback) {
                    let { value, unit } = isAttributeObject(rawValue) ? rawValue : { value: rawValue, unit: void 0 },
                        attributeValue = (function (value) {
                            let primitiveType =
                                "string" == typeof value
                                    ? "string"
                                    : "boolean" == typeof value
                                      ? "boolean"
                                      : "number" != typeof value || Number.isNaN(value)
                                        ? null
                                        : Number.isInteger(value)
                                          ? "integer"
                                          : "double";
                            if (primitiveType) return { value, type: primitiveType };
                        })(value),
                        checkedUnit = unit && "string" == typeof unit ? { unit } : {};
                    if (attributeValue) return { ...attributeValue, ...checkedUnit };
                    if (!useFallback || ("skip-undefined" === useFallback && void 0 === value)) return;
                    let stringValue = "";
                    try {
                        stringValue = JSON.stringify(value) ?? "";
                    } catch {}
                    return { value: stringValue, type: "string", ...checkedUnit };
                }
                function estimatePrimitiveSizeInBytes(value) {
                    return "string" == typeof value ? 2 * value.length : "boolean" == typeof value ? 4 : 8 * ("number" == typeof value);
                }
                ((exports.attributeValueToTypedAttributeValue = attributeValueToTypedAttributeValue),
                    (exports.estimateTypedAttributesSizeInBytes = function (attributes) {
                        if (!attributes) return 0;
                        let weight = 0;
                        for (let [key, attr] of Object.entries(attributes)) {
                            ((weight += 2 * key.length), (weight += 2 * attr.type.length), (weight += (attr.unit?.length ?? 0) * 2));
                            let val = attr.value;
                            Array.isArray(val)
                                ? (weight += estimatePrimitiveSizeInBytes(val[0]) * val.length)
                                : is.isPrimitive(val)
                                  ? (weight += estimatePrimitiveSizeInBytes(val))
                                  : (weight += 100);
                        }
                        return weight;
                    }),
                    (exports.isAttributeObject = isAttributeObject),
                    (exports.serializeAttributes = function (attributes, fallback = !1) {
                        let serializedAttributes = {};
                        for (let [key, value] of Object.entries(attributes ?? {})) {
                            let typedValue = attributeValueToTypedAttributeValue(value, fallback);
                            typedValue && (serializedAttributes[key] = typedValue);
                        }
                        return serializedAttributes;
                    }));
            }