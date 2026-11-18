#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { openInvite } from '../src/open-browser.js';

async function readInput() {
  const fromArgs = process.argv.slice(2).join(' ').trim();
  if (fromArgs) return fromArgs;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (process.stdin.isTTY) {
      const answer = await rl.question('请输入邀请码：');
      return answer;
    }
    let data = '';
    for await (const chunk of process.stdin) data += chunk;
    return data;
  } finally {
    rl.close();
  }
}

const input = await readInput();
const result = openInvite(input);

if (result.ok) {
  console.log(`邀请码有效，已尝试打开链接：${result.url}`);
} else {
  console.error(result.message);
  process.exitCode = 1;
}
