6418(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let constants = __webpack_require__(4264),
                    eventProcessors = __webpack_require__(2544),
                    scope = __webpack_require__(9529),
                    debugIds = __webpack_require__(2535),
                    misc = __webpack_require__(735),
                    normalize = __webpack_require__(4496),
                    scopeData = __webpack_require__(4955),
                    string = __webpack_require__(2634),
                    syncpromise = __webpack_require__(4335),
                    time = __webpack_require__(602);
                function applyClientOptions(event, options) {
                    let { environment, release, dist, maxValueLength } = options;
                    ((event.environment = event.environment || environment || constants.DEFAULT_ENVIRONMENT),
                        !event.release && release && (event.release = release),
                        !event.dist && dist && (event.dist = dist));
                    let request = event.request;
                    (request?.url && maxValueLength && (request.url = string.truncate(request.url, maxValueLength)),
                        maxValueLength &&
                            event.exception?.values?.forEach((exception) => {
                                exception.value && (exception.value = string.truncate(exception.value, maxValueLength));
                            }));
                }
                function applyDebugIds(event, stackParser) {
                    let filenameDebugIdMap = debugIds.getFilenameToDebugIdMap(stackParser);
                    event.exception?.values?.forEach((exception) => {
                        exception.stacktrace?.frames?.forEach((frame) => {
                            frame.filename && (frame.debug_id = filenameDebugIdMap[frame.filename]);
                        });
                    });
                }
                function applyDebugMeta(event) {
                    let filenameDebugIdMap = {};
                    if (
                        (event.exception?.values?.forEach((exception) => {
                            exception.stacktrace?.frames?.forEach((frame) => {
                                frame.debug_id &&
                                    (frame.abs_path
                                        ? (filenameDebugIdMap[frame.abs_path] = frame.debug_id)
                                        : frame.filename && (filenameDebugIdMap[frame.filename] = frame.debug_id),
                                    delete frame.debug_id);
                            });
                        }),
                        0 === Object.keys(filenameDebugIdMap).length)
                    )
                        return;
                    ((event.debug_meta = event.debug_meta || {}), (event.debug_meta.images = event.debug_meta.images || []));
                    let images = event.debug_meta.images;
                    Object.entries(filenameDebugIdMap).forEach(([filename, debug_id]) => {
                        images.push({ type: "sourcemap", code_file: filename, debug_id });
                    });
                }
                let captureContextKeys = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];
                ((exports.applyClientOptions = applyClientOptions),
                    (exports.applyDebugIds = applyDebugIds),
                    (exports.applyDebugMeta = applyDebugMeta),
                    (exports.parseEventHintOrCaptureContext = function (hint) {
                        if (hint) {
                            var hint1;
                            return (hint1 = hint) instanceof scope.Scope || "function" == typeof hint1 || Object.keys(hint).some((key) => captureContextKeys.includes(key))
                                ? { captureContext: hint }
                                : hint;
                        }
                    }),
                    (exports.prepareEvent = function (options, event, hint, scope1, client, isolationScope) {
                        var event1, integrationNames;
                        let { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options,
                            prepared = { ...event, event_id: event.event_id || hint.event_id || misc.uuid4(), timestamp: event.timestamp || time.dateTimestampInSeconds() },
                            integrations = hint.integrations || options.integrations.map((i) => i.name);
                        (applyClientOptions(prepared, options),
                            (event1 = prepared),
                            (integrationNames = integrations).length > 0 &&
                                ((event1.sdk = event1.sdk || {}), (event1.sdk.integrations = [...(event1.sdk.integrations || []), ...integrationNames])),
                            client && client.emit("applyFrameMetadata", event),
                            void 0 === event.type && applyDebugIds(prepared, options.stackParser));
                        let finalScope = (function (scope$1, captureContext) {
                            if (!captureContext) return scope$1;
                            let finalScope = scope$1 ? scope$1.clone() : new scope.Scope();
                            return (finalScope.update(captureContext), finalScope);
                        })(scope1, hint.captureContext);
                        hint.mechanism && misc.addExceptionMechanism(prepared, hint.mechanism);
                        let clientEventProcessors = client ? client.getEventProcessors() : [],
                            data = scopeData.getCombinedScopeData(isolationScope, finalScope),
                            attachments = [...(hint.attachments || []), ...data.attachments];
                        (attachments.length && (hint.attachments = attachments), scopeData.applyScopeDataToEvent(prepared, data));
                        let eventProcessors$1 = [...clientEventProcessors, ...data.eventProcessors];
                        return (
                            hint.data && !0 === hint.data.__sentry__
                                ? syncpromise.resolvedSyncPromise(prepared)
                                : eventProcessors.notifyEventProcessors(eventProcessors$1, prepared, hint)
                        ).then((evt) =>
                            (evt && applyDebugMeta(evt), "number" == typeof normalizeDepth && normalizeDepth > 0)
                                ? (function (event, depth, maxBreadth) {
                                      if (!event) return null;
                                      let normalized = {
                                          ...event,
                                          ...(event.breadcrumbs && {
                                              breadcrumbs: event.breadcrumbs.map((b) => ({ ...b, ...(b.data && { data: normalize.normalize(b.data, depth, maxBreadth) }) })),
                                          }),
                                          ...(event.user && { user: normalize.normalize(event.user, depth, maxBreadth) }),
                                          ...(event.contexts && { contexts: normalize.normalize(event.contexts, depth, maxBreadth) }),
                                          ...(event.extra && { extra: normalize.normalize(event.extra, depth, maxBreadth) }),
                                      };
                                      return (
                                          event.contexts?.trace &&
                                              normalized.contexts &&
                                              ((normalized.contexts.trace = event.contexts.trace),
                                              event.contexts.trace.data && (normalized.contexts.trace.data = normalize.normalize(event.contexts.trace.data, depth, maxBreadth))),
                                          event.spans &&
                                              (normalized.spans = event.spans.map((span) => ({
                                                  ...span,
                                                  ...(span.data && { data: normalize.normalize(span.data, depth, maxBreadth) }),
                                              }))),
                                          event.contexts?.flags && normalized.contexts && (normalized.contexts.flags = normalize.normalize(event.contexts.flags, 3, maxBreadth)),
                                          normalized
                                      );
                                  })(evt, normalizeDepth, normalizeMaxBreadth)
                                : evt,
                        );
                    }));
            }