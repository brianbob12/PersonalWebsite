<script lang="ts">
  import posthog from "posthog-js";
  import HexShape from "./HexShape.svelte";
  import HexFaces from "./HexFaces.svelte";

  interface Props {
    flippable?: boolean;
    name?: string;
    mobileMode?: boolean;
    backgroundColor?: string;
    content?: import("svelte").Snippet;
    hover?: import("svelte").Snippet;
  }

  let {
    flippable = false,
    name = "Empty",
    mobileMode = false,
    backgroundColor = "#000000",
    content,
    hover,
  }: Props = $props();

  let isFlipped = $state(false);
  let borderColor = $derived(flippable ? "#000000" : "#ffffff");

  function setFlipped(value: boolean) {
    if (isFlipped === value) return;
    isFlipped = value;
    if (value) posthog.capture("flipTile", { name });
  }

  function handlePointer(event: PointerEvent) {
    if (!mobileMode && event.pointerType === "mouse") {
      setFlipped(event.type === "pointerenter");
    }
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
    } else if (
      !mobileMode &&
      event.detail > 0 &&
      (!("pointerType" in event) || event.pointerType === "mouse")
    ) {
      // Desktop mouse input is controlled by hover, not also by clicks.
      return;
    }
    setFlipped(!isFlipped);
  }
</script>

{#if flippable}
  <div
    class="hex-container"
    onpointerenter={handlePointer}
    onpointerleave={handlePointer}
    onclick={toggleFlipped}
    onkeydown={toggleFlipped}
    role="button"
    tabindex="0"
    aria-label={`${name} details`}
    aria-pressed={isFlipped}
  >
    <HexFaces {backgroundColor} {borderColor} {isFlipped} {mobileMode}>
      {#snippet front()}
        {@render content?.()}
      {/snippet}
      {#snippet back()}
        {@render hover?.()}
      {/snippet}
    </HexFaces>
  </div>
{:else}
  <HexShape {backgroundColor} {borderColor} />
{/if}

<style>
  .hex-container {
    position: relative;
    z-index: 10;
    /* Keep the pointer target still while the faces rotate inside it. */
    clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  }
</style>
