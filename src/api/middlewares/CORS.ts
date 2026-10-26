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

import { NextFunction, Request, Response } from "express";
import { Config } from "@spacebar/util";

export function CORS(req: Request, res: Response, next: NextFunction) {
    const origin = req.header("Origin");
    const allowed = Config.get().security?.allowedOrigins ?? [];
    const cdnPublic = Config.get().cdn?.endpointPublic;
    const isAllowed =
        !origin ||
        allowed.includes("*") ||
        allowed.includes(origin) ||
        (cdnPublic && origin === cdnPublic) ||
        (process.env.NODE_ENV !== "production" && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));

    if (origin && isAllowed) {
        res.set("Access-Control-Allow-Origin", origin);
        res.set("Access-Control-Allow-Credentials", "true");
    } else if (!origin) {
        // Non-browser or same-origin request
    } else {
        res.set("Access-Control-Allow-Origin", "null");
    }

    res.set("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers") || "*");
    res.set("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method") || "*");
    res.set("Access-Control-Max-Age", "60"); // dont make it too long so we can change it dynamically
    // TODO: use better CSP
    res.set(
        "Content-security-policy",
        "default-src *  data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval'; script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src * data: blob: 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: ; style-src * data: blob: 'unsafe-inline'; font-src * data: blob: 'unsafe-inline';",
    );

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }
    next();
}
