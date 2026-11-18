2632(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.VOICE_MESSAGE_RECORDING_FILE_NAMES = void 0),
                    (exports.resolveVoiceMessageRecordingPath = function (moduleDataPath, filePath) {
                        let fileName = path_1.default.basename(filePath);
                        if (!VOICE_MESSAGE_RECORDING_FILE_NAME_SET.has(fileName)) throw Error("Unsupported voice message recording filename");
                        return path_1.default.join(moduleDataPath, "zycord_voice", fileName);
                    }),
                    (exports.validateVoiceMessageRecordingFile = validateVoiceMessageRecordingFile),
                    (exports.deleteVoiceMessageRecordingFile = deleteVoiceMessageRecordingFile));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928));
                exports.VOICE_MESSAGE_RECORDING_FILE_NAMES = ["recording.ogg", "0recording.ogg", "1recording.ogg", "2recording.ogg", "3recording.ogg", "4recording.ogg"];
                let VOICE_MESSAGE_RECORDING_FILE_NAME_SET = new Set(exports.VOICE_MESSAGE_RECORDING_FILE_NAMES);
                async function validateVoiceMessageRecordingFile(filePath) {
                    let stats = await fs_1.default.promises.lstat(filePath);
                    if (stats.isSymbolicLink() || !stats.isFile()) throw Error("Voice message recording must be a regular file");
                }
                async function deleteVoiceMessageRecordingFile(filePath) {
                    try {
                        (await validateVoiceMessageRecordingFile(filePath), await fs_1.default.promises.unlink(filePath));
                    } catch (error) {
                        if (!("object" == typeof error && null != error && "code" in error && "ENOENT" === error.code)) throw error;
                    }
                }
            }