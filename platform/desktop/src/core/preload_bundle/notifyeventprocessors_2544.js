2544(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    syncpromise = __webpack_require__(4335);
                exports.notifyEventProcessors = function (processors, event, hint, index = 0) {
                    try {
                        let result = (function _notifyEventProcessors(event, hint, processors, index) {
                            let processor = processors[index];
                            if (!event || !processor) return event;
                            let result = processor({ ...event }, hint);
                            return (debugBuild.DEBUG_BUILD && null === result && debugLogger.debug.log(`Event processor "${processor.id || "?"}" dropped event`),
                            is.isThenable(result))
                                ? result.then((final) => _notifyEventProcessors(final, hint, processors, index + 1))
                                : _notifyEventProcessors(result, hint, processors, index + 1);
                        })(event, hint, processors, index);
                        return is.isThenable(result) ? result : syncpromise.resolvedSyncPromise(result);
                    } catch (error) {
                        return syncpromise.rejectedSyncPromise(error);
                    }
                };
            }