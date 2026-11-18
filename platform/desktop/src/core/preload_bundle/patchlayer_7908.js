7908(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470),
                    spanstatus = __webpack_require__(2232),
                    object = __webpack_require__(4204),
                    currentScopes = __webpack_require__(7121),
                    trace = __webpack_require__(6833),
                    requestLayerStore = __webpack_require__(8751),
                    types = __webpack_require__(8083),
                    utils = __webpack_require__(6879),
                    defaultScopes = __webpack_require__(4197),
                    setSdkProcessingMetadata = __webpack_require__(3061);
                exports.patchLayer = function (getOptions, maybeLayer, layerPath) {
                    if (!maybeLayer?.handle) return;
                    let layerHandleOriginal = maybeLayer.handle;
                    if (!object.getOriginalFunction(layerHandleOriginal) && 4 !== layerHandleOriginal.length) {
                        for (let key in layerHandleOriginal)
                            key in layerHandlePatched ||
                                Object.defineProperty(layerHandlePatched, key, {
                                    get: () => layerHandleOriginal[key],
                                    set(value) {
                                        layerHandleOriginal[key] = value;
                                    },
                                });
                        (object.markFunctionWrapped(layerHandlePatched, layerHandleOriginal),
                            Object.defineProperty(maybeLayer, "handle", { enumerable: !0, configurable: !0, writable: !0, value: layerHandlePatched }));
                    }
                    function layerHandlePatched(req, res, ...otherArgs) {
                        let options = getOptions();
                        setSdkProcessingMetadata.setSDKProcessingMetadata(req);
                        let parentSpan = spanUtils.getActiveSpan();
                        if (!parentSpan) return layerHandleOriginal.apply(this, [req, res, ...otherArgs]);
                        layerPath && requestLayerStore.storeLayer(req, layerPath);
                        let storedLayers = requestLayerStore.getStoredLayers(req),
                            isLayerPathStored = !!layerPath,
                            constructedRoute = utils.getConstructedRoute(req),
                            actualMatchedRoute = utils.getActualMatchedRoute(req, constructedRoute);
                        options.onRouteResolved?.(actualMatchedRoute);
                        let metadata = utils.getLayerMetadata(constructedRoute, maybeLayer, layerPath),
                            name = metadata.attributes[types.ATTR_EXPRESS_NAME],
                            type = metadata.attributes[types.ATTR_EXPRESS_TYPE],
                            attributes = Object.assign(metadata.attributes, {
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.express",
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.express`,
                            });
                        if (
                            (actualMatchedRoute && (attributes[types.ATTR_HTTP_ROUTE] = actualMatchedRoute),
                            utils.isLayerIgnored(metadata.attributes[types.ATTR_EXPRESS_NAME], type, options))
                        )
                            return (isLayerPathStored && storedLayers.pop(), layerHandleOriginal.apply(this, [req, res, ...otherArgs]));
                        let currentScope = currentScopes.getIsolationScope();
                        if (currentScope !== defaultScopes.getDefaultIsolationScope()) {
                            if ("request_handler" === type) {
                                let method = req.method ? req.method.toUpperCase() : "GET";
                                currentScope.setTransactionName(`${method} ${constructedRoute}`);
                            }
                        } else debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Isolation scope is still default isolation scope - skipping setting transactionName");
                        return trace.startSpanManual({ name, attributes }, (span) => {
                            let spanHasEnded = !1;
                            metadata.attributes[types.ATTR_EXPRESS_TYPE] === types.ExpressLayerType_ROUTER && (span.end(), (spanHasEnded = !0));
                            let onResponseFinish = () => {
                                spanHasEnded || ((spanHasEnded = !0), span.end());
                            };
                            for (let i = 0; i < otherArgs.length; i++) {
                                let callback = otherArgs[i];
                                if ("function" == typeof callback) {
                                    otherArgs[i] = function (...args) {
                                        let maybeError = args[0],
                                            isError = !!maybeError && "route" !== maybeError && "router" !== maybeError;
                                        if (!spanHasEnded && isError) {
                                            let [_, message] = utils.asErrorAndMessage(maybeError);
                                            span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message });
                                        }
                                        return (
                                            spanHasEnded || ((spanHasEnded = !0), res.removeListener("finish", onResponseFinish), span.end()),
                                            !(req.route && isError) && isLayerPathStored && storedLayers.pop(),
                                            trace.withActiveSpan(parentSpan, () => callback.apply(this, args))
                                        );
                                    };
                                    break;
                                }
                            }
                            try {
                                return layerHandleOriginal.apply(this, [req, res, ...otherArgs]);
                            } catch (anyError) {
                                let [_, message] = utils.asErrorAndMessage(anyError);
                                throw (span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message }), anyError);
                            } finally {
                                spanHasEnded || res.once("finish", onResponseFinish);
                            }
                        });
                    }
                };
            }