/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

import crypto from "node:crypto";
import { Config, Email } from "@spacebar/util";

const TTL = 10 * 60 * 1000;
const codes = new Map<string, { email: string; code: string; expires: number; attempts: number }>();

export const RecoveryEmail = {
    async sendVerification(userId: string, username: string, recoveryEmail: string): Promise<boolean> {
        const normalized = recoveryEmail.trim().toLowerCase();
        const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
        codes.set(userId, { email: normalized, code, expires: Date.now() + TTL, attempts: 0 });

        if (!Email.transporter) {
            console.log(`[RecoveryEmail] Email transporter unavailable, code for ${userId} (${normalized}) is ${code}`);
            return true;
        }

        const instanceName = Config.get().general.instanceName || "Zycord";
        const subject = `Your verification code is ${code}`;
        const text = `Your ${instanceName} recovery email verification code is: ${code}. It expires in 10 minutes.`;
        const html = `
            <h1>Hey ${username},</h1>
            <p>
                You are adding this email address as a <strong>Backup / Recovery Email</strong> on ${instanceName}. If you ever lose access to your primary email or forget your password, you can use this email to securely recover your account.
            </p>
            <p style="margin-bottom: 8px;">Here is your 6-digit verification code:</p>
            <div class="code-box">${code}</div>
            <p style="font-size: 13px; color: #747f8d; margin-bottom: 0;">
                This code will expire in 10 minutes. If you did not make this request, you can safely ignore this email.
            </p>
        `;

        try {
            await Email.sendCustomMail(normalized, subject, text, html);
            console.log(`[RecoveryEmail] Dispatched recovery verification code to ${normalized} for user ${userId}`);
            return true;
        } catch (err) {
            console.error(`[RecoveryEmail] Failed to send verification email to ${normalized}:`, err);
            return false;
        }
    },

    verify(userId: string, email: string, code: string): boolean {
        const entry = codes.get(userId);
        if (!entry || entry.expires < Date.now()) return false;
        if (entry.email !== email.trim().toLowerCase()) return false;
        if (entry.code !== code.trim().replace(/\s/g, "")) {
            if (++entry.attempts >= 5) codes.delete(userId);
            return false;
        }
        codes.delete(userId);
        return true;
    },

    redact(email: string): string {
        const [local, domain] = email.split("@");
        if (!domain) return "***";
        const masked = local.length <= 2 ? `${local[0]}*` : `${local[0]}${"*".repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}`;
        return `${masked}@${domain}`;
    },
};
