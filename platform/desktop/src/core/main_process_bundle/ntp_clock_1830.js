1830(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.NtpProtocolError =
                        exports.TRANSMIT_TIMESTAMP_OFFSET_BYTES =
                        exports.RECEIVE_TIMESTAMP_OFFSET_BYTES =
                        exports.ORIGINATE_TIMESTAMP_OFFSET_BYTES =
                        exports.NTP_TIMESTAMP_SIZE_BYTES =
                        exports.NTP_PACKET_SIZE_BYTES =
                            void 0),
                    (exports.readNtpTimestampMs = readNtpTimestampMs),
                    (exports.writeNtpTimestampMs = function (packet, offsetBytes, unixMs) {
                        let ntpSeconds = unixMs / 1e3 + 0x83aa7e80,
                            seconds = Math.floor(ntpSeconds);
                        (packet.writeUInt32BE(seconds, offsetBytes), packet.writeUInt32BE(Math.round((ntpSeconds - seconds) * 0x100000000), offsetBytes + 4));
                    }),
                    (exports.buildClientRequest = function () {
                        let packet = Buffer.alloc(exports.NTP_PACKET_SIZE_BYTES);
                        packet[0] = 35;
                        let nonce = (0, node_crypto_1.randomBytes)(exports.NTP_TIMESTAMP_SIZE_BYTES);
                        return (nonce.copy(packet, exports.TRANSMIT_TIMESTAMP_OFFSET_BYTES), { packet, nonce });
                    }),
                    (exports.matchesNonce = function (response, nonce) {
                        return (
                            !(response.length < exports.NTP_PACKET_SIZE_BYTES) &&
                            response.subarray(exports.ORIGINATE_TIMESTAMP_OFFSET_BYTES, exports.ORIGINATE_TIMESTAMP_OFFSET_BYTES + exports.NTP_TIMESTAMP_SIZE_BYTES).equals(nonce)
                        );
                    }),
                    (exports.parseSample = function (response, sendMs, receiveMs) {
                        var offsetBytes;
                        if (response.length < exports.NTP_PACKET_SIZE_BYTES) throw new NtpProtocolError(`short packet (${response.length} bytes)`);
                        let leapIndicator = (response[0] >> 6) & 3,
                            mode = 7 & response[0],
                            stratum = response[1];
                        if (4 !== mode) throw new NtpProtocolError(`unexpected mode ${mode}`);
                        if (3 === leapIndicator) throw new NtpProtocolError("server reports itself unsynchronized");
                        if (0 === stratum || stratum > 15) throw new NtpProtocolError(`unusable stratum ${stratum}`);
                        if (((offsetBytes = exports.TRANSMIT_TIMESTAMP_OFFSET_BYTES), 0 === response.readUInt32BE(offsetBytes) && 0 === response.readUInt32BE(offsetBytes + 4)))
                            throw new NtpProtocolError("empty transmit timestamp");
                        let serverReceiveMs = readNtpTimestampMs(response, exports.RECEIVE_TIMESTAMP_OFFSET_BYTES),
                            serverTransmitMs = readNtpTimestampMs(response, exports.TRANSMIT_TIMESTAMP_OFFSET_BYTES);
                        return {
                            offsetMs: (serverReceiveMs - sendMs + (serverTransmitMs - receiveMs)) / 2,
                            roundTripMs: receiveMs - sendMs - (serverTransmitMs - serverReceiveMs),
                        };
                    }),
                    (exports.selectBestSample = function (samples, maxRoundTripMs) {
                        let best = null;
                        for (let sample of samples) !(sample.roundTripMs > maxRoundTripMs) && (null == best || sample.roundTripMs < best.roundTripMs) && (best = sample);
                        return best;
                    }));
                let node_crypto_1 = __webpack_require__(7598);
                ((exports.NTP_PACKET_SIZE_BYTES = 48),
                    (exports.NTP_TIMESTAMP_SIZE_BYTES = 8),
                    (exports.ORIGINATE_TIMESTAMP_OFFSET_BYTES = 24),
                    (exports.RECEIVE_TIMESTAMP_OFFSET_BYTES = 32),
                    (exports.TRANSMIT_TIMESTAMP_OFFSET_BYTES = 40));
                class NtpProtocolError extends Error {
                    name = "NtpProtocolError";
                }
                function readNtpTimestampMs(packet, offsetBytes) {
                    return (packet.readUInt32BE(offsetBytes) - 0x83aa7e80) * 1e3 + (packet.readUInt32BE(offsetBytes + 4) / 0x100000000) * 1e3;
                }
                exports.NtpProtocolError = NtpProtocolError;
            }