5766(__unused_rspack_module, exports) {
                (Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }),
                    (exports.getPossibleEventMessages = function (event) {
                        let possibleMessages = [];
                        event.message && possibleMessages.push(event.message);
                        try {
                            let lastException = event.exception.values[event.exception.values.length - 1];
                            lastException?.value &&
                                (possibleMessages.push(lastException.value), lastException.type && possibleMessages.push(`${lastException.type}: ${lastException.value}`));
                        } catch {}
                        return possibleMessages;
                    }));
            }