"use strict";
let electron_1 = __webpack_require__(1288),
    createMenu = __webpack_require__(1783)("./" + process.platform);
module1.exports = function (enableDevtools) {
    return electron_1.Menu.buildFromTemplate(createMenu(enableDevtools));
};
