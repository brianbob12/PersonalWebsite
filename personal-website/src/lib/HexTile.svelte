<script lang="ts">
  import posthog from "posthog-js";
  import HexShape from "./HexShape.svelte";

  export let flippable = false;
  export let name = "Empty";
  export let mobileMode = false;
  export let backgroundColor = "#000000";

  let isFlipped = false;
  $: borderColor = flippable ? "#000000" : "#ffffff";

  function handleMouseEnter() {
    if (!flippable || mobileMode) return;
    posthog.capture("flipTile", { name });
    isFlipped = true;
  }

  function handleMouseLeave() {
    if (!mobileMode) isFlipped = false;
  }

  function toggleFlipped(event: MouseEvent | KeyboardEvent) {
    // Links on the back should navigate without triggering another flip.
    if (
      !flippable ||
      (event.target instanceof Element && event.target.closest("a"))
    )
      return;
    if (event instanceof KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
    }
    posthog.capture("flipTile", { name });
    isFlipped = !isFlipped;
  }

  function delay(_node: HTMLElement, { appearing }: { appearing: boolean }) {
    return { duration: 250, css: () => `opacity: ${appearing ? 0 : 1}` };
  }
</script>

{#if flippable}
  <div
    class="hex-container"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:click={toggleFlipped}
    on:keydown={toggleFlipped}
    role="button"
    tabindex="0"
    aria-label={`${name} details`}
    aria-pressed={isFlipped}
    style:z-index={isFlipped ? 20 : 10}
  >
    <HexShape {backgroundColor} {borderColor} {isFlipped}>
      {#if isFlipped}
        <div
          class="hex-content"
          in:delay={{ appearing: true }}
          out:delay={{ appearing: false }}
          style="transform: rotateX(180deg) {mobileMode ? 'scale(0.8)' : ''}"
        >
          <slot name="hover" />
        </div>
      {:else}
        <div
          class="hex-content"
          in:delay={{ appearing: true }}
          out:delay={{ appearing: false }}
          style="transform: rotateX(0deg) {mobileMode ? 'scale(0.8)' : ''}"
        >
          <slot name="content" />
        </div>
      {/if}
    </HexShape>
  </div>
{:else}
  <HexShape {backgroundColor} {borderColor} />
{/if}

<style>
  .hex-container {
    transition: transform 0.3s ease;
  }
  .hex-content {
    height: 100%;
    padding-block: 0.5rem;
  }
</style>
