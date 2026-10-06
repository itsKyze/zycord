(() => {
    const handleAuth = () => {
        if (location.pathname === "/oauth2/authorized") {
            try {
                if (window.opener) {
                    window.opener.postMessage({ type: "OAUTH2_AUTHORIZED", status: "success" }, "*");
                    window.close();
                }
            } catch (_) {}
            setTimeout(() => {
                try {
                    if (window.opener) {
                        window.close();
                    } else {
                        location.replace("/app");
                    }
                } catch (_) {
                    location.replace("/app");
                }
            }, 300);
        }
    };
    handleAuth();
    window.addEventListener("popstate", handleAuth);
})();
