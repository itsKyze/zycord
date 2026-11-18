7286(__unused_rspack_module, exports) {
                let _previousTimestampMs;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let _sequenceNumber = 0;
                exports.getSequenceAttribute = function (timestampInSeconds) {
                    let nowMs = Math.floor(1e3 * timestampInSeconds);
                    void 0 !== _previousTimestampMs && nowMs !== _previousTimestampMs && (_sequenceNumber = 0);
                    let value = _sequenceNumber;
                    return (_sequenceNumber++, (_previousTimestampMs = nowMs), { key: "sentry.timestamp.sequence", value: { value, type: "integer" } });
                };
            }