732(__unused_rspack_module, exports) {
                function normalizeArray(parts, allowAboveRoot) {
                    let up = 0;
                    for (let i = parts.length - 1; i >= 0; i--) {
                        let last = parts[i];
                        "." === last ? parts.splice(i, 1) : ".." === last ? (parts.splice(i, 1), up++) : up && (parts.splice(i, 1), up--);
                    }
                    if (allowAboveRoot) for (; up--;) parts.unshift("..");
                    return parts;
                }
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
                function splitPath(filename) {
                    let truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename,
                        parts = splitPathRe.exec(truncated);
                    return parts ? parts.slice(1) : [];
                }
                function resolve(...args) {
                    let resolvedPath = "",
                        resolvedAbsolute = !1;
                    for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                        let path = i >= 0 ? args[i] : "/";
                        path && ((resolvedPath = `${path}/${resolvedPath}`), (resolvedAbsolute = "/" === path.charAt(0)));
                    }
                    return (
                        (resolvedPath = normalizeArray(
                            resolvedPath.split("/").filter((p) => !!p),
                            !resolvedAbsolute,
                        ).join("/")),
                        (resolvedAbsolute ? "/" : "") + resolvedPath || "."
                    );
                }
                function trim(arr) {
                    let start = 0;
                    for (; start < arr.length && "" === arr[start]; start++);
                    let end = arr.length - 1;
                    for (; end >= 0 && "" === arr[end]; end--);
                    return start > end ? [] : arr.slice(start, end - start + 1);
                }
                function normalizePath(path) {
                    let isPathAbsolute = isAbsolute(path),
                        trailingSlash = "/" === path.slice(-1),
                        normalizedPath = normalizeArray(
                            path.split("/").filter((p) => !!p),
                            !isPathAbsolute,
                        ).join("/");
                    return (
                        normalizedPath || isPathAbsolute || (normalizedPath = "."),
                        normalizedPath && trailingSlash && (normalizedPath += "/"),
                        (isPathAbsolute ? "/" : "") + normalizedPath
                    );
                }
                function isAbsolute(path) {
                    return "/" === path.charAt(0);
                }
                ((exports.basename = function (path, ext) {
                    let f = splitPath(path)[2] || "";
                    return (ext && f.slice(-1 * ext.length) === ext && (f = f.slice(0, f.length - ext.length)), f);
                }),
                    (exports.dirname = function (path) {
                        let result = splitPath(path),
                            root = result[0] || "",
                            dir = result[1];
                        return root || dir ? (dir && (dir = dir.slice(0, dir.length - 1)), root + dir) : ".";
                    }),
                    (exports.isAbsolute = isAbsolute),
                    (exports.join = function (...args) {
                        return normalizePath(args.join("/"));
                    }),
                    (exports.normalizePath = normalizePath),
                    (exports.relative = function (from, to) {
                        ((from = resolve(from).slice(1)), (to = resolve(to).slice(1)));
                        let fromParts = trim(from.split("/")),
                            toParts = trim(to.split("/")),
                            length = Math.min(fromParts.length, toParts.length),
                            samePartsLength = length;
                        for (let i = 0; i < length; i++)
                            if (fromParts[i] !== toParts[i]) {
                                samePartsLength = i;
                                break;
                            }
                        let outputParts = [];
                        for (let i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
                        return (outputParts = outputParts.concat(toParts.slice(samePartsLength))).join("/");
                    }),
                    (exports.resolve = resolve));
            }