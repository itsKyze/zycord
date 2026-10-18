681(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let dsn = __webpack_require__(6058);
                function getBaseApiEndpoint(dsn) {
                    let protocol = dsn.protocol ? `${dsn.protocol}:` : "",
                        port = dsn.port ? `:${dsn.port}` : "";
                    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
                }
                ((exports.SENTRY_API_VERSION = "7"),
                    (exports.getEnvelopeEndpointWithUrlEncodedAuth = function (dsn, tunnel, sdkInfo) {
                        let params;
                        return (
                            tunnel ||
                            `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/?${((params = { sentry_version: "7" }), dsn.publicKey && (params.sentry_key = dsn.publicKey), sdkInfo && (params.sentry_client = `${sdkInfo.name}/${sdkInfo.version}`), new URLSearchParams(params).toString())}`
                        );
                    }),
                    (exports.getReportDialogEndpoint = function (dsnLike, dialogOptions) {
                        let dsn$1 = dsn.makeDsn(dsnLike);
                        if (!dsn$1) return "";
                        let endpoint = `${getBaseApiEndpoint(dsn$1)}embed/error-page/`,
                            encodedOptions = `dsn=${dsn.dsnToString(dsn$1)}`;
                        for (let key in dialogOptions)
                            if ("dsn" !== key && "onClose" !== key)
                                if ("user" === key) {
                                    let user = dialogOptions.user;
                                    if (!user) continue;
                                    (user.name && (encodedOptions += `&name=${encodeURIComponent(user.name)}`),
                                        user.email && (encodedOptions += `&email=${encodeURIComponent(user.email)}`));
                                } else encodedOptions += `&${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key])}`;
                        return `${endpoint}?${encodedOptions}`;
                    }));
            }