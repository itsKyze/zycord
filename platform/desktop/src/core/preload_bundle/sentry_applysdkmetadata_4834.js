4834(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let version = __webpack_require__(3771);
                exports.applySdkMetadata = function (options, name, names = [name], source = "npm") {
                    let sdk = ((options._metadata = options._metadata || {}).sdk = options._metadata.sdk || {});
                    sdk.name ||
                        ((sdk.name = `sentry.javascript.${name}`),
                        (sdk.packages = names.map((name) => ({ name: `${source}:@sentry/${name}`, version: version.SDK_VERSION }))),
                        (sdk.version = version.SDK_VERSION));
                };
            }