2188(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let worldwide = __webpack_require__(3712),
                    filenameMetadataMap = new Map(),
                    parsedStacks = new Set();
                function getMetadataForUrl(parser, filename) {
                    if (worldwide.GLOBAL_OBJ._sentryModuleMetadata)
                        for (let stack of Object.keys(worldwide.GLOBAL_OBJ._sentryModuleMetadata)) {
                            let metadata = worldwide.GLOBAL_OBJ._sentryModuleMetadata[stack];
                            if (!parsedStacks.has(stack)) {
                                for (let frame of (parsedStacks.add(stack), parser(stack).reverse()))
                                    if (frame.filename) {
                                        filenameMetadataMap.set(frame.filename, metadata);
                                        break;
                                    }
                            }
                        }
                    return filenameMetadataMap.get(filename);
                }
                ((exports.addMetadataToStackFrames = function (parser, event) {
                    event.exception?.values?.forEach((exception) => {
                        exception.stacktrace?.frames?.forEach((frame) => {
                            if (!frame.filename || frame.module_metadata) return;
                            let metadata = getMetadataForUrl(parser, frame.filename);
                            metadata && (frame.module_metadata = metadata);
                        });
                    });
                }),
                    (exports.getFilenameToMetadataMap = function (parser) {
                        if (!worldwide.GLOBAL_OBJ._sentryModuleMetadata) return {};
                        let filenameMap = {};
                        for (let stack of Object.keys(worldwide.GLOBAL_OBJ._sentryModuleMetadata)) {
                            let metadata = worldwide.GLOBAL_OBJ._sentryModuleMetadata[stack];
                            for (let frame of parser(stack).reverse())
                                if (frame.filename) {
                                    filenameMap[frame.filename] = metadata;
                                    break;
                                }
                        }
                        return filenameMap;
                    }),
                    (exports.getMetadataForUrl = getMetadataForUrl),
                    (exports.stripMetadataFromStackFrames = function (event) {
                        event.exception?.values?.forEach((exception) => {
                            exception.stacktrace?.frames?.forEach((frame) => {
                                delete frame.module_metadata;
                            });
                        });
                    }));
            }