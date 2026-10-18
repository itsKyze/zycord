6605(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.MAIN_APP_DIRNAME =
                        exports.DEFAULT_MAIN_WINDOW_ID =
                        exports.LOG_LEVEL =
                        exports.ALLOW_OPTIONAL_UPDATES =
                        exports.APP_ID =
                        exports.UPDATE_ENDPOINT =
                        exports.NEW_UPDATE_ENDPOINT =
                        exports.API_ENDPOINT =
                        exports.APP_NAME_FOR_HUMANS =
                        exports.APP_NAME =
                        exports.WEBAPP_PATHS =
                        exports.AllowedMediaOrigins =
                        exports.MenuEvents =
                        exports.AnalyticsEvents =
                        exports.UpdaterEvents =
                            void 0),
                    (exports.init = function (bootstrapConstants) {
                        ((exports.APP_NAME = bootstrapConstants.APP_NAME),
                            (exports.APP_NAME_FOR_HUMANS = bootstrapConstants.APP_NAME_FOR_HUMANS),
                            (exports.API_ENDPOINT = bootstrapConstants.API_ENDPOINT),
                            (exports.NEW_UPDATE_ENDPOINT = bootstrapConstants.NEW_UPDATE_ENDPOINT),
                            (exports.UPDATE_ENDPOINT = bootstrapConstants.UPDATE_ENDPOINT),
                            (exports.APP_ID = bootstrapConstants.APP_ID),
                            (exports.ALLOW_OPTIONAL_UPDATES = bootstrapConstants.ALLOW_OPTIONAL_UPDATES),
                            (exports.LOG_LEVEL = bootstrapConstants.LOG_LEVEL),
                            (exports.DEFAULT_MAIN_WINDOW_ID = 0),
                            (exports.MAIN_APP_DIRNAME = __dirname));
                    }),
                    (exports.UpdaterEvents = {
                        UPDATE_NOT_AVAILABLE: "UPDATE_NOT_AVAILABLE",
                        CHECKING_FOR_UPDATES: "CHECKING_FOR_UPDATES",
                        UPDATE_ERROR: "UPDATE_ERROR",
                        UPDATE_MANUALLY: "UPDATE_MANUALLY",
                        UPDATE_AVAILABLE: "UPDATE_AVAILABLE",
                        MODULE_INSTALL_PROGRESS: "MODULE_INSTALL_PROGRESS",
                        UPDATE_DOWNLOADED: "UPDATE_DOWNLOADED",
                        MODULE_INSTALLED: "MODULE_INSTALLED",
                        CHECK_FOR_UPDATES: "CHECK_FOR_UPDATES",
                        QUIT_AND_INSTALL: "QUIT_AND_INSTALL",
                        MODULE_INSTALL: "MODULE_INSTALL",
                        MODULE_QUERY: "MODULE_QUERY",
                        UPDATER_HISTORY_QUERY_AND_TRUNCATE: "UPDATER_HISTORY_QUERY_AND_TRUNCATE",
                        UPDATER_HISTORY_RESPONSE: "UPDATER_HISTORY_RESPONSE",
                    }),
                    (exports.AnalyticsEvents = {
                        APP_GET_ANALYTICS_EVENTS: "APP_GET_ANALYTICS_EVENTS",
                        APP_PUSH_ANALYTICS: "APP_PUSH_ANALYTICS",
                        APP_VIEWED: "APP_VIEWED",
                        APP_LOADED: "APP_LOADED",
                        APP_FIRST_RENDER_AFTER_READY_PAYLOAD: "APP_FIRST_RENDER_AFTER_READY_PAYLOAD",
                    }),
                    (exports.MenuEvents = { OPEN_HELP: "menu:open-help", OPEN_SETTINGS: "menu:open-settings", CHECK_FOR_UPDATES: "menu:check-for-updates" }),
                    (exports.AllowedMediaOrigins = {
                        K_ID: "https://d3ogqhtsivkon3.cloudfront.net",
                        K_ID_V2: "https://family.k-id.com",
                        K_ID_FACE_SCAN: "https://age-verification-k-id.privately.swiss",
                    }),
                    (exports.WEBAPP_PATHS = { APP: "/app", CONFERENCE_MODE: "/conference-mode" }));
            }