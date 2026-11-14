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
import { route } from "@spacebar/api/middlewares";
import { MfaInvalidCode, MfaInvalidTicket, gateNewLoginLocation, guardedMfaAttempt, readTicket, verifyMfaMethod } from "@spacebar/api/util";
import { User } from "@spacebar/database";
import { generateToken } from "@spacebar/util";

const router = Router({ mergeParams: true });

router.post("/", route({ authentication: "never", spacebarOnly: false }), async (req: Request, res: Response) => {
    const { authenticator_type } = req.params as { authenticator_type: string };
    const { code, ticket } = req.body as { code?: string; ticket?: string };
    const decoded = readTicket<{ typ: string; uid?: string; undelete?: boolean }>(ticket, "login");
    if (!decoded?.uid) throw MfaInvalidTicket();
    if (!(await guardedMfaAttempt(ticket!, () => verifyMfaMethod(decoded.uid!, authenticator_type, code, decoded)))) throw MfaInvalidCode();

    const user = await User.findOneOrFail({
        where: { id: decoded.uid },
        select: { id: true, username: true, discriminator: true, disabled: true, deleted: true, email: true, verified: true, data: true, rights: true },
        relations: { settings: true },
    });
    if (decoded.undelete && (user.disabled || user.deleted)) await User.update({ id: user.id }, { disabled: false, deleted: false });
    await gateNewLoginLocation(req, user);

    res.json({
        user_id: user.id,
        token: await generateToken(user.id),
        user_settings: { locale: user.settings?.locale, theme: user.settings?.theme },
    });
});

export default router;
