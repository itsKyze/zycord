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

import { Config } from "@spacebar/util";
import { CaptchaRequiredResponse } from "@spacebar/schemas";
import { Request } from "express";

export interface CaptchaVerifyResult {
    success: boolean;
    "error-codes"?: string[];
}

const verifyEndpoints = {
    hcaptcha: "https://hcaptcha.com/siteverify",
    recaptcha: "https://www.google.com/recaptcha/api/siteverify",
};

export function captchaEnabled() {
    const { enabled, service, capMode, sitekey, secret, instance } = Config.get().security.captcha;
    if (!enabled || !service) return false;
    if (service === "cap" && capMode !== "standalone") return true;
    if (!sitekey || !secret) return false;
    if (service !== "cap" && !Config.get().externalRequests.thirdParty) return false;
    return service !== "cap" || !!instance;
}

export function capEndpoint() {
    const { service, capMode, sitekey, instance } = Config.get().security.captcha;
    if (service !== "cap") return null;
    if (capMode !== "standalone") return "/api/v9/auth/cap/";
    if (!sitekey || !instance) return null;
    return `${instance.replace(/\/+$/, "")}/${encodeURIComponent(sitekey!)}/`;
}

const verifyCap = async (response: string, secret: string): Promise<CaptchaVerifyResult> => {
    const res = await fetch(`${capEndpoint()}siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response }),
        signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
    if (!res) return { success: false, "error-codes": ["captcha-unreachable"] };
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; "error-codes"?: string[] };
    if (res.ok && body.success === true) return { success: true };
    return { success: false, "error-codes": body["error-codes"] ?? [body.error ?? "invalid-input-response"] };
};

function isLocalOrPrivateIp(ip: string): boolean {
    const clean = ip.replace(/^::ffff:/, "");
    if (clean === "127.0.0.1" || clean === "::1" || clean === "localhost") return true;
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(clean)) return true;
    if (/^(fc00|fe80)/i.test(clean)) return true;
    return false;
}

export async function verifyCaptcha(response: string, ip?: string): Promise<CaptchaVerifyResult> {
    const { service, secret, sitekey } = Config.get().security.captcha;

    if (!captchaEnabled() || !service) throw new Error("CAPTCHA is not configured correctly. https://app.zyron.site/developers/docs");

    if (service === "cap") {
        if (Config.get().security.captcha.capMode !== "standalone") {
            const { consumeRegistrationToken } = await import("./localCap.js");
            return { success: await consumeRegistrationToken(response) };
        }
        return verifyCap(response, secret!);
    }

    try {
        console.log(`[CAPTCHA] Verifying ${service} token (length: ${response?.length}, prefix: ${response?.slice(0, 10)}...)`);
        const bodyParams = new URLSearchParams({
            response,
            secret: secret!,
            sitekey: sitekey!,
        });

        if (ip && !isLocalOrPrivateIp(ip)) {
            bodyParams.append("remoteip", ip);
        }

        const res = await fetch(verifyEndpoints[service], {
            method: "POST",
            signal: AbortSignal.timeout(10_000),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: bodyParams.toString(),
        });

        const body = (await res.json().catch(() => ({}))) as CaptchaVerifyResult;
        console.log(`[CAPTCHA] ${service} siteverify response:`, JSON.stringify(body));
        if (body.success === true) return { success: true };
        return { success: false, "error-codes": body["error-codes"] ?? ["invalid-input-response"] };
    } catch (err) {
        console.error(`[CAPTCHA] Error contacting ${service} siteverify:`, err);
        return { success: false, "error-codes": ["captcha-unreachable"] };
    }
}

export function extractCaptchaToken(req: Request): string | string[] | undefined {
    const fromHeaders = req.get("x-captcha-key") || req.get("x-captcha-response") || req.get("x-hcaptcha-response") || req.get("h-captcha-response");
    if (fromHeaders) return fromHeaders;
    const body = req.body as Record<string, unknown> | undefined;
    if (body) {
        if (body.captcha_key) return body.captcha_key as string | string[];
        if (body["h-captcha-response"]) return body["h-captcha-response"] as string;
        if (body["g-recaptcha-response"]) return body["g-recaptcha-response"] as string;
    }
    return undefined;
}

export async function checkCaptcha(required: boolean, response: string | string[] | null | undefined, ip?: string): Promise<CaptchaRequiredResponse | null> {
    if (!required || !captchaEnabled()) return null;
    const { sitekey, service } = Config.get().security.captcha;
    const challenge = (codes: string[]) => ({
        captcha_key: codes,
        captcha_sitekey: service === "cap" && Config.get().security.captcha.capMode !== "standalone" ? "zycord" : sitekey!,
        captcha_service: service!,
    });
    // Discord native client sends captcha_key as an array ["token"] or string, normalize to string
    let token = Array.isArray(response) ? response[0] : response;
    if (typeof token === "string") {
        token = token.trim();
        if (token.startsWith("[") && token.endsWith("]")) {
            try {
                const parsed = JSON.parse(token);
                if (Array.isArray(parsed) && parsed.length > 0) token = parsed[0];
            } catch {}
        }
    }
    if (!token) {
        console.log(`[CAPTCHA] No token provided in header or body, returning challenge`);
        return challenge(["captcha-required"]);
    }
    const verify = await verifyCaptcha(token, ip);
    if (!verify.success) {
        console.warn(`[CAPTCHA] Verification failed:`, verify["error-codes"]);
    }
    return verify.success ? null : challenge(verify["error-codes"] ?? ["invalid-input-response"]);
}

export function registrationCapEndpoint() {
    const captcha = Config.get().security.captcha;
    if (captcha.capMode !== "standalone") return "/api/v9/auth/cap/";
    if (captcha.service !== "cap" || !captcha.instance || !captcha.sitekey || !captcha.secret)
        throw new Error("Cap Standalone needs its server URL, site key and secret before signup can verify accounts");
    return capEndpoint()!;
}

export async function checkRegistrationCaptcha(response: string | string[] | null | undefined, consume = true, ip?: string): Promise<CaptchaRequiredResponse | null> {
    if (!Config.get().register.requireCaptcha) return null;
    const { security } = Config.get();
    // Discord native client sends captcha_key as an array ["token"] or string, normalize to string
    let normalized = Array.isArray(response) ? response[0] : response;
    if (typeof normalized === "string") {
        normalized = normalized.trim();
        if (normalized.startsWith("[") && normalized.endsWith("]")) {
            try {
                const parsed = JSON.parse(normalized);
                if (Array.isArray(parsed) && parsed.length > 0) normalized = parsed[0];
            } catch {}
        }
    }
    if (security.captcha.enabled && (security.captcha.service === "hcaptcha" || security.captcha.service === "recaptcha")) {
        return checkCaptcha(true, normalized, ip);
    }
    const endpoint = registrationCapEndpoint();
    const local = endpoint === "/api/v9/auth/cap/";
    const sitekey = local ? "zycord" : Config.get().security.captcha.sitekey!;
    const challenge = (codes: string[]): CaptchaRequiredResponse => ({ captcha_key: codes, captcha_sitekey: sitekey, captcha_service: "cap" });
    if (!normalized || typeof normalized !== "string" || normalized.length > 512) return challenge(["captcha-required"]);
    if (local) {
        const { consumeRegistrationToken, registrationTokenAvailable } = await import("./localCap.js");
        return (await (consume ? consumeRegistrationToken(normalized) : registrationTokenAvailable(normalized))) ? null : challenge(["invalid-input-response"]);
    }
    const verified = await verifyCap(normalized, Config.get().security.captcha.secret!);
    return verified.success ? null : challenge(verified["error-codes"] ?? ["invalid-input-response"]);
}
