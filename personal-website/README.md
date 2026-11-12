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

Install the test browsers, build the site, and run the scenarios:

```sh
yarn playwright install chromium firefox
yarn build
yarn test:e2e
```

`tests/website.spec.ts` describes the visible behavior; `tests/website.helpers.ts`
contains browser measurements and shared assertions. Tests cover font loading and
fallback, desktop interactions, and touch input at phone sizes in Chromium and
Firefox. Analytics requests are blocked. Set `PLAYWRIGHT_CHANNEL=chrome` to use
installed Chrome for the Chromium project, or pass `--project=chromium` or
`--project=firefox` to run one browser.

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
