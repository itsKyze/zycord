2603(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = class {
                        flags;
                        constructor() {
                            this.flags = new Set();
                        }
                        getSupported() {
                            return Array.from(this.flags);
                        }
                        supports(feature) {
                            return this.flags.has(feature);
                        }
                        declareSupported(feature) {
                            this.supports(feature) ? console.error("Feature redeclared; is this a duplicate flag? ", feature) : this.flags.add(feature);
                        }
                    }));
            }