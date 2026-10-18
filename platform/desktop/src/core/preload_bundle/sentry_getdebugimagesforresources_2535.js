2535(__unused_rspack_module, exports, __webpack_require__) {
                let parsedStackResults, lastSentryKeysCount, lastNativeKeysCount, cachedFilenameDebugIds;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let stacktrace = __webpack_require__(7970),
                    worldwide = __webpack_require__(3712);
                function getFilenameToDebugIdMap(stackParser) {
                    let sentryDebugIdMap = worldwide.GLOBAL_OBJ._sentryDebugIds,
                        nativeDebugIdMap = worldwide.GLOBAL_OBJ._debugIds;
                    if (!sentryDebugIdMap && !nativeDebugIdMap) return {};
                    let sentryDebugIdKeys = sentryDebugIdMap ? Object.keys(sentryDebugIdMap) : [],
                        nativeDebugIdKeys = nativeDebugIdMap ? Object.keys(nativeDebugIdMap) : [];
                    if (cachedFilenameDebugIds && sentryDebugIdKeys.length === lastSentryKeysCount && nativeDebugIdKeys.length === lastNativeKeysCount)
                        return cachedFilenameDebugIds;
                    ((lastSentryKeysCount = sentryDebugIdKeys.length),
                        (lastNativeKeysCount = nativeDebugIdKeys.length),
                        (cachedFilenameDebugIds = {}),
                        parsedStackResults || (parsedStackResults = {}));
                    let processDebugIds = (debugIdKeys, debugIdMap) => {
                        for (let key of debugIdKeys) {
                            let debugId = debugIdMap[key],
                                result = parsedStackResults?.[key];
                            if (result && cachedFilenameDebugIds && debugId)
                                ((cachedFilenameDebugIds[result[0]] = debugId), parsedStackResults && (parsedStackResults[key] = [result[0], debugId]));
                            else if (debugId) {
                                let parsedStack = stackParser(key);
                                for (let i = parsedStack.length - 1; i >= 0; i--) {
                                    let stackFrame = parsedStack[i],
                                        filename = stackFrame?.filename;
                                    if (filename && cachedFilenameDebugIds && parsedStackResults) {
                                        ((cachedFilenameDebugIds[filename] = debugId), (parsedStackResults[key] = [filename, debugId]));
                                        break;
                                    }
                                }
                            }
                        }
                    };
                    return (
                        sentryDebugIdMap && processDebugIds(sentryDebugIdKeys, sentryDebugIdMap),
                        nativeDebugIdMap && processDebugIds(nativeDebugIdKeys, nativeDebugIdMap),
                        cachedFilenameDebugIds
                    );
                }
                ((exports.getDebugImagesForResources = function (stackParser, resource_paths) {
                    let filenameDebugIdMap = getFilenameToDebugIdMap(stackParser);
                    if (!filenameDebugIdMap) return [];
                    let images = [];
                    for (let path of resource_paths) {
                        let normalizedPath = stacktrace.normalizeStackTracePath(path);
                        normalizedPath && filenameDebugIdMap[normalizedPath] && images.push({ type: "sourcemap", code_file: path, debug_id: filenameDebugIdMap[normalizedPath] });
                    }
                    return images;
                }),
                    (exports.getFilenameToDebugIdMap = getFilenameToDebugIdMap));
            }