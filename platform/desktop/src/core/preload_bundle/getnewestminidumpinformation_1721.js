1721(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.getNewestMinidumpInformation = getNewestMinidumpInformation));
                let processUtils_1 = __webpack_require__(5468),
                    minidump_1 = __webpack_require__(278);
                async function getNewestMinidumpInformation(minidumpPath) {
                    if (!processUtils_1.IS_WIN) return null;
                    try {
                        return await (0, minidump_1.readMinidump)(minidumpPath);
                    } catch (e) {
                        return (console.log(`getNewestMinidumpInformation exception: ${e}`), null);
                    }
                }
            }