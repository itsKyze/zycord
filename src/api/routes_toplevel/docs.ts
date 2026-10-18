/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

import { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { sendDocResponse } from "../util/docs-service";

const router = Router({ mergeParams: true });

router.get(
	"/",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	async (_req: Request, res: Response) => sendDocResponse(res, "intro"),
);

router.get(
	"/{*splat}",
	route({
		spacebarOnly: true,
		authentication: "never",
	}),
	async (req: Request, res: Response) => {
		const splat = (req.params as any).splat || "";
		return sendDocResponse(res, splat || "intro");
	},
);

export default router;
