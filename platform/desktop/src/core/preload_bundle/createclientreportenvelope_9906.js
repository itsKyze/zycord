9906(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let envelope = __webpack_require__(1323),
                    time = __webpack_require__(602);
                exports.createClientReportEnvelope = function (discarded_events, dsn, timestamp) {
                    let clientReportItem = [{ type: "client_report" }, { timestamp: timestamp || time.dateTimestampInSeconds(), discarded_events }];
                    return envelope.createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
                };
            }