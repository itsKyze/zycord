9984(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.processUtilsSettings = void 0));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    process_1 = __importDefault(__webpack_require__(932)),
                    paths_1 = __webpack_require__(822),
                    ZycordIPC_1 = __webpack_require__(1999);
                exports.processUtilsSettings = {
                    rendererCrashReason: null,
                    rendererCrashExitCode: null,
                    lastRunsStoredInformation: {},
                    currentStoredInformation: {},
                    lastMemoryInformation: null,
                    highestMemoryInformation: null,
                };
                let usageOffset = 0,
                    lastUsage = 0,
                    cpuCoreCount = os_1.default.cpus().length,
                    lastClipsCumulativeSeconds = 0,
                    lastClipsSampleTimeMs = 0;
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_CPU_USAGE, (_) => {
                    let totalCumulativeUsage,
                        totalProcessorUsagePercent = 0,
                        sampleTime = performance.now(),
                        processTypeCpuUsage = {};
                    function addToBucket(bucket, percent) {
                        let existing = processTypeCpuUsage[bucket];
                        void 0 === existing
                            ? (processTypeCpuUsage[bucket] = { percent_cpu: percent, proc_count: 1 })
                            : ((existing.percent_cpu += percent), (existing.proc_count += 1));
                    }
                    for (let processMetric of electron_1.default.app.getAppMetrics()) {
                        ((totalProcessorUsagePercent += processMetric.cpu.percentCPUUsage),
                            addToBucket(
                                (function (type) {
                                    switch (type) {
                                        case "Browser":
                                            return "main";
                                        case "Tab":
                                            return "renderer";
                                        case "GPU":
                                            return "gpu";
                                        case "Utility":
                                        case "Zygote":
                                        case "Sandbox helper":
                                        case "Pepper Plugin":
                                        case "Pepper Plugin Broker":
                                            return "utility";
                                        default:
                                            return "unknown";
                                    }
                                })(processMetric.type),
                                processMetric.cpu.percentCPUUsage,
                            ));
                        let cpu = processMetric.cpu;
                        void 0 !== cpu.cumulativeCPUUsage &&
                            (void 0 === totalCumulativeUsage && (totalCumulativeUsage = { usage: 0, sampleTime }),
                            (totalCumulativeUsage.usage += cpu.cumulativeCPUUsage / cpuCoreCount));
                    }
                    let clipsCumulativeSeconds = (function () {
                        try {
                            let zycordUtils = __webpack_require__(4928);
                            return Number(zycordUtils.getZycordClipsCumulativeCpuUsage?.() ?? 0);
                        } catch (error) {
                            return (console.error("zycord_clips cumulative CPU query failed:", error), 0);
                        }
                    })();
                    if (clipsCumulativeSeconds > 0) {
                        if (
                            (void 0 === totalCumulativeUsage && (totalCumulativeUsage = { usage: 0, sampleTime }),
                            (totalCumulativeUsage.usage += clipsCumulativeSeconds / cpuCoreCount),
                            lastClipsSampleTimeMs > 0 && clipsCumulativeSeconds >= lastClipsCumulativeSeconds)
                        ) {
                            let wallSeconds = (sampleTime - lastClipsSampleTimeMs) / 1e3;
                            if (wallSeconds > 0) {
                                let clipsPercent = (100 * (clipsCumulativeSeconds - lastClipsCumulativeSeconds)) / (wallSeconds * cpuCoreCount);
                                ((totalProcessorUsagePercent += clipsPercent), addToBucket("clips", clipsPercent));
                            }
                        }
                        ((lastClipsCumulativeSeconds = clipsCumulativeSeconds), (lastClipsSampleTimeMs = sampleTime));
                    } else ((lastClipsCumulativeSeconds = 0), (lastClipsSampleTimeMs = 0));
                    return (
                        null != totalCumulativeUsage &&
                            (totalCumulativeUsage.usage < lastUsage && (usageOffset = totalCumulativeUsage.usage - lastUsage),
                            (lastUsage = totalCumulativeUsage.usage),
                            (totalCumulativeUsage.usage += usageOffset)),
                        Promise.resolve({ totalProcessorUsagePercent, totalCumulativeUsage, processTypeCpuUsage })
                    );
                }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_LAST_CRASH, async (_) => {
                        let lastCrashReport = electron_1.default.crashReporter.getLastCrashReport(),
                            pendingMinidumpPath = null,
                            moduleDataPath1 = paths_1.paths.getModuleDataPath();
                        if (null != moduleDataPath1) {
                            let crashlogsPath = path_1.default.join(moduleDataPath1, "crashlogs"),
                                sentinelPath = path_1.default.join(crashlogsPath, "pending_minidump.txt");
                            try {
                                let filename = (await fs_1.default.promises.readFile(sentinelPath, "utf-8")).trim();
                                filename.length > 0 && ((pendingMinidumpPath = path_1.default.join(crashlogsPath, filename)), await fs_1.default.promises.unlink(sentinelPath));
                            } catch {}
                        }
                        return {
                            date: lastCrashReport?.date ?? null,
                            id: lastCrashReport?.id ?? null,
                            rendererCrashReason: exports.processUtilsSettings.rendererCrashReason,
                            rendererCrashExitCode: exports.processUtilsSettings.rendererCrashExitCode,
                            storedInformation: exports.processUtilsSettings.lastRunsStoredInformation,
                            lastMemoryInformation: exports.processUtilsSettings.lastMemoryInformation,
                            highestMemoryInformation: exports.processUtilsSettings.highestMemoryInformation,
                            pendingMinidumpPath,
                        };
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_SYSTEM_INFO, async (_) => {
                        let gpuInfo;
                        try {
                            gpuInfo = await electron_1.default.app.getGPUInfo("basic");
                        } catch (e) {
                            console.warn("getGPUInfo failed; omitting GPU info from system info: ", e);
                        }
                        return {
                            cpus: os_1.default.cpus().map((cpu) => ({ model: cpu.model, speed: cpu.speed })),
                            gpus: [],
                            electronGPUInfo: gpuInfo,
                            total_memory: os_1.default.totalmem(),
                        };
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_DNS_CACHE, (_) => {
                        let defaultSession = electron_1.default.session.defaultSession;
                        return null != defaultSession && null != defaultSession.clearHostResolverCache ? defaultSession.clearHostResolverCache() : Promise.resolve();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_COOKIES, (_) => electron_1.default.session.defaultSession.cookies.flushStore()),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_STORAGE_DATA,
                        (_) => (electron_1.default.session.defaultSession.flushStorageData(), Promise.resolve()),
                    ),
                    ZycordIPC_1.ZycordIPC.main.on(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_MAIN_ARGV_SYNC, (event) => {
                        event.returnValue = process_1.default.argv;
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_CRASH_INFORMATION,
                        (_, crashInformation, state) => ((exports.processUtilsSettings.currentStoredInformation[crashInformation] = state), Promise.resolve()),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_MEMORY_INFORMATION, (_, memoryInformation) => {
                        exports.processUtilsSettings.lastMemoryInformation = memoryInformation;
                        let highest = exports.processUtilsSettings.highestMemoryInformation;
                        return (
                            (null == highest || highest.memoryUsageKB < memoryInformation.memoryUsageKB) &&
                                (exports.processUtilsSettings.highestMemoryInformation = memoryInformation),
                            Promise.resolve()
                        );
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(
                        ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_CRASH_REASON,
                        (_, reason) => ((exports.processUtilsSettings.rendererCrashReason = reason), (exports.processUtilsSettings.rendererCrashExitCode = 1), Promise.resolve()),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_SYSTEM_METRICS, (_, useNativeCpuTimes = !1) => {
                        let { cpuTotalTick, cpuTotalIdle } = (function (useNativeCpuTimes) {
                            if (useNativeCpuTimes && "win32" === process_1.default.platform)
                                try {
                                    let zycordUtils = __webpack_require__(4928),
                                        times = zycordUtils.getSystemCpuTimes?.();
                                    if (null != times) return times;
                                } catch (error) {
                                    console.error("System CPU times query failed:", error);
                                }
                            let cpus = os_1.default.cpus(),
                                totalIdle = 0,
                                totalTick = 0;
                            for (let cpu of cpus) {
                                for (let type of Object.values(cpu.times)) totalTick += type;
                                totalIdle += cpu.times.idle;
                            }
                            return { cpuTotalTick: totalTick, cpuTotalIdle: totalIdle };
                        })(!0 === useNativeCpuTimes);
                        return Promise.resolve({ cpuTotalTick, cpuTotalIdle, memoryTotal: os_1.default.totalmem(), memoryFree: os_1.default.freemem() });
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_GPU_PROCESS_ID, (_) => {
                        for (let processMetric of electron_1.default.app.getAppMetrics()) if ("GPU" === processMetric.type) return Promise.resolve(processMetric.pid);
                        return Promise.resolve(null);
                    }));
            }