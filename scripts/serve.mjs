import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
    if (!(await stat(file)).isFile()) {res.writeHead(404).end();return;}
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(file));
  } catch {res.writeHead(404).end('Not found');}
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
