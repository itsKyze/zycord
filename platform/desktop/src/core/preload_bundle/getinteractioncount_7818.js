7818(__unused_rspack_module, exports, __webpack_require__) {
                let po;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let observe = __webpack_require__(655),
                    interactionCountEstimate = 0,
                    minKnownInteractionId = 1 / 0,
                    maxKnownInteractionId = 0,
                    updateEstimate = (entries) => {
                        entries.forEach((e) => {
                            e.interactionId &&
                                ((minKnownInteractionId = Math.min(minKnownInteractionId, e.interactionId)),
                                (interactionCountEstimate = (maxKnownInteractionId = Math.max(maxKnownInteractionId, e.interactionId))
                                    ? (maxKnownInteractionId - minKnownInteractionId) / 7 + 1
                                    : 0));
                        });
                    };
                ((exports.getInteractionCount = () => (po ? interactionCountEstimate : performance.interactionCount || 0)),
                    (exports.initInteractionCountPolyfill = () => {
                        "interactionCount" in performance || po || (po = observe.observe("event", updateEstimate, { type: "event", buffered: !0, durationThreshold: 0 }));
                    }));
            }