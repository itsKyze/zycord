9619(__unused_rspack_module, exports, __webpack_require__) {
                var newBuffer,
                    fs = __webpack_require__(9896),
                    zlib = __webpack_require__(3106),
                    fd_slicer = __webpack_require__(201),
                    crc32 = __webpack_require__(7148),
                    util = __webpack_require__(9023),
                    EventEmitter = __webpack_require__(4434).EventEmitter,
                    Transform = __webpack_require__(2203).Transform,
                    PassThrough = __webpack_require__(2203).PassThrough,
                    Writable = __webpack_require__(2203).Writable;
                function fromFd(fd, options, callback) {
                    ("function" == typeof options && ((callback = options), (options = null)),
                        null == options && (options = {}),
                        null == options.autoClose && (options.autoClose = !1),
                        null == options.lazyEntries && (options.lazyEntries = !1),
                        null == options.decodeStrings && (options.decodeStrings = !0),
                        null == options.validateEntrySizes && (options.validateEntrySizes = !0),
                        null == options.strictFileNames && (options.strictFileNames = !1),
                        null == callback && (callback = defaultCallback),
                        fs.fstat(fd, function (err, stats) {
                            if (err) return callback(err);
                            fromRandomAccessReader(fd_slicer.createFromFd(fd, { autoClose: !0 }), stats.size, options, callback);
                        }));
                }
                function fromRandomAccessReader(reader, totalSize, options, callback) {
                    ("function" == typeof options && ((callback = options), (options = null)),
                        null == options && (options = {}),
                        null == options.autoClose && (options.autoClose = !0),
                        null == options.lazyEntries && (options.lazyEntries = !1),
                        null == options.decodeStrings && (options.decodeStrings = !0));
                    var decodeStrings = !!options.decodeStrings;
                    if (
                        (null == options.validateEntrySizes && (options.validateEntrySizes = !0),
                        null == options.strictFileNames && (options.strictFileNames = !1),
                        null == callback && (callback = defaultCallback),
                        "number" != typeof totalSize)
                    )
                        throw Error("expected totalSize parameter to be a number");
                    if (totalSize > Number.MAX_SAFE_INTEGER)
                        throw Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
                    reader.ref();
                    var bufferSize = Math.min(65557, totalSize),
                        buffer = newBuffer(bufferSize),
                        bufferReadStart = totalSize - buffer.length;
                    readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function (err) {
                        if (err) return callback(err);
                        for (var i = bufferSize - 22; i >= 0; i -= 1)
                            if (0x6054b50 === buffer.readUInt32LE(i)) {
                                var eocdrBuffer = buffer.slice(i),
                                    diskNumber = eocdrBuffer.readUInt16LE(4);
                                if (0 !== diskNumber) return callback(Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
                                var entryCount = eocdrBuffer.readUInt16LE(10),
                                    centralDirectoryOffset = eocdrBuffer.readUInt32LE(16),
                                    commentLength = eocdrBuffer.readUInt16LE(20),
                                    expectedCommentLength = eocdrBuffer.length - 22;
                                if (commentLength !== expectedCommentLength)
                                    return callback(Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
                                var comment = decodeStrings ? decodeBuffer(eocdrBuffer, 22, eocdrBuffer.length, !1) : eocdrBuffer.slice(22);
                                if (65535 !== entryCount && 0xffffffff !== centralDirectoryOffset)
                                    return callback(
                                        null,
                                        new ZipFile(
                                            reader,
                                            centralDirectoryOffset,
                                            totalSize,
                                            entryCount,
                                            comment,
                                            options.autoClose,
                                            options.lazyEntries,
                                            decodeStrings,
                                            options.validateEntrySizes,
                                            options.strictFileNames,
                                        ),
                                    );
                                var zip64EocdlBuffer = newBuffer(20),
                                    zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
                                readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset, function (err) {
                                    if (err) return callback(err);
                                    if (0x7064b50 !== zip64EocdlBuffer.readUInt32LE(0)) return callback(Error("invalid zip64 end of central directory locator signature"));
                                    var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8),
                                        zip64EocdrBuffer = newBuffer(56);
                                    readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function (err) {
                                        return err
                                            ? callback(err)
                                            : 0x6064b50 !== zip64EocdrBuffer.readUInt32LE(0)
                                              ? callback(Error("invalid zip64 end of central directory record signature"))
                                              : ((entryCount = readUInt64LE(zip64EocdrBuffer, 32)),
                                                (centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48)),
                                                callback(
                                                    null,
                                                    new ZipFile(
                                                        reader,
                                                        centralDirectoryOffset,
                                                        totalSize,
                                                        entryCount,
                                                        comment,
                                                        options.autoClose,
                                                        options.lazyEntries,
                                                        decodeStrings,
                                                        options.validateEntrySizes,
                                                        options.strictFileNames,
                                                    ),
                                                ));
                                    });
                                });
                                return;
                            }
                        callback(Error("end of central directory record signature not found"));
                    });
                }
                function ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
                    var self1 = this;
                    (EventEmitter.call(self1),
                        (self1.reader = reader),
                        self1.reader.on("error", function (err) {
                            emitError(self1, err);
                        }),
                        self1.reader.once("close", function () {
                            self1.emit("close");
                        }),
                        (self1.readEntryCursor = centralDirectoryOffset),
                        (self1.fileSize = fileSize),
                        (self1.entryCount = entryCount),
                        (self1.comment = comment),
                        (self1.entriesRead = 0),
                        (self1.autoClose = !!autoClose),
                        (self1.lazyEntries = !!lazyEntries),
                        (self1.decodeStrings = !!decodeStrings),
                        (self1.validateEntrySizes = !!validateEntrySizes),
                        (self1.strictFileNames = !!strictFileNames),
                        (self1.isOpen = !0),
                        (self1.emittedError = !1),
                        self1.lazyEntries || self1._readEntry());
                }
                function emitErrorAndAutoClose(self1, err) {
                    (self1.autoClose && self1.close(), emitError(self1, err));
                }
                function emitError(self1, err) {
                    self1.emittedError || ((self1.emittedError = !0), self1.emit("error", err));
                }
                function Entry() {}
                function dosDateTimeToDate(date, time) {
                    return new Date(((date >> 9) & 127) + 1980, ((date >> 5) & 15) - 1, 31 & date, (time >> 11) & 31, (time >> 5) & 63, (31 & time) * 2, 0);
                }
                function validateFileName(fileName) {
                    return -1 !== fileName.indexOf("\\")
                        ? "invalid characters in fileName: " + fileName
                        : /^[a-zA-Z]:/.test(fileName) || /^\//.test(fileName)
                          ? "absolute path: " + fileName
                          : -1 !== fileName.split("/").indexOf("..")
                            ? "invalid relative path: " + fileName
                            : null;
                }
                function readAndAssertNoEof(reader, buffer, offset, length, position, callback) {
                    if (0 === length)
                        return setImmediate(function () {
                            callback(null, newBuffer(0));
                        });
                    reader.read(buffer, offset, length, position, function (err, bytesRead) {
                        return err ? callback(err) : bytesRead < length ? callback(Error("unexpected EOF")) : void callback();
                    });
                }
                function AssertByteCountStream(byteCount) {
                    (Transform.call(this), (this.actualByteCount = 0), (this.expectedByteCount = byteCount));
                }
                function RandomAccessReader() {
                    (EventEmitter.call(this), (this.refCount = 0));
                }
                function RefUnrefFilter(context) {
                    (PassThrough.call(this), (this.context = context), this.context.ref(), (this.unreffedYet = !1));
                }
                function decodeBuffer(buffer, start, end, isUtf8) {
                    if (isUtf8) return buffer.toString("utf8", start, end);
                    for (var result = "", i = start; i < end; i++)
                        result +=
                            "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xb6\xa7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xc7\xfc\xe9\xe2\xe4\xe0\xe5\xe7\xea\xeb\xe8\xef\xee\xec\xc4\xc5\xc9\xe6\xc6\xf4\xf6\xf2\xfb\xf9\xff\xd6\xdc\xa2\xa3\xa5\u20A7\u0192\xe1\xed\xf3\xfa\xf1\xd1\xaa\xba\xbf\u2310\xac\xbd\xbc\xa1\xab\xbb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xdf\u0393\u03C0\u03A3\u03C3\xb5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xb1\u2265\u2264\u2320\u2321\xf7\u2248\xb0\u2219\xb7\u221A\u207F\xb2\u25A0\xa0"[
                                buffer[i]
                            ];
                    return result;
                }
                function readUInt64LE(buffer, offset) {
                    var lower32 = buffer.readUInt32LE(offset);
                    return 0x100000000 * buffer.readUInt32LE(offset + 4) + lower32;
                }
                function defaultCallback(err) {
                    if (err) throw err;
                }
                ((exports.open = function (path, options, callback) {
                    ("function" == typeof options && ((callback = options), (options = null)),
                        null == options && (options = {}),
                        null == options.autoClose && (options.autoClose = !0),
                        null == options.lazyEntries && (options.lazyEntries = !1),
                        null == options.decodeStrings && (options.decodeStrings = !0),
                        null == options.validateEntrySizes && (options.validateEntrySizes = !0),
                        null == options.strictFileNames && (options.strictFileNames = !1),
                        null == callback && (callback = defaultCallback),
                        fs.open(path, "r", function (err, fd) {
                            if (err) return callback(err);
                            fromFd(fd, options, function (err, zipfile) {
                                (err && fs.close(fd, defaultCallback), callback(err, zipfile));
                            });
                        }));
                }),
                    (exports.fromFd = fromFd),
                    (exports.fromBuffer = function (buffer, options, callback) {
                        ("function" == typeof options && ((callback = options), (options = null)),
                            null == options && (options = {}),
                            (options.autoClose = !1),
                            null == options.lazyEntries && (options.lazyEntries = !1),
                            null == options.decodeStrings && (options.decodeStrings = !0),
                            null == options.validateEntrySizes && (options.validateEntrySizes = !0),
                            null == options.strictFileNames && (options.strictFileNames = !1),
                            fromRandomAccessReader(fd_slicer.createFromBuffer(buffer, { maxChunkSize: 65536 }), buffer.length, options, callback));
                    }),
                    (exports.fromRandomAccessReader = fromRandomAccessReader),
                    (exports.dosDateTimeToDate = dosDateTimeToDate),
                    (exports.validateFileName = validateFileName),
                    (exports.ZipFile = ZipFile),
                    (exports.Entry = Entry),
                    (exports.RandomAccessReader = RandomAccessReader),
                    util.inherits(ZipFile, EventEmitter),
                    (ZipFile.prototype.close = function () {
                        this.isOpen && ((this.isOpen = !1), this.reader.unref());
                    }),
                    (ZipFile.prototype.readEntry = function () {
                        if (!this.lazyEntries) throw Error("readEntry() called without lazyEntries:true");
                        this._readEntry();
                    }),
                    (ZipFile.prototype._readEntry = function () {
                        var self1 = this;
                        if (self1.entryCount === self1.entriesRead)
                            return void setImmediate(function () {
                                (self1.autoClose && self1.close(), self1.emittedError || self1.emit("end"));
                            });
                        if (!self1.emittedError) {
                            var buffer = newBuffer(46);
                            readAndAssertNoEof(self1.reader, buffer, 0, buffer.length, self1.readEntryCursor, function (err) {
                                if (err) return emitErrorAndAutoClose(self1, err);
                                if (!self1.emittedError) {
                                    var entry = new Entry(),
                                        signature = buffer.readUInt32LE(0);
                                    if (0x2014b50 !== signature)
                                        return emitErrorAndAutoClose(self1, Error("invalid central directory file header signature: 0x" + signature.toString(16)));
                                    if (
                                        ((entry.versionMadeBy = buffer.readUInt16LE(4)),
                                        (entry.versionNeededToExtract = buffer.readUInt16LE(6)),
                                        (entry.generalPurposeBitFlag = buffer.readUInt16LE(8)),
                                        (entry.compressionMethod = buffer.readUInt16LE(10)),
                                        (entry.lastModFileTime = buffer.readUInt16LE(12)),
                                        (entry.lastModFileDate = buffer.readUInt16LE(14)),
                                        (entry.crc32 = buffer.readUInt32LE(16)),
                                        (entry.compressedSize = buffer.readUInt32LE(20)),
                                        (entry.uncompressedSize = buffer.readUInt32LE(24)),
                                        (entry.fileNameLength = buffer.readUInt16LE(28)),
                                        (entry.extraFieldLength = buffer.readUInt16LE(30)),
                                        (entry.fileCommentLength = buffer.readUInt16LE(32)),
                                        (entry.internalFileAttributes = buffer.readUInt16LE(36)),
                                        (entry.externalFileAttributes = buffer.readUInt32LE(38)),
                                        (entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42)),
                                        64 & entry.generalPurposeBitFlag)
                                    )
                                        return emitErrorAndAutoClose(self1, Error("strong encryption is not supported"));
                                    ((self1.readEntryCursor += 46),
                                        (buffer = newBuffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength)),
                                        readAndAssertNoEof(self1.reader, buffer, 0, buffer.length, self1.readEntryCursor, function (err) {
                                            if (err) return emitErrorAndAutoClose(self1, err);
                                            if (!self1.emittedError) {
                                                var isUtf8 = (2048 & entry.generalPurposeBitFlag) != 0;
                                                entry.fileName = self1.decodeStrings
                                                    ? decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8)
                                                    : buffer.slice(0, entry.fileNameLength);
                                                var fileCommentStart = entry.fileNameLength + entry.extraFieldLength,
                                                    extraFieldBuffer = buffer.slice(entry.fileNameLength, fileCommentStart);
                                                entry.extraFields = [];
                                                for (var i = 0; i < extraFieldBuffer.length - 3;) {
                                                    var headerId = extraFieldBuffer.readUInt16LE(i + 0),
                                                        dataSize = extraFieldBuffer.readUInt16LE(i + 2),
                                                        dataStart = i + 4,
                                                        dataEnd = dataStart + dataSize;
                                                    if (dataEnd > extraFieldBuffer.length)
                                                        return emitErrorAndAutoClose(self1, Error("extra field length exceeds extra field buffer size"));
                                                    var dataBuffer = newBuffer(dataSize);
                                                    (extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd),
                                                        entry.extraFields.push({ id: headerId, data: dataBuffer }),
                                                        (i = dataEnd));
                                                }
                                                if (
                                                    ((entry.fileComment = self1.decodeStrings
                                                        ? decodeBuffer(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8)
                                                        : buffer.slice(fileCommentStart, fileCommentStart + entry.fileCommentLength)),
                                                    (entry.comment = entry.fileComment),
                                                    (self1.readEntryCursor += buffer.length),
                                                    (self1.entriesRead += 1),
                                                    0xffffffff === entry.uncompressedSize ||
                                                        0xffffffff === entry.compressedSize ||
                                                        0xffffffff === entry.relativeOffsetOfLocalHeader)
                                                ) {
                                                    for (var zip64EiefBuffer = null, i = 0; i < entry.extraFields.length; i++) {
                                                        var extraField = entry.extraFields[i];
                                                        if (1 === extraField.id) {
                                                            zip64EiefBuffer = extraField.data;
                                                            break;
                                                        }
                                                    }
                                                    if (null == zip64EiefBuffer) return emitErrorAndAutoClose(self1, Error("expected zip64 extended information extra field"));
                                                    var index = 0;
                                                    if (0xffffffff === entry.uncompressedSize) {
                                                        if (index + 8 > zip64EiefBuffer.length)
                                                            return emitErrorAndAutoClose(self1, Error("zip64 extended information extra field does not include uncompressed size"));
                                                        ((entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index)), (index += 8));
                                                    }
                                                    if (0xffffffff === entry.compressedSize) {
                                                        if (index + 8 > zip64EiefBuffer.length)
                                                            return emitErrorAndAutoClose(self1, Error("zip64 extended information extra field does not include compressed size"));
                                                        ((entry.compressedSize = readUInt64LE(zip64EiefBuffer, index)), (index += 8));
                                                    }
                                                    if (0xffffffff === entry.relativeOffsetOfLocalHeader) {
                                                        if (index + 8 > zip64EiefBuffer.length)
                                                            return emitErrorAndAutoClose(
                                                                self1,
                                                                Error("zip64 extended information extra field does not include relative header offset"),
                                                            );
                                                        ((entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index)), (index += 8));
                                                    }
                                                }
                                                if (self1.decodeStrings)
                                                    for (var i = 0; i < entry.extraFields.length; i++) {
                                                        var extraField = entry.extraFields[i];
                                                        if (28789 === extraField.id) {
                                                            if (extraField.data.length < 6 || 1 !== extraField.data.readUInt8(0)) continue;
                                                            var oldNameCrc32 = extraField.data.readUInt32LE(1);
                                                            if (crc32.unsigned(buffer.slice(0, entry.fileNameLength)) !== oldNameCrc32) continue;
                                                            entry.fileName = decodeBuffer(extraField.data, 5, extraField.data.length, !0);
                                                            break;
                                                        }
                                                    }
                                                if (self1.validateEntrySizes && 0 === entry.compressionMethod) {
                                                    var expectedCompressedSize = entry.uncompressedSize;
                                                    if ((entry.isEncrypted() && (expectedCompressedSize += 12), entry.compressedSize !== expectedCompressedSize))
                                                        return emitErrorAndAutoClose(
                                                            self1,
                                                            Error(
                                                                "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize,
                                                            ),
                                                        );
                                                }
                                                if (self1.decodeStrings) {
                                                    self1.strictFileNames || (entry.fileName = entry.fileName.replace(/\\/g, "/"));
                                                    var errorMessage = validateFileName(entry.fileName, self1.validateFileNameOptions);
                                                    if (null != errorMessage) return emitErrorAndAutoClose(self1, Error(errorMessage));
                                                }
                                                (self1.emit("entry", entry), self1.lazyEntries || self1._readEntry());
                                            }
                                        }));
                                }
                            });
                        }
                    }),
                    (ZipFile.prototype.openReadStream = function (entry, options, callback) {
                        var self1 = this,
                            relativeStart = 0,
                            relativeEnd = entry.compressedSize;
                        if (null == callback) ((callback = options), (options = {}));
                        else {
                            if (null != options.decrypt) {
                                if (!entry.isEncrypted()) throw Error("options.decrypt can only be specified for encrypted entries");
                                if (!1 !== options.decrypt) throw Error("invalid options.decrypt value: " + options.decrypt);
                                if (entry.isCompressed() && !1 !== options.decompress) throw Error("entry is encrypted and compressed, and options.decompress !== false");
                            }
                            if (null != options.decompress) {
                                if (!entry.isCompressed()) throw Error("options.decompress can only be specified for compressed entries");
                                if (!1 !== options.decompress && !0 !== options.decompress) throw Error("invalid options.decompress value: " + options.decompress);
                            }
                            if (null != options.start || null != options.end) {
                                if (entry.isCompressed() && !1 !== options.decompress)
                                    throw Error("start/end range not allowed for compressed entry without options.decompress === false");
                                if (entry.isEncrypted() && !1 !== options.decrypt) throw Error("start/end range not allowed for encrypted entry without options.decrypt === false");
                            }
                            if (null != options.start) {
                                if ((relativeStart = options.start) < 0) throw Error("options.start < 0");
                                if (relativeStart > entry.compressedSize) throw Error("options.start > entry.compressedSize");
                            }
                            if (null != options.end) {
                                if ((relativeEnd = options.end) < 0) throw Error("options.end < 0");
                                if (relativeEnd > entry.compressedSize) throw Error("options.end > entry.compressedSize");
                                if (relativeEnd < relativeStart) throw Error("options.end < options.start");
                            }
                        }
                        if (!self1.isOpen) return callback(Error("closed"));
                        if (entry.isEncrypted() && !1 !== options.decrypt) return callback(Error("entry is encrypted, and options.decrypt !== false"));
                        self1.reader.ref();
                        var buffer = newBuffer(30);
                        readAndAssertNoEof(self1.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function (err) {
                            try {
                                if (err) return callback(err);
                                var decompress,
                                    signature = buffer.readUInt32LE(0);
                                if (0x4034b50 !== signature) return callback(Error("invalid local file header signature: 0x" + signature.toString(16)));
                                var fileNameLength = buffer.readUInt16LE(26),
                                    extraFieldLength = buffer.readUInt16LE(28),
                                    localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
                                if (0 === entry.compressionMethod) decompress = !1;
                                else {
                                    if (8 !== entry.compressionMethod) return callback(Error("unsupported compression method: " + entry.compressionMethod));
                                    decompress = null == options.decompress || options.decompress;
                                }
                                var fileDataEnd = localFileHeaderEnd + entry.compressedSize;
                                if (0 !== entry.compressedSize && fileDataEnd > self1.fileSize)
                                    return callback(Error("file data overflows file bounds: " + localFileHeaderEnd + " + " + entry.compressedSize + " > " + self1.fileSize));
                                var readStream = self1.reader.createReadStream({ start: localFileHeaderEnd + relativeStart, end: localFileHeaderEnd + relativeEnd }),
                                    endpointStream = readStream;
                                if (decompress) {
                                    var destroyed = !1,
                                        inflateFilter = zlib.createInflateRaw();
                                    (readStream.on("error", function (err) {
                                        setImmediate(function () {
                                            destroyed || inflateFilter.emit("error", err);
                                        });
                                    }),
                                        readStream.pipe(inflateFilter),
                                        self1.validateEntrySizes
                                            ? ((endpointStream = new AssertByteCountStream(entry.uncompressedSize)),
                                              inflateFilter.on("error", function (err) {
                                                  setImmediate(function () {
                                                      destroyed || endpointStream.emit("error", err);
                                                  });
                                              }),
                                              inflateFilter.pipe(endpointStream))
                                            : (endpointStream = inflateFilter),
                                        (endpointStream.destroy = function () {
                                            ((destroyed = !0),
                                                inflateFilter !== endpointStream && inflateFilter.unpipe(endpointStream),
                                                readStream.unpipe(inflateFilter),
                                                readStream.destroy());
                                        }));
                                }
                                callback(null, endpointStream);
                            } finally {
                                self1.reader.unref();
                            }
                        });
                    }),
                    (Entry.prototype.getLastModDate = function () {
                        return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime);
                    }),
                    (Entry.prototype.isEncrypted = function () {
                        return (1 & this.generalPurposeBitFlag) != 0;
                    }),
                    (Entry.prototype.isCompressed = function () {
                        return 8 === this.compressionMethod;
                    }),
                    util.inherits(AssertByteCountStream, Transform),
                    (AssertByteCountStream.prototype._transform = function (chunk, encoding, cb) {
                        if (((this.actualByteCount += chunk.length), this.actualByteCount > this.expectedByteCount))
                            return cb(Error("too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount));
                        cb(null, chunk);
                    }),
                    (AssertByteCountStream.prototype._flush = function (cb) {
                        if (this.actualByteCount < this.expectedByteCount)
                            return cb(Error("not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount));
                        cb();
                    }),
                    util.inherits(RandomAccessReader, EventEmitter),
                    (RandomAccessReader.prototype.ref = function () {
                        this.refCount += 1;
                    }),
                    (RandomAccessReader.prototype.unref = function () {
                        var self1 = this;
                        if (((self1.refCount -= 1), !(self1.refCount > 0))) {
                            if (self1.refCount < 0) throw Error("invalid unref");
                            self1.close(function (err) {
                                if (err) return self1.emit("error", err);
                                self1.emit("close");
                            });
                        }
                    }),
                    (RandomAccessReader.prototype.createReadStream = function (options) {
                        var start = options.start,
                            end = options.end;
                        if (start === end) {
                            var emptyStream = new PassThrough();
                            return (
                                setImmediate(function () {
                                    emptyStream.end();
                                }),
                                emptyStream
                            );
                        }
                        var stream = this._readStreamForRange(start, end),
                            destroyed = !1,
                            refUnrefFilter = new RefUnrefFilter(this);
                        (stream.on("error", function (err) {
                            setImmediate(function () {
                                destroyed || refUnrefFilter.emit("error", err);
                            });
                        }),
                            (refUnrefFilter.destroy = function () {
                                (stream.unpipe(refUnrefFilter), refUnrefFilter.unref(), stream.destroy());
                            }));
                        var byteCounter = new AssertByteCountStream(end - start);
                        return (
                            refUnrefFilter.on("error", function (err) {
                                setImmediate(function () {
                                    destroyed || byteCounter.emit("error", err);
                                });
                            }),
                            (byteCounter.destroy = function () {
                                ((destroyed = !0), refUnrefFilter.unpipe(byteCounter), refUnrefFilter.destroy());
                            }),
                            stream.pipe(refUnrefFilter).pipe(byteCounter)
                        );
                    }),
                    (RandomAccessReader.prototype._readStreamForRange = function (start, end) {
                        throw Error("not implemented");
                    }),
                    (RandomAccessReader.prototype.read = function (buffer, offset, length, position, callback) {
                        var readStream = this.createReadStream({ start: position, end: position + length }),
                            writeStream = new Writable(),
                            written = 0;
                        ((writeStream._write = function (chunk, encoding, cb) {
                            (chunk.copy(buffer, offset + written, 0, chunk.length), (written += chunk.length), cb());
                        }),
                            writeStream.on("finish", callback),
                            readStream.on("error", function (error) {
                                callback(error);
                            }),
                            readStream.pipe(writeStream));
                    }),
                    (RandomAccessReader.prototype.close = function (callback) {
                        setImmediate(callback);
                    }),
                    util.inherits(RefUnrefFilter, PassThrough),
                    (RefUnrefFilter.prototype._flush = function (cb) {
                        (this.unref(), cb());
                    }),
                    (RefUnrefFilter.prototype.unref = function (cb) {
                        this.unreffedYet || ((this.unreffedYet = !0), this.context.unref());
                    }),
                    (newBuffer =
                        "function" == typeof Buffer.allocUnsafe
                            ? function (len) {
                                  return Buffer.allocUnsafe(len);
                              }
                            : function (len) {
                                  return new Buffer(len);
                              }));
            },
            5385(module1) {
                "use strict";
                module1.exports = require("zycord_notifications");
            },
            4928(module1) {
                "use strict";
                module1.exports = require("zycord_utils");
            },
            1288(module1) {
                "use strict";
                module1.exports = require("electron");
            },
            215(module1) {
                "use strict";
                module1.exports = require("original-fs");
            },
            2613(module1) {
                "use strict";
                module1.exports = require("assert");
            },
            181(module1) {
                "use strict";
                module1.exports = require("buffer");
            },
            5317(module1) {
                "use strict";
                module1.exports = require("child_process");
            },
            6982(module1) {
                "use strict";
                module1.exports = require("crypto");
            },
            4434(module1) {
                "use strict";
                module1.exports = require("events");
            },
            9896(module1) {
                "use strict";
                module1.exports = require("fs");
            },
            8611(module1) {
                "use strict";
                module1.exports = require("http");
            },
            5692(module1) {
                "use strict";
                module1.exports = require("https");
            },
            3339(module1) {
                "use strict";
                module1.exports = require("module");
            },
            1421(module1) {
                "use strict";
                module1.exports = require("node:child_process");
            },
            7598(module1) {
                "use strict";
                module1.exports = require("node:crypto");
            },
            1314(module1) {
                "use strict";
                module1.exports = require("node:dgram");
            },
            3024(module1) {
                "use strict";
                module1.exports = require("node:fs");
            },
            1455(module1) {
                "use strict";
                module1.exports = require("node:fs/promises");
            },
            7075(module1) {
                "use strict";
                module1.exports = require("node:stream");
            },
            857(module1) {
                "use strict";
                module1.exports = require("os");
            },
            6928(module1) {
                "use strict";
                module1.exports = require("path");
            },
            932(module1) {
                "use strict";
                module1.exports = require("process");
            },
            2203(module1) {
                "use strict";
                module1.exports = require("stream");
            },
            7016(module1) {
                "use strict";
                module1.exports = require("url");
            },
            9023(module1) {
                "use strict";
                module1.exports = require("util");
            },
            3106(module1) {
                "use strict";
                module1.exports = require("zlib");
            },
        },
        __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module1 = (__webpack_module_cache__[moduleId] = { id: moduleId, loaded: !1, exports: {} });
        return (__webpack_modules__[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__), (module1.loaded = !0), module1.exports);
    }
    ((__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)),
        (__webpack_require__.nmd = (module1) => ((module1.paths = []), module1.children || (module1.children = []), module1)));
    var __webpack_exports__ = {};
    ((() => {
        "use strict";
        let mainScreen;
        (Object.defineProperty(__webpack_exports__, "__esModule", { value: !0 }),
            (__webpack_exports__.startup = function (bootstrapModules) {
                (performance.mark("coremodule-index-startup"), __webpack_require__(9895).init(bootstrapModules), __webpack_require__(822), __webpack_require__(5231));
                let { moduleUpdater } = __webpack_require__(2979),
                    { updater } = __webpack_require__(1623);
                __webpack_require__(2539);
                let { buildInfo } = __webpack_require__(2130),
                    { appSettings } = __webpack_require__(8504),
                    Constants = __webpack_require__(6605);
                Constants.init(bootstrapModules.Constants);
                let appFeatures = __webpack_require__(5976);
                appFeatures.init();
                let GPUSettings = __webpack_require__(3647);
                (bootstrapModules.GPUSettings.replace(GPUSettings), __webpack_require__(8730).init(), __webpack_require__(7912));
                let app = __webpack_require__(4943);
                (app.injectBuildInfo(buildInfo), app.injectModuleUpdater(moduleUpdater), app.injectUpdater(updater), __webpack_require__(7126), __webpack_require__(6577));
                let { crashReporterSetup } = __webpack_require__(2283);
                (crashReporterSetup.isInitialized() || crashReporterSetup.init(buildInfo),
                    __webpack_require__(7138),
                    __webpack_require__(2236),
                    __webpack_require__(1353).injectFeaturesBackend(appFeatures.getFeatures()),
                    __webpack_require__(9473),
                    __webpack_require__(8750));
                let { setupClipsProtocol } = __webpack_require__(7635);
                (setupClipsProtocol(), __webpack_require__(299), __webpack_require__(1667).injectGpuSettingsBackend(GPUSettings));
                let nativeModules = __webpack_require__(216);
                (nativeModules.injectModuleUpdater(moduleUpdater),
                    nativeModules.injectUpdater(updater),
                    __webpack_require__(4355),
                    __webpack_require__(7592),
                    __webpack_require__(4531),
                    __webpack_require__(7420));
                let frameDebugger = __webpack_require__(7026);
                (__webpack_require__(7314).initialize(), __webpack_require__(9984), __webpack_require__(5454));
                let settings = __webpack_require__(7683),
                    appSettingsInject = appSettings.getSettings();
                (null != appSettingsInject && settings.injectSettingsBackend(appSettingsInject), __webpack_require__(3132), __webpack_require__(1742));
                let windowNative = __webpack_require__(3386);
                (__webpack_require__(5544),
                    (global.crashReporterMetadata = crashReporterSetup.metadata),
                    (global.mainAppDirname = Constants.MAIN_APP_DIRNAME),
                    (global.features = appFeatures.getFeatures()),
                    (global.appSettings = appSettingsInject),
                    (global.mainWindowId = Constants.DEFAULT_MAIN_WINDOW_ID),
                    (global.moduleUpdater = moduleUpdater));
                let enableDevtoolsSetting = global.appSettings.get("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING", !1),
                    enableDevtools = "stable" !== buildInfo.releaseChannel || enableDevtoolsSetting,
                    createApplicationMenu = __webpack_require__(7814);
                (electron_1.Menu.setApplicationMenu(createApplicationMenu(enableDevtools)),
                    "darwin" === process.platform &&
                        ("development" === buildInfo.releaseChannel || "canary" === buildInfo.releaseChannel) &&
                        electron_1.systemPreferences.setUserDefault("SquirrelMacEnableDirectContentsWrite", "boolean", !0),
                    (mainScreen = __webpack_require__(5203)).init());
                let { getWindow: getPopoutWindowByKey, getAllWindows: getAllPopoutWindows, setNewWindowEvent } = __webpack_require__(9698);
                (windowNative.injectGetWindow(
                    (key) => (null == key ? electron_1.BrowserWindow.fromId(mainScreen.getMainWindowId()) : getPopoutWindowByKey(key)),
                    () => [...getAllPopoutWindows(), electron_1.BrowserWindow.fromId(mainScreen.getMainWindowId())],
                ),
                    setNewWindowEvent((window) => windowNative.newWindowEvent(window)),
                    frameDebugger.injectFrameDebugger({
                        allowDevHosts: "development" === buildInfo.releaseChannel,
                        webappOrigin: new URL(mainScreen.WEBAPP_ENDPOINT).origin,
                        getMainWebContents: () => electron_1.BrowserWindow.fromId(mainScreen.getMainWindowId())?.webContents ?? null,
                    }),
                    performance.measure("coremodule-index-startup-duration", "coremodule-index-startup"));
            }),
            (__webpack_exports__.handleOpenUrl = function (url) {
                null != mainScreen && mainScreen.handleOpenUrl(url);
            }),
            (__webpack_exports__.setMainWindowVisible = function (visible, inactive = !1) {
                mainScreen.setMainWindowVisible(visible, inactive);
            }));