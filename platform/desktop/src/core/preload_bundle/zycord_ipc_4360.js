4360(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.DownloaderHelper = exports.DH_STATES = void 0));
                var _typeof =
                        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                            ? function (a) {
                                  return typeof a;
                              }
                            : function (a) {
                                  return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
                              },
                    _createClass = (function () {
                        function a(a, b) {
                            for (var c, d = 0; d < b.length; d++)
                                (((c = b[d]).enumerable = c.enumerable || !1), (c.configurable = !0), "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c));
                        }
                        return function (b, c, d) {
                            return (c && a(b.prototype, c), d && a(b, d), b);
                        };
                    })(),
                    fs = _interopRequireWildcard(__webpack_require__(9896)),
                    _url = __webpack_require__(7016),
                    path = _interopRequireWildcard(__webpack_require__(6928)),
                    http = _interopRequireWildcard(__webpack_require__(8611)),
                    https = _interopRequireWildcard(__webpack_require__(5692)),
                    _events = __webpack_require__(4434);
                function _interopRequireWildcard(a) {
                    if (a && a.__esModule) return a;
                    var b = {};
                    if (null != a) for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
                    return ((b.default = a), b);
                }
                function _possibleConstructorReturn(a, b) {
                    if (!a) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return b && ("object" == typeof b || "function" == typeof b) ? b : a;
                }
                var DH_STATES = (exports.DH_STATES = {
                    IDLE: "IDLE",
                    SKIPPED: "SKIPPED",
                    STARTED: "STARTED",
                    DOWNLOADING: "DOWNLOADING",
                    RETRY: "RETRY",
                    PAUSED: "PAUSED",
                    RESUMED: "RESUMED",
                    STOPPED: "STOPPED",
                    FINISHED: "FINISHED",
                    FAILED: "FAILED",
                });
                exports.DownloaderHelper = (function (a) {
                    function b(a, c) {
                        var d = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                        if (!(this instanceof b)) throw TypeError("Cannot call a class as a function");
                        var e = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, { captureRejections: !0 }));
                        return e.__validate(a, c)
                            ? ((e.url = e.requestURL = a.trim()),
                              (e.state = DH_STATES.IDLE),
                              (e.__defaultOpts = {
                                  body: null,
                                  retry: !1,
                                  method: "GET",
                                  headers: {},
                                  fileName: "",
                                  timeout: -1,
                                  metadata: null,
                                  override: !1,
                                  forceResume: !1,
                                  removeOnStop: !0,
                                  removeOnFail: !0,
                                  progressThrottle: 1e3,
                                  httpRequestOptions: {},
                                  httpsRequestOptions: {},
                                  resumeOnIncomplete: !0,
                                  resumeIfFileExists: !1,
                                  resumeOnIncompleteMaxRetry: 5,
                              }),
                              (e.__opts = Object.assign({}, e.__defaultOpts)),
                              (e.__pipes = []),
                              (e.__total = 0),
                              (e.__downloaded = 0),
                              (e.__progress = 0),
                              (e.__retryCount = 0),
                              (e.__retryTimeout = null),
                              (e.__resumeRetryCount = 0),
                              (e.__states = DH_STATES),
                              (e.__promise = null),
                              (e.__request = null),
                              (e.__response = null),
                              (e.__isAborted = !1),
                              (e.__isResumed = !1),
                              (e.__isResumable = !1),
                              (e.__isRedirected = !1),
                              (e.__destFolder = c),
                              (e.__statsEstimate = { time: 0, bytes: 0, prevBytes: 0, throttleTime: 0 }),
                              (e.__fileName = ""),
                              (e.__filePath = ""),
                              e.updateOptions(d),
                              e)
                            : _possibleConstructorReturn(e);
                    }
                    return (
                        (function (a, b) {
                            if ("function" != typeof b && null !== b) throw TypeError("Super expression must either be null or a function, not " + typeof b);
                            ((a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } })),
                                b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b)));
                        })(b, a),
                        _createClass(b, [
                            {
                                key: "start",
                                value: function () {
                                    var a = this,
                                        b = function () {
                                            return new Promise(function (b, c) {
                                                ((a.__promise = { resolve: b, reject: c }), a.__start());
                                            });
                                        };
                                    return this.__opts.resumeIfFileExists && this.state !== this.__states.RESUMED
                                        ? this.getTotalSize().then(function (c) {
                                              var d = c.name,
                                                  e = c.total,
                                                  f = a.__opts.override;
                                              return ((a.__opts.override = !0),
                                              (a.__filePath = a.__getFilePath(d)),
                                              (a.__opts.override = f),
                                              a.__filePath && fs.existsSync(a.__filePath))
                                                  ? a.__getFilesizeInBytes(a.__filePath) === e
                                                      ? b()
                                                      : a.resumeFromFile(a.__filePath, { total: e, fileName: d })
                                                  : b();
                                          })
                                        : b();
                                },
                            },
                            {
                                key: "pause",
                                value: function () {
                                    var a = this;
                                    return this.state === this.__states.STOPPED
                                        ? Promise.resolve(!0)
                                        : (this.__response &&
                                              (this.__response.unpipe(),
                                              this.__pipes.forEach(function (a) {
                                                  return a.stream.unpipe();
                                              })),
                                          this.__fileStream && this.__fileStream.removeAllListeners(),
                                          this.__requestAbort(),
                                          this.__closeFileStream().then(function () {
                                              return (a.__setState(a.__states.PAUSED), a.emit("pause"), !0);
                                          }));
                                },
                            },
                            {
                                key: "resume",
                                value: function () {
                                    return this.__promise
                                        ? this.state === this.__states.STOPPED
                                            ? Promise.resolve(!1)
                                            : (this.__setState(this.__states.RESUMED),
                                              this.__isResumable && ((this.__isResumed = !0), (this.__reqOptions.headers.range = "bytes=" + this.__downloaded + "-")),
                                              this.emit("resume", this.__isResumed),
                                              this.__start())
                                        : this.start();
                                },
                            },
                            {
                                key: "stop",
                                value: function () {
                                    var a = this;
                                    return this.state === this.__states.STOPPED
                                        ? Promise.resolve(!0)
                                        : (this.__requestAbort(),
                                          this.__closeFileStream().then(function () {
                                              return a.__opts.removeOnStop
                                                  ? new Promise(function (b, c) {
                                                        fs.access(a.__filePath, function (d) {
                                                            return d
                                                                ? (a.__emitStop(), b(!0))
                                                                : void fs.unlink(a.__filePath, function (d) {
                                                                      return d ? (a.__setState(a.__states.FAILED), a.emit("error", d), c(d)) : void (a.__emitStop(), b(!0));
                                                                  });
                                                        });
                                                    })
                                                  : (a.__emitStop(), Promise.resolve(!0));
                                          }));
                                },
                            },
                            {
                                key: "pipe",
                                value: function (a) {
                                    var b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                                    return (this.__pipes.push({ stream: a, options: b }), a);
                                },
                            },
                            {
                                key: "unpipe",
                                value: function () {
                                    var a = this,
                                        b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null,
                                        c = function (b) {
                                            return a.__response ? a.__response.unpipe(b) : b.unpipe();
                                        };
                                    b
                                        ? this.__pipes.find(function (a) {
                                              return a.stream === b;
                                          }) &&
                                          (c(b),
                                          (this.__pipes = this.__pipes.filter(function (a) {
                                              return a.stream !== b;
                                          })))
                                        : (this.__pipes.forEach(function (a) {
                                              return c(a.stream);
                                          }),
                                          (this.__pipes = []));
                                },
                            },
                            {
                                key: "getDownloadPath",
                                value: function () {
                                    return this.__filePath;
                                },
                            },
                            {
                                key: "isResumable",
                                value: function () {
                                    return this.__isResumable;
                                },
                            },
                            {
                                key: "updateOptions",
                                value: function (a) {
                                    var b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "";
                                    ((this.__opts = Object.assign({}, this.__opts, a)),
                                        (this.__headers = this.__opts.headers),
                                        -1 < this.__opts.timeout &&
                                            ((this.__opts.httpRequestOptions.timeout = this.__opts.timeout), (this.__opts.httpsRequestOptions.timeout = this.__opts.timeout)),
                                        ("number" != typeof this.__opts.progressThrottle || 0 > this.__opts.progressThrottle) &&
                                            (this.__opts.progressThrottle = this.__defaultOpts.progressThrottle),
                                        (this.url = b || this.url),
                                        (this.__reqOptions = this.__getReqOptions(this.__opts.method, this.url, this.__opts.headers)),
                                        this.__initProtocol(this.url));
                                },
                            },
                            {
                                key: "getOptions",
                                value: function () {
                                    return this.__opts;
                                },
                            },
                            {
                                key: "getMetadata",
                                value: function () {
                                    return this.__opts.metadata;
                                },
                            },
                            {
                                key: "getStats",
                                value: function () {
                                    return {
                                        total: this.__total,
                                        name: this.__fileName,
                                        downloaded: this.__downloaded,
                                        progress: this.__progress,
                                        speed: this.__statsEstimate.bytes,
                                    };
                                },
                            },
                            {
                                key: "getTotalSize",
                                value: function () {
                                    var a = this;
                                    return new Promise(function (b, c) {
                                        var d = function (b) {
                                                a.__initProtocol(b);
                                                var c = Object.assign({}, a.__headers);
                                                c.hasOwnProperty("range") && delete c.range;
                                                var d = a.__getReqOptions("HEAD", b, c);
                                                return Object.assign({}, a.__reqOptions, d);
                                            },
                                            e = function (f, g) {
                                                var h = a.__protocol.request(g, function (g) {
                                                    if (a.__isRequireRedirect(g)) {
                                                        var h = /^https?:\/\//.test(g.headers.location) ? g.headers.location : new _url.URL(g.headers.location, f).href;
                                                        return (a.emit("redirected", h, f), e(h, d(h)));
                                                    }
                                                    return 200 === g.statusCode
                                                        ? void b({ name: a.__getFileNameFromHeaders(g.headers, g), total: parseInt(g.headers["content-length"]) || null })
                                                        : c(Error("Response status was " + g.statusCode));
                                                });
                                                (h.on("error", function (a) {
                                                    return c(a);
                                                }),
                                                    h.on("timeout", function () {
                                                        return c(Error("timeout"));
                                                    }),
                                                    h.on("uncaughtException", function (a) {
                                                        return c(a);
                                                    }),
                                                    h.end());
                                            };
                                        e(a.url, d(a.url));
                                    });
                                },
                            },
                            {
                                key: "getResumeState",
                                value: function () {
                                    return { downloaded: this.__downloaded, filePath: this.__filePath, fileName: this.__fileName, total: this.__total };
                                },
                            },
                            {
                                key: "resumeFromFile",
                                value: function (a) {
                                    var b = this,
                                        c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                                    return (
                                        (this.__opts.override = !0),
                                        (this.__filePath = a),
                                        (c.total && c.fileName ? Promise.resolve({ name: c.fileName, total: c.total }) : this.getTotalSize()).then(function (a) {
                                            var d = a.name,
                                                e = a.total;
                                            return (
                                                (b.__total = c.total || e),
                                                (b.__fileName = c.fileName || d),
                                                (b.__downloaded = c.downloaded || b.__getFilesizeInBytes(b.__filePath)),
                                                (b.__reqOptions.headers.range = "bytes=" + b.__downloaded + "-"),
                                                (b.__isResumed = !0),
                                                (b.__isResumable = !0),
                                                b.__setState(b.__states.RESUMED),
                                                b.emit("resume", b.__isResumed),
                                                new Promise(function (a, c) {
                                                    ((b.__promise = { resolve: a, reject: c }), b.__start());
                                                })
                                            );
                                        })
                                    );
                                },
                            },
                            {
                                key: "__start",
                                value: function () {
                                    (this.__isRedirected ||
                                        this.state === this.__states.RESUMED ||
                                        (this.emit("start"), this.__setState(this.__states.STARTED), this.__initProtocol(this.url)),
                                        (this.__response = null),
                                        (this.__isAborted = !1),
                                        this.__request && !this.__request.destroyed && this.__request.destroy(),
                                        this.__retryTimeout && (clearTimeout(this.__retryTimeout), (this.__retryTimeout = null)),
                                        (this.__request = this.__downloadRequest(this.__promise.resolve, this.__promise.reject)),
                                        this.__request.on("error", this.__onError(this.__promise.resolve, this.__promise.reject)),
                                        this.__request.on("timeout", this.__onTimeout(this.__promise.resolve, this.__promise.reject)),
                                        this.__request.on("uncaughtException", this.__onError(this.__promise.resolve, this.__promise.reject, !0)),
                                        this.__opts.body && this.__request.write(this.__opts.body),
                                        this.__request.end());
                                },
                            },
                            {
                                key: "__resolvePending",
                                value: function () {
                                    if (this.__promise) {
                                        var a = this.__promise.resolve;
                                        return ((this.__promise = null), a(!0));
                                    }
                                },
                            },
                            {
                                key: "__downloadRequest",
                                value: function (a, b) {
                                    var c = this;
                                    return this.__protocol.request(this.__reqOptions, function (d) {
                                        if (
                                            ((c.__response = d),
                                            c.__isResumed || ((c.__total = parseInt(d.headers["content-length"]) || null), c.__resetStats()),
                                            c.__isRequireRedirect(d))
                                        ) {
                                            var e = /^https?:\/\//.test(d.headers.location) ? d.headers.location : new _url.URL(d.headers.location, c.url).href;
                                            return ((c.__isRedirected = !0), c.__initProtocol(e), c.emit("redirected", e, c.url), c.__start());
                                        }
                                        if (200 !== d.statusCode && 206 !== d.statusCode) {
                                            var f = Error("Response status was " + d.statusCode);
                                            return ((f.status = d.statusCode || 0), (f.body = d.body || ""), c.__setState(c.__states.FAILED), c.emit("error", f), b(f));
                                        }
                                        (c.__opts.forceResume
                                            ? (c.__isResumable = !0)
                                            : d.headers.hasOwnProperty("accept-ranges") && "none" !== d.headers["accept-ranges"] && (c.__isResumable = !0),
                                            c.__startDownload(d, a, b));
                                    });
                                },
                            },
                            {
                                key: "__startDownload",
                                value: function (a, b, c) {
                                    var d = this,
                                        e = a;
                                    if (this.__isResumed) this.__fileStream = fs.createWriteStream(this.__filePath, { flags: "a" });
                                    else {
                                        var i = this.__getFileNameFromHeaders(a.headers);
                                        if (
                                            ((this.__filePath = this.__getFilePath(i)), (this.__fileName = this.__filePath.split(path.sep).pop()), fs.existsSync(this.__filePath))
                                        ) {
                                            var f = this.__getFilesizeInBytes(this.__filePath),
                                                g = this.__total ? this.__total : 0;
                                            if ("object" === _typeof(this.__opts.override) && this.__opts.override.skip && (this.__opts.override.skipSmaller || f >= g))
                                                return (
                                                    this.emit("skip", { totalSize: this.__total, fileName: this.__fileName, filePath: this.__filePath, downloadedSize: f }),
                                                    this.__setState(this.__states.SKIPPED),
                                                    b(!0)
                                                );
                                        }
                                        this.__fileStream = fs.createWriteStream(this.__filePath, {});
                                    }
                                    (this.emit("download", {
                                        fileName: this.__fileName,
                                        filePath: this.__filePath,
                                        totalSize: this.__total,
                                        isResumed: this.__isResumed,
                                        downloadedSize: this.__downloaded,
                                    }),
                                        (this.__retryCount = 0),
                                        (this.__isResumed = !1),
                                        (this.__isRedirected = !1),
                                        this.__setState(this.__states.DOWNLOADING),
                                        (this.__statsEstimate.time = new Date()),
                                        (this.__statsEstimate.throttleTime = new Date()),
                                        e.on("data", function (a) {
                                            return d.__calculateStats(a.length);
                                        }),
                                        this.__pipes.forEach(function (a) {
                                            (e.pipe(a.stream, a.options), (e = a.stream));
                                        }),
                                        e.pipe(this.__fileStream),
                                        e.on("error", this.__onError(b, c)),
                                        this.__fileStream.on("finish", this.__onFinished(b, c)),
                                        this.__fileStream.on("error", this.__onError(b, c)));
                                },
                            },
                            {
                                key: "__hasFinished",
                                value: function () {
                                    return (
                                        !this.__isAborted &&
                                        -1 === [this.__states.PAUSED, this.__states.STOPPED, this.__states.RETRY, this.__states.FAILED, this.__states.RESUMED].indexOf(this.state)
                                    );
                                },
                            },
                            {
                                key: "__isRequireRedirect",
                                value: function (a) {
                                    return 300 < a.statusCode && 400 > a.statusCode && a.headers.hasOwnProperty("location") && a.headers.location;
                                },
                            },
                            {
                                key: "__onFinished",
                                value: function (a, b) {
                                    var c = this;
                                    return function () {
                                        c.__fileStream.close(function (d) {
                                            if (d) return b(d);
                                            if (c.__hasFinished()) {
                                                var e = !!c.__total && c.__downloaded !== c.__total;
                                                if (e && c.__isResumable && c.__opts.resumeOnIncomplete && c.__resumeRetryCount <= c.__opts.resumeOnIncompleteMaxRetry)
                                                    return (c.__resumeRetryCount++, c.emit("warning", Error("uncomplete download, retrying")), c.resume());
                                                (c.__setState(c.__states.FINISHED),
                                                    (c.__pipes = []),
                                                    c.emit("end", {
                                                        fileName: c.__fileName,
                                                        filePath: c.__filePath,
                                                        totalSize: c.__total,
                                                        incomplete: e,
                                                        onDiskSize: c.__getFilesizeInBytes(c.__filePath),
                                                        downloadedSize: c.__downloaded,
                                                    }));
                                            }
                                            return a(c.__downloaded === c.__total);
                                        });
                                    };
                                },
                            },
                            {
                                key: "__closeFileStream",
                                value: function () {
                                    var a = this;
                                    return this.__fileStream
                                        ? new Promise(function (b, c) {
                                              a.__fileStream.close(function (a) {
                                                  return a ? c(a) : b(!0);
                                              });
                                          })
                                        : Promise.resolve(!0);
                                },
                            },
                            {
                                key: "__onError",
                                value: function (a, b) {
                                    var c = this,
                                        d = !!(2 < arguments.length && void 0 !== arguments[2]) && arguments[2];
                                    return function (a) {
                                        return (
                                            (c.__pipes = []),
                                            d && c.__requestAbort(),
                                            c.state === c.__states.STOPPED || c.state === c.__states.FAILED
                                                ? void 0
                                                : c.__opts.retry
                                                  ? c.__retry(a).catch(function (d) {
                                                        c.__removeFile().finally(function () {
                                                            (c.__setState(c.__states.FAILED), c.emit("error", d || a), b(d || a));
                                                        });
                                                    })
                                                  : c.__removeFile().finally(function () {
                                                        (c.__setState(c.__states.FAILED), c.emit("error", a), b(a));
                                                    })
                                        );
                                    };
                                },
                            },
                            {
                                key: "__retry",
                                value: function () {
                                    var a = this,
                                        b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null;
                                    if (!this.__opts.retry || "object" !== _typeof(this.__opts.retry)) return Promise.reject(b || Error("wrong retry options"));
                                    var c = this.__opts.retry,
                                        d = c.delay,
                                        e = void 0 === d ? 0 : d,
                                        f = c.maxRetries;
                                    return this.__retryCount >= (void 0 === f ? 999 : f)
                                        ? Promise.reject(b || Error("reached the maximum retries"))
                                        : (this.__retryCount++,
                                          this.__setState(this.__states.RETRY),
                                          this.emit("retry", this.__retryCount, this.__opts.retry, b),
                                          this.__response &&
                                              (this.__response.unpipe(),
                                              this.__pipes.forEach(function (a) {
                                                  return a.stream.unpipe();
                                              })),
                                          this.__fileStream && this.__fileStream.removeAllListeners(),
                                          this.__requestAbort(),
                                          this.__closeFileStream().then(function () {
                                              return new Promise(function (b) {
                                                  return (a.__retryTimeout = setTimeout(function () {
                                                      return b(0 < a.__downloaded ? a.resume() : a.__start());
                                                  }, e));
                                              });
                                          }));
                                },
                            },
                            {
                                key: "__onTimeout",
                                value: function (a, b) {
                                    var c = this;
                                    return function () {
                                        return (
                                            c.__requestAbort(),
                                            c.__opts.retry
                                                ? c.__retry(Error("timeout")).catch(function (a) {
                                                      c.__removeFile().finally(function () {
                                                          (c.__setState(c.__states.FAILED), a ? b(a) : (c.emit("timeout"), b(Error("timeout"))));
                                                      });
                                                  })
                                                : c.__removeFile().finally(function () {
                                                      (c.__setState(c.__states.FAILED), c.emit("timeout"), b(Error("timeout")));
                                                  })
                                        );
                                    };
                                },
                            },
                            {
                                key: "__resetStats",
                                value: function () {
                                    ((this.__retryCount = 0),
                                        (this.__downloaded = 0),
                                        (this.__progress = 0),
                                        (this.__resumeRetryCount = 0),
                                        (this.__statsEstimate = { time: 0, bytes: 0, prevBytes: 0, throttleTime: 0 }));
                                },
                            },
                            {
                                key: "__getFileNameFromHeaders",
                                value: function (a, b) {
                                    var c = "",
                                        g = a.hasOwnProperty("content-disposition"),
                                        h = g ? a["content-disposition"].match(/.*filename\*=.*?'.*?'([^"].+?[^"])(?:(?:;)|$)/i) : null,
                                        i = !g || h ? null : a["content-disposition"].match(/.*filename="(.*?)";?/i),
                                        j = !g || h || i ? null : a["content-disposition"].match(/.*filename=([^"].+?[^"])(?:(?:;)|$)/i);
                                    return (
                                        g && (h || i || j)
                                            ? ((c = (c = a["content-disposition"]).trim()), h ? (c = h[1]) : i ? (c = i[1]) : j && (c = j[1]), (c = c.replace(/[/\\]/g, "")))
                                            : (c =
                                                  0 < path.basename(new _url.URL(this.requestURL).pathname).length
                                                      ? path.basename(new _url.URL(this.requestURL).pathname)
                                                      : new _url.URL(this.requestURL).hostname + ".html"),
                                        this.__opts.fileName ? this.__getFileNameFromOpts(c, b) : c.replace(/\.*$/, "")
                                    );
                                },
                            },
                            {
                                key: "__getFilePath",
                                value: function (a) {
                                    var b = path.join(this.__destFolder, a),
                                        c = b;
                                    return (
                                        this.__opts.override ||
                                            this.state === this.__states.RESUMED ||
                                            (b !== (c = this.__uniqFileNameSync(c)) &&
                                                this.emit("renamed", { path: c, fileName: c.split(path.sep).pop(), prevPath: b, prevFileName: b.split(path.sep).pop() })),
                                        c
                                    );
                                },
                            },
                            {
                                key: "__getFileNameFromOpts",
                                value: function (a, b) {
                                    if (!this.__opts.fileName) return a;
                                    if ("string" == typeof this.__opts.fileName) return this.__opts.fileName;
                                    if ("function" == typeof this.__opts.fileName) {
                                        var h = path.join(this.__destFolder, a);
                                        return (b && b.headers) || (this.__response && this.__response.headers)
                                            ? this.__opts.fileName(a, h, (b || this.__response).headers["content-type"])
                                            : this.__opts.fileName(a, h);
                                    }
                                    if ("object" === _typeof(this.__opts.fileName)) {
                                        var c = this.__opts.fileName,
                                            d = c.name,
                                            e = !!c.hasOwnProperty("ext") && c.ext;
                                        if ("string" == typeof e) return d + "." + e;
                                        if ("boolean" == typeof e) {
                                            if (e) return d;
                                            var f = a.includes(".") ? a.split(".").pop() : "";
                                            return "" === f ? d : d + "." + f;
                                        }
                                    }
                                    return a;
                                },
                            },
                            {
                                key: "__calculateStats",
                                value: function (a) {
                                    var b = new Date(),
                                        c = b - this.__statsEstimate.time,
                                        d = b - this.__statsEstimate.throttleTime,
                                        e = this.__total || 0;
                                    a &&
                                        ((this.__downloaded += a),
                                        (this.__progress = 0 === e ? 0 : 100 * (this.__downloaded / e)),
                                        (this.__downloaded === e || 1e3 < c) &&
                                            ((this.__statsEstimate.time = b),
                                            (this.__statsEstimate.bytes = this.__downloaded - this.__statsEstimate.prevBytes),
                                            (this.__statsEstimate.prevBytes = this.__downloaded)),
                                        (this.__downloaded === e || d > this.__opts.progressThrottle) &&
                                            ((this.__statsEstimate.throttleTime = b), this.emit("progress.throttled", this.getStats())),
                                        this.emit("progress", this.getStats()));
                                },
                            },
                            {
                                key: "__setState",
                                value: function (a) {
                                    ((this.state = a), this.emit("stateChanged", this.state));
                                },
                            },
                            {
                                key: "__getReqOptions",
                                value: function (a, b) {
                                    var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {},
                                        d = new _url.URL(b),
                                        e = { protocol: d.protocol, host: d.hostname, port: d.port, path: d.pathname + d.search, method: a };
                                    return (c && (e.headers = c), e);
                                },
                            },
                            {
                                key: "__getFilesizeInBytes",
                                value: function (a) {
                                    try {
                                        return fs.statSync(a, { throwIfNoEntry: !1 }).size || 0;
                                    } catch (a) {
                                        this.emit("warning", a);
                                    }
                                    return 0;
                                },
                            },
                            {
                                key: "__validate",
                                value: function (a, b) {
                                    if ("string" != typeof a) throw Error("URL should be an string");
                                    if ("" === a.trim()) throw Error("URL couldn't be empty");
                                    if ("string" != typeof b) throw Error("Destination Folder should be an string");
                                    if ("" === b.trim()) throw Error("Destination Folder couldn't be empty");
                                    if (!fs.existsSync(b)) throw Error("Destination Folder must exist");
                                    if (!fs.statSync(b).isDirectory()) throw Error("Destination Folder must be a directory");
                                    try {
                                        fs.accessSync(b, fs.constants.W_OK);
                                    } catch (a) {
                                        throw Error("Destination Folder must be writable");
                                    }
                                    return !0;
                                },
                            },
                            {
                                key: "__initProtocol",
                                value: function (a) {
                                    var b = this.__getReqOptions(this.__opts.method, a, this.__headers);
                                    ((this.requestURL = a),
                                        -1 < a.indexOf("https://")
                                            ? ((this.__protocol = https),
                                              (b.agent = new https.Agent({ keepAlive: !1 })),
                                              (this.__reqOptions = Object.assign({}, b, this.__opts.httpsRequestOptions)))
                                            : ((this.__protocol = http),
                                              (b.agent = new http.Agent({ keepAlive: !1 })),
                                              (this.__reqOptions = Object.assign({}, b, this.__opts.httpRequestOptions))));
                                },
                            },
                            {
                                key: "__uniqFileNameSync",
                                value: function (a) {
                                    if ("string" != typeof a || "" === a) return a;
                                    try {
                                        fs.accessSync(a, fs.F_OK);
                                        var b = a.match(/(.*)(\([0-9]+\))(\..*)$/),
                                            c = b ? b[1].trim() : a,
                                            d = b ? parseInt(b[2].replace(/\(|\)/, "")) : 0,
                                            e = a.split(".").pop();
                                        return (e !== a && 0 < e.length ? ((e = "." + e), (c = c.replace(e, ""))) : (e = ""), this.__uniqFileNameSync(c + " (" + ++d + ")" + e));
                                    } catch (b) {
                                        return a;
                                    }
                                },
                            },
                            {
                                key: "__removeFile",
                                value: function () {
                                    var a = this;
                                    return new Promise(function (b) {
                                        return a.__fileStream
                                            ? void a.__fileStream.close(function (c) {
                                                  return (
                                                      c && a.emit("warning", c),
                                                      a.__opts.removeOnFail
                                                          ? fs.access(a.__filePath, function (d) {
                                                                return d
                                                                    ? b()
                                                                    : void fs.unlink(a.__filePath, function (d) {
                                                                          (d && a.emit("warning", c), b());
                                                                      });
                                                            })
                                                          : void b()
                                                  );
                                              })
                                            : b();
                                    });
                                },
                            },
                            {
                                key: "__requestAbort",
                                value: function () {
                                    ((this.__isAborted = !0),
                                        this.__retryTimeout && (clearTimeout(this.__retryTimeout), (this.__retryTimeout = null)),
                                        this.__response && this.__response.destroy(),
                                        this.__request && (this.__request.destroy ? this.__request.destroy() : this.__request.abort()));
                                },
                            },
                            {
                                key: "__emitStop",
                                value: function () {
                                    (this.__resolvePending(), this.__setState(this.__states.STOPPED), this.emit("stop"));
                                },
                            },
                        ]),
                        b
                    );
                })(_events.EventEmitter);
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
            4434(module1) {
                "use strict";
                module1.exports = require("events");
            },
            9896(module1) {
                "use strict";
                module1.exports = require("fs");
            },
            1943(module1) {
                "use strict";
                module1.exports = require("fs/promises");
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
            6466(module1) {
                "use strict";
                module1.exports = require("node:stream/promises");
            },
            3136(module1) {
                "use strict";
                module1.exports = require("node:url");
            },
            857(module1) {
                "use strict";
                module1.exports = require("os");
            },
            6928(module1) {
                "use strict";
                module1.exports = require("path");
            },
            2987(module1) {
                "use strict";
                module1.exports = require("perf_hooks");
            },
            932(module1) {
                "use strict";
                module1.exports = require("process");
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
    __webpack_require__.nmd = (module1) => ((module1.paths = []), module1.children || (module1.children = []), module1);
    var __webpack_exports__ = {};
    ((() => {
        "use strict";
        let uncaughtExceptionHandler;
        if ((Object.defineProperty(__webpack_exports__, "__esModule", { value: !0 }), !process.isMainFrame)) throw Error("Preload scripts should not be running in a subframe");
        if (null === window.opener) {
            let { contextBridge, discord } = __webpack_require__(1288);
            discord?.install("createZycordStream");
            let { startNativePremap } = __webpack_require__(7328);
            startNativePremap();
            let { ipcRenderer } = __webpack_require__(1288),
                { IPCEvents } = __webpack_require__(3716),
                observedFP = null,
                observedFCP = null;
            try {
                let paintObserver = new PerformanceObserver((list) => {
                    for (let entry of list.getEntries())
                        "first-paint" === entry.name
                            ? (observedFP = Math.round(entry.startTime))
                            : "first-contentful-paint" === entry.name && (observedFCP = Math.round(entry.startTime));
                    ((null != observedFP || null != observedFCP) &&
                        ipcRenderer.send(IPCEvents.APP_PAINT_METRICS, { main_window_first_paint_time_ms: observedFP, main_window_first_contentful_paint_time_ms: observedFCP }),
                        null != observedFCP && paintObserver.disconnect());
                });
                paintObserver.observe({ type: "paint", buffered: !0 });
            } catch (_) {}
            let BUNDLE_PATTERN = /\/(?:assets\/)?web(?:\.\w+)?\.js$/,
                observedBundleEntry = null,
                resourceObserver = null;
            try {
                (resourceObserver = new PerformanceObserver((list) => {
                    for (let e of list.getEntries())
                        if (("script" === e.initiatorType || "link" === e.initiatorType) && BUNDLE_PATTERN.test(e.name)) {
                            ((observedBundleEntry = e), resourceObserver?.disconnect());
                            break;
                        }
                })).observe({ type: "resource", buffered: !0 });
            } catch (_) {}
            ipcRenderer.on(IPCEvents.APP_GET_MAIN_BUNDLE_STATS, () => {
                let resources = performance.getEntriesByType("resource"),
                    entry = observedBundleEntry ?? resources.find((e) => ("script" === e.initiatorType || "link" === e.initiatorType) && BUNDLE_PATTERN.test(e.name)),
                    stats = {
                        main_window_navigation_origin_ms: Math.round(performance.timeOrigin),
                        connection_rtt_ms: navigator.connection?.rtt ?? null,
                        connection_downlink_kbps: navigator.connection?.downlink != null ? Math.round(1e3 * navigator.connection.downlink) : null,
                    };
                if (
                    null != entry &&
                    ((stats.main_window_webapp_bundle_name = entry.name.split("/").pop() ?? null),
                    (stats.main_window_webapp_bundle_download_decompress_duration_ms = Math.round(entry.responseEnd - entry.responseStart)),
                    (stats.main_window_webapp_bundle_ttfb_ms = Math.round(entry.responseStart - entry.fetchStart)),
                    (stats.main_window_webapp_bundle_compressed_size_bytes = entry.encodedBodySize ?? null),
                    (stats.main_window_webapp_bundle_uncompressed_size_bytes = entry.decodedBodySize ?? null),
                    (stats.main_window_webapp_bundle_transfer_size_bytes = entry.transferSize ?? null),
                    zycord?.getScriptCompilationTimings != null)
                ) {
                    let timing = zycord.getScriptCompilationTimings().find((t) => BUNDLE_PATTERN.test(t.url));
                    null != timing &&
                        ((stats.main_window_webapp_bundle_compile_foreground_duration_us = timing.foregroundTimeUs),
                        (stats.main_window_webapp_bundle_compile_background_duration_us = timing.backgroundTimeUs),
                        (stats.main_window_webapp_bundle_compile_streamed = timing.streamed));
                }
                (null != entry && (zycord?.stopScriptCompilationTimings?.(), resourceObserver?.disconnect()), ipcRenderer.send(IPCEvents.APP_MAIN_BUNDLE_STATS, stats));
            });