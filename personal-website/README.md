# Personal website

Cyrus Singer's SvelteKit website at https://cyrus.singer.dev.

## Development

Use Node.js 22 and Yarn Classic. From this directory:

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

## Components

- `HexShape.svelte` draws the original hexagon and border ripple.
- `HexFaces.svelte` keeps both faces mounted and rotates them together, so interrupted flips reverse without content-swap timers.
- `HexTile.svelte` handles hover, touch, keyboard input, and front/back content.
- `hexGeometry.ts` shares the tile dimensions with the mobile layout.
- `CyrusTile.svelte` and `CiridaeTile.svelte` contain the visible content and links.
- `Mobile.svelte` and `NotMobile.svelte` preserve the seven-tile mobile stack and 28-tile desktop pattern.

Ciridae's logo and wordmark in `static/` are sourced from https://ciridae.com/.

The stationary hexagon wrapper owns pointer input; only its two faces rotate. Desktop mouse input uses hover, while touch and keyboard input toggle the tile.
