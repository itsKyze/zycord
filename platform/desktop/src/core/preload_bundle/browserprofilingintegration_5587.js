5587(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445),
                    startProfileForSpan = __webpack_require__(8173),
                    UIProfiler = __webpack_require__(3730),
                    utils = __webpack_require__(5764);
                exports.browserProfilingIntegration = core.defineIntegration(() => ({
                    name: "BrowserProfiling",
                    setup(client) {
                        let options = client.getOptions(),
                            profiler = new UIProfiler.UIProfiler();
                        if (
                            (utils.hasLegacyProfiling(options) || options.profileLifecycle || (options.profileLifecycle = "manual"),
                            utils.hasLegacyProfiling(options) && !options.profilesSampleRate)
                        ) {
                            debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Profiling disabled, no profiling options found.");
                            return;
                        }
                        let activeSpan = core.getActiveSpan(),
                            rootSpan = activeSpan && core.getRootSpan(activeSpan);
                        if (
                            (utils.hasLegacyProfiling(options) &&
                                void 0 !== options.profileSessionSampleRate &&
                                debugBuild.DEBUG_BUILD &&
                                core.debug.warn(
                                    "[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled.",
                                ),
                            utils.hasLegacyProfiling(options))
                        )
                            (rootSpan && utils.isAutomatedPageLoadSpan(rootSpan) && utils.shouldProfileSpanLegacy(rootSpan) && startProfileForSpan.startProfileForSpan(rootSpan),
                                client.on("spanStart", (span) => {
                                    span === core.getRootSpan(span) && utils.shouldProfileSpanLegacy(span) && startProfileForSpan.startProfileForSpan(span);
                                }),
                                client.on("beforeEnvelope", (envelope) => {
                                    if (!utils.getActiveProfilesCount()) return;
                                    let profiledTransactionEvents = utils.findProfiledTransactionsFromEnvelope(envelope);
                                    if (!profiledTransactionEvents.length) return;
                                    let profilesToAddToEnvelope = [];
                                    for (let profiledTransaction of profiledTransactionEvents) {
                                        let context = profiledTransaction?.contexts,
                                            profile_id = context?.profile?.profile_id,
                                            start_timestamp = context?.profile?.start_timestamp;
                                        if ("string" != typeof profile_id || !profile_id) {
                                            debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] cannot find profile for a span without a profile context");
                                            continue;
                                        }
                                        context?.profile && delete context.profile;
                                        let profile = utils.takeProfileFromGlobalCache(profile_id);
                                        if (!profile) {
                                            debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Could not retrieve profile for span: ${profile_id}`);
                                            continue;
                                        }
                                        let profileEvent = utils.createProfilingEvent(profile_id, start_timestamp, profile, profiledTransaction);
                                        profileEvent && profilesToAddToEnvelope.push(profileEvent);
                                    }
                                    utils.addProfilesToEnvelope(envelope, profilesToAddToEnvelope);
                                }));
                        else {
                            let lifecycleMode = options.profileLifecycle;
                            if ((client.on("startUIProfiler", () => profiler.start()), client.on("stopUIProfiler", () => profiler.stop()), "manual" === lifecycleMode))
                                profiler.initialize(client);
                            else if ("trace" === lifecycleMode) {
                                if (!core.hasSpansEnabled(options)) {
                                    debugBuild.DEBUG_BUILD &&
                                        core.debug.warn(
                                            "[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.",
                                        );
                                    return;
                                }
                                (profiler.initialize(client),
                                    rootSpan && profiler.notifyRootSpanActive(rootSpan),
                                    helpers.WINDOW.setTimeout(() => {
                                        let laterActiveSpan = core.getActiveSpan(),
                                            laterRootSpan = laterActiveSpan && core.getRootSpan(laterActiveSpan);
                                        laterRootSpan && profiler.notifyRootSpanActive(laterRootSpan);
                                    }, 0));
                            }
                        }
                    },
                    processEvent: (event) => utils.attachProfiledThreadToEvent(event),
                }));
            }