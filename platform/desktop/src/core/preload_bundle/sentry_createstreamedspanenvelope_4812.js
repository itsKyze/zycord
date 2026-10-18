4812(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323);
                exports.createStreamedSpanEnvelope = function (serializedSpans, dsc, client) {
                    var dsc1;
                    let dsn$1 = client.getDsn(),
                        tunnel = client.getOptions().tunnel,
                        sdk = envelope.getSdkMetadataForEnvelopeHeader(client.getOptions()._metadata),
                        headers = {
                            sent_at: new Date().toISOString(),
                            ...(!!(dsc1 = dsc).trace_id && !!dsc1.public_key && { trace: dsc }),
                            ...(sdk && { sdk }),
                            ...(!!tunnel && dsn$1 && { dsn: dsn.dsnToString(dsn$1) }),
                        },
                        spanContainer = [
                            { type: "span", item_count: serializedSpans.length, content_type: "application/vnd.sentry.items.span.v2+json" },
                            { items: serializedSpans },
                        ];
                    return envelope.createEnvelope(headers, [spanContainer]);
                };
            }