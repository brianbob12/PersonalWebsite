<script lang="ts">
  import HexTile from "#lib/HexTile.svelte";
  import CyrusTile from "#lib/Tiles/CyrusTile.svelte";
  import CiridaeTile from "#lib/Tiles/CiridaeTile.svelte";
  import { HEX_WIDTH, HEX_HEIGHT } from "#lib/hexGeometry.ts";

  const blankHexes = Array.from({ length: 5 });
  const tileCount = 2 + blankHexes.length;
  let innerWidth = $state(HEX_WIDTH);
  let scale = $derived(Math.min(1, Math.max(0, (innerWidth - 32) / HEX_WIDTH)));
</script>

<svelte:window bind:innerWidth />

<div class="mobile-hexes">
  <div
    style="width: {HEX_WIDTH * scale}px; height: {tileCount *
      HEX_HEIGHT *
      scale}px"
  >
    <div class="hexes" style="width: {HEX_WIDTH}px; transform: scale({scale})">
      <CyrusTile mobileMode />
      <CiridaeTile mobileMode />
      {#each blankHexes as _}
        <HexTile mobileMode />
      {/each}
    </div>
  </div>
</div>

<style>
  .mobile-hexes {
    display: flex;
    justify-content: center;
    padding: 16px;
  }
  .hexes {
    transform-origin: top left;
  }
</style>
