201(__unused_rspack_module, exports, __webpack_require__) {
                var fs = __webpack_require__(9896),
                    util = __webpack_require__(9023),
                    stream = __webpack_require__(2203),
                    Readable = stream.Readable,
                    Writable = stream.Writable,
                    PassThrough = stream.PassThrough,
                    Pend = __webpack_require__(8557),
                    EventEmitter = __webpack_require__(4434).EventEmitter;
                function FdSlicer(fd, options) {
                    ((options = options || {}),
                        EventEmitter.call(this),
                        (this.fd = fd),
                        (this.pend = new Pend()),
                        (this.pend.max = 1),
                        (this.refCount = 0),
                        (this.autoClose = !!options.autoClose));
                }
                function ReadStream(context, options) {
                    ((options = options || {}),
                        Readable.call(this, options),
                        (this.context = context),
                        this.context.ref(),
                        (this.start = options.start || 0),
                        (this.endOffset = options.end),
                        (this.pos = this.start),
                        (this.destroyed = !1));
                }
                function WriteStream(context, options) {
                    ((options = options || {}),
                        Writable.call(this, options),
                        (this.context = context),
                        this.context.ref(),
                        (this.start = options.start || 0),
                        (this.endOffset = null == options.end ? 1 / 0 : +options.end),
                        (this.bytesWritten = 0),
                        (this.pos = this.start),
                        (this.destroyed = !1),
                        this.on("finish", this.destroy.bind(this)));
                }
                function BufferSlicer(buffer, options) {
                    (EventEmitter.call(this),
                        (options = options || {}),
                        (this.refCount = 0),
                        (this.buffer = buffer),
                        (this.maxChunkSize = options.maxChunkSize || Number.MAX_SAFE_INTEGER));
                }
                ((exports.createFromBuffer = function (buffer, options) {
                    return new BufferSlicer(buffer, options);
                }),
                    (exports.createFromFd = function (fd, options) {
                        return new FdSlicer(fd, options);
                    }),
                    (exports.BufferSlicer = BufferSlicer),
                    (exports.FdSlicer = FdSlicer),
                    util.inherits(FdSlicer, EventEmitter),
                    (FdSlicer.prototype.read = function (buffer, offset, length, position, callback) {
                        var self1 = this;
                        self1.pend.go(function (cb) {
                            fs.read(self1.fd, buffer, offset, length, position, function (err, bytesRead, buffer) {
                                (cb(), callback(err, bytesRead, buffer));
                            });
                        });
                    }),
                    (FdSlicer.prototype.write = function (buffer, offset, length, position, callback) {
                        var self1 = this;
                        self1.pend.go(function (cb) {
                            fs.write(self1.fd, buffer, offset, length, position, function (err, written, buffer) {
                                (cb(), callback(err, written, buffer));
                            });
                        });
                    }),
                    (FdSlicer.prototype.createReadStream = function (options) {
                        return new ReadStream(this, options);
                    }),
                    (FdSlicer.prototype.createWriteStream = function (options) {
                        return new WriteStream(this, options);
                    }),
                    (FdSlicer.prototype.ref = function () {
                        this.refCount += 1;
                    }),
                    (FdSlicer.prototype.unref = function () {
                        var self1 = this;
                        if (((self1.refCount -= 1), !(self1.refCount > 0))) {
                            if (self1.refCount < 0) throw Error("invalid unref");
                            self1.autoClose &&
                                fs.close(self1.fd, function (err) {
                                    err ? self1.emit("error", err) : self1.emit("close");
                                });
                        }
                    }),
                    util.inherits(ReadStream, Readable),
                    (ReadStream.prototype._read = function (n) {
                        var self1 = this;
                        if (!self1.destroyed) {
                            var toRead = Math.min(self1._readableState.highWaterMark, n);
                            if ((null != self1.endOffset && (toRead = Math.min(toRead, self1.endOffset - self1.pos)), toRead <= 0)) {
                                ((self1.destroyed = !0), self1.push(null), self1.context.unref());
                                return;
                            }
                            self1.context.pend.go(function (cb) {
                                if (self1.destroyed) return cb();
                                var buffer = new Buffer(toRead);
                                fs.read(self1.context.fd, buffer, 0, toRead, self1.pos, function (err, bytesRead) {
                                    (err
                                        ? self1.destroy(err)
                                        : 0 === bytesRead
                                          ? ((self1.destroyed = !0), self1.push(null), self1.context.unref())
                                          : ((self1.pos += bytesRead), self1.push(buffer.slice(0, bytesRead))),
                                        cb());
                                });
                            });
                        }
                    }),
                    (ReadStream.prototype.destroy = function (err) {
                        this.destroyed || ((err = err || Error("stream destroyed")), (this.destroyed = !0), this.emit("error", err), this.context.unref());
                    }),
                    util.inherits(WriteStream, Writable),
                    (WriteStream.prototype._write = function (buffer, encoding, callback) {
                        var self1 = this;
                        if (!self1.destroyed) {
                            if (self1.pos + buffer.length > self1.endOffset) {
                                var err = Error("maximum file length exceeded");
                                ((err.code = "ETOOBIG"), self1.destroy(), callback(err));
                                return;
                            }
                            self1.context.pend.go(function (cb) {
                                if (self1.destroyed) return cb();
                                fs.write(self1.context.fd, buffer, 0, buffer.length, self1.pos, function (err, bytes) {
                                    err ? (self1.destroy(), cb(), callback(err)) : ((self1.bytesWritten += bytes), (self1.pos += bytes), self1.emit("progress"), cb(), callback());
                                });
                            });
                        }
                    }),
                    (WriteStream.prototype.destroy = function () {
                        this.destroyed || ((this.destroyed = !0), this.context.unref());
                    }),
                    util.inherits(BufferSlicer, EventEmitter),
                    (BufferSlicer.prototype.read = function (buffer, offset, length, position, callback) {
                        var end = position + length,
                            delta = end - this.buffer.length,
                            written = delta > 0 ? delta : length;
                        (this.buffer.copy(buffer, offset, position, end),
                            setImmediate(function () {
                                callback(null, written);
                            }));
                    }),
                    (BufferSlicer.prototype.write = function (buffer, offset, length, position, callback) {
                        (buffer.copy(this.buffer, position, offset, offset + length),
                            setImmediate(function () {
                                callback(null, length, buffer);
                            }));
                    }),
                    (BufferSlicer.prototype.createReadStream = function (options) {
                        var readStream = new PassThrough((options = options || {}));
                        ((readStream.destroyed = !1),
                            (readStream.start = options.start || 0),
                            (readStream.endOffset = options.end),
                            (readStream.pos = readStream.endOffset || this.buffer.length));
                        for (var entireSlice = this.buffer.slice(readStream.start, readStream.pos), offset = 0; ;) {
                            var nextOffset = offset + this.maxChunkSize;
                            if (nextOffset >= entireSlice.length) {
                                offset < entireSlice.length && readStream.write(entireSlice.slice(offset, entireSlice.length));
                                break;
                            }
                            (readStream.write(entireSlice.slice(offset, nextOffset)), (offset = nextOffset));
                        }
                        return (
                            readStream.end(),
                            (readStream.destroy = function () {
                                readStream.destroyed = !0;
                            }),
                            readStream
                        );
                    }),
                    (BufferSlicer.prototype.createWriteStream = function (options) {
                        var bufferSlicer = this,
                            writeStream = new Writable((options = options || {}));
                        return (
                            (writeStream.start = options.start || 0),
                            (writeStream.endOffset = null == options.end ? this.buffer.length : +options.end),
                            (writeStream.bytesWritten = 0),
                            (writeStream.pos = writeStream.start),
                            (writeStream.destroyed = !1),
                            (writeStream._write = function (buffer, encoding, callback) {
                                if (!writeStream.destroyed) {
                                    var end = writeStream.pos + buffer.length;
                                    if (end > writeStream.endOffset) {
                                        var err = Error("maximum file length exceeded");
                                        ((err.code = "ETOOBIG"), (writeStream.destroyed = !0), callback(err));
                                        return;
                                    }
                                    (buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length),
                                        (writeStream.bytesWritten += buffer.length),
                                        (writeStream.pos = end),
                                        writeStream.emit("progress"),
                                        callback());
                                }
                            }),
                            (writeStream.destroy = function () {
                                writeStream.destroyed = !0;
                            }),
                            writeStream
                        );
                    }),
                    (BufferSlicer.prototype.ref = function () {
                        this.refCount += 1;
                    }),
                    (BufferSlicer.prototype.unref = function () {
                        if (((this.refCount -= 1), this.refCount < 0)) throw Error("invalid unref");
                    }));
            }