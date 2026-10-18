6879(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let requestLayerStore = __webpack_require__(8751),
                    types = __webpack_require__(8083),
                    string = __webpack_require__(2634);
                function isRoutePattern(route) {
                    return route.includes(":") || route.includes("*");
                }
                let getRouterPath = (path, layer) => {
                        let stackLayer = Array.isArray(layer.handle?.stack) ? layer.handle?.stack?.[0] : void 0;
                        return stackLayer?.route?.path
                            ? `${path}${stackLayer.route.path}`
                            : stackLayer && Array.isArray(stackLayer?.handle?.stack)
                              ? getRouterPath(path, stackLayer)
                              : path;
                    },
                    extractLayerPathSegment = (arg) => ("string" == typeof arg ? arg : arg instanceof RegExp || "number" == typeof arg ? String(arg) : void 0),
                    isExpressWithRouterPrototype = (express) => isExpressRouterPrototype(express?.Router?.prototype),
                    isExpressRouterPrototype = (routerProto) =>
                        ("object" == typeof routerProto || "function" == typeof routerProto) && !!routerProto && "route" in routerProto && "function" == typeof routerProto.route;
                ((exports.asErrorAndMessage = (error) => (error instanceof Error ? [error, error.message] : [String(error), String(error)])),
                    (exports.defaultShouldHandleError = function (error) {
                        let statusCode;
                        return ((statusCode = error.status || error.statusCode || error.status_code || error.output?.statusCode) ? parseInt(statusCode, 10) : 500) >= 500;
                    }),
                    (exports.getActualMatchedRoute = function (req, constructedRoute) {
                        let layersStore = requestLayerStore.getStoredLayers(req);
                        if (0 === layersStore.length) return;
                        if (layersStore.every((path) => "/" === path)) return "/" === req.originalUrl ? "/" : void 0;
                        if (
                            "*" === constructedRoute ||
                            (constructedRoute.includes("/") &&
                                (constructedRoute.includes(",") || constructedRoute.includes("\\") || constructedRoute.includes("*") || constructedRoute.includes("[")))
                        )
                            return constructedRoute;
                        let normalizedRoute = constructedRoute.startsWith("/") ? constructedRoute : `/${constructedRoute}`;
                        return normalizedRoute.length > 0 && (req.originalUrl === normalizedRoute || req.originalUrl.startsWith(normalizedRoute) || isRoutePattern(normalizedRoute))
                            ? normalizedRoute
                            : void 0;
                    }),
                    (exports.getConstructedRoute = function (req) {
                        let layersStore = requestLayerStore.getStoredLayers(req),
                            constructedRoute = "";
                        for (let path of layersStore)
                            "/" !== path && "/*" !== path && (constructedRoute += !constructedRoute || constructedRoute.endsWith("/") ? path : `/${path}`);
                        return constructedRoute.replace(/\/{2,}/g, "/");
                    }),
                    (exports.getLayerMetadata = (route, layer, layerPath) => {
                        if ("router" === layer.name) {
                            let extractedRouterPath = getRouterPath("", layer) || layerPath || route || "/";
                            return {
                                attributes: { [types.ATTR_EXPRESS_NAME]: extractedRouterPath, [types.ATTR_EXPRESS_TYPE]: types.ExpressLayerType_ROUTER },
                                name: `router - ${extractedRouterPath}`,
                            };
                        }
                        return "bound dispatch" === layer.name || "handle" === layer.name
                            ? {
                                  attributes: {
                                      [types.ATTR_EXPRESS_NAME]: (route || layerPath) ?? "request handler",
                                      [types.ATTR_EXPRESS_TYPE]: types.ExpressLayerType_REQUEST_HANDLER,
                                  },
                                  name: `request handler${layer.path ? ` - ${route || layerPath}` : ""}`,
                              }
                            : {
                                  attributes: { [types.ATTR_EXPRESS_NAME]: layer.name, [types.ATTR_EXPRESS_TYPE]: types.ExpressLayerType_MIDDLEWARE },
                                  name: `middleware - ${layer.name}`,
                              };
                    }),
                    (exports.getLayerPath = (args) => {
                        let firstArg = args[0];
                        return Array.isArray(firstArg) ? firstArg.map((arg) => extractLayerPathSegment(arg) || "").join(",") : extractLayerPathSegment(firstArg);
                    }),
                    (exports.getRouterPath = getRouterPath),
                    (exports.hasDefaultProp = (express) => !!express && "object" == typeof express && "default" in express && "function" == typeof express.default),
                    (exports.isExpressWithRouterPrototype = isExpressWithRouterPrototype),
                    (exports.isExpressWithoutRouterPrototype = (express) => isExpressRouterPrototype(express.Router) && !isExpressWithRouterPrototype(express)),
                    (exports.isLayerIgnored = (name, type, config) => {
                        if (Array.isArray(config?.ignoreLayersType) && config?.ignoreLayersType?.includes(type)) return !0;
                        if (!Array.isArray(config?.ignoreLayers)) return !1;
                        try {
                            return string.stringMatchesSomePattern(name, config.ignoreLayers, !0);
                        } catch {}
                        return !1;
                    }),
                    (exports.isRoutePattern = isRoutePattern));
            }