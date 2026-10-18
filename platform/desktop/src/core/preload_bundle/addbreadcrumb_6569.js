6569(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugLogger = __webpack_require__(2533),
                    time = __webpack_require__(602);
                exports.addBreadcrumb = function (breadcrumb, hint) {
                    let client = currentScopes.getClient(),
                        isolationScope = currentScopes.getIsolationScope();
                    if (!client) return;
                    let { beforeBreadcrumb = null, maxBreadcrumbs = 100 } = client.getOptions();
                    if (maxBreadcrumbs <= 0) return;
                    let mergedBreadcrumb = { timestamp: time.dateTimestampInSeconds(), ...breadcrumb },
                        finalBreadcrumb = beforeBreadcrumb ? debugLogger.consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
                    null !== finalBreadcrumb &&
                        (client.emit && client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint), isolationScope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs));
                };
            }