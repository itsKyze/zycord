5696(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.isHookMinidumpFile = function (filename) {
                        return /^.{8}-.{4}-.{4}-.{4}-.{12}.dmp$/i.test(filename);
                    }),
                    (exports.isMinidumpFile = function (filename) {
                        return /\.dmp$/i.test(filename);
                    }),
                    (exports.containsInvalidFileChar = function (contents) {
                        return INVALID_FILENAME_CHAR_REGEX.test(contents);
                    }));
                let INVALID_FILENAME_CHAR_REGEX = /[^a-zA-Z0-9-_.]/;
            }