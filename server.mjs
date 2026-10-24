import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4" };

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = clean.endsWith("/") ? `${clean}index.html` : clean;
  const target = path.resolve(dist, `.${candidate}`);
  return target.startsWith(dist) ? target : null;
}

http.createServer((req, res) => {
  const target = resolvePath(req.url || "/");
  if (!target || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end("<!doctype html><html lang=\"ja\"><meta charset=\"utf-8\"><title>404 | YAKINIKUEN 忍鬨</title><h1>ページが見つかりません</h1><p><a href=\"/\">ホームへ戻る</a></p>");
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(target).pipe(res);
}).listen(port, "0.0.0.0", () => console.log(`Nintoki static site listening on ${port}`));
