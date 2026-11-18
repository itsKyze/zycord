3403(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                exports.diagnoseSdkConnectivity = async function () {
                    let client = core.getClient();
                    if (!client) return "no-client-active";
                    if (!client.getDsn()) return "no-dsn-configured";
                    let url =
                        client.getOptions().tunnel ||
                        "https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7";
                    try {
                        await core.suppressTracing(() => fetch(url, { body: "{}", method: "POST", mode: "cors", credentials: "omit" }));
                    } catch {
                        return "sentry-unreachable";
                    }
                };
            }