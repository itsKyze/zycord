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

import fs from "node:fs/promises";
import path from "node:path";
import { User } from "../../../database/entities";
import { Config } from "../Config";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { JwtKeypairManager } from "../Token";
import { IEmail, IEmailAttachment, IEmailClient } from "./clients/IEmailClient";
import { SendGridEmailClient } from "./clients/SendGridEmailClient";
import { SMTPEmailClient } from "./clients/SMTPEmailClient";
import { MailGunEmailClient } from "./clients/MailGunEmailClient";
import { MailJetEmailClient } from "./clients/MailJetEmailClient";

const ASSET_FOLDER_PATH = path.join(__dirname, "..", "..", "..", "..", "assets");

export function getFromAddress(): string {
    const { instanceName } = Config.get().general;
    const rawSender = Config.get().email.senderAddress || Config.get().general.correspondenceEmail || "noreply@localhost";
    if (rawSender.includes("<") && rawSender.includes(">")) {
        return rawSender;
    }
    const name = instanceName || "Zycord";
    return `"${name}" <${rawSender}>`;
}

export enum MailTypes {
    verifyEmail = "verifyEmail",
    resetPassword = "resetPassword",
    changePassword = "changePassword",
    newLoginLocation = "newLoginLocation",
}

export const Email: {
    transporter: IEmailClient | null;
    init: () => Promise<void>;
    generateLink: (type: Omit<MailTypes, "changePassword">, id: string, extra?: { ip?: string; device?: string; label?: string }) => Promise<string>;
    sendMail: (type: MailTypes, user: User, email: string) => Promise<void>;
    sendVerifyEmail: (user: User, email: string) => Promise<void>;
    sendResetPassword: (user: User, email: string) => Promise<void>;
    sendPasswordChanged: (user: User, email: string) => Promise<void>;
    sendNewLoginLocation: (
        user: User,
        email: string,
        ipInfo?: {
            ip: string;
            city: string;
            region: string;
            country_name: string;
            device?: string;
            deviceKey?: string;
        },
    ) => Promise<boolean>;
    doReplacements: (
        template: string,
        user: User,
        actionUrl?: string,
        ipInfo?: {
            ip: string;
            city: string;
            region: string;
            country_name: string;
            device?: string;
        },
        logoUrl?: string,
    ) => string;
    getLogoAttachment: () => Promise<IEmailAttachment[] | undefined>;
    renderHtml: (title: string, contentHtml: string, logoUrl?: string) => string;
    sendCustomMail: (to: string, subject: string, text: string, contentHtml: string) => Promise<void>;
} = {
    transporter: null,
    init: async function () {
        const { provider } = Config.get().email;
        if (!provider) return;

        switch (provider) {
            case "smtp":
                this.transporter = new SMTPEmailClient();
                break;
            case "sendgrid":
                this.transporter = new SendGridEmailClient();
                break;
            case "mailgun":
                this.transporter = new MailGunEmailClient();
                break;
            case "mailjet":
                this.transporter = new MailJetEmailClient();
                break;
            default:
                console.error(`[Email] Invalid provider: ${provider}`);
                return;
        }

        if (!this.transporter) return console.error(`[Email] Invalid provider: ${provider}`);
        console.log(`[Email] Initializing ${provider} transport...`);
        await this.transporter.init();
        console.log(`[Email] ${provider} transport initialized.`);
    },

    /**
     * Replaces all placeholders in an email template with the correct values
     */
    doReplacements: function (
        template,
        user,
        actionUrl?,
        ipInfo?: {
            ip: string;
            city: string;
            region: string;
            country_name: string;
            device?: string;
        },
        logoUrl?: string,
    ) {
        const { instanceName, frontPage, serverName } = Config.get().general;
        const endpoint = Config.get().api.endpointPublic;
        const origin = [frontPage, serverName, endpoint].map((x) => (x && /^https?:\/\//.test(x) ? new URL(x).origin : null)).find(Boolean) ?? "https://app.zyron.site";
        const finalLogoUrl = logoUrl || `${origin}/static/zycord_logo.png`;

        const replacements = [
            ["{instanceName}", instanceName],
            ["{logoUrl}", finalLogoUrl],
            ["{userUsername}", user.username],
            ["{userDiscriminator}", user.discriminator],
            ["{userId}", user.id],
            ["{phoneNumber}", user.phone?.slice(-4)],
            ["{userEmail}", user.email],
            ["{actionUrl}", actionUrl],
            ["{ipAddress}", ipInfo?.ip],
            ["{locationCity}", ipInfo?.city],
            ["{locationRegion}", ipInfo?.region],
            ["{locationCountryName}", ipInfo?.country_name],
            ["{deviceName}", ipInfo && "device" in ipInfo ? ipInfo.device : undefined],
        ];

        // loop through all replacements and replace them in the template
        for (const [key, value] of Object.values(replacements)) {
            if (!value) continue;
            template = template.replaceAll(key as string, value);
        }

        return template;
    },

    /**
     * Generates a password reset link
     * @param type the MailType to generate a link for
     * @param id user id
     */
    generateLink: async function (type, id, extra) {
        const user = await User.findOne({ where: { id }, select: { id: true, email: true, data: true } });
        const reset = type === MailTypes.resetPassword;
        const isLogin = type === MailTypes.newLoginLocation;
        const token = jwt.sign(
            {
                typ: reset ? "password_reset" : isLogin ? "login_verify" : "email_verify",
                uid: id,
                email: user?.email,
                ip: extra?.ip,
                device: extra?.device,
                label: extra?.label,
                ph: crypto
                    .createHash("sha256")
                    .update(user?.data?.hash ?? "")
                    .digest("base64url")
                    .slice(0, 16),
            },
            JwtKeypairManager.keypair.privateKey,
            { algorithm: "ES512", expiresIn: reset ? "1h" : isLogin ? "1h" : "24h" },
        );
        const { frontPage, serverName } = Config.get().general;
        const endpoint = Config.get().api.endpointPublic;
        const origin = [frontPage, serverName, endpoint].map((x) => (x && /^https?:\/\//.test(x) ? new URL(x).origin : null)).find(Boolean) ?? "https://app.zyron.site";
        if (reset) return `${origin}/reset#token=${token}`;
        if (isLogin) return `${origin}/verify?type=login#token=${token}`;
        return `${origin}/verify#token=${token}`;
    },

    /**
     *
     * @param type the MailType to send
     * @param user the user to address it to
     * @param email the email to send it to
     * @returns
     */
    sendMail: async function (type, user, email) {
        if (!this.transporter) {
            console.log(`[Email] Skipped ${type} delivery for user ${user.id}: no email provider configured`);
            return;
        }

        const htmlTemplateNames: { [key in MailTypes]: string } = {
            verifyEmail: "verify_email.html",
            resetPassword: "password_reset_request.html",
            changePassword: "password_changed.html",
            newLoginLocation: "new_login_location.html",
        };

        const textTemplateNames: { [key in MailTypes]: string } = {
            verifyEmail: "verify_email.txt",
            resetPassword: "password_reset_request.txt",
            changePassword: "password_changed.txt",
            newLoginLocation: "new_login_location.txt",
        };

        const htmlTemplate = await fs.readFile(path.join(ASSET_FOLDER_PATH, "email_templates", htmlTemplateNames[type]), { encoding: "utf-8" });

        const textTemplate = await fs.readFile(path.join(ASSET_FOLDER_PATH, "email_templates", textTemplateNames[type]), { encoding: "utf-8" });

        const { frontPage, serverName } = Config.get().general;
        const endpoint = Config.get().api.endpointPublic;
        const origin = [frontPage, serverName, endpoint].map((x) => (x && /^https?:\/\//.test(x) ? new URL(x).origin : null)).find(Boolean) ?? "https://app.zyron.site";
        const logoUrl = `${origin}/static/zycord_logo.png`;

        // replace email template placeholders
        const html = this.doReplacements(
            htmlTemplate,
            user,
            // password change emails don't have links
            type != MailTypes.changePassword ? await this.generateLink(type, user.id) : undefined,
            undefined,
            logoUrl,
        );

        const text = this.doReplacements(
            textTemplate,
            user,
            // password change emails don't have links
            type != MailTypes.changePassword ? await this.generateLink(type, user.id) : undefined,
        );

        // extract the title from the email template to use as the email subject
        const subject = html.match(/<title>(.*)<\/title>/)?.[1] || "";

        const message: IEmail = {
            from: getFromAddress(),
            to: email,
            subject,
            text,
            html,
        };

        return this.transporter.sendMail(message);
    },

    /**
     * Sends an email to the user with a link to verify their email address
     */
    sendVerifyEmail: async function (user, email) {
        return this.sendMail(MailTypes.verifyEmail, user, email);
    },

    /**
     * Sends an email to the user with a link to reset their password
     */
    sendResetPassword: async function (user, email) {
        return this.sendMail(MailTypes.resetPassword, user, email);
    },

    /**
     * Sends an email to the user notifying them that their password has been changed
     */
    sendPasswordChanged: async function (user, email) {
        return this.sendMail(MailTypes.changePassword, user, email);
    },

    /**
     * Sends an email to the user notifying them of a new login location with a link to authorize
     */
    sendNewLoginLocation: async function (user, email, ipInfo) {
        if (!this.transporter) {
            console.log(`[Email] Skipped newLoginLocation delivery for user ${user.id}: no email provider configured`);
            return false;
        }

        const htmlTemplate = await fs.readFile(path.join(ASSET_FOLDER_PATH, "email_templates", "new_login_location.html"), { encoding: "utf-8" });
        const textTemplate = await fs.readFile(path.join(ASSET_FOLDER_PATH, "email_templates", "new_login_location.txt"), { encoding: "utf-8" });

        const { frontPage, serverName } = Config.get().general;
        const endpoint = Config.get().api.endpointPublic;
        const origin = [frontPage, serverName, endpoint].map((x) => (x && /^https?:\/\//.test(x) ? new URL(x).origin : null)).find(Boolean) ?? "https://app.zyron.site";
        const logoUrl = `${origin}/static/zycord_logo.png`;

        const actionUrl = await this.generateLink(MailTypes.newLoginLocation, user.id, { ip: ipInfo?.ip, device: ipInfo?.deviceKey, label: ipInfo?.device });

        const html = this.doReplacements(htmlTemplate, user, actionUrl, ipInfo, logoUrl);
        const text = this.doReplacements(textTemplate, user, actionUrl, ipInfo);

        const subject = html.match(/<title>(.*)<\/title>/)?.[1] || "New Login Location";

        const message: IEmail = {
            from: getFromAddress(),
            to: email,
            subject,
            text,
            html,
        };

        await this.transporter.sendMail(message);
        return true;
    },

    /**
     * Returns inline logo attachment if logo exists on disk
     */
    getLogoAttachment: async function () {
        const logoPath = path.join(ASSET_FOLDER_PATH, "logo.png");
        const hasLogo = await fs
            .access(logoPath)
            .then(() => true)
            .catch(() => false);
        return hasLogo
            ? [
                  {
                      filename: "logo.png",
                      path: logoPath,
                      cid: "zycord_logo",
                      contentType: "image/png",
                  },
              ]
            : undefined;
    },

    /**
     * Wraps HTML content into Zycord official email template with brand logo
     */
    renderHtml: function (title: string, contentHtml: string, logoUrl?: string) {
        const { instanceName, frontPage, serverName } = Config.get().general;
        const endpoint = Config.get().api.endpointPublic;
        const origin = [frontPage, serverName, endpoint].map((x) => (x && /^https?:\/\//.test(x) ? new URL(x).origin : null)).find(Boolean) ?? "https://app.zyron.site";
        const finalLogoUrl = logoUrl || `${origin}/static/zycord_logo.png`;

        return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${title}</title>
        <style>
            body { margin: 0; padding: 0; background-color: #f2f3f5; font-family: 'gg sans', 'Noto Sans', Helvetica, Arial, sans-serif; color: #2e3338; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header-logo { text-align: center; margin-bottom: 32px; }
            .header-logo img { height: 36px; width: auto; display: inline-block; }
            .card { background-color: #ffffff; border-radius: 8px; padding: 40px 48px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); }
            h1 { font-size: 20px; font-weight: 700; line-height: 24px; color: #2e3338; margin: 0 0 16px; }
            p { font-size: 15px; line-height: 22px; color: #4f545c; margin: 0 0 20px; }
            .code-box { background-color: #f2f3f5; border-radius: 6px; padding: 16px 20px; margin: 24px 0; text-align: center; font-size: 26px; font-weight: 700; letter-spacing: 4px; color: #5865f2; }
            .btn-container { text-align: center; padding: 20px 0 28px; }
            .btn { background-color: #5865f2; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 3px; display: inline-block; }
            hr { border: none; border-top: 1px solid #e3e5e8; margin: 24px 0; }
            .footer-text { font-size: 12px; line-height: 18px; color: #747f8d; text-align: center; margin-top: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header-logo">
                <img src="${finalLogoUrl}" alt="${instanceName}" />
            </div>
            <div class="card">
                ${contentHtml}
            </div>
            <p class="footer-text">
                Sent by ${instanceName} &bull; Security Notification
            </p>
        </div>
    </body>
</html>`;
    },

    /**
     * Sends custom email with official Zycord styling and brand logo
     */
    sendCustomMail: async function (to: string, subject: string, text: string, contentHtml: string) {
        if (!this.transporter) return;
        const html = this.renderHtml(subject, contentHtml);
        return this.transporter.sendMail({
            from: getFromAddress(),
            to,
            subject,
            text,
            html,
        });
    },
};
