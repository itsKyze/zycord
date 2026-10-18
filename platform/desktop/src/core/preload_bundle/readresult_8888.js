8888(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.ReadResult = void 0),
                    (exports.sliceForRead = function (bytes, offset, length) {
                        return bytes.buffer.slice(bytes.byteOffset + offset, bytes.byteOffset + offset + length);
                    }),
                    (exports.ReadResult = class {
                        index = 0;
                        u8;
                        u16;
                        u32;
                        constructor(buffer) {
                            ((this.u8 = new Uint8Array(buffer)), (this.u16 = new Uint16Array(buffer)), (this.u32 = new Uint32Array(buffer)));
                        }
                        seek(index) {
                            this.index = index;
                        }
                        readuint32() {
                            let val = this.u32[this.index / 4];
                            return ((this.index += 4), val);
                        }
                        readint32() {
                            return 0 | this.readuint32();
                        }
                        readuint16() {
                            let val = this.u16[this.index / 2];
                            return ((this.index += 2), val);
                        }
                        readByteArray(count) {
                            let val = Array.from(this.u8.slice(this.index, this.index + count));
                            return ((this.index += count), val);
                        }
                        readuint64() {
                            let u32Index = this.index / 4,
                                val = BigInt(this.u32[u32Index]) | (BigInt(this.u32[u32Index + 1]) << BigInt(32));
                            return ((this.index += 8), val);
                        }
                        readint64() {
                            return BigInt.asIntN(64, this.readuint64());
                        }
                    }));
            }