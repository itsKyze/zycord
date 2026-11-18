2659(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let breadcrumbs = __webpack_require__(6569),
                    debugBuild = __webpack_require__(3695),
                    _exports = __webpack_require__(6082),
                    integration = __webpack_require__(5579),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    misc = __webpack_require__(735),
                    is = __webpack_require__(7431),
                    spanstatus = __webpack_require__(2232),
                    trace = __webpack_require__(6833),
                    AUTH_OPERATIONS_TO_INSTRUMENT = [
                        "reauthenticate",
                        "signInAnonymously",
                        "signInWithOAuth",
                        "signInWithIdToken",
                        "signInWithOtp",
                        "signInWithPassword",
                        "signInWithSSO",
                        "signOut",
                        "signUp",
                        "verifyOtp",
                    ],
                    AUTH_ADMIN_OPERATIONS_TO_INSTRUMENT = ["createUser", "deleteUser", "listUsers", "getUserById", "updateUserById", "inviteUserByEmail"],
                    FILTER_MAPPINGS = {
                        eq: "eq",
                        neq: "neq",
                        gt: "gt",
                        gte: "gte",
                        lt: "lt",
                        lte: "lte",
                        like: "like",
                        "like(all)": "likeAllOf",
                        "like(any)": "likeAnyOf",
                        ilike: "ilike",
                        "ilike(all)": "ilikeAllOf",
                        "ilike(any)": "ilikeAnyOf",
                        is: "is",
                        in: "in",
                        cs: "contains",
                        cd: "containedBy",
                        sr: "rangeGt",
                        nxl: "rangeGte",
                        sl: "rangeLt",
                        nxr: "rangeLte",
                        adj: "rangeAdjacent",
                        ov: "overlaps",
                        fts: "",
                        plfts: "plain",
                        phfts: "phrase",
                        wfts: "websearch",
                        not: "not",
                    },
                    DB_OPERATIONS_TO_INSTRUMENT = ["select", "insert", "upsert", "update", "delete"];
                function markAsInstrumented(fn) {
                    try {
                        fn.__SENTRY_INSTRUMENTED__ = !0;
                    } catch {}
                }
                function isInstrumented(fn) {
                    try {
                        return fn.__SENTRY_INSTRUMENTED__;
                    } catch {
                        return !1;
                    }
                }
                function extractOperation(method, headers = {}) {
                    switch (method) {
                        case "GET":
                            return "select";
                        case "POST":
                            if (headers.Prefer?.includes("resolution=")) return "upsert";
                            return "insert";
                        case "PATCH":
                            return "update";
                        case "DELETE":
                            return "delete";
                        default:
                            return "<unknown-op>";
                    }
                }
                function translateFiltersIntoMethods(key, query) {
                    let method;
                    if ("" === query || "*" === query) return "select(*)";
                    if ("select" === key) return `select(${query})`;
                    if ("or" === key || key.endsWith(".or")) return `${key}${query}`;
                    let [filter, ...value] = query.split(".");
                    return (
                        (method = filter?.startsWith("fts")
                            ? "textSearch"
                            : filter?.startsWith("plfts")
                              ? "textSearch[plain]"
                              : filter?.startsWith("phfts")
                                ? "textSearch[phrase]"
                                : filter?.startsWith("wfts")
                                  ? "textSearch[websearch]"
                                  : (filter && FILTER_MAPPINGS[filter]) || "filter"),
                        `${method}(${key}, ${value.join(".")})`
                    );
                }
                function instrumentAuthOperation(operation, isAdmin = !1) {
                    return new Proxy(operation, {
                        apply: (target, thisArg, argumentsList) =>
                            trace.startSpan(
                                {
                                    name: `auth ${isAdmin ? "(admin) " : ""}${operation.name}`,
                                    attributes: {
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.supabase",
                                        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "db",
                                        "db.system": "postgresql",
                                        "db.operation": `auth.${isAdmin ? "admin." : ""}${operation.name}`,
                                    },
                                },
                                (span) =>
                                    Reflect.apply(target, thisArg, argumentsList)
                                        .then(
                                            (res) => (
                                                res && "object" == typeof res && "error" in res && res.error
                                                    ? (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR }),
                                                      _exports.captureException(res.error, { mechanism: { handled: !1, type: "auto.db.supabase.auth" } }))
                                                    : span.setStatus({ code: spanstatus.SPAN_STATUS_OK }),
                                                span.end(),
                                                res
                                            ),
                                        )
                                        .catch((err) => {
                                            throw (
                                                span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR }),
                                                span.end(),
                                                _exports.captureException(err, { mechanism: { handled: !1, type: "auto.db.supabase.auth" } }),
                                                err
                                            );
                                        })
                                        .then(...argumentsList),
                            ),
                    });
                }
                let instrumentSupabaseClient = (supabaseClient) => {
                        var SupabaseClient;
                        if (!supabaseClient) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Supabase integration was not installed because no Supabase client was provided.");
                            return;
                        }
                        isInstrumented((SupabaseClient = supabaseClient.constructor === Function ? supabaseClient : supabaseClient.constructor).prototype.from) ||
                            ((SupabaseClient.prototype.from = new Proxy(SupabaseClient.prototype.from, {
                                apply(target, thisArg, argumentsList) {
                                    let rv = Reflect.apply(target, thisArg, argumentsList);
                                    return (
                                        (function (PostgRESTQueryBuilder) {
                                            for (let operation of DB_OPERATIONS_TO_INSTRUMENT)
                                                isInstrumented(PostgRESTQueryBuilder.prototype[operation]) ||
                                                    ((PostgRESTQueryBuilder.prototype[operation] = new Proxy(PostgRESTQueryBuilder.prototype[operation], {
                                                        apply(target, thisArg, argumentsList) {
                                                            let rv = Reflect.apply(target, thisArg, argumentsList),
                                                                PostgRESTFilterBuilder = rv.constructor;
                                                            return (
                                                                debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Instrumenting ${operation} operation's PostgRESTFilterBuilder`),
                                                                isInstrumented(PostgRESTFilterBuilder.prototype.then) ||
                                                                    ((PostgRESTFilterBuilder.prototype.then = new Proxy(PostgRESTFilterBuilder.prototype.then, {
                                                                        apply(target, thisArg, argumentsList) {
                                                                            let operation = extractOperation(thisArg.method, thisArg.headers);
                                                                            if (
                                                                                !DB_OPERATIONS_TO_INSTRUMENT.includes(operation) ||
                                                                                !thisArg?.url?.pathname ||
                                                                                "string" != typeof thisArg.url.pathname
                                                                            )
                                                                                return Reflect.apply(target, thisArg, argumentsList);
                                                                            let pathParts = thisArg.url.pathname.split("/"),
                                                                                table = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "",
                                                                                queryItems = [];
                                                                            for (let [key, value] of thisArg.url.searchParams.entries())
                                                                                queryItems.push(translateFiltersIntoMethods(key, value));
                                                                            let body = Object.create(null);
                                                                            if (is.isPlainObject(thisArg.body))
                                                                                for (let [key, value] of Object.entries(thisArg.body)) body[key] = value;
                                                                            let description = `${"select" === operation ? "" : `${operation}${body ? "(...) " : ""}`}${queryItems.join(" ")} from(${table})`,
                                                                                attributes = {
                                                                                    "db.table": table,
                                                                                    "db.schema": thisArg.schema,
                                                                                    "db.url": thisArg.url.origin,
                                                                                    "db.sdk": thisArg.headers["X-Client-Info"],
                                                                                    "db.system": "postgresql",
                                                                                    "db.operation": operation,
                                                                                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.supabase",
                                                                                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "db",
                                                                                };
                                                                            return (
                                                                                queryItems.length && (attributes["db.query"] = queryItems),
                                                                                Object.keys(body).length && (attributes["db.body"] = body),
                                                                                trace.startSpan({ name: description, attributes }, (span) =>
                                                                                    Reflect.apply(target, thisArg, [])
                                                                                        .then(
                                                                                            (res) => {
                                                                                                if (
                                                                                                    (span &&
                                                                                                        (res &&
                                                                                                            "object" == typeof res &&
                                                                                                            "status" in res &&
                                                                                                            spanstatus.setHttpStatus(span, res.status || 500),
                                                                                                        span.end()),
                                                                                                    res?.error)
                                                                                                ) {
                                                                                                    let err = Error(res.error.message);
                                                                                                    (res.error.code && (err.code = res.error.code),
                                                                                                        res.error.details && (err.details = res.error.details));
                                                                                                    let supabaseContext = {};
                                                                                                    (queryItems.length && (supabaseContext.query = queryItems),
                                                                                                        Object.keys(body).length && (supabaseContext.body = body),
                                                                                                        _exports.captureException(
                                                                                                            err,
                                                                                                            (scope) => (
                                                                                                                scope.addEventProcessor(
                                                                                                                    (e) => (
                                                                                                                        misc.addExceptionMechanism(e, {
                                                                                                                            handled: !1,
                                                                                                                            type: "auto.db.supabase.postgres",
                                                                                                                        }),
                                                                                                                        e
                                                                                                                    ),
                                                                                                                ),
                                                                                                                scope.setContext("supabase", supabaseContext),
                                                                                                                scope
                                                                                                            ),
                                                                                                        ));
                                                                                                }
                                                                                                let breadcrumb = {
                                                                                                        type: "supabase",
                                                                                                        category: `db.${operation}`,
                                                                                                        message: description,
                                                                                                    },
                                                                                                    data = {};
                                                                                                return (
                                                                                                    queryItems.length && (data.query = queryItems),
                                                                                                    Object.keys(body).length && (data.body = body),
                                                                                                    Object.keys(data).length && (breadcrumb.data = data),
                                                                                                    breadcrumbs.addBreadcrumb(breadcrumb),
                                                                                                    res
                                                                                                );
                                                                                            },
                                                                                            (err) => {
                                                                                                throw (span && (spanstatus.setHttpStatus(span, 500), span.end()), err);
                                                                                            },
                                                                                        )
                                                                                        .then(...argumentsList),
                                                                                )
                                                                            );
                                                                        },
                                                                    })),
                                                                    markAsInstrumented(PostgRESTFilterBuilder.prototype.then)),
                                                                rv
                                                            );
                                                        },
                                                    })),
                                                    markAsInstrumented(PostgRESTQueryBuilder.prototype[operation]));
                                        })(rv.constructor),
                                        rv
                                    );
                                },
                            })),
                            markAsInstrumented(SupabaseClient.prototype.from));
                        let auth = supabaseClient.auth;
                        if (!(!auth || isInstrumented(supabaseClient.auth))) {
                            for (let operation of AUTH_OPERATIONS_TO_INSTRUMENT) {
                                let authOperation = auth[operation];
                                authOperation && "function" == typeof supabaseClient.auth[operation] && (supabaseClient.auth[operation] = instrumentAuthOperation(authOperation));
                            }
                            for (let operation of AUTH_ADMIN_OPERATIONS_TO_INSTRUMENT) {
                                let authOperation = auth.admin[operation];
                                authOperation &&
                                    "function" == typeof supabaseClient.auth.admin[operation] &&
                                    (supabaseClient.auth.admin[operation] = instrumentAuthOperation(authOperation, !0));
                            }
                            markAsInstrumented(supabaseClient.auth);
                        }
                    },
                    supabaseIntegration = integration.defineIntegration((options) => {
                        let supabaseClient;
                        return (
                            (supabaseClient = options.supabaseClient),
                            {
                                setupOnce() {
                                    instrumentSupabaseClient(supabaseClient);
                                },
                                name: "Supabase",
                            }
                        );
                    });
                ((exports.DB_OPERATIONS_TO_INSTRUMENT = DB_OPERATIONS_TO_INSTRUMENT),
                    (exports.FILTER_MAPPINGS = FILTER_MAPPINGS),
                    (exports.extractOperation = extractOperation),
                    (exports.instrumentSupabaseClient = instrumentSupabaseClient),
                    (exports.supabaseIntegration = supabaseIntegration),
                    (exports.translateFiltersIntoMethods = translateFiltersIntoMethods));
            }