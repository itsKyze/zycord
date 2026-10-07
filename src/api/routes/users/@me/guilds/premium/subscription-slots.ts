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

import { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { Snowflake } from "@spacebar/util";

const router = Router({ mergeParams: true });

// Return 2 available boost slots so the Server Boost UI renders correctly.
// Each slot with cooldown_ends_at:null and premium_guild_subscription:null means
// it is available and not currently applied to any guild.
router.get("/", route({}), (req: Request, res: Response) => {
    const userId = req.user_id;
    const slots = [0, 1].map((i) => ({
        id: Snowflake.generate(),
        subscription_id: Snowflake.generate(),
        premium_guild_subscription: null,
        cooldown_ends_at: null,
        canceled: false,
        user_id: userId,
    }));
    res.json(slots);
});

export default router;
