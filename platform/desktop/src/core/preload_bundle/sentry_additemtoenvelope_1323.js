1323(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let carrier = __webpack_require__(5),
                    dsn = __webpack_require__(6058),
                    normalize = __webpack_require__(4496),
                    worldwide = __webpack_require__(3712);
                function forEachEnvelopeItem(envelope, callback) {
                    for (let envelopeItem of envelope[1]) {
                        let envelopeItemType = envelopeItem[0].type;
                        if (callback(envelopeItem, envelopeItemType)) return !0;
                    }
                    return !1;
                }
                function encodeUTF8(input) {
                    let carrier$1 = carrier.getSentryCarrier(worldwide.GLOBAL_OBJ);
                    return carrier$1.encodePolyfill ? carrier$1.encodePolyfill(input) : new TextEncoder().encode(input);
                }
                let DATA_CATEGORY_OVERRIDES = {
                    sessions: "session",
                    event: "error",
                    client_report: "internal",
                    user_report: "default",
                    profile_chunk: "profile",
                    replay_event: "replay",
                    replay_recording: "replay",
                    check_in: "monitor",
                    raw_security: "security",
                    log: "log_item",
                    trace_metric: "metric",
                };
                ((exports.addItemToEnvelope = function (envelope, newItem) {
                    let [headers, items] = envelope;
                    return [headers, [...items, newItem]];
                }),
                    (exports.createAttachmentEnvelopeItem = function (attachment) {
                        let buffer = "string" == typeof attachment.data ? encodeUTF8(attachment.data) : attachment.data;
                        return [
                            {
                                type: "attachment",
                                length: buffer.length,
                                filename: attachment.filename,
                                content_type: attachment.contentType,
                                attachment_type: attachment.attachmentType,
                            },
                            buffer,
                        ];
                    }),
                    (exports.createEnvelope = function (headers, items = []) {
                        return [headers, items];
                    }),
                    (exports.createEventEnvelopeHeaders = function (event, sdkInfo, tunnel, dsn$1) {
                        let dynamicSamplingContext = event.sdkProcessingMetadata?.dynamicSamplingContext;
                        return {
                            event_id: event.event_id,
                            sent_at: new Date().toISOString(),
                            ...(sdkInfo && { sdk: sdkInfo }),
                            ...(!!tunnel && dsn$1 && { dsn: dsn.dsnToString(dsn$1) }),
                            ...(dynamicSamplingContext && { trace: dynamicSamplingContext }),
                        };
                    }),
                    (exports.createSpanEnvelopeItem = function (spanJson) {
                        return [{ type: "span" }, spanJson];
                    }),
                    (exports.envelopeContainsItemType = function (envelope, types) {
                        return forEachEnvelopeItem(envelope, (_, type) => types.includes(type));
                    }),
                    (exports.envelopeItemTypeToDataCategory = function (type) {
                        return type in DATA_CATEGORY_OVERRIDES ? DATA_CATEGORY_OVERRIDES[type] : type;
                    }),
                    (exports.forEachEnvelopeItem = forEachEnvelopeItem),
                    (exports.getSdkMetadataForEnvelopeHeader = function (metadataOrEvent) {
                        if (!metadataOrEvent?.sdk) return;
                        let { name, version } = metadataOrEvent.sdk;
                        return { name, version };
                    }),
                    (exports.parseEnvelope = function (env) {
                        let buffer = "string" == typeof env ? encodeUTF8(env) : env;
                        function readBinary(length) {
                            let bin = buffer.subarray(0, length);
                            return ((buffer = buffer.subarray(length + 1)), bin);
                        }
                        function readJson() {
                            var input;
                            let carrier$1,
                                i = buffer.indexOf(10);
                            return (
                                i < 0 && (i = buffer.length),
                                JSON.parse(
                                    ((input = readBinary(i)),
                                    (carrier$1 = carrier.getSentryCarrier(worldwide.GLOBAL_OBJ)).decodePolyfill
                                        ? carrier$1.decodePolyfill(input)
                                        : new TextDecoder().decode(input)),
                                )
                            );
                        }
                        let envelopeHeader = readJson(),
                            items = [];
                        for (; buffer.length;) {
                            let itemHeader = readJson(),
                                binaryLength = "number" == typeof itemHeader.length ? itemHeader.length : void 0;
                            items.push([itemHeader, binaryLength ? readBinary(binaryLength) : readJson()]);
                        }
                        return [envelopeHeader, items];
                    }),
                    (exports.serializeEnvelope = function (envelope) {
                        let [envHeaders, items] = envelope,
                            parts = JSON.stringify(envHeaders);
                        function append(next) {
                            "string" == typeof parts
                                ? (parts = "string" == typeof next ? parts + next : [encodeUTF8(parts), next])
                                : parts.push("string" == typeof next ? encodeUTF8(next) : next);
                        }
                        for (let item of items) {
                            let [itemHeaders, payload] = item;
                            if (
                                (append(`
${JSON.stringify(itemHeaders)}
`),
                                "string" == typeof payload || payload instanceof Uint8Array)
                            )
                                append(payload);
                            else {
                                let stringifiedPayload;
                                try {
                                    stringifiedPayload = JSON.stringify(payload);
                                } catch {
                                    stringifiedPayload = JSON.stringify(normalize.normalize(payload));
                                }
                                append(stringifiedPayload);
                            }
                        }
                        return "string" == typeof parts
                            ? parts
                            : (function (buffers) {
                                  let merged = new Uint8Array(buffers.reduce((acc, buf) => acc + buf.length, 0)),
                                      offset = 0;
                                  for (let buffer of buffers) (merged.set(buffer, offset), (offset += buffer.length));
                                  return merged;
                              })(parts);
                    }));
            }