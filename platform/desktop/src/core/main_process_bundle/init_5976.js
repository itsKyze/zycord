5976(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                let features;
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.init = function () {
                        features = new FeatureFlags_1.default();
                    }),
                    (exports.getFeatures = function () {
                        return features;
                    }));
                let FeatureFlags_1 = __importDefault(__webpack_require__(2603));
            }