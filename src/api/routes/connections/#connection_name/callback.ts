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
import { ConnectionStore, emitEvent, FieldErrors, GenericConnection, renderConnectingHtml } from "@spacebar/util";
import { Request, Response, Router } from "express";
import { ConnectionCallbackSchema } from "@spacebar/schemas";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const { connection_name } = req.params as { [key: string]: string };
    let connection = ConnectionStore.connections.get(connection_name);
    if (!connection) {
        connection = new GenericConnection(connection_name);
        ConnectionStore.connections.set(connection_name, connection);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(renderConnectingHtml(connection.id));
});

router.post(
    "/",
    route({
        requestBody: "ConnectionCallbackSchema",
        authentication: "never",
    }),
    async (req: Request, res: Response) => {
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

        const body = req.body as ConnectionCallbackSchema;
        const userId = connection.getUserId(body.state);
        const connectedAccnt = await connection.handleCallback(body);

        // whether we should emit a connections update event, only used when a connection doesnt already exist
        if (connectedAccnt)
            await emitEvent({
                event: "USER_CONNECTIONS_UPDATE",
                data: { ...connectedAccnt, token_data: undefined },
                user_id: userId,
            });

        res.sendStatus(204);
    },
);

export default router;
