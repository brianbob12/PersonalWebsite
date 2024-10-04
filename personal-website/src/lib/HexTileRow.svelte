<script lang="ts">
  import HexTile from "./HexTile.svelte";
  export let fillerHexCount = 1;

  $: fillerHexList = Array.from({ length: fillerHexCount }, (_, i) => i);
</script>

<div class="hex-row">
  {#each fillerHexList as hex}
    <HexTile />
  {/each}
  <slot />
  {#each fillerHexList as hex}
    <HexTile />
  {/each}
</div>

<style>
  .hex-row {
    display: flex;
    flex-direction: row;
    gap: 250px;
    margin-bottom: -220px;
  }
</style>
