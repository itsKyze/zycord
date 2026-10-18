926(__unused_rspack_module, exports, __webpack_require__) {
                let browser = __webpack_require__(5768),
                    core = __webpack_require__(5777),
                    [, chrome] = browser.chromeStackLineParser,
                    [, node] = core.nodeStackLineParser();
                exports.electronRendererStackParser = (stack, skipFirst = 0) => {
                    let frames = [];
                    for (let line of stack.split("\n").slice(skipFirst)) {
                        let chromeFrame = chrome(line),
                            nodeFrame = node(line);
                        if (
                            (chromeFrame && nodeFrame?.in_app !== !1
                                ? frames.push(chromeFrame)
                                : nodeFrame && (void 0 === nodeFrame.module && delete nodeFrame.module, frames.push(nodeFrame)),
                            frames.length >= 50)
                        )
                            break;
                    }
                    return core.stripSentryFramesAndReverse(frames);
                };
            }