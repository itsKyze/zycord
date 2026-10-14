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

import fs from "node:fs/promises";
import path from "node:path";
import express, { Router, Request, Response } from "express";
import { PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const router = Router({ mergeParams: true });
const UPDATES_FOLDER = path.join(PUBLIC_ASSETS_FOLDER, "updates");

const staticOptions = {
    index: false,
    redirect: false,
    setHeaders: (res: Response) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate");
        const requestPath = String(res.req?.path || "");
        if (requestPath.endsWith(".mobileconfig")) {
            res.set("Content-Type", "application/x-apple-aspen-config");
            res.set("Content-Disposition", 'inline; filename="Zycord.mobileconfig"');
        }
    },
};

router.get("/", async (_req: Request, res: Response) => {
    try {
        const manifest = await fs.readFile(path.join(UPDATES_FOLDER, "manifest.json"), "utf8");
        res.set("Access-Control-Allow-Origin", "*")
            .set("Cache-Control", "no-cache, no-store, must-revalidate")
            .type("json")
            .send(manifest);
    } catch {
        res.status(404).json({ error: "Updates manifest not found" });
    }
});

for (const platformName of ["windows", "android", "macos", "linux", "ios"]) {
    router.use(`/${platformName}`, express.static(path.join(UPDATES_FOLDER, platformName), staticOptions));
}

router.use(express.static(UPDATES_FOLDER, staticOptions));

export default router;
