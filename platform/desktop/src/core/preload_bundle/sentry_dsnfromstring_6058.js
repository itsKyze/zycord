6058(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    ORG_ID_REGEX = /^o(\d+)\./,
                    DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
                function dsnFromString(str) {
                    let match = DSN_REGEX.exec(str);
                    if (!match)
                        return void debugLogger.consoleSandbox(() => {
                            console.error(`Invalid Sentry Dsn: ${str}`);
                        });
                    let [protocol, publicKey, pass = "", host = "", port = "", lastPath = ""] = match.slice(1),
                        path = "",
                        projectId = lastPath,
                        split = projectId.split("/");
                    if ((split.length > 1 && ((path = split.slice(0, -1).join("/")), (projectId = split.pop())), projectId)) {
                        let projectMatch = projectId.match(/^\d+/);
                        projectMatch && (projectId = projectMatch[0]);
                    }
                    return dsnFromComponents({ host, pass, path, projectId, port, protocol: protocol, publicKey });
                }
                function dsnFromComponents(components) {
                    return {
                        protocol: components.protocol,
                        publicKey: components.publicKey || "",
                        pass: components.pass || "",
                        host: components.host,
                        port: components.port || "",
                        path: components.path || "",
                        projectId: components.projectId,
                    };
                }
                function extractOrgIdFromDsnHost(host) {
                    let match = host.match(ORG_ID_REGEX);
                    return match?.[1];
                }
                ((exports.dsnFromString = dsnFromString),
                    (exports.dsnToString = function (dsn, withPassword = !1) {
                        let { host, path, pass, port, projectId, protocol, publicKey } = dsn;
                        return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
                    }),
                    (exports.extractOrgIdFromClient = function (client) {
                        let org_id,
                            options = client.getOptions(),
                            { host } = client.getDsn() || {};
                        return (options.orgId ? (org_id = String(options.orgId)) : host && (org_id = extractOrgIdFromDsnHost(host)), org_id);
                    }),
                    (exports.extractOrgIdFromDsnHost = extractOrgIdFromDsnHost),
                    (exports.makeDsn = function (from) {
                        let components = "string" == typeof from ? dsnFromString(from) : dsnFromComponents(from);
                        if (
                            components &&
                            (function (dsn) {
                                if (!debugBuild.DEBUG_BUILD) return !0;
                                let { port, projectId, protocol } = dsn;
                                return (
                                    !["protocol", "publicKey", "host", "projectId"].find(
                                        (component) => !dsn[component] && (debugLogger.debug.error(`Invalid Sentry Dsn: ${component} missing`), !0),
                                    ) &&
                                    (projectId.match(/^\d+$/)
                                        ? "http" !== protocol && "https" !== protocol
                                            ? (debugLogger.debug.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`), !1)
                                            : !(port && isNaN(parseInt(port, 10))) || (debugLogger.debug.error(`Invalid Sentry Dsn: Invalid port ${port}`), !1)
                                        : (debugLogger.debug.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`), !1))
                                );
                            })(components)
                        )
                            return components;
                    }));
            }