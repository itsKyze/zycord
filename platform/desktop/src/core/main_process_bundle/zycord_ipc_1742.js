1742(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    fs_1 = __importDefault(__webpack_require__(9896)),
                    os_1 = __importDefault(__webpack_require__(857)),
                    path_1 = __importDefault(__webpack_require__(6928)),
                    appFeatures_1 = __webpack_require__(5976),
                    ZycordIPC_1 = __webpack_require__(1999),
                    TRACE_CATEGORIES = ["toplevel", "v8", "blink", "blink.user_timing", "cc", "gpu", "ipc", "benchmark"],
                    isRecording = !1;
                (ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.TRACING_CAPTURE_PERFORMANCE, async (_event, options) => {
                    if (isRecording) throw Error("TRACE_ALREADY_RECORDING");
                    isRecording = !0;
                    let tracePath = path_1.default.join(os_1.default.tmpdir(), `zycord-trace-${Date.now()}.json`);
                    try {
                        let durationMs = Math.min(Math.max(options?.durationMs ?? 3e4, 1e3), 6e4),
                            startedAtISO = new Date().toISOString();
                        await electron_1.default.contentTracing.startRecording({
                            included_categories: TRACE_CATEGORIES,
                            recording_mode: "record-continuously",
                            trace_buffer_size_in_kb: 65536,
                        });
                        try {
                            await new Promise((resolve) => setTimeout(resolve, durationMs));
                        } finally {
                            await electron_1.default.contentTracing.stopRecording(tracePath);
                        }
                        return { traceBytes: await fs_1.default.promises.readFile(tracePath), startedAtISO, durationMs, categories: TRACE_CATEGORIES };
                    } finally {
                        ((isRecording = !1), fs_1.default.promises.unlink(tracePath).catch(() => {}));
                    }
                }),
                    (0, appFeatures_1.getFeatures)().declareSupported("performance_trace"));
            }