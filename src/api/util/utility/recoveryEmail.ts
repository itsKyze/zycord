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
        const subject = `[${instanceName} Security] رمز التحقق من بريد الاسترداد / Recovery Verification Code`;
        const text = `Your ${instanceName} recovery email verification code is: ${code}. It expires in 10 minutes.`;
        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #232428; color: #dbdee1; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                <h1 style="color: #ffffff; font-size: 22px; margin-top: 0;">Hey ${username},</h1>
                <p style="font-size: 15px; line-height: 22px; color: #b5bac1;">
                    You are adding this email as a <strong>Backup / Recovery Email</strong> on ${instanceName}. If you ever lose access to your primary email or forget your password, you can use this email to securely recover your account.
                </p>
                <div style="background: #111214; border: 1px solid #35363c; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
                    <div style="font-size: 13px; color: #949ba4; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Verification Code / رمز التحقق</div>
                    <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #5865f2; font-family: monospace;">${code}</div>
                </div>
                <p style="font-size: 13px; color: #949ba4; margin-bottom: 0;">
                    This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
                </p>
            </div>
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
