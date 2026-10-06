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
import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { route } from "@spacebar/api/middlewares";
import { signTicket } from "@spacebar/api/util";
import { User } from "@spacebar/database";
import { Config, Email, FieldErrors } from "@spacebar/util";

const router = Router({ mergeParams: true });

export const hashKey = (key: string) => crypto.createHash("sha256").update(key.trim().toLowerCase()).digest("base64url");

router.post(
    "/",
    route({
        responses: {
            200: { body: "BackupCodesChallengeResponse" },
            400: { body: "APIErrorResponse" },
        },
    }),
    async (req: Request, res: Response) => {
        const { password } = req.body as { password?: string };

        const user = await User.findOneOrFail({
            where: { id: req.user_id },
            select: { id: true, username: true, email: true, data: true },
        });

        if (!password || !(await bcrypt.compare(password, user.data.hash || "")))
            throw FieldErrors({
                password: {
                    message: req.t("auth:login.INVALID_PASSWORD"),
                    code: "INVALID_PASSWORD",
                },
            });

        const key = crypto.randomBytes(4).toString("hex");
        const kh = hashKey(key);
        if (!Email.transporter || !user.email) console.log(`[Email] Skipped backup codes verification delivery for user ${user.id}: email delivery is unavailable`);
        else {
            const { instanceName } = Config.get().general;
            await Email.sendCustomMail(
                user.email,
                `Your ${instanceName} backup codes verification key`,
                `Hey ${user.username},\n\nUse this key to view or regenerate your backup codes: ${key}\n\nThis key expires in 30 minutes.`,
                `<h1>Hey ${user.username},</h1>
                <p>Use this verification key to view or regenerate your backup codes for ${instanceName}:</p>
                <div class="code-box">${key}</div>
                <p style="font-size: 13px; color: #747f8d; margin-bottom: 0;">This key will expire in 30 minutes. Keep your backup codes in a safe place.</p>`,
            );
        }

        res.json({
            nonce: signTicket({ typ: "backup_codes", uid: user.id, kh, regenerate: false, n: crypto.randomUUID() }, 1800),
            regenerate_nonce: signTicket({ typ: "backup_codes", uid: user.id, kh, regenerate: true, n: crypto.randomUUID() }, 1800),
        });
    },
);

export default router;
