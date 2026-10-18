9645(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                exports.reportPageLoaded = function (client = core.getClient()) {
                    client?.emit("endPageloadSpan");
                };
            }