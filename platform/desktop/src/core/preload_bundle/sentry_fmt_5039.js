5039(__unused_rspack_module, exports) {
                function parameterize(strings, ...values) {
                    let formatted = new String(String.raw(strings, ...values));
                    return (
                        (formatted.__sentry_template_string__ = strings.join("\0").replace(/%/g, "%%").replace(/\0/g, "%s")),
                        (formatted.__sentry_template_values__ = values),
                        formatted
                    );
                }
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }), (exports.fmt = parameterize), (exports.parameterize = parameterize));
            }