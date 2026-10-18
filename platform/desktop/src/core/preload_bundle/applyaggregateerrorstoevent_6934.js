6934(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431);
                function isExceptionGroup(error) {
                    return Array.isArray(error.errors);
                }
                function applyExceptionGroupFieldsForParentException(exception, exceptionId, error) {
                    exception.mechanism = {
                        handled: !0,
                        type: "auto.core.linked_errors",
                        ...(isExceptionGroup(error) && { is_exception_group: !0 }),
                        ...exception.mechanism,
                        exception_id: exceptionId,
                    };
                }
                function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
                    exception.mechanism = { handled: !0, ...exception.mechanism, type: "chained", source, exception_id: exceptionId, parent_id: parentId };
                }
                exports.applyAggregateErrorsToEvent = function (exceptionFromErrorImplementation, parser, key, limit, event, hint) {
                    if (!event.exception?.values || !hint || !is.isInstanceOf(hint.originalException, Error)) return;
                    let originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : void 0;
                    originalException &&
                        (event.exception.values = (function aggregateExceptionsFromError(
                            exceptionFromErrorImplementation,
                            parser,
                            limit,
                            error,
                            key,
                            prevExceptions,
                            exception,
                            exceptionId,
                        ) {
                            if (prevExceptions.length >= limit + 1) return prevExceptions;
                            let newExceptions = [...prevExceptions];
                            if (is.isInstanceOf(error[key], Error)) {
                                applyExceptionGroupFieldsForParentException(exception, exceptionId, error);
                                let newException = exceptionFromErrorImplementation(parser, error[key]),
                                    newExceptionId = newExceptions.length;
                                (applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId),
                                    (newExceptions = aggregateExceptionsFromError(
                                        exceptionFromErrorImplementation,
                                        parser,
                                        limit,
                                        error[key],
                                        key,
                                        [newException, ...newExceptions],
                                        newException,
                                        newExceptionId,
                                    )));
                            }
                            return (
                                isExceptionGroup(error) &&
                                    error.errors.forEach((childError, i) => {
                                        if (is.isInstanceOf(childError, Error)) {
                                            applyExceptionGroupFieldsForParentException(exception, exceptionId, error);
                                            let newException = exceptionFromErrorImplementation(parser, childError),
                                                newExceptionId = newExceptions.length;
                                            (applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId),
                                                (newExceptions = aggregateExceptionsFromError(
                                                    exceptionFromErrorImplementation,
                                                    parser,
                                                    limit,
                                                    childError,
                                                    key,
                                                    [newException, ...newExceptions],
                                                    newException,
                                                    newExceptionId,
                                                )));
                                        }
                                    }),
                                newExceptions
                            );
                        })(exceptionFromErrorImplementation, parser, limit, hint.originalException, key, event.exception.values, originalException, 0));
                };
            }