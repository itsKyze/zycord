9947(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323);
                function createMetricContainerEnvelopeItem(items) {
                    return [{ type: "trace_metric", item_count: items.length, content_type: "application/vnd.sentry.items.trace-metric+json" }, { items }];
                }
                ((exports.createMetricContainerEnvelopeItem = createMetricContainerEnvelopeItem),
                    (exports.createMetricEnvelope = function (metrics, metadata, tunnel, dsn$1) {
                        let headers = {};
                        return (
                            metadata?.sdk && (headers.sdk = { name: metadata.sdk.name, version: metadata.sdk.version }),
                            tunnel && dsn$1 && (headers.dsn = dsn.dsnToString(dsn$1)),
                            envelope.createEnvelope(headers, [createMetricContainerEnvelopeItem(metrics)])
                        );
                    }));
            }