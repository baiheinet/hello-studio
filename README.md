# hello-studio

A tiny standalone program: enter a Studio invite code and it builds the
invitation URL and opens it in your browser. It has no server-side logic,
accounts or persistence — everything runs locally.

## Invite codes

A valid invite code starts with `G-` followed by 8–64 letters, digits,
underscores (`_`) or hyphens (`-`). For example:

```
G-AG8p4FpnpAu83F_vJ1ND0aJ
```

It becomes:

```
https://studio.seg.plus/main/invite/G-AG8p4FpnpAu83F_vJ1ND0aJ
```

Empty input, or text that does not look like an invite code, produces a clear
error and opens nothing.

## Run it

Install (there are no runtime dependencies) and start the local web page:

```bash
pnpm install
pnpm start
```

Open <http://localhost:3000/>, type an invite code and press **打开邀请链接**.
When the code is valid, the browser opens the invitation link in a new tab.
When it is empty or malformed, an error is shown and no link is opened.

### Command line

The same behaviour is available as a CLI:

```bash
pnpm cli G-AG8p4FpnpAu83F_vJ1ND0aJ
```

You can also pipe a code on stdin or run `pnpm cli` and type it at the prompt.

## Checks

```bash
pnpm test    # unit + CLI smoke tests
pnpm build   # writes dist/ and dist.tar.gz
```

Tests cover the three required cases: a valid code opens the exact URL, empty
and malformed input only report an error, and the program never crashes.

## Project layout

- `src/invite.js` — pure validation and URL building, shared everywhere.
- `src/open-browser.js` — browser-opening wrapper with an injectable opener.
- `bin/cli.mjs` — command-line entry point.
- `public/index.html` — the browser UI.
- `scripts/serve.mjs` — tiny static server used for local verification.
- `scripts/build.mjs` — produces the deployable `dist.tar.gz` archive.
