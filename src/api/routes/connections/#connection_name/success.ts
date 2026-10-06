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
import { ConnectionStore, GenericConnection, renderSuccessHtml } from "@spacebar/util";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const { connection_name } = req.params as { [key: string]: string };
    let connection = ConnectionStore.connections.get(connection_name);
    if (!connection) {
        connection = new GenericConnection(connection_name);
        ConnectionStore.connections.set(connection_name, connection);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(renderSuccessHtml(connection.id));
});

export default router;
