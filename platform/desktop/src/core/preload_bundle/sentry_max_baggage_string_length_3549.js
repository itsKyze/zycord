3549(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
                function parseBaggageHeader(baggageHeader) {
                    if (baggageHeader && (is.isString(baggageHeader) || Array.isArray(baggageHeader)))
                        return Array.isArray(baggageHeader)
                            ? baggageHeader.reduce(
                                  (acc, curr) => (
                                      Object.entries(baggageHeaderToObject(curr)).forEach(([key, value]) => {
                                          acc[key] = value;
                                      }),
                                      acc
                                  ),
                                  {},
                              )
                            : baggageHeaderToObject(baggageHeader);
                }
                function baggageHeaderToObject(baggageHeader) {
                    return baggageHeader
                        .split(",")
                        .map((baggageEntry) => {
                            let eqIdx = baggageEntry.indexOf("=");
                            return -1 === eqIdx
                                ? []
                                : [baggageEntry.slice(0, eqIdx), baggageEntry.slice(eqIdx + 1)].map((keyOrValue) => {
                                      try {
                                          return decodeURIComponent(keyOrValue.trim());
                                      } catch {
                                          return;
                                      }
                                  });
                        })
                        .reduce((acc, [key, value]) => (key && value && (acc[key] = value), acc), {});
                }
                function objectToBaggageHeader(object) {
                    if (0 !== Object.keys(object).length)
                        return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
                            let baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`,
                                newBaggageHeader = 0 === currentIndex ? baggageEntry : `${baggageHeader},${baggageEntry}`;
                            return newBaggageHeader.length > 8192
                                ? (debugBuild.DEBUG_BUILD &&
                                      debugLogger.debug.warn(`Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`),
                                  baggageHeader)
                                : newBaggageHeader;
                        }, "");
                }
                ((exports.MAX_BAGGAGE_STRING_LENGTH = 8192),
                    (exports.SENTRY_BAGGAGE_KEY_PREFIX = SENTRY_BAGGAGE_KEY_PREFIX),
                    (exports.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/),
                    (exports.baggageHeaderToDynamicSamplingContext = function (baggageHeader) {
                        let baggageObject = parseBaggageHeader(baggageHeader);
                        if (!baggageObject) return;
                        let dynamicSamplingContext = Object.entries(baggageObject).reduce(
                            (acc, [key, value]) => (key.startsWith(SENTRY_BAGGAGE_KEY_PREFIX) && (acc[key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length)] = value), acc),
                            {},
                        );
                        return Object.keys(dynamicSamplingContext).length > 0 ? dynamicSamplingContext : void 0;
                    }),
                    (exports.dynamicSamplingContextToSentryBaggageHeader = function (dynamicSamplingContext) {
                        if (dynamicSamplingContext)
                            return objectToBaggageHeader(
                                Object.entries(dynamicSamplingContext).reduce(
                                    (acc, [dscKey, dscValue]) => (dscValue && (acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue), acc),
                                    {},
                                ),
                            );
                    }),
                    (exports.objectToBaggageHeader = objectToBaggageHeader),
                    (exports.parseBaggageHeader = parseBaggageHeader));
            }