3962(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    WINDOW = core.GLOBAL_OBJ,
                    SETUP_CLIENTS = new WeakMap();
                exports.reportingObserverIntegration = core.defineIntegration((options = {}) => {
                    let types = options.types || ["crash", "deprecation", "intervention"];
                    function handler(reports) {
                        if (SETUP_CLIENTS.has(core.getClient()))
                            for (let report of reports)
                                core.withScope((scope) => {
                                    scope.setExtra("url", report.url);
                                    let label = `ReportingObserver [${report.type}]`,
                                        details = "No details available";
                                    if (report.body) {
                                        let plainBody = {};
                                        for (let prop in report.body) plainBody[prop] = report.body[prop];
                                        if ((scope.setExtra("body", plainBody), "crash" === report.type)) {
                                            let body = report.body;
                                            details = [body.crashId || "", body.reason || ""].join(" ").trim() || details;
                                        } else details = report.body.message || details;
                                    }
                                    core.captureMessage(`${label}: ${details}`);
                                });
                    }
                    return {
                        name: "ReportingObserver",
                        setupOnce() {
                            core.supportsReportingObserver() && new WINDOW.ReportingObserver(handler, { buffered: !0, types }).observe();
                        },
                        setup(client) {
                            SETUP_CLIENTS.set(client, !0);
                        },
                    };
                });
            }