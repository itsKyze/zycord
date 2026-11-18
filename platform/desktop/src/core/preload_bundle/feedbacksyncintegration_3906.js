3906(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let feedback = __webpack_require__(8859);
                exports.feedbackSyncIntegration = feedback.buildFeedbackIntegration({
                    getModalIntegration: () => feedback.feedbackModalIntegration,
                    getScreenshotIntegration: () => feedback.feedbackScreenshotIntegration,
                });
            }