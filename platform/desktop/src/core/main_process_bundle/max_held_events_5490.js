5490(__unused_rspack_module, exports) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.MAX_HELD_EVENTS = void 0),
                    (exports.methodRefusal = methodRefusal),
                    (exports.emptyFrameDocument = function () {
                        return { loaderId: null, nodeId: null, backendNodeId: null, knownNodes: new Set() };
                    }),
                    (exports.forgetDocument = forgetDocument),
                    (exports.runFrameCalls = runFrameCalls),
                    (exports.readFrameState = readFrameState),
                    (exports.redactUrl = redactUrl),
                    (exports.shimEvent = function (method, p, frameOrigin, requests) {
                        switch (method) {
                            case "Runtime.consoleAPICalled": {
                                let args = Array.isArray(p.args) ? p.args.slice(0, 20).map(pickRemoteObject) : [];
                                return { method, params: { type: p.type, args, executionContextId: 1, timestamp: p.timestamp } };
                            }
                            case "Runtime.exceptionThrown": {
                                let details = p.exceptionDetails ?? {},
                                    picked = { exceptionId: details.exceptionId, text: bounded(details.text), lineNumber: details.lineNumber, columnNumber: details.columnNumber };
                                return (
                                    "string" == typeof details.url && (picked.url = details.url),
                                    null != details.exception && (picked.exception = pickRemoteObject(details.exception)),
                                    { method, params: { timestamp: p.timestamp, exceptionDetails: picked } }
                                );
                            }
                            case "Network.requestWillBeSent": {
                                let url = String(p.request?.url ?? "");
                                if (!NETWORK_TYPES.has(p.type) || url.includes("/zycord-cgi/")) return null;
                                let clockOffset = "number" == typeof p.wallTime ? p.wallTime - p.timestamp : 0,
                                    request = { type: p.type, url: redactUrl(url, frameOrigin), clockOffset };
                                (requests.set(p.requestId, request), requests.size > 500 && requests.delete(requests.keys().next().value));
                                let timestamp = p.timestamp + clockOffset;
                                return {
                                    method,
                                    params: {
                                        requestId: p.requestId,
                                        loaderId: "",
                                        documentURL: redactUrl(String(p.documentURL ?? frameOrigin), frameOrigin),
                                        request: { url: request.url, method: String(p.request?.method ?? "GET").toUpperCase(), headers: {} },
                                        timestamp,
                                        wallTime: timestamp,
                                        initiator: { type: "script" },
                                        type: p.type,
                                    },
                                };
                            }
                            case "Network.responseReceived":
                            case "Network.loadingFinished":
                            case "Network.loadingFailed": {
                                let request = requests.get(p.requestId);
                                if (null == request) return null;
                                let base = { requestId: p.requestId, timestamp: p.timestamp + request.clockOffset };
                                if ("Network.responseReceived" === method) {
                                    let response = { url: request.url, status: p.response?.status, statusText: "", headers: {}, mimeType: "" };
                                    return { method, params: { ...base, type: request.type, response } };
                                }
                                if ((requests.delete(p.requestId), "Network.loadingFinished" === method)) return { method, params: { ...base, encodedDataLength: 0 } };
                                return { method, params: { ...base, type: request.type, errorText: p.errorText } };
                            }
                            default:
                                return null;
                        }
                    }));
                let FRAME_METHODS = new Set([
                        "Runtime.evaluate",
                        "Runtime.callFunctionOn",
                        "Runtime.releaseObjectGroup",
                        "DOM.describeNode",
                        "DOM.querySelectorAll",
                        "DOM.getBoxModel",
                        "DOM.scrollIntoViewIfNeeded",
                        "Accessibility.getFullAXTree",
                        "Page.navigate",
                        "Page.reload",
                        "Input.dispatchMouseEvent",
                        "Input.dispatchKeyEvent",
                        "Input.insertText",
                    ]),
                    DENIED_PREFIXES = ["Target.", "Storage.", "DOMStorage.", "Browser.", "SystemInfo.", "Network.", "Fetch.", "Emulation."],
                    DENIED_METHODS = new Set([
                        "DOM.setFileInputFiles",
                        "DOM.getFileInfo",
                        "Page.addScriptToEvaluateOnNewDocument",
                        "Page.removeScriptToEvaluateOnNewDocument",
                        "Runtime.addBinding",
                    ]),
                    RELAY_FRAME_ID = "main";
                exports.MAX_HELD_EVENTS = 200;
                let BLOCKED_NAVIGATION = { frameId: RELAY_FRAME_ID, errorText: "net::ERR_BLOCKED_BY_CLIENT" };
                function methodRefusal(method) {
                    return "string" != typeof method
                        ? "FRAME_DEBUGGER_BAD_METHOD"
                        : DENIED_METHODS.has(method) || DENIED_PREFIXES.some((prefix) => method.startsWith(prefix))
                          ? `FRAME_DEBUGGER_METHOD_DENIED: ${method}`
                          : FRAME_METHODS.has(method)
                            ? null
                            : `FRAME_DEBUGGER_METHOD_NOT_ALLOWED: ${method}`;
                }
                function forgetDocument(doc) {
                    ((doc.nodeId = null), (doc.backendNodeId = null), doc.knownNodes.clear());
                }
                async function documentIds(exec, doc) {
                    if (null == doc.nodeId || null == doc.backendNodeId) {
                        let { root } = await exec("DOM.getDocument", { depth: 0 });
                        ((doc.nodeId = root.nodeId), (doc.backendNodeId = root.backendNodeId));
                    }
                    return { nodeId: doc.nodeId, backendNodeId: doc.backendNodeId };
                }
                async function backendIn(exec, doc, id) {
                    if (1 === id) return (await documentIds(exec, doc)).backendNodeId;
                    if ("number" != typeof id || !doc.knownNodes.has(id)) throw Error("No node with given id found");
                    return id;
                }
                function backendOut(doc, id) {
                    return "number" != typeof id ? id : id === doc.backendNodeId ? 1 : (doc.knownNodes.size < 2e4 && doc.knownNodes.add(id), id);
                }
                async function objectIn(exec, doc, objectId) {
                    if ("string" != typeof objectId || !objectId.startsWith("n:")) return objectId;
                    let node = Number(objectId.slice(2)),
                        { object } = await exec("DOM.resolveNode", { backendNodeId: await backendIn(exec, doc, node) });
                    return object.objectId;
                }
                async function nodeTargetIn(exec, doc, params) {
                    let { nodeId, backendNodeId, objectId, ...rest } = params;
                    return (
                        (null != nodeId || null != backendNodeId) && (rest.backendNodeId = await backendIn(exec, doc, nodeId ?? backendNodeId)),
                        null != objectId && (rest.objectId = await objectIn(exec, doc, objectId)),
                        rest
                    );
                }
                async function callFunctionOnIn(exec, doc, params) {
                    let { executionContextId: _context, uniqueContextId: _unique, objectId, ...rest } = params;
                    return (
                        (rest.objectId =
                            null != objectId
                                ? await objectIn(exec, doc, objectId)
                                : (await exec("Runtime.evaluate", { expression: "globalThis", objectGroup: rest.objectGroup })).result.objectId),
                        Array.isArray(rest.arguments) &&
                            (rest.arguments = await Promise.all(
                                rest.arguments.map(async (arg) => (arg?.objectId != null ? { ...arg, objectId: await objectIn(exec, doc, arg.objectId) } : arg)),
                            )),
                        rest
                    );
                }
                async function querySelectorAll(exec, doc, params) {
                    let parent = params.nodeId ?? 1,
                        parentBackendId = await backendIn(exec, doc, parent),
                        ids = await documentIds(exec, doc),
                        parentNodeId = 1 === parent ? ids.nodeId : (await exec("DOM.pushNodesByBackendIdsToFrontend", { backendNodeIds: [parentBackendId] })).nodeIds[0],
                        { nodeIds } = await exec("DOM.querySelectorAll", { nodeId: parentNodeId, selector: params.selector });
                    return {
                        nodeIds: await Promise.all(
                            nodeIds.slice(0, 2e3).map(async (nodeId) => {
                                let { node } = await exec("DOM.describeNode", { nodeId });
                                return backendOut(doc, node.backendNodeId);
                            }),
                        ),
                    };
                }
                async function navigate(exec, doc, url) {
                    let target,
                        { frameTree } = await exec("Page.getFrameTree");
                    try {
                        target = new URL(String(url), frameTree.frame.url);
                    } catch {
                        return { frameId: RELAY_FRAME_ID, errorText: "net::ERR_INVALID_URL" };
                    }
                    if (target.origin !== new URL(frameTree.frame.url).origin) return BLOCKED_NAVIGATION;
                    let result = await exec("Page.navigate", { url: target.href });
                    return (forgetDocument(doc), { ...result, frameId: RELAY_FRAME_ID });
                }
                async function assertInFrame(exec, viewport, params) {
                    if (null == viewport.current) {
                        let { cssLayoutViewport } = await exec("Page.getLayoutMetrics");
                        viewport.current = { width: cssLayoutViewport.clientWidth, height: cssLayoutViewport.clientHeight };
                    }
                    let { x, y } = params,
                        { width, height } = viewport.current;
                    if ("number" != typeof x || "number" != typeof y || !(x >= 0 && y >= 0 && x <= width && y <= height)) throw Error("FRAME_DEBUGGER_INPUT_OUTSIDE_FRAME");
                }
                async function runFrameCall(exec, doc, call, viewport) {
                    let params = call.params ?? {};
                    switch (call.method) {
                        case "Runtime.evaluate": {
                            let { contextId: _context, uniqueContextId: _unique, ...rest } = params;
                            return await exec("Runtime.evaluate", rest);
                        }
                        case "Runtime.callFunctionOn":
                            return await exec("Runtime.callFunctionOn", await callFunctionOnIn(exec, doc, params));
                        case "DOM.describeNode": {
                            let result = await exec("DOM.describeNode", await nodeTargetIn(exec, doc, params));
                            return {
                                ...result,
                                node: (function nodeOut(doc, node) {
                                    if (null == node || "object" != typeof node) return node;
                                    let id = backendOut(doc, node.backendNodeId),
                                        out = { ...node, nodeId: id, backendNodeId: id };
                                    for (let key of ["children", "shadowRoots", "pseudoElements"])
                                        Array.isArray(node[key]) && (out[key] = node[key].map((child) => nodeOut(doc, child)));
                                    for (let key of ["contentDocument", "templateContent"]) null != node[key] && (out[key] = nodeOut(doc, node[key]));
                                    return out;
                                })(doc, result.node),
                            };
                        }
                        case "DOM.getBoxModel":
                        case "DOM.scrollIntoViewIfNeeded":
                            return await exec(call.method, await nodeTargetIn(exec, doc, params));
                        case "DOM.querySelectorAll":
                            return await querySelectorAll(exec, doc, params);
                        case "Accessibility.getFullAXTree": {
                            let kept,
                                ids,
                                { frameId: _frame, ...rest } = params,
                                result = await exec("Accessibility.getFullAXTree", rest);
                            return {
                                ...result,
                                nodes:
                                    ((ids = new Set((kept = (Array.isArray(result.nodes) ? result.nodes : []).slice(0, 1500)).map((node) => node.nodeId))),
                                    kept.map((node) => ({
                                        ...node,
                                        backendDOMNodeId: backendOut(doc, node.backendDOMNodeId),
                                        ...(Array.isArray(node.childIds) ? { childIds: node.childIds.filter((id) => ids.has(id)) } : {}),
                                    }))),
                            };
                        }
                        case "Page.navigate":
                            return await navigate(exec, doc, params.url);
                        case "Page.reload":
                            return (await exec("Runtime.evaluate", { expression: "location.reload()" }), forgetDocument(doc), {});
                        case "Input.dispatchMouseEvent":
                            return (await assertInFrame(exec, viewport, params), await exec(call.method, params));
                        default:
                            return await exec(call.method, params);
                    }
                }
                async function runFrameCalls(exec, doc, calls, stop) {
                    let replies = [],
                        viewport = { current: null },
                        chars = 0;
                    for (let call of calls) {
                        if (stop.stopped) {
                            replies.push({ error: { code: -32e3, message: "stopped by the user" } });
                            continue;
                        }
                        let refusal = (function (call) {
                            if (null == call || "object" != typeof call) return "FRAME_DEBUGGER_BAD_CALL";
                            let { method, params } = call;
                            return null != params && ("object" != typeof params || Array.isArray(params)) ? "FRAME_DEBUGGER_BAD_PARAMS" : methodRefusal(method);
                        })(call);
                        if (null != refusal) {
                            replies.push({ error: { code: -32601, message: refusal } });
                            continue;
                        }
                        try {
                            let result = (await runFrameCall(exec, doc, call, viewport)) ?? {};
                            ((chars += JSON.stringify(result).length),
                                replies.push(chars > 6e5 ? { error: { code: -32e3, message: "the reply is too large to send" } } : { result }));
                        } catch (e) {
                            replies.push({ error: { code: -32e3, message: e instanceof Error ? e.message : String(e) } });
                        }
                    }
                    return replies;
                }
                async function readFrameState(exec, doc) {
                    let { frameTree } = await exec("Page.getFrameTree"),
                        frame = frameTree.frame;
                    (null != doc.loaderId && frame.loaderId !== doc.loaderId && forgetDocument(doc), (doc.loaderId = frame.loaderId));
                    let { result } = await exec("Runtime.evaluate", {
                            expression:
                                "[document.title, (document.querySelector('script[data-vibegrations-build]') || {getAttribute: () => ''}).getAttribute('data-vibegrations-build') || '']",
                            returnByValue: !0,
                        }),
                        [title, build] = Array.isArray(result?.value) ? result.value : ["", ""];
                    return { url: `${frame.url}${frame.urlFragment ?? ""}`, title: String(title ?? ""), doc: String(frame.loaderId), build: String(build ?? "") };
                }
                function bounded(value) {
                    return "string" == typeof value ? value.slice(0, 4e3) : value;
                }
                function pickRemoteObject(value) {
                    let out = { type: value?.type };
                    return (
                        value?.subtype != null && (out.subtype = value.subtype),
                        null != value && "value" in value && (out.value = bounded(value.value)),
                        "string" == typeof value?.description && (out.description = bounded(value.description)),
                        out
                    );
                }
                let NETWORK_TYPES = new Set(["Fetch", "XHR"]);
                function redactUrl(url, frameOrigin) {
                    try {
                        let parsed = new URL(url, frameOrigin);
                        if ("data:" === parsed.protocol || "blob:" === parsed.protocol) return parsed.protocol;
                        let names = [];
                        parsed.searchParams.forEach((_value, name) => names.push(`${name}=\u{2026}`));
                        let pathname = parsed.pathname
                                .split("/")
                                .map((segment) => (/^(?=.*[A-Za-z])(?=.*\d)[\w.~-]{24,}$/.test(segment) ? ":redacted" : segment))
                                .join("/"),
                            path = parsed.origin === frameOrigin ? pathname : `${parsed.protocol}//${parsed.host}${pathname}`;
                        return (names.length > 0 ? `${path}?${names.join("&")}` : path).slice(0, 300);
                    } catch {
                        return "(unparsed url)";
                    }
                }
            }