4012(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _exports = __webpack_require__(6082),
                    debugLogger = __webpack_require__(2533),
                    vercelWaitUntil = __webpack_require__(6261),
                    worldwide = __webpack_require__(3712);
                async function flushWithTimeout(timeout) {
                    try {
                        (debugLogger.debug.log("Flushing events..."), await _exports.flush(timeout), debugLogger.debug.log("Done flushing events"));
                    } catch (e) {
                        debugLogger.debug.log("Error while flushing events:\n", e);
                    }
                }
                exports.flushIfServerless = async function (params = {}) {
                    let { timeout = 2e3 } = params;
                    "cloudflareWaitUntil" in params && "function" == typeof params?.cloudflareWaitUntil
                        ? params.cloudflareWaitUntil(flushWithTimeout(timeout))
                        : "cloudflareCtx" in params && "function" == typeof params.cloudflareCtx?.waitUntil
                          ? params.cloudflareCtx.waitUntil(flushWithTimeout(timeout))
                          : worldwide.GLOBAL_OBJ[Symbol.for("@vercel/request-context")]
                            ? vercelWaitUntil.vercelWaitUntil(flushWithTimeout(timeout))
                            : "u" < typeof process ||
                              ((process.env.FUNCTIONS_WORKER_RUNTIME ||
                                  process.env.LAMBDA_TASK_ROOT ||
                                  process.env.K_SERVICE ||
                                  process.env.CF_PAGES ||
                                  process.env.VERCEL ||
                                  process.env.NETLIFY) &&
                                  (await flushWithTimeout(timeout)));
                };
            }