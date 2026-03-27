/**
 * Static site + CandleScan proxies for local full-site runs (npm start).
 * - /__candlescan-yahoo → query1.finance.yahoo.com
 * - /candlescan/__candlescan-nse → www.nseindia.com (matches Vite base + NSE path)
 */
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const rootResolved = path.resolve(ROOT);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function isInsideRoot(absPath) {
  const r = path.resolve(absPath);
  return r === rootResolved || r.startsWith(rootResolved + path.sep);
}

function resolveStaticPath(pathname) {
  let rel = decodeURIComponent((pathname || '/').split('?')[0]);
  while (rel.endsWith('/')) rel = rel.slice(0, -1);
  rel = rel.replace(/^\/+/, '');
  let fp = path.resolve(rootResolved, rel);
  if (!isInsideRoot(fp)) return null;
  if (fs.existsSync(fp)) {
    const st = fs.statSync(fp);
    if (st.isDirectory()) fp = path.join(fp, 'index.html');
  } else {
    const withIdx = path.join(fp, 'index.html');
    if (fs.existsSync(withIdx) && fs.statSync(withIdx).isFile()) fp = withIdx;
    else return null;
  }
  if (!isInsideRoot(fp)) return null;
  if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return null;
  return fp;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, CORS);
    res.end();
    return;
  }

  const u = new URL(req.url || '/', 'http://127.0.0.1');

  if (u.pathname.startsWith('/__candlescan-yahoo')) {
    const yPath = u.pathname.replace(/^\/__candlescan-yahoo/, '') || '/';
    const fullPath = yPath + (u.search || '');
    const opts = {
      hostname: 'query1.finance.yahoo.com',
      path: fullPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CandleScanLocal/1.0)',
        Accept: 'application/json,text/plain,*/*',
      },
    };
    const pre = https.request(opts, (yres) => {
      const out = { ...CORS };
      const ct = yres.headers['content-type'];
      if (ct) out['Content-Type'] = ct;
      res.writeHead(yres.statusCode || 502, out);
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      yres.pipe(res);
    });
    pre.on('error', () => {
      res.writeHead(502, { ...CORS, 'Content-Type': 'text/plain' });
      res.end('Yahoo proxy error');
    });
    pre.end();
    return;
  }

  if (u.pathname.startsWith('/candlescan/__candlescan-nse')) {
    const nPath = u.pathname.replace(/^\/candlescan\/__candlescan-nse/, '') || '/';
    const fullPath = nPath + (u.search || '');
    const opts = {
      hostname: 'www.nseindia.com',
      path: fullPath,
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
        Referer: 'https://www.nseindia.com/',
      },
    };
    const pre = https.request(opts, (nres) => {
      const out = { ...CORS };
      const ct = nres.headers['content-type'];
      if (ct) out['Content-Type'] = ct;
      res.writeHead(nres.statusCode || 502, out);
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      nres.pipe(res);
    });
    pre.on('error', () => {
      res.writeHead(502, { ...CORS, 'Content-Type': 'text/plain' });
      res.end('NSE proxy error');
    });
    pre.end();
    return;
  }

  const fp = resolveStaticPath(u.pathname);
  if (!fp) {
    res.writeHead(404, CORS);
    res.end('Not found');
    return;
  }

  const ext = path.extname(fp).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(fp, (err, buf) => {
    if (err) {
      res.writeHead(500, CORS);
      res.end();
      return;
    }
    res.writeHead(200, { ...CORS, 'Content-Type': type, 'Content-Length': buf.length });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(buf);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.error(`[local-dev-server] http://127.0.0.1:${PORT}/`);
});
