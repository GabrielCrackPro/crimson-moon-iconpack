import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const requestedPort = Number(process.env.PORT);
const PORT = Number.isFinite(requestedPort) && requestedPort > 0 ? requestedPort : 4321;
const TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
  svg: "image/svg+xml",
  json: "application/json",
};

http
  .createServer(async (req, res) => {
    let rel = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      const type = TYPES[path.extname(file).slice(1)] ?? "application/octet-stream";
      res.writeHead(200, { "content-type": type, "cache-control": "no-store" }).end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Crimson Moon preview → http://127.0.0.1:${PORT}/preview/index.html`);
  });
