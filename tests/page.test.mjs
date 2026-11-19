import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = await readFile(join(root, "public/index.html"), "utf8");

test("the page keeps language and theme choices visible", () => {
  assert.match(page, /data-testid="language-trigger"/);
  assert.match(page, /data-testid="theme-trigger"/);
  assert.match(page, /role="menuitemradio"[\s\S]*data-locale="en-US"/);
  assert.match(page, /data-theme-value="dark"/);
});

test("a non-empty code opens its invitation link in the same tab", () => {
  assert.match(page, /window\.location\.href = url/);
  assert.doesNotMatch(page, /window\.open\(/);
});

test("an empty code only reports an error", () => {
  assert.match(page, /if \(url === null\)/);
  assert.match(page, /errorKey = ["']empty["']/);
  assert.match(page, /请输入邀请码/);
});
