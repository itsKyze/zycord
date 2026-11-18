6701(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.copy = function (text) {
                        return null != text && text.length > 0
                            ? electron_1.default.ipcRenderer.invoke(CLIPBOARD_WRITE_TEXT, text)
                            : electron_1.default.ipcRenderer.invoke(CLIPBOARD_COPY);
                    }),
                    (exports.copyImage = function (imageArrayBuffer, imageSrc) {
                        return (
                            (0, assert_1.default)(null != imageArrayBuffer, "Image data is empty"),
                            electron_1.default.ipcRenderer.invoke(CLIPBOARD_WRITE_IMAGE, imageArrayBuffer, imageSrc)
                        );
                    }),
                    (exports.copyFile = function (filePath) {
                        return ((0, assert_1.default)(null != filePath, "File path is empty"), electron_1.default.ipcRenderer.invoke(CLIPBOARD_WRITE_FILE, filePath));
                    }),
                    (exports.cut = function () {
                        electron_1.default.ipcRenderer.invoke(CLIPBOARD_CUT);
                    }),
                    (exports.paste = function () {
                        electron_1.default.ipcRenderer.invoke(CLIPBOARD_PASTE);
                    }),
                    (exports.read = function () {
                        return electron_1.default.ipcRenderer.sendSync(CLIPBOARD_READ_TEXT);
                    }),
                    (exports.hasMixedContent = function () {
                        return electron_1.default.ipcRenderer.sendSync(CLIPBOARD_HAS_MIXED_CONTENT);
                    }));
                let assert_1 = __importDefault(__webpack_require__(2613)),
                    electron_1 = __importDefault(__webpack_require__(1288)),
                    {
                        CLIPBOARD_COPY,
                        CLIPBOARD_CUT,
                        CLIPBOARD_PASTE,
                        CLIPBOARD_WRITE_TEXT,
                        CLIPBOARD_WRITE_IMAGE,
                        CLIPBOARD_WRITE_FILE,
                        CLIPBOARD_READ_TEXT,
                        CLIPBOARD_HAS_MIXED_CONTENT,
                    } = __webpack_require__(3716).IPCEvents;
            }