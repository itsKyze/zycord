4838(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.isNotNullish = function (value) {
                        return null != value;
                    }),
                    (exports.createLock = function () {
                        let p = Promise.resolve(null);
                        return (criticalSection) =>
                            new Promise((resolve, reject) => {
                                p = p.then(criticalSection).then(resolve, reject);
                            });
                    }));
            },
            787(module1, __unused_rspack_exports, __webpack_require__) {
                let bz2 = __webpack_require__(9390),
                    bitIterator = __webpack_require__(1265);
                module1.exports = function (input) {
                    let inputReader,
                        bufferQueue = [],
                        hasBytes = 0,
                        blockSize = 0,
                        broken = !1,
                        hasAllData = !1,
                        bitReader = null,
                        streamCRC = null,
                        outlength = 0;
                    return new ReadableStream(
                        {
                            start() {
                                inputReader = input.getReader();
                            },
                            async pull(controller) {
                                try {
                                    for (;;) {
                                        for (; !(hasAllData || (bitReader && hasBytes - bitReader.bytesRead + 1 >= 25e3 + 1e5 * (blockSize || 4)));) {
                                            let { value, done } = await inputReader.read();
                                            done
                                                ? (hasAllData = !0)
                                                : (bufferQueue.push(value),
                                                  (hasBytes += value.length),
                                                  null === bitReader &&
                                                      (bitReader = bitIterator(function () {
                                                          return bufferQueue.shift();
                                                      })));
                                        }
                                        for (
                                            ;
                                            hasAllData
                                                ? bitReader && hasBytes > bitReader.bytesRead
                                                : bitReader && hasBytes - bitReader.bytesRead + 1 >= 25e3 + 1e5 * (blockSize || 4);
                                        )
                                            if (
                                                (function (controller) {
                                                    if (!broken)
                                                        try {
                                                            return (function (push) {
                                                                if (!blockSize) return ((blockSize = bz2.header(bitReader)), (streamCRC = 0), !1);
                                                                {
                                                                    let bufsize = 1e5 * blockSize,
                                                                        buf = new Int32Array(bufsize),
                                                                        chunk = [];
                                                                    return null ===
                                                                        (streamCRC = bz2.decompress(
                                                                            bitReader,
                                                                            function (b) {
                                                                                chunk.push(b);
                                                                            },
                                                                            buf,
                                                                            bufsize,
                                                                            streamCRC,
                                                                        ))
                                                                        ? ((blockSize = 0), !1)
                                                                        : (push(new Uint8Array(chunk)), !0);
                                                                }
                                                            })(function (d) {
                                                                (controller.enqueue(d), null !== d && (outlength += d.length));
                                                            });
                                                        } catch (e) {
                                                            return (controller.error(e), (broken = !0), !0);
                                                        }
                                                })(controller)
                                            )
                                                return;
                                        if (hasAllData && !broken && (!bitReader || hasBytes <= bitReader.bytesRead))
                                            return void (null === streamCRC ? controller.close() : controller.error(Error("input stream ended prematurely")));
                                    }
                                } catch (e) {
                                    controller.error(e);
                                }
                            },
                            async cancel(reason) {
                                await inputReader.abort(reason);
                            },
                        },
                        { highWaterMark: 0 },
                    );
                };
            },
            1265(module1) {
                var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
                module1.exports = function (nextBuffer) {
                    var bit = 0,
                        byte = 0,
                        bytes = nextBuffer(),
                        f = function (n) {
                            if (null === n && 0 != bit) {
                                ((bit = 0), byte++);
                                return;
                            }
                            for (var result = 0; n > 0;) {
                                byte >= bytes.length && ((byte = 0), (bytes = nextBuffer()));
                                var left = 8 - bit;
                                (0 === bit && n > 0 && f.bytesRead++,
                                    n >= left
                                        ? ((result <<= left), (result |= BITMASK[left] & bytes[byte++]), (bit = 0), (n -= left))
                                        : ((result <<= n), (result |= (bytes[byte] & (BITMASK[n] << (8 - n - bit))) >> (8 - n - bit)), (bit += n), (n = 0)));
                            }
                            return result;
                        };
                    return ((f.bytesRead = 0), f);
                };
            },
            9390(module1) {
                function Bzip2Error(message) {
                    ((this.name = "Bzip2Error"), (this.message = message), (this.stack = Error().stack));
                }
                Bzip2Error.prototype = Error();
                var message_Error = function (message) {
                        throw new Bzip2Error(message);
                    },
                    bzip2 = {};
                ((bzip2.Bzip2Error = Bzip2Error),
                    (bzip2.crcTable = [
                        0, 0x4c11db7, 0x9823b6e, 0xd4326d9, 0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005, 0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61, 0x350c9b64, 0x31cd86d3,
                        0x3c8ea00a, 0x384fbdbd, 0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9, 0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75, 0x6a1936c8, 0x6ed82b7f, 0x639b0da6,
                        0x675a1011, 0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd, 0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039, 0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
                        0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81, 0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d, 0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49, 0xc7361b4c,
                        0xc3f706fb, 0xceb42022, 0xca753d95, 0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1, 0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d, 0x34867077, 0x30476dc0,
                        0x3d044b19, 0x39c556ae, 0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072, 0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16, 0x18aeb13, 0x54bf6a4, 0x808d07d,
                        0xcc9cdca, 0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde, 0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02, 0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066,
                        0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba, 0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e, 0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692, 0x8aad2b2f,
                        0x8e6c3698, 0x832f1041, 0x87ee0df6, 0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a, 0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e, 0xf3b06b3b, 0xf771768c,
                        0xfa325055, 0xfef34de2, 0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686, 0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a, 0x690ce0ee, 0x6dcdfd59, 0x608edb80,
                        0x644fc637, 0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb, 0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f, 0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
                        0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47, 0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b, 0x315d626, 0x7d4cb91, 0xa97ed48, 0xe56f0ff, 0x1011a0fa,
                        0x14d0bd4d, 0x19939b94, 0x1d528623, 0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7, 0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b, 0xd727bbb6, 0xd3e6a601,
                        0xdea580d8, 0xda649d6f, 0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3, 0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7, 0xae3afba2, 0xaafbe615, 0xa7b8c0cc,
                        0xa379dd7b, 0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f, 0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3, 0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640,
                        0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c, 0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8, 0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24, 0x119b4be9,
                        0x155a565e, 0x18197087, 0x1cd86d30, 0x29f3d35, 0x65e2082, 0xb1d065b, 0xfdc1bec, 0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088, 0x2497d08d, 0x2056cd3a,
                        0x2d15ebe3, 0x29d4f654, 0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0, 0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c, 0xe3a1cbc1, 0xe760d676, 0xea23f0af,
                        0xeee2ed18, 0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4, 0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0, 0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
                        0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668, 0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4,
                    ]),
                    (bzip2.array = function (bytes) {
                        var bit = 0,
                            byte = 0,
                            BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
                        return function (n) {
                            for (var result = 0; n > 0;) {
                                var left = 8 - bit;
                                n >= left
                                    ? ((result <<= left), (result |= BITMASK[left] & bytes[byte++]), (bit = 0), (n -= left))
                                    : ((result <<= n), (result |= (bytes[byte] & (BITMASK[n] << (8 - n - bit))) >> (8 - n - bit)), (bit += n), (n = 0));
                            }
                            return result;
                        };
                    }),
                    (bzip2.simple = function (srcbuffer, stream) {
                        var bits = bzip2.array(srcbuffer),
                            size = bzip2.header(bits),
                            ret = !1,
                            bufsize = 1e5 * size,
                            buf = new Int32Array(bufsize);
                        do ret = bzip2.decompress(bits, stream, buf, bufsize);
                        while (!ret);
                    }),
                    (bzip2.header = function (bits) {
                        ((this.byteCount = new Int32Array(256)),
                            (this.symToByte = new Uint8Array(256)),
                            (this.mtfSymbol = new Int32Array(256)),
                            (this.selectors = new Uint8Array(32768)),
                            4348520 != bits(24) && message_Error("No magic number found"));
                        var i = bits(8) - 48;
                        return ((i < 1 || i > 9) && message_Error("Not a BZIP archive"), i);
                    }),
                    (bzip2.decompress = function (bits, stream, buf, bufsize, streamCRC) {
                        for (var crc = -1, h = "", i = 0; i < 6; i++) h += bits(8).toString(16);
                        if ("177245385090" == h) return ((0 | bits(32)) !== streamCRC && message_Error("Error in bzip2: crc32 do not match"), bits(null), null);
                        "314159265359" != h && message_Error("Invalid bzip data");
                        var crcblock = 0 | bits(32);
                        bits(1) && message_Error("unsupported obsolete version");
                        var origPtr = bits(24);
                        origPtr > bufsize && message_Error("Initial position larger than buffer size");
                        var t = bits(16),
                            symTotal = 0;
                        for (i = 0; i < 16; i++)
                            if (t & (1 << (15 - i))) {
                                var k = bits(16);
                                for (j = 0; j < 16; j++) k & (1 << (15 - j)) && (this.symToByte[symTotal++] = 16 * i + j);
                            }
                        var groupCount = bits(3);
                        (groupCount < 2 || groupCount > 6) && message_Error("Invalid bzip data");
                        var nSelectors = bits(15);
                        0 == nSelectors && message_Error("Invalid bzip data");
                        for (var i = 0; i < groupCount; i++) this.mtfSymbol[i] = i;
                        for (var i = 0; i < nSelectors; i++) {
                            for (var j = 0; bits(1); j++) j >= groupCount && message_Error("Invalid bzip data");
                            for (var uc = this.mtfSymbol[j], k = j - 1; k >= 0; k--) this.mtfSymbol[k + 1] = this.mtfSymbol[k];
                            ((this.mtfSymbol[0] = uc), (this.selectors[i] = uc));
                        }
                        for (var symCount = symTotal + 2, groups = [], length = new Uint8Array(258), temp = new Uint16Array(21), j = 0; j < groupCount; j++) {
                            t = bits(5);
                            for (var runPos, count, symCount, selector, copies, previous, outbyte, hufGroup, minLen, maxLen, i = 0; i < symCount; i++) {
                                for (; (t < 1 || t > 20) && message_Error("Invalid bzip data"), bits(1);) bits(1) ? t-- : t++;
                                length[i] = t;
                            }
                            minLen = maxLen = length[0];
                            for (var i = 1; i < symCount; i++) length[i] > maxLen ? (maxLen = length[i]) : length[i] < minLen && (minLen = length[i]);
                            (((hufGroup = groups[j] = {}).permute = new Int32Array(258)),
                                (hufGroup.limit = new Int32Array(21)),
                                (hufGroup.base = new Int32Array(21)),
                                (hufGroup.minLen = minLen),
                                (hufGroup.maxLen = maxLen));
                            for (var base = hufGroup.base, limit = hufGroup.limit, pp = 0, i = minLen; i <= maxLen; i++)
                                for (var t = 0; t < symCount; t++) length[t] == i && (hufGroup.permute[pp++] = t);
                            for (i = minLen; i <= maxLen; i++) temp[i] = limit[i] = 0;
                            for (i = 0; i < symCount; i++) temp[length[i]]++;
                            for (pp = t = 0, i = minLen; i < maxLen; i++) ((pp += temp[i]), (limit[i] = pp - 1), (pp <<= 1), (base[i + 1] = pp - (t += temp[i])));
                            ((limit[maxLen] = pp + temp[maxLen] - 1), (base[minLen] = 0));
                        }
                        for (var i = 0; i < 256; i++) ((this.mtfSymbol[i] = i), (this.byteCount[i] = 0));
                        for (runPos = count = symCount = selector = 0; ;) {
                            for (
                                symCount-- ||
                                    ((symCount = 49),
                                    selector >= nSelectors && message_Error("Invalid bzip data"),
                                    (base = (hufGroup = groups[this.selectors[selector++]]).base),
                                    (limit = hufGroup.limit)),
                                    j = bits((i = hufGroup.minLen));
                                i > hufGroup.maxLen && message_Error("Invalid bzip data"), !(j <= limit[i]);
                            )
                                (i++, (j = (j << 1) | bits(1)));
                            ((j -= base[i]) < 0 || j >= 258) && message_Error("Invalid bzip data");
                            var nextSym = hufGroup.permute[j];
                            if (0 == nextSym || 1 == nextSym) {
                                (runPos || ((runPos = 1), (t = 0)), 0 == nextSym ? (t += runPos) : (t += 2 * runPos), (runPos <<= 1));
                                continue;
                            }
                            if (runPos)
                                for (runPos = 0, count + t > bufsize && message_Error("Invalid bzip data"), uc = this.symToByte[this.mtfSymbol[0]], this.byteCount[uc] += t; t--;)
                                    buf[count++] = uc;
                            if (nextSym > symTotal) break;
                            (count >= bufsize && message_Error("Invalid bzip data"), (i = nextSym - 1), (uc = this.mtfSymbol[i]));
                            for (var k = i - 1; k >= 0; k--) this.mtfSymbol[k + 1] = this.mtfSymbol[k];
                            ((this.mtfSymbol[0] = uc), (uc = this.symToByte[uc]), this.byteCount[uc]++, (buf[count++] = uc));
                        }
                        (origPtr < 0 || origPtr >= count) && message_Error("Invalid bzip data");
                        for (var j = 0, i = 0; i < 256; i++) ((k = j + this.byteCount[i]), (this.byteCount[i] = j), (j = k));
                        for (var i = 0; i < count; i++) ((uc = 255 & buf[i]), (buf[this.byteCount[uc]] |= i << 8), this.byteCount[uc]++);
                        var pos = 0,
                            current = 0,
                            run = 0;
                        for (count && ((current = 255 & (pos = buf[origPtr])), (pos >>= 8), (run = -1)); count;) {
                            for (
                                count--,
                                    previous = current,
                                    current = 255 & (pos = buf[pos]),
                                    pos >>= 8,
                                    3 == run++ ? ((copies = current), (outbyte = previous), (current = -1)) : ((copies = 1), (outbyte = current));
                                copies--;
                            )
                                ((crc = (crc << 8) ^ this.crcTable[((crc >> 24) ^ outbyte) & 255]), stream(outbyte));
                            current != previous && (run = 0);
                        }
                        return (
                            (0 | (crc = (-1 ^ crc) >>> 0)) != (0 | crcblock) && message_Error("Error in bzip2: crc32 do not match"),
                            (streamCRC = crc ^ ((streamCRC << 1) | (streamCRC >>> 31)))
                        );
                    }),
                    (module1.exports = bzip2));
            }