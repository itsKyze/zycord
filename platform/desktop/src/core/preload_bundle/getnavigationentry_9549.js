9549(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let types = __webpack_require__(3863);
                exports.getNavigationEntry = (checkResponseStart = !0) => {
                    let navigationEntry = types.WINDOW.performance?.getEntriesByType?.("navigation")[0];
                    if (!checkResponseStart || (navigationEntry && navigationEntry.responseStart > 0 && navigationEntry.responseStart < performance.now())) return navigationEntry;
                };
            }