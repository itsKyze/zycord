4889(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let feedback = __webpack_require__(8859),
                    lazyLoadIntegration = __webpack_require__(6310);
                exports.feedbackAsyncIntegration = feedback.buildFeedbackIntegration({ lazyLoadIntegration: lazyLoadIntegration.lazyLoadIntegration });
            }