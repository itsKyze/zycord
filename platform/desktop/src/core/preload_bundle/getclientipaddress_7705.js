7705(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let ipHeaderNames = [
                    "X-Client-IP",
                    "X-Forwarded-For",
                    "Fly-Client-IP",
                    "CF-Connecting-IP",
                    "Fastly-Client-Ip",
                    "True-Client-Ip",
                    "X-Real-IP",
                    "X-Cluster-Client-IP",
                    "X-Forwarded",
                    "Forwarded-For",
                    "Forwarded",
                    "X-Vercel-Forwarded-For",
                ];
                ((exports.getClientIPAddress = function (headers) {
                    let lowerCaseHeaders = {};
                    for (let key of Object.keys(headers)) lowerCaseHeaders[key.toLowerCase()] = headers[key];
                    return (
                        ipHeaderNames
                            .map((headerName) => {
                                let rawValue = lowerCaseHeaders[headerName.toLowerCase()],
                                    value = Array.isArray(rawValue) ? rawValue.join(";") : rawValue;
                                return "Forwarded" === headerName
                                    ? (function (value) {
                                          if (!value) return null;
                                          for (let part of value.split(";")) if (part.startsWith("for=")) return part.slice(4);
                                          return null;
                                      })(value)
                                    : value?.split(",").map((v) => v.trim());
                            })
                            .reduce((acc, val) => (val ? acc.concat(val) : acc), [])
                            .find((ip) => {
                                var str;
                                return (
                                    null !== ip &&
                                    ((str = ip),
                                    /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/.test(
                                        str,
                                    ))
                                );
                            }) || null
                    );
                }),
                    (exports.ipHeaderNames = ipHeaderNames));
            }