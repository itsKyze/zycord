9150(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let traceData = __webpack_require__(5386);
                exports.getTraceMetaTags = function (traceData$1) {
                    return Object.entries(traceData$1 || traceData.getTraceData())
                        .map(([key, value]) => `<meta name="${key}" content="${value}"/>`)
                        .join("\n");
                };
            }