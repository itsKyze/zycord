5264(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.CODE_INTEGRITY_U32_SIZE = exports.CODE_INTEGRITY_BYTE_SIZE = void 0),
                    (exports.readCodeIntegrityRecord = readCodeIntegrityRecord),
                    (exports.findCodeIntegrityInMinidump = function (dump) {
                        try {
                            if (dump.byteLength < 32) return null;
                            let header = new minidumpReader_1.ReadResult((0, minidumpReader_1.sliceForRead)(dump, 0, 32));
                            if (0x504d444d !== header.readuint32()) return null;
                            header.seek(8);
                            let numberOfStreams = header.readuint32(),
                                streamDirectoryOffset = header.readuint32();
                            if (numberOfStreams > 256) return null;
                            let directoryByteSize = 12 * numberOfStreams;
                            if (streamDirectoryOffset + directoryByteSize > dump.byteLength) return null;
                            let directory = new minidumpReader_1.ReadResult((0, minidumpReader_1.sliceForRead)(dump, streamDirectoryOffset, directoryByteSize));
                            for (let i = 0; i < numberOfStreams; ++i) {
                                let streamType = directory.readuint32(),
                                    dataSize = directory.readuint32(),
                                    dataOffset = directory.readuint32();
                                if (0xd15c0d01 === streamType) {
                                    if (dataSize < exports.CODE_INTEGRITY_BYTE_SIZE || dataOffset + exports.CODE_INTEGRITY_BYTE_SIZE > dump.byteLength) return null;
                                    return readCodeIntegrityRecord(
                                        new minidumpReader_1.ReadResult((0, minidumpReader_1.sliceForRead)(dump, dataOffset, exports.CODE_INTEGRITY_BYTE_SIZE)),
                                    );
                                }
                            }
                        } catch (e) {
                            console.log(`findCodeIntegrityInMinidump: ${e}`);
                        }
                        return null;
                    }),
                    (exports.codeIntegritySentryTags = function (codeIntegrity) {
                        return null == codeIntegrity
                            ? { code_integrity: "unavailable" }
                            : 0 === codeIntegrity.bytesDifferent
                              ? { code_integrity: "clean" }
                              : {
                                    code_integrity: "modified",
                                    "code_integrity.distance": (function (nearestDifferenceFromInstructionPointer) {
                                        if (null == nearestDifferenceFromInstructionPointer) return "unknown";
                                        let distance = Math.abs(nearestDifferenceFromInstructionPointer);
                                        return distance <= 64 ? "near" : distance <= 4096 ? "within_page" : "distant";
                                    })(codeIntegrity.nearestDifferenceFromInstructionPointer),
                                };
                    }),
                    (exports.codeIntegritySentryContext = function (codeIntegrity) {
                        return {
                            bytes_different: codeIntegrity.bytesDifferent,
                            bytes_compared: codeIntegrity.bytesCompared,
                            nearest_difference_from_instruction_pointer: codeIntegrity.nearestDifferenceFromInstructionPointer,
                            reloc_bytes_different: codeIntegrity.relocBytesDifferent,
                            reloc_bytes_compared: codeIntegrity.relocBytesCompared,
                            bytes_skipped: codeIntegrity.bytesSkipped,
                            is_crash_page_private: codeIntegrity.isCrashPagePrivate,
                            are_relocations_applied: codeIntegrity.areRelocationsApplied,
                            flags: codeIntegrity.flags,
                        };
                    }));
                let minidumpReader_1 = __webpack_require__(8888);
                class ZYCORD_CODE_INTEGRITY {
                    static VERSION = 1;
                    static BYTE_SIZE = 76;
                    static U32_SIZE = ZYCORD_CODE_INTEGRITY.BYTE_SIZE / 4;
                    static FLAG_RELOCATIONS_APPLIED = 4;
                    static FLAG_WORKING_SET_QUERIED = 8;
                    static FLAG_CRASH_PAGE_PRIVATE = 32;
                    version;
                    flags;
                    instructionPointer;
                    moduleBase;
                    moduleSize;
                    relocationDelta;
                    pageSize;
                    pagesCompared;
                    bytesCompared;
                    bytesDifferent;
                    nearestDifferenceFromInstructionPointer;
                    relocBytesCompared;
                    relocBytesDifferent;
                    bytesSkipped;
                    moduleNameBytes;
                    constructor(reader) {
                        ((this.version = reader.readuint32()),
                            (this.flags = reader.readuint32()),
                            (this.instructionPointer = reader.readuint64()),
                            (this.moduleBase = reader.readuint64()),
                            (this.moduleSize = reader.readuint64()),
                            (this.relocationDelta = reader.readint64()),
                            (this.pageSize = reader.readuint32()),
                            (this.pagesCompared = reader.readuint32()),
                            (this.bytesCompared = reader.readuint32()),
                            (this.bytesDifferent = reader.readuint32()),
                            (this.nearestDifferenceFromInstructionPointer = reader.readint32()),
                            (this.relocBytesCompared = reader.readuint32()),
                            (this.relocBytesDifferent = reader.readuint32()),
                            (this.bytesSkipped = reader.readuint32()),
                            (this.moduleNameBytes = reader.readuint32()));
                    }
                    toCodeIntegrity() {
                        if (this.version !== ZYCORD_CODE_INTEGRITY.VERSION || 0 === this.bytesCompared) return null;
                        let workingSetQueried = (this.flags & ZYCORD_CODE_INTEGRITY.FLAG_WORKING_SET_QUERIED) != 0;
                        return {
                            bytesDifferent: this.bytesDifferent,
                            bytesCompared: this.bytesCompared,
                            nearestDifferenceFromInstructionPointer: 0 === this.bytesDifferent ? null : this.nearestDifferenceFromInstructionPointer,
                            relocBytesDifferent: this.relocBytesDifferent,
                            relocBytesCompared: this.relocBytesCompared,
                            bytesSkipped: this.bytesSkipped,
                            isCrashPagePrivate: workingSetQueried ? (this.flags & ZYCORD_CODE_INTEGRITY.FLAG_CRASH_PAGE_PRIVATE) != 0 : null,
                            areRelocationsApplied: (this.flags & ZYCORD_CODE_INTEGRITY.FLAG_RELOCATIONS_APPLIED) != 0,
                            flags: this.flags,
                        };
                    }
                }
                function readCodeIntegrityRecord(reader) {
                    return new ZYCORD_CODE_INTEGRITY(reader).toCodeIntegrity();
                }
                ((exports.CODE_INTEGRITY_BYTE_SIZE = ZYCORD_CODE_INTEGRITY.BYTE_SIZE), (exports.CODE_INTEGRITY_U32_SIZE = ZYCORD_CODE_INTEGRITY.U32_SIZE));
            }