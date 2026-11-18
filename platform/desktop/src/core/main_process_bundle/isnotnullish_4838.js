4838(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.isNotNullish = function (value) {
                        return null != value;
                    }),
                    (exports.createLock = function () {
                        let p = Promise.resolve(null);
                        return (criticalSection) =>
                            new Promise((resolve, reject) => {
                                p = p.then(criticalSection).then(resolve, reject);
                            });
                    }));
            }