"use strict";
(Object.defineProperty(exports, "__esModule", { value: !0 }),
    (exports.setThumbarButtons = function (buttons, isSystemDarkMode) {
        return (0, ipc_1.send)(constants_1.IPCEvents.THUMBAR_BUTTONS_UPDATE, buttons, isSystemDarkMode);
    }));
let constants_1 = __webpack_require__(3716),
    ipc_1 = __webpack_require__(8981);
