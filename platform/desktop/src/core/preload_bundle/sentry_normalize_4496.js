4496(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431),
                    object = __webpack_require__(4204),
                    stacktrace = __webpack_require__(7970);
                function normalize(input, depth = 100, maxProperties = Infinity) {
                    try {
                        return (function visit(
                            key,
                            value,
                            depth = Infinity,
                            maxProperties = Infinity,
                            memo = (function () {
                                let inner = new WeakSet();
                                return [
                                    function (obj) {
                                        return !!inner.has(obj) || (inner.add(obj), !1);
                                    },
                                    function (obj) {
                                        inner.delete(obj);
                                    },
                                ];
                            })(),
                        ) {
                            let [memoize, unmemoize] = memo;
                            if (null == value || ["boolean", "string"].includes(typeof value) || ("number" == typeof value && Number.isFinite(value))) return value;
                            let stringified = (function (key, value) {
                                try {
                                    var value1;
                                    let prototype;
                                    if ("domain" === key && value && "object" == typeof value && value._events) return "[Domain]";
                                    if ("domainEmitter" === key) return "[DomainEmitter]";
                                    if ("u" > typeof global && value === global) return "[Global]";
                                    if ("u" > typeof window && value === window) return "[Window]";
                                    if ("u" > typeof document && value === document) return "[Document]";
                                    if (is.isVueViewModel(value)) return stacktrace.getVueInternalName(value);
                                    if (is.isSyntheticEvent(value)) return "[SyntheticEvent]";
                                    if ("number" == typeof value && !Number.isFinite(value)) return `[${value}]`;
                                    if ("function" == typeof value) return `[Function: ${stacktrace.getFunctionName(value)}]`;
                                    if ("symbol" == typeof value) return `[${String(value)}]`;
                                    if ("bigint" == typeof value) return `[BigInt: ${String(value)}]`;
                                    let objName =
                                        ((value1 = value), (prototype = Object.getPrototypeOf(value1)), prototype?.constructor ? prototype.constructor.name : "null prototype");
                                    if (/^HTML(\w*)Element$/.test(objName)) return `[HTMLElement: ${objName}]`;
                                    return `[object ${objName}]`;
                                } catch (err) {
                                    return `**non-serializable** (${err})`;
                                }
                            })(key, value);
                            if (!stringified.startsWith("[object ")) return stringified;
                            if (value.__sentry_skip_normalization__) return value;
                            let remainingDepth = "number" == typeof value.__sentry_override_normalization_depth__ ? value.__sentry_override_normalization_depth__ : depth;
                            if (0 === remainingDepth) return stringified.replace("object ", "");
                            if (memoize(value)) return "[Circular ~]";
                            if (value && "function" == typeof value.toJSON)
                                try {
                                    let jsonValue = value.toJSON();
                                    return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
                                } catch {}
                            let normalized = Array.isArray(value) ? [] : {},
                                numAdded = 0,
                                visitable = object.convertToPlainObject(value);
                            for (let visitKey in visitable) {
                                if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) continue;
                                if (numAdded >= maxProperties) {
                                    normalized[visitKey] = "[MaxProperties ~]";
                                    break;
                                }
                                let visitValue = visitable[visitKey];
                                ((normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo)), numAdded++);
                            }
                            return (unmemoize(value), normalized);
                        })("", input, depth, maxProperties);
                    } catch (err) {
                        return { ERROR: `**non-serializable** (${err})` };
                    }
                }
                ((exports.normalize = normalize),
                    (exports.normalizeToSize = function normalizeToSize(object, depth = 3, maxSize = 102400) {
                        let normalized = normalize(object, depth);
                        return ~-encodeURI(JSON.stringify(normalized)).split(/%..|./).length > maxSize ? normalizeToSize(object, depth - 1, maxSize) : normalized;
                    }),
                    (exports.normalizeUrlToBase = function (url, basePath) {
                        let escapedBase = basePath.replace(/\\/g, "/").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"),
                            newUrl = url;
                        try {
                            newUrl = decodeURI(url);
                        } catch {}
                        return newUrl
                            .replace(/\\/g, "/")
                            .replace(/webpack:\/?/g, "")
                            .replace(RegExp(`(file://)?/*${escapedBase}/*`, "ig"), "app:///");
                    }));
            }