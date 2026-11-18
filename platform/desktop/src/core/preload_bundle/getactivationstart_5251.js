5251(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let getNavigationEntry = __webpack_require__(9549);
                exports.getActivationStart = () => {
                    let navEntry = getNavigationEntry.getNavigationEntry();
                    return navEntry?.activationStart ?? 0;
                };
            }