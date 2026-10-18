3061(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    request = __webpack_require__(8338);
                exports.setSDKProcessingMetadata = function (request$1) {
                    let sdkProcMeta = currentScopes.getIsolationScope()?.getScopeData()?.sdkProcessingMetadata;
                    if (!sdkProcMeta?.normalizedRequest) {
                        let normalizedRequest = request.httpRequestToRequestData(request$1);
                        currentScopes.getIsolationScope().setSDKProcessingMetadata({ normalizedRequest });
                    }
                };
            }