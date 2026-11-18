188(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.addAutoIpAddressToSession = function (session) {
                        "aggregates" in session
                            ? session.attrs?.ip_address === void 0 && (session.attrs = { ...session.attrs, ip_address: "{{auto}}" })
                            : void 0 === session.ipAddress && (session.ipAddress = "{{auto}}");
                    }),
                    (exports.addAutoIpAddressToUser = function (objWithMaybeUser) {
                        objWithMaybeUser.user?.ip_address === void 0 && (objWithMaybeUser.user = { ...objWithMaybeUser.user, ip_address: "{{auto}}" });
                    }));
            }