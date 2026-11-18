5764(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445),
                    isMainThread = "window" in core.GLOBAL_OBJ && core.GLOBAL_OBJ.window === core.GLOBAL_OBJ && "u" < typeof importScripts,
                    PROFILER_THREAD_ID_STRING = String(0),
                    PROFILER_THREAD_NAME = isMainThread ? "main" : "worker",
                    navigator1 = helpers.WINDOW.navigator,
                    OS_PLATFORM = "",
                    OS_PLATFORM_VERSION = "",
                    OS_ARCH = "",
                    OS_BROWSER = navigator1?.userAgent || "",
                    OS_MODEL = "",
                    OS_LOCALE = navigator1?.language || navigator1?.languages?.[0] || "",
                    userAgentData = navigator1?.userAgentData;
                function enrichWithThreadInformation(profile) {
                    return "thread_metadata" in profile ? profile : convertJSSelfProfileToSampledFormat(profile);
                }
                function createProfilePayload(profile_id, start_timestamp, processed_profile, event) {
                    let traceId;
                    if ("transaction" !== event.type) throw TypeError("Profiling events may only be attached to transactions, this should never occur.");
                    if (null == processed_profile) throw TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${processed_profile} instead.`);
                    let traceId1 = ("string" == typeof (traceId = event.contexts?.trace?.trace_id) &&
                            32 !== traceId.length &&
                            debugBuild.DEBUG_BUILD &&
                            core.debug.log(`[Profiling] Invalid traceId: ${traceId} on profiled event`),
                        "string" != typeof traceId)
                            ? ""
                            : traceId,
                        enrichedThreadProfile = enrichWithThreadInformation(processed_profile),
                        transactionStartMs = start_timestamp || ("number" == typeof event.start_timestamp ? 1e3 * event.start_timestamp : 1e3 * core.timestampInSeconds()),
                        transactionEndMs = "number" == typeof event.timestamp ? 1e3 * event.timestamp : 1e3 * core.timestampInSeconds();
                    return {
                        event_id: profile_id,
                        timestamp: new Date(transactionStartMs).toISOString(),
                        platform: "javascript",
                        version: "1",
                        release: event.release || "",
                        environment: event.environment || core.DEFAULT_ENVIRONMENT,
                        runtime: { name: "javascript", version: helpers.WINDOW.navigator.userAgent },
                        os: { name: OS_PLATFORM, version: OS_PLATFORM_VERSION, build_number: OS_BROWSER },
                        device: { locale: OS_LOCALE, model: OS_MODEL, manufacturer: OS_BROWSER, architecture: OS_ARCH, is_emulator: !1 },
                        debug_meta: { images: applyDebugMetadata(processed_profile.resources) },
                        profile: enrichedThreadProfile,
                        transactions: [
                            {
                                name: event.transaction || "",
                                id: event.event_id || core.uuid4(),
                                trace_id: traceId1,
                                active_thread_id: PROFILER_THREAD_ID_STRING,
                                relative_start_ns: "0",
                                relative_end_ns: ((transactionEndMs - transactionStartMs) * 1e6).toFixed(0),
                            },
                        ],
                    };
                }
                function convertJSSelfProfileToSampledFormat(input) {
                    let EMPTY_STACK_ID,
                        STACK_ID = 0,
                        profile = { samples: [], stacks: [], frames: [], thread_metadata: { [PROFILER_THREAD_ID_STRING]: { name: PROFILER_THREAD_NAME } } },
                        firstSample = input.samples[0];
                    if (!firstSample) return profile;
                    let start = firstSample.timestamp,
                        perfOrigin = core.browserPerformanceTimeOrigin(),
                        origin = "number" == typeof performance.timeOrigin ? performance.timeOrigin : perfOrigin || 0,
                        adjustForOriginChange = origin - (perfOrigin || origin);
                    return (
                        input.samples.forEach((jsSample, i) => {
                            if (void 0 === jsSample.stackId) {
                                (void 0 === EMPTY_STACK_ID && ((EMPTY_STACK_ID = STACK_ID), (profile.stacks[EMPTY_STACK_ID] = []), STACK_ID++),
                                    (profile.samples[i] = {
                                        elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * 1e6).toFixed(0),
                                        stack_id: EMPTY_STACK_ID,
                                        thread_id: PROFILER_THREAD_ID_STRING,
                                    }));
                                return;
                            }
                            let stackTop = input.stacks[jsSample.stackId],
                                stack = [];
                            for (; stackTop;) {
                                stack.push(stackTop.frameId);
                                let frame = input.frames[stackTop.frameId];
                                (frame &&
                                    void 0 === profile.frames[stackTop.frameId] &&
                                    (profile.frames[stackTop.frameId] = {
                                        function: frame.name,
                                        abs_path: "number" == typeof frame.resourceId ? input.resources[frame.resourceId] : void 0,
                                        lineno: frame.line,
                                        colno: frame.column,
                                    }),
                                    (stackTop = void 0 === stackTop.parentId ? void 0 : input.stacks[stackTop.parentId]));
                            }
                            let sample = {
                                elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * 1e6).toFixed(0),
                                stack_id: STACK_ID,
                                thread_id: PROFILER_THREAD_ID_STRING,
                            };
                            ((profile.stacks[STACK_ID] = stack), (profile.samples[i] = sample), STACK_ID++);
                        }),
                        profile
                    );
                }
                function applyDebugMetadata(resource_paths) {
                    let client = core.getClient(),
                        options = client?.getOptions(),
                        stackParser = options?.stackParser;
                    return stackParser ? core.getDebugImagesForResources(stackParser, resource_paths) : [];
                }
                function isValidSampleRate(rate) {
                    return ("number" != typeof rate && "boolean" != typeof rate) || ("number" == typeof rate && isNaN(rate))
                        ? (debugBuild.DEBUG_BUILD &&
                              core.debug.warn(
                                  `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(rate)} of type ${JSON.stringify(typeof rate)}.`,
                              ),
                          !1)
                        : !0 === rate ||
                              !1 === rate ||
                              (!(rate < 0) && !(rate > 1)) ||
                              (debugBuild.DEBUG_BUILD && core.debug.warn(`[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${rate}.`), !1);
                }
                "object" == typeof userAgentData &&
                    null !== userAgentData &&
                    "getHighEntropyValues" in userAgentData &&
                    userAgentData
                        .getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"])
                        .then((ua) => {
                            if (
                                ((OS_PLATFORM = ua.platform || ""),
                                (OS_ARCH = ua.architecture || ""),
                                (OS_MODEL = ua.model || ""),
                                (OS_PLATFORM_VERSION = ua.platformVersion || ""),
                                ua.fullVersionList?.length)
                            ) {
                                let firstUa = ua.fullVersionList[ua.fullVersionList.length - 1];
                                OS_BROWSER = `${firstUa.brand} ${firstUa.version}`;
                            }
                        })
                        .catch((e) => void 0);
                let PROFILING_CONSTRUCTOR_FAILED = !1,
                    PROFILE_MAP = new Map();
                ((exports.MAX_PROFILE_DURATION_MS = 3e4),
                    (exports.PROFILER_THREAD_ID_STRING = PROFILER_THREAD_ID_STRING),
                    (exports.PROFILER_THREAD_NAME = PROFILER_THREAD_NAME),
                    (exports.addProfileToGlobalCache = function (profile_id, profile) {
                        if ((PROFILE_MAP.set(profile_id, profile), PROFILE_MAP.size > 30)) {
                            let last = PROFILE_MAP.keys().next().value;
                            void 0 !== last && PROFILE_MAP.delete(last);
                        }
                    }),
                    (exports.addProfilesToEnvelope = function (envelope, profiles) {
                        if (!profiles.length) return envelope;
                        for (let profile of profiles) envelope[1].push([{ type: "profile" }, profile]);
                        return envelope;
                    }),
                    (exports.applyDebugMetadata = applyDebugMetadata),
                    (exports.attachProfiledThreadToEvent = function (event) {
                        return (
                            event?.contexts?.profile &&
                                event.contexts &&
                                (event.contexts.trace?.trace_id &&
                                    (event.contexts.trace = {
                                        ...event.contexts.trace,
                                        data: { ...(event.contexts.trace.data ?? {}), "thread.id": PROFILER_THREAD_ID_STRING, "thread.name": PROFILER_THREAD_NAME },
                                    }),
                                event.spans?.forEach((span) => {
                                    span.data = { ...(span.data || {}), "thread.id": PROFILER_THREAD_ID_STRING, "thread.name": PROFILER_THREAD_NAME };
                                })),
                            event
                        );
                    }),
                    (exports.convertJSSelfProfileToSampledFormat = convertJSSelfProfileToSampledFormat),
                    (exports.createProfileChunkPayload = function (jsSelfProfile, client, profilerId) {
                        if (null == jsSelfProfile) throw TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${jsSelfProfile} instead.`);
                        let continuousProfile = (function (input) {
                                let frames = [];
                                for (let i = 0; i < input.frames.length; i++) {
                                    let frame = input.frames[i];
                                    frame &&
                                        (frames[i] = {
                                            function: frame.name,
                                            abs_path: "number" == typeof frame.resourceId ? input.resources[frame.resourceId] : void 0,
                                            lineno: frame.line,
                                            colno: frame.column,
                                        });
                                }
                                let stacks = [];
                                for (let i = 0; i < input.stacks.length; i++) {
                                    let stackHead = input.stacks[i];
                                    if (!stackHead) continue;
                                    let list = [],
                                        current = stackHead;
                                    for (; current;) (list.push(current.frameId), (current = void 0 === current.parentId ? void 0 : input.stacks[current.parentId]));
                                    stacks[i] = list;
                                }
                                let perfOrigin = core.browserPerformanceTimeOrigin(),
                                    origin = "number" == typeof performance.timeOrigin ? performance.timeOrigin : perfOrigin || 0,
                                    adjustForOriginChange = origin - (perfOrigin || origin),
                                    samples = [];
                                for (let i = 0; i < input.samples.length; i++) {
                                    let sample = input.samples[i];
                                    if (!sample) continue;
                                    let timestampSeconds = (origin + (sample.timestamp - adjustForOriginChange)) / 1e3;
                                    samples[i] = { stack_id: sample.stackId ?? 0, thread_id: PROFILER_THREAD_ID_STRING, timestamp: timestampSeconds };
                                }
                                return { frames, stacks, samples, thread_metadata: { [PROFILER_THREAD_ID_STRING]: { name: PROFILER_THREAD_NAME } } };
                            })(jsSelfProfile),
                            options = client.getOptions(),
                            sdk = client.getSdkMetadata?.()?.sdk;
                        return {
                            chunk_id: core.uuid4(),
                            client_sdk: { name: sdk?.name ?? "sentry.javascript.browser", version: sdk?.version ?? "0.0.0" },
                            profiler_id: profilerId || core.uuid4(),
                            platform: "javascript",
                            version: "2",
                            release: options.release ?? "",
                            environment: options.environment ?? "production",
                            debug_meta: { images: applyDebugMetadata(jsSelfProfile.resources) },
                            profile: continuousProfile,
                        };
                    }),
                    (exports.createProfilePayload = createProfilePayload),
                    (exports.createProfilingEvent = function (profile_id, start_timestamp, profile, event) {
                        return (
                            profile.samples.length < 2
                                ? (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Discarding profile because it contains less than 2 samples"), 1)
                                : !profile.frames.length && (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Discarding profile because it contains no frames"), 1)
                        )
                            ? null
                            : createProfilePayload(profile_id, start_timestamp, profile, event);
                    }),
                    (exports.enrichWithThreadInformation = enrichWithThreadInformation),
                    (exports.findProfiledTransactionsFromEnvelope = function (envelope) {
                        let events = [];
                        return (
                            core.forEachEnvelopeItem(envelope, (item, type) => {
                                if ("transaction" === type)
                                    for (let j = 1; j < item.length; j++) {
                                        let event = item[j];
                                        event?.contexts?.profile?.profile_id && events.push(item[j]);
                                    }
                            }),
                            events
                        );
                    }),
                    (exports.getActiveProfilesCount = function () {
                        return PROFILE_MAP.size;
                    }),
                    (exports.hasLegacyProfiling = function (options) {
                        return void 0 !== options.profilesSampleRate;
                    }),
                    (exports.isAutomatedPageLoadSpan = function (span) {
                        return "pageload" === core.spanToJSON(span).op;
                    }),
                    (exports.isValidSampleRate = isValidSampleRate),
                    (exports.shouldProfileSession = function (options) {
                        if (PROFILING_CONSTRUCTOR_FAILED)
                            return (
                                debugBuild.DEBUG_BUILD &&
                                    core.debug.log("[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started."),
                                !1
                            );
                        if ("trace" !== options.profileLifecycle && "manual" !== options.profileLifecycle)
                            return (debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Session not sampled. Invalid `profileLifecycle` option."), !1);
                        let profileSessionSampleRate = options.profileSessionSampleRate;
                        return isValidSampleRate(profileSessionSampleRate)
                            ? profileSessionSampleRate
                                ? Math.random() <= profileSessionSampleRate
                                : (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0"), !1)
                            : (debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Discarding profile because of invalid profileSessionSampleRate."), !1);
                    }),
                    (exports.shouldProfileSpanLegacy = function (span) {
                        if (PROFILING_CONSTRUCTOR_FAILED)
                            return (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Profiling has been disabled for the duration of the current user session."), !1);
                        if (!span.isRecording()) return (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Discarding profile because root span was not sampled."), !1);
                        let client = core.getClient(),
                            options = client?.getOptions();
                        if (!options) return (debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Profiling disabled, no options found."), !1);
                        let profilesSampleRate = options.profilesSampleRate;
                        return isValidSampleRate(profilesSampleRate)
                            ? profilesSampleRate
                                ? !!(!0 === profilesSampleRate || Math.random() < profilesSampleRate) ||
                                  (debugBuild.DEBUG_BUILD &&
                                      core.debug.log(
                                          `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(profilesSampleRate)})`,
                                      ),
                                  !1)
                                : (debugBuild.DEBUG_BUILD &&
                                      core.debug.log("[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0"),
                                  !1)
                            : (debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] Discarding profile because of invalid sample rate."), !1);
                    }),
                    (exports.startJSSelfProfile = function () {
                        let JSProfilerConstructor = helpers.WINDOW.Profiler;
                        if ("function" != typeof JSProfilerConstructor) {
                            debugBuild.DEBUG_BUILD && core.debug.log("[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.");
                            return;
                        }
                        let maxSamples = Math.floor(3e3);
                        try {
                            return new JSProfilerConstructor({ sampleInterval: 10, maxBufferSize: maxSamples });
                        } catch (_e) {
                            (debugBuild.DEBUG_BUILD &&
                                (core.debug.log(
                                    "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header.",
                                ),
                                core.debug.log("[Profiling] Disabling profiling for current user session.")),
                                (PROFILING_CONSTRUCTOR_FAILED = !0));
                        }
                    }),
                    (exports.takeProfileFromGlobalCache = function (profile_id) {
                        let profile = PROFILE_MAP.get(profile_id);
                        return (profile && PROFILE_MAP.delete(profile_id), profile);
                    }),
                    (exports.validateProfileChunk = function (chunk) {
                        try {
                            if (!chunk || "object" != typeof chunk) return { reason: "chunk is not an object" };
                            let isHex32 = (val) => "string" == typeof val && /^[a-f0-9]{32}$/.test(val);
                            if (!isHex32(chunk.profiler_id)) return { reason: "missing or invalid profiler_id" };
                            if (!isHex32(chunk.chunk_id)) return { reason: "missing or invalid chunk_id" };
                            if (!chunk.client_sdk) return { reason: "missing client_sdk metadata" };
                            let profile = chunk.profile;
                            if (!profile) return { reason: "missing profile data" };
                            if (!Array.isArray(profile.frames) || !profile.frames.length) return { reason: "profile has no frames" };
                            if (!Array.isArray(profile.stacks) || !profile.stacks.length) return { reason: "profile has no stacks" };
                            if (!Array.isArray(profile.samples) || !profile.samples.length) return { reason: "profile has no samples" };
                            return { valid: !0 };
                        } catch (e) {
                            return { reason: `unknown validation error: ${e}` };
                        }
                    }));
            }