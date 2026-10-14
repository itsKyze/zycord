import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const androidDir = __dirname;
const mainDir = path.join(androidDir, "app", "src", "main");
const resDir = path.join(mainDir, "res");
const javaDir = path.join(mainDir, "java");
const manifestPath = path.join(mainDir, "AndroidManifest.xml");
const buildDir = path.join(androidDir, "app", "build");

const sdkRoot = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || "C:\\Users\\Kyze\\AppData\\Local\\Android\\Sdk";
const javaHome = process.env.JAVA_HOME || "C:\\Program Files\\Microsoft\\jdk-17.0.20.101-hotspot";

const buildToolsDir = path.join(sdkRoot, "build-tools", "34.0.0");
const androidJar = path.join(sdkRoot, "platforms", "android-34", "android.jar");
const aapt2 = path.join(buildToolsDir, "aapt2.exe");
const zipalign = path.join(buildToolsDir, "zipalign.exe");
const d8Jar = path.join(buildToolsDir, "lib", "d8.jar");
const apksignerJar = path.join(buildToolsDir, "lib", "apksigner.jar");

const javaBin = path.join(javaHome, "bin", "java.exe");
const javacBin = path.join(javaHome, "bin", "javac.exe");
const keytoolBin = path.join(javaHome, "bin", "keytool.exe");

async function generateIcons() {
    const iconPath = path.join(rootDir, "platform", "desktop", "assets", "icon.png");
    const mipmaps = [
        { dir: "mipmap-mdpi", size: 48, fg: 108 },
        { dir: "mipmap-hdpi", size: 72, fg: 162 },
        { dir: "mipmap-xhdpi", size: 96, fg: 216 },
        { dir: "mipmap-xxhdpi", size: 144, fg: 324 },
        { dir: "mipmap-xxxhdpi", size: 192, fg: 432 },
    ];

    for (const m of mipmaps) {
        fs.mkdirSync(path.join(resDir, m.dir), { recursive: true });
    }
    fs.mkdirSync(path.join(resDir, "drawable"), { recursive: true });

    const psScript = `
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('${iconPath.replace(/'/g, "''")}')
function Save-Resized($outPath, [int]$w, [int]$h, [bool]$adaptive) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    if ($adaptive) {
        $g.Clear([System.Drawing.Color]::FromArgb(255, 88, 101, 242))
        $inner = [int][Math]::Round($w * 0.60)
        $off = [int][Math]::Round(($w - $inner) / 2.0)
        $g.DrawImage($src, $off, $off, $inner, $inner)
    } else {
        $g.DrawImage($src, 0, 0, $w, $h)
    }
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}
${mipmaps
    .map((m) => {
        const d = path.join(resDir, m.dir).replace(/'/g, "''");
        return `
Save-Resized '${d}\\ic_launcher.png' ${m.size} ${m.size} $false
Save-Resized '${d}\\ic_launcher_round.png' ${m.size} ${m.size} $false
Save-Resized '${d}\\ic_launcher_foreground.png' ${m.fg} ${m.fg} $true`;
    })
    .join("\n")}
Save-Resized '${path.join(resDir, "drawable", "splash_logo.png").replace(/'/g, "''")}' 256 256 $false
Save-Resized '${path.join(resDir, "drawable", "ic_notification.png").replace(/'/g, "''")}' 96 96 $false
$src.Dispose()
`;
    execFileSync("powershell.exe", ["-NoProfile", "-Command", psScript], { stdio: "inherit" });
    console.log("[Zycord APK] Generated Android mipmap & drawable icons.");
}

function collectFiles(dir, ext) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectFiles(full, ext));
        } else if (!ext || full.endsWith(ext)) {
            results.push(full);
        }
    }
    return results;
}

async function buildApk() {
    await generateIcons();

    fs.rmSync(buildDir, { recursive: true, force: true });
    const compiledResDir = path.join(buildDir, "compiled_res");
    const genJavaDir = path.join(buildDir, "gen");
    const classesDir = path.join(buildDir, "classes");
    const dexDir = path.join(buildDir, "dex");
    const apkOutDir = path.join(buildDir, "outputs", "apk", "release");

    for (const d of [compiledResDir, genJavaDir, classesDir, dexDir, apkOutDir]) {
        fs.mkdirSync(d, { recursive: true });
    }

    // 1. Compile resources with aapt2
    console.log("[Zycord APK] Compiling resources with aapt2...");
    const resFiles = collectFiles(resDir);
    for (const resFile of resFiles) {
        execFileSync(aapt2, ["compile", resFile, "-o", compiledResDir], { stdio: "inherit" });
    }

    // 2. Link resources & generate R.java + unsigned APK
    console.log("[Zycord APK] Linking resources with aapt2...");
    const unsignedApk = path.join(buildDir, "Zycord-unsigned.apk");
    const flatFiles = collectFiles(compiledResDir, ".flat");
    execFileSync(
        aapt2,
        [
            "link",
            "-o",
            unsignedApk,
            "-I",
            androidJar,
            "--manifest",
            manifestPath,
            "--java",
            genJavaDir,
            "--auto-add-overlay",
            ...flatFiles,
        ],
        { stdio: "inherit" },
    );

    // 3. Compile Java sources (MainActivity.java + generated R.java) with javac (target Java 11 for d8)
    console.log("[Zycord APK] Compiling Java sources with javac...");
    const javaSources = [...collectFiles(javaDir, ".java"), ...collectFiles(genJavaDir, ".java")];
    execFileSync(
        javacBin,
        [
            "-source",
            "8",
            "-target",
            "8",
            "-encoding",
            "UTF-8",
            "-bootclasspath",
            androidJar,
            "-classpath",
            androidJar,
            "-d",
            classesDir,
            ...javaSources,
        ],
        { stdio: "inherit" },
    );

    // 4. Convert .class files to classes.dex using d8
    console.log("[Zycord APK] Converting bytecode to DEX with d8...");
    const classFiles = collectFiles(classesDir, ".class");
    execFileSync(
        javaBin,
        [
            "-cp",
            d8Jar,
            "com.android.tools.r8.D8",
            "--release",
            "--min-api",
            "24",
            "--lib",
            androidJar,
            "--output",
            dexDir,
            ...classFiles,
        ],
        { stdio: "inherit" },
    );

    // 5. Add classes.dex into the APK archive
    console.log("[Zycord APK] Packaging classes.dex into APK...");
    const jarBin = path.join(javaHome, "bin", "jar.exe");
    execFileSync(jarBin, ["uf", unsignedApk, "-C", dexDir, "classes.dex"], { stdio: "inherit" });

    // 6. Zipalign the APK
    console.log("[Zycord APK] Aligning APK with zipalign...");
    const alignedApk = path.join(buildDir, "Zycord-aligned.apk");
    execFileSync(zipalign, ["-f", "-p", "4", unsignedApk, alignedApk], { stdio: "inherit" });

    // 7. Generate keystore if not exists & sign APK with apksigner (v1 + v2 + v3 signatures)
    const keystoreDir = path.join(androidDir, "keystore");
    fs.mkdirSync(keystoreDir, { recursive: true });
    const keystorePath = path.join(keystoreDir, "zycord-release.jks");
    const storePassFile = path.join(keystoreDir, "store.pass");
    const storePass = process.env.ZYCORD_STORE_PASS || (fs.existsSync(storePassFile) ? fs.readFileSync(storePassFile, "utf8").trim() : "");
    if (!storePass) {
        throw new Error("Set ZYCORD_STORE_PASS or create platform/android/keystore/store.pass before signing the APK.");
    }
    if (!fs.existsSync(keystorePath)) {
        console.log("[Zycord APK] Generating release keystore...");
        execFileSync(
            keytoolBin,
            [
                "-genkeypair",
                "-v",
                "-keystore",
                keystorePath,
                "-alias",
                "zycord",
                "-keyalg",
                "RSA",
                "-keysize",
                "2048",
                "-validity",
                "10000",
                "-storepass",
                storePass,
                "-keypass",
                storePass,
                "-dname",
                "CN=Zycord, OU=Mobile, O=Zyron Solutions Ltd, L=Riyadh, S=Riyadh, C=SA",
            ],
            { stdio: "inherit" },
        );
    }

    console.log("[Zycord APK] Signing APK with apksigner...");
    const finalApk = path.join(apkOutDir, "Zycord.apk");
    execFileSync(
        javaBin,
        [
            "-jar",
            apksignerJar,
            "sign",
            "--v1-signing-enabled",
            "true",
            "--v2-signing-enabled",
            "true",
            "--v3-signing-enabled",
            "true",
            "--ks",
            keystorePath,
            "--ks-key-alias",
            "zycord",
            "--ks-pass",
            `pass:${storePass}`,
            "--key-pass",
            `pass:${storePass}`,
            "--out",
            finalApk,
            alignedApk,
        ],
        { stdio: "inherit" },
    );

    // Verify APK signature
    execFileSync(javaBin, ["-jar", apksignerJar, "verify", "--verbose", finalApk], { stdio: "inherit" });

    // Copy to platform/android/Zycord.apk and download assets folder
    const androidRootApk = path.join(androidDir, "Zycord.apk");
    const downloadDir = path.join(rootDir, "assets", "public", "download");
    fs.mkdirSync(downloadDir, { recursive: true });
    const downloadApk = path.join(downloadDir, "Zycord.apk");

    fs.copyFileSync(finalApk, androidRootApk);
    fs.copyFileSync(finalApk, downloadApk);

    const sizeKB = (fs.statSync(finalApk).size / 1024).toFixed(1);
    console.log(`\n[Zycord APK] Successfully built & signed Zycord.apk (${sizeKB} KB):`);
    console.log(`  1. ${androidRootApk}`);
    console.log(`  2. ${downloadApk}`);
    console.log(`  3. ${finalApk}`);
}

buildApk().catch((err) => {
    console.error("[Zycord APK] Build failed:", err);
    process.exit(1);
});
