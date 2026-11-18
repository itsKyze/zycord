2799(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron_1 = __webpack_require__(1288),
                    constants_1 = __webpack_require__(3716);
                exports.default = {
                    on: (event, callback) => electron_1.ipcMain.on((0, constants_1.getZycordIPCEvent)(event), callback),
                    removeListener: (event, callback) => electron_1.ipcMain.removeListener((0, constants_1.getZycordIPCEvent)(event), callback),
                    reply: (event, channel, ...args) => event.sender.send((0, constants_1.getZycordIPCEvent)(channel), ...args),
                    handle: (event, callback) => electron_1.ipcMain.handle((0, constants_1.getZycordIPCEvent)(event), callback),
                };
            }