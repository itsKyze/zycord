3773(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let api = __webpack_require__(681),
                    debugLogger = __webpack_require__(2533),
                    dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323);
                exports.handleTunnelRequest = async function (options) {
                    let envelopeHeader,
                        { request, allowedDsns } = options;
                    if (0 === allowedDsns.length) return new Response("Tunnel not configured", { status: 500 });
                    let body = new Uint8Array(await request.arrayBuffer());
                    try {
                        [envelopeHeader] = envelope.parseEnvelope(body);
                    } catch {
                        return new Response("Invalid envelope", { status: 400 });
                    }
                    if (!envelopeHeader) return new Response("Invalid envelope: missing header", { status: 400 });
                    let dsn$1 = envelopeHeader.dsn;
                    if (!dsn$1) return new Response("Invalid envelope: missing DSN", { status: 400 });
                    if (!allowedDsns.some((allowed) => allowed === dsn$1))
                        return (debugLogger.debug.warn(`Sentry tunnel: rejected request with unauthorized DSN (${dsn$1})`), new Response("DSN not allowed", { status: 403 }));
                    let dsnComponents = dsn.makeDsn(dsn$1);
                    if (!dsnComponents) return (debugLogger.debug.warn(`Could not extract DSN Components from: ${dsn$1}`), new Response("Invalid DSN", { status: 403 }));
                    let sentryIngestUrl = api.getEnvelopeEndpointWithUrlEncodedAuth(dsnComponents);
                    try {
                        return await fetch(sentryIngestUrl, { method: "POST", headers: { "Content-Type": "application/x-sentry-envelope" }, body });
                    } catch (error) {
                        return (debugLogger.debug.error("Sentry tunnel: failed to forward envelope", error), new Response("Failed to forward envelope to Sentry", { status: 500 }));
                    }
                };
            }