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

import { Request, Response } from "express";

export function setSessionCookie(res: Response, req: Request, token?: string) {
    if (!token || typeof token !== "string") return;
    try {
        const rawHost = (req.get("x-forwarded-host") || req.get("host") || "").split(":")[0];
        const parts = rawHost.split(".");
        const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : null;
        if (rootDomain && rootDomain.includes(".")) {
            res.cookie("zycord_token", token, {
                domain: `.${rootDomain}`,
                path: "/",
                secure: req.secure || req.headers["x-forwarded-proto"] === "https",
                sameSite: "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
        }
    } catch {}
}
