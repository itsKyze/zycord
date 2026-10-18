7431(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let objectToString = Object.prototype.toString;
                function isBuiltin(wat, className) {
                    return objectToString.call(wat) === `[object ${className}]`;
                }
                function isParameterizedString(wat) {
                    return "object" == typeof wat && null !== wat && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
                }
                function isPlainObject(wat) {
                    return isBuiltin(wat, "Object");
                }
                function isInstanceOf(wat, base) {
                    try {
                        return wat instanceof base;
                    } catch {
                        return !1;
                    }
                }
                ((exports.isDOMError = function (wat) {
                    return isBuiltin(wat, "DOMError");
                }),
                    (exports.isDOMException = function (wat) {
                        return isBuiltin(wat, "DOMException");
                    }),
                    (exports.isElement = function (wat) {
                        return "u" > typeof Element && isInstanceOf(wat, Element);
                    }),
                    (exports.isError = function (wat) {
                        switch (objectToString.call(wat)) {
                            case "[object Error]":
                            case "[object Exception]":
                            case "[object DOMException]":
                            case "[object WebAssembly.Exception]":
                                return !0;
                            default:
                                return isInstanceOf(wat, Error);
                        }
                    }),
                    (exports.isErrorEvent = function (wat) {
                        return isBuiltin(wat, "ErrorEvent");
                    }),
                    (exports.isEvent = function (wat) {
                        return "u" > typeof Event && isInstanceOf(wat, Event);
                    }),
                    (exports.isInstanceOf = isInstanceOf),
                    (exports.isParameterizedString = isParameterizedString),
                    (exports.isPlainObject = isPlainObject),
                    (exports.isPrimitive = function (wat) {
                        return null === wat || isParameterizedString(wat) || ("object" != typeof wat && "function" != typeof wat);
                    }),
                    (exports.isRegExp = function (wat) {
                        return isBuiltin(wat, "RegExp");
                    }),
                    (exports.isRequest = function (request) {
                        return "u" > typeof Request && isInstanceOf(request, Request);
                    }),
                    (exports.isString = function (wat) {
                        return isBuiltin(wat, "String");
                    }),
                    (exports.isSyntheticEvent = function (wat) {
                        return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
                    }),
                    (exports.isThenable = function (wat) {
                        return !!(wat?.then && "function" == typeof wat.then);
                    }),
                    (exports.isVueViewModel = function (wat) {
                        return !!("object" == typeof wat && null !== wat && (wat.__isVue || wat._isVue || wat.__v_isVNode));
                    }));
            }