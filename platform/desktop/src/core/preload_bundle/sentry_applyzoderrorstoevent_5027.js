5027(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let integration = __webpack_require__(5579),
                    is = __webpack_require__(7431),
                    string = __webpack_require__(2634);
                function flattenIssue(issue) {
                    return {
                        ...issue,
                        path: "path" in issue && Array.isArray(issue.path) ? issue.path.join(".") : void 0,
                        keys: "keys" in issue ? JSON.stringify(issue.keys) : void 0,
                        unionErrors: "unionErrors" in issue ? JSON.stringify(issue.unionErrors) : void 0,
                    };
                }
                function flattenIssuePath(path) {
                    return path.map((p) => ("number" == typeof p ? "<array>" : p)).join(".");
                }
                function formatIssueMessage(zodError) {
                    let errorKeyMap = new Set();
                    for (let iss of zodError.issues) {
                        let issuePath = flattenIssuePath(iss.path);
                        issuePath.length > 0 && errorKeyMap.add(issuePath);
                    }
                    let errorKeys = Array.from(errorKeyMap);
                    if (0 === errorKeys.length) {
                        let rootExpectedType = "variable";
                        if (zodError.issues.length > 0) {
                            let iss = zodError.issues[0];
                            void 0 !== iss && "expected" in iss && "string" == typeof iss.expected && (rootExpectedType = iss.expected);
                        }
                        return `Failed to validate ${rootExpectedType}`;
                    }
                    return `Failed to validate keys: ${string.truncate(errorKeys.join(", "), 100)}`;
                }
                function applyZodErrorsToEvent(limit, saveZodIssuesAsAttachment = !1, event, hint) {
                    var originalException;
                    if (
                        !event.exception?.values ||
                        !hint.originalException ||
                        ((originalException = hint.originalException),
                        !(is.isError(originalException) && "ZodError" === originalException.name && Array.isArray(originalException.issues))) ||
                        0 === hint.originalException.issues.length
                    )
                        return event;
                    try {
                        let flattenedIssues = (saveZodIssuesAsAttachment ? hint.originalException.issues : hint.originalException.issues.slice(0, limit)).map(flattenIssue);
                        return (
                            saveZodIssuesAsAttachment &&
                                (Array.isArray(hint.attachments) || (hint.attachments = []),
                                hint.attachments.push({ filename: "zod_issues.json", data: JSON.stringify({ issues: flattenedIssues }) })),
                            {
                                ...event,
                                exception: {
                                    ...event.exception,
                                    values: [{ ...event.exception.values[0], value: formatIssueMessage(hint.originalException) }, ...event.exception.values.slice(1)],
                                },
                                extra: { ...event.extra, "zoderror.issues": flattenedIssues.slice(0, limit) },
                            }
                        );
                    } catch (e) {
                        return {
                            ...event,
                            extra: {
                                ...event.extra,
                                "zoderrors sentry integration parse error": {
                                    message: "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
                                    error:
                                        e instanceof Error
                                            ? `${e.name}: ${e.message}
${e.stack}`
                                            : "unknown",
                                },
                            },
                        };
                    }
                }
                let zodErrorsIntegration = integration.defineIntegration((options = {}) => {
                    let limit = options.limit ?? 10;
                    return { name: "ZodErrors", processEvent: (originalEvent, hint) => applyZodErrorsToEvent(limit, options.saveZodIssuesAsAttachment, originalEvent, hint) };
                });
                ((exports.applyZodErrorsToEvent = applyZodErrorsToEvent),
                    (exports.flattenIssue = flattenIssue),
                    (exports.flattenIssuePath = flattenIssuePath),
                    (exports.formatIssueMessage = formatIssueMessage),
                    (exports.zodErrorsIntegration = zodErrorsIntegration));
            }