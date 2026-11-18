6854(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323);
                exports.createCheckInEnvelope = function (checkIn, dynamicSamplingContext, metadata, tunnel, dsn$1) {
                    let headers = { sent_at: new Date().toISOString() };
                    (metadata?.sdk && (headers.sdk = { name: metadata.sdk.name, version: metadata.sdk.version }),
                        tunnel && dsn$1 && (headers.dsn = dsn.dsnToString(dsn$1)),
                        dynamicSamplingContext && (headers.trace = dynamicSamplingContext));
                    let item = [{ type: "check_in" }, checkIn];
                    return envelope.createEnvelope(headers, [item]);
                };
            }