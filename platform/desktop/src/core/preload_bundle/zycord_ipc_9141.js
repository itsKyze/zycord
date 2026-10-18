9141(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let cumulativeCpuUsage, processTypeCpuUsage;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.flushDNSCache = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_DNS_CACHE);
                    }),
                    (exports.getLastCrash = getLastCrash),
                    (exports.flushCookies = flushCookies),
                    (exports.getSystemInfo = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_SYSTEM_INFO);
                    }),
                    (exports.flushStorageData = flushStorageData),
                    (exports.purgeMemory = function () {
                        electron_1.default.webFrame.clearCache();
                    }),
                    (exports.getProcessUptime = function () {
                        return process_1.default.uptime();
                    }),
                    (exports.getCurrentCPUUsagePercent = function () {
                        return totalProcessorUsagePercent;
                    }),
                    (exports.getCumulativeCPUUsage = function () {
                        return cumulativeCpuUsage;
                    }),
                    (exports.getCpuUsageElectronProcessTypeDetails = function () {
                        return processTypeCpuUsage;
                    }),
                    (exports.getCPUCoreCount = function () {
                        return cpuCoreCount;
                    }),
                    (exports.getMainArgvSync = function () {
                        return mainArgv;
                    }),
                    (exports.getUsedHeapSize = function () {
                        return process_1.default.getHeapStatistics().usedHeapSize;
                    }),
                    (exports.getHeapStats = function () {
                        return process_1.default.getHeapStatistics();
                    }),
                    (exports.getBlinkMemoryInfo = function () {
                        return process_1.default.getBlinkMemoryInfo();
                    }),
                    (exports.getPartitionAllocatorStats = function () {
                        return electron_1.default?.zycordMemoryProfiler?.getPartitionAllocatorStats?.();
                    }),
                    (exports.enablePAMemoryProfiler = function (config) {
                        electron_1.default?.zycordMemoryProfiler?.enableProfiling?.(config);
                    }),
                    (exports.disablePAMemoryProfiler = function () {
                        electron_1.default?.zycordMemoryProfiler?.disableProfiling?.();
                    }),
                    (exports.getPerfAttributedPAMemory = function () {
                        return electron_1.default?.zycordMemoryProfiler?.getTypeNameMemoryAllocated?.();
                    }),
                    (exports.getPerfAttributedPAMemoryCallstacks = function (options) {
                        return electron_1.default?.zycordMemoryProfiler?.getTypeNameMemoryCallstacks?.(options);
                    }),
                    (exports.enableProfilingV8Heap = function (options) {
                        return electron_1.default?.zycordMemoryProfiler?.enableProfilingV8Heap?.(options);
                    }),
                    (exports.disableProfilingV8Heap = function () {
                        return electron_1.default?.zycordMemoryProfiler?.disableProfilingV8Heap?.();
                    }),
                    (exports.getProfilerV8MemoryCallstacks = function () {
                        return electron_1.default?.zycordMemoryProfiler?.getProfilerV8MemoryCallstacks?.();
                    }),
                    (exports.setCrashInformation = function (crashInformation, state) {
                        ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_CRASH_INFORMATION, crashInformation, state);
                    }),
                    (exports.setMemoryInformation = function (memoryInformation) {
                        ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_MEMORY_INFORMATION, {
                            uptimeSeconds: Math.floor(process_1.default.uptime()),
                            memoryUsageKB: memoryInformation.memoryUsageKB,
                            usedJSHeapSizeKB: memoryInformation.usedJSHeapSizeKB,
                        });
                    }),
                    (exports.setCrashReason = function (reason) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_SET_CRASH_REASON, reason);
                    }),
                    (exports.getGpuProcessId = function () {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_GPU_PROCESS_ID);
                    }),
                    (exports.getSystemMetrics = function (useNativeCpuTimes = !1) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_SYSTEM_METRICS, useNativeCpuTimes);
                    }));
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    process_1 = __importDefault(__webpack_require__(932)),
                    ZycordIPC_1 = __webpack_require__(1999),
                    minidumpReader_1 = __webpack_require__(1721),
                    mainArgv = ZycordIPC_1.ZycordIPC.renderer.sendSync(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_MAIN_ARGV_SYNC),
                    totalProcessorUsagePercent = 0,
                    cpuCoreCount = os_1.default.cpus().length;
                async function getLastCrash() {
                    let lastCrash = await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_LAST_CRASH),
                        minidumpInformation =
                            lastCrash?.pendingMinidumpPath != null ? await (0, minidumpReader_1.getNewestMinidumpInformation)(lastCrash.pendingMinidumpPath) : null;
                    return {
                        date: lastCrash.date,
                        id: lastCrash.id,
                        rendererCrashReason: lastCrash.rendererCrashReason,
                        rendererCrashExitCode: lastCrash.rendererCrashExitCode,
                        minidumpInformation,
                        storedInformation: lastCrash.storedInformation,
                        lastMemoryInformation: lastCrash.lastMemoryInformation,
                        highestMemoryInformation: lastCrash.highestMemoryInformation,
                    };
                }
                async function flushCookies(callback) {
                    try {
                        (await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_COOKIES), callback());
                    } catch (err) {
                        callback(err);
                    }
                }
                async function flushStorageData(callback) {
                    try {
                        (await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_FLUSH_STORAGE_DATA), callback());
                    } catch (err) {
                        callback(err);
                    }
                }
                setInterval(() => {
                    ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.PROCESS_UTILS_GET_CPU_USAGE).then((usage) => {
                        (({ totalProcessorUsagePercent } = usage),
                            null != usage.totalCumulativeUsage && (cumulativeCpuUsage = usage.totalCumulativeUsage),
                            (processTypeCpuUsage = usage.processTypeCpuUsage));
                    });
                }, 1e3);
            }