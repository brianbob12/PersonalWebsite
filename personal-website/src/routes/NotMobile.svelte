<script lang="ts">
  import HexTile from "$lib/HexTile.svelte";
  import CyrusTile from "$lib/Tiles/CyrusTile.svelte";
  import UpennTile from "$lib/Tiles/UpennTile.svelte";
  import BackendTile from "$lib/Tiles/BackendTile.svelte";
  import HexTileRow from "$lib/HexTileRow.svelte";
  import DevopsTile from "$lib/Tiles/DevopsTile.svelte";
  import FrontendTile from "$lib/Tiles/FrontendTile.svelte";
  import BizzybotsTile from "$lib/Tiles/BizzybotsTile.svelte";
  import BestProjectsTile from "$lib/Tiles/BestProjectsTile.svelte";
  let fillerHexCount = 1;
  let fillerHexList = Array.from({ length: fillerHexCount }, (_, i) => i);

  let offsetFillerHexCount = 1;
  let offsetFillerHexList = Array.from(
    { length: offsetFillerHexCount },
    (_, i) => i,
  );
</script>

<div class="all-hexes-container">
  <div class="first-row">
    <HexTileRow {fillerHexCount}>
      <HexTile />
      <HexTile />
    </HexTileRow>
  </div>
  <HexTileRow fillerHexCount={offsetFillerHexCount}>
    <BestProjectsTile />
  </HexTileRow>
  <HexTileRow {fillerHexCount}>
    <UpennTile />
    <BizzybotsTile />
  </HexTileRow>
  <HexTileRow fillerHexCount={offsetFillerHexCount}>
    <CyrusTile />
  </HexTileRow>
  <HexTileRow {fillerHexCount}>
    <FrontendTile />
    <BackendTile />
  </HexTileRow>
  <HexTileRow fillerHexCount={offsetFillerHexCount}>
    <DevopsTile />
  </HexTileRow>
  <HexTileRow {fillerHexCount}>
    <HexTile />
    <HexTile />
  </HexTileRow>
  <HexTileRow fillerHexCount={offsetFillerHexCount}>
    <HexTile />
  </HexTileRow>
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
    height: 100vh;
  }
  .first-row {
    margin-top: -220px;
  }
</style>
