8101(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470);
                ((exports.logSpanEnd = function (span) {
                    if (!debugBuild.DEBUG_BUILD) return;
                    let { description = "< unknown name >", op = "< unknown op >" } = spanUtils.spanToJSON(span),
                        { spanId } = span.spanContext(),
                        isRootSpan = spanUtils.getRootSpan(span) === span,
                        msg = `[Tracing] Finishing "${op}" ${isRootSpan ? "root " : ""}span "${description}" with ID ${spanId}`;
                    debugLogger.debug.log(msg);
                }),
                    (exports.logSpanStart = function (span) {
                        if (!debugBuild.DEBUG_BUILD) return;
                        let { description = "< unknown name >", op = "< unknown op >", parent_span_id: parentSpanId } = spanUtils.spanToJSON(span),
                            { spanId } = span.spanContext(),
                            sampled = spanUtils.spanIsSampled(span),
                            rootSpan = spanUtils.getRootSpan(span),
                            isRootSpan = rootSpan === span,
                            header = `[Tracing] Starting ${sampled ? "sampled" : "unsampled"} ${isRootSpan ? "root " : ""}span`,
                            infoParts = [`op: ${op}`, `name: ${description}`, `ID: ${spanId}`];
                        if ((parentSpanId && infoParts.push(`parent ID: ${parentSpanId}`), !isRootSpan)) {
                            let { op, description } = spanUtils.spanToJSON(rootSpan);
                            (infoParts.push(`root ID: ${rootSpan.spanContext().spanId}`),
                                op && infoParts.push(`root op: ${op}`),
                                description && infoParts.push(`root description: ${description}`));
                        }
                        debugLogger.debug.log(`${header}
  ${infoParts.join("\n  ")}`);
                    }));
            }