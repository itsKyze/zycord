8981(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var ownKeys,
                    __createBinding =
                        (this && this.__createBinding) ||
                        (Object.create
                            ? function (o, m, k, k2) {
                                  void 0 === k2 && (k2 = k);
                                  var desc = Object.getOwnPropertyDescriptor(m, k);
                                  ((!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) &&
                                      (desc = {
                                          enumerable: !0,
                                          get: function () {
                                              return m[k];
                                          },
                                      }),
                                      Object.defineProperty(o, k2, desc));
                              }
                            : function (o, m, k, k2) {
                                  (void 0 === k2 && (k2 = k), (o[k2] = m[k]));
                              }),
                    __setModuleDefault =
                        (this && this.__setModuleDefault) ||
                        (Object.create
                            ? function (o, v) {
                                  Object.defineProperty(o, "default", { enumerable: !0, value: v });
                              }
                            : function (o, v) {
                                  o.default = v;
                              }),
                    __importStar =
                        (this && this.__importStar) ||
                        ((ownKeys = function (o) {
                            return (ownKeys =
                                Object.getOwnPropertyNames ||
                                function (o) {
                                    var ar = [];
                                    for (var k in o) Object.prototype.hasOwnProperty.call(o, k) && (ar[ar.length] = k);
                                    return ar;
                                })(o);
                        }),
                        function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (null != mod) for (var k = ownKeys(mod), i = 0; i < k.length; i++) "default" !== k[i] && __createBinding(result, mod, k[i]);
                            return (__setModuleDefault(result, mod), result);
                        });
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.send = function (ev, ...args) {
                        let prefixedEvent = (0, constants_1.getZycordIPCEvent)(ev);
                        if (!RENDERER_IPC_SEND_WHITELIST.has(prefixedEvent)) throw Error("cannot send this event");
                        ipcRenderer.send(prefixedEvent, ...args);
                    }),
                    (exports.on = function (ev, callback) {
                        ipcRenderer.on((0, constants_1.getZycordIPCEvent)(ev), function () {
                            callback.apply(callback, [null, ...[...arguments].slice(1)]);
                        });
                    }),
                    (exports.invoke = function (ev, ...args) {
                        let prefixedEvent = (0, constants_1.getZycordIPCEvent)(ev);
                        if (!RENDERER_IPC_INVOKE_WHITELIST.has(prefixedEvent)) throw Error("cannot invoke this event");
                        return ipcRenderer.invoke(prefixedEvent, ...args);
                    }));
                let electron = __importStar(__webpack_require__(1288)),
                    constants_1 = __webpack_require__(3716),
                    ipcRenderer = electron.ipcRenderer,
                    RENDERER_IPC_SEND_WHITELIST = new Set([
                        constants_1.IPCEvents.APP_ASYNC_INDEX_TSX_LOADED,
                        constants_1.IPCEvents.APP_BADGE_SET,
                        constants_1.IPCEvents.APP_FIRST_RENDER_AFTER_READY_PAYLOAD,
                        constants_1.IPCEvents.APP_GET_ANALYTICS_EVENTS,
                        constants_1.IPCEvents.APP_MAIN_BUNDLE_STATS,
                        constants_1.IPCEvents.APP_PAINT_METRICS,
                        constants_1.IPCEvents.APP_LOADED,
                        constants_1.IPCEvents.APP_PUSH_ANALYTICS,
                        constants_1.IPCEvents.APP_VIEWED,
                        constants_1.IPCEvents.CHECK_FOR_UPDATES,
                        constants_1.IPCEvents.NAVIGATION_HISTORY_CLEAR,
                        constants_1.IPCEvents.NOTIFICATION_CLOSE,
                        constants_1.IPCEvents.NOTIFICATION_SHOW,
                        constants_1.IPCEvents.NOTIFICATIONS_CLEAR,
                        constants_1.IPCEvents.OPEN_EXTERNAL_URL,
                        constants_1.IPCEvents.QUIT_AND_INSTALL,
                        constants_1.IPCEvents.SETTINGS_UPDATE_BACKGROUND_COLOR,
                        constants_1.IPCEvents.SYSTEM_TRAY_SET_ICON,
                        constants_1.IPCEvents.SYSTEM_TRAY_SET_APPLICATIONS,
                        constants_1.IPCEvents.SYSTEM_TRAY_SET_STATES,
                        constants_1.IPCEvents.SYSTEM_TRAY_SET_STRINGS,
                        constants_1.IPCEvents.THUMBAR_BUTTONS_UPDATE,
                        constants_1.IPCEvents.TOGGLE_MINIMIZE_TO_TRAY,
                        constants_1.IPCEvents.TOGGLE_OPEN_ON_STARTUP,
                        constants_1.IPCEvents.TOGGLE_START_MINIMIZED,
                        constants_1.IPCEvents.UPDATE_OPEN_ON_STARTUP,
                        constants_1.IPCEvents.UPDATER_HISTORY_QUERY_AND_TRUNCATE,
                        constants_1.IPCEvents.UPDATED_QUOTES,
                        constants_1.IPCEvents.WINDOW_SET_TRAFFIC_LIGHT_APPEARANCE,
                        constants_1.IPCEvents.WINDOW_SET_TRAFFIC_LIGHT_POSITION,
                    ]),
                    RENDERER_IPC_INVOKE_WHITELIST = new Set([
                        constants_1.IPCEvents.APP_GET_ANALYTICS_EVENTS,
                        constants_1.IPCEvents.GET_MOUSE_COORDINATES,
                        constants_1.IPCEvents.INTENTS_SET_ACTIVITY,
                        constants_1.IPCEvents.INTENTS_RESIGN_ACTIVITY,
                        constants_1.IPCEvents.NOTIFICATIONS_GET_AUTHORIZATION,
                        constants_1.IPCEvents.NOTIFICATIONS_GET_SETTINGS,
                        constants_1.IPCEvents.NOTIFICATIONS_GET_MODULE_STATUS,
                        constants_1.IPCEvents.NOTIFICATIONS_SEND_NOTIFICATION,
                        constants_1.IPCEvents.NOTIFICATIONS_REMOVE_NOTIFICATIONS,
                        constants_1.IPCEvents.NOTIFICATIONS_REMOVE_ALL_NOTIFICATIONS,
                        constants_1.IPCEvents.SEARCH_INDEX_DOMAINS,
                        constants_1.IPCEvents.SEARCH_CLEAR_INDEX,
                        constants_1.IPCEvents.SEARCH_DELETE_DOMAINS,
                        constants_1.IPCEvents.SEARCH_DELETE_ITEMS,
                    ]);
            }