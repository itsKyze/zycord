6831(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445);
                exports.viewHierarchyIntegration = core.defineIntegration((options = {}) => {
                    let skipHtmlTags = ["script"];
                    return {
                        name: "ViewHierarchy",
                        processEvent: (event, hint) => {
                            if (void 0 !== event.type || options.shouldAttach?.(event, hint) === !1) return event;
                            let root = { rendering_system: "DOM", positioning: "absolute", windows: [] };
                            !(function walk(element, windows, depth = 0) {
                                if (element)
                                    for (let child of "shadowRoot" in element && element.shadowRoot ? element.shadowRoot.children : element.children) {
                                        if (!(child instanceof HTMLElement)) continue;
                                        let componentName = core.getComponentName(child, 1) || void 0,
                                            tagName = child.tagName.toLowerCase();
                                        if (skipHtmlTags.includes(tagName)) continue;
                                        let result = options.onElement?.({ element: child, componentName, tagName, depth }) || {};
                                        if ("skip" === result) continue;
                                        if ("children" === result) {
                                            walk(child, windows, depth + 1);
                                            continue;
                                        }
                                        let { x, y, width, height } = child.getBoundingClientRect(),
                                            window1 = { identifier: child.id || void 0, type: componentName || tagName, visible: !0, alpha: 1, height, width, x, y, ...result };
                                        ((window1.children = []), walk(child, window1.children, depth + 1), windows.push(window1));
                                    }
                            })(options.rootElement?.() || helpers.WINDOW.document.body, root.windows);
                            let attachment = {
                                filename: "view-hierarchy.json",
                                attachmentType: "event.view_hierarchy",
                                contentType: "application/json",
                                data: JSON.stringify(root),
                            };
                            return ((hint.attachments = hint.attachments || []), hint.attachments.push(attachment), event);
                        },
                    };
                });
            }