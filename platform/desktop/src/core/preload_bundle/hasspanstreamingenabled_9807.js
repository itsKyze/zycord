9807(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.hasSpanStreamingEnabled = function (client) {
                        return "stream" === client.getOptions().traceLifecycle;
                    }));
            }