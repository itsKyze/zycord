9590(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let zstdCompressAsync;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.join = exports.dirname = exports.basename = exports.extname = void 0),
                    (exports.readFulfilledFiles = readFulfilledFiles),
                    (exports.readFiles = readFiles),
                    (exports.ensureDirectoryExists = ensureDirectoryExists),
                    (exports.directoryExists = directoryExists),
                    (exports.getFilesnamesFromDirectory = function (path) {
                        return promiseFs.readdir(path);
                    }),
                    (exports.deleteFile = function (filename) {
                        return promiseFs.unlink(filename);
                    }),
                    (exports.readExactly = readExactly));
                let buffer_1 = __importDefault(__webpack_require__(181)),
                    child_process_1 = __importDefault(__webpack_require__(5317)),
                    original_fs_1 = __importDefault(__webpack_require__(215)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    util_1 = __importDefault(__webpack_require__(9023)),
                    zlib_1 = __importDefault(__webpack_require__(3106));
                var path_2 = __webpack_require__(6928);
                (Object.defineProperty(exports, "extname", {
                    enumerable: !0,
                    get: function () {
                        return path_2.extname;
                    },
                }),
                    Object.defineProperty(exports, "basename", {
                        enumerable: !0,
                        get: function () {
                            return path_2.basename;
                        },
                    }),
                    Object.defineProperty(exports, "dirname", {
                        enumerable: !0,
                        get: function () {
                            return path_2.dirname;
                        },
                    }),
                    Object.defineProperty(exports, "join", {
                        enumerable: !0,
                        get: function () {
                            return path_2.join;
                        },
                    }));
                let MAX_LENGTH = buffer_1.default.constants.MAX_LENGTH,
                    promiseFs = {
                        readdir: util_1.default.promisify(original_fs_1.default.readdir),
                        open: util_1.default.promisify(original_fs_1.default.open),
                        fstat: util_1.default.promisify(original_fs_1.default.fstat),
                        stat: util_1.default.promisify(original_fs_1.default.stat),
                        unlink: util_1.default.promisify(original_fs_1.default.unlink),
                        read: util_1.default.promisify(original_fs_1.default.read),
                        readFile: util_1.default.promisify(original_fs_1.default.readFile),
                        close: util_1.default.promisify(original_fs_1.default.close),
                        mkdir: util_1.default.promisify(original_fs_1.default.mkdir),
                    },
                    { zstdCompress } = zlib_1.default,
                    execFileAsync = util_1.default.promisify(child_process_1.default.execFile);
                async function readFulfilledFiles(filepaths, maxSize, orException, shouldCompress) {
                    let files = await readFiles(filepaths, maxSize, shouldCompress);
                    return (
                        orException &&
                            files.forEach((result) => {
                                if ("rejected" === result.status) throw result.reason;
                            }),
                        files.filter((result) => "fulfilled" === result.status).map((result) => result.value)
                    );
                }
                function readFiles(filepaths, dataMaxSize, shouldCompress) {
                    return (
                        (dataMaxSize = Math.min(dataMaxSize, MAX_LENGTH)),
                        Promise.allSettled(
                            filepaths.map(async (filepath) => {
                                let handle = await promiseFs.open(filepath, "r");
                                try {
                                    let finalFilename = path_1.default.basename(filepath),
                                        willCompress = null != shouldCompress && shouldCompress(finalFilename),
                                        fileMaxSize = willCompress ? 10 * dataMaxSize : dataMaxSize,
                                        stats = await promiseFs.fstat(handle),
                                        resultError = { code: "ETOOLARGE", message: "upload too large", filesize: stats.size, maxSize: dataMaxSize };
                                    if (stats.size > fileMaxSize) throw resultError;
                                    let buffer = new Uint8Array(stats.size),
                                        data = await promiseFs.read(handle, buffer, 0, stats.size, 0),
                                        finalData = new Uint8Array(data.buffer.slice(0, data.bytesRead));
                                    if (willCompress)
                                        try {
                                            let buf;
                                            if (
                                                ((finalData = new Uint8Array(await ((buf = finalData), (zstdCompressAsync ??= util_1.default.promisify(zstdCompress))(buf)))),
                                                (finalFilename += ".zst"),
                                                finalData.byteLength > dataMaxSize)
                                            )
                                                throw resultError;
                                        } catch (e) {
                                            console.error(`Failed to compress ${finalFilename}`, e);
                                        }
                                    return { data: finalData, filename: finalFilename };
                                } finally {
                                    promiseFs.close(handle);
                                }
                            }),
                        )
                    );
                }
                async function ensureDirectoryExists(path, hidden = !1) {
                    if ((await promiseFs.mkdir(path, { recursive: !0 }), !0 === hidden && "win32" === process.platform))
                        try {
                            await execFileAsync("attrib", ["+h", path]);
                        } catch (e) {
                            console.log(`Failed to set hidden attribute on ${path}: ${e}`);
                        }
                }
                async function directoryExists(path) {
                    try {
                        return (await promiseFs.stat(path)).isDirectory();
                    } catch (e) {
                        if ("ENOENT" === e.code) return !1;
                        throw e;
                    }
                }
                async function readExactly({ handle, buffer, position, length }) {
                    let bytesRead = 0;
                    for (null == length && (length = buffer.byteLength); bytesRead < length;) {
                        let result = await handle.read(buffer, bytesRead, length - bytesRead, position + bytesRead);
                        if (0 === result.bytesRead) throw Error("Unexpected end of file");
                        bytesRead += result.bytesRead;
                    }
                }
            }