# hello-studio

A tiny standalone program: enter a Studio invite code and it builds the
invitation URL and opens it in your browser. It has no server-side logic,
accounts or persistence — everything runs locally.

## Invite codes

Any non-empty input is accepted as an invite code — there is no format check.
For example:

```
G-AG8p4FpnpAu83F_vJ1ND0aJ
```

It becomes:

```
https://studio.seg.plus/main/invite/G-AG8p4FpnpAu83F_vJ1ND0aJ
```

The input is percent-encoded so arbitrary characters stay a single, safe URL
path segment. Empty input produces a clear error and opens nothing.

## Run it

Install (there are no runtime dependencies) and start the local web page:

```bash
pnpm install
pnpm start
```

Open <http://localhost:3000/>, type an invite code and press **打开邀请链接**.
Any non-empty code navigates the browser to the invitation link in this same
tab. When the input is empty, an error is shown and no link is opened.

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

Tests cover the required cases: non-empty input opens the exact URL, empty
input only reports an error, and the program never crashes.

## Project layout

- `src/invite.js` — input normalization and URL building, shared everywhere.
- `src/open-browser.js` — browser-opening wrapper with an injectable opener.
- `bin/cli.mjs` — command-line entry point.
- `public/index.html` — the browser UI.
- `scripts/serve.mjs` — tiny static server used for local verification.
- `scripts/build.mjs` — produces the deployable `dist.tar.gz` archive.
