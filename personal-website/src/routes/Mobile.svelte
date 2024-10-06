<script lang="ts">
  import CyrusTile from "$lib/Tiles/CyrusTile.svelte";
  import UpennTile from "$lib/Tiles/UpennTile.svelte";
  import BackendTile from "$lib/Tiles/BackendTile.svelte";
  import DevopsTile from "$lib/Tiles/DevopsTile.svelte";
  import FrontendTile from "$lib/Tiles/FrontendTile.svelte";
  import BizzybotsTile from "$lib/Tiles/BizzybotsTile.svelte";
  import BioTile from "$lib/Tiles/BioTile.svelte";

  let innerWidth: number;

  //if the inner width is less that 500px, then we need to scale the hexes down
  $: scale = innerWidth < 500 ? innerWidth / 500 : 1;

  $: console.log(innerWidth, scale);
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-col w-full justify-start items-center">
  <div style="transform: scale({scale})">
    <CyrusTile mobileMode />
    <UpennTile mobileMode />
    <BizzybotsTile mobileMode />
    <FrontendTile mobileMode />
    <BackendTile mobileMode />
    <DevopsTile mobileMode />
    <BioTile mobileMode />
  </div>
</div>

<style>
</style>
