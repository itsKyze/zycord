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
import { Request, Response, Router } from "express";
import { ConnectionStore, FieldErrors, GenericConnection } from "@spacebar/util";

const router = Router({ mergeParams: true });

router.get("/", route({}), async (req: Request, res: Response) => {
    const { connection_name } = req.params as { [key: string]: string };
    let connection = ConnectionStore.connections.get(connection_name);
    if (!connection) {
        connection = new GenericConnection(connection_name);
        ConnectionStore.connections.set(connection_name, connection);
    }

    if (connection.settings && connection.settings.enabled === false)
        throw FieldErrors({
            provider_id: {
                message: "This connection has been disabled server-side.",
            },
        });

    if (connection.isConfigured) {
        return res.json({
            url: connection.getAuthorizationUrl(req.user_id),
        });
    }

    const state = connection.createState(req.user_id);
    return res.json({
        url: `/connections/${connection.id}/prompt?state=${state}`,
    });
});

export default router;
