5121(__unused_rspack_module, exports, __webpack_require__) {
                let core = __webpack_require__(5777),
                    ipc = __webpack_require__(3306);
                exports.makeRendererTransport = function (options) {
                    let ipc$1;
                    return core.createTransport(options, async (request) => (ipc$1 || (ipc$1 = ipc.getIPC()), ipc$1.sendEnvelope(request.body), { statusCode: 200 }));
                };
            }