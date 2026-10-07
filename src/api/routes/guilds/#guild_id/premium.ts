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

import { Router, Request, Response } from "express";
import { route } from "@spacebar/api/middlewares";
import { Snowflake } from "@spacebar/util";
const router = Router({ mergeParams: true });

router.get("/subscriptions", route({}), (req: Request, res: Response) => {
    res.json([]);
});

// Apply boost slots to this guild
router.put("/subscriptions", route({}), (req: Request, res: Response) => {
    const { guild_id } = req.params as { guild_id: string };
    const { subscription_slot_ids } = req.body as { subscription_slot_ids?: string[] };
    const slots = (subscription_slot_ids ?? []).map((slotId: string) => ({
        id: slotId,
        user_id: req.user_id,
        guild_id,
        ended: false,
    }));
    res.json(slots);
});

// Remove a boost from this guild
router.delete("/subscriptions/:subscription_id", route({}), (req: Request, res: Response) => {
    res.status(204).send();
});

export default router;
