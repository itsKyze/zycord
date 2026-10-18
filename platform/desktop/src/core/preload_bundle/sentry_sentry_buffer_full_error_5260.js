5260(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let syncpromise = __webpack_require__(4335),
                    timer = __webpack_require__(90),
                    SENTRY_BUFFER_FULL_ERROR = Symbol.for("SentryBufferFullError");
                ((exports.SENTRY_BUFFER_FULL_ERROR = SENTRY_BUFFER_FULL_ERROR),
                    (exports.makePromiseBuffer = function (limit = 100) {
                        let buffer = new Set();
                        return {
                            get $() {
                                return Array.from(buffer);
                            },
                            add: function (taskProducer) {
                                if (!(buffer.size < limit)) return syncpromise.rejectedSyncPromise(SENTRY_BUFFER_FULL_ERROR);
                                let task = taskProducer();
                                return (
                                    buffer.add(task),
                                    task.then(
                                        () => {
                                            buffer.delete(task);
                                        },
                                        () => {
                                            buffer.delete(task);
                                        },
                                    ),
                                    task
                                );
                            },
                            drain: function (timeout) {
                                if (!buffer.size) return syncpromise.resolvedSyncPromise(!0);
                                let drainPromise = Promise.allSettled(Array.from(buffer)).then(() => !0);
                                return timeout ? Promise.race([drainPromise, new Promise((resolve) => timer.safeUnref(setTimeout(() => resolve(!1), timeout)))]) : drainPromise;
                            },
                        };
                    }));
            }