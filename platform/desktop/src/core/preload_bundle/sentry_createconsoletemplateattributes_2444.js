2444(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431),
                    normalize = __webpack_require__(4496),
                    worldwide = __webpack_require__(3712);
                function safeJoinConsoleArgs(values, normalizeDepth, normalizeMaxBreadth) {
                    return values
                        .map((value) => (is.isPrimitive(value) ? String(value) : JSON.stringify(normalize.normalize(value, normalizeDepth, normalizeMaxBreadth))))
                        .join(" ");
                }
                ((exports.createConsoleTemplateAttributes = function (firstArg, followingArgs) {
                    let attributes = {},
                        template = Array(followingArgs.length).fill("{}").join(" ");
                    return (
                        (attributes["sentry.message.template"] = `${firstArg} ${template}`),
                        followingArgs.forEach((arg, index) => {
                            attributes[`sentry.message.parameter.${index}`] = arg;
                        }),
                        attributes
                    );
                }),
                    (exports.formatConsoleArgs = function (values, normalizeDepth, normalizeMaxBreadth) {
                        return "util" in worldwide.GLOBAL_OBJ && "function" == typeof worldwide.GLOBAL_OBJ.util.format
                            ? worldwide.GLOBAL_OBJ.util.format(...values)
                            : safeJoinConsoleArgs(values, normalizeDepth, normalizeMaxBreadth);
                    }),
                    (exports.hasConsoleSubstitutions = function (str) {
                        return /%[sdifocO]/.test(str);
                    }),
                    (exports.safeJoinConsoleArgs = safeJoinConsoleArgs));
            }