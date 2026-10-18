8751(__unused_rspack_module, exports) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let requestLayerStore = new WeakMap();
                ((exports.getStoredLayers = (req) => {
                    let store = requestLayerStore.get(req);
                    return (store || ((store = []), requestLayerStore.set(req, store)), store);
                }),
                    (exports.storeLayer = (req, layer) => {
                        let store = requestLayerStore.get(req);
                        store ? store.push(layer) : requestLayerStore.set(req, [layer]);
                    }));
            }