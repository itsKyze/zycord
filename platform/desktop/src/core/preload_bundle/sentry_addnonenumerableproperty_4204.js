4204(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    browser = __webpack_require__(4647),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431);
                function addNonEnumerableProperty(obj, name, value) {
                    try {
                        Object.defineProperty(obj, name, { value, writable: !0, configurable: !0 });
                    } catch {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Failed to add non-enumerable property "${name}" to object`, obj);
                    }
                }
                function markFunctionWrapped(wrapped, original) {
                    try {
                        let proto = original.prototype || {};
                        ((wrapped.prototype = original.prototype = proto), addNonEnumerableProperty(wrapped, "__sentry_original__", original));
                    } catch {}
                }
                function getOriginalFunction(func) {
                    return func.__sentry_original__;
                }
                function convertToPlainObject(value) {
                    if (is.isError(value)) return { message: value.message, name: value.name, stack: value.stack, ...getOwnProperties(value) };
                    if (!is.isEvent(value)) return value;
                    {
                        let newObj = {
                            type: value.type,
                            target: serializeEventTarget(value.target),
                            currentTarget: serializeEventTarget(value.currentTarget),
                            ...getOwnProperties(value),
                        };
                        return ("u" > typeof CustomEvent && is.isInstanceOf(value, CustomEvent) && (newObj.detail = value.detail), newObj);
                    }
                }
                function serializeEventTarget(target) {
                    try {
                        return is.isElement(target) ? browser.htmlTreeAsString(target) : Object.prototype.toString.call(target);
                    } catch {
                        return "<unknown>";
                    }
                }
                function getOwnProperties(obj) {
                    return "object" == typeof obj && null !== obj ? Object.fromEntries(Object.entries(obj)) : {};
                }
                ((exports.addNonEnumerableProperty = addNonEnumerableProperty),
                    (exports.convertToPlainObject = convertToPlainObject),
                    (exports.dropUndefinedKeys = function (inputValue) {
                        return (function _dropUndefinedKeys(inputValue, memoizationMap) {
                            let constructor;
                            if (null === inputValue || "object" != typeof inputValue) return inputValue;
                            let memoVal = memoizationMap.get(inputValue);
                            if (void 0 !== memoVal) return memoVal;
                            if (Array.isArray(inputValue)) {
                                let returnValue = [];
                                return (
                                    memoizationMap.set(inputValue, returnValue),
                                    inputValue.forEach((value) => {
                                        returnValue.push(_dropUndefinedKeys(value, memoizationMap));
                                    }),
                                    returnValue
                                );
                            }
                            if ((constructor = inputValue.constructor) === Object || void 0 === constructor) {
                                let returnValue = {};
                                return (
                                    memoizationMap.set(inputValue, returnValue),
                                    Object.keys(inputValue).forEach((key) => {
                                        let val = inputValue[key];
                                        void 0 !== val && (returnValue[key] = _dropUndefinedKeys(val, memoizationMap));
                                    }),
                                    returnValue
                                );
                            }
                            return inputValue;
                        })(inputValue, new Map());
                    }),
                    (exports.extractExceptionKeysForMessage = function (exception) {
                        let keys = Object.keys(convertToPlainObject(exception));
                        return (keys.sort(), keys[0] ? keys.join(", ") : "[object has no keys]");
                    }),
                    (exports.fill = function (source, name, replacementFactory) {
                        if (!(name in source)) return;
                        let original = source[name];
                        if ("function" != typeof original) return;
                        let wrapped = replacementFactory(original);
                        "function" == typeof wrapped && markFunctionWrapped(wrapped, original);
                        try {
                            source[name] = wrapped;
                        } catch {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Failed to replace method "${name}" in object`, source);
                        }
                    }),
                    (exports.getOriginalFunction = getOriginalFunction),
                    (exports.markFunctionWrapped = markFunctionWrapped),
                    (exports.objectify = function (wat) {
                        let objectified;
                        switch (!0) {
                            case void 0 == wat:
                                objectified = new String(wat);
                                break;
                            case "symbol" == typeof wat || "bigint" == typeof wat:
                                objectified = Object(wat);
                                break;
                            case is.isPrimitive(wat):
                                objectified = new wat.constructor(wat);
                                break;
                            default:
                                objectified = wat;
                        }
                        return objectified;
                    }),
                    (exports.wrapMethod = function (obj, field, wrapped, enumerable = !0) {
                        let original = obj[field];
                        if ("function" != typeof original) throw Error(`Cannot wrap method: ${field} is not a function`);
                        if (getOriginalFunction(original)) throw Error(`Attempting to wrap method ${field} multiple times`);
                        (markFunctionWrapped(wrapped, original), Object.defineProperty(obj, field, { writable: !0, configurable: !0, enumerable, value: wrapped }));
                    }));
            }