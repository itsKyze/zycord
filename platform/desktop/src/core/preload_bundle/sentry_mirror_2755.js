2755(__unused_rspack_module, exports, __webpack_require__) {
                let canvasService, canvasCtx, errorHandler, wrappedEmit, _takeFullSnapshot, handlers, _capture, _trace, _debug;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    browserUtils = __webpack_require__(4794),
                    WINDOW = core.GLOBAL_OBJ,
                    REPLAY_SESSION_KEY = "sentryReplaySession",
                    UNABLE_TO_SEND_REPLAY = "Unable to send Replay";
                var NodeType2,
                    EventType2,
                    IncrementalSource2,
                    MouseInteractions2,
                    PointerTypes2,
                    MediaInteractions2,
                    t2,
                    NodeType21,
                    n,
                    __defProp$1 = Object.defineProperty,
                    __publicField$1 = (obj, key, value) => {
                        let key1;
                        return (key1 = "symbol" != typeof key ? key + "" : key) in obj
                            ? __defProp$1(obj, key1, { enumerable: !0, configurable: !0, writable: !0, value: value })
                            : (obj[key1] = value);
                    },
                    NodeType$2 =
                        (((NodeType2 = NodeType$2 || {})[(NodeType2.Document = 0)] = "Document"),
                        (NodeType2[(NodeType2.DocumentType = 1)] = "DocumentType"),
                        (NodeType2[(NodeType2.Element = 2)] = "Element"),
                        (NodeType2[(NodeType2.Text = 3)] = "Text"),
                        (NodeType2[(NodeType2.CDATA = 4)] = "CDATA"),
                        (NodeType2[(NodeType2.Comment = 5)] = "Comment"),
                        NodeType2);
                function isShadowRoot(n2) {
                    let host = n2?.host;
                    return host?.shadowRoot === n2;
                }
                function isNativeShadowDom(shadowRoot) {
                    return "[object ShadowRoot]" === Object.prototype.toString.call(shadowRoot);
                }
                function stringifyStylesheet(s2) {
                    try {
                        var cssText;
                        let rules2 = s2.rules || s2.cssRules;
                        return rules2
                            ? ((cssText = Array.from(rules2, stringifyRule).join("")).includes(" background-clip: text;") &&
                                  !cssText.includes(" -webkit-background-clip: text;") &&
                                  (cssText = cssText.replace(/\sbackground-clip:\s*text;/g, " -webkit-background-clip: text; background-clip: text;")),
                              cssText)
                            : null;
                    } catch (error) {
                        return null;
                    }
                }
                function stringifyRule(rule) {
                    let importStringified;
                    if ("styleSheet" in rule)
                        try {
                            importStringified =
                                stringifyStylesheet(rule.styleSheet) ||
                                (function (rule) {
                                    let { cssText } = rule;
                                    if (cssText.split('"').length < 3) return cssText;
                                    let statement = ["@import", `url(${JSON.stringify(rule.href)})`];
                                    return (
                                        "" === rule.layerName ? statement.push("layer") : rule.layerName && statement.push(`layer(${rule.layerName})`),
                                        rule.supportsText && statement.push(`supports(${rule.supportsText})`),
                                        rule.media.length && statement.push(rule.media.mediaText),
                                        statement.join(" ") + ";"
                                    );
                                })(rule);
                        } catch (error) {}
                    else if ("selectorText" in rule) {
                        let cssText = rule.cssText,
                            needsSafariColonFix = rule.selectorText.includes(":"),
                            needsAllFix = "string" == typeof rule.style.all && rule.style.all;
                        if (
                            (needsAllFix &&
                                (cssText = (function (rule) {
                                    let styles = "";
                                    for (let i2 = 0; i2 < rule.style.length; i2++) {
                                        let styleDeclaration = rule.style,
                                            attribute = styleDeclaration[i2],
                                            isImportant = styleDeclaration.getPropertyPriority(attribute);
                                        styles += `${attribute}:${styleDeclaration.getPropertyValue(attribute)}${isImportant ? " !important" : ""};`;
                                    }
                                    return `${rule.selectorText} { ${styles} }`;
                                })(rule)),
                            needsSafariColonFix && (cssText = cssText.replace(/(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm, "$1\\$2")),
                            needsSafariColonFix || needsAllFix)
                        )
                            return cssText;
                    }
                    return importStringified || rule.cssText;
                }
                class Mirror {
                    constructor() {
                        (__publicField$1(this, "idNodeMap", new Map()), __publicField$1(this, "nodeMetaMap", new WeakMap()));
                    }
                    getId(n2) {
                        return n2 ? (this.getMeta(n2)?.id ?? -1) : -1;
                    }
                    getNode(id) {
                        return this.idNodeMap.get(id) || null;
                    }
                    getIds() {
                        return Array.from(this.idNodeMap.keys());
                    }
                    getMeta(n2) {
                        return this.nodeMetaMap.get(n2) || null;
                    }
                    removeNodeFromMap(n2) {
                        let id = this.getId(n2);
                        (this.idNodeMap.delete(id), n2.childNodes && n2.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode)));
                    }
                    has(id) {
                        return this.idNodeMap.has(id);
                    }
                    hasNode(node) {
                        return this.nodeMetaMap.has(node);
                    }
                    add(n2, meta) {
                        let id = meta.id;
                        (this.idNodeMap.set(id, n2), this.nodeMetaMap.set(n2, meta));
                    }
                    replace(id, n2) {
                        let oldNode = this.getNode(id);
                        if (oldNode) {
                            let meta = this.nodeMetaMap.get(oldNode);
                            meta && this.nodeMetaMap.set(n2, meta);
                        }
                        this.idNodeMap.set(id, n2);
                    }
                    reset() {
                        ((this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap()));
                    }
                }
                function shouldMaskInput({ maskInputOptions, tagName, type }) {
                    return (
                        "OPTION" === tagName && (tagName = "SELECT"),
                        !!(
                            maskInputOptions[tagName.toLowerCase()] ||
                            (type && maskInputOptions[type]) ||
                            "password" === type ||
                            ("INPUT" === tagName && !type && maskInputOptions.text)
                        )
                    );
                }
                function maskInputValue({ isMasked, element, value, maskInputFn }) {
                    let text = value || "";
                    return isMasked ? (maskInputFn && (text = maskInputFn(text, element)), "*".repeat(text.length)) : text;
                }
                function toLowerCase(str) {
                    return str.toLowerCase();
                }
                function toUpperCase(str) {
                    return str.toUpperCase();
                }
                let ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
                function getInputType(element) {
                    let type = element.type;
                    return element.hasAttribute("data-rr-is-password") ? "password" : type ? toLowerCase(type) : null;
                }
                function getInputValue(el, tagName, type) {
                    return "INPUT" === tagName && ("radio" === type || "checkbox" === type) ? el.getAttribute("value") || "" : el.value;
                }
                function extractFileExtension(path, baseURL) {
                    let url;
                    try {
                        url = new URL(path, baseURL ?? window.location.href);
                    } catch (err) {
                        return null;
                    }
                    let match = url.pathname.match(/\.([0-9a-z]+)(?:$)/i);
                    return match?.[1] ?? null;
                }
                let cachedImplementations$1 = {};
                function getImplementation$1(name) {
                    let cached = cachedImplementations$1[name];
                    if (cached) return cached;
                    let document2 = window.document,
                        impl = window[name];
                    if (document2 && "function" == typeof document2.createElement)
                        try {
                            let sandbox = document2.createElement("iframe");
                            ((sandbox.hidden = !0), document2.head.appendChild(sandbox));
                            let contentWindow = sandbox.contentWindow;
                            (contentWindow && contentWindow[name] && (impl = contentWindow[name]), document2.head.removeChild(sandbox));
                        } catch (e2) {}
                    return (cachedImplementations$1[name] = impl.bind(window));
                }
                function setTimeout$2(...rest) {
                    return getImplementation$1("setTimeout")(...rest);
                }
                function clearTimeout$1(...rest) {
                    return getImplementation$1("clearTimeout")(...rest);
                }
                function getIframeContentDocument(iframe) {
                    try {
                        return iframe.contentDocument;
                    } catch (e2) {}
                }
                let _id = 1,
                    tagNameRegex = RegExp("[^a-z0-9-_:]");
                function genId() {
                    return _id++;
                }
                let URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm,
                    URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i,
                    URL_WWW_MATCH = /^www\..*/i,
                    DATA_URI = /^(data:)([^,]*),(.*)/i;
                function absoluteToStylesheet(cssText, href) {
                    return (cssText || "").replace(URL_IN_CSS_REF, (origin, quote1, path1, quote2, path2, path3) => {
                        let filePath = path1 || path2 || path3,
                            maybeQuote = quote1 || quote2 || "";
                        if (!filePath) return origin;
                        if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath) || DATA_URI.test(filePath)) return `url(${maybeQuote}${filePath}${maybeQuote})`;
                        if ("/" === filePath[0])
                            return `url(${maybeQuote}${(href.indexOf("//") > -1 ? href.split("/").slice(0, 3).join("/") : href.split("/")[0]).split("?")[0] + filePath}${maybeQuote})`;
                        let stack = href.split("/"),
                            parts = filePath.split("/");
                        for (let part of (stack.pop(), parts))
                            if ("." === part) continue;
                            else ".." === part ? stack.pop() : stack.push(part);
                        return `url(${maybeQuote}${stack.join("/")}${maybeQuote})`;
                    });
                }
                let SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/,
                    SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/,
                    cachedDocument = new WeakMap();
                function absoluteToDoc(doc, attributeValue) {
                    return attributeValue && "" !== attributeValue.trim() ? getHref(doc, attributeValue) : attributeValue;
                }
                function getHref(doc, customHref) {
                    let a2 = cachedDocument.get(doc);
                    if ((a2 || ((a2 = doc.createElement("a")), cachedDocument.set(doc, a2)), customHref)) {
                        if (customHref.startsWith("blob:") || customHref.startsWith("data:")) return customHref;
                    } else customHref = "";
                    return (a2.setAttribute("href", customHref), a2.href);
                }
                function transformAttribute(doc, tagName, name, value, element, maskAttributeFn, ignoreCSSAttributes) {
                    if (!value) return value;
                    if ("src" === name || ("href" === name && ("use" !== tagName || "#" !== value[0])) || ("xlink:href" === name && "#" !== value[0]))
                        return absoluteToDoc(doc, value);
                    if ("background" === name && ("table" === tagName || "td" === tagName || "th" === tagName)) return absoluteToDoc(doc, value);
                    if ("srcset" === name)
                        return (function (doc, attributeValue) {
                            if ("" === attributeValue.trim()) return attributeValue;
                            let pos = 0;
                            function collectCharacters(regEx) {
                                let chars2,
                                    match = regEx.exec(attributeValue.substring(pos));
                                return match ? ((chars2 = match[0]), (pos += chars2.length), chars2) : "";
                            }
                            let output = [];
                            for (; collectCharacters(SRCSET_COMMAS_OR_SPACES), !(pos >= attributeValue.length);) {
                                let url = collectCharacters(SRCSET_NOT_SPACES);
                                if ("," === url.slice(-1)) ((url = absoluteToDoc(doc, url.substring(0, url.length - 1))), output.push(url));
                                else {
                                    let descriptorsStr = "";
                                    url = absoluteToDoc(doc, url);
                                    let inParens = !1;
                                    for (;;) {
                                        let c2 = attributeValue.charAt(pos);
                                        if ("" === c2) {
                                            output.push((url + descriptorsStr).trim());
                                            break;
                                        }
                                        if (inParens) ")" === c2 && (inParens = !1);
                                        else if ("," === c2) {
                                            ((pos += 1), output.push((url + descriptorsStr).trim()));
                                            break;
                                        } else "(" === c2 && (inParens = !0);
                                        ((descriptorsStr += c2), (pos += 1));
                                    }
                                }
                            }
                            return output.join(", ");
                        })(doc, value);
                    if ("style" === name) {
                        let processedStyle = absoluteToStylesheet(value, getHref(doc));
                        return (
                            ignoreCSSAttributes &&
                                ignoreCSSAttributes.size > 0 &&
                                (processedStyle = (function (cssText, ignoredProperties) {
                                    if (!cssText || 0 === ignoredProperties.size) return cssText;
                                    try {
                                        let properties = cssText.split(";"),
                                            filteredProperties = [];
                                        for (let property of properties) {
                                            if (!(property = property.trim())) continue;
                                            let colonIndex = property.indexOf(":");
                                            if (-1 === colonIndex) {
                                                filteredProperties.push(property);
                                                continue;
                                            }
                                            let propertyName = property.slice(0, colonIndex).trim();
                                            ignoredProperties.has(propertyName) || filteredProperties.push(property);
                                        }
                                        return filteredProperties.join("; ") + (filteredProperties.length > 0 && cssText.endsWith(";") ? ";" : "");
                                    } catch (error) {
                                        return (console.warn("Error filtering CSS properties:", error), cssText);
                                    }
                                })(processedStyle, ignoreCSSAttributes)),
                            processedStyle
                        );
                    } else if ("object" === tagName && "data" === name) return absoluteToDoc(doc, value);
                    return "function" == typeof maskAttributeFn ? maskAttributeFn(name, value, element) : value;
                }
                function ignoreAttribute(tagName, name, _value) {
                    return ("video" === tagName || "audio" === tagName) && "autoplay" === name;
                }
                function distanceToMatch(node, matchPredicate, limit = 1 / 0, distance = 0) {
                    return !node || node.nodeType !== node.ELEMENT_NODE || distance > limit
                        ? -1
                        : matchPredicate(node)
                          ? distance
                          : distanceToMatch(node.parentNode, matchPredicate, limit, distance + 1);
                }
                function createMatchPredicate(className, selector) {
                    return (node) => {
                        if (null === node) return !1;
                        try {
                            if (className) {
                                if ("string" == typeof className) {
                                    if (node.matches(`.${className}`)) return !0;
                                } else if (
                                    (function (el, regex) {
                                        for (let eIndex = el.classList.length; eIndex--;) {
                                            let className = el.classList[eIndex];
                                            if (regex.test(className)) return !0;
                                        }
                                        return !1;
                                    })(node, className)
                                )
                                    return !0;
                            }
                            if (selector && node.matches(selector)) return !0;
                            return !1;
                        } catch {
                            return !1;
                        }
                    };
                }
                function needMaskingText(node, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, maskAllText) {
                    try {
                        let el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
                        if (null === el) return !1;
                        if ("INPUT" === el.tagName) {
                            let autocomplete = el.getAttribute("autocomplete");
                            if (["current-password", "new-password", "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc"].includes(autocomplete)) return !0;
                        }
                        let maskDistance = -1,
                            unmaskDistance = -1;
                        if (maskAllText) {
                            if ((unmaskDistance = distanceToMatch(el, createMatchPredicate(unmaskTextClass, unmaskTextSelector))) < 0) return !0;
                            maskDistance = distanceToMatch(el, createMatchPredicate(maskTextClass, maskTextSelector), unmaskDistance >= 0 ? unmaskDistance : 1 / 0);
                        } else {
                            if ((maskDistance = distanceToMatch(el, createMatchPredicate(maskTextClass, maskTextSelector))) < 0) return !1;
                            unmaskDistance = distanceToMatch(el, createMatchPredicate(unmaskTextClass, unmaskTextSelector), maskDistance >= 0 ? maskDistance : 1 / 0);
                        }
                        return maskDistance >= 0 ? !(unmaskDistance >= 0) || maskDistance <= unmaskDistance : !(unmaskDistance >= 0) && !!maskAllText;
                    } catch (e2) {}
                    return !!maskAllText;
                }
                function lowerIfExists(maybeAttr) {
                    return null == maybeAttr ? "" : maybeAttr.toLowerCase();
                }
                function serializeNodeWithId(n2, options) {
                    let id,
                        {
                            doc,
                            mirror: mirror2,
                            blockClass,
                            blockSelector,
                            unblockSelector,
                            maskAllText,
                            maskTextClass,
                            unmaskTextClass,
                            maskTextSelector,
                            unmaskTextSelector,
                            skipChild = !1,
                            inlineStylesheet = !0,
                            maskInputOptions = {},
                            maskAttributeFn,
                            maskTextFn,
                            maskInputFn,
                            slimDOMOptions,
                            dataURLOptions = {},
                            inlineImages = !1,
                            recordCanvas = !1,
                            onSerialize,
                            onIframeLoad,
                            iframeLoadTimeout = 5e3,
                            onBlockedImageLoad,
                            onStylesheetLoad,
                            stylesheetLoadTimeout = 5e3,
                            keepIframeSrcFn = () => !1,
                            newlyAddedElement = !1,
                            ignoreCSSAttributes,
                        } = options,
                        { preserveWhiteSpace = !0 } = options,
                        _serializedNode = (function (n2, options) {
                            let {
                                    doc,
                                    mirror: mirror2,
                                    blockClass,
                                    blockSelector,
                                    unblockSelector,
                                    maskAllText,
                                    maskAttributeFn,
                                    maskTextClass,
                                    unmaskTextClass,
                                    maskTextSelector,
                                    unmaskTextSelector,
                                    inlineStylesheet,
                                    maskInputOptions = {},
                                    maskTextFn,
                                    maskInputFn,
                                    dataURLOptions = {},
                                    inlineImages,
                                    recordCanvas,
                                    keepIframeSrcFn,
                                    newlyAddedElement = !1,
                                    ignoreCSSAttributes,
                                } = options,
                                rootId = (function (doc, mirror2) {
                                    if (!mirror2.hasNode(doc)) return;
                                    let docId = mirror2.getId(doc);
                                    return 1 === docId ? void 0 : docId;
                                })(doc, mirror2);
                            switch (n2.nodeType) {
                                case n2.DOCUMENT_NODE:
                                    if ("CSS1Compat" !== n2.compatMode) return { type: NodeType$2.Document, childNodes: [], compatMode: n2.compatMode };
                                    return { type: NodeType$2.Document, childNodes: [] };
                                case n2.DOCUMENT_TYPE_NODE:
                                    return { type: NodeType$2.DocumentType, name: n2.name, publicId: n2.publicId, systemId: n2.systemId, rootId };
                                case n2.ELEMENT_NODE:
                                    return (function (n2, options) {
                                        let isCustomElement,
                                            {
                                                doc,
                                                blockClass,
                                                blockSelector,
                                                unblockSelector,
                                                inlineStylesheet,
                                                maskInputOptions = {},
                                                maskAttributeFn,
                                                maskInputFn,
                                                dataURLOptions = {},
                                                inlineImages,
                                                recordCanvas,
                                                keepIframeSrcFn,
                                                newlyAddedElement = !1,
                                                rootId,
                                                maskTextClass,
                                                unmaskTextClass,
                                                maskTextSelector,
                                                unmaskTextSelector,
                                                ignoreCSSAttributes,
                                            } = options,
                                            needBlock = (function (element, blockClass, blockSelector, unblockSelector) {
                                                try {
                                                    if (unblockSelector && element.matches(unblockSelector)) return !1;
                                                    if ("string" == typeof blockClass) {
                                                        if (element.classList.contains(blockClass)) return !0;
                                                    } else
                                                        for (let eIndex = element.classList.length; eIndex--;) {
                                                            let className = element.classList[eIndex];
                                                            if (blockClass.test(className)) return !0;
                                                        }
                                                    if (blockSelector) return element.matches(blockSelector);
                                                } catch (e2) {}
                                                return !1;
                                            })(n2, blockClass, blockSelector, unblockSelector),
                                            tagName = (function (element) {
                                                if (element instanceof HTMLFormElement) return "form";
                                                let processedTagName = toLowerCase(element.tagName);
                                                return tagNameRegex.test(processedTagName) ? "div" : processedTagName;
                                            })(n2),
                                            attributes2 = {},
                                            len = n2.attributes.length;
                                        for (let i2 = 0; i2 < len; i2++) {
                                            let attr = n2.attributes[i2];
                                            attr.name &&
                                                !ignoreAttribute(tagName, attr.name, attr.value) &&
                                                (attributes2[attr.name] = transformAttribute(
                                                    doc,
                                                    tagName,
                                                    toLowerCase(attr.name),
                                                    attr.value,
                                                    n2,
                                                    maskAttributeFn,
                                                    ignoreCSSAttributes,
                                                ));
                                        }
                                        if ("link" === tagName && inlineStylesheet) {
                                            let stylesheet = Array.from(doc.styleSheets).find((s2) => s2.href === n2.href),
                                                cssText = null;
                                            (stylesheet && (cssText = stringifyStylesheet(stylesheet)),
                                                cssText &&
                                                    ((attributes2.rel = null),
                                                    (attributes2.href = null),
                                                    (attributes2.crossorigin = null),
                                                    (attributes2._cssText = absoluteToStylesheet(cssText, stylesheet.href))));
                                        }
                                        if ("style" === tagName && n2.sheet && !(n2.innerText || n2.textContent || "").trim().length) {
                                            let cssText = stringifyStylesheet(n2.sheet);
                                            cssText && (attributes2._cssText = absoluteToStylesheet(cssText, getHref(doc)));
                                        }
                                        if ("input" === tagName || "textarea" === tagName || "select" === tagName || "option" === tagName) {
                                            let type = getInputType(n2),
                                                value = getInputValue(n2, toUpperCase(tagName), type),
                                                checked = n2.checked;
                                            if ("submit" !== type && "button" !== type && value) {
                                                let forceMask = needMaskingText(
                                                    n2,
                                                    maskTextClass,
                                                    maskTextSelector,
                                                    unmaskTextClass,
                                                    unmaskTextSelector,
                                                    shouldMaskInput({ type, tagName: toUpperCase(tagName), maskInputOptions }),
                                                );
                                                attributes2.value = maskInputValue({ isMasked: forceMask, element: n2, value, maskInputFn });
                                            }
                                            checked && (attributes2.checked = checked);
                                        }
                                        if (
                                            ("option" === tagName && (n2.selected && !maskInputOptions.select ? (attributes2.selected = !0) : delete attributes2.selected),
                                            "canvas" === tagName && recordCanvas)
                                        ) {
                                            if ("2d" === n2.__context)
                                                !(function (canvas) {
                                                    let ctx = canvas.getContext("2d");
                                                    if (!ctx) return !0;
                                                    for (let x = 0; x < canvas.width; x += 50)
                                                        for (let y = 0; y < canvas.height; y += 50) {
                                                            let getImageData = ctx.getImageData;
                                                            if (
                                                                new Uint32Array(
                                                                    (ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData).call(
                                                                        ctx,
                                                                        x,
                                                                        y,
                                                                        Math.min(50, canvas.width - x),
                                                                        Math.min(50, canvas.height - y),
                                                                    ).data.buffer,
                                                                ).some((pixel) => 0 !== pixel)
                                                            )
                                                                return !1;
                                                        }
                                                    return !0;
                                                })(n2) && (attributes2.rr_dataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality));
                                            else if (!("__context" in n2)) {
                                                let canvasDataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality),
                                                    blankCanvas = doc.createElement("canvas");
                                                ((blankCanvas.width = n2.width),
                                                    (blankCanvas.height = n2.height),
                                                    canvasDataURL !== blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality) &&
                                                        (attributes2.rr_dataURL = canvasDataURL));
                                            }
                                        }
                                        if ("img" === tagName && inlineImages) {
                                            canvasService || (canvasCtx = (canvasService = doc.createElement("canvas")).getContext("2d"));
                                            let imageSrc = n2.currentSrc || n2.getAttribute("src") || "<unknown-src>",
                                                priorCrossOrigin = n2.crossOrigin,
                                                recordInlineImage = () => {
                                                    n2.removeEventListener("load", recordInlineImage);
                                                    try {
                                                        ((canvasService.width = n2.naturalWidth),
                                                            (canvasService.height = n2.naturalHeight),
                                                            canvasCtx.drawImage(n2, 0, 0),
                                                            (attributes2.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality)));
                                                    } catch (err) {
                                                        if ("anonymous" !== n2.crossOrigin) {
                                                            ((n2.crossOrigin = "anonymous"),
                                                                n2.complete && 0 !== n2.naturalWidth ? recordInlineImage() : n2.addEventListener("load", recordInlineImage));
                                                            return;
                                                        }
                                                        console.warn(`Cannot inline img src=${imageSrc}! Error: ${err}`);
                                                    }
                                                    "anonymous" === n2.crossOrigin &&
                                                        (priorCrossOrigin ? (attributes2.crossOrigin = priorCrossOrigin) : n2.removeAttribute("crossorigin"));
                                                };
                                            n2.complete && 0 !== n2.naturalWidth ? recordInlineImage() : n2.addEventListener("load", recordInlineImage);
                                        }
                                        if (
                                            (("audio" === tagName || "video" === tagName) &&
                                                ((attributes2.rr_mediaState = n2.paused ? "paused" : "played"), (attributes2.rr_mediaCurrentTime = n2.currentTime)),
                                            !newlyAddedElement &&
                                                (n2.scrollLeft && (attributes2.rr_scrollLeft = n2.scrollLeft), n2.scrollTop && (attributes2.rr_scrollTop = n2.scrollTop)),
                                            needBlock)
                                        ) {
                                            let { width, height } = n2.getBoundingClientRect();
                                            attributes2 = { class: attributes2.class, rr_width: `${width}px`, rr_height: `${height}px` };
                                        }
                                        "iframe" !== tagName ||
                                            keepIframeSrcFn(attributes2.src) ||
                                            (needBlock || getIframeContentDocument(n2) || (attributes2.rr_src = attributes2.src), delete attributes2.src);
                                        try {
                                            customElements.get(tagName) && (isCustomElement = !0);
                                        } catch (e2) {}
                                        return {
                                            type: NodeType$2.Element,
                                            tagName,
                                            attributes: attributes2,
                                            childNodes: [],
                                            isSVG: !!("svg" === n2.tagName || n2.ownerSVGElement) || void 0,
                                            needBlock,
                                            rootId,
                                            isCustom: isCustomElement,
                                        };
                                    })(n2, {
                                        doc,
                                        blockClass,
                                        blockSelector,
                                        unblockSelector,
                                        inlineStylesheet,
                                        maskAttributeFn,
                                        maskInputOptions,
                                        maskInputFn,
                                        dataURLOptions,
                                        inlineImages,
                                        recordCanvas,
                                        keepIframeSrcFn,
                                        newlyAddedElement,
                                        rootId,
                                        maskTextClass,
                                        unmaskTextClass,
                                        maskTextSelector,
                                        unmaskTextSelector,
                                        ignoreCSSAttributes,
                                    });
                                case n2.TEXT_NODE:
                                    return (function (n2, options) {
                                        let {
                                                maskAllText,
                                                maskTextClass,
                                                unmaskTextClass,
                                                maskTextSelector,
                                                unmaskTextSelector,
                                                maskTextFn,
                                                maskInputOptions,
                                                maskInputFn,
                                                rootId,
                                            } = options,
                                            parentTagName = n2.parentNode && n2.parentNode.tagName,
                                            textContent = n2.textContent,
                                            isStyle = "STYLE" === parentTagName || void 0,
                                            isScript = "SCRIPT" === parentTagName || void 0,
                                            isTextarea = "TEXTAREA" === parentTagName || void 0;
                                        if (isStyle && textContent) {
                                            try {
                                                n2.nextSibling || n2.previousSibling || (n2.parentNode.sheet?.cssRules && (textContent = stringifyStylesheet(n2.parentNode.sheet)));
                                            } catch (err) {
                                                console.warn(`Cannot get CSS styles from text's parentNode. Error: ${err}`, n2);
                                            }
                                            textContent = absoluteToStylesheet(textContent, getHref(options.doc));
                                        }
                                        isScript && (textContent = "SCRIPT_PLACEHOLDER");
                                        let forceMask = needMaskingText(n2, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, maskAllText);
                                        return (
                                            isStyle ||
                                                isScript ||
                                                isTextarea ||
                                                !textContent ||
                                                !forceMask ||
                                                (textContent = maskTextFn ? maskTextFn(textContent, n2.parentElement) : textContent.replace(/[\S]/g, "*")),
                                            isTextarea &&
                                                textContent &&
                                                (maskInputOptions.textarea || forceMask) &&
                                                (textContent = maskInputFn ? maskInputFn(textContent, n2.parentNode) : textContent.replace(/[\S]/g, "*")),
                                            "OPTION" === parentTagName &&
                                                textContent &&
                                                (textContent = maskInputValue({
                                                    isMasked: needMaskingText(
                                                        n2,
                                                        maskTextClass,
                                                        maskTextSelector,
                                                        unmaskTextClass,
                                                        unmaskTextSelector,
                                                        shouldMaskInput({ type: null, tagName: parentTagName, maskInputOptions }),
                                                    ),
                                                    element: n2,
                                                    value: textContent,
                                                    maskInputFn,
                                                })),
                                            { type: NodeType$2.Text, textContent: textContent || "", isStyle, rootId }
                                        );
                                    })(n2, {
                                        doc,
                                        maskAllText,
                                        maskTextClass,
                                        unmaskTextClass,
                                        maskTextSelector,
                                        unmaskTextSelector,
                                        maskTextFn,
                                        maskInputOptions,
                                        maskInputFn,
                                        rootId,
                                    });
                                case n2.CDATA_SECTION_NODE:
                                    return { type: NodeType$2.CDATA, textContent: "", rootId };
                                case n2.COMMENT_NODE:
                                    return { type: NodeType$2.Comment, textContent: n2.textContent || "", rootId };
                                default:
                                    return !1;
                            }
                        })(n2, {
                            doc,
                            mirror: mirror2,
                            blockClass,
                            blockSelector,
                            maskAllText,
                            unblockSelector,
                            maskTextClass,
                            unmaskTextClass,
                            maskTextSelector,
                            unmaskTextSelector,
                            inlineStylesheet,
                            maskInputOptions,
                            maskAttributeFn,
                            maskTextFn,
                            maskInputFn,
                            dataURLOptions,
                            inlineImages,
                            recordCanvas,
                            keepIframeSrcFn,
                            newlyAddedElement,
                            ignoreCSSAttributes,
                        });
                    if (!_serializedNode) return (console.warn(n2, "not serialized"), null);
                    id = mirror2.hasNode(n2)
                        ? mirror2.getId(n2)
                        : !(function (sn, slimDOMOptions) {
                                if (slimDOMOptions.comment && sn.type === NodeType$2.Comment) return !0;
                                if (sn.type === NodeType$2.Element) {
                                    if (
                                        slimDOMOptions.script &&
                                        ("script" === sn.tagName ||
                                            ("link" === sn.tagName && ("preload" === sn.attributes.rel || "modulepreload" === sn.attributes.rel)) ||
                                            ("link" === sn.tagName &&
                                                "prefetch" === sn.attributes.rel &&
                                                "string" == typeof sn.attributes.href &&
                                                "js" === extractFileExtension(sn.attributes.href)))
                                    )
                                        return !0;
                                    else if (
                                        slimDOMOptions.headFavicon &&
                                        (("link" === sn.tagName && "shortcut icon" === sn.attributes.rel) ||
                                            ("meta" === sn.tagName &&
                                                (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) ||
                                                    "application-name" === lowerIfExists(sn.attributes.name) ||
                                                    "icon" === lowerIfExists(sn.attributes.rel) ||
                                                    "apple-touch-icon" === lowerIfExists(sn.attributes.rel) ||
                                                    "shortcut icon" === lowerIfExists(sn.attributes.rel))))
                                    )
                                        return !0;
                                    else if ("meta" === sn.tagName) {
                                        if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) return !0;
                                        else if (
                                            slimDOMOptions.headMetaSocial &&
                                            (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) ||
                                                lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) ||
                                                "pinterest" === lowerIfExists(sn.attributes.name))
                                        )
                                            return !0;
                                        else if (
                                            slimDOMOptions.headMetaRobots &&
                                            ("robots" === lowerIfExists(sn.attributes.name) ||
                                                "googlebot" === lowerIfExists(sn.attributes.name) ||
                                                "bingbot" === lowerIfExists(sn.attributes.name))
                                        )
                                            return !0;
                                        else if (slimDOMOptions.headMetaHttpEquiv && void 0 !== sn.attributes["http-equiv"]) return !0;
                                        else if (
                                            slimDOMOptions.headMetaAuthorship &&
                                            ("author" === lowerIfExists(sn.attributes.name) ||
                                                "generator" === lowerIfExists(sn.attributes.name) ||
                                                "framework" === lowerIfExists(sn.attributes.name) ||
                                                "publisher" === lowerIfExists(sn.attributes.name) ||
                                                "progid" === lowerIfExists(sn.attributes.name) ||
                                                lowerIfExists(sn.attributes.property).match(/^article:/) ||
                                                lowerIfExists(sn.attributes.property).match(/^product:/))
                                        )
                                            return !0;
                                        else if (
                                            slimDOMOptions.headMetaVerification &&
                                            ("google-site-verification" === lowerIfExists(sn.attributes.name) ||
                                                "yandex-verification" === lowerIfExists(sn.attributes.name) ||
                                                "csrf-token" === lowerIfExists(sn.attributes.name) ||
                                                "p:domain_verify" === lowerIfExists(sn.attributes.name) ||
                                                "verify-v1" === lowerIfExists(sn.attributes.name) ||
                                                "verification" === lowerIfExists(sn.attributes.name) ||
                                                "shopify-checkout-api-token" === lowerIfExists(sn.attributes.name))
                                        )
                                            return !0;
                                    }
                                }
                                return !1;
                            })(_serializedNode, slimDOMOptions) &&
                            (preserveWhiteSpace ||
                                _serializedNode.type !== NodeType$2.Text ||
                                _serializedNode.isStyle ||
                                _serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length)
                          ? genId()
                          : -2;
                    let serializedNode2 = Object.assign(_serializedNode, { id });
                    if ((mirror2.add(n2, serializedNode2), -2 === id)) return null;
                    onSerialize && onSerialize(n2);
                    let recordChild = !skipChild;
                    if (serializedNode2.type === NodeType$2.Element) {
                        recordChild = recordChild && !serializedNode2.needBlock;
                        let shadowRoot = n2.shadowRoot;
                        shadowRoot && isNativeShadowDom(shadowRoot) && (serializedNode2.isShadowHost = !0);
                    }
                    if ((serializedNode2.type === NodeType$2.Document || serializedNode2.type === NodeType$2.Element) && recordChild) {
                        slimDOMOptions.headWhitespace && serializedNode2.type === NodeType$2.Element && "head" === serializedNode2.tagName && (preserveWhiteSpace = !1);
                        let bypassOptions = {
                            doc,
                            mirror: mirror2,
                            blockClass,
                            blockSelector,
                            maskAllText,
                            unblockSelector,
                            maskTextClass,
                            unmaskTextClass,
                            maskTextSelector,
                            unmaskTextSelector,
                            skipChild,
                            inlineStylesheet,
                            maskInputOptions,
                            maskAttributeFn,
                            maskTextFn,
                            maskInputFn,
                            slimDOMOptions,
                            dataURLOptions,
                            inlineImages,
                            recordCanvas,
                            preserveWhiteSpace,
                            onSerialize,
                            onIframeLoad,
                            iframeLoadTimeout,
                            onBlockedImageLoad,
                            onStylesheetLoad,
                            stylesheetLoadTimeout,
                            keepIframeSrcFn,
                            ignoreCSSAttributes,
                        };
                        for (let childN of n2.childNodes ? Array.from(n2.childNodes) : []) {
                            let serializedChildNode = serializeNodeWithId(childN, bypassOptions);
                            serializedChildNode && serializedNode2.childNodes.push(serializedChildNode);
                        }
                        if (n2.nodeType === n2.ELEMENT_NODE && n2.shadowRoot)
                            for (let childN of Array.from(n2.shadowRoot.childNodes)) {
                                let serializedChildNode = serializeNodeWithId(childN, bypassOptions);
                                serializedChildNode &&
                                    (isNativeShadowDom(n2.shadowRoot) && (serializedChildNode.isShadow = !0), serializedNode2.childNodes.push(serializedChildNode));
                            }
                    }
                    if (
                        (n2.parentNode && isShadowRoot(n2.parentNode) && isNativeShadowDom(n2.parentNode) && (serializedNode2.isShadow = !0),
                        serializedNode2.type !== NodeType$2.Element ||
                            "iframe" !== serializedNode2.tagName ||
                            serializedNode2.needBlock ||
                            (function (iframeEl, listener, iframeLoadTimeout) {
                                let readyState,
                                    win = iframeEl.contentWindow;
                                if (!win) return;
                                let fired = !1;
                                try {
                                    readyState = win.document.readyState;
                                } catch (error) {
                                    return;
                                }
                                if ("complete" !== readyState) {
                                    let timer = setTimeout$2(() => {
                                        fired || (listener(), (fired = !0));
                                    }, iframeLoadTimeout);
                                    iframeEl.addEventListener("load", () => {
                                        (clearTimeout$1(timer), (fired = !0), listener());
                                    });
                                    return;
                                }
                                let blankUrl = "about:blank";
                                if (win.location.href !== blankUrl || iframeEl.src === blankUrl || "" === iframeEl.src)
                                    return (setTimeout$2(listener, 0), iframeEl.addEventListener("load", listener));
                                iframeEl.addEventListener("load", listener);
                            })(
                                n2,
                                () => {
                                    let iframeDoc = getIframeContentDocument(n2);
                                    if (iframeDoc && onIframeLoad) {
                                        let serializedIframeNode = serializeNodeWithId(iframeDoc, {
                                            doc: iframeDoc,
                                            mirror: mirror2,
                                            blockClass,
                                            blockSelector,
                                            unblockSelector,
                                            maskAllText,
                                            maskTextClass,
                                            unmaskTextClass,
                                            maskTextSelector,
                                            unmaskTextSelector,
                                            skipChild: !1,
                                            inlineStylesheet,
                                            maskInputOptions,
                                            maskAttributeFn,
                                            maskTextFn,
                                            maskInputFn,
                                            slimDOMOptions,
                                            dataURLOptions,
                                            inlineImages,
                                            recordCanvas,
                                            preserveWhiteSpace,
                                            onSerialize,
                                            onIframeLoad,
                                            iframeLoadTimeout,
                                            onStylesheetLoad,
                                            stylesheetLoadTimeout,
                                            keepIframeSrcFn,
                                            ignoreCSSAttributes,
                                        });
                                        serializedIframeNode && onIframeLoad(n2, serializedIframeNode);
                                    }
                                },
                                iframeLoadTimeout,
                            ),
                        serializedNode2.type === NodeType$2.Element && "img" === serializedNode2.tagName && !n2.complete && serializedNode2.needBlock)
                    ) {
                        let updateImageDimensions = () => {
                            if (n2.isConnected && !n2.complete && onBlockedImageLoad)
                                try {
                                    let rect = n2.getBoundingClientRect();
                                    rect.width > 0 && rect.height > 0 && onBlockedImageLoad(n2, serializedNode2, rect);
                                } catch (error) {}
                            n2.removeEventListener("load", updateImageDimensions);
                        };
                        n2.isConnected && n2.addEventListener("load", updateImageDimensions);
                    }
                    return (
                        serializedNode2.type === NodeType$2.Element &&
                            "link" === serializedNode2.tagName &&
                            "string" == typeof serializedNode2.attributes.rel &&
                            ("stylesheet" === serializedNode2.attributes.rel ||
                                ("preload" === serializedNode2.attributes.rel &&
                                    "string" == typeof serializedNode2.attributes.href &&
                                    "css" === extractFileExtension(serializedNode2.attributes.href))) &&
                            (function (link, listener, styleSheetLoadTimeout) {
                                let styleSheetLoaded,
                                    fired = !1;
                                try {
                                    styleSheetLoaded = link.sheet;
                                } catch (error) {
                                    return;
                                }
                                if (styleSheetLoaded) return;
                                let timer = setTimeout$2(() => {
                                    fired || (listener(), (fired = !0));
                                }, styleSheetLoadTimeout);
                                link.addEventListener("load", () => {
                                    (clearTimeout$1(timer), (fired = !0), listener());
                                });
                            })(
                                n2,
                                () => {
                                    if (onStylesheetLoad) {
                                        let serializedLinkNode = serializeNodeWithId(n2, {
                                            doc,
                                            mirror: mirror2,
                                            blockClass,
                                            blockSelector,
                                            unblockSelector,
                                            maskAllText,
                                            maskTextClass,
                                            unmaskTextClass,
                                            maskTextSelector,
                                            unmaskTextSelector,
                                            skipChild: !1,
                                            inlineStylesheet,
                                            maskInputOptions,
                                            maskAttributeFn,
                                            maskTextFn,
                                            maskInputFn,
                                            slimDOMOptions,
                                            dataURLOptions,
                                            inlineImages,
                                            recordCanvas,
                                            preserveWhiteSpace,
                                            onSerialize,
                                            onIframeLoad,
                                            iframeLoadTimeout,
                                            onStylesheetLoad,
                                            stylesheetLoadTimeout,
                                            keepIframeSrcFn,
                                            ignoreCSSAttributes,
                                        });
                                        serializedLinkNode && onStylesheetLoad(n2, serializedLinkNode);
                                    }
                                },
                                stylesheetLoadTimeout,
                            ),
                        serializedNode2.type === NodeType$2.Element && delete serializedNode2.needBlock,
                        serializedNode2
                    );
                }
                function on(type, fn, target = document) {
                    let options = { capture: !0, passive: !0 };
                    return (target.addEventListener(type, fn, options), () => target.removeEventListener(type, fn, options));
                }
                let DEPARTED_MIRROR_ACCESS_WARNING =
                        "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.",
                    _mirror = {
                        map: {},
                        getId: () => (console.error(DEPARTED_MIRROR_ACCESS_WARNING), -1),
                        getNode: () => (console.error(DEPARTED_MIRROR_ACCESS_WARNING), null),
                        removeNodeFromMap() {
                            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
                        },
                        has: () => (console.error(DEPARTED_MIRROR_ACCESS_WARNING), !1),
                        reset() {
                            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
                        },
                    };
                function throttle$1(func, wait, options = {}) {
                    let timeout = null,
                        previous = 0;
                    return function (...args) {
                        let now = Date.now();
                        previous || !1 !== options.leading || (previous = now);
                        let remaining = wait - (now - previous),
                            context = this;
                        remaining <= 0 || remaining > wait
                            ? (timeout &&
                                  ((function (...rest) {
                                      getImplementation("clearTimeout")(...rest);
                                  })(timeout),
                                  (timeout = null)),
                              (previous = now),
                              func.apply(context, args))
                            : timeout ||
                              !1 === options.trailing ||
                              (timeout = setTimeout$1(() => {
                                  ((previous = !1 === options.leading ? 0 : Date.now()), (timeout = null), func.apply(context, args));
                              }, remaining));
                    };
                }
                function patch(source, name, replacement) {
                    try {
                        if (!(name in source)) return () => {};
                        let original = source[name],
                            wrapped = replacement(original);
                        return (
                            "function" == typeof wrapped &&
                                ((wrapped.prototype = wrapped.prototype || {}), Object.defineProperties(wrapped, { __rrweb_original__: { enumerable: !1, value: original } })),
                            (source[name] = wrapped),
                            () => {
                                source[name] = original;
                            }
                        );
                    } catch {
                        return () => {};
                    }
                }
                "u" > typeof window &&
                    window.Proxy &&
                    window.Reflect &&
                    (_mirror = new Proxy(_mirror, {
                        get: (target, prop, receiver) => ("map" === prop && console.error(DEPARTED_MIRROR_ACCESS_WARNING), Reflect.get(target, prop, receiver)),
                    }));
                let nowTimestamp = Date.now;
                function getWindowScroll(win) {
                    let doc = win.document;
                    return {
                        left: doc.scrollingElement
                            ? doc.scrollingElement.scrollLeft
                            : void 0 !== win.pageXOffset
                              ? win.pageXOffset
                              : doc?.documentElement.scrollLeft || doc?.body?.parentElement?.scrollLeft || doc?.body?.scrollLeft || 0,
                        top: doc.scrollingElement
                            ? doc.scrollingElement.scrollTop
                            : void 0 !== win.pageYOffset
                              ? win.pageYOffset
                              : doc?.documentElement.scrollTop || doc?.body?.parentElement?.scrollTop || doc?.body?.scrollTop || 0,
                    };
                }
                function getWindowHeight() {
                    return window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || (document.body && document.body.clientHeight);
                }
                function getWindowWidth() {
                    return window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth);
                }
                function closestElementOfNode$1(node) {
                    if (!node) return null;
                    try {
                        return node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
                    } catch (error) {
                        return null;
                    }
                }
                function isBlocked(node, blockClass, blockSelector, unblockSelector, checkAncestors) {
                    if (!node) return !1;
                    let el = closestElementOfNode$1(node);
                    if (!el) return !1;
                    let blockedPredicate = createMatchPredicate(blockClass, blockSelector);
                    if (!checkAncestors) {
                        let isUnblocked = unblockSelector && el.matches(unblockSelector);
                        return blockedPredicate(el) && !isUnblocked;
                    }
                    let blockDistance = distanceToMatch(el, blockedPredicate),
                        unblockDistance = -1;
                    return (
                        !(blockDistance < 0) &&
                        (unblockSelector && (unblockDistance = distanceToMatch(el, createMatchPredicate(null, unblockSelector))),
                        (blockDistance > -1 && unblockDistance < 0) || blockDistance < unblockDistance)
                    );
                }
                function isIgnored(n2, mirror2) {
                    return -2 === mirror2.getId(n2);
                }
                function legacy_isTouchEvent(event) {
                    return !!event.changedTouches;
                }
                function isSerializedIframe(n2, mirror2) {
                    return !!("IFRAME" === n2.nodeName && mirror2.getMeta(n2));
                }
                function isSerializedStylesheet(n2, mirror2) {
                    return !!("LINK" === n2.nodeName && n2.nodeType === n2.ELEMENT_NODE && n2.getAttribute && "stylesheet" === n2.getAttribute("rel") && mirror2.getMeta(n2));
                }
                function hasShadowRoot(n2) {
                    return !!n2?.shadowRoot;
                }
                /[1-9][0-9]{12}/.test(Date.now().toString()) || (nowTimestamp = () => new Date().getTime());
                class StyleSheetMirror {
                    constructor() {
                        ((this.id = 1), (this.styleIDMap = new WeakMap()), (this.idStyleMap = new Map()));
                    }
                    getId(stylesheet) {
                        return this.styleIDMap.get(stylesheet) ?? -1;
                    }
                    has(stylesheet) {
                        return this.styleIDMap.has(stylesheet);
                    }
                    add(stylesheet, id) {
                        let newId;
                        return this.has(stylesheet)
                            ? this.getId(stylesheet)
                            : ((newId = void 0 === id ? this.id++ : id), this.styleIDMap.set(stylesheet, newId), this.idStyleMap.set(newId, stylesheet), newId);
                    }
                    getStyle(id) {
                        return this.idStyleMap.get(id) || null;
                    }
                    reset() {
                        ((this.styleIDMap = new WeakMap()), (this.idStyleMap = new Map()), (this.id = 1));
                    }
                    generateId() {
                        return this.id++;
                    }
                }
                function getShadowHost(n2) {
                    let shadowHost = null;
                    return (n2.getRootNode?.()?.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n2.getRootNode().host && (shadowHost = n2.getRootNode().host), shadowHost);
                }
                function inDom(n2) {
                    let doc = n2.ownerDocument;
                    return (
                        !!doc &&
                        (doc.contains(n2) ||
                            (function (n2) {
                                let doc = n2.ownerDocument;
                                if (!doc) return !1;
                                let shadowHost = (function (n2) {
                                    let shadowHost,
                                        rootShadowHost = n2;
                                    for (; (shadowHost = getShadowHost(rootShadowHost));) rootShadowHost = shadowHost;
                                    return rootShadowHost;
                                })(n2);
                                return doc.contains(shadowHost);
                            })(n2))
                    );
                }
                let cachedImplementations = {};
                function getImplementation(name) {
                    let cached = cachedImplementations[name];
                    if (cached) return cached;
                    let document2 = window.document,
                        impl = window[name];
                    if (document2 && "function" == typeof document2.createElement)
                        try {
                            let sandbox = document2.createElement("iframe");
                            ((sandbox.hidden = !0), document2.head.appendChild(sandbox));
                            let contentWindow = sandbox.contentWindow;
                            (contentWindow && contentWindow[name] && (impl = contentWindow[name]), document2.head.removeChild(sandbox));
                        } catch (e2) {}
                    return (cachedImplementations[name] = impl.bind(window));
                }
                function setTimeout$1(...rest) {
                    return getImplementation("setTimeout")(...rest);
                }
                var EventType =
                        (((EventType2 = EventType || {})[(EventType2.DomContentLoaded = 0)] = "DomContentLoaded"),
                        (EventType2[(EventType2.Load = 1)] = "Load"),
                        (EventType2[(EventType2.FullSnapshot = 2)] = "FullSnapshot"),
                        (EventType2[(EventType2.IncrementalSnapshot = 3)] = "IncrementalSnapshot"),
                        (EventType2[(EventType2.Meta = 4)] = "Meta"),
                        (EventType2[(EventType2.Custom = 5)] = "Custom"),
                        (EventType2[(EventType2.Plugin = 6)] = "Plugin"),
                        EventType2),
                    IncrementalSource =
                        (((IncrementalSource2 = IncrementalSource || {})[(IncrementalSource2.Mutation = 0)] = "Mutation"),
                        (IncrementalSource2[(IncrementalSource2.MouseMove = 1)] = "MouseMove"),
                        (IncrementalSource2[(IncrementalSource2.MouseInteraction = 2)] = "MouseInteraction"),
                        (IncrementalSource2[(IncrementalSource2.Scroll = 3)] = "Scroll"),
                        (IncrementalSource2[(IncrementalSource2.ViewportResize = 4)] = "ViewportResize"),
                        (IncrementalSource2[(IncrementalSource2.Input = 5)] = "Input"),
                        (IncrementalSource2[(IncrementalSource2.TouchMove = 6)] = "TouchMove"),
                        (IncrementalSource2[(IncrementalSource2.MediaInteraction = 7)] = "MediaInteraction"),
                        (IncrementalSource2[(IncrementalSource2.StyleSheetRule = 8)] = "StyleSheetRule"),
                        (IncrementalSource2[(IncrementalSource2.CanvasMutation = 9)] = "CanvasMutation"),
                        (IncrementalSource2[(IncrementalSource2.Font = 10)] = "Font"),
                        (IncrementalSource2[(IncrementalSource2.Log = 11)] = "Log"),
                        (IncrementalSource2[(IncrementalSource2.Drag = 12)] = "Drag"),
                        (IncrementalSource2[(IncrementalSource2.StyleDeclaration = 13)] = "StyleDeclaration"),
                        (IncrementalSource2[(IncrementalSource2.Selection = 14)] = "Selection"),
                        (IncrementalSource2[(IncrementalSource2.AdoptedStyleSheet = 15)] = "AdoptedStyleSheet"),
                        (IncrementalSource2[(IncrementalSource2.CustomElement = 16)] = "CustomElement"),
                        IncrementalSource2),
                    MouseInteractions =
                        (((MouseInteractions2 = MouseInteractions || {})[(MouseInteractions2.MouseUp = 0)] = "MouseUp"),
                        (MouseInteractions2[(MouseInteractions2.MouseDown = 1)] = "MouseDown"),
                        (MouseInteractions2[(MouseInteractions2.Click = 2)] = "Click"),
                        (MouseInteractions2[(MouseInteractions2.ContextMenu = 3)] = "ContextMenu"),
                        (MouseInteractions2[(MouseInteractions2.DblClick = 4)] = "DblClick"),
                        (MouseInteractions2[(MouseInteractions2.Focus = 5)] = "Focus"),
                        (MouseInteractions2[(MouseInteractions2.Blur = 6)] = "Blur"),
                        (MouseInteractions2[(MouseInteractions2.TouchStart = 7)] = "TouchStart"),
                        (MouseInteractions2[(MouseInteractions2.TouchMove_Departed = 8)] = "TouchMove_Departed"),
                        (MouseInteractions2[(MouseInteractions2.TouchEnd = 9)] = "TouchEnd"),
                        (MouseInteractions2[(MouseInteractions2.TouchCancel = 10)] = "TouchCancel"),
                        MouseInteractions2),
                    PointerTypes =
                        (((PointerTypes2 = PointerTypes || {})[(PointerTypes2.Mouse = 0)] = "Mouse"),
                        (PointerTypes2[(PointerTypes2.Pen = 1)] = "Pen"),
                        (PointerTypes2[(PointerTypes2.Touch = 2)] = "Touch"),
                        PointerTypes2),
                    MediaInteractions =
                        (((MediaInteractions2 = MediaInteractions || {})[(MediaInteractions2.Play = 0)] = "Play"),
                        (MediaInteractions2[(MediaInteractions2.Pause = 1)] = "Pause"),
                        (MediaInteractions2[(MediaInteractions2.Seeked = 2)] = "Seeked"),
                        (MediaInteractions2[(MediaInteractions2.VolumeChange = 3)] = "VolumeChange"),
                        (MediaInteractions2[(MediaInteractions2.RateChange = 4)] = "RateChange"),
                        MediaInteractions2);
                function getIFrameContentDocument(iframe) {
                    try {
                        return iframe.contentDocument;
                    } catch (e2) {}
                }
                class DoubleLinkedList {
                    constructor() {
                        ((this.length = 0), (this.head = null), (this.tail = null));
                    }
                    get(position) {
                        if (position >= this.length) throw Error("Position outside of list range");
                        let current = this.head;
                        for (let index = 0; index < position; index++) current = current?.next || null;
                        return current;
                    }
                    addNode(n2) {
                        let node = { value: n2, previous: null, next: null };
                        if (((n2.__ln = node), n2.previousSibling && "__ln" in n2.previousSibling)) {
                            let current = n2.previousSibling.__ln.next;
                            ((node.next = current), (node.previous = n2.previousSibling.__ln), (n2.previousSibling.__ln.next = node), current && (current.previous = node));
                        } else if (n2.nextSibling && "__ln" in n2.nextSibling && n2.nextSibling.__ln.previous) {
                            let current = n2.nextSibling.__ln.previous;
                            ((node.previous = current), (node.next = n2.nextSibling.__ln), (n2.nextSibling.__ln.previous = node), current && (current.next = node));
                        } else (this.head && (this.head.previous = node), (node.next = this.head), (this.head = node));
                        (null === node.next && (this.tail = node), this.length++);
                    }
                    removeNode(n2) {
                        let current = n2.__ln;
                        this.head &&
                            (current.previous
                                ? ((current.previous.next = current.next), current.next ? (current.next.previous = current.previous) : (this.tail = current.previous))
                                : ((this.head = current.next), this.head ? (this.head.previous = null) : (this.tail = null)),
                            n2.__ln && delete n2.__ln,
                            this.length--);
                    }
                }
                let moveKey = (id, parentId) => `${id}@${parentId}`;
                class MutationBuffer {
                    constructor() {
                        ((this.frozen = !1),
                            (this.locked = !1),
                            (this.texts = []),
                            (this.attributes = []),
                            (this.attributeMap = new WeakMap()),
                            (this.removes = []),
                            (this.mapRemoves = []),
                            (this.movedMap = {}),
                            (this.addedSet = new Set()),
                            (this.movedSet = new Set()),
                            (this.droppedSet = new Set()),
                            (this.processMutations = (mutations) => {
                                (mutations.forEach(this.processMutation), this.emit());
                            }),
                            (this.emit = () => {
                                if (this.frozen || this.locked) return;
                                let adds = [],
                                    addedIds = new Set(),
                                    addList = new DoubleLinkedList(),
                                    getNextId = (n2) => {
                                        let ns = n2,
                                            nextId = -2;
                                        for (; -2 === nextId;) nextId = (ns = ns && ns.nextSibling) && this.mirror.getId(ns);
                                        return nextId;
                                    },
                                    pushAdd = (n2) => {
                                        if (!n2.parentNode || !inDom(n2)) return;
                                        let parentId = isShadowRoot(n2.parentNode) ? this.mirror.getId(getShadowHost(n2)) : this.mirror.getId(n2.parentNode),
                                            nextId = getNextId(n2);
                                        if (-1 === parentId || -1 === nextId) return addList.addNode(n2);
                                        let sn = serializeNodeWithId(n2, {
                                            doc: this.doc,
                                            mirror: this.mirror,
                                            blockClass: this.blockClass,
                                            blockSelector: this.blockSelector,
                                            maskAllText: this.maskAllText,
                                            unblockSelector: this.unblockSelector,
                                            maskTextClass: this.maskTextClass,
                                            unmaskTextClass: this.unmaskTextClass,
                                            maskTextSelector: this.maskTextSelector,
                                            unmaskTextSelector: this.unmaskTextSelector,
                                            skipChild: !0,
                                            newlyAddedElement: !0,
                                            inlineStylesheet: this.inlineStylesheet,
                                            maskInputOptions: this.maskInputOptions,
                                            maskAttributeFn: this.maskAttributeFn,
                                            maskTextFn: this.maskTextFn,
                                            maskInputFn: this.maskInputFn,
                                            slimDOMOptions: this.slimDOMOptions,
                                            dataURLOptions: this.dataURLOptions,
                                            recordCanvas: this.recordCanvas,
                                            inlineImages: this.inlineImages,
                                            onSerialize: (currentN) => {
                                                (isSerializedIframe(currentN, this.mirror) &&
                                                    !isBlocked(currentN, this.blockClass, this.blockSelector, this.unblockSelector, !1) &&
                                                    this.iframeManager.addIframe(currentN),
                                                    isSerializedStylesheet(currentN, this.mirror) && this.stylesheetManager.trackLinkElement(currentN),
                                                    hasShadowRoot(n2) && this.shadowDomManager.addShadowRoot(n2.shadowRoot, this.doc));
                                            },
                                            onIframeLoad: (iframe, childSn) => {
                                                isBlocked(iframe, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                                                    (this.iframeManager.attachIframe(iframe, childSn),
                                                    iframe.contentWindow && this.canvasManager.addWindow(iframe.contentWindow),
                                                    this.shadowDomManager.observeAttachShadow(iframe));
                                            },
                                            onStylesheetLoad: (link, childSn) => {
                                                this.stylesheetManager.attachLinkElement(link, childSn);
                                            },
                                            onBlockedImageLoad: (_imageEl, serializedNode, { width, height }) => {
                                                this.mutationCb({
                                                    adds: [],
                                                    removes: [],
                                                    texts: [],
                                                    attributes: [{ id: serializedNode.id, attributes: { style: { width: `${width}px`, height: `${height}px` } } }],
                                                });
                                            },
                                            ignoreCSSAttributes: this.ignoreCSSAttributes,
                                        });
                                        sn && (adds.push({ parentId, nextId, node: sn }), addedIds.add(sn.id));
                                    };
                                for (; this.mapRemoves.length;) this.mirror.removeNodeFromMap(this.mapRemoves.shift());
                                for (let n2 of this.movedSet) (!isParentRemoved(this.removes, n2, this.mirror) || this.movedSet.has(n2.parentNode)) && pushAdd(n2);
                                for (let n2 of this.addedSet)
                                    isAncestorInSet(this.droppedSet, n2) || isParentRemoved(this.removes, n2, this.mirror)
                                        ? isAncestorInSet(this.movedSet, n2)
                                            ? pushAdd(n2)
                                            : this.droppedSet.add(n2)
                                        : pushAdd(n2);
                                let candidate = null;
                                for (; addList.length;) {
                                    let node = null;
                                    if (candidate) {
                                        let parentId = this.mirror.getId(candidate.value.parentNode),
                                            nextId = getNextId(candidate.value);
                                        -1 !== parentId && -1 !== nextId && (node = candidate);
                                    }
                                    if (!node) {
                                        let tailNode = addList.tail;
                                        for (; tailNode;) {
                                            let _node = tailNode;
                                            if (((tailNode = tailNode.previous), _node)) {
                                                let parentId = this.mirror.getId(_node.value.parentNode);
                                                if (-1 === getNextId(_node.value)) continue;
                                                if (-1 !== parentId) {
                                                    node = _node;
                                                    break;
                                                }
                                                {
                                                    let unhandledNode = _node.value;
                                                    if (unhandledNode.parentNode && unhandledNode.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                                        let shadowHost = unhandledNode.parentNode.host;
                                                        if (-1 !== this.mirror.getId(shadowHost)) {
                                                            node = _node;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!node) {
                                        for (; addList.head;) addList.removeNode(addList.head.value);
                                        break;
                                    }
                                    ((candidate = node.previous), addList.removeNode(node.value), pushAdd(node.value));
                                }
                                let payload = {
                                    texts: this.texts
                                        .map((text) => ({ id: this.mirror.getId(text.node), value: text.value }))
                                        .filter((text) => !addedIds.has(text.id))
                                        .filter((text) => this.mirror.has(text.id)),
                                    attributes: this.attributes
                                        .map((attribute) => {
                                            let { attributes } = attribute;
                                            if ("string" == typeof attributes.style) {
                                                let diffAsStr = JSON.stringify(attribute.styleDiff),
                                                    unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
                                                diffAsStr.length < attributes.style.length &&
                                                    (diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length &&
                                                    (attributes.style = attribute.styleDiff);
                                            }
                                            return { id: this.mirror.getId(attribute.node), attributes };
                                        })
                                        .filter((attribute) => !addedIds.has(attribute.id))
                                        .filter((attribute) => this.mirror.has(attribute.id)),
                                    removes: this.removes,
                                    adds,
                                };
                                (payload.texts.length || payload.attributes.length || payload.removes.length || payload.adds.length) &&
                                    ((this.texts = []),
                                    (this.attributes = []),
                                    (this.attributeMap = new WeakMap()),
                                    (this.removes = []),
                                    (this.addedSet = new Set()),
                                    (this.movedSet = new Set()),
                                    (this.droppedSet = new Set()),
                                    (this.movedMap = {}),
                                    this.mutationCb(payload));
                            }),
                            (this.processMutation = (m) => {
                                if (!isIgnored(m.target, this.mirror))
                                    switch (m.type) {
                                        case "characterData": {
                                            let value = m.target.textContent;
                                            isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                                                value === m.oldValue ||
                                                this.texts.push({
                                                    value:
                                                        needMaskingText(
                                                            m.target,
                                                            this.maskTextClass,
                                                            this.maskTextSelector,
                                                            this.unmaskTextClass,
                                                            this.unmaskTextSelector,
                                                            this.maskAllText,
                                                        ) && value
                                                            ? this.maskTextFn
                                                                ? this.maskTextFn(value, closestElementOfNode$1(m.target))
                                                                : value.replace(/[\S]/g, "*")
                                                            : value,
                                                    node: m.target,
                                                });
                                            break;
                                        }
                                        case "attributes": {
                                            let target = m.target,
                                                attributeName = m.attributeName,
                                                value = m.target.getAttribute(attributeName);
                                            if ("value" === attributeName) {
                                                let type = getInputType(target),
                                                    tagName = target.tagName;
                                                value = getInputValue(target, tagName, type);
                                                let isInputMasked = shouldMaskInput({ maskInputOptions: this.maskInputOptions, tagName, type });
                                                value = maskInputValue({
                                                    isMasked: needMaskingText(
                                                        m.target,
                                                        this.maskTextClass,
                                                        this.maskTextSelector,
                                                        this.unmaskTextClass,
                                                        this.unmaskTextSelector,
                                                        isInputMasked,
                                                    ),
                                                    element: target,
                                                    value,
                                                    maskInputFn: this.maskInputFn,
                                                });
                                            }
                                            if (isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) || value === m.oldValue) return;
                                            let item = this.attributeMap.get(m.target);
                                            if ("IFRAME" === target.tagName && "src" === attributeName && !this.keepIframeSrcFn(value)) {
                                                if (getIFrameContentDocument(target)) return;
                                                attributeName = "rr_src";
                                            }
                                            if (
                                                (item ||
                                                    ((item = { node: m.target, attributes: {}, styleDiff: {}, _unchangedStyles: {} }),
                                                    this.attributes.push(item),
                                                    this.attributeMap.set(m.target, item)),
                                                "type" === attributeName &&
                                                    "INPUT" === target.tagName &&
                                                    "password" === (m.oldValue || "").toLowerCase() &&
                                                    target.setAttribute("data-rr-is-password", "true"),
                                                !ignoreAttribute(target.tagName, attributeName) &&
                                                    ((item.attributes[attributeName] = transformAttribute(
                                                        this.doc,
                                                        toLowerCase(target.tagName),
                                                        toLowerCase(attributeName),
                                                        value,
                                                        target,
                                                        this.maskAttributeFn,
                                                    )),
                                                    "style" === attributeName))
                                            ) {
                                                if (!this.unattachedDoc)
                                                    try {
                                                        this.unattachedDoc = document.implementation.createHTMLDocument();
                                                    } catch (e2) {
                                                        this.unattachedDoc = this.doc;
                                                    }
                                                let old = this.unattachedDoc.createElement("span");
                                                for (let pname of (m.oldValue && old.setAttribute("style", m.oldValue), Array.from(target.style))) {
                                                    let newValue = target.style.getPropertyValue(pname),
                                                        newPriority = target.style.getPropertyPriority(pname);
                                                    newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)
                                                        ? "" === newPriority
                                                            ? (item.styleDiff[pname] = newValue)
                                                            : (item.styleDiff[pname] = [newValue, newPriority])
                                                        : (item._unchangedStyles[pname] = [newValue, newPriority]);
                                                }
                                                for (let pname of Array.from(old.style)) "" === target.style.getPropertyValue(pname) && (item.styleDiff[pname] = !1);
                                            }
                                            break;
                                        }
                                        case "childList":
                                            if (isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, !0)) return;
                                            (m.addedNodes.forEach((n2) => this.genAdds(n2, m.target)),
                                                m.removedNodes.forEach((n2) => {
                                                    let nodeId = this.mirror.getId(n2),
                                                        parentId = isShadowRoot(m.target) ? this.mirror.getId(m.target.host) : this.mirror.getId(m.target);
                                                    isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                                                        isIgnored(n2, this.mirror) ||
                                                        -1 === this.mirror.getId(n2) ||
                                                        (this.addedSet.has(n2)
                                                            ? (deepDelete(this.addedSet, n2), this.droppedSet.add(n2))
                                                            : (this.addedSet.has(m.target) && -1 === nodeId) ||
                                                              (function isAncestorRemoved(target, mirror2) {
                                                                  if (isShadowRoot(target)) return !1;
                                                                  let id = mirror2.getId(target);
                                                                  return (
                                                                      !mirror2.has(id) ||
                                                                      ((!target.parentNode || target.parentNode.nodeType !== target.DOCUMENT_NODE) &&
                                                                          (!target.parentNode || isAncestorRemoved(target.parentNode, mirror2)))
                                                                  );
                                                              })(m.target, this.mirror) ||
                                                              (this.movedSet.has(n2) && this.movedMap[moveKey(nodeId, parentId)]
                                                                  ? deepDelete(this.movedSet, n2)
                                                                  : this.removes.push({
                                                                        parentId,
                                                                        id: nodeId,
                                                                        isShadow: !!(isShadowRoot(m.target) && isNativeShadowDom(m.target)) || void 0,
                                                                    })),
                                                        this.mapRemoves.push(n2));
                                                }));
                                    }
                            }),
                            (this.genAdds = (n2, target) => {
                                if (!this.processedNodeManager.inOtherBuffer(n2, this) && !(this.addedSet.has(n2) || this.movedSet.has(n2))) {
                                    if (this.mirror.hasNode(n2)) {
                                        if (isIgnored(n2, this.mirror)) return;
                                        this.movedSet.add(n2);
                                        let targetId = null;
                                        (target && this.mirror.hasNode(target) && (targetId = this.mirror.getId(target)),
                                            targetId && -1 !== targetId && (this.movedMap[moveKey(this.mirror.getId(n2), targetId)] = !0));
                                    } else (this.addedSet.add(n2), this.droppedSet.delete(n2));
                                    !isBlocked(n2, this.blockClass, this.blockSelector, this.unblockSelector, !1) &&
                                        (n2.childNodes && n2.childNodes.forEach((childN) => this.genAdds(childN)),
                                        hasShadowRoot(n2) &&
                                            n2.shadowRoot.childNodes.forEach((childN) => {
                                                (this.processedNodeManager.add(childN, this), this.genAdds(childN, n2));
                                            }));
                                }
                            }));
                    }
                    init(options) {
                        [
                            "mutationCb",
                            "blockClass",
                            "blockSelector",
                            "unblockSelector",
                            "maskAllText",
                            "maskTextClass",
                            "unmaskTextClass",
                            "maskTextSelector",
                            "unmaskTextSelector",
                            "inlineStylesheet",
                            "maskInputOptions",
                            "maskAttributeFn",
                            "maskTextFn",
                            "maskInputFn",
                            "keepIframeSrcFn",
                            "recordCanvas",
                            "inlineImages",
                            "slimDOMOptions",
                            "dataURLOptions",
                            "doc",
                            "mirror",
                            "iframeManager",
                            "stylesheetManager",
                            "shadowDomManager",
                            "canvasManager",
                            "processedNodeManager",
                            "ignoreCSSAttributes",
                        ].forEach((key) => {
                            this[key] = options[key];
                        });
                    }
                    freeze() {
                        ((this.frozen = !0), this.canvasManager.freeze());
                    }
                    unfreeze() {
                        ((this.frozen = !1), this.canvasManager.unfreeze(), this.emit());
                    }
                    isFrozen() {
                        return this.frozen;
                    }
                    lock() {
                        ((this.locked = !0), this.canvasManager.lock());
                    }
                    unlock() {
                        ((this.locked = !1), this.canvasManager.unlock(), this.emit());
                    }
                    reset() {
                        (this.shadowDomManager.reset(), this.canvasManager.reset());
                    }
                }
                function deepDelete(addsSet, n2) {
                    (addsSet.delete(n2), n2.childNodes?.forEach((childN) => deepDelete(addsSet, childN)));
                }
                function isParentRemoved(removes, n2, mirror2) {
                    return (
                        0 !== removes.length &&
                        (function (removes, n2, mirror2) {
                            let node = n2.parentNode;
                            for (; node;) {
                                let parentId = mirror2.getId(node);
                                if (removes.some((r2) => r2.id === parentId)) return !0;
                                node = node.parentNode;
                            }
                            return !1;
                        })(removes, n2, mirror2)
                    );
                }
                function isAncestorInSet(set, n2) {
                    return (
                        0 !== set.size &&
                        (function _isAncestorInSet(set, n2) {
                            let { parentNode } = n2;
                            return !!parentNode && (!!set.has(parentNode) || _isAncestorInSet(set, parentNode));
                        })(set, n2)
                    );
                }
                let callbackWrapper = (cb) =>
                        errorHandler
                            ? (...rest) => {
                                  try {
                                      return cb(...rest);
                                  } catch (error) {
                                      if (errorHandler && !0 === errorHandler(error)) return () => {};
                                      throw error;
                                  }
                              }
                            : cb,
                    mutationBuffers = [];
                function getEventTarget(event) {
                    try {
                        if ("composedPath" in event) {
                            let path = event.composedPath();
                            if (path.length) return path[0];
                        } else if ("path" in event && event.path.length) return event.path[0];
                    } catch {}
                    return event && event.target;
                }
                function initMutationObserver(options, rootEl) {
                    let mutationBuffer = new MutationBuffer();
                    (mutationBuffers.push(mutationBuffer), mutationBuffer.init(options));
                    let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver,
                        angularZoneSymbol = window?.Zone?.__symbol__?.("MutationObserver");
                    angularZoneSymbol && window[angularZoneSymbol] && (mutationObserverCtor = window[angularZoneSymbol]);
                    let observer = new mutationObserverCtor(
                        callbackWrapper((mutations) => {
                            (options.onMutation && !1 === options.onMutation(mutations)) || mutationBuffer.processMutations.bind(mutationBuffer)(mutations);
                        }),
                    );
                    return (
                        observer.observe(rootEl, { attributes: !0, attributeOldValue: !0, characterData: !0, characterDataOldValue: !0, childList: !0, subtree: !0 }),
                        observer
                    );
                }
                function initScrollObserver({ scrollCb, doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, sampling }) {
                    return on(
                        "scroll",
                        callbackWrapper(
                            throttle$1(
                                callbackWrapper((evt) => {
                                    let target = getEventTarget(evt);
                                    if (!target || isBlocked(target, blockClass, blockSelector, unblockSelector, !0)) return;
                                    let id = mirror2.getId(target);
                                    if (target === doc && doc.defaultView) {
                                        let scrollLeftTop = getWindowScroll(doc.defaultView);
                                        scrollCb({ id, x: scrollLeftTop.left, y: scrollLeftTop.top });
                                    } else scrollCb({ id, x: target.scrollLeft, y: target.scrollTop });
                                }),
                                sampling.scroll || 100,
                            ),
                        ),
                        doc,
                    );
                }
                let INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"],
                    lastInputValueMap = new WeakMap();
                function getNestedCSSRulePositions(rule) {
                    var pos = [];
                    if (
                        (hasNestedCSSRule("CSSGroupingRule") && rule.parentRule instanceof CSSGroupingRule) ||
                        (hasNestedCSSRule("CSSMediaRule") && rule.parentRule instanceof CSSMediaRule) ||
                        (hasNestedCSSRule("CSSSupportsRule") && rule.parentRule instanceof CSSSupportsRule) ||
                        (hasNestedCSSRule("CSSConditionRule") && rule.parentRule instanceof CSSConditionRule)
                    ) {
                        let index = Array.from(rule.parentRule.cssRules).indexOf(rule);
                        pos.unshift(index);
                    } else if (rule.parentStyleSheet) {
                        let index = Array.from(rule.parentStyleSheet.cssRules).indexOf(rule);
                        pos.unshift(index);
                    }
                    return pos;
                }
                function getIdAndStyleId(sheet, mirror2, styleMirror) {
                    let id, styleId;
                    return sheet ? (sheet.ownerNode ? (id = mirror2.getId(sheet.ownerNode)) : (styleId = styleMirror.getId(sheet)), { styleId, id }) : {};
                }
                function initAdoptedStyleSheetObserver({ mirror: mirror2, stylesheetManager }, host) {
                    let hostId = null;
                    hostId = "#document" === host.nodeName ? mirror2.getId(host) : mirror2.getId(host.host);
                    let patchTarget = "#document" === host.nodeName ? host.defaultView?.Document : host.ownerDocument?.defaultView?.ShadowRoot,
                        originalPropertyDescriptor = patchTarget?.prototype ? Object.getOwnPropertyDescriptor(patchTarget?.prototype, "adoptedStyleSheets") : void 0;
                    return null !== hostId && -1 !== hostId && patchTarget && originalPropertyDescriptor
                        ? (Object.defineProperty(host, "adoptedStyleSheets", {
                              configurable: originalPropertyDescriptor.configurable,
                              enumerable: originalPropertyDescriptor.enumerable,
                              get() {
                                  return originalPropertyDescriptor.get?.call(this);
                              },
                              set(sheets) {
                                  let result = originalPropertyDescriptor.set?.call(this, sheets);
                                  if (null !== hostId && -1 !== hostId)
                                      try {
                                          stylesheetManager.adoptStyleSheets(sheets, hostId);
                                      } catch (e2) {}
                                  return result;
                              },
                          }),
                          callbackWrapper(() => {
                              Object.defineProperty(host, "adoptedStyleSheets", {
                                  configurable: originalPropertyDescriptor.configurable,
                                  enumerable: originalPropertyDescriptor.enumerable,
                                  get: originalPropertyDescriptor.get,
                                  set: originalPropertyDescriptor.set,
                              });
                          }))
                        : () => {};
                }
                function initObservers(o2, _hooks = {}) {
                    let mutationObserver,
                        currentWindow = o2.doc.defaultView;
                    if (!currentWindow) return () => {};
                    o2.recordDOM && (mutationObserver = initMutationObserver(o2, o2.doc));
                    let mousemoveHandler = (function ({ mousemoveCb, sampling, doc, mirror: mirror2 }) {
                            let timeBaseline;
                            if (!1 === sampling.mousemove) return () => {};
                            let threshold = "number" == typeof sampling.mousemove ? sampling.mousemove : 50,
                                callbackThreshold = "number" == typeof sampling.mousemoveCallback ? sampling.mousemoveCallback : 500,
                                positions = [],
                                wrappedCb = throttle$1(
                                    callbackWrapper((source) => {
                                        let totalOffset = Date.now() - timeBaseline;
                                        (mousemoveCb(
                                            positions.map((p) => ((p.timeOffset -= totalOffset), p)),
                                            source,
                                        ),
                                            (positions = []),
                                            (timeBaseline = null));
                                    }),
                                    callbackThreshold,
                                ),
                                updatePosition = callbackWrapper(
                                    throttle$1(
                                        callbackWrapper((evt) => {
                                            let target = getEventTarget(evt),
                                                { clientX, clientY } = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt;
                                            (timeBaseline || (timeBaseline = nowTimestamp()),
                                                positions.push({ x: clientX, y: clientY, id: mirror2.getId(target), timeOffset: nowTimestamp() - timeBaseline }),
                                                wrappedCb(
                                                    "u" > typeof DragEvent && evt instanceof DragEvent
                                                        ? IncrementalSource.Drag
                                                        : evt instanceof MouseEvent
                                                          ? IncrementalSource.MouseMove
                                                          : IncrementalSource.TouchMove,
                                                ));
                                        }),
                                        threshold,
                                        { trailing: !1 },
                                    ),
                                ),
                                handlers = [on("mousemove", updatePosition, doc), on("touchmove", updatePosition, doc), on("drag", updatePosition, doc)];
                            return callbackWrapper(() => {
                                handlers.forEach((h) => h());
                            });
                        })(o2),
                        mouseInteractionHandler = (function ({ mouseInteractionCb, doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, sampling }) {
                            if (!1 === sampling.mouseInteraction) return () => {};
                            let disableMap = !0 === sampling.mouseInteraction || void 0 === sampling.mouseInteraction ? {} : sampling.mouseInteraction,
                                handlers = [],
                                currentPointerType = null;
                            return (
                                Object.keys(MouseInteractions)
                                    .filter((key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && !1 !== disableMap[key])
                                    .forEach((eventKey) => {
                                        let eventName = toLowerCase(eventKey),
                                            handler = (event) => {
                                                let target = getEventTarget(event);
                                                if (isBlocked(target, blockClass, blockSelector, unblockSelector, !0)) return;
                                                let pointerType = null,
                                                    thisEventKey = eventKey;
                                                if ("pointerType" in event) {
                                                    switch (event.pointerType) {
                                                        case "mouse":
                                                            pointerType = PointerTypes.Mouse;
                                                            break;
                                                        case "touch":
                                                            pointerType = PointerTypes.Touch;
                                                            break;
                                                        case "pen":
                                                            pointerType = PointerTypes.Pen;
                                                    }
                                                    pointerType === PointerTypes.Touch
                                                        ? MouseInteractions[eventKey] === MouseInteractions.MouseDown
                                                            ? (thisEventKey = "TouchStart")
                                                            : MouseInteractions[eventKey] === MouseInteractions.MouseUp && (thisEventKey = "TouchEnd")
                                                        : PointerTypes.Pen;
                                                } else legacy_isTouchEvent(event) && (pointerType = PointerTypes.Touch);
                                                null !== pointerType
                                                    ? ((currentPointerType = pointerType),
                                                      ((thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch) ||
                                                          (thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse)) &&
                                                          (pointerType = null))
                                                    : MouseInteractions[eventKey] === MouseInteractions.Click && ((pointerType = currentPointerType), (currentPointerType = null));
                                                let e2 = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
                                                if (!e2) return;
                                                let id = mirror2.getId(target),
                                                    { clientX, clientY } = e2;
                                                callbackWrapper(mouseInteractionCb)({
                                                    type: MouseInteractions[thisEventKey],
                                                    id,
                                                    x: clientX,
                                                    y: clientY,
                                                    ...(null !== pointerType && { pointerType }),
                                                });
                                            };
                                        if (window.PointerEvent)
                                            switch (MouseInteractions[eventKey]) {
                                                case MouseInteractions.MouseDown:
                                                case MouseInteractions.MouseUp:
                                                    eventName = eventName.replace("mouse", "pointer");
                                                    break;
                                                case MouseInteractions.TouchStart:
                                                case MouseInteractions.TouchEnd:
                                                    return;
                                            }
                                        handlers.push(on(eventName, handler, doc));
                                    }),
                                callbackWrapper(() => {
                                    handlers.forEach((h) => h());
                                })
                            );
                        })(o2),
                        scrollHandler = initScrollObserver(o2),
                        viewportResizeHandler = (function ({ viewportResizeCb }, { win }) {
                            let lastH = -1,
                                lastW = -1;
                            return on(
                                "resize",
                                callbackWrapper(
                                    throttle$1(
                                        callbackWrapper(() => {
                                            let height = getWindowHeight(),
                                                width = getWindowWidth();
                                            (lastH !== height || lastW !== width) &&
                                                (viewportResizeCb({ width: Number(width), height: Number(height) }), (lastH = height), (lastW = width));
                                        }),
                                        200,
                                    ),
                                ),
                                win,
                            );
                        })(o2, { win: currentWindow }),
                        inputHandler = (function ({
                            inputCb,
                            doc,
                            mirror: mirror2,
                            blockClass,
                            blockSelector,
                            unblockSelector,
                            ignoreClass,
                            ignoreSelector,
                            maskInputOptions,
                            maskInputFn,
                            sampling,
                            userTriggeredOnInput,
                            maskTextClass,
                            unmaskTextClass,
                            maskTextSelector,
                            unmaskTextSelector,
                        }) {
                            function eventHandler(event) {
                                let target = getEventTarget(event),
                                    userTriggered = event.isTrusted,
                                    tagName = target && toUpperCase(target.tagName);
                                if (
                                    ("OPTION" === tagName && (target = target.parentElement),
                                    !target || !tagName || 0 > INPUT_TAGS.indexOf(tagName) || isBlocked(target, blockClass, blockSelector, unblockSelector, !0))
                                )
                                    return;
                                let el = target;
                                if (el.classList.contains(ignoreClass) || (ignoreSelector && el.matches(ignoreSelector))) return;
                                let type = getInputType(target),
                                    text = getInputValue(el, tagName, type),
                                    isChecked = !1,
                                    isInputMasked = shouldMaskInput({ maskInputOptions, tagName, type }),
                                    forceMask = needMaskingText(target, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, isInputMasked);
                                (("radio" === type || "checkbox" === type) && (isChecked = target.checked),
                                    (text = maskInputValue({ isMasked: forceMask, element: target, value: text, maskInputFn })),
                                    cbWithDedup(target, userTriggeredOnInput ? { text, isChecked, userTriggered } : { text, isChecked }));
                                let name = target.name;
                                "radio" === type &&
                                    name &&
                                    isChecked &&
                                    doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el2) => {
                                        if (el2 !== target) {
                                            let text2 = maskInputValue({ isMasked: forceMask, element: el2, value: getInputValue(el2, tagName, type), maskInputFn });
                                            cbWithDedup(
                                                el2,
                                                userTriggeredOnInput ? { text: text2, isChecked: !isChecked, userTriggered: !1 } : { text: text2, isChecked: !isChecked },
                                            );
                                        }
                                    });
                            }
                            function cbWithDedup(target, v2) {
                                let lastInputValue = lastInputValueMap.get(target);
                                if (!lastInputValue || lastInputValue.text !== v2.text || lastInputValue.isChecked !== v2.isChecked) {
                                    lastInputValueMap.set(target, v2);
                                    let id = mirror2.getId(target);
                                    callbackWrapper(inputCb)({ ...v2, id });
                                }
                            }
                            let handlers = ("last" === sampling.input ? ["change"] : ["input", "change"]).map((eventName) => on(eventName, callbackWrapper(eventHandler), doc)),
                                currentWindow = doc.defaultView;
                            if (!currentWindow)
                                return () => {
                                    handlers.forEach((h) => h());
                                };
                            let propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value"),
                                hookProperties = [
                                    [currentWindow.HTMLInputElement.prototype, "value"],
                                    [currentWindow.HTMLInputElement.prototype, "checked"],
                                    [currentWindow.HTMLSelectElement.prototype, "value"],
                                    [currentWindow.HTMLTextAreaElement.prototype, "value"],
                                    [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
                                    [currentWindow.HTMLOptionElement.prototype, "selected"],
                                ];
                            return (
                                propertyDescriptor &&
                                    propertyDescriptor.set &&
                                    handlers.push(
                                        ...hookProperties.map((p) =>
                                            (function hookSetter(target, key, d, isRevoked, win = window) {
                                                let original = win.Object.getOwnPropertyDescriptor(target, key);
                                                return (
                                                    win.Object.defineProperty(
                                                        target,
                                                        key,
                                                        isRevoked
                                                            ? d
                                                            : {
                                                                  set(value) {
                                                                      (setTimeout$1(() => {
                                                                          d.set.call(this, value);
                                                                      }, 0),
                                                                          original && original.set && original.set.call(this, value));
                                                                  },
                                                              },
                                                    ),
                                                    () => hookSetter(target, key, original || {}, !0)
                                                );
                                            })(
                                                p[0],
                                                p[1],
                                                {
                                                    set() {
                                                        callbackWrapper(eventHandler)({ target: this, isTrusted: !1 });
                                                    },
                                                },
                                                !1,
                                                currentWindow,
                                            ),
                                        ),
                                    ),
                                callbackWrapper(() => {
                                    handlers.forEach((h) => h());
                                })
                            );
                        })(o2),
                        mediaInteractionHandler = (function ({ mediaInteractionCb, blockClass, blockSelector, unblockSelector, mirror: mirror2, sampling, doc }) {
                            let handler = callbackWrapper((type) =>
                                    throttle$1(
                                        callbackWrapper((event) => {
                                            let target = getEventTarget(event);
                                            if (!target || isBlocked(target, blockClass, blockSelector, unblockSelector, !0)) return;
                                            let { currentTime, volume, muted, playbackRate } = target;
                                            mediaInteractionCb({ type, id: mirror2.getId(target), currentTime, volume, muted, playbackRate });
                                        }),
                                        sampling.media || 500,
                                    ),
                                ),
                                handlers = [
                                    on("play", handler(MediaInteractions.Play), doc),
                                    on("pause", handler(MediaInteractions.Pause), doc),
                                    on("seeked", handler(MediaInteractions.Seeked), doc),
                                    on("volumechange", handler(MediaInteractions.VolumeChange), doc),
                                    on("ratechange", handler(MediaInteractions.RateChange), doc),
                                ];
                            return callbackWrapper(() => {
                                handlers.forEach((h) => h());
                            });
                        })(o2),
                        styleSheetObserver = () => {},
                        adoptedStyleSheetObserver = () => {},
                        styleDeclarationObserver = () => {},
                        fontObserver = () => {};
                    o2.recordDOM &&
                        ((styleSheetObserver = (function ({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
                            let replace, replaceSync;
                            if (!win.CSSStyleSheet || !win.CSSStyleSheet.prototype) return () => {};
                            let insertRule = win.CSSStyleSheet.prototype.insertRule;
                            win.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
                                apply: callbackWrapper((target, thisArg, argumentsList) => {
                                    let [rule, index] = argumentsList,
                                        { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
                                    return (
                                        ((id && -1 !== id) || (styleId && -1 !== styleId)) && styleSheetRuleCb({ id, styleId, adds: [{ rule, index }] }),
                                        target.apply(thisArg, argumentsList)
                                    );
                                }),
                            });
                            let deleteRule = win.CSSStyleSheet.prototype.deleteRule;
                            ((win.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
                                apply: callbackWrapper((target, thisArg, argumentsList) => {
                                    let [index] = argumentsList,
                                        { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
                                    return (
                                        ((id && -1 !== id) || (styleId && -1 !== styleId)) && styleSheetRuleCb({ id, styleId, removes: [{ index }] }),
                                        target.apply(thisArg, argumentsList)
                                    );
                                }),
                            })),
                                win.CSSStyleSheet.prototype.replace &&
                                    ((replace = win.CSSStyleSheet.prototype.replace),
                                    (win.CSSStyleSheet.prototype.replace = new Proxy(replace, {
                                        apply: callbackWrapper((target, thisArg, argumentsList) => {
                                            let [text] = argumentsList,
                                                { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
                                            return (
                                                ((id && -1 !== id) || (styleId && -1 !== styleId)) && styleSheetRuleCb({ id, styleId, replace: text }),
                                                target.apply(thisArg, argumentsList)
                                            );
                                        }),
                                    }))),
                                win.CSSStyleSheet.prototype.replaceSync &&
                                    ((replaceSync = win.CSSStyleSheet.prototype.replaceSync),
                                    (win.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
                                        apply: callbackWrapper((target, thisArg, argumentsList) => {
                                            let [text] = argumentsList,
                                                { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
                                            return (
                                                ((id && -1 !== id) || (styleId && -1 !== styleId)) && styleSheetRuleCb({ id, styleId, replaceSync: text }),
                                                target.apply(thisArg, argumentsList)
                                            );
                                        }),
                                    }))));
                            let supportedNestedCSSRuleTypes = {};
                            canMonkeyPatchNestedCSSRule("CSSGroupingRule")
                                ? (supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule)
                                : (canMonkeyPatchNestedCSSRule("CSSMediaRule") && (supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule),
                                  canMonkeyPatchNestedCSSRule("CSSConditionRule") && (supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule),
                                  canMonkeyPatchNestedCSSRule("CSSSupportsRule") && (supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule));
                            let unmodifiedFunctions = {};
                            return (
                                Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
                                    ((unmodifiedFunctions[typeKey] = { insertRule: type.prototype.insertRule, deleteRule: type.prototype.deleteRule }),
                                        (type.prototype.insertRule = new Proxy(unmodifiedFunctions[typeKey].insertRule, {
                                            apply: callbackWrapper((target, thisArg, argumentsList) => {
                                                let [rule, index] = argumentsList,
                                                    { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
                                                return (
                                                    ((id && -1 !== id) || (styleId && -1 !== styleId)) &&
                                                        styleSheetRuleCb({ id, styleId, adds: [{ rule, index: [...getNestedCSSRulePositions(thisArg), index || 0] }] }),
                                                    target.apply(thisArg, argumentsList)
                                                );
                                            }),
                                        })),
                                        (type.prototype.deleteRule = new Proxy(unmodifiedFunctions[typeKey].deleteRule, {
                                            apply: callbackWrapper((target, thisArg, argumentsList) => {
                                                let [index] = argumentsList,
                                                    { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
                                                return (
                                                    ((id && -1 !== id) || (styleId && -1 !== styleId)) &&
                                                        styleSheetRuleCb({ id, styleId, removes: [{ index: [...getNestedCSSRulePositions(thisArg), index] }] }),
                                                    target.apply(thisArg, argumentsList)
                                                );
                                            }),
                                        })));
                                }),
                                callbackWrapper(() => {
                                    ((win.CSSStyleSheet.prototype.insertRule = insertRule),
                                        (win.CSSStyleSheet.prototype.deleteRule = deleteRule),
                                        replace && (win.CSSStyleSheet.prototype.replace = replace),
                                        replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync),
                                        Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
                                            ((type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule),
                                                (type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule));
                                        }));
                                })
                            );
                        })(o2, { win: currentWindow })),
                        (adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o2, o2.doc)),
                        (styleDeclarationObserver = (function ({ styleDeclarationCb, mirror: mirror2, ignoreCSSAttributes, stylesheetManager }, { win }) {
                            let setProperty = win.CSSStyleDeclaration.prototype.setProperty;
                            win.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
                                apply: callbackWrapper((target, thisArg, argumentsList) => {
                                    let [property, value, priority] = argumentsList;
                                    if (ignoreCSSAttributes.has(property)) return setProperty.apply(thisArg, [property, value, priority]);
                                    let { id, styleId } = getIdAndStyleId(thisArg.parentRule?.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
                                    return (
                                        ((id && -1 !== id) || (styleId && -1 !== styleId)) &&
                                            styleDeclarationCb({ id, styleId, set: { property, value, priority }, index: getNestedCSSRulePositions(thisArg.parentRule) }),
                                        target.apply(thisArg, argumentsList)
                                    );
                                }),
                            });
                            let removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
                            return (
                                (win.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
                                    apply: callbackWrapper((target, thisArg, argumentsList) => {
                                        let [property] = argumentsList;
                                        if (ignoreCSSAttributes.has(property)) return removeProperty.apply(thisArg, [property]);
                                        let { id, styleId } = getIdAndStyleId(thisArg.parentRule?.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
                                        return (
                                            ((id && -1 !== id) || (styleId && -1 !== styleId)) &&
                                                styleDeclarationCb({ id, styleId, remove: { property }, index: getNestedCSSRulePositions(thisArg.parentRule) }),
                                            target.apply(thisArg, argumentsList)
                                        );
                                    }),
                                })),
                                callbackWrapper(() => {
                                    ((win.CSSStyleDeclaration.prototype.setProperty = setProperty), (win.CSSStyleDeclaration.prototype.removeProperty = removeProperty));
                                })
                            );
                        })(o2, { win: currentWindow })),
                        o2.collectFonts &&
                            (fontObserver = (function ({ fontCb, doc }) {
                                let win = doc.defaultView;
                                if (!win) return () => {};
                                let handlers = [],
                                    fontMap = new WeakMap(),
                                    originalFontFace = win.FontFace;
                                win.FontFace = function (family, source, descriptors) {
                                    let fontFace = new originalFontFace(family, source, descriptors);
                                    return (
                                        fontMap.set(fontFace, {
                                            family,
                                            buffer: "string" != typeof source,
                                            descriptors,
                                            fontSource: "string" == typeof source ? source : JSON.stringify(Array.from(new Uint8Array(source))),
                                        }),
                                        fontFace
                                    );
                                };
                                let restoreHandler = patch(doc.fonts, "add", function (original) {
                                    return function (fontFace) {
                                        return (
                                            setTimeout$1(
                                                callbackWrapper(() => {
                                                    let p = fontMap.get(fontFace);
                                                    p && (fontCb(p), fontMap.delete(fontFace));
                                                }),
                                                0,
                                            ),
                                            original.apply(this, [fontFace])
                                        );
                                    };
                                });
                                return (
                                    handlers.push(() => {
                                        win.FontFace = originalFontFace;
                                    }),
                                    handlers.push(restoreHandler),
                                    callbackWrapper(() => {
                                        handlers.forEach((h) => h());
                                    })
                                );
                            })(o2)));
                    let selectionObserver = (function (param) {
                            let { doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, selectionCb } = param,
                                collapsed = !0,
                                updateSelection = callbackWrapper(() => {
                                    let selection = doc.getSelection();
                                    if (!selection || (collapsed && selection?.isCollapsed)) return;
                                    collapsed = selection.isCollapsed || !1;
                                    let ranges = [],
                                        count = selection.rangeCount || 0;
                                    for (let i2 = 0; i2 < count; i2++) {
                                        let { startContainer, startOffset, endContainer, endOffset } = selection.getRangeAt(i2);
                                        isBlocked(startContainer, blockClass, blockSelector, unblockSelector, !0) ||
                                            isBlocked(endContainer, blockClass, blockSelector, unblockSelector, !0) ||
                                            ranges.push({ start: mirror2.getId(startContainer), startOffset, end: mirror2.getId(endContainer), endOffset });
                                    }
                                    selectionCb({ ranges });
                                });
                            return (updateSelection(), on("selectionchange", updateSelection));
                        })(o2),
                        customElementObserver = (function ({ doc, customElementCb }) {
                            let win = doc.defaultView;
                            return win && win.customElements
                                ? patch(win.customElements, "define", function (original) {
                                      return function (name, constructor, options) {
                                          try {
                                              customElementCb({ define: { name } });
                                          } catch (e2) {}
                                          return original.apply(this, [name, constructor, options]);
                                      };
                                  })
                                : () => {};
                        })(o2),
                        pluginHandlers = [];
                    for (let plugin of o2.plugins) pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
                    return callbackWrapper(() => {
                        (mutationBuffers.forEach((b) => b.reset()),
                            mutationObserver?.disconnect(),
                            mousemoveHandler(),
                            mouseInteractionHandler(),
                            scrollHandler(),
                            viewportResizeHandler(),
                            inputHandler(),
                            mediaInteractionHandler(),
                            styleSheetObserver(),
                            adoptedStyleSheetObserver(),
                            styleDeclarationObserver(),
                            fontObserver(),
                            selectionObserver(),
                            customElementObserver(),
                            pluginHandlers.forEach((h) => h()));
                    });
                }
                function hasNestedCSSRule(prop) {
                    return void 0 !== window[prop];
                }
                function canMonkeyPatchNestedCSSRule(prop) {
                    return !!(void 0 !== window[prop] && window[prop].prototype && "insertRule" in window[prop].prototype && "deleteRule" in window[prop].prototype);
                }
                class CrossOriginIframeMirror {
                    constructor(generateIdFn) {
                        ((this.generateIdFn = generateIdFn), (this.iframeIdToRemoteIdMap = new WeakMap()), (this.iframeRemoteIdToIdMap = new WeakMap()));
                    }
                    getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
                        let idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe),
                            remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe),
                            id = idToRemoteIdMap.get(remoteId);
                        return (id || ((id = this.generateIdFn()), idToRemoteIdMap.set(remoteId, id), remoteIdToIdMap.set(id, remoteId)), id);
                    }
                    getIds(iframe, remoteId) {
                        let idToRemoteIdMap = this.getIdToRemoteIdMap(iframe),
                            remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
                        return remoteId.map((id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap));
                    }
                    getRemoteId(iframe, id, map) {
                        let remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
                        if ("number" != typeof id) return id;
                        let remoteId = remoteIdToIdMap.get(id);
                        return remoteId || -1;
                    }
                    getRemoteIds(iframe, ids) {
                        let remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
                        return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
                    }
                    reset(iframe) {
                        if (!iframe) {
                            ((this.iframeIdToRemoteIdMap = new WeakMap()), (this.iframeRemoteIdToIdMap = new WeakMap()));
                            return;
                        }
                        (this.iframeIdToRemoteIdMap.delete(iframe), this.iframeRemoteIdToIdMap.delete(iframe));
                    }
                    getIdToRemoteIdMap(iframe) {
                        let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
                        return (idToRemoteIdMap || ((idToRemoteIdMap = new Map()), this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap)), idToRemoteIdMap);
                    }
                    getRemoteIdToIdMap(iframe) {
                        let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
                        return (remoteIdToIdMap || ((remoteIdToIdMap = new Map()), this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap)), remoteIdToIdMap);
                    }
                }
                class IframeManagerNoop {
                    constructor() {
                        ((this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId)), (this.crossOriginIframeRootIdMap = new WeakMap()));
                    }
                    addIframe() {}
                    addLoadListener() {}
                    attachIframe() {}
                }
                class IframeManager {
                    constructor(options) {
                        ((this.iframes = new WeakMap()),
                            (this.crossOriginIframeMap = new WeakMap()),
                            (this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId)),
                            (this.crossOriginIframeRootIdMap = new WeakMap()),
                            (this.mutationCb = options.mutationCb),
                            (this.wrappedEmit = options.wrappedEmit),
                            (this.stylesheetManager = options.stylesheetManager),
                            (this.recordCrossOriginIframes = options.recordCrossOriginIframes),
                            (this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(
                                this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror),
                            )),
                            (this.mirror = options.mirror),
                            this.recordCrossOriginIframes && window.addEventListener("message", this.handleMessage.bind(this)));
                    }
                    addIframe(iframeEl) {
                        (this.iframes.set(iframeEl, !0), iframeEl.contentWindow && this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl));
                    }
                    addLoadListener(cb) {
                        this.loadListener = cb;
                    }
                    attachIframe(iframeEl, childSn) {
                        (this.mutationCb({
                            adds: [{ parentId: this.mirror.getId(iframeEl), nextId: null, node: childSn }],
                            removes: [],
                            texts: [],
                            attributes: [],
                            isAttachIframe: !0,
                        }),
                            this.recordCrossOriginIframes && iframeEl.contentWindow?.addEventListener("message", this.handleMessage.bind(this)),
                            this.loadListener?.(iframeEl));
                        let iframeDoc = getIFrameContentDocument(iframeEl);
                        iframeDoc &&
                            iframeDoc.adoptedStyleSheets &&
                            iframeDoc.adoptedStyleSheets.length > 0 &&
                            this.stylesheetManager.adoptStyleSheets(iframeDoc.adoptedStyleSheets, this.mirror.getId(iframeDoc));
                    }
                    handleMessage(message) {
                        if ("rrweb" !== message.data.type || message.origin !== message.data.origin || !message.source) return;
                        let iframeEl = this.crossOriginIframeMap.get(message.source);
                        if (!iframeEl) return;
                        let transformedEvent = this.transformCrossOriginEvent(iframeEl, message.data.event);
                        transformedEvent && this.wrappedEmit(transformedEvent, message.data.isCheckout);
                    }
                    transformCrossOriginEvent(iframeEl, e2) {
                        switch (e2.type) {
                            case EventType.FullSnapshot: {
                                (this.crossOriginIframeMirror.reset(iframeEl), this.crossOriginIframeStyleMirror.reset(iframeEl), this.replaceIdOnNode(e2.data.node, iframeEl));
                                let rootId = e2.data.node.id;
                                return (
                                    this.crossOriginIframeRootIdMap.set(iframeEl, rootId),
                                    this.patchRootIdOnNode(e2.data.node, rootId),
                                    {
                                        timestamp: e2.timestamp,
                                        type: EventType.IncrementalSnapshot,
                                        data: {
                                            source: IncrementalSource.Mutation,
                                            adds: [{ parentId: this.mirror.getId(iframeEl), nextId: null, node: e2.data.node }],
                                            removes: [],
                                            texts: [],
                                            attributes: [],
                                            isAttachIframe: !0,
                                        },
                                    }
                                );
                            }
                            case EventType.Meta:
                            case EventType.Load:
                            case EventType.DomContentLoaded:
                                break;
                            case EventType.Plugin:
                                return e2;
                            case EventType.Custom:
                                return (this.replaceIds(e2.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]), e2);
                            case EventType.IncrementalSnapshot:
                                switch (e2.data.source) {
                                    case IncrementalSource.Mutation:
                                        return (
                                            e2.data.adds.forEach((n2) => {
                                                (this.replaceIds(n2, iframeEl, ["parentId", "nextId", "previousId"]), this.replaceIdOnNode(n2.node, iframeEl));
                                                let rootId = this.crossOriginIframeRootIdMap.get(iframeEl);
                                                rootId && this.patchRootIdOnNode(n2.node, rootId);
                                            }),
                                            e2.data.removes.forEach((n2) => {
                                                this.replaceIds(n2, iframeEl, ["parentId", "id"]);
                                            }),
                                            e2.data.attributes.forEach((n2) => {
                                                this.replaceIds(n2, iframeEl, ["id"]);
                                            }),
                                            e2.data.texts.forEach((n2) => {
                                                this.replaceIds(n2, iframeEl, ["id"]);
                                            }),
                                            e2
                                        );
                                    case IncrementalSource.Drag:
                                    case IncrementalSource.TouchMove:
                                    case IncrementalSource.MouseMove:
                                        return (
                                            e2.data.positions.forEach((p) => {
                                                this.replaceIds(p, iframeEl, ["id"]);
                                            }),
                                            e2
                                        );
                                    case IncrementalSource.ViewportResize:
                                        return !1;
                                    case IncrementalSource.MediaInteraction:
                                    case IncrementalSource.MouseInteraction:
                                    case IncrementalSource.Scroll:
                                    case IncrementalSource.CanvasMutation:
                                    case IncrementalSource.Input:
                                        return (this.replaceIds(e2.data, iframeEl, ["id"]), e2);
                                    case IncrementalSource.StyleSheetRule:
                                    case IncrementalSource.StyleDeclaration:
                                        return (this.replaceIds(e2.data, iframeEl, ["id"]), this.replaceStyleIds(e2.data, iframeEl, ["styleId"]), e2);
                                    case IncrementalSource.Font:
                                        return e2;
                                    case IncrementalSource.Selection:
                                        return (
                                            e2.data.ranges.forEach((range) => {
                                                this.replaceIds(range, iframeEl, ["start", "end"]);
                                            }),
                                            e2
                                        );
                                    case IncrementalSource.AdoptedStyleSheet:
                                        return (
                                            this.replaceIds(e2.data, iframeEl, ["id"]),
                                            this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]),
                                            e2.data.styles?.forEach((style) => {
                                                this.replaceStyleIds(style, iframeEl, ["styleId"]);
                                            }),
                                            e2
                                        );
                                }
                        }
                        return !1;
                    }
                    replace(iframeMirror, obj, iframeEl, keys) {
                        for (let key of keys)
                            (Array.isArray(obj[key]) || "number" == typeof obj[key]) &&
                                (Array.isArray(obj[key]) ? (obj[key] = iframeMirror.getIds(iframeEl, obj[key])) : (obj[key] = iframeMirror.getId(iframeEl, obj[key])));
                        return obj;
                    }
                    replaceIds(obj, iframeEl, keys) {
                        return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
                    }
                    replaceStyleIds(obj, iframeEl, keys) {
                        return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
                    }
                    replaceIdOnNode(node, iframeEl) {
                        (this.replaceIds(node, iframeEl, ["id", "rootId"]),
                            "childNodes" in node &&
                                node.childNodes.forEach((child) => {
                                    this.replaceIdOnNode(child, iframeEl);
                                }));
                    }
                    patchRootIdOnNode(node, rootId) {
                        (node.type === NodeType$2.Document || node.rootId || (node.rootId = rootId),
                            "childNodes" in node &&
                                node.childNodes.forEach((child) => {
                                    this.patchRootIdOnNode(child, rootId);
                                }));
                    }
                }
                class ShadowDomManagerNoop {
                    init() {}
                    addShadowRoot() {}
                    observeAttachShadow() {}
                    reset() {}
                }
                class ShadowDomManager {
                    constructor(options) {
                        ((this.shadowDoms = new WeakSet()),
                            (this.restoreHandlers = []),
                            (this.mutationCb = options.mutationCb),
                            (this.scrollCb = options.scrollCb),
                            (this.bypassOptions = options.bypassOptions),
                            (this.mirror = options.mirror),
                            this.init());
                    }
                    init() {
                        (this.reset(), this.patchAttachShadow(Element, document));
                    }
                    addShadowRoot(shadowRoot, doc) {
                        if (!isNativeShadowDom(shadowRoot) || this.shadowDoms.has(shadowRoot)) return;
                        (this.shadowDoms.add(shadowRoot), this.bypassOptions.canvasManager.addShadowRoot(shadowRoot));
                        let observer = initMutationObserver({ ...this.bypassOptions, doc, mutationCb: this.mutationCb, mirror: this.mirror, shadowDomManager: this }, shadowRoot);
                        (this.restoreHandlers.push(() => observer.disconnect()),
                            this.restoreHandlers.push(initScrollObserver({ ...this.bypassOptions, scrollCb: this.scrollCb, doc: shadowRoot, mirror: this.mirror })),
                            setTimeout$1(() => {
                                (shadowRoot.adoptedStyleSheets &&
                                    shadowRoot.adoptedStyleSheets.length > 0 &&
                                    this.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, this.mirror.getId(shadowRoot.host)),
                                    this.restoreHandlers.push(
                                        initAdoptedStyleSheetObserver({ mirror: this.mirror, stylesheetManager: this.bypassOptions.stylesheetManager }, shadowRoot),
                                    ));
                            }, 0));
                    }
                    observeAttachShadow(iframeElement) {
                        let iframeDoc = getIFrameContentDocument(iframeElement),
                            iframeWindow = (function (iframe) {
                                try {
                                    return iframe.contentWindow;
                                } catch (e2) {}
                            })(iframeElement);
                        iframeDoc && iframeWindow && this.patchAttachShadow(iframeWindow.Element, iframeDoc);
                    }
                    patchAttachShadow(element, doc) {
                        let manager = this;
                        this.restoreHandlers.push(
                            patch(element.prototype, "attachShadow", function (original) {
                                return function (option) {
                                    let shadowRoot = original.call(this, option);
                                    return (this.shadowRoot && inDom(this) && manager.addShadowRoot(this.shadowRoot, doc), shadowRoot);
                                };
                            }),
                        );
                    }
                    reset() {
                        (this.restoreHandlers.forEach((handler) => {
                            try {
                                handler();
                            } catch (e2) {}
                        }),
                            (this.restoreHandlers = []),
                            (this.shadowDoms = new WeakSet()),
                            this.bypassOptions.canvasManager.resetShadowRoots());
                    }
                }
                for (
                    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lookup = "u" < typeof Uint8Array ? [] : new Uint8Array(256), i$1 = 0;
                    i$1 < chars.length;
                    i$1++
                )
                    lookup[chars.charCodeAt(i$1)] = i$1;
                class CanvasManagerNoop {
                    reset() {}
                    freeze() {}
                    unfreeze() {}
                    lock() {}
                    unlock() {}
                    snapshot() {}
                    addWindow() {}
                    addShadowRoot() {}
                    resetShadowRoots() {}
                }
                class StylesheetManager {
                    constructor(options) {
                        ((this.trackedLinkElements = new WeakSet()),
                            (this.styleMirror = new StyleSheetMirror()),
                            (this.mutationCb = options.mutationCb),
                            (this.adoptedStyleSheetCb = options.adoptedStyleSheetCb));
                    }
                    attachLinkElement(linkEl, childSn) {
                        ("_cssText" in childSn.attributes &&
                            this.mutationCb({ adds: [], removes: [], texts: [], attributes: [{ id: childSn.id, attributes: childSn.attributes }] }),
                            this.trackLinkElement(linkEl));
                    }
                    trackLinkElement(linkEl) {
                        this.trackedLinkElements.has(linkEl) || (this.trackedLinkElements.add(linkEl), this.trackStylesheetInLinkElement(linkEl));
                    }
                    adoptStyleSheets(sheets, hostId) {
                        if (0 === sheets.length) return;
                        let adoptedStyleSheetData = { id: hostId, styleIds: [] },
                            styles = [];
                        for (let sheet of sheets) {
                            let styleId;
                            (this.styleMirror.has(sheet)
                                ? (styleId = this.styleMirror.getId(sheet))
                                : ((styleId = this.styleMirror.add(sheet)),
                                  styles.push({ styleId, rules: Array.from(sheet.rules || CSSRule, (r2, index) => ({ rule: stringifyRule(r2), index })) })),
                                adoptedStyleSheetData.styleIds.push(styleId));
                        }
                        (styles.length > 0 && (adoptedStyleSheetData.styles = styles), this.adoptedStyleSheetCb(adoptedStyleSheetData));
                    }
                    reset() {
                        (this.styleMirror.reset(), (this.trackedLinkElements = new WeakSet()));
                    }
                    trackStylesheetInLinkElement(_linkEl) {}
                }
                class ProcessedNodeManager {
                    constructor() {
                        ((this.nodeMap = new WeakMap()), (this.active = !1));
                    }
                    inOtherBuffer(node, thisBuffer) {
                        let buffers = this.nodeMap.get(node);
                        return buffers && Array.from(buffers).some((buffer) => buffer !== thisBuffer);
                    }
                    add(node, buffer) {
                        (this.active ||
                            ((this.active = !0),
                            (function (...rest) {
                                getImplementation("requestAnimationFrame")(...rest);
                            })(() => {
                                ((this.nodeMap = new WeakMap()), (this.active = !1));
                            })),
                            this.nodeMap.set(node, (this.nodeMap.get(node) || new Set()).add(buffer)));
                    }
                    destroy() {}
                }
                try {
                    if (2 !== Array.from([1], (x) => 2 * x)[0]) {
                        let cleanFrame = document.createElement("iframe");
                        (document.body.appendChild(cleanFrame), (Array.from = cleanFrame.contentWindow?.Array.from || Array.from), document.body.removeChild(cleanFrame));
                    }
                } catch (err) {
                    console.debug("Unable to override Array.from", err);
                }
                let mirror = new Mirror();
                function record(options = {}) {
                    let lastFullSnapshotEvent,
                        {
                            emit,
                            checkoutEveryNms,
                            checkoutEveryNth,
                            blockClass = "rr-block",
                            blockSelector = null,
                            unblockSelector = null,
                            ignoreClass = "rr-ignore",
                            ignoreSelector = null,
                            maskAllText = !1,
                            maskTextClass = "rr-mask",
                            unmaskTextClass = null,
                            maskTextSelector = null,
                            unmaskTextSelector = null,
                            inlineStylesheet = !0,
                            maskAllInputs,
                            maskInputOptions: _maskInputOptions,
                            slimDOMOptions: _slimDOMOptions,
                            maskAttributeFn,
                            maskInputFn,
                            maskTextFn,
                            maxCanvasSize = null,
                            packFn,
                            sampling = {},
                            dataURLOptions = {},
                            mousemoveWait,
                            recordDOM = !0,
                            recordCanvas = !1,
                            recordCrossOriginIframes = !1,
                            recordAfter = "DOMContentLoaded" === options.recordAfter ? options.recordAfter : "load",
                            userTriggeredOnInput = !1,
                            collectFonts = !1,
                            inlineImages = !1,
                            plugins,
                            keepIframeSrcFn = () => !1,
                            ignoreCSSAttributes = new Set([]),
                            errorHandler: errorHandler2,
                            onMutation,
                            getCanvasManager,
                        } = options;
                    errorHandler = errorHandler2;
                    let inEmittingFrame = !recordCrossOriginIframes || window.parent === window,
                        passEmitsToParent = !1;
                    if (!inEmittingFrame)
                        try {
                            window.parent.document && (passEmitsToParent = !1);
                        } catch (e2) {
                            passEmitsToParent = !0;
                        }
                    if (inEmittingFrame && !emit) throw Error("emit function is required");
                    if (!inEmittingFrame && !passEmitsToParent) return () => {};
                    (void 0 !== mousemoveWait && void 0 === sampling.mousemove && (sampling.mousemove = mousemoveWait), mirror.reset());
                    let maskInputOptions =
                            !0 === maskAllInputs
                                ? {
                                      color: !0,
                                      date: !0,
                                      "datetime-local": !0,
                                      email: !0,
                                      month: !0,
                                      number: !0,
                                      range: !0,
                                      search: !0,
                                      tel: !0,
                                      text: !0,
                                      time: !0,
                                      url: !0,
                                      week: !0,
                                      textarea: !0,
                                      select: !0,
                                      radio: !0,
                                      checkbox: !0,
                                  }
                                : void 0 !== _maskInputOptions
                                  ? _maskInputOptions
                                  : {},
                        slimDOMOptions =
                            !0 === _slimDOMOptions || "all" === _slimDOMOptions
                                ? {
                                      script: !0,
                                      comment: !0,
                                      headFavicon: !0,
                                      headWhitespace: !0,
                                      headMetaSocial: !0,
                                      headMetaRobots: !0,
                                      headMetaHttpEquiv: !0,
                                      headMetaVerification: !0,
                                      headMetaAuthorship: "all" === _slimDOMOptions,
                                      headMetaDescKeywords: "all" === _slimDOMOptions,
                                  }
                                : _slimDOMOptions || {};
                    !(function (win = window) {
                        ("NodeList" in win && !win.NodeList.prototype.forEach && (win.NodeList.prototype.forEach = Array.prototype.forEach),
                            "DOMTokenList" in win && !win.DOMTokenList.prototype.forEach && (win.DOMTokenList.prototype.forEach = Array.prototype.forEach),
                            Node.prototype.contains ||
                                (Node.prototype.contains = (...args) => {
                                    let node = args[0];
                                    if (!(0 in args)) throw TypeError("1 argument is required");
                                    do if (this === node) return !0;
                                    while ((node = node && node.parentNode));
                                    return !1;
                                }));
                    })();
                    let incrementalSnapshotCount = 0,
                        eventProcessor = (e2) => {
                            for (let plugin of plugins || []) plugin.eventProcessor && (e2 = plugin.eventProcessor(e2));
                            return (packFn && !passEmitsToParent && (e2 = packFn(e2)), e2);
                        };
                    wrappedEmit = (r2, isCheckout) => {
                        if (
                            ((r2.timestamp = nowTimestamp()),
                            mutationBuffers[0]?.isFrozen() &&
                                r2.type !== EventType.FullSnapshot &&
                                (r2.type !== EventType.IncrementalSnapshot || r2.data.source !== IncrementalSource.Mutation) &&
                                mutationBuffers.forEach((buf) => buf.unfreeze()),
                            inEmittingFrame)
                        )
                            emit?.(eventProcessor(r2), isCheckout);
                        else if (passEmitsToParent) {
                            let message = { type: "rrweb", event: eventProcessor(r2), origin: window.location.origin, isCheckout };
                            window.parent.postMessage(message, "*");
                        }
                        if (r2.type === EventType.FullSnapshot) ((lastFullSnapshotEvent = r2), (incrementalSnapshotCount = 0));
                        else if (r2.type === EventType.IncrementalSnapshot) {
                            if (r2.data.source === IncrementalSource.Mutation && r2.data.isAttachIframe) return;
                            incrementalSnapshotCount++;
                            let exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth,
                                exceedTime = checkoutEveryNms && lastFullSnapshotEvent && r2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
                            (exceedCount || exceedTime) && takeFullSnapshot2(!0);
                        }
                    };
                    let wrappedMutationEmit = (m) => {
                            wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.Mutation, ...m } });
                        },
                        wrappedScrollEmit = (p) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.Scroll, ...p } }),
                        wrappedCanvasMutationEmit = (p) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.CanvasMutation, ...p } }),
                        stylesheetManager = new StylesheetManager({
                            mutationCb: wrappedMutationEmit,
                            adoptedStyleSheetCb: (a2) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.AdoptedStyleSheet, ...a2 } }),
                        }),
                        iframeManager =
                            "boolean" == typeof __RRWEB_EXCLUDE_IFRAME__ && __RRWEB_EXCLUDE_IFRAME__
                                ? new IframeManagerNoop()
                                : new IframeManager({ mirror, mutationCb: wrappedMutationEmit, stylesheetManager, recordCrossOriginIframes, wrappedEmit });
                    for (let plugin of plugins || [])
                        plugin.getMirror &&
                            plugin.getMirror({
                                nodeMirror: mirror,
                                crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
                                crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror,
                            });
                    let processedNodeManager = new ProcessedNodeManager(),
                        canvasManager = (function (getCanvasManagerFn, options) {
                            try {
                                return getCanvasManagerFn ? getCanvasManagerFn(options) : new CanvasManagerNoop();
                            } catch {
                                return (console.warn("Unable to initialize CanvasManager"), new CanvasManagerNoop());
                            }
                        })(getCanvasManager, {
                            mirror,
                            win: window,
                            mutationCb: (p) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.CanvasMutation, ...p } }),
                            recordCanvas,
                            blockClass,
                            blockSelector,
                            unblockSelector,
                            maxCanvasSize,
                            sampling: sampling.canvas,
                            dataURLOptions,
                            errorHandler: errorHandler2,
                        }),
                        shadowDomManager =
                            "boolean" == typeof __RRWEB_EXCLUDE_SHADOW_DOM__ && __RRWEB_EXCLUDE_SHADOW_DOM__
                                ? new ShadowDomManagerNoop()
                                : new ShadowDomManager({
                                      mutationCb: wrappedMutationEmit,
                                      scrollCb: wrappedScrollEmit,
                                      bypassOptions: {
                                          onMutation,
                                          blockClass,
                                          blockSelector,
                                          unblockSelector,
                                          maskAllText,
                                          maskTextClass,
                                          unmaskTextClass,
                                          maskTextSelector,
                                          unmaskTextSelector,
                                          inlineStylesheet,
                                          maskInputOptions,
                                          dataURLOptions,
                                          maskAttributeFn,
                                          maskTextFn,
                                          maskInputFn,
                                          recordCanvas,
                                          inlineImages,
                                          sampling,
                                          slimDOMOptions,
                                          iframeManager,
                                          stylesheetManager,
                                          canvasManager,
                                          keepIframeSrcFn,
                                          processedNodeManager,
                                          ignoreCSSAttributes,
                                      },
                                      mirror,
                                  }),
                        takeFullSnapshot2 = (isCheckout = !1) => {
                            if (!recordDOM) return;
                            (wrappedEmit({ type: EventType.Meta, data: { href: window.location.href, width: getWindowWidth(), height: getWindowHeight() } }, isCheckout),
                                stylesheetManager.reset(),
                                shadowDomManager.init(),
                                mutationBuffers.forEach((buf) => buf.lock()));
                            let node = (function (n2, options) {
                                let {
                                    mirror: mirror2 = new Mirror(),
                                    blockClass = "rr-block",
                                    blockSelector = null,
                                    unblockSelector = null,
                                    maskAllText = !1,
                                    maskTextClass = "rr-mask",
                                    unmaskTextClass = null,
                                    maskTextSelector = null,
                                    unmaskTextSelector = null,
                                    inlineStylesheet = !0,
                                    inlineImages = !1,
                                    recordCanvas = !1,
                                    maskAllInputs = !1,
                                    maskAttributeFn,
                                    maskTextFn,
                                    maskInputFn,
                                    slimDOM = !1,
                                    dataURLOptions,
                                    preserveWhiteSpace,
                                    onSerialize,
                                    onIframeLoad,
                                    iframeLoadTimeout,
                                    onBlockedImageLoad,
                                    onStylesheetLoad,
                                    stylesheetLoadTimeout,
                                    keepIframeSrcFn = () => !1,
                                    ignoreCSSAttributes = new Set([]),
                                } = options || {};
                                return serializeNodeWithId(n2, {
                                    doc: n2,
                                    mirror: mirror2,
                                    blockClass,
                                    blockSelector,
                                    unblockSelector,
                                    maskAllText,
                                    maskTextClass,
                                    unmaskTextClass,
                                    maskTextSelector,
                                    unmaskTextSelector,
                                    skipChild: !1,
                                    inlineStylesheet,
                                    maskInputOptions:
                                        !0 === maskAllInputs
                                            ? {
                                                  color: !0,
                                                  date: !0,
                                                  "datetime-local": !0,
                                                  email: !0,
                                                  month: !0,
                                                  number: !0,
                                                  range: !0,
                                                  search: !0,
                                                  tel: !0,
                                                  text: !0,
                                                  time: !0,
                                                  url: !0,
                                                  week: !0,
                                                  textarea: !0,
                                                  select: !0,
                                              }
                                            : !1 === maskAllInputs
                                              ? {}
                                              : maskAllInputs,
                                    maskAttributeFn,
                                    maskTextFn,
                                    maskInputFn,
                                    slimDOMOptions:
                                        !0 === slimDOM || "all" === slimDOM
                                            ? {
                                                  script: !0,
                                                  comment: !0,
                                                  headFavicon: !0,
                                                  headWhitespace: !0,
                                                  headMetaDescKeywords: "all" === slimDOM,
                                                  headMetaSocial: !0,
                                                  headMetaRobots: !0,
                                                  headMetaHttpEquiv: !0,
                                                  headMetaAuthorship: !0,
                                                  headMetaVerification: !0,
                                              }
                                            : !1 === slimDOM
                                              ? {}
                                              : slimDOM,
                                    dataURLOptions,
                                    inlineImages,
                                    recordCanvas,
                                    preserveWhiteSpace,
                                    onSerialize,
                                    onIframeLoad,
                                    iframeLoadTimeout,
                                    onBlockedImageLoad,
                                    onStylesheetLoad,
                                    stylesheetLoadTimeout,
                                    keepIframeSrcFn,
                                    newlyAddedElement: !1,
                                    ignoreCSSAttributes,
                                });
                            })(document, {
                                mirror,
                                blockClass,
                                blockSelector,
                                unblockSelector,
                                maskAllText,
                                maskTextClass,
                                unmaskTextClass,
                                maskTextSelector,
                                unmaskTextSelector,
                                inlineStylesheet,
                                maskAllInputs: maskInputOptions,
                                maskAttributeFn,
                                maskInputFn,
                                maskTextFn,
                                slimDOM: slimDOMOptions,
                                dataURLOptions,
                                recordCanvas,
                                inlineImages,
                                onSerialize: (n2) => {
                                    (isSerializedIframe(n2, mirror) && iframeManager.addIframe(n2),
                                        isSerializedStylesheet(n2, mirror) && stylesheetManager.trackLinkElement(n2),
                                        hasShadowRoot(n2) && shadowDomManager.addShadowRoot(n2.shadowRoot, document));
                                },
                                onIframeLoad: (iframe, childSn) => {
                                    (iframeManager.attachIframe(iframe, childSn),
                                        iframe.contentWindow && canvasManager.addWindow(iframe.contentWindow),
                                        shadowDomManager.observeAttachShadow(iframe));
                                },
                                onStylesheetLoad: (linkEl, childSn) => {
                                    stylesheetManager.attachLinkElement(linkEl, childSn);
                                },
                                onBlockedImageLoad: (_imageEl, serializedNode, { width, height }) => {
                                    wrappedMutationEmit({
                                        adds: [],
                                        removes: [],
                                        texts: [],
                                        attributes: [{ id: serializedNode.id, attributes: { style: { width: `${width}px`, height: `${height}px` } } }],
                                    });
                                },
                                keepIframeSrcFn,
                                ignoreCSSAttributes,
                            });
                            if (!node) return console.warn("Failed to snapshot the document");
                            (wrappedEmit({ type: EventType.FullSnapshot, data: { node, initialOffset: getWindowScroll(window) } }),
                                mutationBuffers.forEach((buf) => buf.unlock()),
                                document.adoptedStyleSheets &&
                                    document.adoptedStyleSheets.length > 0 &&
                                    stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document)));
                        };
                    _takeFullSnapshot = takeFullSnapshot2;
                    try {
                        let handlers = [],
                            observe = (doc) =>
                                callbackWrapper(initObservers)(
                                    {
                                        onMutation,
                                        mutationCb: wrappedMutationEmit,
                                        mousemoveCb: (positions, source) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source, positions } }),
                                        mouseInteractionCb: (d) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.MouseInteraction, ...d } }),
                                        scrollCb: wrappedScrollEmit,
                                        viewportResizeCb: (d) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.ViewportResize, ...d } }),
                                        inputCb: (v2) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.Input, ...v2 } }),
                                        mediaInteractionCb: (p) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.MediaInteraction, ...p } }),
                                        styleSheetRuleCb: (r2) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.StyleSheetRule, ...r2 } }),
                                        styleDeclarationCb: (r2) =>
                                            wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.StyleDeclaration, ...r2 } }),
                                        canvasMutationCb: wrappedCanvasMutationEmit,
                                        fontCb: (p) => wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.Font, ...p } }),
                                        selectionCb: (p) => {
                                            wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.Selection, ...p } });
                                        },
                                        customElementCb: (c2) => {
                                            wrappedEmit({ type: EventType.IncrementalSnapshot, data: { source: IncrementalSource.CustomElement, ...c2 } });
                                        },
                                        blockClass,
                                        ignoreClass,
                                        ignoreSelector,
                                        maskAllText,
                                        maskTextClass,
                                        unmaskTextClass,
                                        maskTextSelector,
                                        unmaskTextSelector,
                                        maskInputOptions,
                                        inlineStylesheet,
                                        sampling,
                                        recordDOM,
                                        recordCanvas,
                                        inlineImages,
                                        userTriggeredOnInput,
                                        collectFonts,
                                        doc,
                                        maskAttributeFn,
                                        maskInputFn,
                                        maskTextFn,
                                        keepIframeSrcFn,
                                        blockSelector,
                                        unblockSelector,
                                        slimDOMOptions,
                                        dataURLOptions,
                                        mirror,
                                        iframeManager,
                                        stylesheetManager,
                                        shadowDomManager,
                                        processedNodeManager,
                                        canvasManager,
                                        ignoreCSSAttributes,
                                        plugins:
                                            plugins
                                                ?.filter((p) => p.observer)
                                                ?.map((p) => ({
                                                    observer: p.observer,
                                                    options: p.options,
                                                    callback: (payload) => wrappedEmit({ type: EventType.Plugin, data: { plugin: p.name, payload } }),
                                                })) || [],
                                    },
                                    {},
                                );
                        iframeManager.addLoadListener((iframeEl) => {
                            try {
                                handlers.push(observe(iframeEl.contentDocument));
                            } catch (error) {
                                console.warn(error);
                            }
                        });
                        let init = () => {
                            (takeFullSnapshot2(), handlers.push(observe(document)));
                        };
                        return (
                            "interactive" === document.readyState || "complete" === document.readyState
                                ? init()
                                : (handlers.push(
                                      on("DOMContentLoaded", () => {
                                          (wrappedEmit({ type: EventType.DomContentLoaded, data: {} }), "DOMContentLoaded" === recordAfter && init());
                                      }),
                                  ),
                                  handlers.push(
                                      on(
                                          "load",
                                          () => {
                                              (wrappedEmit({ type: EventType.Load, data: {} }), "load" === recordAfter && init());
                                          },
                                          window,
                                      ),
                                  )),
                            () => {
                                (handlers.forEach((h) => h()), processedNodeManager.destroy(), (_takeFullSnapshot = void 0), (errorHandler = void 0));
                            }
                        );
                    } catch (error) {
                        console.warn(error);
                    }
                }
                function timestampToMs(timestamp) {
                    return timestamp > 0x2540be3ff ? timestamp : 1e3 * timestamp;
                }
                function timestampToS(timestamp) {
                    return timestamp > 0x2540be3ff ? timestamp / 1e3 : timestamp;
                }
                function addBreadcrumbEvent(replay, breadcrumb) {
                    "sentry.transaction" !== breadcrumb.category &&
                        (["ui.click", "ui.input"].includes(breadcrumb.category) ? replay.triggerUserActivity() : replay.checkAndHandleExpiredSession(),
                        replay.addUpdate(
                            () => (
                                replay.throttledAddEvent({
                                    type: EventType.Custom,
                                    timestamp: 1e3 * (breadcrumb.timestamp || 0),
                                    data: { tag: "breadcrumb", payload: core.normalize(breadcrumb, 10, 1e3) },
                                }),
                                "console" === breadcrumb.category
                            ),
                        ));
                }
                function getClosestInteractive(element) {
                    return element.closest("button,a") || element;
                }
                function getClickTargetNode(event) {
                    let target = getTargetNode(event);
                    return target && target instanceof Element ? getClosestInteractive(target) : target;
                }
                function getTargetNode(event) {
                    var event1;
                    return "object" == typeof (event1 = event) && event1 && "target" in event1 ? event.target : event;
                }
                ((record.mirror = mirror),
                    (record.takeFullSnapshot = function (isCheckout) {
                        if (!_takeFullSnapshot) throw Error("please take full snapshot after start recording");
                        _takeFullSnapshot(isCheckout);
                    }),
                    ((t2 = n || (n = {}))[(t2.NotStarted = 0)] = "NotStarted"),
                    (t2[(t2.Running = 1)] = "Running"),
                    (t2[(t2.Stopped = 2)] = "Stopped"));
                let IncrementalMutationSources = new Set([
                    IncrementalSource.Mutation,
                    IncrementalSource.StyleSheetRule,
                    IncrementalSource.StyleDeclaration,
                    IncrementalSource.AdoptedStyleSheet,
                    IncrementalSource.CanvasMutation,
                    IncrementalSource.Selection,
                    IncrementalSource.MediaInteraction,
                ]);
                class ClickDetector {
                    constructor(replay, slowClickConfig, _addBreadcrumbEvent = addBreadcrumbEvent) {
                        ((this._lastMutation = 0),
                            (this._lastScroll = 0),
                            (this._clicks = []),
                            (this._timeout = slowClickConfig.timeout / 1e3),
                            (this._threshold = slowClickConfig.threshold / 1e3),
                            (this._scrollTimeout = slowClickConfig.scrollTimeout / 1e3),
                            (this._replay = replay),
                            (this._ignoreSelector = slowClickConfig.ignoreSelector),
                            (this._addBreadcrumbEvent = _addBreadcrumbEvent));
                    }
                    addListeners() {
                        var cb;
                        let cleanupWindowOpen =
                            ((cb = () => {
                                this._lastMutation = nowInSeconds();
                            }),
                            handlers ||
                                ((handlers = []),
                                core.fill(WINDOW, "open", function (originalWindowOpen) {
                                    return function (...args) {
                                        if (handlers)
                                            try {
                                                handlers.forEach((handler) => handler());
                                            } catch {}
                                        return originalWindowOpen.apply(WINDOW, args);
                                    };
                                })),
                            handlers.push(cb),
                            () => {
                                let pos = handlers ? handlers.indexOf(cb) : -1;
                                pos > -1 && handlers.splice(pos, 1);
                            });
                        this._teardown = () => {
                            (cleanupWindowOpen(), (this._clicks = []), (this._lastMutation = 0), (this._lastScroll = 0));
                        };
                    }
                    removeListeners() {
                        (this._teardown && this._teardown(), this._checkClickTimeout && clearTimeout(this._checkClickTimeout));
                    }
                    handleClick(breadcrumb, node) {
                        var node1, ignoreSelector, breadcrumb1;
                        if (
                            ((node1 = node),
                            (ignoreSelector = this._ignoreSelector),
                            !SLOW_CLICK_TAGS.includes(node1.tagName) ||
                                ("INPUT" === node1.tagName && !["submit", "button"].includes(node1.getAttribute("type") || "")) ||
                                ("A" === node1.tagName && (node1.hasAttribute("download") || (node1.hasAttribute("target") && "_self" !== node1.getAttribute("target")))) ||
                                (ignoreSelector && node1.matches(ignoreSelector)) ||
                                !((breadcrumb1 = breadcrumb).data && "number" == typeof breadcrumb1.data.nodeId && breadcrumb1.timestamp))
                        )
                            return;
                        let newClick = { timestamp: timestampToS(breadcrumb.timestamp), clickBreadcrumb: breadcrumb, clickCount: 0, node };
                        this._clicks.some((click) => click.node === newClick.node && 1 > Math.abs(click.timestamp - newClick.timestamp)) ||
                            (this._clicks.push(newClick), 1 === this._clicks.length && this._scheduleCheckClicks());
                    }
                    registerMutation(timestamp = Date.now()) {
                        this._lastMutation = timestampToS(timestamp);
                    }
                    registerScroll(timestamp = Date.now()) {
                        this._lastScroll = timestampToS(timestamp);
                    }
                    registerClick(element) {
                        let node = getClosestInteractive(element);
                        this._handleMultiClick(node);
                    }
                    _handleMultiClick(node) {
                        this._getClicks(node).forEach((click) => {
                            click.clickCount++;
                        });
                    }
                    _getClicks(node) {
                        return this._clicks.filter((click) => click.node === node);
                    }
                    _checkClicks() {
                        let timedOutClicks = [],
                            now = nowInSeconds();
                        for (let click of (this._clicks.forEach((click) => {
                            (!click.mutationAfter &&
                                this._lastMutation &&
                                (click.mutationAfter = click.timestamp <= this._lastMutation ? this._lastMutation - click.timestamp : void 0),
                                !click.scrollAfter && this._lastScroll && (click.scrollAfter = click.timestamp <= this._lastScroll ? this._lastScroll - click.timestamp : void 0),
                                click.timestamp + this._timeout <= now && timedOutClicks.push(click));
                        }),
                        timedOutClicks)) {
                            let pos = this._clicks.indexOf(click);
                            pos > -1 && (this._generateBreadcrumbs(click), this._clicks.splice(pos, 1));
                        }
                        this._clicks.length && this._scheduleCheckClicks();
                    }
                    _generateBreadcrumbs(click) {
                        let replay = this._replay,
                            hadScroll = click.scrollAfter && click.scrollAfter <= this._scrollTimeout,
                            hadMutation = click.mutationAfter && click.mutationAfter <= this._threshold,
                            { clickCount, clickBreadcrumb } = click;
                        if (!hadScroll && !hadMutation) {
                            let timeAfterClickMs = 1e3 * Math.min(click.mutationAfter || this._timeout, this._timeout),
                                endReason = timeAfterClickMs < 1e3 * this._timeout ? "mutation" : "timeout",
                                breadcrumb = {
                                    type: "default",
                                    message: clickBreadcrumb.message,
                                    timestamp: clickBreadcrumb.timestamp,
                                    category: "ui.slowClickDetected",
                                    data: {
                                        ...clickBreadcrumb.data,
                                        url: WINDOW.location.href,
                                        route: replay.getCurrentRoute(),
                                        timeAfterClickMs,
                                        endReason,
                                        clickCount: clickCount || 1,
                                    },
                                };
                            this._addBreadcrumbEvent(replay, breadcrumb);
                            return;
                        }
                        if (clickCount > 1) {
                            let breadcrumb = {
                                type: "default",
                                message: clickBreadcrumb.message,
                                timestamp: clickBreadcrumb.timestamp,
                                category: "ui.multiClick",
                                data: { ...clickBreadcrumb.data, url: WINDOW.location.href, route: replay.getCurrentRoute(), clickCount, metric: !0 },
                            };
                            this._addBreadcrumbEvent(replay, breadcrumb);
                        }
                    }
                    _scheduleCheckClicks() {
                        (this._checkClickTimeout && clearTimeout(this._checkClickTimeout), (this._checkClickTimeout = browserUtils.setTimeout(() => this._checkClicks(), 1e3)));
                    }
                }
                let SLOW_CLICK_TAGS = ["A", "BUTTON", "INPUT"];
                function nowInSeconds() {
                    return Date.now() / 1e3;
                }
                function createBreadcrumb(breadcrumb) {
                    return { timestamp: Date.now() / 1e3, type: "default", ...breadcrumb };
                }
                var NodeType =
                    (((NodeType21 = NodeType || {})[(NodeType21.Document = 0)] = "Document"),
                    (NodeType21[(NodeType21.DocumentType = 1)] = "DocumentType"),
                    (NodeType21[(NodeType21.Element = 2)] = "Element"),
                    (NodeType21[(NodeType21.Text = 3)] = "Text"),
                    (NodeType21[(NodeType21.CDATA = 4)] = "CDATA"),
                    (NodeType21[(NodeType21.Comment = 5)] = "Comment"),
                    NodeType21);
                let ATTRIBUTES_TO_RECORD = new Set([
                    "id",
                    "class",
                    "aria-label",
                    "role",
                    "name",
                    "alt",
                    "title",
                    "data-test-id",
                    "data-testid",
                    "disabled",
                    "aria-disabled",
                    "data-sentry-component",
                ]);
                function getBaseDomBreadcrumb(target, message) {
                    let nodeId = record.mirror.getId(target),
                        node = nodeId && record.mirror.getNode(nodeId),
                        meta = node && record.mirror.getMeta(node),
                        element = meta && meta.type === NodeType.Element ? meta : null;
                    return {
                        message,
                        data: element
                            ? {
                                  nodeId,
                                  node: {
                                      id: nodeId,
                                      tagName: element.tagName,
                                      textContent: Array.from(element.childNodes)
                                          .map((node) => node.type === NodeType.Text && node.textContent)
                                          .filter(Boolean)
                                          .map((text) => text.trim())
                                          .join(""),
                                      attributes: (function (attributes) {
                                          let obj = {};
                                          for (let key in (!attributes["data-sentry-component"] &&
                                              attributes["data-sentry-element"] &&
                                              (attributes["data-sentry-component"] = attributes["data-sentry-element"]),
                                          attributes))
                                              if (ATTRIBUTES_TO_RECORD.has(key)) {
                                                  let normalizedKey = key;
                                                  (("data-testid" === key || "data-test-id" === key) && (normalizedKey = "testId"), (obj[normalizedKey] = attributes[key]));
                                              }
                                          return obj;
                                      })(element.attributes),
                                  },
                              }
                            : {},
                    };
                }
                let ENTRY_TYPES = {
                    resource: function (entry) {
                        let { entryType, initiatorType, name, responseEnd, startTime, decodedBodySize, encodedBodySize, responseStatus, transferSize } = entry;
                        return ["fetch", "xmlhttprequest"].includes(initiatorType)
                            ? null
                            : {
                                  type: `${entryType}.${initiatorType}`,
                                  start: getAbsoluteTime(startTime),
                                  end: getAbsoluteTime(responseEnd),
                                  name,
                                  data: { size: transferSize, statusCode: responseStatus, decodedBodySize, encodedBodySize },
                              };
                    },
                    paint: function (entry) {
                        let { duration, entryType, name, startTime } = entry,
                            start = getAbsoluteTime(startTime);
                        return { type: entryType, name, start, end: start + duration, data: void 0 };
                    },
                    navigation: function (entry) {
                        let {
                            entryType,
                            name,
                            decodedBodySize,
                            duration,
                            domComplete,
                            encodedBodySize,
                            domContentLoadedEventStart,
                            domContentLoadedEventEnd,
                            domInteractive,
                            loadEventStart,
                            loadEventEnd,
                            redirectCount,
                            startTime,
                            transferSize,
                            type,
                        } = entry;
                        return 0 === duration
                            ? null
                            : {
                                  type: `${entryType}.${type}`,
                                  start: getAbsoluteTime(startTime),
                                  end: getAbsoluteTime(domComplete),
                                  name,
                                  data: {
                                      size: transferSize,
                                      decodedBodySize,
                                      encodedBodySize,
                                      duration,
                                      domInteractive,
                                      domContentLoadedEventStart,
                                      domContentLoadedEventEnd,
                                      loadEventStart,
                                      loadEventEnd,
                                      domComplete,
                                      redirectCount,
                                  },
                              };
                    },
                };
                function webVitalHandler(getter, replay) {
                    return ({ metric }) => void replay.replayPerformanceEntries.push(getter(metric));
                }
                function createPerformanceEntry(entry) {
                    let entryType = ENTRY_TYPES[entry.entryType];
                    return entryType ? entryType(entry) : null;
                }
                function getAbsoluteTime(time) {
                    return ((core.browserPerformanceTimeOrigin() || WINDOW.performance.timeOrigin) + time) / 1e3;
                }
                function getLargestContentfulPaint(metric) {
                    let lastEntry = metric.entries[metric.entries.length - 1];
                    return getWebVital(metric, "largest-contentful-paint", lastEntry?.element ? [lastEntry.element] : void 0);
                }
                function getCumulativeLayoutShift(metric) {
                    let layoutShifts = [],
                        nodes = [];
                    for (let entry of metric.entries)
                        if (void 0 !== entry.sources) {
                            let nodeIds = [];
                            for (let source of entry.sources)
                                if (source.node) {
                                    nodes.push(source.node);
                                    let nodeId = record.mirror.getId(source.node);
                                    nodeId && nodeIds.push(nodeId);
                                }
                            layoutShifts.push({ value: entry.value, nodeIds: nodeIds.length ? nodeIds : void 0 });
                        }
                    return getWebVital(metric, "cumulative-layout-shift", nodes, layoutShifts);
                }
                function getInteractionToNextPaint(metric) {
                    let lastEntry = metric.entries[metric.entries.length - 1];
                    return getWebVital(metric, "interaction-to-next-paint", lastEntry?.target ? [lastEntry.target] : void 0);
                }
                function getWebVital(metric, name, nodes, attributions) {
                    let value = metric.value,
                        rating = metric.rating,
                        end = getAbsoluteTime(value);
                    return {
                        type: "web-vital",
                        name,
                        start: end,
                        end,
                        data: { value, size: value, rating, nodeIds: nodes ? nodes.map((node) => record.mirror.getId(node)) : void 0, attributions },
                    };
                }
                let DEBUG_BUILD = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
                    CONSOLE_LEVELS = ["log", "warn", "error"],
                    PREFIX = "[Replay] ";
                function _addBreadcrumb(message, level = "info") {
                    core.addBreadcrumb({ category: "console", data: { logger: "replay" }, level, message: `${PREFIX}${message}` }, { level });
                }
                let debug =
                    ((_capture = !1),
                    (_trace = !1),
                    (_debug = {
                        exception: () => void 0,
                        infoTick: () => void 0,
                        setConfig: (opts) => {
                            ((_capture = !!opts.captureExceptions), (_trace = !!opts.traceInternals));
                        },
                    }),
                    DEBUG_BUILD
                        ? (CONSOLE_LEVELS.forEach((name) => {
                              _debug[name] = (...args) => {
                                  (core.debug[name](PREFIX, ...args), _trace && _addBreadcrumb(args.join(""), core.severityLevelFromString(name)));
                              };
                          }),
                          (_debug.exception = (error, ...message) => {
                              (message.length && _debug.error && _debug.error(...message),
                                  core.debug.error(PREFIX, error),
                                  _capture
                                      ? core.captureException(error, { mechanism: { handled: !0, type: "auto.function.replay.debug" } })
                                      : _trace && _addBreadcrumb(error, "error"));
                          }),
                          (_debug.infoTick = (...args) => {
                              (core.debug.log(PREFIX, ...args), _trace && setTimeout(() => _addBreadcrumb(args[0]), 0));
                          }))
                        : CONSOLE_LEVELS.forEach((name) => {
                              _debug[name] = () => void 0;
                          }),
                    _debug);
                class EventBufferSizeExceededError extends Error {
                    constructor() {
                        super("Event buffer exceeded maximum size of 20000000.");
                    }
                }
                class EventBufferArray {
                    constructor() {
                        ((this.events = []), (this._totalSize = 0), (this.hasCheckout = !1), (this.waitForCheckout = !1));
                    }
                    get hasEvents() {
                        return this.events.length > 0;
                    }
                    get type() {
                        return "sync";
                    }
                    destroy() {
                        this.events = [];
                    }
                    async addEvent(event) {
                        let eventSize = JSON.stringify(event).length;
                        if (((this._totalSize += eventSize), this._totalSize > 2e7)) throw new EventBufferSizeExceededError();
                        this.events.push(event);
                    }
                    finish() {
                        return new Promise((resolve) => {
                            let eventsRet = this.events;
                            (this.clear(), resolve(JSON.stringify(eventsRet)));
                        });
                    }
                    clear() {
                        ((this.events = []), (this._totalSize = 0), (this.hasCheckout = !1));
                    }
                    getEarliestTimestamp() {
                        let ts = null;
                        for (let { timestamp } of this.events) (null === ts || timestamp < ts) && (ts = timestamp);
                        return null === ts ? ts : timestampToMs(ts);
                    }
                }
                class WorkerHandler {
                    constructor(worker) {
                        ((this._worker = worker), (this._id = 0));
                    }
                    ensureReady() {
                        return (
                            this._ensureReadyPromise ||
                                (this._ensureReadyPromise = new Promise((resolve, reject) => {
                                    (this._worker.addEventListener(
                                        "message",
                                        ({ data }) => {
                                            data.success
                                                ? resolve()
                                                : (DEBUG_BUILD && debug.warn("Received worker message with unsuccessful status", data),
                                                  reject(Error("Received worker message with unsuccessful status")));
                                        },
                                        { once: !0 },
                                    ),
                                        this._worker.addEventListener(
                                            "error",
                                            (error) => {
                                                (DEBUG_BUILD && debug.warn("Failed to load Replay compression worker", error),
                                                    reject(
                                                        Error(
                                                            `Failed to load Replay compression worker: ${error instanceof ErrorEvent && error.message ? error.message : "Unknown error. This can happen due to CSP policy restrictions, network issues, or the worker script failing to load."}`,
                                                        ),
                                                    ));
                                            },
                                            { once: !0 },
                                        ));
                                })),
                            this._ensureReadyPromise
                        );
                    }
                    destroy() {
                        (DEBUG_BUILD && debug.log("Destroying compression worker"), this._worker.terminate());
                    }
                    postMessage(method, arg) {
                        let id = this._getAndIncrementId();
                        return new Promise((resolve, reject) => {
                            let listener = ({ data }) => {
                                if (data.method === method && data.id === id) {
                                    if ((this._worker.removeEventListener("message", listener), !data.success)) {
                                        (DEBUG_BUILD && debug.error("Error in compression worker: ", data.response), reject(Error("Error in compression worker")));
                                        return;
                                    }
                                    resolve(data.response);
                                }
                            };
                            (this._worker.addEventListener("message", listener), this._worker.postMessage({ id, method, arg }));
                        });
                    }
                    _getAndIncrementId() {
                        return this._id++;
                    }
                }
                class EventBufferCompressionWorker {
                    constructor(worker) {
                        ((this._worker = new WorkerHandler(worker)), (this._earliestTimestamp = null), (this._totalSize = 0), (this.hasCheckout = !1), (this.waitForCheckout = !1));
                    }
                    get hasEvents() {
                        return !!this._earliestTimestamp;
                    }
                    get type() {
                        return "worker";
                    }
                    ensureReady() {
                        return this._worker.ensureReady();
                    }
                    destroy() {
                        this._worker.destroy();
                    }
                    addEvent(event) {
                        let timestamp = timestampToMs(event.timestamp);
                        (!this._earliestTimestamp || timestamp < this._earliestTimestamp) && (this._earliestTimestamp = timestamp);
                        let data = JSON.stringify(event);
                        return ((this._totalSize += data.length), this._totalSize > 2e7) ? Promise.reject(new EventBufferSizeExceededError()) : this._sendEventToWorker(data);
                    }
                    finish() {
                        return this._finishRequest();
                    }
                    clear() {
                        ((this._earliestTimestamp = null),
                            (this._totalSize = 0),
                            (this.hasCheckout = !1),
                            this._worker.postMessage("clear").then(null, (e) => {
                                DEBUG_BUILD && debug.exception(e, 'Sending "clear" message to worker failed', e);
                            }));
                    }
                    getEarliestTimestamp() {
                        return this._earliestTimestamp;
                    }
                    _sendEventToWorker(data) {
                        return this._worker.postMessage("addEvent", data);
                    }
                    async _finishRequest() {
                        let response = await this._worker.postMessage("finish");
                        return ((this._earliestTimestamp = null), (this._totalSize = 0), response);
                    }
                }
                class EventBufferProxy {
                    constructor(worker) {
                        ((this._fallback = new EventBufferArray()),
                            (this._compression = new EventBufferCompressionWorker(worker)),
                            (this._used = this._fallback),
                            (this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded()));
                    }
                    get waitForCheckout() {
                        return this._used.waitForCheckout;
                    }
                    get type() {
                        return this._used.type;
                    }
                    get hasEvents() {
                        return this._used.hasEvents;
                    }
                    get hasCheckout() {
                        return this._used.hasCheckout;
                    }
                    set hasCheckout(value) {
                        this._used.hasCheckout = value;
                    }
                    set waitForCheckout(value) {
                        this._used.waitForCheckout = value;
                    }
                    destroy() {
                        (this._fallback.destroy(), this._compression.destroy());
                    }
                    clear() {
                        return this._used.clear();
                    }
                    getEarliestTimestamp() {
                        return this._used.getEarliestTimestamp();
                    }
                    addEvent(event) {
                        return this._used.addEvent(event);
                    }
                    async finish() {
                        return (await this.ensureWorkerIsLoaded(), this._used.finish());
                    }
                    ensureWorkerIsLoaded() {
                        return this._ensureWorkerIsLoadedPromise;
                    }
                    async _ensureWorkerIsLoaded() {
                        try {
                            await this._compression.ensureReady();
                        } catch (error) {
                            DEBUG_BUILD && debug.exception(error, "Failed to load the compression worker, falling back to simple buffer");
                            return;
                        }
                        await this._switchToCompressionWorker();
                    }
                    async _switchToCompressionWorker() {
                        let { events, hasCheckout, waitForCheckout } = this._fallback,
                            addEventPromises = [];
                        for (let event of events) addEventPromises.push(this._compression.addEvent(event));
                        ((this._compression.hasCheckout = hasCheckout), (this._compression.waitForCheckout = waitForCheckout), (this._used = this._compression));
                        try {
                            (await Promise.all(addEventPromises), this._fallback.clear());
                        } catch (error) {
                            DEBUG_BUILD && debug.exception(error, "Failed to add events when switching buffers.");
                        }
                    }
                }
                function hasSessionStorage() {
                    try {
                        return "sessionStorage" in WINDOW && !!WINDOW.sessionStorage;
                    } catch {
                        return !1;
                    }
                }
                function isSampled(sampleRate) {
                    return void 0 !== sampleRate && Math.random() < sampleRate;
                }
                function saveSession(session) {
                    if (hasSessionStorage())
                        try {
                            WINDOW.sessionStorage.setItem(REPLAY_SESSION_KEY, JSON.stringify(session));
                        } catch {}
                }
                function makeSession(session) {
                    let now = Date.now(),
                        id = session.id || core.uuid4(),
                        started = session.started || now,
                        lastActivity = session.lastActivity || now,
                        segmentId = session.segmentId || 0,
                        sampled = session.sampled;
                    return { id, started, lastActivity, segmentId, sampled, previousSessionId: session.previousSessionId, dirty: session.dirty || !1 };
                }
                function createSession({ sessionSampleRate, allowBuffering, stickySession = !1 }, { previousSessionId } = {}) {
                    let session = makeSession({ sampled: isSampled(sessionSampleRate) ? "session" : !!allowBuffering && "buffer", previousSessionId });
                    return (stickySession && saveSession(session), session);
                }
                function isExpired(initialTime, expiry, targetTime = +new Date()) {
                    return null === initialTime || void 0 === expiry || expiry < 0 || (0 !== expiry && initialTime + expiry <= targetTime);
                }
                function isSessionExpired(session, { maxReplayDuration, sessionIdleExpire, targetTime = Date.now() }) {
                    return isExpired(session.started, maxReplayDuration, targetTime) || isExpired(session.lastActivity, sessionIdleExpire, targetTime);
                }
                function shouldRefreshSession(session, { sessionIdleExpire, maxReplayDuration }) {
                    return !!isSessionExpired(session, { sessionIdleExpire, maxReplayDuration }) && ("buffer" !== session.sampled || 0 !== session.segmentId);
                }
                function loadOrCreateSession({ sessionIdleExpire, maxReplayDuration, previousSessionId }, sessionOptions) {
                    let existingSession =
                        sessionOptions.stickySession &&
                        (function () {
                            if (!hasSessionStorage()) return null;
                            try {
                                let sessionStringFromStorage = WINDOW.sessionStorage.getItem(REPLAY_SESSION_KEY);
                                if (!sessionStringFromStorage) return null;
                                let sessionObj = JSON.parse(sessionStringFromStorage);
                                return (DEBUG_BUILD && debug.infoTick("Loading existing session"), makeSession(sessionObj));
                            } catch {
                                return null;
                            }
                        })();
                    return existingSession
                        ? shouldRefreshSession(existingSession, { sessionIdleExpire, maxReplayDuration })
                            ? (DEBUG_BUILD && debug.infoTick("Session in sessionStorage is expired, creating new one..."),
                              createSession(sessionOptions, { previousSessionId: existingSession.id }))
                            : existingSession
                        : (DEBUG_BUILD && debug.infoTick("Creating new session"), createSession(sessionOptions, { previousSessionId }));
                }
                function addEventSync(replay, event, isCheckout) {
                    return !!shouldAddEvent(replay, event) && (_addEvent(replay, event, isCheckout), !0);
                }
                async function _addEvent(replay, event, isCheckout) {
                    let { eventBuffer } = replay;
                    if (!eventBuffer || (eventBuffer.waitForCheckout && !isCheckout)) return null;
                    let isBufferMode = "buffer" === replay.recordingMode;
                    try {
                        (isCheckout && isBufferMode && eventBuffer.clear(), isCheckout && ((eventBuffer.hasCheckout = !0), (eventBuffer.waitForCheckout = !1)));
                        let replayOptions = replay.getOptions(),
                            eventAfterPossibleCallback = (function (event, callback) {
                                try {
                                    if ("function" == typeof callback && event.type === EventType.Custom) return callback(event);
                                } catch (error) {
                                    return (DEBUG_BUILD && debug.exception(error, "An error occurred in the `beforeAddRecordingEvent` callback, skipping the event..."), null);
                                }
                                return event;
                            })(event, replayOptions.beforeAddRecordingEvent);
                        if (!eventAfterPossibleCallback) return;
                        return await eventBuffer.addEvent(eventAfterPossibleCallback);
                    } catch (error) {
                        let isExceeded = error && error instanceof EventBufferSizeExceededError,
                            client = core.getClient();
                        if ((client && client.recordDroppedEvent(isExceeded ? "buffer_overflow" : "internal_sdk_error", "replay"), isExceeded && isBufferMode))
                            return (eventBuffer.clear(), (eventBuffer.waitForCheckout = !0), null);
                        (replay.handleException(error), await replay.stop({ reason: isExceeded ? "eventBufferOverflow" : "eventBufferError" }));
                    }
                }
                function shouldAddEvent(replay, event) {
                    if (!replay.eventBuffer || replay.isPaused() || !replay.isEnabled()) return !1;
                    let timestampInMs = timestampToMs(event.timestamp);
                    return (
                        !(timestampInMs + replay.timeouts.sessionIdlePause < Date.now()) &&
                        (!(timestampInMs > replay.getContext().initialTimestamp + replay.getOptions().maxReplayDuration) ||
                            (DEBUG_BUILD && debug.infoTick(`Skipping event with timestamp ${timestampInMs} because it is after maxReplayDuration`), !1))
                    );
                }
                function isTransactionEvent(event) {
                    return "transaction" === event.type;
                }
                function isFeedbackEvent(event) {
                    return "feedback" === event.type;
                }
                function isBreadcrumbWithCategory(breadcrumb) {
                    return !!breadcrumb.category;
                }
                function resetReplayIdOnDynamicSamplingContext() {
                    let dsc = core.getCurrentScope().getPropagationContext().dsc;
                    dsc && delete dsc.replay_id;
                    let activeSpan = core.getActiveSpan();
                    if (activeSpan) {
                        let dsc = core.getDynamicSamplingContextFromSpan(activeSpan);
                        delete dsc.replay_id;
                    }
                }
                function createPerformanceSpans(replay, entries) {
                    return entries.map(({ type, start, end, name, data }) => {
                        let response = replay.throttledAddEvent({
                            type: EventType.Custom,
                            timestamp: start,
                            data: { tag: "performanceSpan", payload: { op: type, description: name, startTimestamp: start, endTimestamp: end, data } },
                        });
                        return "string" == typeof response ? Promise.resolve(null) : response;
                    });
                }
                function addNetworkBreadcrumb(replay, result) {
                    var url;
                    replay.isEnabled() &&
                        null !== result &&
                        ((url = result.name),
                        ((!DEBUG_BUILD || !replay.getOptions()._experiments.traceInternals) && core.isSentryRequestUrl(url, core.getClient())) ||
                            replay.addUpdate(() => (createPerformanceSpans(replay, [result]), !0)));
                }
                function getBodySize(body) {
                    if (!body) return;
                    let textEncoder = new TextEncoder();
                    try {
                        if ("string" == typeof body) return textEncoder.encode(body).length;
                        if (body instanceof URLSearchParams) return textEncoder.encode(body.toString()).length;
                        if (body instanceof FormData) {
                            let formDataStr = browserUtils.serializeFormData(body);
                            return textEncoder.encode(formDataStr).length;
                        }
                        if (body instanceof Blob) return body.size;
                        if (body instanceof ArrayBuffer) return body.byteLength;
                    } catch {}
                }
                function parseContentLengthHeader(header) {
                    if (!header) return;
                    let size = parseInt(header, 10);
                    return isNaN(size) ? void 0 : size;
                }
                function mergeWarning(info, warning) {
                    if (!info) return { headers: {}, size: void 0, _meta: { warnings: [warning] } };
                    let newMeta = { ...info._meta },
                        existingWarnings = newMeta.warnings || [];
                    return ((newMeta.warnings = [...existingWarnings, warning]), (info._meta = newMeta), info);
                }
                function makeNetworkReplayBreadcrumb(type, data) {
                    if (!data) return null;
                    let { startTimestamp, endTimestamp, url, method, statusCode, request, response } = data;
                    return { type, start: startTimestamp / 1e3, end: endTimestamp / 1e3, name: url, data: { method, statusCode, request, response } };
                }
                function buildSkippedNetworkRequestOrResponse(bodySize) {
                    return { headers: {}, size: bodySize, _meta: { warnings: ["URL_SKIPPED"] } };
                }
                function buildNetworkRequestOrResponse(headers, bodySize, body) {
                    if (!bodySize && 0 === Object.keys(headers).length) return;
                    if (!bodySize) return { headers };
                    if (!body) return { headers, size: bodySize };
                    let info = { headers, size: bodySize },
                        { body: normalizedBody, warnings } = (function (body) {
                            var str;
                            let first, last;
                            if (!body || "string" != typeof body) return { body };
                            let exceedsSizeLimit = body.length > 15e4,
                                isProbablyJson = ((first = (str = body)[0]), (last = str[str.length - 1]), ("[" === first && "]" === last) || ("{" === first && "}" === last));
                            if (exceedsSizeLimit) {
                                let truncatedBody = body.slice(0, 15e4);
                                return isProbablyJson
                                    ? { body: truncatedBody, warnings: ["MAYBE_JSON_TRUNCATED"] }
                                    : { body: `${truncatedBody}\u{2026}`, warnings: ["TEXT_TRUNCATED"] };
                            }
                            if (isProbablyJson)
                                try {
                                    return { body: JSON.parse(body) };
                                } catch {}
                            return { body };
                        })(body);
                    return ((info.body = normalizedBody), warnings?.length && (info._meta = { warnings }), info);
                }
                function getAllowedHeaders(headers, allowedHeaders) {
                    return Object.entries(headers).reduce((filteredHeaders, [key, value]) => {
                        let normalizedKey = key.toLowerCase();
                        return (allowedHeaders.includes(normalizedKey) && headers[key] && (filteredHeaders[normalizedKey] = value), filteredHeaders);
                    }, {});
                }
                function urlMatches(url, urls) {
                    let fullUrl = (function (url, baseURI = WINDOW.document.baseURI) {
                        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith(WINDOW.location.origin)) return url;
                        let fixedUrl = new URL(url, baseURI);
                        if (fixedUrl.origin !== new URL(baseURI).origin) return url;
                        let fullUrl = fixedUrl.href;
                        return !url.endsWith("/") && fullUrl.endsWith("/") ? fullUrl.slice(0, -1) : fullUrl;
                    })(url);
                    return core.stringMatchesSomePattern(fullUrl, urls);
                }
                async function captureFetchBreadcrumbToReplay(breadcrumb, hint, options) {
                    try {
                        let data = await _prepareFetchData(breadcrumb, hint, options),
                            result = makeNetworkReplayBreadcrumb("resource.fetch", data);
                        addNetworkBreadcrumb(options.replay, result);
                    } catch (error) {
                        DEBUG_BUILD && debug.exception(error, "Failed to capture fetch breadcrumb");
                    }
                }
                async function _prepareFetchData(breadcrumb, hint, options) {
                    let now = Date.now(),
                        { startTimestamp = now, endTimestamp = now } = hint,
                        { url, method, status_code: statusCode = 0, request_body_size: requestBodySize, response_body_size: responseBodySize } = breadcrumb.data,
                        captureDetails = urlMatches(url, options.networkDetailAllowUrls) && !urlMatches(url, options.networkDetailDenyUrls);
                    return {
                        startTimestamp,
                        endTimestamp,
                        url,
                        method,
                        statusCode,
                        request: captureDetails
                            ? (function ({ networkCaptureBodies, networkRequestHeaders }, input, requestBodySize) {
                                  var fetchArgs, allowedHeaders;
                                  let headers = input
                                      ? ((fetchArgs = input),
                                        (allowedHeaders = networkRequestHeaders),
                                        1 === fetchArgs.length && "string" != typeof fetchArgs[0]
                                            ? getHeadersFromOptions(fetchArgs[0], allowedHeaders)
                                            : 2 === fetchArgs.length
                                              ? getHeadersFromOptions(fetchArgs[1], allowedHeaders)
                                              : {})
                                      : {};
                                  if (!networkCaptureBodies) return buildNetworkRequestOrResponse(headers, requestBodySize, void 0);
                                  let requestBody = browserUtils.getFetchRequestArgBody(input),
                                      [bodyStr, warning] = browserUtils.getBodyString(requestBody, debug),
                                      data = buildNetworkRequestOrResponse(headers, requestBodySize, bodyStr);
                                  return warning ? mergeWarning(data, warning) : data;
                              })(options, hint.input, requestBodySize)
                            : buildSkippedNetworkRequestOrResponse(requestBodySize),
                        response: await _getResponseInfo(captureDetails, options, hint.response, responseBodySize),
                    };
                }
                async function _getResponseInfo(captureDetails, { networkCaptureBodies, networkResponseHeaders }, response, responseBodySize) {
                    if (!captureDetails && void 0 !== responseBodySize) return buildSkippedNetworkRequestOrResponse(responseBodySize);
                    let headers = response ? getAllHeaders(response.headers, networkResponseHeaders) : {};
                    if (!response || (!networkCaptureBodies && void 0 !== responseBodySize)) return buildNetworkRequestOrResponse(headers, responseBodySize, void 0);
                    let [bodyText, warning] = await _parseFetchResponseBody(response),
                        result = (function (bodyText, { networkCaptureBodies, responseBodySize, captureDetails, headers }) {
                            try {
                                let size = bodyText?.length && void 0 === responseBodySize ? getBodySize(bodyText) : responseBodySize;
                                if (!captureDetails) return buildSkippedNetworkRequestOrResponse(size);
                                if (networkCaptureBodies) return buildNetworkRequestOrResponse(headers, size, bodyText);
                                return buildNetworkRequestOrResponse(headers, size, void 0);
                            } catch (error) {
                                return (
                                    DEBUG_BUILD && debug.exception(error, "Failed to serialize response body"),
                                    buildNetworkRequestOrResponse(headers, responseBodySize, void 0)
                                );
                            }
                        })(bodyText, { networkCaptureBodies, responseBodySize, captureDetails, headers });
                    return warning ? mergeWarning(result, warning) : result;
                }
                async function _parseFetchResponseBody(response) {
                    let res = (function (response) {
                        try {
                            return response.clone();
                        } catch (error) {
                            DEBUG_BUILD && debug.exception(error, "Failed to clone response body");
                        }
                    })(response);
                    if (!res) return [void 0, "BODY_PARSE_ERROR"];
                    try {
                        var response1;
                        return [
                            await ((response1 = res),
                            new Promise((resolve, reject) => {
                                let timeout = browserUtils.setTimeout(() => reject(Error("Timeout while trying to read response body")), 500);
                                _getResponseText(response1)
                                    .then(
                                        (txt) => resolve(txt),
                                        (reason) => reject(reason),
                                    )
                                    .finally(() => clearTimeout(timeout));
                            })),
                        ];
                    } catch (error) {
                        if (error instanceof Error && error.message.indexOf("Timeout") > -1)
                            return (DEBUG_BUILD && debug.warn("Parsing text body from response timed out"), [void 0, "BODY_PARSE_TIMEOUT"]);
                        return (DEBUG_BUILD && debug.exception(error, "Failed to get text body from response"), [void 0, "BODY_PARSE_ERROR"]);
                    }
                }
                function getAllHeaders(headers, allowedHeaders) {
                    let allHeaders = {};
                    return (
                        allowedHeaders.forEach((header) => {
                            headers.get(header) && (allHeaders[header] = headers.get(header));
                        }),
                        allHeaders
                    );
                }
                function getHeadersFromOptions(input, allowedHeaders) {
                    if (!input) return {};
                    let headers = input.headers;
                    return headers
                        ? headers instanceof Headers
                            ? getAllHeaders(headers, allowedHeaders)
                            : Array.isArray(headers)
                              ? {}
                              : getAllowedHeaders(headers, allowedHeaders)
                        : {};
                }
                async function _getResponseText(response) {
                    return await response.text();
                }
                async function captureXhrBreadcrumbToReplay(breadcrumb, hint, options) {
                    try {
                        let data = (function (breadcrumb, hint, options) {
                                let now = Date.now(),
                                    { startTimestamp = now, endTimestamp = now, input, xhr } = hint,
                                    { url, method, status_code: statusCode = 0, request_body_size: requestBodySize, response_body_size: responseBodySize } = breadcrumb.data;
                                if (!url) return null;
                                if (!xhr || !urlMatches(url, options.networkDetailAllowUrls) || urlMatches(url, options.networkDetailDenyUrls)) {
                                    let request = buildSkippedNetworkRequestOrResponse(requestBodySize);
                                    return { startTimestamp, endTimestamp, url, method, statusCode, request, response: buildSkippedNetworkRequestOrResponse(responseBodySize) };
                                }
                                let xhrInfo = xhr[browserUtils.SENTRY_XHR_DATA_KEY],
                                    networkRequestHeaders = xhrInfo ? getAllowedHeaders(xhrInfo.request_headers, options.networkRequestHeaders) : {},
                                    networkResponseHeaders = getAllowedHeaders(browserUtils.parseXhrResponseHeaders(xhr), options.networkResponseHeaders),
                                    [requestBody, requestWarning] = options.networkCaptureBodies ? browserUtils.getBodyString(input, debug) : [void 0],
                                    [responseBody, responseWarning] = options.networkCaptureBodies
                                        ? (function (xhr) {
                                              let errors = [];
                                              try {
                                                  return [xhr.responseText];
                                              } catch (e) {
                                                  errors.push(e);
                                              }
                                              try {
                                                  var body = xhr.response,
                                                      responseType = xhr.responseType;
                                                  try {
                                                      if ("string" == typeof body) return [body];
                                                      if (body instanceof Document) return [body.body.outerHTML];
                                                      if ("json" === responseType && body && "object" == typeof body) return [JSON.stringify(body)];
                                                      if (!body) return [void 0];
                                                  } catch (error) {
                                                      return (DEBUG_BUILD && debug.exception(error, "Failed to serialize body", body), [void 0, "BODY_PARSE_ERROR"]);
                                                  }
                                                  return (DEBUG_BUILD && debug.log("Skipping network body because of body type", body), [void 0, "UNPARSEABLE_BODY_TYPE"]);
                                              } catch (e) {
                                                  errors.push(e);
                                              }
                                              return (DEBUG_BUILD && debug.warn("Failed to get xhr response body", ...errors), [void 0]);
                                          })(xhr)
                                        : [void 0],
                                    request = buildNetworkRequestOrResponse(networkRequestHeaders, requestBodySize, requestBody),
                                    response = buildNetworkRequestOrResponse(networkResponseHeaders, responseBodySize, responseBody);
                                return {
                                    startTimestamp,
                                    endTimestamp,
                                    url,
                                    method,
                                    statusCode,
                                    request: requestWarning ? mergeWarning(request, requestWarning) : request,
                                    response: responseWarning ? mergeWarning(response, responseWarning) : response,
                                };
                            })(breadcrumb, hint, options),
                            result = makeNetworkReplayBreadcrumb("resource.xhr", data);
                        addNetworkBreadcrumb(options.replay, result);
                    } catch (error) {
                        DEBUG_BUILD && debug.exception(error, "Failed to capture xhr breadcrumb");
                    }
                }
                async function addMemoryEntry(replay) {
                    try {
                        return Promise.all(
                            createPerformanceSpans(replay, [
                                (function (memoryEntry) {
                                    let { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = memoryEntry,
                                        time = Date.now() / 1e3;
                                    return { type: "memory", name: "memory", start: time, end: time, data: { memory: { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } } };
                                })(WINDOW.performance.memory),
                            ]),
                        );
                    } catch {
                        return [];
                    }
                }
                let NAVIGATOR = core.GLOBAL_OBJ.navigator;
                async function prepareReplayEvent({ client, scope, replayId: event_id, event }) {
                    let eventHint = {
                        event_id,
                        integrations:
                            "object" != typeof client._integrations || null === client._integrations || Array.isArray(client._integrations)
                                ? void 0
                                : Object.keys(client._integrations),
                    };
                    client.emit("preprocessEvent", event, eventHint);
                    let preparedEvent = await core.prepareEvent(client.getOptions(), event, eventHint, scope, client, core.getIsolationScope());
                    if (!preparedEvent) return null;
                    (client.emit("postprocessEvent", preparedEvent, eventHint), (preparedEvent.platform = preparedEvent.platform || "javascript"));
                    let metadata = client.getSdkMetadata(),
                        { name, version, settings } = metadata?.sdk || {};
                    return ((preparedEvent.sdk = { ...preparedEvent.sdk, name: name || "sentry.javascript.unknown", version: version || "0.0.0", settings }), preparedEvent);
                }
                async function sendReplayRequest({ recordingData, replayId, segmentId: segment_id, eventContext, timestamp, session }) {
                    var tunnel;
                    let response,
                        preparedRecordingData = (function ({ recordingData, headers }) {
                            let payloadWithSequence,
                                replayHeaders = `${JSON.stringify(headers)}
`;
                            if ("string" == typeof recordingData) payloadWithSequence = `${replayHeaders}${recordingData}`;
                            else {
                                let sequence = new TextEncoder().encode(replayHeaders);
                                ((payloadWithSequence = new Uint8Array(sequence.length + recordingData.length)).set(sequence),
                                    payloadWithSequence.set(recordingData, sequence.length));
                            }
                            return payloadWithSequence;
                        })({ recordingData, headers: { segment_id } }),
                        { urls, errorIds, traceIds, initialTimestamp } = eventContext,
                        client = core.getClient(),
                        scope = core.getCurrentScope(),
                        transport = client?.getTransport(),
                        dsn = client?.getDsn();
                    if (!client || !transport || !dsn || !session.sampled) return Promise.resolve({});
                    let baseEvent = {
                            type: "replay_event",
                            replay_start_timestamp: initialTimestamp / 1e3,
                            timestamp: timestamp / 1e3,
                            error_ids: errorIds,
                            trace_ids: traceIds,
                            urls,
                            replay_id: replayId,
                            segment_id,
                            replay_type: session.sampled,
                        },
                        replayEvent = await prepareReplayEvent({ scope, client, replayId, event: baseEvent });
                    if (!replayEvent)
                        return (
                            client.recordDroppedEvent("event_processor", "replay"),
                            DEBUG_BUILD && debug.log("An event processor returned `null`, will not send event."),
                            Promise.resolve({})
                        );
                    delete replayEvent.sdkProcessingMetadata;
                    let envelope =
                        ((tunnel = client.getOptions().tunnel),
                        core.createEnvelope(core.createEventEnvelopeHeaders(replayEvent, core.getSdkMetadataForEnvelopeHeader(replayEvent), tunnel, dsn), [
                            [{ type: "replay_event" }, replayEvent],
                            [
                                {
                                    type: "replay_recording",
                                    length: "string" == typeof preparedRecordingData ? new TextEncoder().encode(preparedRecordingData).length : preparedRecordingData.length,
                                },
                                preparedRecordingData,
                            ],
                        ]));
                    try {
                        response = await transport.send(envelope);
                    } catch (err) {
                        let error = Error(UNABLE_TO_SEND_REPLAY);
                        try {
                            error.cause = err;
                        } catch {}
                        throw error;
                    }
                    let rateLimits = core.updateRateLimits({}, response);
                    if (core.isRateLimited(rateLimits, "replay")) throw new RateLimitError(rateLimits);
                    if ("number" == typeof response.statusCode && (response.statusCode < 200 || response.statusCode >= 300))
                        throw new TransportStatusCodeError(response.statusCode);
                    return response;
                }
                class TransportStatusCodeError extends Error {
                    constructor(statusCode) {
                        super(`Transport returned status code ${statusCode}`);
                    }
                }
                class RateLimitError extends Error {
                    constructor(rateLimits) {
                        (super("Rate limit hit"), (this.rateLimits = rateLimits));
                    }
                }
                class ReplayDurationLimitError extends Error {
                    constructor() {
                        super("Session is too long, not sending replay");
                    }
                }
                async function sendReplay(replayData, retryConfig = { count: 0, interval: 5e3 }) {
                    let { recordingData, onError } = replayData;
                    if (recordingData.length)
                        try {
                            return (await sendReplayRequest(replayData), !0);
                        } catch (err) {
                            if (err instanceof TransportStatusCodeError || err instanceof RateLimitError) throw err;
                            if ((core.setContext("Replays", { _retryCount: retryConfig.count }), onError && onError(err), retryConfig.count >= 3)) {
                                let error = Error(`${UNABLE_TO_SEND_REPLAY} - max retries exceeded`);
                                try {
                                    error.cause = err;
                                } catch {}
                                throw error;
                            }
                            return (
                                (retryConfig.interval *= ++retryConfig.count),
                                new Promise((resolve, reject) => {
                                    browserUtils.setTimeout(async () => {
                                        try {
                                            (await sendReplay(replayData, retryConfig), resolve(!0));
                                        } catch (err) {
                                            reject(err);
                                        }
                                    }, retryConfig.interval);
                                })
                            );
                        }
                }
                let THROTTLED = "__THROTTLED";
                class ReplayContainer {
                    constructor({ options, recordingOptions }) {
                        ((this.eventBuffer = null),
                            (this.performanceEntries = []),
                            (this.replayPerformanceEntries = []),
                            (this.recordingMode = "session"),
                            (this.timeouts = { sessionIdlePause: 3e5, sessionIdleExpire: 9e5 }),
                            (this._lastActivity = Date.now()),
                            (this._isEnabled = !1),
                            (this._isPaused = !1),
                            (this._requiresManualStart = !1),
                            (this._hasInitializedCoreListeners = !1),
                            (this._context = { errorIds: new Set(), traceIds: new Set(), urls: [], initialTimestamp: Date.now(), initialUrl: "" }),
                            (this._recordingOptions = recordingOptions),
                            (this._options = options),
                            (this._debouncedFlush = (function (func, wait, options) {
                                return core.debounce(func, wait, { ...options, setTimeoutImpl: browserUtils.setTimeout });
                            })(() => this._flush(), this._options.flushMinDelay, { maxWait: this._options.flushMaxDelay })),
                            (this._throttledAddEvent = (function (fn) {
                                let counter = new Map(),
                                    isThrottled = !1;
                                return (...rest) => {
                                    let threshold,
                                        now = Math.floor(Date.now() / 1e3);
                                    if (
                                        ((threshold = now - 5),
                                        counter.forEach((_value, key) => {
                                            key < threshold && counter.delete(key);
                                        }),
                                        [...counter.values()].reduce((a, b) => a + b, 0) >= 300)
                                    ) {
                                        let wasThrottled = isThrottled;
                                        return ((isThrottled = !0), wasThrottled ? "__SKIPPED" : THROTTLED);
                                    }
                                    isThrottled = !1;
                                    let count = counter.get(now) || 0;
                                    return (counter.set(now, count + 1), fn(...rest));
                                };
                            })((event, isCheckout) => (shouldAddEvent(this, event) ? _addEvent(this, event, isCheckout) : Promise.resolve(null)))));
                        const { slowClickTimeout, slowClickIgnoreSelectors } = this.getOptions(),
                            slowClickConfig = slowClickTimeout
                                ? {
                                      threshold: Math.min(3e3, slowClickTimeout),
                                      timeout: slowClickTimeout,
                                      scrollTimeout: 300,
                                      ignoreSelector: slowClickIgnoreSelectors ? slowClickIgnoreSelectors.join(",") : "",
                                  }
                                : void 0;
                        if ((slowClickConfig && (this.clickDetector = new ClickDetector(this, slowClickConfig)), DEBUG_BUILD)) {
                            const experiments = options._experiments;
                            debug.setConfig({ captureExceptions: !!experiments.captureExceptions, traceInternals: !!experiments.traceInternals });
                        }
                        ((this._handleVisibilityChange = () => {
                            "visible" === WINDOW.document.visibilityState ? this._doChangeToForegroundTasks() : this._doChangeToBackgroundTasks();
                        }),
                            (this._handleWindowBlur = () => {
                                let breadcrumb = createBreadcrumb({ category: "ui.blur" });
                                this._doChangeToBackgroundTasks(breadcrumb);
                            }),
                            (this._handleWindowFocus = () => {
                                let breadcrumb = createBreadcrumb({ category: "ui.focus" });
                                this._doChangeToForegroundTasks(breadcrumb);
                            }),
                            (this._handleKeyboardEvent = (event) => {
                                !(function (replay, event) {
                                    if (!replay.isEnabled()) return;
                                    replay.updateUserActivity();
                                    let breadcrumb = (function (event) {
                                        var target;
                                        let { metaKey, shiftKey, ctrlKey, altKey, key, target: target1 } = event;
                                        if (!target1 || "INPUT" === (target = target1).tagName || "TEXTAREA" === target.tagName || target.isContentEditable || !key) return null;
                                        let hasModifierKey = metaKey || ctrlKey || altKey,
                                            isCharacterKey = 1 === key.length;
                                        if (!hasModifierKey && isCharacterKey) return null;
                                        let message = core.htmlTreeAsString(target1, { maxStringLength: 200 }) || "<unknown>",
                                            baseBreadcrumb = getBaseDomBreadcrumb(target1, message);
                                        return createBreadcrumb({ category: "ui.keyDown", message, data: { ...baseBreadcrumb.data, metaKey, shiftKey, ctrlKey, altKey, key } });
                                    })(event);
                                    breadcrumb && addBreadcrumbEvent(replay, breadcrumb);
                                })(this, event);
                            }));
                    }
                    getContext() {
                        return this._context;
                    }
                    isEnabled() {
                        return this._isEnabled;
                    }
                    isPaused() {
                        return this._isPaused;
                    }
                    isRecordingCanvas() {
                        return !!this._canvas;
                    }
                    getOptions() {
                        return this._options;
                    }
                    handleException(error) {
                        (DEBUG_BUILD && debug.exception(error), this._options.onError && this._options.onError(error));
                    }
                    initializeSampling(previousSessionId) {
                        let { errorSampleRate, sessionSampleRate } = this._options,
                            requiresManualStart = errorSampleRate <= 0 && sessionSampleRate <= 0;
                        if (((this._requiresManualStart = requiresManualStart), !requiresManualStart)) {
                            if ((this._initializeSessionForSampling(previousSessionId), !this.session)) {
                                DEBUG_BUILD && debug.exception(Error("Unable to initialize and create session"));
                                return;
                            }
                            !1 !== this.session.sampled &&
                                ((this.recordingMode = "buffer" === this.session.sampled && 0 === this.session.segmentId ? "buffer" : "session"),
                                DEBUG_BUILD && debug.infoTick(`Starting replay in ${this.recordingMode} mode`),
                                this._initializeRecording());
                        }
                    }
                    start() {
                        if (this._isEnabled && "session" === this.recordingMode) {
                            DEBUG_BUILD && debug.log("Recording is already in progress");
                            return;
                        }
                        if (this._isEnabled && "buffer" === this.recordingMode) {
                            DEBUG_BUILD && debug.log("Buffering is in progress, call `flush()` to save the replay");
                            return;
                        }
                        (DEBUG_BUILD && debug.infoTick("Starting replay in session mode"), this._updateUserActivity());
                        let session = loadOrCreateSession(
                            { maxReplayDuration: this._options.maxReplayDuration, sessionIdleExpire: this.timeouts.sessionIdleExpire },
                            { stickySession: this._options.stickySession, sessionSampleRate: 1, allowBuffering: !1 },
                        );
                        ((this.session = session), (this.recordingMode = "session"), this._initializeRecording());
                    }
                    startBuffering() {
                        if (this._isEnabled) {
                            DEBUG_BUILD && debug.log("Buffering is in progress, call `flush()` to save the replay");
                            return;
                        }
                        DEBUG_BUILD && debug.infoTick("Starting replay in buffer mode");
                        let session = loadOrCreateSession(
                            { sessionIdleExpire: this.timeouts.sessionIdleExpire, maxReplayDuration: this._options.maxReplayDuration },
                            { stickySession: this._options.stickySession, sessionSampleRate: 0, allowBuffering: !0 },
                        );
                        ((this.session = session), (this.recordingMode = "buffer"), this._initializeRecording());
                    }
                    startRecording() {
                        try {
                            var replay;
                            let hadFirstEvent,
                                canvasOptions = this._canvas;
                            this._stopRecording = record({
                                ...this._recordingOptions,
                                ...("buffer" === this.recordingMode
                                    ? { checkoutEveryNms: 6e4 }
                                    : this._options._experiments.continuousCheckout && { checkoutEveryNms: Math.max(36e4, this._options._experiments.continuousCheckout) }),
                                emit:
                                    ((replay = this),
                                    (hadFirstEvent = !1),
                                    (event, _isCheckout) => {
                                        if (!replay.checkAndHandleExpiredSession()) {
                                            DEBUG_BUILD && debug.warn("Received replay event after session expired.");
                                            return;
                                        }
                                        let isCheckout = _isCheckout || !hadFirstEvent;
                                        ((hadFirstEvent = !0),
                                            (function (event) {
                                                let data = event.data;
                                                if (
                                                    event.type === EventType.IncrementalSnapshot &&
                                                    data &&
                                                    "object" == typeof data &&
                                                    "source" in data &&
                                                    data.source === IncrementalSource.Mutation &&
                                                    "attributes" in data &&
                                                    Array.isArray(data.attributes)
                                                )
                                                    for (let mutation of data.attributes) {
                                                        let node = record.mirror.getNode(mutation.id),
                                                            meta = node && record.mirror.getMeta(node);
                                                        if (meta?.type === NodeType.Element)
                                                            for (let [attributeName, value] of Object.entries(mutation.attributes))
                                                                null === value ? delete meta.attributes[attributeName] : (meta.attributes[attributeName] = value);
                                                    }
                                            })(event),
                                            replay.clickDetector &&
                                                (function (clickDetector, event) {
                                                    try {
                                                        var event1;
                                                        if (((event1 = event), 3 !== event1.type)) return;
                                                        let { source } = event.data;
                                                        if (
                                                            (IncrementalMutationSources.has(source) && clickDetector.registerMutation(event.timestamp),
                                                            source === IncrementalSource.Scroll && clickDetector.registerScroll(event.timestamp),
                                                            event.data.source === IncrementalSource.MouseInteraction)
                                                        ) {
                                                            let { type, id } = event.data,
                                                                node = record.mirror.getNode(id);
                                                            node instanceof HTMLElement && type === MouseInteractions.Click && clickDetector.registerClick(node);
                                                        }
                                                    } catch {}
                                                })(replay.clickDetector, event),
                                            replay.addUpdate(() => {
                                                if (("buffer" === replay.recordingMode && isCheckout && replay.setInitialState(), !addEventSync(replay, event, isCheckout)))
                                                    return !0;
                                                if (!isCheckout) return !1;
                                                let session = replay.session;
                                                if (
                                                    ((function (replay, isCheckout) {
                                                        if (isCheckout && replay.session?.segmentId === 0) {
                                                            let options;
                                                            addEventSync(
                                                                replay,
                                                                ((options = replay.getOptions()),
                                                                {
                                                                    type: EventType.Custom,
                                                                    timestamp: Date.now(),
                                                                    data: {
                                                                        tag: "options",
                                                                        payload: {
                                                                            shouldRecordCanvas: replay.isRecordingCanvas(),
                                                                            sessionSampleRate: options.sessionSampleRate,
                                                                            errorSampleRate: options.errorSampleRate,
                                                                            useCompressionOption: options.useCompression,
                                                                            blockAllMedia: options.blockAllMedia,
                                                                            maskAllText: options.maskAllText,
                                                                            maskAllInputs: options.maskAllInputs,
                                                                            useCompression: !!replay.eventBuffer && "worker" === replay.eventBuffer.type,
                                                                            networkDetailHasUrls: options.networkDetailAllowUrls.length > 0,
                                                                            networkCaptureBodies: options.networkCaptureBodies,
                                                                            networkRequestHasHeaders: options.networkRequestHeaders.length > 0,
                                                                            networkResponseHasHeaders: options.networkResponseHeaders.length > 0,
                                                                        },
                                                                    },
                                                                }),
                                                                !1,
                                                            );
                                                        }
                                                    })(replay, isCheckout),
                                                    "buffer" === replay.recordingMode && session && replay.eventBuffer && !session.dirty)
                                                ) {
                                                    let earliestEvent = replay.eventBuffer.getEarliestTimestamp();
                                                    earliestEvent &&
                                                        (DEBUG_BUILD && debug.log(`Updating session start time to earliest event in buffer to ${new Date(earliestEvent)}`),
                                                        (session.started = earliestEvent),
                                                        replay.getOptions().stickySession && saveSession(session));
                                                }
                                                return !!session?.previousSessionId || ("session" === replay.recordingMode && replay.flush(), !0);
                                            }));
                                    }),
                                ...(/iPhone|iPad|iPod/i.test(NAVIGATOR?.userAgent ?? "") ||
                                (/Macintosh/i.test(NAVIGATOR?.userAgent ?? "") && NAVIGATOR?.maxTouchPoints && NAVIGATOR?.maxTouchPoints > 1)
                                    ? { sampling: { mousemove: !1 } }
                                    : {}),
                                onMutation: this._onMutationHandler.bind(this),
                                ...(canvasOptions
                                    ? {
                                          recordCanvas: canvasOptions.recordCanvas,
                                          getCanvasManager: canvasOptions.getCanvasManager,
                                          sampling: canvasOptions.sampling,
                                          dataURLOptions: canvasOptions.dataURLOptions,
                                      }
                                    : {}),
                            });
                        } catch (err) {
                            this.handleException(err);
                        }
                    }
                    stopRecording() {
                        try {
                            return (this._stopRecording && (this._stopRecording(), (this._stopRecording = void 0)), !0);
                        } catch (err) {
                            return (this.handleException(err), !1);
                        }
                    }
                    async stop({ forceFlush = !1, reason } = {}) {
                        if (!this._isEnabled) return;
                        ((this._isEnabled = !1), (this.recordingMode = "buffer"));
                        let stopReason = reason ?? "manual";
                        core.getClient()?.emit("replayEnd", { sessionId: this.session?.id, reason: stopReason });
                        try {
                            (DEBUG_BUILD && debug.log(`Stopping Replay triggered by ${stopReason}`),
                                resetReplayIdOnDynamicSamplingContext(),
                                this._removeListeners(),
                                this.stopRecording(),
                                this._debouncedFlush.cancel(),
                                forceFlush && (await this._flush({ force: !0 })),
                                this.eventBuffer?.destroy(),
                                (this.eventBuffer = null),
                                (function () {
                                    if (hasSessionStorage())
                                        try {
                                            WINDOW.sessionStorage.removeItem(REPLAY_SESSION_KEY);
                                        } catch {}
                                })(),
                                (this.session = void 0));
                        } catch (err) {
                            this.handleException(err);
                        }
                    }
                    pause() {
                        !this._isPaused && ((this._isPaused = !0), this.stopRecording(), DEBUG_BUILD && debug.log("Pausing replay"));
                    }
                    resume() {
                        this._isPaused && this._checkSession() && ((this._isPaused = !1), this.startRecording(), DEBUG_BUILD && debug.log("Resuming replay"));
                    }
                    async sendBufferedReplayOrFlush({ continueRecording = !0 } = {}) {
                        if ("session" === this.recordingMode) return this.flushImmediate();
                        let activityTime = Date.now();
                        (DEBUG_BUILD && debug.log("Converting buffer to session"), await this.flushImmediate());
                        let hasStoppedRecording = this.stopRecording();
                        continueRecording &&
                            hasStoppedRecording &&
                            "session" !== this.recordingMode &&
                            ((this.recordingMode = "session"),
                            this.session &&
                                ((this.session.dirty = !1), this._updateUserActivity(activityTime), this._updateSessionActivity(activityTime), this._maybeSaveSession()),
                            this.startRecording());
                    }
                    addUpdate(cb) {
                        let cbResult = cb();
                        "buffer" !== this.recordingMode && this._isEnabled && !0 !== cbResult && this._debouncedFlush();
                    }
                    triggerUserActivity() {
                        if ((this._updateUserActivity(), !this._stopRecording)) {
                            if (!this._checkSession()) return;
                            this.resume();
                            return;
                        }
                        (this.checkAndHandleExpiredSession(), this._updateSessionActivity());
                    }
                    updateUserActivity() {
                        (this._updateUserActivity(), this._updateSessionActivity());
                    }
                    conditionalFlush() {
                        return "buffer" === this.recordingMode ? Promise.resolve() : this.flushImmediate();
                    }
                    flush() {
                        return this._debouncedFlush();
                    }
                    flushImmediate() {
                        return (this._debouncedFlush(), this._debouncedFlush.flush());
                    }
                    cancelFlush() {
                        this._debouncedFlush.cancel();
                    }
                    getSessionId(onlyIfSampled) {
                        if (!onlyIfSampled || this.session?.sampled !== !1) return this.session?.id;
                    }
                    checkAndHandleExpiredSession() {
                        return this._lastActivity && isExpired(this._lastActivity, this.timeouts.sessionIdlePause) && this.session?.sampled === "session"
                            ? void this.pause()
                            : !!this._checkSession();
                    }
                    setInitialState() {
                        let urlPath = `${WINDOW.location.pathname}${WINDOW.location.hash}${WINDOW.location.search}`,
                            url = `${WINDOW.location.origin}${urlPath}`;
                        ((this.performanceEntries = []),
                            (this.replayPerformanceEntries = []),
                            this._clearContext(),
                            (this._context.initialUrl = url),
                            (this._context.initialTimestamp = Date.now()),
                            this._context.urls.push(url));
                    }
                    throttledAddEvent(event, isCheckout) {
                        let res = this._throttledAddEvent(event, isCheckout);
                        if (res === THROTTLED) {
                            let breadcrumb = createBreadcrumb({ category: "replay.throttled" });
                            this.addUpdate(
                                () => !addEventSync(this, { type: 5, timestamp: breadcrumb.timestamp || 0, data: { tag: "breadcrumb", payload: breadcrumb, metric: !0 } }),
                            );
                        }
                        return res;
                    }
                    getCurrentRoute() {
                        let lastActiveSpan = this.lastActiveSpan || core.getActiveSpan(),
                            lastRootSpan = lastActiveSpan && core.getRootSpan(lastActiveSpan),
                            source = ((lastRootSpan && core.spanToJSON(lastRootSpan).data) || {})[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
                        if (lastRootSpan && source && ["route", "custom"].includes(source)) return core.spanToJSON(lastRootSpan).description;
                    }
                    _initializeRecording() {
                        (this.setInitialState(),
                            this._updateSessionActivity(),
                            (this.eventBuffer = (function ({ useCompression, workerUrl: customWorkerUrl }) {
                                if (useCompression && window.Worker) {
                                    let worker = (function (customWorkerUrl) {
                                        try {
                                            let workerUrl =
                                                customWorkerUrl ||
                                                (function () {
                                                    if ("u" < typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ || !__SENTRY_EXCLUDE_REPLAY_WORKER__) {
                                                        let e;
                                                        return (
                                                            (e = new Blob([
                                                                'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort(function(t,n){return t.f-n.f}),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort(function(t,n){return p[n.s]-p[t.s]||t.f-n.f});s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,s=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),a=s.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(s,n),O(s,a-8,r.d()),O(s,a-4,e),s}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){j.prototype.flush.call(this)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(G)return G.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J((t,n)=>{this.deflate.push(t,n)}),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}}),postMessage({id:void 0,method:"init",success:!0,response:void 0});',
                                                            ])),
                                                            URL.createObjectURL(e)
                                                        );
                                                    }
                                                    return "";
                                                })();
                                            if (!workerUrl) return;
                                            DEBUG_BUILD && debug.log(`Using compression worker${customWorkerUrl ? ` from ${customWorkerUrl}` : ""}`);
                                            let worker = new Worker(workerUrl);
                                            return new EventBufferProxy(worker);
                                        } catch (error) {
                                            DEBUG_BUILD && debug.exception(error, "Failed to create compression worker");
                                        }
                                    })(customWorkerUrl);
                                    if (worker) return worker;
                                }
                                return (DEBUG_BUILD && debug.log("Using simple buffer"), new EventBufferArray());
                            })({ useCompression: this._options.useCompression, workerUrl: this._options.workerUrl })),
                            this._removeListeners(),
                            this._addListeners(),
                            (this._isEnabled = !0),
                            (this._isPaused = !1),
                            this.session && core.getClient()?.emit("replayStart", { sessionId: this.session.id, recordingMode: this.recordingMode }),
                            this.startRecording());
                    }
                    _initializeSessionForSampling(previousSessionId) {
                        let allowBuffering = this._options.errorSampleRate > 0,
                            session = loadOrCreateSession(
                                { sessionIdleExpire: this.timeouts.sessionIdleExpire, maxReplayDuration: this._options.maxReplayDuration, previousSessionId },
                                { stickySession: this._options.stickySession, sessionSampleRate: this._options.sessionSampleRate, allowBuffering },
                            );
                        this.session = session;
                    }
                    _checkSession() {
                        if (!this.session) return !1;
                        let currentSession = this.session;
                        return (
                            !shouldRefreshSession(currentSession, { sessionIdleExpire: this.timeouts.sessionIdleExpire, maxReplayDuration: this._options.maxReplayDuration }) ||
                            (this._refreshSession(currentSession), !1)
                        );
                    }
                    async _refreshSession(session) {
                        this._isEnabled && (await this.stop({ reason: "sessionExpired" }), this.initializeSampling(session.id));
                    }
                    _addListeners() {
                        try {
                            (WINDOW.document.addEventListener("visibilitychange", this._handleVisibilityChange),
                                WINDOW.addEventListener("blur", this._handleWindowBlur),
                                WINDOW.addEventListener("focus", this._handleWindowFocus),
                                WINDOW.addEventListener("keydown", this._handleKeyboardEvent),
                                this.clickDetector && this.clickDetector.addListeners(),
                                this._hasInitializedCoreListeners ||
                                    (!(function (replay) {
                                        let client,
                                            client1 = core.getClient();
                                        (browserUtils.addClickKeypressInstrumentationHandler((handlerData) => {
                                            var clickDetector, node;
                                            if (!replay.isEnabled()) return;
                                            let result = (function (handlerData) {
                                                let { target, message } = (function (handlerData) {
                                                    let message,
                                                        isClick = "click" === handlerData.name,
                                                        target = null;
                                                    try {
                                                        ((target = isClick ? getClickTargetNode(handlerData.event) : getTargetNode(handlerData.event)),
                                                            (message = core.htmlTreeAsString(target, { maxStringLength: 200 }) || "<unknown>"));
                                                    } catch {
                                                        message = "<unknown>";
                                                    }
                                                    return { target, message };
                                                })(handlerData);
                                                return createBreadcrumb({ category: `ui.${handlerData.name}`, ...getBaseDomBreadcrumb(target, message) });
                                            })(handlerData);
                                            if (!result) return;
                                            let isClick = "click" === handlerData.name,
                                                event = isClick ? handlerData.event : void 0;
                                            (isClick &&
                                                replay.clickDetector &&
                                                event?.target &&
                                                !event.altKey &&
                                                !event.metaKey &&
                                                !event.ctrlKey &&
                                                !event.shiftKey &&
                                                ((clickDetector = replay.clickDetector), (node = getClickTargetNode(handlerData.event)), clickDetector.handleClick(result, node)),
                                                addBreadcrumbEvent(replay, result));
                                        }),
                                            browserUtils.addHistoryInstrumentationHandler((handlerData) => {
                                                if (!replay.isEnabled()) return;
                                                let result = (function (handlerData) {
                                                    let { from, to } = handlerData,
                                                        now = Date.now() / 1e3;
                                                    return { type: "navigation.push", start: now, end: now, name: to, data: { previous: from } };
                                                })(handlerData);
                                                null !== result &&
                                                    (replay.getContext().urls.push(result.name),
                                                    replay.triggerUserActivity(),
                                                    replay.addUpdate(() => (createPerformanceSpans(replay, [result]), !1)));
                                            }),
                                            (client = core.getClient()) &&
                                                client.on("beforeAddBreadcrumb", (breadcrumb) =>
                                                    (function (replay, breadcrumb) {
                                                        var breadcrumb1;
                                                        if (!replay.isEnabled() || !isBreadcrumbWithCategory(breadcrumb)) return;
                                                        let result =
                                                            ((breadcrumb1 = breadcrumb),
                                                            !isBreadcrumbWithCategory(breadcrumb1) ||
                                                            ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(breadcrumb1.category) ||
                                                            breadcrumb1.category.startsWith("ui.")
                                                                ? null
                                                                : "console" === breadcrumb1.category
                                                                  ? (function (breadcrumb) {
                                                                        let args = breadcrumb.data?.arguments;
                                                                        if (!Array.isArray(args) || 0 === args.length) return createBreadcrumb(breadcrumb);
                                                                        let isTruncated = !1,
                                                                            normalizedArgs = args.map((arg) => {
                                                                                if (!arg) return arg;
                                                                                if ("string" == typeof arg)
                                                                                    return arg.length > 5e3 ? ((isTruncated = !0), `${arg.slice(0, 5e3)}\u{2026}`) : arg;
                                                                                if ("object" == typeof arg)
                                                                                    try {
                                                                                        let normalizedArg = core.normalize(arg, 7);
                                                                                        if (JSON.stringify(normalizedArg).length > 5e3)
                                                                                            return (
                                                                                                (isTruncated = !0),
                                                                                                `${JSON.stringify(normalizedArg, null, 2).slice(0, 5e3)}\u{2026}`
                                                                                            );
                                                                                        return normalizedArg;
                                                                                    } catch {}
                                                                                return arg;
                                                                            });
                                                                        return createBreadcrumb({
                                                                            ...breadcrumb,
                                                                            data: {
                                                                                ...breadcrumb.data,
                                                                                arguments: normalizedArgs,
                                                                                ...(isTruncated ? { _meta: { warnings: ["CONSOLE_ARG_TRUNCATED"] } } : {}),
                                                                            },
                                                                        });
                                                                    })(breadcrumb1)
                                                                  : createBreadcrumb(breadcrumb1));
                                                        result && addBreadcrumbEvent(replay, result);
                                                    })(replay, breadcrumb),
                                                ));
                                        let client2 = core.getClient();
                                        try {
                                            let { networkDetailAllowUrls, networkDetailDenyUrls, networkCaptureBodies, networkRequestHeaders, networkResponseHeaders } =
                                                    replay.getOptions(),
                                                options = {
                                                    replay: replay,
                                                    networkDetailAllowUrls,
                                                    networkDetailDenyUrls,
                                                    networkCaptureBodies,
                                                    networkRequestHeaders,
                                                    networkResponseHeaders,
                                                };
                                            client2 &&
                                                client2.on("beforeAddBreadcrumb", (breadcrumb, hint) =>
                                                    (function (options, breadcrumb, hint) {
                                                        if (breadcrumb.data)
                                                            try {
                                                                var breadcrumb1, hint1, breadcrumb2, hint2;
                                                                ((breadcrumb1 = breadcrumb),
                                                                    "xhr" === breadcrumb1.category &&
                                                                        ((hint1 = hint), hint1?.xhr) &&
                                                                        (!(function (breadcrumb, hint) {
                                                                            let { xhr, input } = hint;
                                                                            if (!xhr) return;
                                                                            let reqSize = getBodySize(input),
                                                                                resSize = xhr.getResponseHeader("content-length")
                                                                                    ? parseContentLengthHeader(xhr.getResponseHeader("content-length"))
                                                                                    : (function (body, responseType) {
                                                                                          try {
                                                                                              let bodyStr =
                                                                                                  "json" === responseType && body && "object" == typeof body
                                                                                                      ? JSON.stringify(body)
                                                                                                      : body;
                                                                                              return getBodySize(bodyStr);
                                                                                          } catch {
                                                                                              return;
                                                                                          }
                                                                                      })(xhr.response, xhr.responseType);
                                                                            (void 0 !== reqSize && (breadcrumb.data.request_body_size = reqSize),
                                                                                void 0 !== resSize && (breadcrumb.data.response_body_size = resSize));
                                                                        })(breadcrumb, hint),
                                                                        captureXhrBreadcrumbToReplay(breadcrumb, hint, options)),
                                                                    (breadcrumb2 = breadcrumb),
                                                                    "fetch" === breadcrumb2.category &&
                                                                        ((hint2 = hint), hint2?.response) &&
                                                                        (!(function (breadcrumb, hint) {
                                                                            let { input, response } = hint,
                                                                                reqSize = getBodySize(input ? browserUtils.getFetchRequestArgBody(input) : void 0),
                                                                                resSize = response ? parseContentLengthHeader(response.headers.get("content-length")) : void 0;
                                                                            (void 0 !== reqSize && (breadcrumb.data.request_body_size = reqSize),
                                                                                void 0 !== resSize && (breadcrumb.data.response_body_size = resSize));
                                                                        })(breadcrumb, hint),
                                                                        captureFetchBreadcrumbToReplay(breadcrumb, hint, options)));
                                                            } catch (e) {
                                                                DEBUG_BUILD && debug.exception(e, "Error when enriching network breadcrumb");
                                                            }
                                                    })(options, breadcrumb, hint),
                                                );
                                        } catch {}
                                        let eventProcessor = Object.assign(
                                            (event, hint) => {
                                                if (!replay.isEnabled() || replay.isPaused()) return event;
                                                if ("replay_event" === event.type) return (delete event.breadcrumbs, event);
                                                if (event.type && !isTransactionEvent(event) && !isFeedbackEvent(event)) return event;
                                                if (!replay.checkAndHandleExpiredSession()) return (resetReplayIdOnDynamicSamplingContext(), event);
                                                if (isFeedbackEvent(event))
                                                    return (
                                                        replay.flush(),
                                                        (event.contexts.feedback.replay_id = replay.getSessionId()),
                                                        replay.triggerUserActivity(),
                                                        replay.addUpdate(
                                                            () =>
                                                                !event.timestamp ||
                                                                (replay.throttledAddEvent({
                                                                    type: EventType.Custom,
                                                                    timestamp: 1e3 * event.timestamp,
                                                                    data: {
                                                                        tag: "breadcrumb",
                                                                        payload: {
                                                                            timestamp: event.timestamp,
                                                                            type: "default",
                                                                            category: "sentry.feedback",
                                                                            data: { feedbackId: event.event_id },
                                                                        },
                                                                    },
                                                                }),
                                                                !1),
                                                        ),
                                                        event
                                                    );
                                                if (
                                                    !event.type &&
                                                    event.exception?.values?.length &&
                                                    hint.originalException?.__rrweb__ &&
                                                    !replay.getOptions()._experiments.captureExceptions
                                                )
                                                    return (DEBUG_BUILD && debug.log("Ignoring error from rrweb internals", event), null);
                                                let isErrorEventSampled =
                                                    "buffer" === replay.recordingMode &&
                                                    event.message !== UNABLE_TO_SEND_REPLAY &&
                                                    !!event.exception &&
                                                    !event.type &&
                                                    isSampled(replay.getOptions().errorSampleRate);
                                                if (
                                                    ((isErrorEventSampled || "session" === replay.recordingMode) &&
                                                        (event.tags = { ...event.tags, replayId: replay.getSessionId() }),
                                                    isErrorEventSampled && "buffer" === replay.recordingMode && replay.session?.sampled === "buffer")
                                                ) {
                                                    let session = replay.session;
                                                    ((session.dirty = !0), replay.getOptions().stickySession && saveSession(session));
                                                }
                                                return event;
                                            },
                                            { id: "Replay" },
                                        );
                                        (core.addEventProcessor(eventProcessor),
                                            client1 &&
                                                (client1.on("beforeSendEvent", (event) => {
                                                    var replay1, event1;
                                                    let exceptionValue;
                                                    replay.isEnabled() &&
                                                        !event.type &&
                                                        ((replay1 = replay),
                                                        (event1 = event),
                                                        (exceptionValue = event1.exception?.values?.[0]?.value),
                                                        "string" == typeof exceptionValue &&
                                                            (exceptionValue.match(
                                                                /(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/,
                                                            ) ||
                                                                exceptionValue.match(/(does not match server-rendered HTML|Hydration failed because)/i)) &&
                                                            addBreadcrumbEvent(
                                                                replay1,
                                                                createBreadcrumb({ category: "replay.hydrate-error", data: { url: core.getLocationHref() } }),
                                                            ));
                                                }),
                                                client1.on("afterSendEvent", (event, sendResponse) => {
                                                    if (!replay.isEnabled() || (event.type && !isTransactionEvent(event))) return;
                                                    let statusCode = sendResponse.statusCode;
                                                    if (statusCode && !(statusCode < 200) && !(statusCode >= 300)) {
                                                        if (isTransactionEvent(event)) {
                                                            var replay1, event1;
                                                            let replayContext;
                                                            return void ((replay1 = replay),
                                                            (event1 = event),
                                                            (replayContext = replay1.getContext()),
                                                            event1.contexts?.trace?.trace_id &&
                                                                replayContext.traceIds.size < 100 &&
                                                                replayContext.traceIds.add(event1.contexts.trace.trace_id));
                                                        }
                                                        !(function (replay, event) {
                                                            let replayContext = replay.getContext();
                                                            if (
                                                                (event.event_id && replayContext.errorIds.size < 100 && replayContext.errorIds.add(event.event_id),
                                                                "buffer" !== replay.recordingMode || !event.tags?.replayId)
                                                            )
                                                                return;
                                                            let { beforeErrorSampling } = replay.getOptions();
                                                            ("function" != typeof beforeErrorSampling || beforeErrorSampling(event)) &&
                                                                browserUtils.setTimeout(async () => {
                                                                    try {
                                                                        await replay.sendBufferedReplayOrFlush();
                                                                    } catch (err) {
                                                                        replay.handleException(err);
                                                                    }
                                                                });
                                                        })(replay, event);
                                                    }
                                                }),
                                                client1.on("createDsc", (dsc) => {
                                                    let replayId = replay.getSessionId();
                                                    replayId &&
                                                        replay.isEnabled() &&
                                                        "session" === replay.recordingMode &&
                                                        replay.checkAndHandleExpiredSession() &&
                                                        (dsc.replay_id = replayId);
                                                }),
                                                client1.on("spanStart", (span) => {
                                                    replay.lastActiveSpan = span;
                                                }),
                                                client1.on("spanEnd", (span) => {
                                                    replay.lastActiveSpan = span;
                                                }),
                                                client1.on("beforeSendFeedback", async (feedbackEvent, options) => {
                                                    let replayId = replay.getSessionId();
                                                    options?.includeReplay &&
                                                        replay.isEnabled() &&
                                                        replayId &&
                                                        feedbackEvent.contexts?.feedback &&
                                                        ("api" === feedbackEvent.contexts.feedback.source && (await replay.sendBufferedReplayOrFlush()),
                                                        (feedbackEvent.contexts.feedback.replay_id = replayId));
                                                }),
                                                client1.on("openFeedbackWidget", async () => {
                                                    await replay.sendBufferedReplayOrFlush();
                                                })));
                                    })(this),
                                    (this._hasInitializedCoreListeners = !0)));
                        } catch (err) {
                            this.handleException(err);
                        }
                        this._performanceCleanupCallback = (function (replay) {
                            function addPerformanceEntry(entry) {
                                replay.performanceEntries.includes(entry) || replay.performanceEntries.push(entry);
                            }
                            function onEntries({ entries }) {
                                entries.forEach(addPerformanceEntry);
                            }
                            let clearCallbacks = [];
                            return (
                                ["navigation", "paint", "resource"].forEach((type) => {
                                    clearCallbacks.push(browserUtils.addPerformanceInstrumentationHandler(type, onEntries));
                                }),
                                clearCallbacks.push(
                                    browserUtils.addLcpInstrumentationHandler(webVitalHandler(getLargestContentfulPaint, replay)),
                                    browserUtils.addClsInstrumentationHandler(webVitalHandler(getCumulativeLayoutShift, replay)),
                                    browserUtils.addInpInstrumentationHandler(webVitalHandler(getInteractionToNextPaint, replay)),
                                ),
                                () => {
                                    clearCallbacks.forEach((clearCallback) => clearCallback());
                                }
                            );
                        })(this);
                    }
                    _removeListeners() {
                        try {
                            (WINDOW.document.removeEventListener("visibilitychange", this._handleVisibilityChange),
                                WINDOW.removeEventListener("blur", this._handleWindowBlur),
                                WINDOW.removeEventListener("focus", this._handleWindowFocus),
                                WINDOW.removeEventListener("keydown", this._handleKeyboardEvent),
                                this.clickDetector && this.clickDetector.removeListeners(),
                                this._performanceCleanupCallback && this._performanceCleanupCallback());
                        } catch (err) {
                            this.handleException(err);
                        }
                    }
                    _doChangeToBackgroundTasks(breadcrumb) {
                        !this.session ||
                            isSessionExpired(this.session, { maxReplayDuration: this._options.maxReplayDuration, sessionIdleExpire: this.timeouts.sessionIdleExpire }) ||
                            (breadcrumb && this._createCustomBreadcrumb(breadcrumb), this.conditionalFlush());
                    }
                    _doChangeToForegroundTasks(breadcrumb) {
                        if (this.session) {
                            if (!this.checkAndHandleExpiredSession()) {
                                DEBUG_BUILD && debug.log("Document has become active, but session has expired");
                                return;
                            }
                            breadcrumb && this._createCustomBreadcrumb(breadcrumb);
                        }
                    }
                    _updateUserActivity(_lastActivity = Date.now()) {
                        this._lastActivity = _lastActivity;
                    }
                    _updateSessionActivity(_lastActivity = Date.now()) {
                        this.session && ((this.session.lastActivity = _lastActivity), this._maybeSaveSession());
                    }
                    _createCustomBreadcrumb(breadcrumb) {
                        this.addUpdate(() => {
                            this.throttledAddEvent({ type: EventType.Custom, timestamp: breadcrumb.timestamp || 0, data: { tag: "breadcrumb", payload: breadcrumb } });
                        });
                    }
                    _addPerformanceEntries() {
                        let performanceEntries = this.performanceEntries.map(createPerformanceEntry).filter(Boolean).concat(this.replayPerformanceEntries);
                        if (((this.performanceEntries = []), (this.replayPerformanceEntries = []), this._requiresManualStart)) {
                            let initialTimestampInSeconds = this._context.initialTimestamp / 1e3;
                            performanceEntries = performanceEntries.filter((entry) => entry.start >= initialTimestampInSeconds);
                        }
                        return Promise.all(createPerformanceSpans(this, performanceEntries));
                    }
                    _clearContext() {
                        (this._context.errorIds.clear(), this._context.traceIds.clear(), (this._context.urls = []));
                    }
                    _updateInitialTimestampFromEventBuffer() {
                        let { session, eventBuffer } = this;
                        if (!session || !eventBuffer || this._requiresManualStart || session.segmentId) return;
                        let earliestEvent = eventBuffer.getEarliestTimestamp();
                        earliestEvent && earliestEvent < this._context.initialTimestamp && (this._context.initialTimestamp = earliestEvent);
                    }
                    _popEventContext() {
                        let _context = {
                            initialTimestamp: this._context.initialTimestamp,
                            initialUrl: this._context.initialUrl,
                            errorIds: Array.from(this._context.errorIds),
                            traceIds: Array.from(this._context.traceIds),
                            urls: this._context.urls,
                        };
                        return (this._clearContext(), _context);
                    }
                    async _runFlush() {
                        let replayId = this.getSessionId();
                        if (!this.session || !this.eventBuffer || !replayId) {
                            DEBUG_BUILD && debug.error("No session or eventBuffer found to flush.");
                            return;
                        }
                        if ((await this._addPerformanceEntries(), this.eventBuffer?.hasEvents)) {
                            if ((await addMemoryEntry(this), this.eventBuffer) && replayId === this.getSessionId())
                                try {
                                    this._updateInitialTimestampFromEventBuffer();
                                    let timestamp = Date.now();
                                    if (timestamp - this._context.initialTimestamp > this._options.maxReplayDuration + 3e4) throw new ReplayDurationLimitError();
                                    let eventContext = this._popEventContext(),
                                        segmentId = this.session.segmentId++;
                                    this._maybeSaveSession();
                                    let recordingData = await this.eventBuffer.finish();
                                    await sendReplay({
                                        replayId,
                                        recordingData,
                                        segmentId,
                                        eventContext,
                                        session: this.session,
                                        timestamp,
                                        onError: (err) => this.handleException(err),
                                    });
                                } catch (err) {
                                    (this.handleException(err), this.stop({ reason: "sendError" }));
                                    let client = core.getClient();
                                    client &&
                                        client.recordDroppedEvent(
                                            err instanceof RateLimitError ? "ratelimit_backoff" : err instanceof ReplayDurationLimitError ? "invalid" : "send_error",
                                            "replay",
                                        );
                                }
                        }
                    }
                    async _flush({ force = !1 } = {}) {
                        if (!this._isEnabled && !force) return;
                        if (!this.checkAndHandleExpiredSession()) {
                            DEBUG_BUILD && debug.error("Attempting to finish replay event after session expired.");
                            return;
                        }
                        if (!this.session) return;
                        let start = this.session.started,
                            duration = Date.now() - start;
                        this._debouncedFlush.cancel();
                        let tooShort = duration < this._options.minReplayDuration,
                            tooLong = duration > this._options.maxReplayDuration + 5e3;
                        if (tooShort || tooLong) {
                            (DEBUG_BUILD && debug.log(`Session duration (${Math.floor(duration / 1e3)}s) is too ${tooShort ? "short" : "long"}, not sending replay.`),
                                tooShort && this._debouncedFlush());
                            return;
                        }
                        let eventBuffer = this.eventBuffer;
                        eventBuffer && 0 === this.session.segmentId && !eventBuffer.hasCheckout && DEBUG_BUILD && debug.log("Flushing initial segment without checkout.");
                        let _flushInProgress = !!this._flushLock;
                        this._flushLock || (this._flushLock = this._runFlush());
                        try {
                            await this._flushLock;
                        } catch (err) {
                            this.handleException(err);
                        } finally {
                            ((this._flushLock = void 0), _flushInProgress && this._debouncedFlush());
                        }
                    }
                    _maybeSaveSession() {
                        this.session && this._options.stickySession && saveSession(this.session);
                    }
                    _onMutationHandler(mutations) {
                        let { ignoreMutations } = this._options._experiments;
                        if (
                            ignoreMutations?.length &&
                            mutations.some((mutation) => {
                                let el = (function (node) {
                                        if (!node) return null;
                                        try {
                                            return node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
                                        } catch {
                                            return null;
                                        }
                                    })(mutation.target),
                                    selector = ignoreMutations.join(",");
                                return el?.matches(selector);
                            })
                        )
                            return !1;
                        let count = mutations.length,
                            mutationLimit = this._options.mutationLimit,
                            mutationBreadcrumbLimit = this._options.mutationBreadcrumbLimit,
                            overMutationLimit = mutationLimit && count > mutationLimit;
                        if (count > mutationBreadcrumbLimit || overMutationLimit) {
                            let breadcrumb = createBreadcrumb({ category: "replay.mutations", data: { count, limit: overMutationLimit } });
                            this._createCustomBreadcrumb(breadcrumb);
                        }
                        return !overMutationLimit || (this.stop({ reason: "mutationLimit", forceFlush: "session" === this.recordingMode }), !1);
                    }
                }
                function getOption(selectors, defaultSelectors) {
                    return [...selectors, ...defaultSelectors].join(",");
                }
                let MEDIA_SELECTORS = 'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]',
                    DEFAULT_NETWORK_HEADERS = ["content-length", "content-type", "accept"],
                    ORIGINAL_BODY = Symbol.for("sentry__originalRequestBody"),
                    _initialized = !1,
                    _isRequestInstrumented = !1;
                class Replay {
                    constructor({
                        flushMinDelay = 5e3,
                        flushMaxDelay = 5500,
                        minReplayDuration = 4999,
                        maxReplayDuration = 36e5,
                        stickySession = !0,
                        useCompression = !0,
                        workerUrl,
                        _experiments = {},
                        maskAllText = !0,
                        maskAllInputs = !0,
                        blockAllMedia = !0,
                        mutationBreadcrumbLimit = 750,
                        mutationLimit = 1e4,
                        slowClickTimeout = 7e3,
                        slowClickIgnoreSelectors = [],
                        networkDetailAllowUrls = [],
                        networkDetailDenyUrls = [],
                        networkCaptureBodies = !0,
                        networkRequestHeaders = [],
                        networkResponseHeaders = [],
                        mask = [],
                        maskAttributes = ["title", "placeholder", "aria-label"],
                        unmask = [],
                        block = [],
                        unblock = [],
                        ignore = [],
                        maskFn,
                        beforeAddRecordingEvent,
                        beforeErrorSampling,
                        onError,
                        attachRawBodyFromRequest = !1,
                    } = {}) {
                        this.name = "Replay";
                        const privacyOptions = (function ({ mask, unmask, block, unblock, ignore }) {
                            return {
                                maskTextSelector: getOption(mask, [".sentry-mask", "[data-sentry-mask]"]),
                                unmaskTextSelector: getOption(unmask, []),
                                blockSelector: getOption(block, [".sentry-block", "[data-sentry-block]", "base", "iframe[srcdoc]:not([src])"]),
                                unblockSelector: getOption(unblock, []),
                                ignoreSelector: getOption(ignore, [".sentry-ignore", "[data-sentry-ignore]", 'input[type="file"]']),
                            };
                        })({ mask, unmask, block, unblock, ignore });
                        if (
                            ((this._recordingOptions = {
                                maskAllInputs,
                                maskAllText,
                                maskInputOptions: { password: !0 },
                                maskTextFn: maskFn,
                                maskInputFn: maskFn,
                                maskAttributeFn: (key, value, el) =>
                                    (function ({ el, key, maskAttributes, maskAllText, privacyOptions, value }) {
                                        return !maskAllText || (privacyOptions.unmaskTextSelector && el.matches(privacyOptions.unmaskTextSelector))
                                            ? value
                                            : maskAttributes.includes(key) ||
                                                ("value" === key && "INPUT" === el.tagName && ["submit", "button"].includes(el.getAttribute("type") || ""))
                                              ? value.replace(/[\S]/g, "*")
                                              : value;
                                    })({ maskAttributes, maskAllText, privacyOptions, key, value, el }),
                                ...privacyOptions,
                                slimDOMOptions: "all",
                                inlineStylesheet: !0,
                                inlineImages: !1,
                                collectFonts: !0,
                                errorHandler: (err) => {
                                    try {
                                        err.__rrweb__ = !0;
                                    } catch {}
                                },
                                recordCrossOriginIframes: !!_experiments.recordCrossOriginIframes,
                            }),
                            (this._initialOptions = {
                                flushMinDelay,
                                flushMaxDelay,
                                minReplayDuration: Math.min(minReplayDuration, 5e4),
                                maxReplayDuration: Math.min(maxReplayDuration, 36e5),
                                stickySession,
                                useCompression,
                                workerUrl,
                                blockAllMedia,
                                maskAllInputs,
                                maskAllText,
                                mutationBreadcrumbLimit,
                                mutationLimit,
                                slowClickTimeout,
                                slowClickIgnoreSelectors,
                                networkDetailAllowUrls,
                                networkDetailDenyUrls,
                                networkCaptureBodies,
                                networkRequestHeaders: _getMergedNetworkHeaders(networkRequestHeaders),
                                networkResponseHeaders: _getMergedNetworkHeaders(networkResponseHeaders),
                                beforeAddRecordingEvent,
                                beforeErrorSampling,
                                onError,
                                attachRawBodyFromRequest,
                                _experiments,
                            }),
                            this._initialOptions.blockAllMedia &&
                                ((this._recordingOptions.blockSelector = this._recordingOptions.blockSelector
                                    ? `${this._recordingOptions.blockSelector},${MEDIA_SELECTORS}`
                                    : MEDIA_SELECTORS),
                                (this._recordingOptions.ignoreCSSAttributes = new Set(["background-image"]))),
                            this._isInitialized && core.isBrowser())
                        )
                            throw Error("Multiple Sentry Session Replay instances are not supported");
                        this._isInitialized = !0;
                    }
                    get _isInitialized() {
                        return _initialized;
                    }
                    set _isInitialized(value) {
                        _initialized = value;
                    }
                    afterAllSetup(client) {
                        core.isBrowser() &&
                            !this._replay &&
                            (this._initialOptions.attachRawBodyFromRequest &&
                                (function () {
                                    if ("u" < typeof Request || _isRequestInstrumented) return;
                                    let OriginalRequest = Request;
                                    try {
                                        let SentryRequest = function (input, init) {
                                            let request = new OriginalRequest(input, init);
                                            return (init?.body != null && (request[ORIGINAL_BODY] = init.body), request);
                                        };
                                        ((SentryRequest.prototype = OriginalRequest.prototype), (core.GLOBAL_OBJ.Request = SentryRequest), (_isRequestInstrumented = !0));
                                    } catch {}
                                })(),
                            this._setup(client),
                            this._initialize(client));
                    }
                    start() {
                        this._replay && this._replay.start();
                    }
                    startBuffering() {
                        this._replay && this._replay.startBuffering();
                    }
                    stop() {
                        return this._replay ? this._replay.stop({ forceFlush: "session" === this._replay.recordingMode, reason: "manual" }) : Promise.resolve();
                    }
                    flush(options) {
                        return this._replay
                            ? this._replay.isEnabled()
                                ? this._replay.sendBufferedReplayOrFlush(options)
                                : (this._replay.start(), Promise.resolve())
                            : Promise.resolve();
                    }
                    getReplayId(onlyIfSampled) {
                        if (this._replay?.isEnabled()) return this._replay.getSessionId(onlyIfSampled);
                    }
                    getRecordingMode() {
                        if (this._replay?.isEnabled()) return this._replay.recordingMode;
                    }
                    _initialize(client) {
                        this._replay && (this._maybeLoadFromReplayCanvasIntegration(client), this._replay.initializeSampling());
                    }
                    _setup(client) {
                        var initialOptions;
                        let opt,
                            finalOptions,
                            replaysSessionSampleRate,
                            replaysOnErrorSampleRate,
                            finalOptions1 =
                                ((initialOptions = this._initialOptions),
                                (opt = client.getOptions()),
                                (finalOptions = { sessionSampleRate: 0, errorSampleRate: 0, ...initialOptions }),
                                (replaysSessionSampleRate = core.parseSampleRate(opt.replaysSessionSampleRate)),
                                (replaysOnErrorSampleRate = core.parseSampleRate(opt.replaysOnErrorSampleRate)),
                                null == replaysSessionSampleRate &&
                                    null == replaysOnErrorSampleRate &&
                                    core.consoleSandbox(() => {
                                        console.warn("Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.");
                                    }),
                                null != replaysSessionSampleRate && (finalOptions.sessionSampleRate = replaysSessionSampleRate),
                                null != replaysOnErrorSampleRate && (finalOptions.errorSampleRate = replaysOnErrorSampleRate),
                                finalOptions);
                        this._replay = new ReplayContainer({ options: finalOptions1, recordingOptions: this._recordingOptions });
                    }
                    _maybeLoadFromReplayCanvasIntegration(client) {
                        try {
                            let canvasIntegration = client.getIntegrationByName("ReplayCanvas");
                            if (!canvasIntegration) return;
                            this._replay._canvas = canvasIntegration.getOptions();
                        } catch {}
                    }
                }
                function _getMergedNetworkHeaders(headers) {
                    return [...DEFAULT_NETWORK_HEADERS, ...headers.map((header) => header.toLowerCase())];
                }
                ((exports.getReplay = function () {
                    let client = core.getClient();
                    return client?.getIntegrationByName("Replay");
                }),
                    (exports.replayIntegration = (options) => new Replay(options)));
            }