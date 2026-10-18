5731(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    envelope = __webpack_require__(1323),
                    promisebuffer = __webpack_require__(5260),
                    ratelimit = __webpack_require__(2074);
                ((exports.DEFAULT_TRANSPORT_BUFFER_SIZE = 64),
                    (exports.createTransport = function (options, makeRequest, buffer = promisebuffer.makePromiseBuffer(options.bufferSize || 64)) {
                        let rateLimits = {};
                        return {
                            send: function (envelope$1) {
                                let filteredEnvelopeItems = [];
                                if (
                                    (envelope.forEachEnvelopeItem(envelope$1, (item, type) => {
                                        let dataCategory = envelope.envelopeItemTypeToDataCategory(type);
                                        ratelimit.isRateLimited(rateLimits, dataCategory)
                                            ? options.recordDroppedEvent("ratelimit_backoff", dataCategory)
                                            : filteredEnvelopeItems.push(item);
                                    }),
                                    0 === filteredEnvelopeItems.length)
                                )
                                    return Promise.resolve({});
                                let filteredEnvelope = envelope.createEnvelope(envelope$1[0], filteredEnvelopeItems),
                                    recordEnvelopeLoss = (reason) => {
                                        if (envelope.envelopeContainsItemType(filteredEnvelope, ["client_report"])) {
                                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Dropping client report. Will not send outcomes (reason: ${reason}).`);
                                            return;
                                        }
                                        envelope.forEachEnvelopeItem(filteredEnvelope, (item, type) => {
                                            options.recordDroppedEvent(reason, envelope.envelopeItemTypeToDataCategory(type));
                                        });
                                    };
                                return buffer
                                    .add(() =>
                                        makeRequest({ body: envelope.serializeEnvelope(filteredEnvelope) }).then(
                                            (response) => (
                                                413 === response.statusCode
                                                    ? (debugBuild.DEBUG_BUILD &&
                                                          debugLogger.debug.error("Sentry responded with status code 413. Envelope was discarded due to exceeding size limits."),
                                                      recordEnvelopeLoss("send_error"))
                                                    : (debugBuild.DEBUG_BUILD &&
                                                          void 0 !== response.statusCode &&
                                                          (response.statusCode < 200 || response.statusCode >= 300) &&
                                                          debugLogger.debug.warn(`Sentry responded with status code ${response.statusCode} to sent event.`),
                                                      (rateLimits = ratelimit.updateRateLimits(rateLimits, response))),
                                                response
                                            ),
                                            (error) => {
                                                throw (
                                                    recordEnvelopeLoss("network_error"),
                                                    debugBuild.DEBUG_BUILD && debugLogger.debug.error("Encountered error running transport request:", error),
                                                    error
                                                );
                                            },
                                        ),
                                    )
                                    .then(
                                        (result) => result,
                                        (error) => {
                                            if (error === promisebuffer.SENTRY_BUFFER_FULL_ERROR)
                                                return (
                                                    debugBuild.DEBUG_BUILD && debugLogger.debug.error("Skipped sending event because buffer is full."),
                                                    recordEnvelopeLoss("queue_overflow"),
                                                    Promise.resolve({})
                                                );
                                            throw error;
                                        },
                                    );
                            },
                            flush: (timeout) => buffer.drain(timeout),
                        };
                    }));
            }