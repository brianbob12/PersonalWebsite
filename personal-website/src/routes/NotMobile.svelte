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
    overflow-x: hidden;
    align-items: center;
    height: 100vh;
  }
  .first-row {
    margin-top: -220px;
  }
</style>
