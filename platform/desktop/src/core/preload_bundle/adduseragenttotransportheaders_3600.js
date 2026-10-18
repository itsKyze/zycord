3600(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.addUserAgentToTransportHeaders = function (options) {
                        let sdkMetadata = options._metadata?.sdk,
                            sdkUserAgent = sdkMetadata?.name && sdkMetadata?.version ? `${sdkMetadata?.name}/${sdkMetadata?.version}` : void 0;
                        options.transportOptions = {
                            ...options.transportOptions,
                            headers: { ...(sdkUserAgent && { "user-agent": sdkUserAgent }), ...options.transportOptions?.headers },
                        };
                    }));
            }