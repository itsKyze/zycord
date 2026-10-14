import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloadDir = path.join(root, "assets", "public", "download");
const updatesDir = path.join(root, "assets", "public", "updates");
const desktopDist = path.join(root, "platform", "desktop", "dist");
const version = "1.0.11";
const versionCode = 11;
const releaseDate = new Date().toISOString();

fs.mkdirSync(downloadDir, { recursive: true });

function sha512(file) {
    return crypto.createHash("sha512").update(fs.readFileSync(file)).digest("base64");
}

function publish(src, fileName, platform) {
    if (!fs.existsSync(src)) {
        console.warn(`[stage] missing ${src}`);
        return null;
    }
    const platformDir = path.join(updatesDir, platform);
    fs.mkdirSync(platformDir, { recursive: true });
    fs.copyFileSync(src, path.join(downloadDir, fileName));
    fs.copyFileSync(src, path.join(platformDir, fileName));
    const stat = fs.statSync(src);
    console.log(`[stage] ${platform}/${fileName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    return { fileName, size: stat.size, sha512: sha512(src), platform };
}

function findDist(pattern) {
    if (!fs.existsSync(desktopDist)) return null;
    return fs.readdirSync(desktopDist).find((name) => pattern.test(name)) || null;
}

const published = [];

const apk = path.join(root, "platform", "android", "Zycord.apk");
const apkInfo = publish(apk, "Zycord.apk", "android");
if (apkInfo) published.push(apkInfo);

const winX64 = findDist(/^ZycordSetup(-x64)?\.exe$/i) || findDist(/Setup.*x64.*\.exe$/i) || findDist(/\.exe$/i);
if (winX64) {
    const info = publish(path.join(desktopDist, winX64), "ZycordSetup.exe", "windows");
    if (info) published.push({ ...info, arch: "x64" });
    publish(path.join(desktopDist, winX64), "ZycordSetup-x64.exe", "windows");
}

const winArm = findDist(/arm64.*\.exe$/i) || findDist(/Setup-arm64\.exe$/i);
if (winArm && winArm !== winX64) {
    const info = publish(path.join(desktopDist, winArm), "ZycordSetup-arm64.exe", "windows");
    if (info) published.push({ ...info, arch: "arm64" });
}

const linuxMap = [
    [/amd64\.deb$/i, "Zycord-linux-amd64.deb", "deb"],
    [/x86_64\.rpm$/i, "Zycord-linux-x86_64.rpm", "rpm"],
    [/tar\.gz$/i, "Zycord-linux-x64.tar.gz", "tar.gz"],
    [/AppImage$/i, "Zycord-linux-x64.AppImage", "AppImage"],
    [/pkg\.tar\.zst$/i, "Zycord-linux-x86_64.pkg.tar.zst", "pkg.tar.zst"],
];
for (const [pattern, name] of linuxMap) {
    const found = findDist(pattern);
    if (!found) continue;
    const info = publish(path.join(desktopDist, found), name, "linux");
    if (info) published.push(info);
}

const macZip = findDist(/mac.*\.zip$/i) || findDist(/darwin.*\.zip$/i) || findDist(/\.dmg$/i);
if (macZip) {
    const ext = path.extname(macZip);
    const info = publish(path.join(desktopDist, macZip), `Zycord-macOS${ext}`, "macos");
    if (info) published.push(info);
}

const mobileconfig = path.join(downloadDir, "Zycord.mobileconfig");
if (fs.existsSync(mobileconfig)) {
    const info = publish(mobileconfig, "Zycord.mobileconfig", "ios");
    if (info) published.push(info);
}

function ymlFor(fileName, hash, size) {
    return [
        `version: ${version}`,
        "files:",
        `  - url: ${fileName}`,
        `    sha512: ${hash}`,
        `    size: ${size}`,
        `path: ${fileName}`,
        `sha512: ${hash}`,
        `releaseDate: '${releaseDate}'`,
        "",
    ].join("\n");
}

const windowsX64 = published.find((item) => item.fileName === "ZycordSetup.exe");
if (windowsX64) {
    fs.writeFileSync(
        path.join(updatesDir, "windows", "latest.yml"),
        ymlFor(windowsX64.fileName, windowsX64.sha512, windowsX64.size),
    );
}
const windowsArm = published.find((item) => item.fileName === "ZycordSetup-arm64.exe");
if (windowsArm) {
    fs.writeFileSync(
        path.join(updatesDir, "windows", "latest-arm64.yml"),
        ymlFor(windowsArm.fileName, windowsArm.sha512, windowsArm.size),
    );
}

function writeJson(platform, fileName, extra = {}) {
    const item = published.find((entry) => entry.fileName === fileName);
    if (!item) return;
    const body = {
        version,
        versionCode,
        platform,
        url: `/updates/${platform}/${fileName}`,
        downloadUrl: `/download/${platform}`,
        sha512: item.sha512,
        size: item.size,
        releaseDate,
        ...extra,
    };
    fs.writeFileSync(path.join(updatesDir, platform, "latest.json"), JSON.stringify(body, null, 2));
}

writeJson("android", "Zycord.apk");
writeJson("macos", "Zycord-macOS.zip");
writeJson("ios", "Zycord.mobileconfig", { url: "/updates/ios/Zycord.mobileconfig", downloadUrl: "/download/ios" });

const linuxFiles = published.filter((item) => item.platform === "linux");
if (linuxFiles.length) {
    fs.writeFileSync(
        path.join(updatesDir, "linux", "latest.json"),
        JSON.stringify(
            {
                version,
                versionCode,
                platform: "linux",
                releaseDate,
                files: linuxFiles.map((item) => ({
                    url: `/updates/linux/${item.fileName}`,
                    fileName: item.fileName,
                    sha512: item.sha512,
                    size: item.size,
                })),
            },
            null,
            2,
        ),
    );
}

const manifest = {
    version,
    versionCode,
    releaseDate,
    platforms: {},
};
for (const item of published) {
    const key = item.platform;
    manifest.platforms[key] ??= [];
    manifest.platforms[key].push({
        fileName: item.fileName,
        url: `/updates/${item.platform}/${item.fileName}`,
        downloadUrl: `/download/${item.fileName}`,
        sha512: item.sha512,
        size: item.size,
    });
}
fs.writeFileSync(path.join(updatesDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`[stage] published ${published.length} files`);
