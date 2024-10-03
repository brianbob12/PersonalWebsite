<script lang="ts">
  import HexTile from "$lib/HexTile.svelte";
  import CyrusTile from "$lib/Tiles/CyrusTile.svelte";
  import UpennTile from "$lib/Tiles/UpennTile.svelte";
  let fillerHexCount = 1;
  let fillerHexList = Array.from({ length: fillerHexCount }, (_, i) => i);

  let offsetFillerHexCount = 1;
  let offsetFillerHexList = Array.from(
    { length: offsetFillerHexCount },
    (_, i) => i,
  );
</script>

<div class="all-hexes-container">
  <div class="hex-row first-row">
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
    <HexTile />
    <HexTile />
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
  </div>
  <div class="hex-row">
    {#each offsetFillerHexList as hex}
      <HexTile />
    {/each}
    <CyrusTile />
    {#each offsetFillerHexList as hex}
      <HexTile />
    {/each}
  </div>
  <div class="hex-row">
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
    <UpennTile />
    <HexTile flipable>
      <div slot="content">
        <span class="">Test Hex</span>
      </div>
      <div slot="hover">
        <span class="">Hover Hex</span>
      </div>
    </HexTile>
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
  </div>
  <div class="hex-row">
    {#each offsetFillerHexList as hex}
      <HexTile />
    {/each}
    <HexTile flipable>
      <div slot="content">
        <span class="">Test Hex</span>
      </div>
      <div slot="hover">
        <span class="">Hover Hex</span>
      </div>
    </HexTile>
    {#each offsetFillerHexList as hex}
      <HexTile />
    {/each}
  </div>
  <div class="hex-row">
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
    <HexTile>
      <div slot="content">
        <span class="">Test Hex</span>
      </div>
      <div slot="hover">
        <span class="">Hover Hex</span>
      </div>
    </HexTile>
    <HexTile>
      <div slot="content">
        <span class="">Test Hex</span>
      </div>
      <div slot="hover">
        <span class="">Hover Hex</span>
      </div>
    </HexTile>
    {#each fillerHexList as hex}
      <HexTile />
    {/each}
  </div>
</div>

<style>
  .all-hexes-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: -250px;
    overflow-x: hidden;
    height: 100vh;
    align-items: center;
  }
  .hex-row {
    display: flex;
    flex-direction: row;
    gap: 250px;
    margin-bottom: -220px;
  }
  .first-row {
    margin-top: -220px;
  }
</style>
