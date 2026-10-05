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

import { route } from "@spacebar/api/middlewares";
import { HarvestStatus, ResponseError, createHarvest, getHarvest } from "@spacebar/api/util";
import { Request, Response, Router } from "express";

const router = Router({ mergeParams: true });

router.get("/", route({ responses: { 200: {}, 204: {} } }), async (req: Request, res: Response) => {
    const harvest = await getHarvest(req.user_id);
    if (!harvest) return res.sendStatus(204);
    res.json(harvest);
});

router.post("/", route({ responses: { 200: {}, 400: { body: "APIErrorResponse" } } }), async (req: Request, res: Response) => {
    const previous = await getHarvest(req.user_id);
    if (previous && [HarvestStatus.QUEUED, HarvestStatus.RUNNING].includes(previous.status as HarvestStatus))
        throw new ResponseError(400, { message: "You already have a pending data package request.", code: 0 });
    res.json(await createHarvest(req.user_id, (req.body as { backends?: unknown })?.backends));
});

export default router;
