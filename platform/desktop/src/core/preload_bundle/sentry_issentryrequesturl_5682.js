5682(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let url = __webpack_require__(1410);
                function removeTrailingSlash(str) {
                    return "/" === str[str.length - 1] ? str.slice(0, -1) : str;
                }
                exports.isSentryRequestUrl = function (url1, client) {
                    var url$1, dsn, url2, tunnel;
                    let urlParts,
                        dsn1 = client?.getDsn(),
                        tunnel1 = client?.getOptions().tunnel;
                    return (
                        (url$1 = url1),
                        (dsn = dsn1),
                        (!(!(urlParts = url.parseStringToURLObject(url$1)) || url.isURLObjectRelative(urlParts)) &&
                            !!dsn &&
                            urlParts.host.includes(dsn.host) &&
                            /(^|&|\?)sentry_key=/.test(urlParts.search)) ||
                            ((url2 = url1), !!(tunnel = tunnel1) && removeTrailingSlash(url2) === removeTrailingSlash(tunnel))
                    );
                };
            }