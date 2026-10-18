8730(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let requestCA;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.init = function () {
                        let rootCertificateAuthorities;
                        try {
                            rootCertificateAuthorities = fs_1.default.readFileSync(path_1.default.join(__dirname, "data", "cacert.pem"));
                        } catch (err) {
                            (console.error("Unable to load root certificate authorities."), console.error(err));
                        }
                        requestCA = rootCertificateAuthorities ? { ca: rootCertificateAuthorities } : {};
                    }),
                    (exports.getRequestCA = function () {
                        return requestCA;
                    }));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    path_1 = __importDefault(__webpack_require__(6928));
            }