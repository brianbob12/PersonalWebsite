<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;

  $: operativeWord = mobileMode ? "Click" : "Hover";
</script>

<HexTile flipable backgroundColor="#e2e8f0" name="Cyrus" {mobileMode}>
  <div slot="content" class="flex flex-col items-center space-y-2 h-full">
    <div class="flex flex-row justify-center pt-40 w-[170%]">
      <div>
        <span class="font-bold text-6xl">Cyrus Singer</span>
      </div>
    </div>
    <div>
      <span class="text-2xl">Software Engineer</span>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">
        {operativeWord} on hexagon for more info
      </span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div class="flex flex-col justify-center items-center h-full space-y-4">
      <img src="/headshot.jpeg" alt="Cyrus Singer" class="rounded-full" />
      <div class="flex flex-row space-x-4">
        <FancyLink href="https://github.com/brianbob12" position="right">
          GitHub
        </FancyLink>
        <FancyLink
          href="https://www.linkedin.com/in/cyrus-singer-35b4a5221/"
          position="center"
        >
          LinkedIn
        </FancyLink>
        <FancyLink
          href="https://github.com/brianbob12/CV/blob/main/CV.pdf"
          position="left">Resume</FancyLink
        >
      </div>
      <FancyLink href="mailto:japaneserhino@gmail.com" position="center">
        japaneserhino@gmail.com
      </FancyLink>
      <FancyLink href="mailto:cysinger@seas.upenn.edu" position="center">
        cysinger@seas.upenn.edu
      </FancyLink>
    </div>
  </div>
</HexTile>
