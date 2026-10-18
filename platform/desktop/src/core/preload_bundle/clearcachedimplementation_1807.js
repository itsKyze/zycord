1807(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(600),
                    types = __webpack_require__(3863),
                    cachedImplementations = {};
                function getNativeImplementation(name) {
                    let cached = cachedImplementations[name];
                    if (cached) return cached;
                    let impl = types.WINDOW[name];
                    if (core.isNativeFunction(impl)) return (cachedImplementations[name] = impl.bind(types.WINDOW));
                    let document1 = types.WINDOW.document;
                    if (document1 && "function" == typeof document1.createElement)
                        try {
                            let sandbox = document1.createElement("iframe");
                            ((sandbox.hidden = !0), document1.head.appendChild(sandbox));
                            let contentWindow = sandbox.contentWindow;
                            (contentWindow?.[name] && (impl = contentWindow[name]), document1.head.removeChild(sandbox));
                        } catch (e) {
                            debugBuild.DEBUG_BUILD && core.debug.warn(`Could not create sandbox iframe for ${name} check, bailing to window.${name}: `, e);
                        }
                    return impl ? (cachedImplementations[name] = impl.bind(types.WINDOW)) : impl;
                }
                ((exports.clearCachedImplementation = function (name) {
                    cachedImplementations[name] = void 0;
                }),
                    (exports.fetch = function (...rest) {
                        return getNativeImplementation("fetch")(...rest);
                    }),
                    (exports.getNativeImplementation = getNativeImplementation),
                    (exports.setTimeout = function (...rest) {
                        return getNativeImplementation("setTimeout")(...rest);
                    }));
            }