<script lang="ts">
  import HexTile from "./HexTile.svelte";
  interface Props {
    fillerHexCount?: number;
    children?: import("svelte").Snippet;
  }

  let { fillerHexCount = 1, children }: Props = $props();

  let fillerHexList = $derived(
    Array.from({ length: fillerHexCount }, (_, i) => i),
  );
</script>

<div class="hex-row">
  {#each fillerHexList as hex}
    <HexTile />
  {/each}
  {@render children?.()}
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
