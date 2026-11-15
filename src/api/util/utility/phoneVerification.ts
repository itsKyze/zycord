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

import crypto from "node:crypto";
import { FieldErrors } from "@spacebar/util";
import { readTicket, signTicket } from "./mfa";

const TTL = 10 * 60 * 1000;
const codes = new Map<string, { code: string; user_id?: string; expires: number; attempts: number }>();

export const PhoneVerification = {
    normalize(phone: unknown) {
        const normalized = typeof phone === "string" ? phone.replace(/[\s().-]/g, "") : "";
        if (!/^\+[1-9]\d{6,14}$/.test(normalized)) throw FieldErrors({ phone: { code: "PHONE_NUMBER_INVALID", message: "Invalid phone number" } });
        return normalized;
    },

    async send(phone: string, user_id?: string) {
        const now = Date.now();
        for (const [key, entry] of codes) if (entry.expires < now) codes.delete(key);
        const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
        codes.set(phone, { code, user_id, expires: now + TTL, attempts: 0 });
        console.log(`[SMS] verification code for ${phone}${user_id ? ` (user ${user_id})` : ""} is ${code}`);

        const smsMessage = `[Zycord] رمز التحقق: ${code}\nYour verification code is: ${code}`;

        // 1. TextBee SMS Gateway (Android SIM card)
        const textbeeApiKey = process.env.TEXTBEE_API_KEY;
        if (textbeeApiKey) {
            try {
                const deviceId = process.env.TEXTBEE_DEVICE_ID;
                const body: Record<string, unknown> = {
                    recipients: [phone],
                    message: smsMessage,
                };

                const url = deviceId
                    ? `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`
                    : "https://api.textbee.dev/api/v1/gateway/send-sms";

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "x-api-key": textbeeApiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                if (!res.ok) {
                    const err = await res.text();
                    console.error("[SMS/TextBee] failed to send SMS:", res.status, err);
                } else {
                    console.log(`[SMS/TextBee] successfully dispatched SMS to ${phone}`);
                }
            } catch (e) {
                console.error("[SMS/TextBee] error dispatching SMS:", e);
            }
        }

        // 2. Twilio SMS Integration
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioFrom = process.env.TWILIO_FROM;
        if (twilioSid && twilioToken && twilioFrom) {
            try {
                const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
                await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        To: phone,
                        From: twilioFrom,
                        Body: smsMessage,
                    }),
                });
            } catch (e) {
                console.error("[SMS/Twilio] error:", e);
            }
        }
    },

    verify(phone: string, code: unknown, user_id?: string) {
        const entry = codes.get(phone);
        if (!entry || entry.expires < Date.now() || (entry.user_id && user_id && entry.user_id !== user_id)) return undefined;
        if (typeof code !== "string" || entry.code !== code.replace(/\s/g, "")) {
            if (++entry.attempts >= 5) codes.delete(phone);
            return undefined;
        }
        codes.delete(phone);
        return signTicket({ typ: "phone", uid: entry.user_id ?? user_id, phone }, TTL / 1000);
    },

    readToken(token: unknown, user_id: string) {
        const decoded = readTicket<{ typ: string; uid?: string; phone?: string }>(token, "phone");
        if (!decoded?.phone || (decoded.uid && decoded.uid !== user_id)) return undefined;
        return decoded.phone;
    },
};
