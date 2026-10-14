import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "platform", "desktop", "dist");
const unpacked = path.join(dist, "linux-unpacked");
const asar = path.join(dist, "win-unpacked", "resources", "app.asar");

function arMember(name, data) {
    const header = Buffer.alloc(60, 0x20);
    header.write(name, 0, Math.min(name.length, 16), "ascii");
    header.write(String(Math.floor(Date.now() / 1000)), 16, 12, "ascii");
    header.write("0", 28, 6, "ascii");
    header.write("0", 34, 6, "ascii");
    header.write("100644", 40, 8, "ascii");
    header.write(String(data.length), 48, 10, "ascii");
    header.write("`\n", 58, 2, "ascii");
    const pad = data.length % 2 === 1 ? Buffer.from("\n") : Buffer.alloc(0);
    return Buffer.concat([header, data, pad]);
}

function buildDeb() {
    const stage = fs.mkdtempSync(path.join(os.tmpdir(), "zycord-deb-"));
    const dataRoot = path.join(stage, "data");
    const controlRoot = path.join(stage, "control");
    fs.mkdirSync(path.join(dataRoot, "opt"), { recursive: true });
    fs.symlinkSync(unpacked, path.join(dataRoot, "opt", "Zycord"), "junction");
    fs.mkdirSync(path.join(dataRoot, "usr", "share", "applications"), { recursive: true });
    fs.mkdirSync(path.join(dataRoot, "usr", "share", "icons", "hicolor", "512x512", "apps"), { recursive: true });
    fs.copyFileSync(path.join(root, "platform", "linux", "zycord.desktop"), path.join(dataRoot, "usr", "share", "applications", "zycord.desktop"));
    fs.copyFileSync(
        path.join(root, "platform", "desktop", "assets", "icon.png"),
        path.join(dataRoot, "usr", "share", "icons", "hicolor", "512x512", "apps", "zycord.png"),
    );

    const dataTar = path.join(stage, "data.tar.gz");
    execFileSync("tar", ["-czf", dataTar, "-h", "-C", dataRoot, "."], { stdio: "inherit" });

    fs.mkdirSync(controlRoot, { recursive: true });
    fs.writeFileSync(
        path.join(controlRoot, "control"),
        [
            "Package: zycord",
            "Version: 1.0.11",
            "Section: net",
            "Priority: optional",
            "Architecture: amd64",
            "Maintainer: Zyron Solutions Ltd <itsKyze@users.noreply.github.com>",
            "Homepage: https://app.zyron.site",
            "Depends: libgtk-3-0 | libgtk-4-1, libnotify4, libnss3, libxss1, libxtst6, xdg-utils, libatspi2.0-0, libuuid1, libsecret-1-0",
            "Description: Zycord",
            " Real-time voice, video, and chat.",
            "",
        ].join("\n"),
    );
    fs.writeFileSync(
        path.join(controlRoot, "postinst"),
        "#!/bin/sh\nchmod -R a+rX /opt/Zycord || true\nchmod 4755 /opt/Zycord/chrome-sandbox || true\nupdate-desktop-database /usr/share/applications >/dev/null 2>&1 || true\n",
    );
    const controlTar = path.join(stage, "control.tar.gz");
    execFileSync("tar", ["-czf", controlTar, "-C", controlRoot, "."], { stdio: "inherit" });

    const deb = Buffer.concat([
        Buffer.from("!<arch>\n"),
        arMember("debian-binary", Buffer.from("2.0\n")),
        arMember("control.tar.gz", fs.readFileSync(controlTar)),
        arMember("data.tar.gz", fs.readFileSync(dataTar)),
    ]);
    const out = path.join(dist, "Zycord-linux-amd64.deb");
    fs.writeFileSync(out, deb);
    console.log(`[pack] ${out} (${(deb.length / 1024 / 1024).toFixed(2)} MB)`);
    fs.rmSync(stage, { recursive: true, force: true });
}

function buildMac() {
    const zipUrl = "https://github.com/electron/electron/releases/download/v32.3.3/electron-v32.3.3-darwin-x64.zip";
    const cache = path.join(os.tmpdir(), "electron-v32.3.3-darwin-x64.zip");
    if (!fs.existsSync(cache)) {
        console.log("[pack] downloading Electron darwin runtime...");
        execFileSync("curl.exe", ["-L", zipUrl, "-o", cache], { stdio: "inherit" });
    }
    const extract = path.join(os.tmpdir(), "zycord-darwin-x64");
    fs.rmSync(extract, { recursive: true, force: true });
    fs.mkdirSync(extract, { recursive: true });
    execFileSync("tar", ["-xf", cache, "-C", extract], { stdio: "inherit" });

    const app = path.join(extract, "Electron.app");
    const resources = path.join(app, "Contents", "Resources");
    fs.copyFileSync(asar, path.join(resources, "app.asar"));
    const plist = path.join(app, "Contents", "Info.plist");
    let text = fs.readFileSync(plist, "utf8");
    text = text.replace(/<key>CFBundleDisplayName<\/key>\s*<string>[^<]*<\/string>/, "<key>CFBundleDisplayName</key>\n\t<string>Zycord</string>");
    text = text.replace(/<key>CFBundleName<\/key>\s*<string>[^<]*<\/string>/, "<key>CFBundleName</key>\n\t<string>Zycord</string>");
    text = text.replace(/<key>CFBundleIdentifier<\/key>\s*<string>[^<]*<\/string>/, "<key>CFBundleIdentifier</key>\n\t<string>com.zyron.zycord</string>");
    fs.writeFileSync(plist, text);

    const renamed = path.join(extract, "Zycord.app");
    fs.renameSync(app, renamed);
    const out = path.join(dist, "Zycord-macOS.zip");
    if (fs.existsSync(out)) fs.rmSync(out);
    execFileSync("tar", ["-a", "-cf", out, "-C", extract, "Zycord.app"], { stdio: "inherit" });
    console.log(`[pack] ${out} (${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
}

buildDeb();
buildMac();
