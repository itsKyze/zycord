7218(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121);
                exports.captureFeedback = function (params, hint = {}, scope = currentScopes.getCurrentScope()) {
                    let { message, name, email, url, source, associatedEventId, tags } = params,
                        feedbackEvent = {
                            contexts: { feedback: { contact_email: email, name, message, url, source, associated_event_id: associatedEventId } },
                            type: "feedback",
                            level: "info",
                            tags,
                        },
                        client = scope?.getClient() || currentScopes.getClient();
                    return (client && client.emit("beforeSendFeedback", feedbackEvent, hint), scope.captureEvent(feedbackEvent, hint));
                };
            }