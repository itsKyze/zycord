2101(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.getBreadcrumbLogLevelFromHttpStatusCode = function (statusCode) {
                        if (void 0 !== statusCode) return statusCode >= 400 && statusCode < 500 ? "warning" : statusCode >= 500 ? "error" : void 0;
                    }));
            }