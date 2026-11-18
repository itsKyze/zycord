4955(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    dynamicSamplingContext = __webpack_require__(241),
                    merge = __webpack_require__(1451),
                    spanUtils = __webpack_require__(470);
                function mergeScopeData(data, mergeData) {
                    let {
                        extra,
                        tags,
                        attributes,
                        user,
                        contexts,
                        level,
                        sdkProcessingMetadata,
                        breadcrumbs,
                        fingerprint,
                        eventProcessors,
                        attachments,
                        propagationContext,
                        transactionName,
                        span,
                    } = mergeData;
                    (mergeAndOverwriteScopeData(data, "extra", extra),
                        mergeAndOverwriteScopeData(data, "tags", tags),
                        mergeAndOverwriteScopeData(data, "attributes", attributes),
                        mergeAndOverwriteScopeData(data, "user", user),
                        mergeAndOverwriteScopeData(data, "contexts", contexts),
                        (data.sdkProcessingMetadata = merge.merge(data.sdkProcessingMetadata, sdkProcessingMetadata, 2)),
                        level && (data.level = level),
                        transactionName && (data.transactionName = transactionName),
                        span && (data.span = span),
                        breadcrumbs.length && (data.breadcrumbs = [...data.breadcrumbs, ...breadcrumbs]),
                        fingerprint.length && (data.fingerprint = [...data.fingerprint, ...fingerprint]),
                        eventProcessors.length && (data.eventProcessors = [...data.eventProcessors, ...eventProcessors]),
                        attachments.length && (data.attachments = [...data.attachments, ...attachments]),
                        (data.propagationContext = { ...data.propagationContext, ...propagationContext }));
                }
                function mergeAndOverwriteScopeData(data, prop, mergeVal) {
                    data[prop] = merge.merge(data[prop], mergeVal, 1);
                }
                ((exports.applyScopeDataToEvent = function (event, data) {
                    var event1, span, event2, fingerprint, event3, breadcrumbs, event4, sdkProcessingMetadata;
                    let rootSpan,
                        transactionName,
                        mergedBreadcrumbs,
                        { fingerprint: fingerprint1, span: span1, breadcrumbs: breadcrumbs1, sdkProcessingMetadata: sdkProcessingMetadata1 } = data;
                    ((function (event, data) {
                        let { extra, tags, user, contexts, level, transactionName } = data;
                        (Object.keys(extra).length && (event.extra = { ...extra, ...event.extra }),
                            Object.keys(tags).length && (event.tags = { ...tags, ...event.tags }),
                            Object.keys(user).length && (event.user = { ...user, ...event.user }),
                            Object.keys(contexts).length && (event.contexts = { ...contexts, ...event.contexts }),
                            level && (event.level = level),
                            transactionName && "transaction" !== event.type && (event.transaction = transactionName));
                    })(event, data),
                        span1 &&
                            ((event1 = event),
                            (span = span1),
                            (event1.contexts = { trace: spanUtils.spanToTraceContext(span), ...event1.contexts }),
                            (event1.sdkProcessingMetadata = {
                                dynamicSamplingContext: dynamicSamplingContext.getDynamicSamplingContextFromSpan(span),
                                ...event1.sdkProcessingMetadata,
                            }),
                            (rootSpan = spanUtils.getRootSpan(span)),
                            (transactionName = spanUtils.spanToJSON(rootSpan).description) &&
                                !event1.transaction &&
                                "transaction" === event1.type &&
                                (event1.transaction = transactionName)),
                        (event2 = event),
                        (fingerprint = fingerprint1),
                        (event2.fingerprint = event2.fingerprint ? (Array.isArray(event2.fingerprint) ? event2.fingerprint : [event2.fingerprint]) : []),
                        fingerprint && (event2.fingerprint = event2.fingerprint.concat(fingerprint)),
                        event2.fingerprint.length || delete event2.fingerprint,
                        (event3 = event),
                        (breadcrumbs = breadcrumbs1),
                        (mergedBreadcrumbs = [...(event3.breadcrumbs || []), ...breadcrumbs]),
                        (event3.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : void 0),
                        (event4 = event),
                        (sdkProcessingMetadata = sdkProcessingMetadata1),
                        (event4.sdkProcessingMetadata = { ...event4.sdkProcessingMetadata, ...sdkProcessingMetadata }));
                }),
                    (exports.getCombinedScopeData = function (isolationScope, currentScope) {
                        let scopeData = currentScopes.getGlobalScope().getScopeData();
                        return (
                            isolationScope && mergeScopeData(scopeData, isolationScope.getScopeData()),
                            currentScope && mergeScopeData(scopeData, currentScope.getScopeData()),
                            scopeData
                        );
                    }),
                    (exports.mergeAndOverwriteScopeData = mergeAndOverwriteScopeData),
                    (exports.mergeScopeData = mergeScopeData));
            }