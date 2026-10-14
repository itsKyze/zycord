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

async function serveDownloadOrFallback(
    res: Response,
    candidates: { file: string; downloadName: string; contentType?: string }[],
    fallbackUrl: string,
) {
    for (const item of candidates) {
        const localPath = path.join(PAGE_FOLDER, item.file);
        try {
            await fs.access(localPath);
            res.setHeader("Content-Type", item.contentType || "application/octet-stream");
            res.setHeader("Content-Disposition", `attachment; filename="${item.downloadName}"`);
            return res.sendFile(localPath);
        } catch {
            // Try next candidate
        }
    }
    return res.redirect(fallbackUrl);
}

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
        const platform = String(req.query.platform || "").toLowerCase();
        const arch = String(req.query.arch || "x64").toLowerCase();
        const format = String(req.query.format || "").toLowerCase();

        if (platform === "osx" || platform === "macos" || platform === "mac") {
            return serveDownloadOrFallback(
                res,
                [
                    { file: "Zycord-macOS.zip", downloadName: "Zycord-macOS.zip", contentType: "application/zip" },
                    { file: "ZycordSetup.exe", downloadName: "ZycordSetup.exe" },
                ],
                "https://github.com/itsKyze/zycord/releases/latest/download/Zycord-macOS.zip",
            );
        }

        if (platform === "linux") {
            const formatMap: Record<string, { file: string; mime: string }> = {
                deb: { file: "Zycord-linux-amd64.deb", mime: "application/vnd.debian.binary-package" },
                rpm: { file: "Zycord-linux-x86_64.rpm", mime: "application/x-rpm" },
                "pkg.tar.zst": { file: "Zycord-linux-x86_64.pkg.tar.zst", mime: "application/zstd" },
                "tar.gz": { file: "Zycord-linux-x64.tar.gz", mime: "application/gzip" },
            };
            const chosen = formatMap[format] || formatMap["tar.gz"];
            return serveDownloadOrFallback(
                res,
                [
                    { file: chosen.file, downloadName: chosen.file, contentType: chosen.mime },
                    { file: "Zycord-linux-x64.tar.gz", downloadName: "Zycord-linux-x64.tar.gz", contentType: "application/gzip" },
                ],
                `https://github.com/itsKyze/zycord/releases/latest/download/${chosen.file}`,
            );
        }

        if (arch === "arm64") {
            return serveDownloadOrFallback(
                res,
                [
                    { file: "ZycordSetup-arm64.exe", downloadName: "ZycordSetup-arm64.exe" },
                    { file: "ZycordSetup.exe", downloadName: "ZycordSetup.exe" },
                ],
                "https://github.com/itsKyze/zycord/releases/latest/download/ZycordSetup.exe",
            );
        }

        return serveDownloadOrFallback(
            res,
            [
                { file: "ZycordSetup.exe", downloadName: "ZycordSetup.exe" },
                { file: "ZycordSetup-x64.exe", downloadName: "ZycordSetup-x64.exe" },
            ],
            "https://github.com/itsKyze/zycord/releases/latest/download/ZycordSetup.exe",
        );
    },
);

router.get(
    "/macos",
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (_req: Request, res: Response) => {
        return serveDownloadOrFallback(
            res,
            [{ file: "Zycord-macOS.zip", downloadName: "Zycord-macOS.zip", contentType: "application/zip" }],
            "https://github.com/itsKyze/zycord/releases/latest/download/Zycord-macOS.zip",
        );
    },
);

router.get(
    "/linux",
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (req: Request, res: Response) => {
        const format = String(req.query.format || "tar.gz").toLowerCase();
        const formatMap: Record<string, { file: string; mime: string }> = {
            deb: { file: "Zycord-linux-amd64.deb", mime: "application/vnd.debian.binary-package" },
            rpm: { file: "Zycord-linux-x86_64.rpm", mime: "application/x-rpm" },
            "pkg.tar.zst": { file: "Zycord-linux-x86_64.pkg.tar.zst", mime: "application/zstd" },
            "tar.gz": { file: "Zycord-linux-x64.tar.gz", mime: "application/gzip" },
        };
        const chosen = formatMap[format] || formatMap["tar.gz"];
        return serveDownloadOrFallback(
            res,
            [
                { file: chosen.file, downloadName: chosen.file, contentType: chosen.mime },
                { file: "Zycord-linux-x64.tar.gz", downloadName: "Zycord-linux-x64.tar.gz", contentType: "application/gzip" },
            ],
            `https://github.com/itsKyze/zycord/releases/latest/download/${chosen.file}`,
        );
    },
);

router.get(
    "/android",
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (_req: Request, res: Response) => {
        return serveDownloadOrFallback(
            res,
            [{ file: "Zycord.apk", downloadName: "Zycord.apk", contentType: "application/vnd.android.package-archive" }],
            "https://github.com/itsKyze/zycord/releases/latest/download/Zycord.apk",
        );
    },
);

async function sendIosProfile(res: Response) {
    const localPath = path.join(PAGE_FOLDER, "Zycord.mobileconfig");
    try {
        await fs.access(localPath);
    } catch {
        return res.redirect("/app");
    }
    res.setHeader("Content-Type", "application/x-apple-aspen-config");
    res.setHeader("Content-Disposition", 'inline; filename="Zycord.mobileconfig"');
    return res.sendFile(localPath);
}

router.get(
    ["/ios", "/Zycord.mobileconfig"],
    route({
        spacebarOnly: true,
        authentication: "never",
    }),
    async (_req: Request, res: Response) => sendIosProfile(res),
);

router.use(
    express.static(PAGE_FOLDER, {
        index: false,
        setHeaders: (res, filePath) => {
            res.set("Cache-Control", "no-cache");
            if (filePath.endsWith(".mobileconfig")) {
                res.set("Content-Type", "application/x-apple-aspen-config");
                res.set("Content-Disposition", 'inline; filename="Zycord.mobileconfig"');
            }
        },
    }),
);

export default router;
