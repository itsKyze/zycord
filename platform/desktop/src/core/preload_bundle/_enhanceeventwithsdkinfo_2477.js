2477(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let dynamicSamplingContext = __webpack_require__(241),
                    beforeSendSpan = __webpack_require__(6509),
                    dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323),
                    shouldIgnoreSpan = __webpack_require__(7332),
                    spanUtils = __webpack_require__(470);
                function _enhanceEventWithSdkInfo(event, newSdkInfo) {
                    if (!newSdkInfo) return event;
                    let eventSdkInfo = event.sdk || {};
                    return (
                        (event.sdk = {
                            ...eventSdkInfo,
                            name: eventSdkInfo.name || newSdkInfo.name,
                            version: eventSdkInfo.version || newSdkInfo.version,
                            integrations: [...(event.sdk?.integrations || []), ...(newSdkInfo.integrations || [])],
                            packages: [...(event.sdk?.packages || []), ...(newSdkInfo.packages || [])],
                            settings: event.sdk?.settings || newSdkInfo.settings ? { ...event.sdk?.settings, ...newSdkInfo.settings } : void 0,
                        }),
                        event
                    );
                }
                ((exports._enhanceEventWithSdkInfo = _enhanceEventWithSdkInfo),
                    (exports.createEventEnvelope = function (event, dsn, metadata, tunnel) {
                        let sdkInfo = envelope.getSdkMetadataForEnvelopeHeader(metadata),
                            eventType = event.type && "replay_event" !== event.type ? event.type : "event";
                        _enhanceEventWithSdkInfo(event, metadata?.sdk);
                        let envelopeHeaders = envelope.createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
                        delete event.sdkProcessingMetadata;
                        let eventItem = [{ type: eventType }, event];
                        return envelope.createEnvelope(envelopeHeaders, [eventItem]);
                    }),
                    (exports.createSessionEnvelope = function (session, dsn$1, metadata, tunnel) {
                        let sdkInfo = envelope.getSdkMetadataForEnvelopeHeader(metadata),
                            envelopeHeaders = { sent_at: new Date().toISOString(), ...(sdkInfo && { sdk: sdkInfo }), ...(!!tunnel && dsn$1 && { dsn: dsn.dsnToString(dsn$1) }) },
                            envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
                        return envelope.createEnvelope(envelopeHeaders, [envelopeItem]);
                    }),
                    (exports.createSpanEnvelope = function (spans, client) {
                        let dsc = dynamicSamplingContext.getDynamicSamplingContextFromSpan(spans[0]),
                            dsn$1 = client?.getDsn(),
                            tunnel = client?.getOptions().tunnel,
                            headers = {
                                sent_at: new Date().toISOString(),
                                ...(!!dsc.trace_id && !!dsc.public_key && { trace: dsc }),
                                ...(!!tunnel && dsn$1 && { dsn: dsn.dsnToString(dsn$1) }),
                            },
                            { beforeSendSpan: beforeSendSpan$1, ignoreSpans } = client?.getOptions() || {},
                            filteredSpans = ignoreSpans?.length ? spans.filter((span) => !shouldIgnoreSpan.shouldIgnoreSpan(spanUtils.spanToJSON(span), ignoreSpans)) : spans,
                            droppedSpans = spans.length - filteredSpans.length;
                        droppedSpans && client?.recordDroppedEvent("before_send", "span", droppedSpans);
                        let convertToSpanJSON = beforeSendSpan$1
                                ? (span) => {
                                      let spanJson = spanUtils.spanToJSON(span),
                                          processedSpan = beforeSendSpan.isStreamedBeforeSendSpanCallback(beforeSendSpan$1) ? spanJson : beforeSendSpan$1(spanJson);
                                      return processedSpan || (spanUtils.showSpanDropWarning(), spanJson);
                                  }
                                : spanUtils.spanToJSON,
                            items = [];
                        for (let span of filteredSpans) {
                            let spanJson = convertToSpanJSON(span);
                            spanJson && items.push(envelope.createSpanEnvelopeItem(spanJson));
                        }
                        return envelope.createEnvelope(headers, items);
                    }));
            }