<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;
</script>

<!-- Official logo paths and wordmark sourced from https://ciridae.com/. -->
<HexTile flippable backgroundColor="#ffffff" name="Ciridae" {mobileMode}>
  <div slot="content" class="brand">
    <img
      class="logo"
      src="/ciridae-logo.svg"
      alt="Ciridae logo"
      width="220"
      height="169"
    />
    <img
      class="wordmark"
      src="/ciridae-wordmark-white.png"
      alt="Ciridae"
      width="638"
      height="90"
    />
  </div>
  <div
    slot="hover"
    class="flex flex-col justify-center items-center h-full space-y-4"
  >
    <span class="text-2xl">Platform</span>
    <img
      class="wordmark"
      src="/ciridae-wordmark-white.png"
      alt="Ciridae"
      width="638"
      height="90"
    />
    <FancyLink href="https://ciridae.com/" position="center"
      >ciridae.com</FancyLink
    >
  </div>
</HexTile>

<style>
  .brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 24px;
  }
  .logo {
    width: 220px;
    height: auto;
  }
  .wordmark {
    width: 220px;
    height: auto;
    filter: invert(1);
  }
</style>
