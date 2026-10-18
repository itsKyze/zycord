1783(module1, __unused_rspack_exports, __webpack_require__) {
                var map = {
                    "./": "7814",
                    "./darwin": "1751",
                    "./darwin.js": "1751",
                    "./index": "7814",
                    "./index.js": "7814",
                    "./linux": "4380",
                    "./linux.js": "4380",
                    "./win32": "4933",
                    "./win32.js": "4933",
                };
                function __rspack_context(req) {
                    return __webpack_require__(__rspack_context_resolve(req));
                }
                function __rspack_context_resolve(req) {
                    if (!__webpack_require__.o(map, req)) {
                        var e = Error("Cannot find module '" + req + "'");
                        throw ((e.code = "MODULE_NOT_FOUND"), e);
                    }
                    return map[req];
                }
                ((__rspack_context.keys = function () {
                    return Object.keys(map);
                }),
                    (__rspack_context.resolve = __rspack_context_resolve),
                    (module1.exports = __rspack_context),
                    (__rspack_context.id = 1783));
            }