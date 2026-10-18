7332(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    string = __webpack_require__(2634);
                function logIgnoredSpan(droppedSpan) {
                    debugLogger.debug.log(`Ignoring span ${droppedSpan.op} - ${droppedSpan.description} because it matches \`ignoreSpans\`.`);
                }
                ((exports.reparentChildSpans = function (spans, dropSpan) {
                    let droppedSpanParentId = dropSpan.parent_span_id,
                        droppedSpanId = dropSpan.span_id;
                    if (droppedSpanParentId) for (let span of spans) span.parent_span_id === droppedSpanId && (span.parent_span_id = droppedSpanParentId);
                }),
                    (exports.shouldIgnoreSpan = function (span, ignoreSpans) {
                        if (!ignoreSpans?.length || !span.description) return !1;
                        for (let pattern of ignoreSpans) {
                            var value;
                            if ("string" == typeof (value = pattern) || value instanceof RegExp) {
                                if (string.isMatchingPattern(span.description, pattern)) return (debugBuild.DEBUG_BUILD && logIgnoredSpan(span), !0);
                                continue;
                            }
                            if (!pattern.name && !pattern.op) continue;
                            let nameMatches = !pattern.name || string.isMatchingPattern(span.description, pattern.name),
                                opMatches = !pattern.op || (span.op && string.isMatchingPattern(span.op, pattern.op));
                            if (nameMatches && opMatches) return (debugBuild.DEBUG_BUILD && logIgnoredSpan(span), !0);
                        }
                        return !1;
                    }));
            }