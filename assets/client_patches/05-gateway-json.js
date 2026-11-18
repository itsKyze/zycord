(() => {
    // Intercept WebSocket creation before fast-connect / gateway initializes
    const NativeWebSocket = window.WebSocket;
    if (!NativeWebSocket) return;

    const PatchedWebSocket = function(url, protocols) {
        if (typeof url === "string") {
            if (url.includes("encoding=etf")) {
                url = url.replace("encoding=etf", "encoding=json");
            }
            if (url.includes("compress=zstd-stream")) {
                url = url.replace("compress=zstd-stream", "compress=zlib-stream");
            }
        }
        return new NativeWebSocket(url, protocols);
    };

    PatchedWebSocket.prototype = NativeWebSocket.prototype;
    Object.assign(PatchedWebSocket, NativeWebSocket);
    window.WebSocket = PatchedWebSocket;
})();
