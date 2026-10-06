/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Config, instanceName, INSTANCE_ICON_PATH } from "@spacebar/util";

const PROVIDER_NAMES: Record<string, string> = {
    github: "GitHub",
    steam: "Steam",
    spotify: "Spotify",
    twitch: "Twitch",
    youtube: "YouTube",
    twitter: "X",
    discord: "Discord",
    reddit: "Reddit",
    battlenet: "Battle.net",
    epicgames: "Epic Games",
    xbox: "Xbox",
    playstation: "PlayStation",
    playstation_network: "PlayStation Network",
    tiktok: "TikTok",
    crunchyroll: "Crunchyroll",
    domain: "Domain",
};

export const getProviderFriendlyName = (id: string): string => {
    return PROVIDER_NAMES[id.toLowerCase()] || (id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, " "));
};

export const getProviderIconSvg = (id: string): { svg: string; bg?: string } => {
    const key = id.toLowerCase();
    switch (key) {
        case "github":
            return {
                bg: "#24292e",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
            };
        case "spotify":
            return {
                bg: "#121212",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#1ed760"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.809-.87 7.076-.503 9.722 1.113.294.18.386.563.207.857zm1.225-2.724c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.519-.125-.413.108-.848.52-9.73 3.632-1.102 8.147-.568 11.233 1.329.366.226.481.706.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.129-1.167-.623-.15-.495.13-1.018.624-1.168 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.28.327z"/></svg>`,
            };
        case "steam":
            return {
                bg: "#171a21",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M11.979 2C6.479 2 2 6.479 2 11.979c0 4.417 2.875 8.167 6.875 9.5l2.25-3.25c-.292-.458-.458-1-.458-1.583 0-1.625 1.333-2.958 2.958-2.958.417 0 .833.083 1.208.25l3.208-2.208c-.042-.25-.083-.458-.083-.73 0-3.167 2.583-5.75 5.75-5.75.271 0 .5.042.75.083L18.771 2.833C16.812 2.292 14.479 2 11.979 2z"/></svg>`,
            };
        case "twitch":
            return {
                bg: "#9146FF",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M4.3 2L2 6.6v13.8h5.2V22h3.5l2.3-2.3h3.5L22 14.2V2H4.3zm15.4 11.1l-2.9 2.9h-4.1l-2.3 2.3v-2.3H6.6V4.3h13.1v8.8zm-7.6-5.8h2.3v5.8h-2.3V7.3zm4.6 0h2.3v5.8h-2.3V7.3z"/></svg>`,
            };
        case "youtube":
            return {
                bg: "#282828",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
            };
        case "twitter":
            return {
                bg: "#000000",
                svg: `<svg viewBox="0 0 24 24" width="38" height="38" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
            };
        case "discord":
            return {
                bg: "#5865F2",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
            };
        case "reddit":
            return {
                bg: "#FF4500",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.612a1.24 1.24 0 0 1 1.108-.7zM9.25 12C8.56 12 8 12.56 8 13.25c0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.015a.5.5 0 0 0-.1.7.5.5 0 0 0 .7.1c.712-.513 1.637-.775 2.615-.775.979 0 1.904.262 2.616.775a.5.5 0 0 0 .7-.1.5.5 0 0 0-.1-.7c-.88-.633-1.996-.955-3.216-.955-1.22 0-2.336.322-3.215.955z"/></svg>`,
            };
        case "xbox":
            return {
                bg: "#107C10",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4.7 15.65c-1.42-1.2-2.3-3-2.3-5.02 0-1.21.32-2.34.88-3.32 1.35 1.59 3.4 4.8 4.76 7.6-1.25.32-2.43.58-3.34.74zm9.4 0c-.91-.16-2.09-.42-3.34-.74 1.36-2.8 3.41-6.01 4.76-7.6.56.98.88 2.11.88 3.32 0 2.02-.88 3.82-2.3 5.02zM12 5.08c1.69 0 3.23.63 4.42 1.67-1.88 1.93-4.42 5.42-4.42 5.42s-2.54-3.49-4.42-5.42C8.77 5.71 10.31 5.08 12 5.08z"/></svg>`,
            };
        case "playstation":
        case "playstation_network":
            return {
                bg: "#003791",
                svg: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#ffffff"><path d="M8.91 4.65c.34.4.52.88.52 1.45 0 .39-.08.73-.24 1.02-.16.29-.39.54-.69.75-.3.21-.66.37-1.08.48-.42.11-.88.16-1.38.16v3.2H4V4h2.24c.73 0 1.35.08 1.86.24.51.16.94.39 1.29.69-.16-.09-.32-.19-.48-.28zm-2.87 2.37h.78c.32 0 .58-.07.78-.21.2-.14.3-.34.3-.6 0-.25-.1-.44-.3-.57-.2-.13-.46-.19-.78-.19h-.78v1.57zm12.39 5.86c-1.35-.42-2.88-.63-4.59-.63-1.62 0-3.13.2-4.53.6-.33.09-.64.2-.93.33-.29.13-.53.28-.72.45-.19.17-.32.36-.39.57-.07.21-.07.44 0 .69.09.31.28.56.57.75.29.19.66.33 1.11.42.45.09.97.13 1.56.13.9 0 1.76-.08 2.58-.24.82-.16 1.58-.41 2.28-.75.7-.34 1.3-.77 1.8-1.29.5-.52.87-1.13 1.11-1.83.05-.15.09-.3.12-.46-.58.11-1.24.2-1.97.26z"/></svg>`,
            };
        case "domain":
            return {
                bg: "#313338",
                svg: `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
            };
        default:
            return {
                bg: "#313338",
                svg: `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#b5bac1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
            };
    }
};

export const renderConnectingHtml = (providerId: string): string => {
    const brand = instanceName();
    const friendlyName = getProviderFriendlyName(providerId);
    const providerIcon = getProviderIconSvg(providerId);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connecting your ${friendlyName} account to ${brand}</title>
    <link rel="icon" href="/favicon.svg">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #1e1f22;
            color: #f2f3f5;
            font-family: "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 480px;
            padding: 40px 24px;
            width: 100%;
        }
        .icons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 28px;
        }
        .icon-bubble {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #2b2d31;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            flex-shrink: 0;
        }
        .icon-bubble.instance-icon {
            background-color: #5865f2;
        }
        .icon-bubble.provider-icon {
            background-color: ${providerIcon.bg || "#2b2d31"};
        }
        .icon-bubble svg {
            display: block;
        }
        .icon-bubble img {
            width: 44px;
            height: 44px;
            display: block;
        }
        .plus-sign {
            font-size: 24px;
            font-weight: 500;
            color: #80848e;
        }
        .heading {
            font-size: 24px;
            font-weight: 700;
            line-height: 30px;
            color: #f2f3f5;
            margin: 0 0 16px 0;
        }
        .heading .bold {
            font-weight: 700;
        }
        .subheading {
            font-size: 15px;
            font-weight: 400;
            line-height: 20px;
            color: #949ba4;
            margin: 0;
            display: none;
        }
        .spinner-wrapper {
            margin-top: 16px;
            background: #5865f2;
            border-radius: 20px;
            width: 64px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.25);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error-message {
            color: #f23f43;
            margin-top: 20px;
            font-size: 14px;
            display: none;
        }
        .btn {
            margin-top: 20px;
            padding: 10px 24px;
            background: #5865f2;
            color: #ffffff;
            border-radius: 4px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: none;
        }
        .btn:hover {
            background: #4752c4;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icons">
            <div class="icon-bubble instance-icon">
                <img src="/favicon.svg" alt="${brand}" onerror="this.onerror=null; this.outerHTML='<svg width=\\'42\\' height=\\'42\\' viewBox=\\'0 0 24 24\\' fill=\\'#ffffff\\'><path d=\\'${INSTANCE_ICON_PATH}\\'/></svg>'" />
            </div>
            <div class="plus-sign">+</div>
            <div class="icon-bubble provider-icon">
                ${providerIcon.svg}
            </div>
        </div>

        <h1 class="heading" id="heading">Connecting your <span class="bold">${friendlyName}</span> account to <span class="bold">${brand}</span></h1>
        <p class="subheading" id="subheading">You can close this window and go back to ${brand}.</p>

        <div class="spinner-wrapper" id="spinnerWrapper">
            <div class="spinner"></div>
        </div>

        <p class="error-message" id="errorMessage"></p>
        <button class="btn" id="btnAction" onclick="window.close()">Close Window</button>
    </div>

    <script>
        async function completeOAuth() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const state = params.get("state");
            const provider = "${providerId}";

            if (!code || !state) {
                // If visited without code or state
                showError("No authorization code received. Please try linking from your account settings.");
                return;
            }

            try {
                const response = await fetch("/api/v9/connections/" + encodeURIComponent(provider) + "/callback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, state })
                });

                if (response.ok || response.status === 204) {
                    showSuccess();
                } else {
                    const data = await response.json().catch(() => ({}));
                    showError(data.message || "Failed to link account. Please try again.");
                }
            } catch (err) {
                showError("Network connection error. Please try again.");
            }
        }

        function showSuccess() {
            document.title = "Connected your ${friendlyName} account to ${brand}";
            document.getElementById("heading").innerHTML = 'Connected your <span class="bold">${friendlyName}</span> account to <span class="bold">${brand}</span>';
            document.getElementById("spinnerWrapper").style.display = "none";
            document.getElementById("subheading").style.display = "block";

            try {
                if (window.opener) {
                    window.opener.postMessage("DISCORD_OAUTH_SUCCESS", "*");
                    window.opener.postMessage({ type: "CONNECTION_AUTHORIZED", provider: "${providerId}" }, "*");
                }
            } catch (_) {}

            setTimeout(() => {
                try {
                    window.close();
                } catch (_) {}
            }, 2000);
        }

        function showError(msg) {
            document.getElementById("spinnerWrapper").style.display = "none";
            const errEl = document.getElementById("errorMessage");
            errEl.textContent = msg;
            errEl.style.display = "block";
            document.getElementById("btnAction").style.display = "inline-block";
        }

        window.addEventListener("DOMContentLoaded", completeOAuth);
    </script>
</body>
</html>`;
};

export const renderSuccessHtml = (providerId: string): string => {
    const brand = instanceName();
    const friendlyName = getProviderFriendlyName(providerId);
    const providerIcon = getProviderIconSvg(providerId);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connected your ${friendlyName} account to ${brand}</title>
    <link rel="icon" href="/favicon.svg">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #1e1f22;
            color: #f2f3f5;
            font-family: "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 480px;
            padding: 40px 24px;
            width: 100%;
        }
        .icons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 28px;
        }
        .icon-bubble {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #2b2d31;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            flex-shrink: 0;
        }
        .icon-bubble.instance-icon {
            background-color: #5865f2;
        }
        .icon-bubble.provider-icon {
            background-color: ${providerIcon.bg || "#2b2d31"};
        }
        .icon-bubble svg {
            display: block;
        }
        .icon-bubble img {
            width: 44px;
            height: 44px;
            display: block;
        }
        .plus-sign {
            font-size: 24px;
            font-weight: 500;
            color: #80848e;
        }
        .heading {
            font-size: 24px;
            font-weight: 700;
            line-height: 30px;
            color: #f2f3f5;
            margin: 0 0 12px 0;
        }
        .heading .bold {
            font-weight: 700;
        }
        .subheading {
            font-size: 15px;
            font-weight: 400;
            line-height: 20px;
            color: #949ba4;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icons">
            <div class="icon-bubble instance-icon">
                <img src="/favicon.svg" alt="${brand}" onerror="this.onerror=null; this.outerHTML='<svg width=\\'42\\' height=\\'42\\' viewBox=\\'0 0 24 24\\' fill=\\'#ffffff\\'><path d=\\'${INSTANCE_ICON_PATH}\\'/></svg>'" />
            </div>
            <div class="plus-sign">+</div>
            <div class="icon-bubble provider-icon">
                ${providerIcon.svg}
            </div>
        </div>

        <h1 class="heading">Connected your <span class="bold">${friendlyName}</span> account to <span class="bold">${brand}</span></h1>
        <p class="subheading">You can close this window and go back to ${brand}.</p>
    </div>

    <script>
        try {
            if (window.opener) {
                window.opener.postMessage("DISCORD_OAUTH_SUCCESS", "*");
                window.opener.postMessage({ type: "CONNECTION_AUTHORIZED", provider: "${providerId}" }, "*");
            }
        } catch (_) {}

        setTimeout(() => {
            try {
                window.close();
            } catch (_) {}
        }, 2000);
    </script>
</body>
</html>`;
};
