<script lang="ts">
  import Mobile from "./Mobile.svelte";
  import NotMobile from "./NotMobile.svelte";

  let innerWidth = $state(0);

  const mobileThreshold = 1200;

  let isMobile = $derived(innerWidth < mobileThreshold);
</script>

<svelte:window bind:innerWidth />

<svelte:head>
  <title>Cyrus Singer</title>
  <meta
    name="description"
    content="Cyrus Singer — software engineer. Ciridae and contact information."
  />
</svelte:head>

{#if isMobile}
  <Mobile />
{:else}
  <NotMobile />
{/if}
