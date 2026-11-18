5468(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.IS_LINUX = exports.IS_OSX = exports.IS_WIN = void 0));
                let process_1 = __importDefault(__webpack_require__(932));
                ((exports.IS_WIN = "win32" === process_1.default.platform),
                    (exports.IS_OSX = "darwin" === process_1.default.platform),
                    (exports.IS_LINUX = "linux" === process_1.default.platform));
            }