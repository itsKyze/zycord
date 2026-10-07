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

const router = Router({ mergeParams: true });

// Look up a gift code — used by Gift Inventory "Redeem a Code" flow
router.get("/:code", route({}), (req: Request, res: Response) => {
    // On a self-hosted instance there are no real gift codes.
    // Return a Discord-compatible "Unknown Gift Code" error so the client
    // shows a proper "invalid code" message instead of crashing.
    res.status(404).json({ code: 10038, message: "Unknown Gift Code" });
});

// Attempt to redeem a gift code
router.post("/:code/redeem", route({}), (req: Request, res: Response) => {
    res.status(404).json({ code: 10038, message: "Unknown Gift Code" });
});

export default router;
