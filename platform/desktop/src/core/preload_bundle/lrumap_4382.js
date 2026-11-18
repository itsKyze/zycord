4382(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.LRUMap = class {
                        constructor(_maxSize) {
                            ((this._maxSize = _maxSize), (this._cache = new Map()));
                        }
                        get size() {
                            return this._cache.size;
                        }
                        get(key) {
                            let value = this._cache.get(key);
                            if (void 0 !== value) return (this._cache.delete(key), this._cache.set(key, value), value);
                        }
                        set(key, value) {
                            if (this._cache.size >= this._maxSize) {
                                let nextKey = this._cache.keys().next().value;
                                this._cache.delete(nextKey);
                            }
                            this._cache.set(key, value);
                        }
                        remove(key) {
                            let value = this._cache.get(key);
                            return (value && this._cache.delete(key), value);
                        }
                        clear() {
                            this._cache.clear();
                        }
                        keys() {
                            return Array.from(this._cache.keys());
                        }
                        values() {
                            let values = [];
                            return (this._cache.forEach((value) => values.push(value)), values);
                        }
                    }));
            }