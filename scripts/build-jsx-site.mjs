import esbuild from "esbuild";
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

for (const t of targets) {
	await esbuild.build({
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
}

console.log("[build-jsx-site] Successfully compiled JSX components for Site, Developers Portal, and Admin Console.");
