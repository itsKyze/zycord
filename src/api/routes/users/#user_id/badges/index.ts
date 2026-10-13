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
import { buildUserBadgeDirectory } from "@spacebar/api/util";
import { User } from "@spacebar/database";

const router = Router({ mergeParams: true });

router.get("/", route({ responses: { 200: {} } }), async (req: Request, res: Response) => {
	let { user_id } = req.params as { user_id: string };
	if (user_id === "@me") user_id = req.user_id;

	const { guild_id } = req.query as { guild_id?: string };

	const targetUser = await User.findOneOrFail({
		where: { id: user_id },
	});

	const badges = await buildUserBadgeDirectory(targetUser, guild_id);

	return res.json({ badges });
});

export default router;
