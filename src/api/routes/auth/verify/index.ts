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

import { Request, Response, Router } from "express";
import { authorizeLoginDevice, emitUserUpdate, readTicket } from "@spacebar/api/util";
import { route } from "@spacebar/api/middlewares";
import { User } from "@spacebar/database";
import { FieldErrors, generateToken } from "@spacebar/util";

const router = Router({ mergeParams: true });

router.post(
    "/",
    route({
        responses: {
            200: {
                body: "TokenResponse",
            },
            400: {
                body: "APIErrorOrCaptchaResponse",
            },
        },
        authentication: "optional",
    }),
    async (req: Request, res: Response) => {
        const { token } = req.body as { token?: string };

        const invalid = () =>
            FieldErrors({
                token: {
                    message: req.t("auth:password_reset.INVALID_TOKEN"),
                    code: "INVALID_TOKEN",
                },
            });

        const decoded =
            readTicket<{ typ: string; uid?: string; email?: string; ip?: string; device?: string; label?: string }>(token, "email_verify") ??
            readTicket<{ typ: string; uid?: string; email?: string; ip?: string; device?: string; label?: string }>(token, "login_verify");
        if (!decoded?.uid) throw invalid();

        const user = await User.findOne({ where: { id: decoded.uid }, select: { id: true, email: true, verified: true, disabled: true, deleted: true } });
        if (!user || user.disabled || user.deleted || !user.email || user.email !== decoded.email) throw invalid();

        if (decoded.typ === "email_verify") {
            if (user.verified) {
                throw FieldErrors({
                    token: {
                        message: "Email verification link has expired.",
                        code: "TOKEN_EXPIRED",
                    },
                });
            }
            await User.update({ id: user.id }, { verified: true });
            await emitUserUpdate(user.id);
        } else if (!user.verified) {
            await User.update({ id: user.id }, { verified: true });
            await emitUserUpdate(user.id);
        }

        if (decoded.typ === "login_verify") {
            await authorizeLoginDevice(user.id, req, decoded);
            return res.json({ user_id: user.id, token: null, verified: true });
        }

        res.json({
            user_id: user.id,
            token: req.user_id === user.id && req.headers.authorization ? req.headers.authorization : await generateToken(user.id),
        });
    },
);

export default router;
