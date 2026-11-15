(() => {
    // 85-hide-phone.js: Remove all phone verification and phone number references from Zycord client UI
    const hidePhoneElements = () => {
        // 1. Hide Phone Number row in User Settings -> My Account
        const selectors = [
            'div[class*="accountList_"] > div',
            'div[class*="fieldList_"] > div',
            'div[class*="field_"]',
            'div[role="group"] > div',
        ];

        document.querySelectorAll(selectors.join(",")).forEach((el) => {
            const text = (el.innerText || "").trim().toLowerCase();
            const isPhoneRow =
                text.startsWith("phone number") ||
                text.startsWith("رقم الهاتف") ||
                text.startsWith("numéro de téléphone") ||
                text.startsWith("téléphone") ||
                text.startsWith("telefonnummer") ||
                (text.includes("phone number") && (text.includes("add") || text.includes("remove") || text.includes("edit") || text.includes("إضافة")));

            if (isPhoneRow) {
                el.style.setProperty("display", "none", "important");
            }
        });

        // 2. Hide any standalone "Add Phone Number" buttons or banners
        document.querySelectorAll('button, a, div[role="button"]').forEach((btn) => {
            const btnText = (btn.innerText || "").trim().toLowerCase();
            if (
                btnText === "add phone number" ||
                btnText === "إضافة رقم هاتف" ||
                btnText === "ajouter un numéro de téléphone" ||
                btnText === "add phone"
            ) {
                const parentField = btn.closest('div[class*="field_"]') || btn.parentElement;
                if (parentField) parentField.style.setProperty("display", "none", "important");
                else btn.style.setProperty("display", "none", "important");
            }
        });

        // 3. Hide SMS Backup / SMS MFA section in User Settings
        document.querySelectorAll('div[class*="children_"], div[class*="section_"]').forEach((sec) => {
            const secText = (sec.innerText || "").trim().toLowerCase();
            if (
                (secText.includes("sms backup") || secText.includes("نسخ احتياطي عبر sms") || secText.includes("sauvegarde par sms")) &&
                !secText.includes("authenticator")
            ) {
                sec.style.setProperty("display", "none", "important");
            }
        });
    };

    // Run on initial load and observe DOM changes
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hidePhoneElements);
    } else {
        hidePhoneElements();
    }

    const observer = new MutationObserver(() => {
        hidePhoneElements();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
