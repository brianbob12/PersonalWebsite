# Personal website

Cyrus Singer's Svelte 5 / SvelteKit 3 website at https://cyrus.singer.dev.

## Development

Use Node.js 22.17 or newer and Yarn Classic 1.22.22. From this directory:

```sh
yarn install --frozen-lockfile
yarn dev --host 127.0.0.1
```

The local preview runs at http://127.0.0.1:5173.

## Checks and build

```sh
yarn format:check
yarn run check
yarn build
```

Run `yarn format` to apply formatting. The static production output is written to `build/` for Cloudflare Pages.

## Browser regression tests

See [Browser compatibility](COMPATIBILITY.md) for supported versions, required
interaction behavior, Safari/iOS constraints, verification limits, and primary
sources behind the requirements.

The default is the quick Chromium smoke suite (13 scenarios, typically around
10–20 seconds after the build):

```sh
yarn playwright install chromium
yarn build
yarn test:e2e
```

`yarn test:e2e` and bare `yarn playwright test` run only `tests/website.spec.ts`
in Chromium. They do not run frame-painting regressions, extra browsers, device
profiles, or historical browser versions. Normal pull requests run this quick
suite plus formatting, types, and build checks. Analytics requests are blocked.
Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome instead.

### When to run extended compatibility checks

The extended suite is **opt-in**. It takes roughly 1–2 minutes locally; the full
13-job historical matrix can take 5–15 minutes in CI, including browser downloads
and runner queues. These are estimates, not timeouts.

| Change                                                                                      | What to run                                                                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Copy, links, documentation, or isolated asset changes                                       | Use the quick checks; leave the extended matrix off.                                             |
| Tile CSS/3D transforms, flip timing, input/keyboard behavior, mobile sizing, fonts/fallback | Run the relevant extended browser profile while developing, then the full matrix before merging. |
| Svelte/SvelteKit/Vite upgrades or browser-target changes                                    | Run the full matrix and the real-device release checks in `COMPATIBILITY.md`.                    |
| A release with no relevant changes since a green matrix run                                 | Reuse that result; do not rerun the matrix just because another commit or PR exists.             |

Do not run the historical matrix on every edit, commit, or ordinary PR. The dev
server, build, default test command, and automatic PR workflow never invoke it.

For an explicit local run, build first and install the additional browsers once:

```sh
yarn playwright install chromium firefox webkit
yarn build
yarn test:compat --project=webkit
# Or opt into all five current-engine/device profiles:
yarn test:compat
```

`playwright.compat.config.ts` is separate from the smoke configuration. It adds
animation-frame/halfway/reversal checks, legacy Safari click events, viewport
checks, Firefox/WebKit, and WebKit phone/wide-iPad touch profiles. Use
`--project=chromium`, `firefox`, `webkit`, `webkit-iphone`, or `webkit-ipad` to
select a profile.

For the historical matrix, manually run **Check website**, select the desired
branch, and explicitly enable **full_compatibility**. The checkbox defaults to
false; leaving it off runs only quick checks. The command-line equivalent is:

```sh
gh workflow run check.yml --ref <branch> -f full_compatibility=true
```

This opt-in matrix runs four exact Playwright releases against their matching
Chromium, Firefox, and WebKit binaries on Ubuntu 22.04, plus current WebKit on
macOS. Reports include actual browser versions and failure screenshots/traces.
The app is built from its frozen lockfile before changing the disposable test
runner. No matrix dependency changes are committed or deployed.

| Playwright | Chromium      | Firefox | WebKit |
| ---------- | ------------- | ------- | ------ |
| 1.40.1     | 120.0.6099.28 | 119.0   | 17.4   |
| 1.48.2     | 130.0.6723.31 | 131.0   | 18.0   |
| 1.56.1     | 141.0.7390.37 | 142.0.1 | 26.0   |
| 1.64.0     | 156.0.8078.4  | 157.0   | 27.2   |

Versions come from each release's `packages/playwright-core/browsers.json`:
[1.40.1](https://github.com/microsoft/playwright/blob/v1.40.1/packages/playwright-core/browsers.json),
[1.48.2](https://github.com/microsoft/playwright/blob/v1.48.2/packages/playwright-core/browsers.json),
[1.56.1](https://github.com/microsoft/playwright/blob/v1.56.1/packages/playwright-core/browsers.json),
[1.64.0](https://github.com/microsoft/playwright/blob/v1.64.0/packages/playwright-core/browsers.json).
Platform overrides can select a different WebKit binary; the run's attached
browser version is authoritative. These snapshots do not certify the exact
minimum supported releases, branded Safari/Edge, or actual iOS hardware; see the
compatibility document's real-device release checks.

To reproduce an older snapshot locally, use a disposable checkout, build with the
frozen lockfile, then run `yarn add --dev --exact --ignore-scripts
@playwright/test@1.48.2`, install its browsers, and explicitly run `yarn test:compat`.
Do not commit the temporary package/lockfile changes. Face-painting assertions run on every engine
and OS, including Windows WebKit; visible faces are selected from the animated
angle without depending on native backface culling.

## Deployment

The [Deploy website workflow](../.github/workflows/deploy.yml) checks formatting, types, and the build for pull requests targeting `main` and for every push to `main`. The `Build website` check must pass before a pull request can merge. `main` requires linear history and uses squash merging.

For pushes to `main`, the build job uploads only `build/` as an immutable artifact retained for one day. A separate job on a fresh runner downloads that exact artifact, verifies its digest, and deploys it to the existing Cloudflare Pages project `personal-website`. The deploy runner does not check out application source or install application dependencies. Only the deployment step references the Cloudflare token. Failed builds prevent deployment, and production deployments run one at a time.

You can also run it manually from GitHub Actions with `main` selected. Other branches cannot deploy production through this workflow.

The repository's GitHub Actions settings need:

- Secret `CLOUDFLARE_API_TOKEN`: a dedicated API token with **Account → Cloudflare Pages → Edit**, restricted to the account hosting this site.
- Variable `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.

When rotating the token, update the repository secret. Keep tokens out of source control.

## Components

The site self-hosts JetBrains Mono v2.304 in regular (400) and bold (700)
WOFF2 files from the [official release](https://github.com/JetBrains/JetBrainsMono/tree/v2.304/fonts/webfonts).
The fonts and their SIL Open Font License are in `static/fonts/`. Both weights
are preloaded, and fallback text remains visible while they load. The name
stays on one line with either the supplied font or a system fallback.

- `HexShape.svelte` draws the original hexagon and border ripple.
- `HexFaces.svelte` keeps both faces mounted and rotates them together, so interrupted flips reverse without content-swap timers.
- `HexTile.svelte` handles hover, touch, keyboard input, and front/back content.
- `hexGeometry.ts` shares the tile dimensions with the mobile layout.
- `CyrusTile.svelte` and `CiridaeTile.svelte` contain the visible content and links.
- `Mobile.svelte` and `NotMobile.svelte` preserve the seven-tile mobile stack and 28-tile desktop pattern.

Ciridae's logo and wordmark in `static/` are sourced from https://ciridae.com/.

The stationary hexagon wrapper owns pointer input; only its two faces rotate. Desktop mouse input uses hover, while touch and keyboard input toggle the tile.
