7453(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.getGlobalPaths = function () {
                        return module_1.default.globalPaths;
                    }),
                    (exports.addGlobalPath = function (path) {
                        -1 === module_1.default.globalPaths.indexOf(path) && module_1.default.globalPaths.push(path);
                    }),
                    (exports.globalPathExists = function (path) {
                        return -1 !== module_1.default.globalPaths.indexOf(path);
                    }));
                let module_1 = __importDefault(__webpack_require__(3339)),
                    resolveLookupPaths = module_1.default._resolveLookupPaths;
                module_1.default._resolveLookupPaths = (request, parent) => {
                    let length = parent?.paths?.length;
                    return (
                        null != length && 0 !== length ? (parent.paths = parent.paths.concat(module_1.default.globalPaths)) : (parent.paths = module_1.default.globalPaths),
                        resolveLookupPaths(request, parent)
                    );
                };
            }