<script lang="ts">
  import HexTile from "#lib/HexTile.svelte";
  import CyrusTile from "#lib/Tiles/CyrusTile.svelte";
  import HexTileRow from "#lib/HexTileRow.svelte";
  import CiridaeTile from "#lib/Tiles/CiridaeTile.svelte";
</script>

<div class="all-hexes-container">
  <div class="first-row">
    <HexTileRow>
      <HexTile />
      <HexTile />
    </HexTileRow>
  </div>
  <HexTileRow>
    <CyrusTile />
  </HexTileRow>
  <HexTileRow>
    <HexTile />
    <HexTile />
  </HexTileRow>
  <HexTileRow>
    <CiridaeTile />
  </HexTileRow>
  <HexTileRow>
    <HexTile />
    <HexTile />
  </HexTileRow>
  <HexTileRow>
    <HexTile />
  </HexTileRow>
  <HexTileRow>
    <HexTile />
    <HexTile />
  </HexTileRow>
  <HexTileRow>
    <HexTile />
  </HexTileRow>
</div>

<style>
  .all-hexes-container {
    display: flex;
    flex-direction: column;
    /* Trim the decorative pattern without creating an inner scroll container. */
    overflow: clip;
    align-items: center;
    height: 100vh;
    height: 100dvh;
  }
  .first-row {
    margin-top: -220px;
  }
</style>
