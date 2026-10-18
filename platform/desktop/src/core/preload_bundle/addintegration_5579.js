5579(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    installedIntegrations = [];
                function setupIntegration(client, integration, integrationIndex) {
                    if (integrationIndex[integration.name]) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Integration skipped because it was already installed: ${integration.name}`);
                        return;
                    }
                    if (
                        ((integrationIndex[integration.name] = integration),
                        installedIntegrations.includes(integration.name) ||
                            "function" != typeof integration.setupOnce ||
                            (integration.setupOnce(), installedIntegrations.push(integration.name)),
                        integration.setup && "function" == typeof integration.setup && integration.setup(client),
                        "function" == typeof integration.preprocessEvent)
                    ) {
                        let callback = integration.preprocessEvent.bind(integration);
                        client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
                    }
                    if ("function" == typeof integration.processEvent) {
                        let callback = integration.processEvent.bind(integration),
                            processor = Object.assign((event, hint) => callback(event, hint, client), { id: integration.name });
                        client.addEventProcessor(processor);
                    }
                    (["processSpan", "processSegmentSpan"].forEach((hook) => {
                        let callback = integration[hook];
                        "function" == typeof callback && client.on(hook, (span) => callback.call(integration, span, client));
                    }),
                        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Integration installed: ${integration.name}`));
                }
                ((exports.addIntegration = function (integration) {
                    let client = currentScopes.getClient();
                    if (!client) {
                        debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Cannot add integration "${integration.name}" because no SDK Client is available.`);
                        return;
                    }
                    client.addIntegration(integration);
                }),
                    (exports.afterSetupIntegrations = function (client, integrations) {
                        for (let integration of integrations) integration?.afterAllSetup && integration.afterAllSetup(client);
                    }),
                    (exports.defineIntegration = function (fn) {
                        return fn;
                    }),
                    (exports.getIntegrationsToSetup = function (options) {
                        let integrations,
                            integrationsByName,
                            defaultIntegrations = options.defaultIntegrations || [],
                            userIntegrations = options.integrations;
                        if (
                            (defaultIntegrations.forEach((integration) => {
                                integration.isDefaultInstance = !0;
                            }),
                            Array.isArray(userIntegrations))
                        )
                            integrations = [...defaultIntegrations, ...userIntegrations];
                        else if ("function" == typeof userIntegrations) {
                            let resolvedUserIntegrations = userIntegrations(defaultIntegrations);
                            integrations = Array.isArray(resolvedUserIntegrations) ? resolvedUserIntegrations : [resolvedUserIntegrations];
                        } else integrations = defaultIntegrations;
                        return (
                            (integrationsByName = {}),
                            integrations.forEach((currentInstance) => {
                                let { name } = currentInstance,
                                    existingInstance = integrationsByName[name];
                                (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) || (integrationsByName[name] = currentInstance);
                            }),
                            Object.values(integrationsByName)
                        );
                    }),
                    (exports.installedIntegrations = installedIntegrations),
                    (exports.setupIntegration = setupIntegration),
                    (exports.setupIntegrations = function (client, integrations) {
                        let integrationIndex = {};
                        return (
                            integrations.forEach((integration) => {
                                integration?.beforeSetup && integration.beforeSetup(client);
                            }),
                            integrations.forEach((integration) => {
                                integration && setupIntegration(client, integration, integrationIndex);
                            }),
                            integrationIndex
                        );
                    }));
            }