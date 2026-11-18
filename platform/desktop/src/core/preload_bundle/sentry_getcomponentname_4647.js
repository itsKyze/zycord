4647(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431),
                    WINDOW = __webpack_require__(3712).GLOBAL_OBJ;
                ((exports.getComponentName = function (elem, maxTraverseHeight = 5) {
                    if (!WINDOW.HTMLElement) return null;
                    let currentElem = elem;
                    for (let i = 0; i < maxTraverseHeight && currentElem; i++) {
                        if (currentElem instanceof HTMLElement) {
                            if (currentElem.dataset.sentryComponent) return currentElem.dataset.sentryComponent;
                            if (currentElem.dataset.sentryElement) return currentElem.dataset.sentryElement;
                        }
                        currentElem = currentElem.parentNode;
                    }
                    return null;
                }),
                    (exports.getLocationHref = function () {
                        try {
                            return WINDOW.document.location.href;
                        } catch {
                            return "";
                        }
                    }),
                    (exports.htmlTreeAsString = function (elem, options = {}) {
                        if (!elem) return "<unknown>";
                        try {
                            let nextStr,
                                currentElem = elem,
                                out = [],
                                height = 0,
                                len = 0,
                                keyAttrs = Array.isArray(options) ? options : options.keyAttrs,
                                maxStringLength = (!Array.isArray(options) && options.maxStringLength) || 80;
                            for (
                                ;
                                currentElem &&
                                height++ < 5 &&
                                ((nextStr = (function (el, keyAttrs) {
                                    let out = [];
                                    if (!el?.tagName) return "";
                                    if (WINDOW.HTMLElement && el instanceof HTMLElement && el.dataset) {
                                        if (el.dataset.sentryComponent) return el.dataset.sentryComponent;
                                        if (el.dataset.sentryElement) return el.dataset.sentryElement;
                                    }
                                    out.push(el.tagName.toLowerCase());
                                    let keyAttrPairs = keyAttrs?.length
                                        ? keyAttrs.filter((keyAttr) => el.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, el.getAttribute(keyAttr)])
                                        : null;
                                    if (keyAttrPairs?.length)
                                        keyAttrPairs.forEach((keyAttrPair) => {
                                            out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
                                        });
                                    else {
                                        el.id && out.push(`#${el.id}`);
                                        let className = el.className;
                                        if (className && is.isString(className)) for (let c of className.split(/\s+/)) out.push(`.${c}`);
                                    }
                                    for (let k of ["aria-label", "type", "name", "title", "alt"]) {
                                        let attr = el.getAttribute(k);
                                        attr && out.push(`[${k}="${attr}"]`);
                                    }
                                    return out.join("");
                                })(currentElem, keyAttrs)),
                                "html" !== nextStr && (!(height > 1) || !(len + 3 * out.length + nextStr.length >= maxStringLength)));
                            )
                                (out.push(nextStr), (len += nextStr.length), (currentElem = currentElem.parentNode));
                            return out.reverse().join(" > ");
                        } catch {
                            return "<unknown>";
                        }
                    }));
            }