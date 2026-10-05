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
import express, { Router, Response, Request } from "express";
import { route } from "@spacebar/api/middlewares";
import { PUBLIC_ASSETS_FOLDER, brandPage } from "@spacebar/util";

const router = Router({ mergeParams: true });
const PAGE_FOLDER = path.join(PUBLIC_ASSETS_FOLDER, "download");

router.get(
    "/",
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (req: Request, res: Response) => {
        try {
            const page = await fs.readFile(path.join(PAGE_FOLDER, "index.html"), "utf8");
            res.set("Cache-Control", "no-cache").type("html").send(brandPage(page));
        } catch {
            res.redirect("/");
        }
    },
);

router.get(
    "/windows",
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (req: Request, res: Response) => {
        const localInstaller = path.join(PAGE_FOLDER, "ZycordSetup.exe");
        try {
            await fs.access(localInstaller);
            return res.download(localInstaller, "ZycordSetup.exe");
        } catch {
            // Redirect to GitHub release if local file isn't uploaded yet
            res.redirect("https://github.com/itsKyze/zycord/releases/latest/download/ZycordSetup.exe");
        }
    },
);

router.get(
    ["/portable", "/windows/portable"],
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (req: Request, res: Response) => {
        const localPortable = path.join(PAGE_FOLDER, "Zycord-Portable.exe");
        try {
            await fs.access(localPortable);
            return res.download(localPortable, "Zycord-Portable.exe");
        } catch {
            res.redirect("https://github.com/itsKyze/zycord/releases/latest/download/Zycord-Portable.exe");
        }
    },
);

router.use(express.static(PAGE_FOLDER, { index: false, setHeaders: (res) => res.set("Cache-Control", "no-cache") }));

export default router;
