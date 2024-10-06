<script lang="ts">
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;
</script>

<HexTile flipable backgroundColor="#e2e8f0" name="Upenn" {mobileMode}>
  <div slot="content" class="flex flex-col items-center space-y-2">
    <div class="flex flex-row justify-center pt-32 w-[200%]">
      <div>
        <img
          src="/PennLogo.png"
          class="h-32"
          alt="University of Pennsylvania"
        />
      </div>
    </div>
    <div class="w-[200%] flex flex-row justify-center">
      <span class="text-xl">B.S.E. in Computer Science</span>
    </div>
    <div>
      <span class="text-xl text-gray-500">2022 - 2025</span>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">Hover on hexagon for more info</span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div
      class="flex flex-col justify-start items-center h-full space-y-4 pt-12"
    >
      <span class="text-xl underline">My Favorite Classes:</span>
      <div class="w-[150%] flex flex-row justify-center">
        <ul class="list-disc favorite-classes pl-8">
          <li>Computer Security</li>
          <li>Computer Architecture</li>
          <li>Advanced Programming (in Haskell)</li>
          <li>Internet and Web Systems</li>
          <li>Design of Mechatronic Systems</li>
          <li>Linear Algebra and Optimization</li>
          <li>Mechanical Properties of Macro and Nano Scale Materials</li>
          <li>Introduction to Quantum Mechanics</li>
        </ul>
      </div>
    </div>
  </div></HexTile
>

<style>
  .favorite-classes li {
    font-family: monospace;
    font-size: 1rem;
  }
</style>
