<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;
</script>

<HexTile backgroundColor="#d6d3d1" name="Best Projects" {mobileMode}>
  <div slot="content" class="flex flex-col items-center space-y-4">
    <div class="flex flex-row justify-center pt-4 w-[200%]">
      <span class="font-bold text-2xl">Projects I'm proud of</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[120%] space-x-2">
      <span>Running the Philadelphia Marathon 2024</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[140%] space-x-2">
      <span>Bird flock simulation to sort a list</span>
      <FancyLink href="https://github.com/brianbob12/BoidSort" position="right"
        >GitHub</FancyLink
      >
      <FancyLink href="https://www.instagram.com/p/C1K20_4AQyc/" position="left"
        >Video</FancyLink
      >
    </div>
    <div class="flex flex-row justify-center items-center w-[160%] space-x-2">
      <span> Gradient based simulation of 2D brittle lattices </span>
      <FancyLink href="https://github.com/brianbob12/Shatter2" position="right">
        GitHub
      </FancyLink>
      <FancyLink
        href="https://www.instagram.com/p/CewtDvVA7Ph/"
        position="left"
      >
        Video
      </FancyLink>
    </div>
    <div class="flex flex-row justify-center items-center w-[160%] space-x-2">
      <span>
        Creating a scalable, secure, pipeline from Quickbooks to a time series
        tree structure (stored in a Postgres DB) during my internship at CFO4ALL
      </span>
    </div>
    <div class="flex flex-row justify-center items-center w-[135%] space-x-2">
      <span>
        Building a distributed, web crawler and search engine from scratch and
        searching over 100,000 pages
      </span>
    </div>
  </div>
</HexTile>
