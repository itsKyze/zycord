2946(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                class LayoutShiftManager {
                    constructor() {
                        (LayoutShiftManager.prototype.__init.call(this), LayoutShiftManager.prototype.__init2.call(this));
                    }
                    __init() {
                        this._sessionValue = 0;
                    }
                    __init2() {
                        this._sessionEntries = [];
                    }
                    _processEntry(entry) {
                        if (entry.hadRecentInput) return;
                        let firstSessionEntry = this._sessionEntries[0],
                            lastSessionEntry = this._sessionEntries[this._sessionEntries.length - 1];
                        (this._sessionValue &&
                        firstSessionEntry &&
                        lastSessionEntry &&
                        entry.startTime - lastSessionEntry.startTime < 1e3 &&
                        entry.startTime - firstSessionEntry.startTime < 5e3
                            ? ((this._sessionValue += entry.value), this._sessionEntries.push(entry))
                            : ((this._sessionValue = entry.value), (this._sessionEntries = [entry])),
                            this._onAfterProcessingUnexpectedShift?.(entry));
                    }
                }
                exports.LayoutShiftManager = LayoutShiftManager;
            }