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

    const host = req.get("host") || "";
    const parts = host.split(":")[0].split(".");
    const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : null;

    let isTrustedOrigin = false;
    if (origin) {
        try {
            const parsed = new URL(origin);
            const originParts = parsed.hostname.split(".");
            const originRoot = originParts.length >= 2 ? originParts.slice(-2).join(".") : null;
            if (rootDomain && originRoot === rootDomain) {
                isTrustedOrigin = true;
            }
        } catch {}
    }

    const isAllowed =
        !origin ||
        isTrustedOrigin ||
        allowed.includes(origin) ||
        (cdnPublic && origin === cdnPublic) ||
        (process.env.NODE_ENV !== "production" && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));

    if (origin && isAllowed) {
        res.set("Access-Control-Allow-Origin", origin);
        res.set("Access-Control-Allow-Credentials", "true");
    } else if (origin && allowed.includes("*")) {
        // Wildcard allowed for public/non-credentialed access, but NEVER with credentials
        res.set("Access-Control-Allow-Origin", "*");
    } else if (!origin) {
        // Non-browser or same-origin request
    } else {
        res.set("Access-Control-Allow-Origin", "null");
    }

    res.set("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers") || "*");
    res.set("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method") || "*");
    res.set("Access-Control-Max-Age", "60");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-XSS-Protection", "0");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
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
