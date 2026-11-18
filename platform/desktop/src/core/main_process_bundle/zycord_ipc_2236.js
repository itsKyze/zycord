2236(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __importDefault(__webpack_require__(1288)),
                    ZycordIPC_1 = __webpack_require__(1999);
                ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.DESKTOP_CAPTURER_GET_SOURCES, async (_, opts) => {
                    let requiredTypes,
                        electronOptions =
                            ((requiredTypes = ["screen", "window"]),
                            {
                                types: opts.types.filter((type) => requiredTypes.includes(type.toLocaleLowerCase())).map((type) => type.toLocaleLowerCase()),
                                thumbnailSize: opts.thumbnailSize,
                                fetchWindowIcons: !0,
                            });
                    return (await electron_1.default.desktopCapturer.getSources(electronOptions)).map((source) => ({
                        id: source.id,
                        name: source.name,
                        url: source.thumbnail.toDataURL(),
                        icon: source.appIcon?.toDataURL(),
                    }));
                });
            }