63(__unused_rspack_module, exports, __webpack_require__) {
                let browser = __webpack_require__(5768),
                    core = __webpack_require__(5777),
                    scopeToMain = __webpack_require__(7454),
                    stackParse = __webpack_require__(926),
                    transport = __webpack_require__(5121);
                function getDefaultIntegrations(options) {
                    return [
                        ...browser.getDefaultIntegrations(options).filter((i) => "BrowserSession" !== i.name && "CultureContext" !== i.name),
                        scopeToMain.scopeToMainIntegration(),
                    ];
                }
                ((exports.getDefaultIntegrations = getDefaultIntegrations),
                    (exports.init = function (options = {}, originalInit = browser.init) {
                        window?.__SENTRY__RENDERER_INIT__
                            ? core.debug.warn(`The browser SDK has already been initialized.
If init has been called in the preload and contextIsolation is disabled, is not required to call init in the renderer`)
                            : ((window.__SENTRY__RENDERER_INIT__ = !0),
                              (options.sendClientReports = !1),
                              void 0 === options.defaultIntegrations && (options.defaultIntegrations = getDefaultIntegrations(options)),
                              void 0 === options.stackParser && (options.stackParser = stackParse.electronRendererStackParser),
                              void 0 === options.ipcNamespace && (options.ipcNamespace = "sentry-ipc"),
                              void 0 === options.dsn && (options.dsn = "https://12345@dummy.dsn/12345"),
                              void 0 === options.transport && (options.transport = transport.makeRendererTransport),
                              delete options.initialScope,
                              originalInit(options));
                    }));
            }