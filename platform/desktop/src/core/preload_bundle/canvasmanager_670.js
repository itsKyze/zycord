670(__unused_rspack_module, exports, __webpack_require__) {
                let errorHandler;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                var CanvasContext2,
                    t2,
                    n,
                    __defProp$1 = Object.defineProperty,
                    __publicField$1 = (obj, key, value) => {
                        let key1;
                        return (key1 = "symbol" != typeof key ? key + "" : key) in obj
                            ? __defProp$1(obj, key1, { enumerable: !0, configurable: !0, writable: !0, value: value })
                            : (obj[key1] = value);
                    };
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
                function hookSetter(target, key, d, isRevoked, win = window) {
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
                function isBlocked(node, blockClass, blockSelector, unblockSelector, checkAncestors) {
                    if (!node) return !1;
                    let el = (function (node) {
                        if (!node) return null;
                        try {
                            return node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
                        } catch (error) {
                            return null;
                        }
                    })(node);
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
                ("u" > typeof window &&
                    window.Proxy &&
                    window.Reflect &&
                    (_mirror = new Proxy(_mirror, {
                        get: (target, prop, receiver) => ("map" === prop && console.error(DEPARTED_MIRROR_ACCESS_WARNING), Reflect.get(target, prop, receiver)),
                    })),
                    Date.now().toString());
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
                function onRequestAnimationFrame(...rest) {
                    return getImplementation("requestAnimationFrame")(...rest);
                }
                function setTimeout$1(...rest) {
                    return getImplementation("setTimeout")(...rest);
                }
                var CanvasContext =
                    (((CanvasContext2 = CanvasContext || {})[(CanvasContext2["2D"] = 0)] = "2D"),
                    (CanvasContext2[(CanvasContext2.WebGL = 1)] = "WebGL"),
                    (CanvasContext2[(CanvasContext2.WebGL2 = 2)] = "WebGL2"),
                    CanvasContext2);
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
                        : cb;
                for (
                    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lookup = "u" < typeof Uint8Array ? [] : new Uint8Array(256), i$1 = 0;
                    i$1 < chars.length;
                    i$1++
                )
                    lookup[chars.charCodeAt(i$1)] = i$1;
                var encode = function (arraybuffer) {
                    var i2,
                        bytes = new Uint8Array(arraybuffer),
                        len = bytes.length,
                        base64 = "";
                    for (i2 = 0; i2 < len; i2 += 3)
                        ((base64 += chars[bytes[i2] >> 2]),
                            (base64 += chars[((3 & bytes[i2]) << 4) | (bytes[i2 + 1] >> 4)]),
                            (base64 += chars[((15 & bytes[i2 + 1]) << 2) | (bytes[i2 + 2] >> 6)]),
                            (base64 += chars[63 & bytes[i2 + 2]]));
                    return (
                        len % 3 == 2 ? (base64 = base64.substring(0, base64.length - 1) + "=") : len % 3 == 1 && (base64 = base64.substring(0, base64.length - 2) + "=="),
                        base64
                    );
                };
                let canvasVarMap = new Map(),
                    saveWebGLVar = (value, win, ctx) => {
                        let contextMap;
                        if (!value || !(isInstanceOfWebGLObject(value, win) || "object" == typeof value)) return;
                        let name = value.constructor.name,
                            list =
                                ((contextMap = canvasVarMap.get(ctx)) || ((contextMap = new Map()), canvasVarMap.set(ctx, contextMap)),
                                contextMap.has(name) || contextMap.set(name, []),
                                contextMap.get(name)),
                            index = list.indexOf(value);
                        return (-1 === index && ((index = list.length), list.push(value)), index);
                    },
                    serializeArgs = (args, win, ctx) =>
                        args.map((arg) =>
                            (function serializeArg(value, win, ctx) {
                                if (value instanceof Array) return value.map((arg) => serializeArg(arg, win, ctx));
                                if (null === value);
                                else if (
                                    value instanceof Float32Array ||
                                    value instanceof Float64Array ||
                                    value instanceof Int32Array ||
                                    value instanceof Uint32Array ||
                                    value instanceof Uint8Array ||
                                    value instanceof Uint16Array ||
                                    value instanceof Int16Array ||
                                    value instanceof Int8Array ||
                                    value instanceof Uint8ClampedArray
                                )
                                    return { rr_type: value.constructor.name, args: [Object.values(value)] };
                                else if (value instanceof ArrayBuffer) return { rr_type: value.constructor.name, base64: encode(value) };
                                else if (value instanceof DataView)
                                    return { rr_type: value.constructor.name, args: [serializeArg(value.buffer, win, ctx), value.byteOffset, value.byteLength] };
                                else if (value instanceof HTMLImageElement) {
                                    let name = value.constructor.name,
                                        { src } = value;
                                    return { rr_type: name, src };
                                } else if (value instanceof HTMLCanvasElement) return { rr_type: "HTMLImageElement", src: value.toDataURL() };
                                else if (value instanceof ImageData)
                                    return { rr_type: value.constructor.name, args: [serializeArg(value.data, win, ctx), value.width, value.height] };
                                else if (isInstanceOfWebGLObject(value, win) || "object" == typeof value)
                                    return { rr_type: value.constructor.name, index: saveWebGLVar(value, win, ctx) };
                                return value;
                            })(arg, win, ctx),
                        ),
                    isInstanceOfWebGLObject = (value, win) =>
                        !![
                            "WebGLActiveInfo",
                            "WebGLBuffer",
                            "WebGLFramebuffer",
                            "WebGLProgram",
                            "WebGLRenderbuffer",
                            "WebGLShader",
                            "WebGLShaderPrecisionFormat",
                            "WebGLTexture",
                            "WebGLUniformLocation",
                            "WebGLVertexArrayObject",
                            "WebGLVertexArrayObjectOES",
                        ]
                            .filter((name) => "function" == typeof win[name])
                            .find((name) => value instanceof win[name]);
                function initCanvasContextObserver(win, blockClass, blockSelector, unblockSelector, setPreserveDrawingBufferToTrue) {
                    let handlers = [];
                    try {
                        let restoreHandler = patch(win.HTMLCanvasElement.prototype, "getContext", function (original) {
                            return function (contextType, ...args) {
                                if (!isBlocked(this, blockClass, blockSelector, unblockSelector, !0)) {
                                    let ctxName = "experimental-webgl" === contextType ? "webgl" : contextType;
                                    if (("__context" in this || (this.__context = ctxName), setPreserveDrawingBufferToTrue && ["webgl", "webgl2"].includes(ctxName)))
                                        if (args[0] && "object" == typeof args[0]) {
                                            let contextAttributes = args[0];
                                            contextAttributes.preserveDrawingBuffer || (contextAttributes.preserveDrawingBuffer = !0);
                                        } else args.splice(0, 1, { preserveDrawingBuffer: !0 });
                                }
                                return original.apply(this, [contextType, ...args]);
                            };
                        });
                        handlers.push(restoreHandler);
                    } catch {
                        console.error("failed to patch HTMLCanvasElement.prototype.getContext");
                    }
                    return () => {
                        handlers.forEach((h) => h());
                    };
                }
                function patchGLPrototype(prototype, type, cb, blockClass2, blockSelector, unblockSelector, _mirror2, win) {
                    let handlers = [];
                    for (let prop of Object.getOwnPropertyNames(prototype))
                        if (!["isContextLost", "canvas", "drawingBufferWidth", "drawingBufferHeight"].includes(prop))
                            try {
                                if ("function" != typeof prototype[prop]) continue;
                                let restoreHandler = patch(prototype, prop, function (original) {
                                    return function (...args) {
                                        let result = original.apply(this, args);
                                        if (
                                            (saveWebGLVar(result, win, this), "tagName" in this.canvas && !isBlocked(this.canvas, blockClass2, blockSelector, unblockSelector, !0))
                                        ) {
                                            let recordArgs = serializeArgs(args, win, this),
                                                mutation = { type, property: prop, args: recordArgs };
                                            cb(this.canvas, mutation);
                                        }
                                        return result;
                                    };
                                });
                                handlers.push(restoreHandler);
                            } catch {
                                let hookHandler = hookSetter(prototype, prop, {
                                    set(v2) {
                                        cb(this.canvas, { type, property: prop, args: [v2], setter: !0 });
                                    },
                                });
                                handlers.push(hookHandler);
                            }
                    return handlers;
                }
                class CanvasManager {
                    constructor(options) {
                        ((this.pendingCanvasMutations = new Map()),
                            (this.rafStamps = { latestId: 0, invokeId: null }),
                            (this.shadowDoms = new Set()),
                            (this.windowsSet = new WeakSet()),
                            (this.windows = []),
                            (this.restoreHandlers = []),
                            (this.frozen = !1),
                            (this.locked = !1),
                            (this.snapshotInProgressMap = new Map()),
                            (this.worker = null),
                            (this.lastSnapshotTime = 0),
                            (this.processMutation = (target, mutation) => {
                                (((this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId) || !this.rafStamps.invokeId) &&
                                    (this.rafStamps.invokeId = this.rafStamps.latestId),
                                    this.pendingCanvasMutations.has(target) || this.pendingCanvasMutations.set(target, []),
                                    this.pendingCanvasMutations.get(target).push(mutation));
                            }));
                        const { enableManualSnapshot, sampling = "all", win, recordCanvas, errorHandler: errorHandler2 } = options;
                        if (
                            ((options.sampling = sampling),
                            (this.mutationCb = options.mutationCb),
                            (this.mirror = options.mirror),
                            (this.options = options),
                            errorHandler2 &&
                                (function (handler) {
                                    errorHandler = handler;
                                })(errorHandler2),
                            ((recordCanvas && "number" == typeof sampling) || enableManualSnapshot) && (this.worker = this.initFPSWorker()),
                            this.addWindow(win),
                            enableManualSnapshot)
                        )
                            return;
                        callbackWrapper(() => {
                            (recordCanvas && "all" === sampling && (this.startRAFTimestamping(), this.startPendingCanvasMutationFlusher()),
                                recordCanvas && "number" == typeof sampling && this.initCanvasFPSObserver());
                        })();
                    }
                    reset() {
                        (this.pendingCanvasMutations.clear(),
                            this.restoreHandlers.forEach((handler) => {
                                try {
                                    handler();
                                } catch (e2) {}
                            }),
                            (this.restoreHandlers = []),
                            (this.windowsSet = new WeakSet()),
                            (this.windows = []),
                            (this.shadowDoms = new Set()),
                            this.worker?.terminate(),
                            (this.worker = null),
                            (this.snapshotInProgressMap = new Map()));
                    }
                    freeze() {
                        this.frozen = !0;
                    }
                    unfreeze() {
                        this.frozen = !1;
                    }
                    lock() {
                        this.locked = !0;
                    }
                    unlock() {
                        this.locked = !1;
                    }
                    addWindow(win) {
                        let { sampling = "all", blockClass, blockSelector, unblockSelector, recordCanvas, enableManualSnapshot } = this.options;
                        if (!this.windowsSet.has(win)) {
                            if (enableManualSnapshot) {
                                (this.windowsSet.add(win), this.windows.push(new WeakRef(win)));
                                return;
                            }
                            (callbackWrapper(() => {
                                if (
                                    (recordCanvas && "all" === sampling && this.initCanvasMutationObserver(win, blockClass, blockSelector, unblockSelector),
                                    recordCanvas && "number" == typeof sampling)
                                ) {
                                    let canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector, unblockSelector, !0);
                                    this.restoreHandlers.push(() => {
                                        canvasContextReset();
                                    });
                                }
                            })(),
                                this.windowsSet.add(win),
                                this.windows.push(new WeakRef(win)));
                        }
                    }
                    addShadowRoot(shadowRoot) {
                        this.shadowDoms.add(new WeakRef(shadowRoot));
                    }
                    resetShadowRoots() {
                        this.shadowDoms = new Set();
                    }
                    snapshot(canvasElement, options) {
                        options?.skipRequestAnimationFrame
                            ? this.takeSnapshot(performance.now(), !0, canvasElement)
                            : onRequestAnimationFrame((timestamp) => this.takeSnapshot(timestamp, !0, canvasElement));
                    }
                    initFPSWorker() {
                        let t2,
                            worker = new Worker(
                                ((t2 = new Blob([
                                    'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w?.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};',
                                ])),
                                URL.createObjectURL(t2)),
                            );
                        return (
                            (worker.onmessage = (e2) => {
                                let data = e2.data,
                                    { id } = data;
                                if ((this.snapshotInProgressMap.set(id, !1), !("base64" in data))) return;
                                let { base64, type, width, height } = data;
                                this.mutationCb({
                                    id,
                                    type: CanvasContext["2D"],
                                    commands: [
                                        { property: "clearRect", args: [0, 0, width, height] },
                                        {
                                            property: "drawImage",
                                            args: [{ rr_type: "ImageBitmap", args: [{ rr_type: "Blob", data: [{ rr_type: "ArrayBuffer", base64 }], type }] }, 0, 0, width, height],
                                        },
                                    ],
                                });
                            }),
                            worker
                        );
                    }
                    initCanvasFPSObserver() {
                        let rafId;
                        if (!this.windows.length && !this.shadowDoms.size) return;
                        let rafCallback = (timestamp) => {
                            (this.takeSnapshot(timestamp, !1), (rafId = onRequestAnimationFrame(rafCallback)));
                        };
                        ((rafId = onRequestAnimationFrame(rafCallback)),
                            this.restoreHandlers.push(() => {
                                rafId && cancelAnimationFrame(rafId);
                            }));
                    }
                    initCanvasMutationObserver(win, blockClass, blockSelector, unblockSelector) {
                        var cb, mirror2;
                        let handlers,
                            canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector, unblockSelector, !1),
                            canvas2DReset = (function (cb, win, blockClass2, blockSelector, unblockSelector) {
                                let handlers = [];
                                for (let prop of Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype))
                                    try {
                                        if ("function" != typeof win.CanvasRenderingContext2D.prototype[prop]) continue;
                                        let restoreHandler = patch(win.CanvasRenderingContext2D.prototype, prop, function (original) {
                                            return function (...args) {
                                                return (
                                                    isBlocked(this.canvas, blockClass2, blockSelector, unblockSelector, !0) ||
                                                        setTimeout$1(() => {
                                                            let recordArgs = serializeArgs(args, win, this);
                                                            cb(this.canvas, { type: CanvasContext["2D"], property: prop, args: recordArgs });
                                                        }, 0),
                                                    original.apply(this, args)
                                                );
                                            };
                                        });
                                        handlers.push(restoreHandler);
                                    } catch {
                                        let hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
                                            set(v2) {
                                                cb(this.canvas, { type: CanvasContext["2D"], property: prop, args: [v2], setter: !0 });
                                            },
                                        });
                                        handlers.push(hookHandler);
                                    }
                                return () => {
                                    handlers.forEach((h) => h());
                                };
                            })(this.processMutation.bind(this), win, blockClass, blockSelector, unblockSelector),
                            canvasWebGL1and2Reset =
                                ((cb = this.processMutation.bind(this)),
                                (mirror2 = this.mirror),
                                (handlers = []).push(
                                    ...patchGLPrototype(win.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass, blockSelector, unblockSelector, mirror2, win),
                                ),
                                void 0 !== win.WebGL2RenderingContext &&
                                    handlers.push(
                                        ...patchGLPrototype(
                                            win.WebGL2RenderingContext.prototype,
                                            CanvasContext.WebGL2,
                                            cb,
                                            blockClass,
                                            blockSelector,
                                            unblockSelector,
                                            mirror2,
                                            win,
                                        ),
                                    ),
                                () => {
                                    handlers.forEach((h) => h());
                                });
                        this.restoreHandlers.push(() => {
                            (canvasContextReset(), canvas2DReset(), canvasWebGL1and2Reset());
                        });
                    }
                    getCanvasElements(blockClass, blockSelector, unblockSelector) {
                        let matchedCanvas = [],
                            searchCanvas = (root) => {
                                root.querySelectorAll("canvas").forEach((canvas) => {
                                    isBlocked(canvas, blockClass, blockSelector, unblockSelector, !0) || matchedCanvas.push(canvas);
                                });
                            };
                        for (let item of this.windows) {
                            let _document,
                                window2 = item.deref();
                            try {
                                _document = window2 && window2.document;
                            } catch {}
                            _document && searchCanvas(_document);
                        }
                        for (let item of this.shadowDoms) {
                            let shadowRoot = item.deref();
                            shadowRoot && searchCanvas(shadowRoot);
                        }
                        return matchedCanvas;
                    }
                    takeSnapshot(timestamp, isManualSnapshot, canvasElement) {
                        let { sampling, blockClass, blockSelector, unblockSelector, dataURLOptions, maxCanvasSize } = this.options;
                        return (
                            (!this.lastSnapshotTime || !(timestamp - this.lastSnapshotTime < 1e3 / ("all" === sampling ? 2 : sampling || 2))) &&
                            ((this.lastSnapshotTime = timestamp),
                            (canvasElement ? [canvasElement] : this.getCanvasElements(blockClass, blockSelector, unblockSelector)).forEach((canvas) => {
                                let id = this.mirror.getId(canvas);
                                if (!(!this.mirror.hasNode(canvas) || !canvas.width || !canvas.height || this.snapshotInProgressMap.get(id))) {
                                    if ((this.snapshotInProgressMap.set(id, !0), !isManualSnapshot && ["webgl", "webgl2"].includes(canvas.__context))) {
                                        let context = canvas.getContext(canvas.__context);
                                        context?.getContextAttributes()?.preserveDrawingBuffer === !1 && context.clear(context.COLOR_BUFFER_BIT);
                                    }
                                    createImageBitmap(canvas)
                                        .then((bitmap) => {
                                            this.worker?.postMessage({ id, bitmap, width: canvas.width, height: canvas.height, dataURLOptions, maxCanvasSize }, [bitmap]);
                                        })
                                        .catch((error) => {
                                            callbackWrapper(() => {
                                                throw (this.snapshotInProgressMap.delete(id), error);
                                            })();
                                        });
                                }
                            }),
                            !0)
                        );
                    }
                    startPendingCanvasMutationFlusher() {
                        onRequestAnimationFrame(() => this.flushPendingCanvasMutations());
                    }
                    startRAFTimestamping() {
                        let setLatestRAFTimestamp = (timestamp) => {
                            ((this.rafStamps.latestId = timestamp), onRequestAnimationFrame(setLatestRAFTimestamp));
                        };
                        onRequestAnimationFrame(setLatestRAFTimestamp);
                    }
                    flushPendingCanvasMutations() {
                        (this.pendingCanvasMutations.forEach((_values, canvas) => {
                            let id = this.mirror.getId(canvas);
                            this.flushPendingCanvasMutationFor(canvas, id);
                        }),
                            onRequestAnimationFrame(() => this.flushPendingCanvasMutations()));
                    }
                    flushPendingCanvasMutationFor(canvas, id) {
                        if (this.frozen || this.locked) return;
                        let valuesWithType = this.pendingCanvasMutations.get(canvas);
                        if (!valuesWithType || -1 === id) return;
                        let values = valuesWithType.map((value) => {
                                let { type: type2, ...rest } = value;
                                return rest;
                            }),
                            { type } = valuesWithType[0];
                        (this.mutationCb({ id, type, commands: values }), this.pendingCanvasMutations.delete(canvas));
                    }
                }
                try {
                    if (2 !== Array.from([1], (x) => 2 * x)[0]) {
                        let cleanFrame = document.createElement("iframe");
                        (document.body.appendChild(cleanFrame), (Array.from = cleanFrame.contentWindow?.Array.from || Array.from), document.body.removeChild(cleanFrame));
                    }
                } catch (err) {
                    console.debug("Unable to override Array.from", err);
                }
                (new (class Mirror {
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
                })(),
                    ((t2 = n || (n = {}))[(t2.NotStarted = 0)] = "NotStarted"),
                    (t2[(t2.Running = 1)] = "Running"),
                    (t2[(t2.Stopped = 2)] = "Stopped"));
                let CANVAS_QUALITY = {
                    low: { sampling: { canvas: 1 }, dataURLOptions: { type: "image/webp", quality: 0.25 } },
                    medium: { sampling: { canvas: 2 }, dataURLOptions: { type: "image/webp", quality: 0.4 } },
                    high: { sampling: { canvas: 4 }, dataURLOptions: { type: "image/webp", quality: 0.5 } },
                };
                exports.replayCanvasIntegration = core.defineIntegration((options = {}) => {
                    let currentCanvasManager,
                        canvasManagerResolve,
                        [maxCanvasWidth, maxCanvasHeight] = options.maxCanvasSize || [],
                        _canvasOptions = {
                            quality: options.quality || "medium",
                            enableManualSnapshot: options.enableManualSnapshot,
                            maxCanvasSize: [maxCanvasWidth ? Math.min(maxCanvasWidth, 1280) : 1280, maxCanvasHeight ? Math.min(maxCanvasHeight, 1280) : 1280],
                        },
                        _canvasManager = new Promise((resolve) => (canvasManagerResolve = resolve));
                    return {
                        name: "ReplayCanvas",
                        getOptions() {
                            let { quality, enableManualSnapshot, maxCanvasSize } = _canvasOptions;
                            return {
                                enableManualSnapshot,
                                recordCanvas: !0,
                                getCanvasManager: (getCanvasManagerOptions) => {
                                    let manager = new CanvasManager({
                                        ...getCanvasManagerOptions,
                                        enableManualSnapshot,
                                        maxCanvasSize,
                                        errorHandler: (err) => {
                                            try {
                                                "object" == typeof err && (err.__rrweb__ = !0);
                                            } catch {}
                                        },
                                    });
                                    return ((currentCanvasManager = manager), canvasManagerResolve(manager), manager);
                                },
                                ...(CANVAS_QUALITY[quality] || CANVAS_QUALITY.medium),
                            };
                        },
                        async snapshot(canvasElement, options) {
                            (currentCanvasManager || (await _canvasManager)).snapshot(canvasElement, options);
                        },
                    };
                });
            }