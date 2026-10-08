(() => {
    // Allows activities to load from /activities/:appId on the main domain
    // without requiring wildcard DNS records (*.app.zyron.site)
    const isActivityUrl = (url) => {
        if (!url || typeof url !== "string") return null;
        const match = url.match(/^(?:https?:)?\/\/(\d{15,21})\.([^/?#]+)(.*)$/i);
        if (match) {
            const appId = match[1];
            const host = match[2].toLowerCase();
            const rest = match[3] || "";
            const currentHost = location.host.toLowerCase();
            const currentHostname = location.hostname.toLowerCase();
            if (host === currentHost || host === currentHostname || host.endsWith(currentHostname) || host.includes("zyron.site")) {
                const queryIndex = rest.indexOf("?");
                const pathPart = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
                const queryPart = queryIndex === -1 ? "" : rest.slice(queryIndex);
                const cleanPath = pathPart.replace(/^\/+/, "");
                return `${location.origin}/activities/${appId}/${cleanPath}${queryPart}`;
            }
        }
        return null;
    };

    // Intercept iframe src property setter
    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "src");
    if (originalSrcDescriptor && originalSrcDescriptor.set) {
        Object.defineProperty(HTMLIFrameElement.prototype, "src", {
            ...originalSrcDescriptor,
            set(value) {
                const rewritten = isActivityUrl(value);
                return originalSrcDescriptor.set.call(this, rewritten || value);
            },
        });
    }

    // Intercept setAttribute("src", ...)
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (this instanceof HTMLIFrameElement && name === "src") {
            const rewritten = isActivityUrl(value);
            return originalSetAttribute.call(this, name, rewritten || value);
        }
        return originalSetAttribute.call(this, name, value);
    };

    // Intercept postMessage to avoid targetOrigin mismatch with the rewritten iframe
    const originalPostMessage = Window.prototype.postMessage;
    Window.prototype.postMessage = function (message, targetOrigin, transfer) {
        if (typeof targetOrigin === "string" && targetOrigin !== "*") {
            const match = targetOrigin.match(/^(?:https?:)?\/\/(\d{15,21})\.([^/?#]+)/i);
            if (match) {
                targetOrigin = location.origin;
            }
        }
        return originalPostMessage.call(this, message, targetOrigin, transfer);
    };
})();
