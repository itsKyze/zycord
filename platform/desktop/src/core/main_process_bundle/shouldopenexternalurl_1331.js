1331(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.shouldOpenExternalUrl = shouldOpenExternalUrl),
                    (exports.saferShellOpenExternal = function (externalUrl) {
                        return shouldOpenExternalUrl(externalUrl) ? electron_1.shell.openExternal(externalUrl) : Promise.reject(Error("External url open request blocked"));
                    }),
                    (exports.checkUrlOriginMatches = function (urlA, urlB) {
                        let parsedUrlA, parsedUrlB;
                        try {
                            ((parsedUrlA = new URL(urlA)), (parsedUrlB = new URL(urlB)));
                        } catch (_) {
                            return !1;
                        }
                        return parsedUrlA.protocol === parsedUrlB.protocol && parsedUrlA.host === parsedUrlB.host;
                    }));
                let electron_1 = __webpack_require__(1288),
                    BLOCKED_URL_PROTOCOLS = [
                        "file:",
                        "javascript:",
                        "vbscript:",
                        "data:",
                        "about:",
                        "chrome:",
                        "ms-cxh:",
                        "ms-cxh-full:",
                        "ms-word:",
                        "shell:",
                        "ms-msdt:",
                        "search-ms:",
                        "ms-officecmd:",
                        "ms-appinstaller:",
                    ];
                function shouldOpenExternalUrl(externalUrl) {
                    let protocol;
                    try {
                        protocol = new URL(externalUrl).protocol.toLowerCase();
                    } catch (_) {
                        return !1;
                    }
                    return !BLOCKED_URL_PROTOCOLS.includes(protocol) && !(protocol.replace(/:$/, "").length < 2);
                }
            }