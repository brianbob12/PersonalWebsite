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

## Deployment

The [Deploy website workflow](../.github/workflows/deploy.yml) checks formatting, types, and the build for pull requests targeting `main` and for every push to `main`. The `Build website` check must pass before a pull request can merge. `main` requires linear history and uses squash merging.

For pushes to `main`, the build job uploads only `build/` as an immutable artifact retained for one day. A separate job on a fresh runner downloads that exact artifact, verifies its digest, and deploys it to the existing Cloudflare Pages project `personal-website`. The deploy runner does not check out application source or install application dependencies. Only the deployment step references the Cloudflare token. Failed builds prevent deployment, and production deployments run one at a time.

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
