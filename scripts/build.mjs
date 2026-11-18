import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const archive = join(root, 'dist.tar.gz');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(join(root, 'public/index.html'), join(dist, 'index.html'));
await cp(join(root, 'src/invite.js'), join(dist, 'invite.js'));
await cp(join(root, 'package.json'), join(dist, 'package.json'));

await rm(archive, { force: true });
// Keep dist/ as a directory in the archive; the deployment validator expects
// either a root package.json or a dist/package.json.
execFileSync('tar', ['-czf', archive, '-C', root, 'dist'], { stdio: 'inherit' });

console.log(`Built ${archive}`);
