7126(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var ownKeys,
                    __createBinding =
                        (this && this.__createBinding) ||
                        (Object.create
                            ? function (o, m, k, k2) {
                                  void 0 === k2 && (k2 = k);
                                  var desc = Object.getOwnPropertyDescriptor(m, k);
                                  ((!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) &&
                                      (desc = {
                                          enumerable: !0,
                                          get: function () {
                                              return m[k];
                                          },
                                      }),
                                      Object.defineProperty(o, k2, desc));
                              }
                            : function (o, m, k, k2) {
                                  (void 0 === k2 && (k2 = k), (o[k2] = m[k]));
                              }),
                    __setModuleDefault =
                        (this && this.__setModuleDefault) ||
                        (Object.create
                            ? function (o, v) {
                                  Object.defineProperty(o, "default", { enumerable: !0, value: v });
                              }
                            : function (o, v) {
                                  o.default = v;
                              }),
                    __importStar =
                        (this && this.__importStar) ||
                        ((ownKeys = function (o) {
                            return (ownKeys =
                                Object.getOwnPropertyNames ||
                                function (o) {
                                    var ar = [];
                                    for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && (ar[ar.length] = k);
                                    return ar;
                                })(o);
                        }),
                        function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (null != mod) for (var k = ownKeys(mod), i = 0; i < k.length; i++) "default" !== k[i] && __createBinding(result, mod, k[i]);
                            return (__setModuleDefault(result, mod), result);
                        });
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron = __importStar(__webpack_require__(1288)),
                    {
                        CLIPBOARD_COPY,
                        CLIPBOARD_CUT,
                        CLIPBOARD_PASTE,
                        CLIPBOARD_WRITE_TEXT,
                        CLIPBOARD_WRITE_IMAGE,
                        CLIPBOARD_WRITE_FILE,
                        CLIPBOARD_READ_TEXT,
                        CLIPBOARD_HAS_MIXED_CONTENT,
                    } = __webpack_require__(3716).IPCEvents,
                    modernClipboard = null != electron.ClipboardItem ? electron.clipboard : null,
                    ClipboardItem = electron.ClipboardItem,
                    RAW_FORMAT_PREFIX = 'electron application/osclipboard;format="';
                async function writeText(text) {
                    await electron.clipboard.writeText(text);
                }
                async function readText() {
                    return await electron.clipboard.readText();
                }
                async function writeBuffer(format, buffer) {
                    if (null != modernClipboard) await modernClipboard.write([new ClipboardItem({ [`${RAW_FORMAT_PREFIX}${format}"`]: new Blob([new Uint8Array(buffer)]) })]);
                    else electron.clipboard.writeBuffer(format, buffer);
                }
                async function availableFormats() {
                    if (null == modernClipboard) return electron.clipboard.availableFormats();
                    let items = await modernClipboard.read(),
                        formats = new Set();
                    for (let item of items)
                        for (let type of item.types) formats.add(type.startsWith(RAW_FORMAT_PREFIX) && type.endsWith('"') ? type.slice(RAW_FORMAT_PREFIX.length, -1) : type);
                    return [...formats];
                }
                (electron.ipcMain.handle(CLIPBOARD_COPY, async (_) => {
                    electron.webContents.getFocusedWebContents()?.copy();
                }),
                    electron.ipcMain.handle(CLIPBOARD_CUT, async (_) => {
                        electron.webContents.getFocusedWebContents()?.cut();
                    }),
                    electron.ipcMain.handle(CLIPBOARD_PASTE, async (_) => {
                        electron.webContents.getFocusedWebContents()?.paste();
                    }),
                    electron.ipcMain.handle(CLIPBOARD_WRITE_TEXT, async (_, text) => {
                        await writeText(text);
                    }),
                    electron.ipcMain.handle(CLIPBOARD_WRITE_IMAGE, async (_, imageArrayBuffer, imageSrc) => {
                        let nativeImg = electron.nativeImage.createFromBuffer(Buffer.from(imageArrayBuffer)),
                            html = `<img src="${imageSrc}">`;
                        null != modernClipboard
                            ? await modernClipboard.write([
                                  new ClipboardItem({ "text/html": html, "image/png": new Blob([new Uint8Array(nativeImg.toPNG())], { type: "image/png" }) }),
                              ])
                            : electron.clipboard.write({ html, image: nativeImg });
                    }),
                    electron.ipcMain.handle(CLIPBOARD_WRITE_FILE, async (_, filePath) => {
                        if ("darwin" === process.platform) {
                            let fileUrl = `file://${filePath}`;
                            await writeBuffer("public.file-url", Buffer.from(fileUrl, "utf8"));
                        } else if ("win32" === process.platform) {
                            let filePathWithNull = `${filePath}\0`,
                                buffer = Buffer.from(filePathWithNull, "ucs2");
                            await writeBuffer("FileNameW", buffer);
                        } else await writeText(`file://${filePath}`);
                    }),
                    electron.ipcMain.on(CLIPBOARD_READ_TEXT, async (event) => {
                        try {
                            event.returnValue = await readText();
                        } catch {
                            event.returnValue = "";
                        }
                    }),
                    electron.ipcMain.on(CLIPBOARD_HAS_MIXED_CONTENT, async (event) => {
                        try {
                            let formats = await availableFormats(),
                                textContent = await readText(),
                                hasText = null != textContent && textContent.trim().length > 0,
                                hasImage = formats.some(
                                    (f) =>
                                        f.startsWith("image/") ||
                                        "CF_DIB" === f ||
                                        "CF_BITMAP" === f ||
                                        "CF_DIBV5" === f ||
                                        f.toLowerCase().includes("image") ||
                                        f.toLowerCase().includes("bitmap"),
                                );
                            event.returnValue = hasText && hasImage;
                        } catch {
                            event.returnValue = !1;
                        }
                    }));
            }