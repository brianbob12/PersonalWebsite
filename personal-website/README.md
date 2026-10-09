# Personal website

Cyrus Singer's SvelteKit website at https://cyrus.singer.dev.

## Development

Use Node.js 22.12 or newer and Yarn Classic. From this directory:

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

After installing dependencies, install the test browser and build the site:

```sh
yarn playwright install chromium
yarn build
yarn test:e2e
```

The tests start a local production preview and check desktop rendering, hover reversals, keyboard and link behavior, the responsive breakpoint, reduced motion, and mobile taps at 320px and 390px. They also check for browser runtime errors. Analytics requests are intercepted so tests do not send events to production analytics.

To use an installed Chrome browser instead, set `PLAYWRIGHT_CHANNEL=chrome` in your environment before running `yarn test:e2e`.

The Check website workflow runs the dependency audit, formatting and type checks, build, and browser tests for pull requests affecting the site.

Tailwind 4 runs through its Vite plugin and scans `src/` through the source directive in `src/app.css`. It requires modern browsers (Safari 16.4+, Chrome 111+, or Firefox 128+). The scoped Yarn resolution for SvelteKit's `cookie` dependency keeps it on the patched 0.7 release while SvelteKit 2 declares the older 0.6 range; remove that override when SvelteKit updates its declared range.

## Deployment

The [Deploy website workflow](../.github/workflows/deploy.yml) checks and builds the site, then deploys `build/` to the existing Cloudflare Pages project `personal-website` on every push to `main`. Failed checks prevent deployment. Production deployments run one at a time.

You can also run it manually from GitHub Actions with `main` selected. Other branches cannot deploy production through this workflow.

The repository's GitHub Actions settings need:

- Secret `CLOUDFLARE_API_TOKEN`: a dedicated API token with **Account → Cloudflare Pages → Edit**, restricted to the account hosting this site.
- Variable `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.

When rotating the token, update the repository secret. Keep tokens out of source control.

## Components

- `HexShape.svelte` draws the original hexagon and border ripple.
- `HexFaces.svelte` keeps both faces mounted and rotates them together, so interrupted flips reverse without content-swap timers.
- `HexTile.svelte` handles hover, touch, keyboard input, and front/back content.
- `hexGeometry.ts` shares the tile dimensions with the mobile layout.
- `CyrusTile.svelte` and `CiridaeTile.svelte` contain the visible content and links.
- `Mobile.svelte` and `NotMobile.svelte` preserve the seven-tile mobile stack and 28-tile desktop pattern.

Ciridae's logo and wordmark in `static/` are sourced from https://ciridae.com/.

The stationary hexagon wrapper owns pointer input; only its two faces rotate. Desktop mouse input uses hover, while touch and keyboard input toggle the tile.
