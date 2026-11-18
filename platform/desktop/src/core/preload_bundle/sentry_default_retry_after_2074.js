2074(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let randomSafeContext = __webpack_require__(638);
                function parseRetryAfterHeader(header, now = randomSafeContext.safeDateNow()) {
                    let headerDelay = parseInt(`${header}`, 10);
                    if (!isNaN(headerDelay)) return 1e3 * headerDelay;
                    let headerDate = Date.parse(`${header}`);
                    return isNaN(headerDate) ? 6e4 : headerDate - now;
                }
                function disabledUntil(limits, dataCategory) {
                    return limits[dataCategory] || limits.all || 0;
                }
                ((exports.DEFAULT_RETRY_AFTER = 6e4),
                    (exports.disabledUntil = disabledUntil),
                    (exports.isRateLimited = function (limits, dataCategory, now = randomSafeContext.safeDateNow()) {
                        return disabledUntil(limits, dataCategory) > now;
                    }),
                    (exports.parseRetryAfterHeader = parseRetryAfterHeader),
                    (exports.updateRateLimits = function (limits, { statusCode, headers }, now = randomSafeContext.safeDateNow()) {
                        let updatedRateLimits = { ...limits },
                            rateLimitHeader = headers?.["x-sentry-rate-limits"],
                            retryAfterHeader = headers?.["retry-after"];
                        if (rateLimitHeader)
                            for (let limit of rateLimitHeader.trim().split(",")) {
                                let [retryAfter, categories, , , namespaces] = limit.split(":", 5),
                                    headerDelay = parseInt(retryAfter, 10),
                                    delay = (isNaN(headerDelay) ? 60 : headerDelay) * 1e3;
                                if (categories)
                                    for (let category of categories.split(";"))
                                        "metric_bucket" === category
                                            ? (!namespaces || namespaces.split(";").includes("custom")) && (updatedRateLimits[category] = now + delay)
                                            : (updatedRateLimits[category] = now + delay);
                                else updatedRateLimits.all = now + delay;
                            }
                        else
                            retryAfterHeader
                                ? (updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now))
                                : 429 === statusCode && (updatedRateLimits.all = now + 6e4);
                        return updatedRateLimits;
                    }));
            }