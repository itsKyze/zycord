9897(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let api = __webpack_require__(681),
                    dsn = __webpack_require__(6058),
                    envelope = __webpack_require__(1323),
                    MULTIPLEXED_TRANSPORT_EXTRA_KEY = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";
                function eventFromEnvelope(env, types) {
                    let event;
                    return (envelope.forEachEnvelopeItem(env, (item, type) => (types.includes(type) && (event = Array.isArray(item) ? item[1] : void 0), !!event)), event);
                }
                ((exports.MULTIPLEXED_TRANSPORT_EXTRA_KEY = MULTIPLEXED_TRANSPORT_EXTRA_KEY),
                    (exports.eventFromEnvelope = eventFromEnvelope),
                    (exports.makeMultiplexedTransport = function (createTransport, matcher) {
                        return (options) => {
                            let fallbackTransport = createTransport(options),
                                otherTransports = new Map(),
                                actualMatcher =
                                    matcher ||
                                    ((args) => {
                                        let event = args.getEvent();
                                        return event?.extra?.[MULTIPLEXED_TRANSPORT_EXTRA_KEY] && Array.isArray(event.extra[MULTIPLEXED_TRANSPORT_EXTRA_KEY])
                                            ? event.extra[MULTIPLEXED_TRANSPORT_EXTRA_KEY]
                                            : [];
                                    });
                            function getTransport(dsn$1, release) {
                                let key = release ? `${dsn$1}:${release}` : dsn$1,
                                    transport = otherTransports.get(key);
                                if (!transport) {
                                    let validatedDsn = dsn.dsnFromString(dsn$1);
                                    if (!validatedDsn) return;
                                    let url = api.getEnvelopeEndpointWithUrlEncodedAuth(validatedDsn, options.tunnel);
                                    ((transport = release
                                        ? ((options) => {
                                              let transport = createTransport(options);
                                              return {
                                                  ...transport,
                                                  send: async (envelope) => {
                                                      let event = eventFromEnvelope(envelope, ["event", "transaction", "profile", "replay_event"]);
                                                      return (event && (event.release = release), transport.send(envelope));
                                                  },
                                              };
                                          })({ ...options, url })
                                        : createTransport({ ...options, url })),
                                        otherTransports.set(key, transport));
                                }
                                return [dsn$1, transport];
                            }
                            return {
                                send: async function (envelope1) {
                                    let transports = actualMatcher({
                                            envelope: envelope1,
                                            getEvent: function (types) {
                                                return eventFromEnvelope(envelope1, types?.length ? types : ["event"]);
                                            },
                                        })
                                            .map((result) => ("string" == typeof result ? getTransport(result, void 0) : getTransport(result.dsn, result.release)))
                                            .filter((t) => !!t),
                                        transportsWithFallback = transports.length ? transports : [["", fallbackTransport]];
                                    return (
                                        await Promise.all(
                                            transportsWithFallback.map(([dsn, transport]) =>
                                                transport.send(envelope.createEnvelope(dsn ? { ...envelope1[0], dsn: dsn } : envelope1[0], envelope1[1])),
                                            ),
                                        )
                                    )[0];
                                },
                                flush: async function (timeout) {
                                    let allTransports = [...otherTransports.values(), fallbackTransport];
                                    return (await Promise.all(allTransports.map((transport) => transport.flush(timeout)))).every((r) => r);
                                },
                            };
                        };
                    }));
            }