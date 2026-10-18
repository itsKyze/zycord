4161(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.isLinux = exports.isOSX = exports.isWindows = exports.platform = void 0),
                    (exports.exposeModuleResource = function (asarPath, fileName) {
                        let userDataPath = paths_1.paths.getUserData(),
                            appPath = path_1.default.resolve(__dirname, ".."),
                            fullPathToAsarFile = path_1.default.join(appPath, asarPath, fileName),
                            buffer = fs_1.default.existsSync(fullPathToAsarFile) ? fs_1.default.readFileSync(fullPathToAsarFile) : null,
                            image = null != buffer ? electron_1.nativeImage.createFromBuffer(buffer) : null;
                        if (".ico" === path_1.default.extname(fileName)) {
                            if (null == userDataPath || null == buffer) return null;
                            let nativeFilePath = path_1.default.join(userDataPath, fileName);
                            return (fs_1.default.writeFileSync(nativeFilePath, buffer), electron_1.nativeImage.createFromPath(nativeFilePath));
                        }
                        let baseName = path_1.default.basename(fileName, path_1.default.extname(fileName));
                        null != userDataPath &&
                            fs_1.default.existsSync(path_1.default.join(userDataPath, fileName)) &&
                            fs_1.default.unlinkSync(path_1.default.join(userDataPath, fileName));
                        let scaleFactor = electron_1.screen.getPrimaryDisplay().scaleFactor;
                        if (/^win/.test(exports.platform) && scaleFactor <= 1 && null != buffer) return electron_1.nativeImage.createFromBuffer(buffer, { scaleFactor: 1 });
                        let variants = ["@1.25x", "@1.33x", "@1.4x", "@1.5x", "@1.8x", "@2x", "@2.5x", "@3x", "@4x", "@5x"];
                        for (let variant of variants) {
                            let variantFileName = `${baseName}${variant}${path_1.default.extname(fileName)}`,
                                variantFullPath = path_1.default.join(appPath, asarPath, variantFileName),
                                variantScale = Number(variant.replace("@", "").replace("x", ""));
                            if (fs_1.default.existsSync(variantFullPath)) {
                                let variantBuffer = fs_1.default.readFileSync(variantFullPath);
                                if (/^win/.test(exports.platform)) {
                                    if (variantScale >= scaleFactor || variant === variants[variants.length - 1])
                                        return electron_1.nativeImage.createFromBuffer(variantBuffer, { scaleFactor: variantScale });
                                } else null != image && image.addRepresentation({ scaleFactor: variantScale, buffer: variantBuffer });
                            }
                        }
                        return (null != image && baseName.endsWith("Template") && image.setTemplateImage(!0), image);
                    }));
                let electron_1 = __webpack_require__(1288),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    paths_1 = __webpack_require__(822);
                ((exports.platform = os_1.default.platform()),
                    (exports.isWindows = /^win/.test(exports.platform)),
                    (exports.isOSX = "darwin" === exports.platform),
                    (exports.isLinux = "linux" === exports.platform));
            }