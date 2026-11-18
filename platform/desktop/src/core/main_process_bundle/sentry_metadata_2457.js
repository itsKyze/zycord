2457(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.metadata = void 0),
                    (exports.init = function (buildInfo, sentry) {
                        var releaseChannel;
                        let processUtils;
                        if (initialized) return void console.warn("Ignoring double initialization of crash reporter.");
                        if ("true" === process.env.ELECTRON_ENABLE_STACK_DUMPING)
                            return void console.warn("Not initializing crash reporter because ELECTRON_ENABLE_STACK_DUMPING is set.");
                        (null != sentry &&
                            ((defaultDsn = getSentryDSN(buildInfo.releaseChannel)),
                            sentry.sentry.init({
                                dsn: getSentryDSN(buildInfo.releaseChannel),
                                transport: sentry.getTransport(dsnFromUser),
                                environment: buildInfo.releaseChannel,
                                release: buildInfo.sentryRelease ?? buildInfo.version,
                                dist: buildInfo.sentryDist,
                                sampleRate:
                                    ((releaseChannel = buildInfo.releaseChannel),
                                    (processUtils = __webpack_require__(5468)).IS_LINUX || processUtils.IS_OSX
                                        ? 1
                                        : null != releaseChannel && null != CHANNEL_SENTRY_SAMPLE[releaseChannel]
                                          ? CHANNEL_SENTRY_SAMPLE[releaseChannel]
                                          : 0.01),
                                skipOpenTelemetrySetup: !0,
                                integrations: (defaults) => defaults.filter((i) => "MainProcessSession" !== i.name && "BrowserSession" !== i.name),
                                maxValueLength: 250,
                                beforeSend(event, hint) {
                                    event.extra = exports.metadata;
                                    let minidump = hint?.attachments?.find((attachment) => "event.minidump" === attachment.attachmentType);
                                    if (null != minidump && minidump.data instanceof Uint8Array)
                                        try {
                                            let codeIntegrityStream = __webpack_require__(5264),
                                                codeIntegrity = codeIntegrityStream.findCodeIntegrityInMinidump(minidump.data);
                                            ((event.tags = { ...event.tags, ...codeIntegrityStream.codeIntegritySentryTags(codeIntegrity) }),
                                                null != codeIntegrity &&
                                                    (event.contexts = { ...event.contexts, code_integrity: codeIntegrityStream.codeIntegritySentryContext(codeIntegrity) }));
                                        } catch (e) {
                                            console.warn("Failed to read code integrity from minidump", e);
                                        }
                                    return (__webpack_require__(1598).addSentryReport(event), event);
                                },
                                ignoreErrors: [
                                    "EADDRINUSE",
                                    "ResizeObserver loop limit exceeded",
                                    "ResizeObserver loop completed with undelivered notifications.",
                                    "EACCES: permission denied",
                                    "BetterZycord",
                                    "VencordPatcher",
                                    "mwittrien.github.io",
                                    "Error: getaddrinfo ENOTFOUND raw.githubusercontent.com",
                                ],
                                denyUrls: [/BetterZycord:\/\//],
                            }),
                            (gSentry = sentry.sentry)),
                            (exports.metadata.release_channel = buildInfo.releaseChannel));
                        let sentryMetadata = null != exports.metadata.sentry ? exports.metadata.sentry : {};
                        if (
                            ((sentryMetadata.environment = buildInfo.releaseChannel),
                            (sentryMetadata.release = buildInfo.sentryRelease ?? buildInfo.version),
                            null != buildInfo.sentryDist && (sentryMetadata.dist = buildInfo.sentryDist),
                            (exports.metadata.sentry = sentryMetadata),
                            __webpack_require__(5468).IS_LINUX)
                        ) {
                            let xdgCurrentDesktop = process.env.XDG_CURRENT_DESKTOP ?? "unknown",
                                gdmSession = process.env.GDMSESSION ?? "unknown";
                            exports.metadata.wm = `${xdgCurrentDesktop},${gdmSession}`;
                            let runtimeEnvironment = "native";
                            (null != process.env.FLATPAK_ID
                                ? (runtimeEnvironment = "flatpak")
                                : null != process.env.SNAP || null != process.env.SNAP_NAME
                                  ? (runtimeEnvironment = "snap")
                                  : (null != process.env.APPIMAGE || null != process.env.APPDIR) && (runtimeEnvironment = "appimage"),
                                (exports.metadata.runtime_environment = runtimeEnvironment));
                            let displayServer = "unknown";
                            (null != process.env.XDG_SESSION_TYPE && (displayServer = process.env.XDG_SESSION_TYPE), (exports.metadata.display_server = displayServer));
                            try {
                                let childProcess = __webpack_require__(1421);
                                exports.metadata.distro = childProcess.execFileSync("lsb_release", ["-ds"], { timeout: 100, maxBuffer: 512, encoding: "utf-8" }).trim();
                            } catch (_) {
                                try {
                                    let prettyNameMatch = fs_1.default.readFileSync("/etc/os-release", "utf-8").match(/^PRETTY_NAME="?([^"\n]+)"?$/m);
                                    null != prettyNameMatch && (exports.metadata.distro = prettyNameMatch[1]);
                                } catch (_) {}
                            }
                        }
                        initialized = !0;
                    }),
                    (exports.isInitialized = function () {
                        return initialized;
                    }),
                    (exports.getGlobalSentry = function () {
                        return gSentry;
                    }));
                let fs_1 = __importDefault(__webpack_require__(9896)),
                    gSentry = null,
                    initialized = !1;
                exports.metadata = {};
                let TEST_SENTRY_DSN_KEY = "1a27a96457b24ff286a000266c573919",
                    DEFAULT_SENTRY_DSN = buildSentryDSN("384ce4413de74fe0be270abe03b2b35a"),
                    CHANNEL_SENTRY_DSN = {
                        stable: buildSentryDSN("7a60c374cb0e99ac8a57388db6933711"),
                        ptb: buildSentryDSN(TEST_SENTRY_DSN_KEY),
                        canary: buildSentryDSN(TEST_SENTRY_DSN_KEY),
                        development: buildSentryDSN(TEST_SENTRY_DSN_KEY),
                    },
                    CHANNEL_SENTRY_SAMPLE = { stable: 0.01, ptb: 1, canary: 1, development: 1 },
                    defaultDsn = DEFAULT_SENTRY_DSN;
                function dsnFromUser({ getEvent }) {
                    let event = getEvent();
                    return event?.tags?.isStaff === "true" ? [buildSentryDSN("de156ff7a3f544cca369e77e3f1f5743")] : [defaultDsn];
                }
                function buildSentryDSN(dsnKey) {
                    return "https://" + dsnKey + "@o64374.ingest.sentry.io/146342";
                }
                function getSentryDSN(releaseChannel) {
                    let processUtils = __webpack_require__(5468);
                    return processUtils.IS_LINUX
                        ? buildSentryDSN("d2558f321dfc7ab68366d8258fd256c7")
                        : processUtils.IS_OSX
                          ? buildSentryDSN("098008bd74508d75b72f31244ddb1d04")
                          : null != releaseChannel && null != CHANNEL_SENTRY_DSN[releaseChannel]
                            ? CHANNEL_SENTRY_DSN[releaseChannel]
                            : DEFAULT_SENTRY_DSN;
                }
            }