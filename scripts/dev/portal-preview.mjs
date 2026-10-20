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
	".woff2": "font/woff2",
	".jpg": "image/jpeg",
	".woff": "font/woff",
};

http
	.createServer((req, res) => {
		const u = decodeURIComponent((req.url || "/").split("?")[0]);
		if (u.startsWith("/developers") && !path.extname(u)) {
			let html = fs.readFileSync(path.join(root, "developers/index.html"), "utf8");
			html = html.replace("{{CONFIG}}", JSON.stringify({ instanceName: "Zycord", cdn: "" }));
			res.writeHead(200, { "Content-Type": "text/html" });
			return res.end(html);
		}
		const file = path.join(root, u.replace(/^\//, ""));
		if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
			res.writeHead(404);
			return res.end("nf");
		}
		res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
		fs.createReadStream(file).pipe(res);
	})
	.listen(3456, "127.0.0.1", () => {
		console.log("ready http://127.0.0.1:3456/developers/applications");
	});
