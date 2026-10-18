1086(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugLogger = __webpack_require__(2533),
                    _exports = __webpack_require__(6082),
                    debugBuild = __webpack_require__(3695),
                    utils = __webpack_require__(6879),
                    object = __webpack_require__(4204),
                    patchLayer = __webpack_require__(7908),
                    setSdkProcessingMetadata = __webpack_require__(3061),
                    didLegacyDeprecationWarning = !1;
                function expressErrorHandler(options) {
                    return function (error, request, res, next) {
                        (setSdkProcessingMetadata.setSDKProcessingMetadata(request),
                            (options?.shouldHandleError || utils.defaultShouldHandleError)(error) &&
                                (res.sentry = _exports.captureException(error, { mechanism: { type: "auto.middleware.express", handled: !1 } })),
                            next(error));
                    };
                }
                ((exports.expressErrorHandler = expressErrorHandler),
                    (exports.patchExpressModule = function (optionsOrExports, maybeGetOptions) {
                        let getOptions, moduleExports, express;
                        if (maybeGetOptions || !optionsOrExports.express)
                            if ("function" != typeof maybeGetOptions) throw TypeError("`patchExpressModule(moduleExports, getOptions)` requires a `getOptions` callback");
                            else ((getOptions = maybeGetOptions), (moduleExports = optionsOrExports));
                        else {
                            let { express, ...options } = optionsOrExports;
                            ((moduleExports = express),
                                (getOptions = () => options),
                                !didLegacyDeprecationWarning &&
                                    ((didLegacyDeprecationWarning = !0),
                                    debugBuild.DEBUG_BUILD &&
                                        debugLogger.debug.warn(
                                            "[Express] `patchExpressModule(options)` is deprecated. Use `patchExpressModule(moduleExports, getOptions)` instead.",
                                        )));
                        }
                        let express1 = ((express = moduleExports), utils.hasDefaultProp(express) ? express.default : express),
                            routerProto = utils.isExpressWithRouterPrototype(express1)
                                ? express1.Router.prototype
                                : utils.isExpressWithoutRouterPrototype(express1)
                                  ? express1.Router
                                  : void 0;
                        if (!routerProto) throw TypeError("no valid Express route function to instrument");
                        let originalRouteMethod = routerProto.route;
                        try {
                            object.wrapMethod(routerProto, "route", function (...args) {
                                let route = originalRouteMethod.apply(this, args),
                                    layer = this.stack[this.stack.length - 1];
                                return (patchLayer.patchLayer(getOptions, layer, utils.getLayerPath(args)), route);
                            });
                        } catch (e) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Failed to patch express route method:", e);
                        }
                        let originalRouterUse = routerProto.use;
                        try {
                            object.wrapMethod(routerProto, "use", function (...args) {
                                let route = originalRouterUse.apply(this, args),
                                    layer = this.stack[this.stack.length - 1];
                                return (layer && patchLayer.patchLayer(getOptions, layer, utils.getLayerPath(args)), route);
                            });
                        } catch (e) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Failed to patch express use method:", e);
                        }
                        let { application } = express1,
                            originalApplicationUse = application.use;
                        try {
                            object.wrapMethod(application, "use", function (...args) {
                                let route = originalApplicationUse.apply(this, args),
                                    router = utils.isExpressWithRouterPrototype(express1) ? this.router : this._router;
                                if (router) {
                                    let layer = router.stack[router.stack.length - 1];
                                    layer && patchLayer.patchLayer(getOptions, layer, utils.getLayerPath(args));
                                }
                                return route;
                            });
                        } catch (e) {
                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Failed to patch express application.use method:", e);
                        }
                        return express1;
                    }),
                    (exports.setupExpressErrorHandler = function (app, options) {
                        (app.use(function (request, _res, next) {
                            (setSdkProcessingMetadata.setSDKProcessingMetadata(request), next());
                        }),
                            app.use(expressErrorHandler(options)));
                    }));
            }