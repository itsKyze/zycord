3736(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445),
                    fetch1 = __webpack_require__(1547);
                function promisifyRequest(request) {
                    return new Promise((resolve, reject) => {
                        ((request.oncomplete = request.onsuccess = () => resolve(request.result)), (request.onabort = request.onerror = () => reject(request.error)));
                    });
                }
                function createStore(dbName, storeName) {
                    let request = indexedDB.open(dbName);
                    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
                    let dbp = promisifyRequest(request);
                    return (callback) => dbp.then((db) => callback(db.transaction(storeName, "readwrite").objectStore(storeName)));
                }
                function keys(store) {
                    return promisifyRequest(store.getAllKeys());
                }
                function push(store, value, maxQueueSize) {
                    return store((store) =>
                        keys(store).then((keys) => {
                            if (!(keys.length >= maxQueueSize)) return (store.put(value, Math.max(...keys, 0) + 1), promisifyRequest(store.transaction));
                        }),
                    );
                }
                function unshift(store, value, maxQueueSize) {
                    return store((store) =>
                        keys(store).then((keys) => {
                            if (!(keys.length >= maxQueueSize)) return (store.put(value, Math.min(...keys, 0) - 1), promisifyRequest(store.transaction));
                        }),
                    );
                }
                function shift(store) {
                    return store((store) =>
                        keys(store).then((keys) => {
                            let firstKey = keys[0];
                            if (null != firstKey)
                                return promisifyRequest(store.get(firstKey)).then((value) => (store.delete(firstKey), promisifyRequest(store.transaction).then(() => value)));
                        }),
                    );
                }
                function createIndexedDbStore(options) {
                    let store;
                    function getStore() {
                        return (void 0 == store && (store = createStore(options.dbName || "sentry-offline", options.storeName || "queue")), store);
                    }
                    return {
                        push: async (env) => {
                            try {
                                let serialized = core.serializeEnvelope(env);
                                await push(getStore(), serialized, options.maxQueueSize || 30);
                            } catch {}
                        },
                        unshift: async (env) => {
                            try {
                                let serialized = core.serializeEnvelope(env);
                                await unshift(getStore(), serialized, options.maxQueueSize || 30);
                            } catch {}
                        },
                        shift: async () => {
                            try {
                                let deserialized = await shift(getStore());
                                if (deserialized) return core.parseEnvelope(deserialized);
                            } catch {}
                        },
                    };
                }
                ((exports.createStore = createStore),
                    (exports.makeBrowserOfflineTransport = function (createTransport = fetch1.makeFetchTransport) {
                        var createTransport1;
                        return (
                            (createTransport1 = core.makeOfflineTransport(createTransport)),
                            (options) => {
                                let transport = createTransport1({ ...options, createStore: createIndexedDbStore });
                                return (
                                    helpers.WINDOW.addEventListener("online", async (_) => {
                                        await transport.flush();
                                    }),
                                    transport
                                );
                            }
                        );
                    }),
                    (exports.push = push),
                    (exports.shift = shift),
                    (exports.unshift = unshift));
            }