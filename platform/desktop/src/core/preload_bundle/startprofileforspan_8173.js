8173(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445),
                    utils = __webpack_require__(5764);
                exports.startProfileForSpan = function (span) {
                    let startTimestamp;
                    utils.isAutomatedPageLoadSpan(span) && (startTimestamp = 1e3 * core.timestampInSeconds());
                    let profiler = utils.startJSSelfProfile();
                    if (!profiler) return;
                    debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] started profiling span: ${core.spanToJSON(span).description}`);
                    let profileId = core.uuid4(),
                        processedProfile = null;
                    async function onProfileHandler() {
                        if (span && profiler) {
                            if (processedProfile) {
                                debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] profile for:", core.spanToJSON(span).description, "already exists, returning early");
                                return;
                            }
                            return profiler
                                .stop()
                                .then((profile) => {
                                    if (
                                        (maxDurationTimeoutID && (helpers.WINDOW.clearTimeout(maxDurationTimeoutID), (maxDurationTimeoutID = void 0)),
                                        debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] stopped profiling of span: ${core.spanToJSON(span).description}`),
                                        !profile)
                                    ) {
                                        debugBuild.DEBUG_BUILD &&
                                            core.debug.log(
                                                `[Profiling] profiler returned null profile for: ${core.spanToJSON(span).description}`,
                                                "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started",
                                            );
                                        return;
                                    }
                                    ((processedProfile = profile), utils.addProfileToGlobalCache(profileId, profile));
                                })
                                .catch((error) => {
                                    debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] error while stopping profiler:", error);
                                });
                        }
                    }
                    core.getCurrentScope().setContext("profile", { profile_id: profileId, start_timestamp: startTimestamp });
                    let maxDurationTimeoutID = helpers.WINDOW.setTimeout(() => {
                            (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] max profile duration elapsed, stopping profiling for:", core.spanToJSON(span).description),
                                onProfileHandler());
                        }, utils.MAX_PROFILE_DURATION_MS),
                        originalEnd = span.end.bind(span);
                    span.end = function () {
                        return span
                            ? (onProfileHandler().then(
                                  () => {
                                      originalEnd();
                                  },
                                  () => {
                                      originalEnd();
                                  },
                              ),
                              span)
                            : originalEnd();
                    };
                };
            }