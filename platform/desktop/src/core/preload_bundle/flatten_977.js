977(__unused_rspack_module, exports) {
                "use strict";
                function flatten(metadata, prefix = null, root = null) {
                    if (((root = null !== root ? root : {}), (prefix = null !== prefix ? prefix : ""), "object" == typeof metadata))
                        for (let key in metadata) {
                            let nextPrefix = "" === prefix ? key : `${prefix}[${key}]`;
                            flatten(metadata[key], nextPrefix, root);
                        }
                    else root[prefix] = String(metadata);
                    return root;
                }
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.flatten = flatten),
                    (exports.reconcileCrashReporterMetadata = function (crashReporter, metadata) {
                        let newMetadata = flatten(metadata),
                            oldMetadata = crashReporter.getParameters();
                        for (let key in oldMetadata) newMetadata.hasOwnProperty(key) || crashReporter.removeExtraParameter(key);
                        for (let key in newMetadata) oldMetadata.hasOwnProperty(key) || crashReporter.addExtraParameter(key, String(newMetadata[key]));
                    }));
            }