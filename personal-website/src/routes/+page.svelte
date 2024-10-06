<script lang="ts">
  import Mobile from "./Mobile.svelte";
  import NotMobile from "./NotMobile.svelte";

  let innerWidth: number;

  const mobileThreshold = 1200;

  $: isMobile = innerWidth < mobileThreshold;
</script>

<svelte:window bind:innerWidth />

{#if isMobile}
  <Mobile />
{:else}
  <NotMobile />
{/if}
