(() => {
    // 85-hide-phone.js: Remove phone verification, SMS backup and phone modals (keep Account Info row for Recovery Email)
    const hidePhoneElements = () => {
        // 1. Hide SMS Backup section in User Settings
        document.querySelectorAll("div, section").forEach((sec) => {
            const secText = (sec.innerText || "").trim().toLowerCase();
            if (secText.startsWith("sms backup") && !secText.includes("authenticator app")) {
                sec.style.setProperty("display", "none", "important");
            }
        });

        // 2. Hide standalone "Add Phone Number" / "Add Phone" prompts/buttons (except inside Account Info)
        document.querySelectorAll("button, a, div[role='button']").forEach((btn) => {
            const txt = (btn.innerText || "").trim().toLowerCase();
            if (txt === "add phone number" || txt === "add phone") {
                let parent = btn.parentElement;
                for (let i = 0; i < 4; i++) {
                    if (!parent || parent === document.body) break;
                    if (parent.id === "zycord-recovery-email-row" || parent.hasAttribute("data-zycord-recovery")) break;
                    if (parent.innerText.toLowerCase().includes("phone")) {
                        parent.style.setProperty("display", "none", "important");
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        });
    };

    setInterval(hidePhoneElements, 300);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hidePhoneElements);
    } else {
        hidePhoneElements();
    }

    const observer = new MutationObserver(hidePhoneElements);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
