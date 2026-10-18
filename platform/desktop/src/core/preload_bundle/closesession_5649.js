5649(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let misc = __webpack_require__(735),
                    time = __webpack_require__(602);
                function updateSession(session, context = {}) {
                    if (
                        (context.user &&
                            (!session.ipAddress && context.user.ip_address && (session.ipAddress = context.user.ip_address),
                            session.did || context.did || (session.did = context.user.id || context.user.email || context.user.username)),
                        (session.timestamp = context.timestamp || time.timestampInSeconds()),
                        context.abnormal_mechanism && (session.abnormal_mechanism = context.abnormal_mechanism),
                        context.ignoreDuration && (session.ignoreDuration = context.ignoreDuration),
                        context.sid && (session.sid = 32 === context.sid.length ? context.sid : misc.uuid4()),
                        void 0 !== context.init && (session.init = context.init),
                        !session.did && context.did && (session.did = `${context.did}`),
                        "number" == typeof context.started && (session.started = context.started),
                        session.ignoreDuration)
                    )
                        session.duration = void 0;
                    else if ("number" == typeof context.duration) session.duration = context.duration;
                    else {
                        let duration = session.timestamp - session.started;
                        session.duration = duration >= 0 ? duration : 0;
                    }
                    (context.release && (session.release = context.release),
                        context.environment && (session.environment = context.environment),
                        !session.ipAddress && context.ipAddress && (session.ipAddress = context.ipAddress),
                        !session.userAgent && context.userAgent && (session.userAgent = context.userAgent),
                        "number" == typeof context.errors && (session.errors = context.errors),
                        context.status && (session.status = context.status));
                }
                ((exports.closeSession = function (session, status) {
                    let context = {};
                    (status ? (context = { status }) : "ok" === session.status && (context = { status: "exited" }), updateSession(session, context));
                }),
                    (exports.makeSession = function (context) {
                        let startingTime = time.timestampInSeconds(),
                            session = {
                                sid: misc.uuid4(),
                                init: !0,
                                timestamp: startingTime,
                                started: startingTime,
                                duration: 0,
                                status: "ok",
                                errors: 0,
                                ignoreDuration: !1,
                                toJSON: () => {
                                    var session1;
                                    return (
                                        (session1 = session),
                                        {
                                            sid: `${session1.sid}`,
                                            init: session1.init,
                                            started: new Date(1e3 * session1.started).toISOString(),
                                            timestamp: new Date(1e3 * session1.timestamp).toISOString(),
                                            status: session1.status,
                                            errors: session1.errors,
                                            did: "number" == typeof session1.did || "string" == typeof session1.did ? `${session1.did}` : void 0,
                                            duration: session1.duration,
                                            abnormal_mechanism: session1.abnormal_mechanism,
                                            attrs: { release: session1.release, environment: session1.environment, ip_address: session1.ipAddress, user_agent: session1.userAgent },
                                        }
                                    );
                                },
                            };
                        return (context && updateSession(session, context), session);
                    }),
                    (exports.updateSession = updateSession));
            }