(() => {
    // Force the promotional email opt-in checkbox to always appear on the register form.
    // Discord client only shows it when promotional_email_opt_in.required === true.
    // When required: true and pre_checked: false, Discord displays:
    // "(Optional) It's okay to send me emails with Discord updates, tips, and special offers. You can opt out at any time."
    const patchJson = (text) => {
        try {
            const data = JSON.parse(text);
            if (data && typeof data === "object") {
                data.promotional_email_opt_in = { required: true, pre_checked: false };
                return JSON.stringify(data);
            }
        } catch {}
        return text;
    };

    const _fetch = window.fetch;
    window.fetch = async function (...args) {
        const req = args[0];
        const url = typeof req === "string" ? req : req instanceof URL ? req.href : req?.url ?? "";
        const res = await _fetch.apply(this, args);
        if (/\/auth\/location-metadata\b/.test(url)) {
            try {
                const json = await res.clone().json();
                if (json && typeof json === "object") {
                    json.promotional_email_opt_in = { required: true, pre_checked: false };
                    return new Response(JSON.stringify(json), {
                        status: res.status,
                        statusText: res.statusText,
                        headers: res.headers,
                    });
                }
            } catch {}
        }
        return res;
    };

    const origSend = XMLHttpRequest.prototype.send;
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._isLocationMetadata = typeof url === "string" && /\/auth\/location-metadata\b/.test(url);
        return origOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        if (this._isLocationMetadata) {
            this.addEventListener("readystatechange", () => {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const patched = patchJson(this.responseText);
                        Object.defineProperty(this, "responseText", { value: patched });
                        Object.defineProperty(this, "response", { value: patched });
                    } catch {}
                }
            });
        }
        return origSend.apply(this, args);
    };
})();
