3381(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                exports.showReportDialog = function (options = {}) {
                    let optionalDocument = helpers.WINDOW.document,
                        injectionPoint = optionalDocument?.head || optionalDocument?.body;
                    if (!injectionPoint) {
                        debugBuild.DEBUG_BUILD && core.debug.error("[showReportDialog] Global document not defined");
                        return;
                    }
                    let scope = core.getCurrentScope(),
                        client = core.getClient(),
                        dsn = client?.getDsn();
                    if (!dsn) {
                        debugBuild.DEBUG_BUILD && core.debug.error("[showReportDialog] DSN not configured");
                        return;
                    }
                    let mergedOptions = { ...options, user: { ...scope.getUser(), ...options.user }, eventId: options.eventId || core.lastEventId() },
                        script = helpers.WINDOW.document.createElement("script");
                    ((script.async = !0), (script.crossOrigin = "anonymous"), (script.src = core.getReportDialogEndpoint(dsn, mergedOptions)));
                    let { onLoad, onClose } = mergedOptions;
                    if ((onLoad && (script.onload = onLoad), onClose)) {
                        let reportDialogClosedMessageHandler = (event) => {
                            if ("__sentry_reportdialog_closed__" === event.data)
                                try {
                                    onClose();
                                } finally {
                                    helpers.WINDOW.removeEventListener("message", reportDialogClosedMessageHandler);
                                }
                        };
                        helpers.WINDOW.addEventListener("message", reportDialogClosedMessageHandler);
                    }
                    injectionPoint.appendChild(script);
                };
            }