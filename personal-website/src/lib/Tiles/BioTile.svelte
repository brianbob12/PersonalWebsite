<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;

  $: operativeWord = mobileMode ? "Click" : "Hover";
</script>

<HexTile flipable backgroundColor="#e2e8f0" name="Bio" {mobileMode}>
  <div slot="content" class="flex flex-col items-center space-y-4">
    <span class="font-bold text-2xl">About me</span>
    <div class="flex flex-col items-center">
      <div class="w-[120%] flex flex-col items-center justify-center">
        <p>Hi there! I'm Cyrus, a software engineer</p>
      </div>
      <div class="w-[130%] flex flex-col items-center justify-center">
        <p>from London, UK. Ever since I wrote my first</p>
      </div>
      <div class="w-[140%] flex flex-col items-center justify-center pl-2">
        <p>
          program, I've loved coding; it's a fun puzzle where the solution has
          real-world impact.
        </p>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-[160%] flex flex-col items-center">
        <p>I'm particularly passionate about type safety and the</p>
      </div>
      <div class="w-[170%] flex flex-col items-center">
        <p>
          TypeScript ecosystem. I love exploring how these tools can help us
          build more reliable and maintainable software.
        </p>
      </div>
      <div class="w-[170%] flex flex-col items-center">
        <p>
          To me, coding isn't just about finishing a feature, but building the
          infrastructure for many features to come.
        </p>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-[160%] flex flex-col items-center">
        <p>My favorite class at university was Computer Security.</p>
      </div>
      <div class="w-[150%] flex flex-col items-center pl-2">
        <p>
          Since then, I've been fascinated by the evolving landscape of
          cybersecurity, keeping up with newly
        </p>
      </div>
      <div class="w-[130%] flex flex-col items-center pl-6">
        <p>
          discovered vulnerabilities and staying current on modern security
          standards.
        </p>
      </div>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">
        {operativeWord} on hexagon for projects
      </span>
    </div>
  </div>
  <div slot="hover" class="flex flex-col items-center space-y-4">
    <div class="flex flex-row justify-center pt-8 w-[200%]">
      <span class="font-bold text-2xl">Projects I'm proud of</span>
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
