import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("assets/public");
const mime = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".png": "image/png",
	".webp": "image/webp",
	".avif": "image/avif",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".woff2": "font/woff2",
	".woff": "font/woff",
};

function shell(pageKey, title) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${title}</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="stylesheet" href="/site/site.css?v=20261020b" />
</head>
<body>
	<header data-zy-navbar></header>
	<main data-zy-jsx-page="${pageKey}"></main>
	<footer data-zy-footer></footer>
	<script src="/site/site.js?v=20261020b"></script>
</body>
</html>`;
}

function pageFor(u) {
	if (u.startsWith("/servers") || u === "/discover" || u.startsWith("/trending-games")) return shell("discover", "Discover");
	if (u === "/safety") return shell("safety", "Safety");
	if (u.startsWith("/safety-")) return shell("safety-hub", "Safety Hub");
	if (u === "/quests" || u === "/ads/quests") return shell("quests", "Quests");
	if (u.includes("quests-success")) return shell("quests-stories", "Stories");
	if (u.includes("quests-faq")) return shell("quests-faq", "FAQ");
	if (u.startsWith("/support")) return shell("support", "Support");
	if (u.startsWith("/blog") || u.startsWith("/category/")) return shell("blog", "Blog");
	return null;
}

http
	.createServer((req, res) => {
		const u = decodeURIComponent((req.url || "/").split("?")[0]);
		const html = pageFor(u);
		if (html) {
			res.writeHead(200, { "Content-Type": "text/html" });
			return res.end(html);
		}
		if (u === "/favicon.svg" || u === "/static/logo.png") {
			const icon = u === "/favicon.svg" ? path.join(root, "favicon.svg") : path.resolve("assets/icon.png");
			if (fs.existsSync(icon)) {
				res.writeHead(200, { "Content-Type": u.endsWith(".svg") ? "image/svg+xml" : "image/png" });
				return fs.createReadStream(icon).pipe(res);
			}
		}
		const file = path.join(root, u.replace(/^\//, ""));
		if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
			const nf = path.join(root, "not-found.html");
			res.writeHead(404, { "Content-Type": "text/html" });
			return res.end(fs.readFileSync(nf, "utf8").replaceAll("__INSTANCE_NAME__", "Zycord").replaceAll("__INSTANCE_ICON__", '<img class="brand-icon" src="/static/logo.png" alt="" />'));
		}
		res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
		fs.createReadStream(file).pipe(res);
	})
	.listen(3470, "127.0.0.1", () => {
		console.log("ready http://127.0.0.1:3470/servers");
	});
