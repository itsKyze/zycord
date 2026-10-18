6261(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712);
                exports.vercelWaitUntil = function (task) {
                    if ("string" != typeof EdgeRuntime) return;
                    let vercelRequestContextGlobal = worldwide.GLOBAL_OBJ[Symbol.for("@vercel/request-context")],
                        ctx = vercelRequestContextGlobal?.get?.();
                    ctx?.waitUntil && ctx.waitUntil(task);
                };
            }