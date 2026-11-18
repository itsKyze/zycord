5002(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                exports.createUserFeedbackEnvelope = function (feedback, { metadata, tunnel, dsn }) {
                    let headers = {
                            event_id: feedback.event_id,
                            sent_at: new Date().toISOString(),
                            ...(metadata?.sdk && { sdk: { name: metadata.sdk.name, version: metadata.sdk.version } }),
                            ...(!!tunnel && !!dsn && { dsn: core.dsnToString(dsn) }),
                        },
                        item = [{ type: "user_report" }, feedback];
                    return core.createEnvelope(headers, [item]);
                };
            }