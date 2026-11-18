import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 3000;

const files = new Map([
  ['/', join(root, 'public/index.html')],
  ['/index.html', join(root, 'public/index.html')],
  ['/invite.js', join(root, 'src/invite.js')],
]);

const server = createServer(async (req, res) => {
  const path = (req.url || '/').split('?')[0];
  const file = files.get(path);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  try {
    const body = await readFile(file);
    const type = file.endsWith('.js')
      ? 'text/javascript; charset=utf-8'
      : 'text/html; charset=utf-8';
    res.writeHead(200, { 'content-type': type });
    res.end(body);
  } catch {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Internal error');
  }
});

server.listen(port, () => {
  console.log(`hello-studio running at http://localhost:${port}/`);
});
