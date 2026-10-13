import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const targets = [
	{
		entry: path.join(rootDir, "assets/public/jsx/index.jsx"),
		outfile: path.join(rootDir, "assets/public/site/site.js")
	},
	{
		entry: path.join(rootDir, "assets/public/jsx/DevelopersPortalShell.jsx"),
		outfile: path.join(rootDir, "assets/public/developers/portal-shell.js")
	},
	{
		entry: path.join(rootDir, "assets/public/jsx/AdminPortalShell.jsx"),
		outfile: path.join(rootDir, "assets/public/admin/admin-shell.js")
	}
];

let esbuildModule = null;
try {
	esbuildModule = await import("esbuild");
} catch (_) {}

for (const t of targets) {
	if (esbuildModule) {
		await esbuildModule.build({
			entryPoints: [t.entry],
			outfile: t.outfile,
			bundle: true,
			format: "iife",
			target: ["es2020"],
			jsxFactory: "h",
			jsxFragment: "Fragment",
			charset: "utf8",
			logLevel: "info"
		});
	} else {
		execSync(`npx esbuild "${t.entry}" --outfile="${t.outfile}" --bundle --format=iife --target=es2020 --jsx-factory=h --jsx-fragment=Fragment --charset=utf8`, {
			stdio: "inherit"
		});
	}
}

console.log("[build-jsx-site] Successfully compiled JSX components for Site, Developers Portal, and Admin Console.");
