9164(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = class {
                        min;
                        max;
                        jitter;
                        _current;
                        _timeoutId;
                        _fails;
                        constructor(min = 500, max = null, jitter = !0) {
                            ((this.min = min),
                                (this.max = null != max ? max : 10 * min),
                                (this.jitter = jitter),
                                (this._current = min),
                                (this._timeoutId = null),
                                (this._fails = 0));
                        }
                        get fails() {
                            return this._fails;
                        }
                        get current() {
                            return this._current;
                        }
                        get pending() {
                            return null != this._timeoutId;
                        }
                        succeed() {
                            (this.cancel(), (this._fails = 0), (this._current = this.min));
                        }
                        fail(callback) {
                            this._fails += 1;
                            let delay = 2 * this._current;
                            if ((this.jitter && (delay *= Math.random()), (this._current = Math.min(this._current + delay, this.max)), null != callback)) {
                                if (null != this._timeoutId) throw Error("callback already pending");
                                this._timeoutId = setTimeout(() => {
                                    try {
                                        null != callback && callback();
                                    } finally {
                                        this._timeoutId = null;
                                    }
                                }, this._current);
                            }
                            return this._current;
                        }
                        cancel() {
                            null != this._timeoutId && (clearTimeout(this._timeoutId), (this._timeoutId = null));
                        }
                    }));
            }