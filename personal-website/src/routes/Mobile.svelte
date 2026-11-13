<script lang="ts">
  import HexTile from "#lib/HexTile.svelte";
  import CyrusTile from "#lib/Tiles/CyrusTile.svelte";
  import CiridaeTile from "#lib/Tiles/CiridaeTile.svelte";
  import { HEX_WIDTH, HEX_HEIGHT } from "#lib/hexGeometry.ts";

  const blankHexes = Array.from({ length: 5 });
  const tileCount = 2 + blankHexes.length;
  let containerWidth = $state(0);
  let scale = $derived(
    Math.min(1, Math.max(0, (containerWidth - 32) / HEX_WIDTH)),
  );
</script>

<div class="mobile-hexes" bind:clientWidth={containerWidth}>
  <div
    class="hex-viewport"
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
    width: 100%;
    padding: 16px;
    overflow: clip;
  }
  .hex-viewport {
    /* Clip the unscaled layout bounds before they can widen a mobile viewport. */
    min-width: 0;
    overflow: clip;
  }
  .hexes {
    transform-origin: top left;
  }
</style>
