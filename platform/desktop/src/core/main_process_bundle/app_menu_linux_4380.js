4380(module1, __unused_rspack_exports, __webpack_require__) {
                "use strict";
                let electron_1 = __webpack_require__(1288),
                    Constants_1 = __webpack_require__(6605),
                    SEPARATOR = { type: "separator" };
                module1.exports = function (enableDevtools) {
                    return [
                        {
                            label: "File",
                            submenu: [
                                { label: "Options", click: () => electron_1.app.emit(Constants_1.MenuEvents.OPEN_SETTINGS), accelerator: "Control+," },
                                SEPARATOR,
                                { label: "Exit", click: () => electron_1.app.quit(), accelerator: "Control+Q" },
                            ],
                        },
                        {
                            label: "Edit",
                            submenu: [
                                { role: "undo", accelerator: "Control+Z" },
                                { role: "redo", accelerator: "Shift+Control+Z" },
                                SEPARATOR,
                                { role: "cut", accelerator: "Control+X" },
                                { role: "copy", accelerator: "Control+C" },
                                { role: "paste", accelerator: "Control+V" },
                                { role: "selectAll", accelerator: "Control+A" },
                            ],
                        },
                        {
                            label: "View",
                            submenu: [
                                { label: "Reload", click: () => electron_1.BrowserWindow.getFocusedWindow()?.webContents.reloadIgnoringCache(), accelerator: "Control+R" },
                                {
                                    label: "Toggle Full Screen",
                                    click: () => {
                                        let window = electron_1.BrowserWindow.getFocusedWindow();
                                        null != window && window.setFullScreen(!window.isFullScreen());
                                    },
                                    accelerator: "Control+Shift+F",
                                },
                                ...(enableDevtools
                                    ? [
                                          SEPARATOR,
                                          {
                                              label: "Developer",
                                              submenu: [
                                                  {
                                                      label: "Toggle Developer Tools",
                                                      click: () => electron_1.BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools(),
                                                      accelerator: "Control+Shift+I",
                                                  },
                                              ],
                                          },
                                      ]
                                    : []),
                            ],
                        },
                        {
                            label: "Help",
                            submenu: [
                                { label: "Check for Updates", click: () => electron_1.app.emit(Constants_1.MenuEvents.CHECK_FOR_UPDATES) },
                                SEPARATOR,
                                { label: "Zycord Help", click: () => electron_1.app.emit(Constants_1.MenuEvents.OPEN_HELP) },
                            ],
                        },
                    ];
                };
            }