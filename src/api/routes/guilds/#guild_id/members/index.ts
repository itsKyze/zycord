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
import { HTTPError } from "lambert-server/HTTPError";
import { MoreThan } from "typeorm";
import { route } from "@spacebar/api/middlewares";
import { Member } from "@spacebar/database";
import { PublicMemberProjection, PublicUserProjection } from "@spacebar/schemas";

const router = Router({ mergeParams: true });

// TODO: send over websocket
// TODO: check for GUILD_MEMBERS intent

router.get(
    "/",
    route({
        query: {
            limit: {
                type: "number",
                description: "max number of members to return (1-1000). default 1",
            },
            after: {
                type: "string",
            },
        },
        responses: {
            200: {
                body: "PublicMemberListResponse",
            },
            403: {
                body: "APIErrorResponse",
            },
        },
    }),
    async (req: Request, res: Response) => {
        const { guild_id } = req.params as { [key: string]: string };
        const limit = Number(req.query.limit) || 1;
        if (limit > 1000 || limit < 1) throw new HTTPError("Limit must be between 1 and 1000");
        const after = typeof req.query.after === "string" && /^\d+$/.test(req.query.after) ? req.query.after : "0";

        await Member.IsInGuildOrFail(req.user_id, guild_id);

        const members = await Member.find({
            where: { guild_id, id: MoreThan(after) },
            relations: { user: true, roles: true },
            select: {
                index: true,
                ...Object.fromEntries(PublicMemberProjection.map((x) => [x, true])),
                user: Object.fromEntries(PublicUserProjection.map((x) => [x, true])),
                roles: { id: true },
            },
            take: limit,
            order: { id: "ASC" },
        });

        return res.json(
            members.map((m) => ({
                ...m.toPublicMember(),
                user: m.user.toPublicUser(),
                roles: m.roles.map((x) => x.id).filter((id) => id !== guild_id),
            })),
        );
    },
);

export default router;
