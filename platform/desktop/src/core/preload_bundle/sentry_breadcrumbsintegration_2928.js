2928(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                exports.breadcrumbsIntegration = core.defineIntegration((options = {}) => {
                    let _options = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...options };
                    return {
                        name: "Breadcrumbs",
                        setup(client) {
                            var client1, client2, dom, client3, client4, client5, client6;
                            (_options.console &&
                                core.addConsoleInstrumentationHandler(
                                    ((client1 = client),
                                    function (handlerData) {
                                        if (core.getClient() !== client1) return;
                                        let breadcrumb = {
                                            category: "console",
                                            data: { arguments: handlerData.args, logger: "console" },
                                            level: core.severityLevelFromString(handlerData.level),
                                            message: core.safeJoin(handlerData.args, " "),
                                        };
                                        if ("assert" === handlerData.level)
                                            if (!1 !== handlerData.args[0]) return;
                                            else
                                                ((breadcrumb.message = `Assertion failed: ${core.safeJoin(handlerData.args.slice(1), " ") || "console.assert"}`),
                                                    (breadcrumb.data.arguments = handlerData.args.slice(1)));
                                        core.addBreadcrumb(breadcrumb, { input: handlerData.args, level: handlerData.level });
                                    }),
                                ),
                                _options.dom &&
                                    browserUtils.addClickKeypressInstrumentationHandler(
                                        ((client2 = client),
                                        (dom = _options.dom),
                                        function (handlerData) {
                                            let target, componentName;
                                            if (core.getClient() !== client2) return;
                                            let keyAttrs = "object" == typeof dom ? dom.serializeAttribute : void 0,
                                                maxStringLength = "object" == typeof dom && "number" == typeof dom.maxStringLength ? dom.maxStringLength : void 0;
                                            (maxStringLength &&
                                                maxStringLength > 1024 &&
                                                (debugBuild.DEBUG_BUILD &&
                                                    core.debug.warn(
                                                        `\`dom.maxStringLength\` cannot exceed 1024, but a value of ${maxStringLength} was configured. Sentry will use 1024 instead.`,
                                                    ),
                                                (maxStringLength = 1024)),
                                                "string" == typeof keyAttrs && (keyAttrs = [keyAttrs]));
                                            try {
                                                var event;
                                                let event1 = handlerData.event,
                                                    element = (event = event1) && event.target ? event1.target : event1;
                                                ((target = core.htmlTreeAsString(element, { keyAttrs, maxStringLength })), (componentName = core.getComponentName(element)));
                                            } catch {
                                                target = "<unknown>";
                                            }
                                            if (0 === target.length) return;
                                            let breadcrumb = { category: `ui.${handlerData.name}`, message: target };
                                            (componentName && (breadcrumb.data = { "ui.component_name": componentName }),
                                                core.addBreadcrumb(breadcrumb, { event: handlerData.event, name: handlerData.name, global: handlerData.global }));
                                        }),
                                    ),
                                _options.xhr &&
                                    browserUtils.addXhrInstrumentationHandler(
                                        ((client3 = client),
                                        function (handlerData) {
                                            if (core.getClient() !== client3) return;
                                            let { startTimestamp, endTimestamp } = handlerData,
                                                sentryXhrData = handlerData.xhr[browserUtils.SENTRY_XHR_DATA_KEY];
                                            if (!startTimestamp || !endTimestamp || !sentryXhrData) return;
                                            let { method, url, status_code, body } = sentryXhrData,
                                                hint = { xhr: handlerData.xhr, input: body, startTimestamp, endTimestamp },
                                                breadcrumb = {
                                                    category: "xhr",
                                                    data: { method, url, status_code },
                                                    type: "http",
                                                    level: core.getBreadcrumbLogLevelFromHttpStatusCode(status_code),
                                                };
                                            (client3.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), core.addBreadcrumb(breadcrumb, hint));
                                        }),
                                    ),
                                _options.fetch &&
                                    core.addFetchInstrumentationHandler(
                                        ((client4 = client),
                                        function (handlerData) {
                                            if (core.getClient() !== client4) return;
                                            let { startTimestamp, endTimestamp } = handlerData;
                                            if (endTimestamp && (!handlerData.fetchData.url.match(/sentry_key/) || "POST" !== handlerData.fetchData.method))
                                                if (handlerData.error) {
                                                    let hint = { data: handlerData.error, input: handlerData.args, startTimestamp, endTimestamp },
                                                        breadcrumb = { category: "fetch", data: handlerData.fetchData, level: "error", type: "http" };
                                                    (client4.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), core.addBreadcrumb(breadcrumb, hint));
                                                } else {
                                                    let response = handlerData.response,
                                                        data = { ...handlerData.fetchData, status_code: response?.status },
                                                        hint = { input: handlerData.args, response, startTimestamp, endTimestamp },
                                                        breadcrumb = {
                                                            category: "fetch",
                                                            data,
                                                            type: "http",
                                                            level: core.getBreadcrumbLogLevelFromHttpStatusCode(data.status_code),
                                                        };
                                                    (client4.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), core.addBreadcrumb(breadcrumb, hint));
                                                }
                                        }),
                                    ),
                                _options.history &&
                                    browserUtils.addHistoryInstrumentationHandler(
                                        ((client5 = client),
                                        function (handlerData) {
                                            if (core.getClient() !== client5) return;
                                            let from = handlerData.from,
                                                to = handlerData.to,
                                                parsedLoc = core.parseUrl(helpers.WINDOW.location.href),
                                                parsedFrom = from ? core.parseUrl(from) : void 0,
                                                parsedTo = core.parseUrl(to);
                                            (parsedFrom?.path || (parsedFrom = parsedLoc),
                                                parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host && (to = parsedTo.relative),
                                                parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host && (from = parsedFrom.relative),
                                                core.addBreadcrumb({ category: "navigation", data: { from, to } }));
                                        }),
                                    ),
                                _options.sentry &&
                                    client.on(
                                        "beforeSendEvent",
                                        ((client6 = client),
                                        function (event) {
                                            core.getClient() === client6 &&
                                                core.addBreadcrumb(
                                                    {
                                                        category: `sentry.${"transaction" === event.type ? "transaction" : "event"}`,
                                                        event_id: event.event_id,
                                                        level: event.level,
                                                        message: core.getEventDescription(event),
                                                    },
                                                    { event },
                                                );
                                        }),
                                    ));
                        },
                    };
                });
            }