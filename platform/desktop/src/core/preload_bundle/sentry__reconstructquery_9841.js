9841(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    SQL_OPERATION_REGEX = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i,
                    CONNECTION_CONTEXT_SYMBOL = Symbol("sentryPostgresConnectionContext"),
                    INSTRUMENTED_MARKER = Symbol.for("sentry.instrumented.postgresjs"),
                    QUERY_FROM_INSTRUMENTED_SQL = Symbol.for("sentry.query.from.instrumented.sql");
                function _wrapSingleQueryHandle(query, sqlInstance, options) {
                    if (query.handle?.__sentryWrapped) return;
                    query[QUERY_FROM_INSTRUMENTED_SQL] = !0;
                    let originalHandle = query.handle,
                        wrappedHandle = async function (...args) {
                            var options1;
                            if (((options1 = options), void 0 === spanUtils.getActiveSpan() && options1.requireParentSpan)) return originalHandle.apply(this, args);
                            let sanitizedSqlQuery = _sanitizeSqlQuery(_reconstructQuery(query.strings));
                            return trace.startSpanManual({ name: sanitizedSqlQuery || "postgresjs.query", op: "db" }, (span) => {
                                (span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, "auto.db.postgresjs"),
                                    span.setAttributes({ "db.system.name": "postgres", "db.query.text": sanitizedSqlQuery }));
                                let connectionContext = sqlInstance ? sqlInstance[CONNECTION_CONTEXT_SYMBOL] : void 0;
                                if (
                                    ((function (span, connectionContext) {
                                        if (
                                            connectionContext &&
                                            (connectionContext.ATTR_DB_NAMESPACE && span.setAttribute("db.namespace", connectionContext.ATTR_DB_NAMESPACE),
                                            connectionContext.ATTR_SERVER_ADDRESS && span.setAttribute("server.address", connectionContext.ATTR_SERVER_ADDRESS),
                                            void 0 !== connectionContext.ATTR_SERVER_PORT)
                                        ) {
                                            let portNumber = parseInt(connectionContext.ATTR_SERVER_PORT, 10);
                                            isNaN(portNumber) || span.setAttribute("server.port", portNumber);
                                        }
                                    })(span, connectionContext),
                                    options.requestHook)
                                )
                                    try {
                                        options.requestHook(span, sanitizedSqlQuery, connectionContext);
                                    } catch (e) {
                                        (span.setAttribute("sentry.hook.error", "requestHook failed"),
                                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Error in requestHook for PostgresJs instrumentation:", e));
                                    }
                                ((this.resolve = new Proxy(this.resolve, {
                                    apply: (resolveTarget, resolveThisArg, resolveArgs) => {
                                        try {
                                            (_setOperationName(span, sanitizedSqlQuery, resolveArgs?.[0]?.command), span.end());
                                        } catch (e) {
                                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Error ending span in resolve callback:", e);
                                        }
                                        return Reflect.apply(resolveTarget, resolveThisArg, resolveArgs);
                                    },
                                })),
                                    (this.reject = new Proxy(this.reject, {
                                        apply: (rejectTarget, rejectThisArg, rejectArgs) => {
                                            try {
                                                (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: rejectArgs?.[0]?.message || "unknown_error" }),
                                                    span.setAttribute("db.response.status_code", rejectArgs?.[0]?.code || "unknown"),
                                                    span.setAttribute("error.type", rejectArgs?.[0]?.name || "unknown"),
                                                    _setOperationName(span, sanitizedSqlQuery),
                                                    span.end());
                                            } catch (e) {
                                                debugBuild.DEBUG_BUILD && debugLogger.debug.error("Error ending span in reject callback:", e);
                                            }
                                            return Reflect.apply(rejectTarget, rejectThisArg, rejectArgs);
                                        },
                                    })));
                                try {
                                    return originalHandle.apply(this, args);
                                } catch (e) {
                                    throw (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: e instanceof Error ? e.message : "unknown_error" }), span.end(), e);
                                }
                            });
                        };
                    ((wrappedHandle.__sentryWrapped = !0), (query.handle = wrappedHandle));
                }
                function _reconstructQuery(strings) {
                    if (strings?.length) return 1 === strings.length ? strings[0] || void 0 : strings.reduce((acc, str, i) => (0 === i ? str : `${acc}$${i}${str}`), "");
                }
                function _sanitizeSqlQuery(sqlQuery) {
                    return sqlQuery
                        ? sqlQuery
                              .replace(/--.*$/gm, "")
                              .replace(/\/\*[\s\S]*?\*\//g, "")
                              .replace(/;\s*$/, "")
                              .replace(/\s+/g, " ")
                              .trim()
                              .replace(/\bX'[0-9A-Fa-f]*'/gi, "?")
                              .replace(/\bB'[01]*'/gi, "?")
                              .replace(/'(?:[^']|'')*'/g, "?")
                              .replace(/\b0x[0-9A-Fa-f]+/gi, "?")
                              .replace(/\b(?:TRUE|FALSE)\b/gi, "?")
                              .replace(/-?\b\d+\.?\d*[eE][+-]?\d+\b/g, "?")
                              .replace(/-?\b\d+\.\d+\b/g, "?")
                              .replace(/-?\.\d+\b/g, "?")
                              .replace(/(?<!\$)-?\b\d+\b/g, "?")
                              .replace(/\bIN\b\s*\(\s*\?(?:\s*,\s*\?)*\s*\)/gi, "IN (?)")
                              .replace(/\bIN\b\s*\(\s*\$\d+(?:\s*,\s*\$\d+)*\s*\)/gi, "IN ($?)")
                        : "Unknown SQL Query";
                }
                function _setOperationName(span, sanitizedQuery, command) {
                    if (command) return void span.setAttribute("db.operation.name", command);
                    let operationMatch = sanitizedQuery?.match(SQL_OPERATION_REGEX);
                    operationMatch?.[1] && span.setAttribute("db.operation.name", operationMatch[1].toUpperCase());
                }
                ((exports._reconstructQuery = _reconstructQuery),
                    (exports._sanitizeSqlQuery = _sanitizeSqlQuery),
                    (exports.instrumentPostgresJsSql = function (sql, options) {
                        return sql && "function" == typeof sql
                            ? (function _instrumentSqlInstance(sql, options, parentConnectionContext) {
                                  if (sql[INSTRUMENTED_MARKER]) return sql;
                                  let proxiedSql = new Proxy(sql, {
                                      apply(target, thisArg, argumentsList) {
                                          let query = Reflect.apply(target, thisArg, argumentsList);
                                          return (query && "object" == typeof query && "handle" in query && _wrapSingleQueryHandle(query, proxiedSql, options), query);
                                      },
                                      get(target, prop) {
                                          var original, target1, proxiedSql1, options1, original1, target2, parentSqlInstance, options2;
                                          let original2 = target[prop];
                                          return "string" != typeof prop || "function" != typeof original2
                                              ? original2
                                              : "unsafe" === prop || "file" === prop
                                                ? ((original = original2),
                                                  (target1 = target),
                                                  (proxiedSql1 = proxiedSql),
                                                  (options1 = options),
                                                  function (...args) {
                                                      let query = Reflect.apply(original, target1, args);
                                                      return (
                                                          query && "object" == typeof query && "handle" in query && _wrapSingleQueryHandle(query, proxiedSql1, options1),
                                                          query
                                                      );
                                                  })
                                                : "begin" === prop || "reserve" === prop
                                                  ? ((original1 = original2),
                                                    (target2 = target),
                                                    (parentSqlInstance = proxiedSql),
                                                    (options2 = options),
                                                    function (...args) {
                                                        let parentContext = parentSqlInstance[CONNECTION_CONTEXT_SYMBOL];
                                                        if ("function" != typeof args[args.length - 1]) {
                                                            let result = Reflect.apply(original1, target2, args);
                                                            return result && "function" == typeof result.then
                                                                ? result.then((sqlInstance) => _instrumentSqlInstance(sqlInstance, options2, parentContext))
                                                                : result;
                                                        }
                                                        let callback = 1 === args.length ? args[0] : args[1],
                                                            wrappedCallback = function (sqlInstance) {
                                                                return callback(_instrumentSqlInstance(sqlInstance, options2, parentContext));
                                                            };
                                                        return Reflect.apply(original1, target2, 1 === args.length ? [wrappedCallback] : [args[0], wrappedCallback]);
                                                    })
                                                  : original2;
                                      },
                                  });
                                  return (
                                      parentConnectionContext
                                          ? (proxiedSql[CONNECTION_CONTEXT_SYMBOL] = parentConnectionContext)
                                          : (function (sql, proxiedSql) {
                                                if (!sql.options || "object" != typeof sql.options) return;
                                                let opts = sql.options,
                                                    host = opts.host?.[0] || "localhost",
                                                    port = opts.port?.[0] || 5432,
                                                    connectionContext = {
                                                        ATTR_DB_NAMESPACE: "string" == typeof opts.database && "" !== opts.database ? opts.database : void 0,
                                                        ATTR_SERVER_ADDRESS: host,
                                                        ATTR_SERVER_PORT: String(port),
                                                    };
                                                proxiedSql[CONNECTION_CONTEXT_SYMBOL] = connectionContext;
                                            })(sql, proxiedSql),
                                      (sql[INSTRUMENTED_MARKER] = !0),
                                      (proxiedSql[INSTRUMENTED_MARKER] = !0),
                                      proxiedSql
                                  );
                              })(sql, { requireParentSpan: !0, ...options })
                            : (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("instrumentPostgresJsSql: provided value is not a valid postgres.js sql instance"), sql);
                    }));
            }