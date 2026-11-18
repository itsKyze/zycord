7212(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let breadcrumbs = __webpack_require__(6569),
                    currentScopes = __webpack_require__(7121),
                    console1 = __webpack_require__(6110),
                    integration = __webpack_require__(5579),
                    debugLogger = __webpack_require__(2533),
                    severity = __webpack_require__(2548),
                    string = __webpack_require__(2634),
                    worldwide = __webpack_require__(3712),
                    consoleIntegration = integration.defineIntegration((options = {}) => {
                        let levels = new Set(options.levels || debugLogger.CONSOLE_LEVELS);
                        return {
                            name: "Console",
                            setup(client) {
                                console1.addConsoleInstrumentationHandler(({ args, level }) => {
                                    currentScopes.getClient() === client && levels.has(level) && addConsoleBreadcrumb(level, args);
                                });
                            },
                        };
                    });
                function addConsoleBreadcrumb(level, args) {
                    let breadcrumb = {
                        category: "console",
                        data: { arguments: args, logger: "console" },
                        level: severity.severityLevelFromString(level),
                        message: formatConsoleArgs(args),
                    };
                    if ("assert" === level)
                        if (!1 !== args[0]) return;
                        else {
                            let assertionArgs = args.slice(1);
                            ((breadcrumb.message = assertionArgs.length > 0 ? `Assertion failed: ${formatConsoleArgs(assertionArgs)}` : "Assertion failed"),
                                (breadcrumb.data.arguments = assertionArgs));
                        }
                    breadcrumbs.addBreadcrumb(breadcrumb, { input: args, level });
                }
                function formatConsoleArgs(values) {
                    return "util" in worldwide.GLOBAL_OBJ && "function" == typeof worldwide.GLOBAL_OBJ.util.format
                        ? worldwide.GLOBAL_OBJ.util.format(...values)
                        : string.safeJoin(values, " ");
                }
                ((exports.addConsoleBreadcrumb = addConsoleBreadcrumb), (exports.consoleIntegration = consoleIntegration));
            }