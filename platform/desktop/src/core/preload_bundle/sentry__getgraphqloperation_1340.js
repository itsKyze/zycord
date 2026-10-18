1340(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794);
                function _getGraphQLOperation(requestBody) {
                    if (isPersistedRequest(requestBody)) return `persisted ${requestBody.operationName}`;
                    if (isStandardRequest(requestBody)) {
                        let { query: graphqlQuery, operationName: graphqlOperationName } = requestBody,
                            { operationName = graphqlOperationName, operationType } = parseGraphQLQuery(graphqlQuery);
                        return operationName ? `${operationType} ${operationName}` : `${operationType}`;
                    }
                    return "unknown";
                }
                function getRequestPayloadXhrOrFetch(hint) {
                    let body;
                    if ("xhr" in hint) {
                        let sentryXhrData = hint.xhr[browserUtils.SENTRY_XHR_DATA_KEY];
                        body = sentryXhrData && browserUtils.getBodyString(sentryXhrData.body)[0];
                    } else {
                        let sentryFetchData = browserUtils.getFetchRequestArgBody(hint.input);
                        body = browserUtils.getBodyString(sentryFetchData)[0];
                    }
                    return body;
                }
                function parseGraphQLQuery(query) {
                    let namedMatch = query.match(/^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/);
                    if (namedMatch) return { operationType: namedMatch[1], operationName: namedMatch[2] };
                    let unnamedMatch = query.match(/^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/);
                    return unnamedMatch ? { operationType: unnamedMatch[1], operationName: void 0 } : { operationType: void 0, operationName: void 0 };
                }
                function isObject(value) {
                    return "object" == typeof value && null !== value;
                }
                function isStandardRequest(payload) {
                    return isObject(payload) && "string" == typeof payload.query;
                }
                function isPersistedRequest(payload) {
                    return (
                        isObject(payload) &&
                        "string" == typeof payload.operationName &&
                        isObject(payload.extensions) &&
                        isObject(payload.extensions.persistedQuery) &&
                        "string" == typeof payload.extensions.persistedQuery.sha256Hash &&
                        "number" == typeof payload.extensions.persistedQuery.version
                    );
                }
                function getGraphQLRequestPayload(payload) {
                    try {
                        let requestBody = JSON.parse(payload);
                        if (isStandardRequest(requestBody) || isPersistedRequest(requestBody)) return requestBody;
                        return;
                    } catch {
                        return;
                    }
                }
                let graphqlClientIntegration = core.defineIntegration((options) => ({
                    name: "GraphQLClient",
                    setup(client) {
                        var client1, options1, client2, options2;
                        ((client1 = client),
                            (options1 = options),
                            client1.on("beforeOutgoingRequestSpan", (span, hint) => {
                                let spanAttributes = core.spanToJSON(span).data || {};
                                if ("http.client" !== spanAttributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP]) return;
                                let httpUrl = spanAttributes[core.SEMANTIC_ATTRIBUTE_URL_FULL] || spanAttributes["http.url"] || spanAttributes.url,
                                    httpMethod = spanAttributes[core.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD] || spanAttributes["http.method"];
                                if (!core.isString(httpUrl) || !core.isString(httpMethod)) return;
                                let { endpoints } = options1,
                                    isTracedGraphqlEndpoint = core.stringMatchesSomePattern(httpUrl, endpoints),
                                    payload = getRequestPayloadXhrOrFetch(hint);
                                if (isTracedGraphqlEndpoint && payload) {
                                    let graphqlBody = getGraphQLRequestPayload(payload);
                                    if (graphqlBody) {
                                        let operationInfo = _getGraphQLOperation(graphqlBody);
                                        (span.updateName(`${httpMethod} ${httpUrl} (${operationInfo})`),
                                            isStandardRequest(graphqlBody) && span.setAttribute("graphql.document", graphqlBody.query),
                                            isPersistedRequest(graphqlBody) &&
                                                (span.setAttribute("graphql.persisted_query.hash.sha256", graphqlBody.extensions.persistedQuery.sha256Hash),
                                                span.setAttribute("graphql.persisted_query.version", graphqlBody.extensions.persistedQuery.version)));
                                    }
                                }
                            }),
                            (client2 = client),
                            (options2 = options),
                            client2.on("beforeOutgoingRequestBreadcrumb", (breadcrumb, handlerData) => {
                                let { category, type, data } = breadcrumb;
                                if ("http" === type && ("fetch" === category || "xhr" === category)) {
                                    let httpUrl = data?.url,
                                        { endpoints } = options2,
                                        isTracedGraphqlEndpoint = core.stringMatchesSomePattern(httpUrl, endpoints),
                                        payload = getRequestPayloadXhrOrFetch(handlerData);
                                    if (isTracedGraphqlEndpoint && data && payload) {
                                        let graphqlBody = getGraphQLRequestPayload(payload);
                                        if (!data.graphql && graphqlBody) {
                                            let operationInfo = _getGraphQLOperation(graphqlBody);
                                            ((data["graphql.operation"] = operationInfo),
                                                isStandardRequest(graphqlBody) && (data["graphql.document"] = graphqlBody.query),
                                                isPersistedRequest(graphqlBody) &&
                                                    ((data["graphql.persisted_query.hash.sha256"] = graphqlBody.extensions.persistedQuery.sha256Hash),
                                                    (data["graphql.persisted_query.version"] = graphqlBody.extensions.persistedQuery.version)));
                                        }
                                    }
                                }
                            }));
                    },
                }));
                ((exports._getGraphQLOperation = _getGraphQLOperation),
                    (exports.getGraphQLRequestPayload = getGraphQLRequestPayload),
                    (exports.getRequestPayloadXhrOrFetch = getRequestPayloadXhrOrFetch),
                    (exports.graphqlClientIntegration = graphqlClientIntegration),
                    (exports.parseGraphQLQuery = parseGraphQLQuery));
            }