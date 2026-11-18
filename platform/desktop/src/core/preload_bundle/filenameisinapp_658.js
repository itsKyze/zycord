658(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let stacktrace = __webpack_require__(7970);
                function filenameIsInApp(filename, isNative = !1) {
                    return (
                        !(
                            isNative ||
                            (filename &&
                                !filename.startsWith("/") &&
                                !filename.match(/^[A-Z]:/) &&
                                !filename.startsWith(".") &&
                                !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//))
                        ) &&
                        void 0 !== filename &&
                        !filename.includes("node_modules/")
                    );
                }
                function node(getModule) {
                    let FILENAME_MATCH = /^\s*[-]{4,}$/,
                        FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/,
                        DATA_URI_MATCH = /at (?:async )?(.+?) \(data:(.*?),/;
                    return (line) => {
                        let dataUriMatch = line.match(DATA_URI_MATCH);
                        if (dataUriMatch) return { filename: `<data:${dataUriMatch[2]}>`, function: dataUriMatch[1] };
                        let lineMatch = line.match(FULL_MATCH);
                        if (lineMatch) {
                            let object, method, functionName, typeName, methodName;
                            if (lineMatch[1]) {
                                let methodStart = (functionName = lineMatch[1]).lastIndexOf(".");
                                if (("." === functionName[methodStart - 1] && methodStart--, methodStart > 0)) {
                                    ((object = functionName.slice(0, methodStart)), (method = functionName.slice(methodStart + 1)));
                                    let objectEnd = object.indexOf(".Module");
                                    objectEnd > 0 && ((functionName = functionName.slice(objectEnd + 1)), (object = object.slice(0, objectEnd)));
                                }
                                typeName = void 0;
                            }
                            (method && ((typeName = object), (methodName = method)),
                                "<anonymous>" === method && ((methodName = void 0), (functionName = void 0)),
                                void 0 === functionName &&
                                    ((methodName = methodName || stacktrace.UNKNOWN_FUNCTION), (functionName = typeName ? `${typeName}.${methodName}` : methodName)));
                            let filename = stacktrace.normalizeStackTracePath(lineMatch[2]),
                                isNative = "native" === lineMatch[5];
                            filename || !lineMatch[5] || isNative || (filename = lineMatch[5]);
                            let maybeDecodedFilename = filename
                                ? (function (filename) {
                                      try {
                                          return decodeURI(filename);
                                      } catch {
                                          return;
                                      }
                                  })(filename)
                                : void 0;
                            return {
                                filename: maybeDecodedFilename ?? filename,
                                module: maybeDecodedFilename && getModule?.(maybeDecodedFilename),
                                function: functionName,
                                lineno: _parseIntOrUndefined(lineMatch[3]),
                                colno: _parseIntOrUndefined(lineMatch[4]),
                                in_app: filenameIsInApp(filename || "", isNative),
                            };
                        }
                        if (line.match(FILENAME_MATCH)) return { filename: line };
                    };
                }
                function _parseIntOrUndefined(input) {
                    return parseInt(input || "", 10) || void 0;
                }
                ((exports.filenameIsInApp = filenameIsInApp),
                    (exports.node = node),
                    (exports.nodeStackLineParser = function (getModule) {
                        return [90, node(getModule)];
                    }));
            },
            9715(module1, exports, __webpack_require__) {
                ((module1 = __webpack_require__.nmd(module1)), Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }));
                let env = __webpack_require__(7391);
                function dynamicRequire(mod, request) {
                    return mod.require(request);
                }
                ((exports.isNodeEnv = function () {
                    return !env.isBrowserBundle() && "[object process]" === Object.prototype.toString.call("u" > typeof process ? process : 0);
                }),
                    (exports.loadModule = function (moduleName, existingModule = module1) {
                        let mod;
                        try {
                            mod = dynamicRequire(existingModule, moduleName);
                        } catch {}
                        if (!mod)
                            try {
                                let { cwd } = dynamicRequire(existingModule, "process");
                                mod = dynamicRequire(existingModule, `${cwd()}/node_modules/${moduleName}`);
                            } catch {}
                        return mod;
                    }));
            }