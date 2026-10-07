<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;
</script>

<HexTile flippable backgroundColor="#ffffff" name="Cyrus" {mobileMode}>
  <div slot="content" class="flex flex-col items-center space-y-2 h-full">
    <div class="flex flex-row justify-center pt-40 w-[170%]">
      <span class="font-bold text-6xl">Cyrus Singer</span>
    </div>
    <span class="text-2xl">Software Engineer</span>
  </div>
  <div
    slot="hover"
    class="flex flex-col justify-center items-center h-full space-y-4"
  >
    <div class="flex flex-row space-x-4">
      <FancyLink href="https://github.com/brianbob12" position="right"
        >GitHub</FancyLink
      >
      <FancyLink
        href="https://www.linkedin.com/in/cyrus-singer-35b4a5221/"
        position="left">LinkedIn</FancyLink
      >
    </div>
    <FancyLink href="mailto:cyrus@singer.dev" position="center"
      >cyrus@singer.dev</FancyLink
    >
  </div>
</HexTile>
